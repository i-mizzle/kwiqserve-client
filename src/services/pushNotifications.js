// services/pushNotifications.ts

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY;

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
}

export const registerServiceWorker = async () => {
  if (!('serviceWorker' in navigator)) {
    throw new Error('Service workers not supported');
  }

  return await navigator.serviceWorker.register('/sw.js');
};

export const requestNotificationPermission = async () => {
  const permission = await Notification.requestPermission();

  if (permission !== 'granted') {
    throw new Error('Notification permission denied');
  }

  return permission;
};

export const subscribeToPush = async () => {
  const registration = await navigator.serviceWorker.ready;

  const existingSub = await registration.pushManager.getSubscription();
  if (existingSub) return existingSub;

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
  });

  return subscription;
};

export const sendSubscriptionToBackend = async (subscription) => {
  await fetch('/api/push/subscribe', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ subscription }),
  });
};