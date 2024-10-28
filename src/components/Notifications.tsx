import React, { useEffect } from 'react';
import { useStore } from '@/lib/store';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const NOTIFICATION_TIMEOUT = 5000;

const icons = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
  warning: AlertCircle,
};

export function Notifications() {
  const { notifications, removeNotification } = useStore();

  useEffect(() => {
    notifications.forEach((notification) => {
      if (notification.duration !== Infinity) {
        const timeout = setTimeout(() => {
          removeNotification(notification.id);
        }, notification.duration || NOTIFICATION_TIMEOUT);

        return () => clearTimeout(timeout);
      }
    });
  }, [notifications, removeNotification]);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {notifications.map((notification) => {
        const Icon = icons[notification.type];
        return (
          <div
            key={notification.id}
            className={cn(
              'flex items-center gap-2 rounded-lg p-4 text-sm shadow-lg',
              {
                'bg-success/10 text-success': notification.type === 'success',
                'bg-error/10 text-error': notification.type === 'error',
                'bg-info/10 text-info': notification.type === 'info',
                'bg-warning/10 text-warning': notification.type === 'warning',
              }
            )}
          >
            <Icon className="h-5 w-5" />
            <p>{notification.message}</p>
            <button
              onClick={() => removeNotification(notification.id)}
              className="ml-2 rounded-full p-1 hover:bg-background/10"
            >
              <XCircle className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}