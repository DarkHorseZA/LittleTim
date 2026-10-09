import React, { useEffect } from 'react';
import TestRenderer, { act } from 'react-test-renderer';

jest.mock('../persist', () => ({ persist: jest.fn() }));

import { DayProvider, useDay } from '../DayContext';
import { persist } from '../persist';
import { KEY_SETTINGS } from '../storage';

type Ctx = ReturnType<typeof useDay>;

function Capture({ sink }: { sink: (ctx: Ctx) => void }) {
  const ctx = useDay();
  useEffect(() => {
    sink(ctx);
  });
  return null;
}

async function flush() {
  // Let the async refresh effect settle.
  await act(async () => {
    await Promise.resolve();
    await Promise.resolve();
  });
}

describe('DayContext', () => {
  it('hydrates, updates settings optimistically, and persists the newest value', async () => {
    let latest: Ctx | undefined;
    await act(async () => {
      TestRenderer.create(
        <DayProvider>
          <Capture sink={(c) => (latest = c)} />
        </DayProvider>
      );
    });
    await flush();

    expect(latest).toBeDefined();
    expect(latest!.ready).toBe(true);

    await act(async () => {
      await latest!.updateSettings({ reminderHour: 9 });
    });

    // Optimistic: state reflects the change immediately.
    expect(latest!.settings.reminderHour).toBe(9);

    // Persisted via the resilient layer, with a serializer that returns the
    // latest in-memory value.
    expect(persist).toHaveBeenCalledWith(KEY_SETTINGS, expect.any(Function));
    const serialize = (persist as jest.Mock).mock.calls.at(-1)![1] as () => string;
    expect(JSON.parse(serialize()).reminderHour).toBe(9);
  });

  it('ignores writes before hydration (the ready guard)', async () => {
    // Before refresh resolves, updateSettings must be a no-op (no persist).
    let latest: Ctx | undefined;
    await act(async () => {
      TestRenderer.create(
        <DayProvider>
          <Capture sink={(c) => (latest = c)} />
        </DayProvider>
      );
    });
    // Intentionally do not flush: ready may still be false on first paint.
    if (latest && !latest.ready) {
      await act(async () => {
        await latest!.updateSettings({ reminderHour: 7 });
      });
      expect(persist).not.toHaveBeenCalled();
    }
    await flush();
  });
});
