import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function ensureNotificationPermission() {
  const current = await Notifications.getPermissionsAsync();
  if (current.status === 'granted') return true;
  const requested = await Notifications.requestPermissionsAsync();
  return requested.status === 'granted';
}

async function scheduleFoodAlert(restaurantId: string, body: string) {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('food-alerts', {
      name: 'Food alerts',
      importance: Notifications.AndroidImportance.HIGH,
    });
  }
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'FOOD ALERT',
      body,
      sound: 'default',
      data: { restaurantId },
    },
    trigger: null,
  });
  return true;
}

export async function sendFoodAlert(restaurantId: string, body: string) {
  const allowed = await ensureNotificationPermission();
  if (!allowed) return false;
  return scheduleFoodAlert(restaurantId, body);
}

export async function sendFoodAlertIfAllowed(restaurantId: string, body: string) {
  const current = await Notifications.getPermissionsAsync();
  if (current.status !== 'granted') return false;
  return scheduleFoodAlert(restaurantId, body);
}
