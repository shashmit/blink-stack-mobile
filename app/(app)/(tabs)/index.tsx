import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/src/components/ui/PrimaryButton';
import { Screen } from '@/src/components/ui/Screen';
import { env } from '@/src/config/env';
import { useProfileQuery } from '@/src/hooks/useProfileQuery';
import { useSession } from '@/src/hooks/useSession';

export default function HomeScreen() {
  const { signOut } = useSession();
  const { data: user } = useProfileQuery();

  return (
    <Screen>
      <View style={styles.card}>
        <Text style={styles.title}>App Area</Text>
        <Text style={styles.copy}>You are in the protected app group.</Text>
        <Text style={styles.meta}>Auth: {env.authProvider}</Text>
        <Text style={styles.meta}>Notifications: {env.notificationProvider}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.subtitle}>Signed in user</Text>
        <Text style={styles.copy}>{user?.email ?? 'No active user loaded'}</Text>
      </View>

      <PrimaryButton
        label="Subscription settings"
        variant="secondary"
        onPress={() => {
          router.push('/(subscription)/settings');
        }}
      />

      <PrimaryButton
        label="Sign out"
        variant="secondary"
        onPress={() => {
          void (async () => {
            await signOut();
            router.replace('/(auth)/login');
          })();
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
    backgroundColor: '#0f172a',
    padding: 16,
    gap: 6,
  },
  title: {
    color: '#f8fafc',
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: '700',
  },
  copy: {
    color: '#94a3b8',
    fontSize: 14,
  },
  meta: {
    color: '#38bdf8',
    fontSize: 13,
  },
});
