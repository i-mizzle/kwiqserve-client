// hooks/usePushNotifications.ts

import { useEffect, useState } from 'react';
import {
  registerServiceWorker,
  requestNotificationPermission,
  subscribeToPush,
  sendSubscriptionToBackend,
} from '../services/pushNotifications';

export const usePushNotifications = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const checkPushNotificationStatus = async () => {
      if (!(window.Notification && 'serviceWorker' in navigator)) {
        if (isMounted) {
          setIsBlocked(true);
        }
        return;
      }

      if (Notification.permission === 'denied') {
        if (isMounted) {
          setIsBlocked(true);
        }
        return;
      }

      try {
        const registration = await navigator.serviceWorker.getRegistration();
        const subscription = registration
          ? await registration.pushManager.getSubscription()
          : null;

        if (!isMounted) {
          return;
        }

        setIsSubscribed(Boolean(subscription));
        setIsBlocked(false);
      } catch (err) {
        if (!isMounted) {
          return;
        }

        console.error(err);
        setError(err.message || 'Failed to check notification status');
      }
    };

    checkPushNotificationStatus();

    return () => {
      isMounted = false;
    };
  }, []);

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

      setIsBlocked(false);
      setIsSubscribed(true);
    } catch (err) {
      console.error(err);
      setIsBlocked(window.Notification ? Notification.permission === 'denied' : true);
      setError(err.message || 'Failed to enable notifications');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    enablePushNotifications,
    isLoading,
    isSubscribed,
    isBlocked,
    error,
  };
};