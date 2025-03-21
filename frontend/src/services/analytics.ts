import * as Sentry from '@sentry/react';
import { browserTracingIntegration } from '@sentry/browser';

export const initializeAnalytics = () => {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [browserTracingIntegration()],
    tracesSampleRate: 1.0,
  });
}; 