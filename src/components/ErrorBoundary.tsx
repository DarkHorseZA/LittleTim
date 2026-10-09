/**
 * Catches render errors anywhere below it and shows the calm ErrorScreen in
 * place, so one broken screen never takes the whole app down. "Try again"
 * re-mounts the subtree.
 */
import React from 'react';
import { ErrorScreen } from './ErrorScreen';

type Props = { children: React.ReactNode };
type State = { error: Error | null };

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    if (__DEV__) {
      // Keep the full detail in the dev console; production users get the report.
      console.error('ErrorBoundary caught:', error, info.componentStack);
    }
  }

  reset = () => this.setState({ error: null });

  render() {
    if (this.state.error) {
      return <ErrorScreen error={this.state.error} onRetry={this.reset} />;
    }
    return this.props.children;
  }
}
