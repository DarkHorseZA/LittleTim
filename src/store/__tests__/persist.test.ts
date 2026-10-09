import {
  persist,
  retryUnsaved,
  hasUnsaved,
  subscribeUnsaved,
  __setPersistStorage,
} from '../persist';

const tick = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

afterEach(async () => {
  // Drain any parked write so state doesn't leak between tests.
  __setPersistStorage({ setItem: async () => {} });
  await retryUnsaved();
});

describe('persist', () => {
  it('writes once on success and parks nothing', async () => {
    const setItem = jest.fn().mockResolvedValue(undefined);
    __setPersistStorage({ setItem });
    persist('k', () => 'v1');
    await tick(10);
    expect(setItem).toHaveBeenCalledTimes(1);
    expect(setItem).toHaveBeenCalledWith('k', 'v1');
    expect(hasUnsaved()).toBe(false);
  });

  it('retries, then parks as unsaved, and notifies listeners', async () => {
    const setItem = jest.fn().mockRejectedValue(new Error('storage full'));
    __setPersistStorage({ setItem });
    const seen: boolean[] = [];
    const unsub = subscribeUnsaved(() => seen.push(hasUnsaved()));

    persist('k', () => 'v1');
    await tick(1700); // past both retries (0 + 500 + 1000)

    expect(setItem).toHaveBeenCalledTimes(3); // immediate + 2 retries
    expect(hasUnsaved()).toBe(true);
    expect(seen).toContain(true);
    unsub();
  });

  it('a retry writes the newest value, never an older one', async () => {
    let value = 'old';
    const setItem = jest.fn().mockRejectedValue(new Error('full'));
    __setPersistStorage({ setItem });

    persist('k', () => value);
    await tick(1700);
    expect(hasUnsaved()).toBe(true);

    // The reader edited again while it was unsaved.
    value = 'new';
    __setPersistStorage({ setItem: jest.fn().mockImplementation(async (_k, v) => {
      expect(v).toBe('new'); // never 'old'
    }) });
    await retryUnsaved();
    expect(hasUnsaved()).toBe(false);
  });
});
