// services/pushNotifications.ts

import { authHeader, baseUrl } from "../utils";

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY;
const SERVICE_WORKER_URL = `${import.meta.env.BASE_URL || '/'}sw.js`;

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String || '').length % 4) % 4);
  const base64 = `${base64String || ''}${padding}`
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
}

function arrayBufferToBase64(buffer) {
  if (!buffer) {
    return '';
  }

  const bytes = new Uint8Array(buffer);
  let binary = '';

  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }

  return window.btoa(binary);
}

function normalizeSubscriptionPayload(subscription) {
  if (!subscription) {
    return null;
  }

  const subscriptionJson =
    typeof subscription.toJSON === 'function' ? subscription.toJSON() : subscription;

  const endpoint = subscriptionJson?.endpoint || subscription?.endpoint || '';
  let p256dh = subscriptionJson?.keys?.p256dh || '';
  let auth = subscriptionJson?.keys?.auth || '';

  if ((!p256dh || !auth) && typeof subscription.getKey === 'function') {
    p256dh = p256dh || arrayBufferToBase64(subscription.getKey('p256dh'));
    auth = auth || arrayBufferToBase64(subscription.getKey('auth'));
  }

  return {
    endpoint,
    keys: {
      p256dh,
      auth,
    },
  };
}

export const getPushEnvironmentStatus = () => {
  if (typeof window === 'undefined') {
    return { isSupported: false, reason: 'Not running in a browser environment.' };
  }

  if (!window.isSecureContext) {
    return {
      isSupported: false,
      reason: 'Push notifications require HTTPS (or localhost) on this browser.',
    };
  }

  if (!('serviceWorker' in navigator)) {
    return { isSupported: false, reason: 'Service workers are not supported on this browser.' };
  }

  if (!('Notification' in window)) {
    return { isSupported: false, reason: 'Notification API is not supported on this browser.' };
  }

  if (!('PushManager' in window)) {
    return { isSupported: false, reason: 'Push API is not supported on this browser.' };
  }

  return { isSupported: true, reason: '' };
};

export const registerServiceWorker = async () => {
  const status = getPushEnvironmentStatus();
  if (!status.isSupported) {
    throw new Error(status.reason);
  }

  return navigator.serviceWorker.register(SERVICE_WORKER_URL);
};

export const requestNotificationPermission = async () => {
  const status = getPushEnvironmentStatus();
  if (!status.isSupported) {
    throw new Error(status.reason);
  }

  if (Notification.permission === 'granted') {
    return 'granted';
  }

  if (Notification.permission === 'denied') {
    throw new Error('Notifications are blocked in browser settings for this site.');
  }

  const permission = await Notification.requestPermission();

  if (permission !== 'granted') {
    throw new Error('Notification permission was not granted.');
  }

  return permission;
};

export const subscribeToPush = async () => {
  const status = getPushEnvironmentStatus();
  if (!status.isSupported) {
    throw new Error(status.reason);
  }

  if (!VAPID_PUBLIC_KEY) {
    throw new Error('Push notifications are not configured. Missing VAPID public key.');
  }

  const registration = await navigator.serviceWorker.ready;

  const existingSub = await registration.pushManager.getSubscription();
  if (existingSub) return existingSub;

  return registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
  });
};

export const sendSubscriptionToBackend = async (subscription) => {
  const normalizedSubscription = normalizeSubscriptionPayload(subscription);

  if (!normalizedSubscription?.endpoint) {
    throw new Error('Push subscription is invalid: missing endpoint.');
  }

  if (!normalizedSubscription?.keys?.p256dh || !normalizedSubscription?.keys?.auth) {
    throw new Error('Push subscription is invalid: missing encryption keys.');
  }

  const response = await fetch(`${baseUrl}/push-notifications/subscriptions`, {
    method: 'POST',
    headers: {
      ...authHeader(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ subscription: normalizedSubscription }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to save push subscription on the server.');
  }
};