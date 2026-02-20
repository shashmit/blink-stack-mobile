import { env, requiresConfig } from '@/src/config/env';
import type { NotificationService } from '@/src/services/notifications/types';

function getHeaders(): HeadersInit {
  const apiKey = requiresConfig(env.novuApiKey, 'EXPO_PUBLIC_NOVU_API_KEY');
  return {
    Authorization: `ApiKey ${apiKey}`,
    'Content-Type': 'application/json',
  };
}

function getApiUrl(): string {
  return requiresConfig(env.novuApiUrl, 'EXPO_PUBLIC_NOVU_API_URL');
}

export const novuNotificationService: NotificationService = {
  async initialize() {
    return Promise.resolve();
  },
  async requestPermission() {
    return Promise.resolve();
  },
  async sendTestNotification() {
    const subscriberId = requiresConfig(env.novuSubscriberId, 'EXPO_PUBLIC_NOVU_SUBSCRIBER_ID');
    const response = await fetch(`${getApiUrl()}/v1/events/trigger`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        name: 'mobile-test',
        to: {
          subscriberId,
        },
        payload: {
          source: 'expo-template',
        },
      }),
    });

    if (!response.ok) {
      throw new Error('Unable to trigger Novu test notification.');
    }
  },
};
