/**
 * Turns a caught error into a short, shareable problem report, and sends it only
 * when the reader chooses to. It never includes any of the reader's own data —
 * only what broke, where, and on what.
 */
import { Linking, Platform, Share } from 'react-native';
import { APP_NAME, APP_VERSION, SUPPORT_EMAIL } from '../config';

export type ReportContext = { path?: string };

// Collapse absolute bundle paths down to `file:line:col` so the report is
// readable and carries no local filesystem detail. Keeps the first `max` frames.
export function shortenStack(stack: string | undefined, max = 24): string {
  if (!stack) return '';
  return stack
    .split('\n')
    .slice(0, max)
    .map((line) =>
      line
        // http(s) bundle urls -> trailing file:line:col
        .replace(/https?:\/\/\S*?([^/\\?#]+:\d+:\d+)/g, '$1')
        // absolute file paths -> trailing file:line:col
        .replace(/\/\S*?([^/\\]+:\d+:\d+)/g, '$1')
    )
    .join('\n')
    .trim();
}

function deviceModel(): string {
  const c = (Platform.constants ?? {}) as Record<string, unknown>;
  return String(c.Model ?? c.systemName ?? '').trim();
}

export function buildErrorReport(error: unknown, ctx: ReportContext = {}): string {
  const err =
    error instanceof Error ? error : new Error(typeof error === 'string' ? error : 'Unknown error');
  const model = deviceModel();
  const lines = [
    `${APP_NAME} ${APP_VERSION || '(dev)'}`,
    `When: ${new Date().toISOString()}`,
    `Platform: ${Platform.OS} ${String(Platform.Version)}${model ? ` · ${model}` : ''}`,
    ctx.path ? `Screen: ${ctx.path}` : '',
    '',
    `${err.name}: ${err.message}`,
    '',
    shortenStack(err.stack),
  ];
  return lines.filter((l) => l !== '' || true).join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

// Best-effort: a pre-filled email, falling back to the share sheet. Nothing
// leaves the phone unless the reader taps send/share.
export async function sendErrorReport(error: unknown, ctx: ReportContext = {}): Promise<void> {
  const body = buildErrorReport(error, ctx);
  const subject = `${APP_NAME} problem report`;
  const mailto = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  try {
    if (await Linking.canOpenURL(mailto)) {
      await Linking.openURL(mailto);
      return;
    }
  } catch {
    // fall through to share
  }
  try {
    await Share.share({ message: `${subject}\n\n${body}` });
  } catch {
    // give up silently; this is itself an error path
  }
}
