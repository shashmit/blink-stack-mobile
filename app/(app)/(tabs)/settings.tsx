import { StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/src/components/ui/PrimaryButton';
import { Screen } from '@/src/components/ui/Screen';
import { useNotifications } from '@/src/hooks/useNotifications';
import { Sentry } from '@/src/lib/sentry';

export default function AppSettingsScreen() {
  const { error, provider, requestPermission, sendTestNotification, status } = useNotifications();

  return (
    <Screen>
      <View style={styles.card}>
        <Text style={styles.title}>Notifications</Text>
        <Text style={styles.copy}>Provider: {provider}</Text>
        <Text style={styles.copy}>Status: {status}</Text>

        <PrimaryButton
          label="Request permission"
          onPress={() => {
            void requestPermission();
          }}
        />

        <PrimaryButton
          label="Send Novu test"
          variant="secondary"
          onPress={() => {
            void sendTestNotification();
          }}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Sentry</Text>
        <Text style={styles.copy}>Sentry is initialized globally when `EXPO_PUBLIC_SENTRY_DSN` is set.</Text>
        <PrimaryButton
          label="Capture test error"
          variant="secondary"
          onPress={() => {
            Sentry.captureException(new Error('Manual Sentry test error from settings screen.'));
          }}
        />
      </View>
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
    gap: 10,
  },
  title: {
    color: '#f8fafc',
    fontSize: 20,
    fontWeight: '700',
  },
  copy: {
    color: '#94a3b8',
    fontSize: 14,
    lineHeight: 20,
  },
  error: {
    color: '#fb7185',
    fontSize: 14,
  },
});
