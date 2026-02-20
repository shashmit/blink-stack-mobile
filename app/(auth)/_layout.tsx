import { Stack } from 'expo-router';

export default function AuthLayout() {
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
      <Stack.Screen name="onboarding" options={{ title: 'Welcome' }} />
      <Stack.Screen name="login" options={{ title: 'Sign in' }} />
      <Stack.Screen name="signup" options={{ title: 'Create account' }} />
    </Stack>
  );
}
