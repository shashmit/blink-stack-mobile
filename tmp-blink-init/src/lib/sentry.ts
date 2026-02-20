import * as Sentry from '@sentry/react-native';

import { env } from '@/src/config/env';

const sentryEnabled = Boolean(env.sentryDsn);

Sentry.init({
  dsn: env.sentryDsn || undefined,
  enabled: sentryEnabled,
  tracesSampleRate: sentryEnabled ? 0.2 : 0,
  profilesSampleRate: sentryEnabled ? 0.2 : 0,
});

export { Sentry };
