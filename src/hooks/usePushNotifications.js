// hooks/usePushNotifications.ts

import { useState } from 'react';
import {
  registerServiceWorker,
  requestNotificationPermission,
  subscribeToPush,
  sendSubscriptionToBackend,
} from '../services/pushNotifications';

export const usePushNotifications = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState(null);

  const enablePushNotifications = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // 1. Register SW
      await registerServiceWorker();

      // 2. Ask permission
      await requestNotificationPermission();

      // 3. Subscribe
      const subscription = await subscribeToPush();

      // 4. Send to backend
      await sendSubscriptionToBackend(subscription);

      setIsSubscribed(true);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to enable notifications');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    enablePushNotifications,
    isLoading,
    isSubscribed,
    error,
  };
};