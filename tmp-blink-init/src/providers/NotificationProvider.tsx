import { createContext, useCallback, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react';

import { env } from '@/src/config/env';
import { toErrorMessage } from '@/src/lib/errors';
import { getNotificationService } from '@/src/services/notifications';

type NotificationStatus = 'idle' | 'ready' | 'error';

type NotificationContextValue = {
  provider: string;
  status: NotificationStatus;
  error: string | null;
  requestPermission(): Promise<void>;
  sendTestNotification(): Promise<void>;
};

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

export function NotificationProvider({ children }: PropsWithChildren) {
  const service = useMemo(() => getNotificationService(), []);
  const [status, setStatus] = useState<NotificationStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        await service.initialize();
        setStatus('ready');
      } catch (value) {
        setStatus('error');
        setError(toErrorMessage(value));
      }
    })();
  }, [service]);

  const requestPermission = useCallback(async () => {
    setError(null);
    try {
      await service.requestPermission();
    } catch (value) {
      setError(toErrorMessage(value));
    }
  }, [service]);

  const sendTestNotification = useCallback(async () => {
    setError(null);
    try {
      await service.sendTestNotification();
    } catch (value) {
      setError(toErrorMessage(value));
    }
  }, [service]);

  const value = useMemo<NotificationContextValue>(
    () => ({
      provider: env.notificationProvider,
      status,
      error,
      requestPermission,
      sendTestNotification,
    }),
    [status, error, requestPermission, sendTestNotification],
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used inside NotificationProvider.');
  }

  return context;
}
