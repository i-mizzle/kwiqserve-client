// hooks/usePushNotifications.ts

import { useEffect, useState } from 'react';
import {
  getPushEnvironmentStatus,
  registerServiceWorker,
  requestNotificationPermission,
  subscribeToPush,
  sendSubscriptionToBackend,
} from '../services/pushNotifications';

export const usePushNotifications = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [error, setError] = useState(null);

  const getExistingSubscription = async () => {
    const registrations = await navigator.serviceWorker.getRegistrations();

    for (const registration of registrations) {
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        return subscription;
      }
    }

    return null;
  };

  useEffect(() => {
    let isMounted = true;

    const checkPushNotificationStatus = async () => {
      const environmentStatus = getPushEnvironmentStatus();

      if (!environmentStatus.isSupported) {
        if (isMounted) {
          setIsBlocked(true);
          setError(environmentStatus.reason);
          setIsCheckingStatus(false);
        }
        return;
      }

      if (Notification.permission === 'denied') {
        if (isMounted) {
          setIsBlocked(true);
          setError('Notifications are blocked in browser settings for this site.');
          setIsCheckingStatus(false);
        }
        return;
      }

      try {
        const subscription = await getExistingSubscription();

        if (!isMounted) {
          return;
        }

        setIsSubscribed(Boolean(subscription));
        setIsBlocked(false);
        setError(null);
      } catch (err) {
        if (!isMounted) {
          return;
        }

        console.error(err);
        setError(err.message || 'Failed to check notification status');
      } finally {
        if (isMounted) {
          setIsCheckingStatus(false);
        }
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

      const environmentStatus = getPushEnvironmentStatus();
      if (!environmentStatus.isSupported) {
        throw new Error(environmentStatus.reason);
      }

      // Ask permission first so users get immediate browser feedback on click.
      await requestNotificationPermission();

      // 1. Register SW
      await registerServiceWorker();

      // 2. Subscribe
      const subscription = await subscribeToPush();

      // 3. Send to backend
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
    isCheckingStatus,
    isSubscribed,
    isBlocked,
    error,
  };
};