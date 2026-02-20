import { Stack } from 'expo-router';

export default function SubscriptionLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#020617',
        },
        headerTintColor: '#e2e8f0',
        contentStyle: {
          backgroundColor: '#020617',
        },
      }}>
      <Stack.Screen name="index" options={{ title: 'Subscription' }} />
      <Stack.Screen name="settings" options={{ title: 'Billing settings' }} />
    </Stack>
  );
}
