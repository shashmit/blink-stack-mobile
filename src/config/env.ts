import { z } from 'zod';

import type { AuthProvider, NotificationProvider } from '@/src/types/app';

const EnvSchema = z.object({
  EXPO_PUBLIC_AUTH_PROVIDER: z.enum(['basic', 'clerk', 'supabase', 'appwrite']).default('basic'),
  EXPO_PUBLIC_NOTIFICATION_PROVIDER: z.enum(['onesignal', 'novu', 'none']).default('none'),
  EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().optional().default(''),
  EXPO_PUBLIC_SUPABASE_URL: z.string().optional().default(''),
  EXPO_PUBLIC_SUPABASE_ANON_KEY: z.string().optional().default(''),
  EXPO_PUBLIC_APPWRITE_ENDPOINT: z.string().optional().default(''),
  EXPO_PUBLIC_APPWRITE_PROJECT_ID: z.string().optional().default(''),
  EXPO_PUBLIC_REVENUECAT_API_KEY_IOS: z.string().optional().default(''),
  EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID: z.string().optional().default(''),
  EXPO_PUBLIC_REVENUECAT_ENTITLEMENT_ID: z.string().optional().default('pro'),
  EXPO_PUBLIC_ONESIGNAL_APP_ID: z.string().optional().default(''),
  EXPO_PUBLIC_NOVU_API_URL: z.string().optional().default(''),
  EXPO_PUBLIC_NOVU_API_KEY: z.string().optional().default(''),
  EXPO_PUBLIC_NOVU_SUBSCRIBER_ID: z.string().optional().default(''),
  EXPO_PUBLIC_SENTRY_DSN: z.string().optional().default(''),
});

const parsed = EnvSchema.parse({
  EXPO_PUBLIC_AUTH_PROVIDER: process.env.EXPO_PUBLIC_AUTH_PROVIDER,
  EXPO_PUBLIC_NOTIFICATION_PROVIDER: process.env.EXPO_PUBLIC_NOTIFICATION_PROVIDER,
  EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY,
  EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
  EXPO_PUBLIC_SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  EXPO_PUBLIC_APPWRITE_ENDPOINT: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
  EXPO_PUBLIC_APPWRITE_PROJECT_ID: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
  EXPO_PUBLIC_REVENUECAT_API_KEY_IOS: process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_IOS,
  EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID: process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID,
  EXPO_PUBLIC_REVENUECAT_ENTITLEMENT_ID: process.env.EXPO_PUBLIC_REVENUECAT_ENTITLEMENT_ID,
  EXPO_PUBLIC_ONESIGNAL_APP_ID: process.env.EXPO_PUBLIC_ONESIGNAL_APP_ID,
  EXPO_PUBLIC_NOVU_API_URL: process.env.EXPO_PUBLIC_NOVU_API_URL,
  EXPO_PUBLIC_NOVU_API_KEY: process.env.EXPO_PUBLIC_NOVU_API_KEY,
  EXPO_PUBLIC_NOVU_SUBSCRIBER_ID: process.env.EXPO_PUBLIC_NOVU_SUBSCRIBER_ID,
  EXPO_PUBLIC_SENTRY_DSN: process.env.EXPO_PUBLIC_SENTRY_DSN,
});

export const env = {
  authProvider: parsed.EXPO_PUBLIC_AUTH_PROVIDER as AuthProvider,
  notificationProvider: parsed.EXPO_PUBLIC_NOTIFICATION_PROVIDER as NotificationProvider,
  clerkPublishableKey: parsed.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY,
  supabaseUrl: parsed.EXPO_PUBLIC_SUPABASE_URL,
  supabaseAnonKey: parsed.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  appwriteEndpoint: parsed.EXPO_PUBLIC_APPWRITE_ENDPOINT,
  appwriteProjectId: parsed.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
  revenueCatApiKeyIos: parsed.EXPO_PUBLIC_REVENUECAT_API_KEY_IOS,
  revenueCatApiKeyAndroid: parsed.EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID,
  revenueCatEntitlementId: parsed.EXPO_PUBLIC_REVENUECAT_ENTITLEMENT_ID,
  oneSignalAppId: parsed.EXPO_PUBLIC_ONESIGNAL_APP_ID,
  novuApiUrl: parsed.EXPO_PUBLIC_NOVU_API_URL,
  novuApiKey: parsed.EXPO_PUBLIC_NOVU_API_KEY,
  novuSubscriberId: parsed.EXPO_PUBLIC_NOVU_SUBSCRIBER_ID,
  sentryDsn: parsed.EXPO_PUBLIC_SENTRY_DSN,
};

export function requiresConfig(value: string, label: string): string {
  if (!value) {
    throw new Error(`${label} is required for the current provider. Add it to .env.local.`);
  }

  return value;
}
