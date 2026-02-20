import { env } from '@/src/config/env';
import { noneNotificationService } from '@/src/services/notifications/none-notification-service';
import { novuNotificationService } from '@/src/services/notifications/novu-notification-service';
import { oneSignalNotificationService } from '@/src/services/notifications/onesignal-notification-service';
import type { NotificationService } from '@/src/services/notifications/types';

export function getNotificationService(): NotificationService {
  switch (env.notificationProvider) {
    case 'onesignal':
      return oneSignalNotificationService;
    case 'novu':
      return novuNotificationService;
    default:
      return noneNotificationService;
  }
}
