import React from 'react';
import * as Sentry from '@sentry/react';

const FallbackComponent = () => (
  <div className="error-fallback">
    Desculpe, algo deu errado.
  </div>
);

interface ErrorBoundaryState {
  hasError: boolean;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    Sentry.captureException(error);
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <FallbackComponent />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 