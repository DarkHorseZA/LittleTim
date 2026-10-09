/**
 * Errors outside rendering (taps, timers, async) would otherwise close a release
 * build with no explanation. In production we install a global handler that
 * shows the same calm ErrorScreen in a Modal instead of crashing, and passes
 * non-fatal errors through to the previous handler. In development we leave
 * React Native's red box alone, so real bugs stay loud.
 *
 * Renders nothing until something goes wrong.
 */
import React, { useEffect, useState } from 'react';
import { Modal } from 'react-native';
import { ErrorScreen } from './ErrorScreen';

type GlobalHandler = (error: unknown, isFatal?: boolean) => void;
// ErrorUtils is a React Native global; it isn't in the public TS types.
const EU: {
  getGlobalHandler?: () => GlobalHandler;
  setGlobalHandler?: (h: GlobalHandler) => void;
} | undefined = (globalThis as unknown as { ErrorUtils?: typeof EU }).ErrorUtils;

export function FatalErrorHandler() {
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (__DEV__ || !EU?.setGlobalHandler) return;
    const previous = EU.getGlobalHandler?.();
    EU.setGlobalHandler((err, isFatal) => {
      if (isFatal) {
        setError(err instanceof Error ? err : new Error(String(err)));
      } else {
        previous?.(err, isFatal);
      }
    });
    return () => {
      if (previous) EU.setGlobalHandler?.(previous);
    };
  }, []);

  return (
    <Modal visible={!!error} animationType="fade" onRequestClose={() => setError(null)}>
      {error ? <ErrorScreen error={error} onRetry={() => setError(null)} /> : null}
    </Modal>
  );
}
