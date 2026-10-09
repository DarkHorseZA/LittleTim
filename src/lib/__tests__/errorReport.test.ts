import { shortenStack, buildErrorReport } from '../errorReport';

describe('shortenStack', () => {
  it('returns empty for no stack', () => {
    expect(shortenStack(undefined)).toBe('');
  });

  it('collapses bundle urls to file:line:col', () => {
    const stack =
      'Error: boom\n' +
      '    at foo (http://10.0.0.1:8081/index.bundle?platform=ios:1234:9)\n' +
      '    at bar (/Users/someone/app/node_modules/react/index.js:42:3)';
    const out = shortenStack(stack);
    expect(out).toContain('1234:9');
    expect(out).toContain('index.js:42:3');
    expect(out).not.toContain('/Users/someone');
  });

  it('keeps at most `max` frames', () => {
    const stack = Array.from({ length: 50 }, (_, i) => `    at f${i} (a.js:${i}:1)`).join('\n');
    expect(shortenStack(stack, 5).split('\n').length).toBe(5);
  });
});

describe('buildErrorReport', () => {
  it('includes app, platform and the error message, never throwing on junk', () => {
    const r = buildErrorReport(new Error('kaboom'));
    expect(r).toMatch(/re-Genesis/);
    expect(r).toMatch(/Platform:/);
    expect(r).toMatch(/kaboom/);
  });

  it('handles non-Error input', () => {
    expect(buildErrorReport('just a string')).toMatch(/just a string/);
    expect(() => buildErrorReport(null)).not.toThrow();
  });

  it('includes the screen path when given', () => {
    expect(buildErrorReport(new Error('x'), { path: 'Tracker' })).toMatch(/Screen: Tracker/);
  });
});
