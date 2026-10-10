import { buildCells } from '../PatchworkQuilt';
import type { QuiltEntry, QuiltEntryType } from '../../types';

const TYPES: QuiltEntryType[] = ['ritual', 'msg', 'see', 'journal', 'belief', 'when'];

// One entry per day going back `days` from today, cycling through types so the
// grid spans the full range (the worst case for cell count).
function makeEntries(days: number): QuiltEntry[] {
  const out: QuiltEntry[] = [];
  const start = new Date();
  start.setDate(start.getDate() - days);
  for (let i = 0; i < days; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
      d.getDate()
    ).padStart(2, '0')}`;
    out.push({ date: key, type: TYPES[i % TYPES.length] });
  }
  return out;
}

describe('quilt grid scale', () => {
  it('builds a 5k-day quilt grid well under 50ms', () => {
    const entries = makeEntries(5000);

    const t0 = performance.now();
    const cells = buildCells(entries, 'full');
    const ms = performance.now() - t0;

    // The grid spans from the earliest entry's week to this week, so it has at
    // least as many cells as there are days of history.
    expect(cells.length).toBeGreaterThanOrEqual(5000);
    // Heavy compute stays snappy even with years of history.
    expect(ms).toBeLessThan(50);
  });

  it('groups entries onto the right day', () => {
    const entries: QuiltEntry[] = [
      { date: '2026-01-01', type: 'ritual' },
      { date: '2026-01-01', type: 'journal' },
    ];
    const cells = buildCells(entries, 'full');
    const jan1 = cells.find((c) => c.date === '2026-01-01');
    expect(jan1?.dayEntries).toHaveLength(2);
  });
});
