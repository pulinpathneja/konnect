// Firebase Cloud Messaging setup
// In production, initialize FCM for push notifications

export async function requestNotificationPermission(): Promise<string | null> {
  try {
    if (!('Notification' in window)) {
      console.log('Notifications not supported');
      return null;
    }

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.log('Notification permission denied');
      return null;
    }

    // In production, get FCM token:
    // const { getMessaging, getToken } = await import('firebase/messaging');
    // const messaging = getMessaging();
    // const token = await getToken(messaging, { vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY });
    // return token;

    return 'demo-fcm-token';
  } catch (err) {
    console.error('Failed to get notification permission:', err);
    return null;
  }
}

export function showLocalNotification(title: string, body: string, icon?: string) {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, {
      body,
      icon: icon || '/favicon.ico',
      badge: '/favicon.ico',
    });
  }
}

// Notification types
export type NotificationType = 'new_message' | 'incoming_call' | 'session_reminder' | 'low_balance';

export function getNotificationContent(type: NotificationType, data: Record<string, string>) {
  switch (type) {
    case 'new_message':
      return {
        title: `New message from ${data.senderName}`,
        body: data.message || 'You have a new message',
      };
    case 'incoming_call':
      return {
        title: `Incoming ${data.callType} call`,
        body: `${data.callerName} is calling you`,
      };
    case 'session_reminder':
      return {
        title: 'Session Reminder',
        body: `Your session with ${data.mentorName} starts in ${data.time}`,
      };
    case 'low_balance':
      return {
        title: 'Low Wallet Balance',
        body: `Your balance is ₹${data.balance}. Recharge to continue sessions.`,
      };
  }
}
