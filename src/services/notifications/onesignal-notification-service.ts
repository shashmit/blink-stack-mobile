import { OneSignal } from 'react-native-onesignal';

import { env, requiresConfig } from '@/src/config/env';
import type { NotificationService } from '@/src/services/notifications/types';

let initialized = false;

export const oneSignalNotificationService: NotificationService = {
  async initialize() {
    if (initialized) {
      return;
    }

    const appId = requiresConfig(env.oneSignalAppId, 'EXPO_PUBLIC_ONESIGNAL_APP_ID');
    OneSignal.initialize(appId);
    initialized = true;
  },
  async requestPermission() {
    await this.initialize();
    await OneSignal.Notifications.requestPermission(true);
  },
  async sendTestNotification() {
    throw new Error('OneSignal test notifications are triggered from your backend or OneSignal dashboard.');
  },
};
