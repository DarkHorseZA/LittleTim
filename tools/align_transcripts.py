#!/usr/bin/env python3
"""Generate src/data/meditationTranscripts.ts (timed phrase-level transcripts +
section markers) for the MSG meditations.

Pipeline (run once when recordings change):
  1. For each msg-*.mp3 in assets/audio/meditations/, produce word-level
     timestamps with whisper.cpp into /tmp/regen_full/<id>.json:
         ffmpeg -y -i <id>.mp3 -ar 16000 -ac 1 /tmp/regen_full/<id>.wav
         whisper-cli -m <model> -f /tmp/regen_full/<id>.wav -ml 1 -sow -oj \
             -of /tmp/regen_full/<id>
  2. Run this script. It reads the exact on-screen step text from practices.ts,
     chunks it into phrases, aligns each phrase to the whisper word stream with a
     global sequence alignment (extra spoken words become gaps), anchors section
     markers on each step's most distinctive word, and writes the TS file.

Update DURATIONS below if the recordings change length.
"""
import os
import json, re, sys, difflib

IDS = ['msg-intro','msg-ch1','msg-ch2','msg-ch3','msg-ch4','msg-ch5',
       'msg-ch6','msg-ch7','msg-ch8','msg-ch9']

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PRACTICES = os.path.join(REPO, 'src', 'data', 'practices.ts')

DURATIONS = {
    'msg-intro': 194, 'msg-ch1': 314, 'msg-ch2': 264, 'msg-ch3': 218,
    'msg-ch4': 280, 'msg-ch5': 290, 'msg-ch6': 272, 'msg-ch7': 292,
    'msg-ch8': 378, 'msg-ch9': 322,
}

# Manual section-marker corrections (seconds), keyed by (id, stepIndex). The
# auto-aligner occasionally snaps a step marker onto a repeated/similar phrase
# from a neighbouring section; these pin it to where the step is actually spoken.
# Applied before the segment-window filter so mis-snapped segments are dropped.
MARKER_OVERRIDES = {
    ('msg-ch7', 1): 100.4,  # "whisper, let there be" (was on step 0's "let whatever is there")
    ('msg-ch9', 2): 81.3,   # "hands to your belly" (was late, on "Earth is my mother")
    ('msg-ch6', 3): 149.2,  # "move your hands to your face" (was late, on "I am blessed")
}

# ---- 1. parse exact step strings for each msg id from practices.ts ----
src = open(PRACTICES, encoding='utf-8').read()

def parse_steps():
    out = {}
    for mid in IDS:
        # find the object: id: 'mid' ... steps: [ ... ],
        i = src.find(f"id: '{mid}'")
        if i < 0:
            raise SystemExit(f"id {mid} not found")
        s = src.find('steps: [', i)
        # find matching closing bracket for this array
        j = src.find(']', s)
        block = src[s+len('steps: ['):j]
        # step strings are single-quoted; content uses curly quotes so ' is safe
        steps = re.findall(r"'((?:[^'\\]|\\.)*)'", block)
        # unescape \n etc minimally (none expected) and \' if any
        steps = [st.replace("\\'", "'") for st in steps]
        out[mid] = steps
    return out

STEPS = parse_steps()

# ---- 2. normalization for matching ----
def norm(w):
    w = w.lower()
    w = w.replace('’',"'").replace('‘',"'")
    w = w.replace('“','').replace('”','')
    w = re.sub(r"[^a-z0-9']", '', w)
    w = w.replace("'", '')
    return w

def words_of(text):
    # returns list of (original_token, normalized) preserving order
    toks = re.findall(r"\S+", text)
    res = []
    for t in toks:
        n = norm(t)
        res.append((t, n))
    return res

# ---- 3. load whisper words ----
def whisper_words(mid):
    d = json.load(open(f'/tmp/regen_full/{mid}.json', encoding='utf-8'))
    W = []
    for e in d['transcription']:
        txt = e['text'].strip()
        if not txt:
            continue
        n = norm(txt)
        if not n:
            continue
        W.append((n, e['offsets']['from']/1000.0, e['offsets']['to']/1000.0))
    return W

# ---- 4. phrase chunking of a step ----
def chunk_phrases(step):
    # split into fragments at punctuation, keep original slices
    # we walk char by char grouping words; break on . , : ; ! ?
    phrases = []
    cur = []
    def flush():
        if cur:
            phrases.append(' '.join(cur))
            cur.clear()
    tokens = re.findall(r"\S+", step)
    for tok in tokens:
        cur.append(tok)
        # break after token ending in sentence/clause punctuation
        if re.search(r'[.,:;!?]["”’‘“]?$', tok):
            flush()
        elif len(cur) >= 6:
            flush()
    flush()
    # drop phrases with no alpha
    phrases = [p for p in phrases if re.search(r'[A-Za-z]', p)]
    return phrases

# ---- 5. align ----
def fuzzy_eq(a, b):
    if not a or not b:
        return False
    if a == b:
        return True
    if a.startswith(b) or b.startswith(a):
        if min(len(a),len(b)) >= 3:
            return True
    return difflib.SequenceMatcher(None, a, b).ratio() >= 0.8

def interp_missing(times, dur):
    # times: list of [start,end] or None per phrase, in order. Fill None by
    # linear interpolation between known anchors (and 0 / dur at the ends).
    n = len(times)
    anchors = [(i, times[i]) for i in range(n) if times[i] is not None]
    if not anchors:
        return [[round(i*dur/max(n,1),2), round((i+1)*dur/max(n,1),2)] for i in range(n)]
    # virtual end anchors
    pre = [(-1, [0.0, 0.0])]
    post = [(n, [dur, dur])]
    full = pre + anchors + post
    out = [None]*n
    for i in range(n):
        if times[i] is not None:
            out[i] = [round(times[i][0],2), round(times[i][1],2)]
            continue
        left = max(a for a in full if a[0] <= i)
        right = min(a for a in full if a[0] > i)
        frac = (i - left[0]) / (right[0] - left[0])
        s = left[1][0] + frac * (right[1][0] - left[1][0])
        out[i] = [round(s,2), round(s+0.6,2)]
    # enforce non-decreasing starts
    for i in range(1, n):
        if out[i][0] < out[i-1][0]:
            out[i][0] = out[i-1][0]
        if out[i][1] < out[i][0]:
            out[i][1] = round(out[i][0]+0.4,2)
    return out

STOP = set((
    'the a an your you yours and of to i in on it its be is am are was as at '
    'with for from up out then back into me my we us so no not this that here '
    'now there if or but when one a'
).split())

def align(mid):
    from collections import Counter
    W = whisper_words(mid)
    dur = DURATIONS[mid]
    audio_norm = [w[0] for w in W]

    # build phrase list + flat text-word stream tagged by phrase index
    phrases = []   # (text, stepIndex)
    text_norm = []
    text_owner = []  # phrase index per text word
    step_words = []  # normalized words per step (for distinctive-word markers)
    for pidx, step in enumerate(STEPS[mid]):
        sw = []
        for phrase in chunk_phrases(step):
            pwords = [n for (_o, n) in words_of(phrase) if n]
            if not pwords:
                continue
            ph_index = len(phrases)
            phrases.append((phrase, pidx))
            for n in pwords:
                text_norm.append(n)
                text_owner.append(ph_index)
                sw.append(n)
        step_words.append(sw)

    # global in-order alignment text <-> audio (matched audio index per text word)
    sm = difflib.SequenceMatcher(None, text_norm, audio_norm, autojunk=False)
    text_aj = [None]*len(text_norm)
    for tag, i1, i2, j1, j2 in sm.get_opcodes():
        if tag == 'equal':
            for k in range(i2 - i1):
                text_aj[i1 + k] = j1 + k

    ph_aj = {}
    for ti, aj in enumerate(text_aj):
        if aj is None:
            continue
        ph_aj.setdefault(text_owner[ti], []).append(aj)

    # raw segments with monotonic cursor; drop unmatched phrases; clamp spans
    raw = []
    ac = 0
    for ph_index, (phrase, pidx) in enumerate(phrases):
        ajs = [a for a in ph_aj.get(ph_index, []) if a >= ac]
        if not ajs:
            continue  # genuinely not spoken on screen -> no segment (highlight stays put)
        first_aj, last_aj = ajs[0], ajs[-1]
        start, end = W[first_aj][1], W[last_aj][2]
        nwords = len([w for w in phrase.split() if re.search(r'[A-Za-z]', w)])
        if end - start > 3.0 + 1.0 * nwords:
            start = W[last_aj][1]   # implausible span -> anchor on trailing word
            end = W[last_aj][2]
        if end <= start:
            end = start + 0.4
        raw.append({'text': phrase, 'start': round(start, 2),
                    'end': round(end, 2), 'pageIndex': pidx})
        ac = last_aj + 1

    seg_first_start = {}
    for s in raw:
        seg_first_start.setdefault(s['pageIndex'], s['start'])

    # section markers: prefer first matched-segment start; for steps with no
    # matched segment (abbreviated text like "Repeat with guilt"), anchor on the
    # step's most distinctive on-screen word located forward in the audio.
    freq = Counter(w for sw in step_words for w in sw)
    markers = [None]*len(STEPS[mid])
    markers[0] = 0.0
    a_cursor = 0
    for pidx in range(1, len(STEPS[mid])):
        cand_seg = seg_first_start.get(pidx)
        # distinctive-word anchor (disambiguates repeated phrases across sections)
        cands = sorted({w for w in step_words[pidx] if w not in STOP and len(w) >= 3},
                       key=lambda w: (freq[w], -len(w)))
        cand_dist = None
        for c in cands:
            for j in range(a_cursor, len(W)):
                if audio_norm[j] == c:
                    cand_dist = W[j][1]
                    break
            if cand_dist is not None:
                break
        # choose: a matched-segment start only if it's consistent (>= previous
        # marker and not wildly before the distinctive anchor); else distinctive.
        prev = max((m for m in markers[:pidx] if m is not None), default=0.0)
        chosen = None
        if cand_seg is not None and cand_seg >= prev - 1 and (
                cand_dist is None or cand_seg <= cand_dist + 2):
            chosen = cand_seg
        elif cand_dist is not None:
            chosen = cand_dist
        elif cand_seg is not None and cand_seg >= prev - 1:
            chosen = cand_seg
        markers[pidx] = chosen
        if chosen is not None:
            while a_cursor < len(W) and W[a_cursor][1] < chosen:
                a_cursor += 1

    # interpolate any remaining None markers, enforce monotonic
    n = len(markers)
    full = [(-1, 0.0)] + [(i, markers[i]) for i in range(n) if markers[i] is not None] + [(n, dur)]
    for i in range(n):
        if markers[i] is None:
            left = max(a for a in full if a[0] <= i)
            right = min(a for a in full if a[0] > i)
            frac = (i - left[0]) / (right[0] - left[0])
            markers[i] = left[1] + frac * (right[1] - left[1])
    for i in range(1, n):
        if markers[i] < markers[i-1]:
            markers[i] = markers[i-1]
    markers = [round(m, 2) for m in markers]

    # apply manual corrections, then re-enforce ascending order
    for (omid, ostep), otime in MARKER_OVERRIDES.items():
        if omid == mid and 0 <= ostep < len(markers):
            markers[ostep] = otime
    for i in range(1, len(markers)):
        if markers[i] < markers[i - 1]:
            markers[i] = markers[i - 1]

    # drop segments that fall in the wrong section (a repeated phrase that
    # matched an occurrence outside its own step's time window)
    segs = []
    for s in raw:
        pidx = s['pageIndex']
        lo = markers[pidx] - 4
        hi = (markers[pidx + 1] if pidx + 1 < n else dur) + 4
        if lo <= s['start'] <= hi:
            segs.append(s)
    return segs, markers

# ---- 6. emit TS ----
def ts_str(s):
    # keep original characters, escape backslash and single quote
    s = s.replace('\\','\\\\').replace("'","\\'")
    return s

out = []
out.append("// AUTO-GENERATED by tools/align (whisper word timestamps aligned to")
out.append("// the on-screen step text). Phrase-level segments; extra spoken words")
out.append("// in the recordings are intentionally left uncovered. Regenerate rather")
out.append("// than hand-editing. Times in seconds.")
out.append("import { TranscriptSegment } from '../types';")
out.append("")
out.append("export const msgTranscripts: Record<string, TranscriptSegment[]> = {")
markers_all = {}
for mid in IDS:
    segs, markers = align(mid)
    markers_all[mid] = markers
    out.append(f"  '{mid}': [")
    for s in segs:
        out.append(f"    {{ text: '{ts_str(s['text'])}', start: {s['start']}, end: {s['end']}, pageIndex: {s['pageIndex']} }},")
    out.append("  ],")
out.append("};")
out.append("")
out.append("export const msgPageMarkers: Record<string, number[]> = {")
for mid in IDS:
    m = markers_all[mid]
    out.append(f"  '{mid}': [{', '.join(str(x) for x in m)}],")
out.append("};")
out.append("")

open(os.path.join(REPO, 'src', 'data', 'meditationTranscripts.ts'),'w',encoding='utf-8').write('\n'.join(out))

# diagnostics
for mid in IDS:
    segs, markers = align(mid)
    nsteps = len(STEPS[mid])
    cov = len(segs)
    last_end = max((s['end'] for s in segs), default=0)
    print(f"{mid}: steps={nsteps} segs={cov} markers={markers} lastEnd={last_end}")
