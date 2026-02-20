export interface NotificationService {
  initialize(): Promise<void>;
  requestPermission(): Promise<void>;
  sendTestNotification(): Promise<void>;
}
