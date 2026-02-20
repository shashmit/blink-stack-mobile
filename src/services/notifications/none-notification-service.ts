import type { NotificationService } from '@/src/services/notifications/types';

export const noneNotificationService: NotificationService = {
  async initialize() {
    return Promise.resolve();
  },
  async requestPermission() {
    return Promise.resolve();
  },
  async sendTestNotification() {
    throw new Error('No notification provider configured.');
  },
};
