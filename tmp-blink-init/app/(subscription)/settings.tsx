import { StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/src/components/ui/PrimaryButton';
import { Screen } from '@/src/components/ui/Screen';
import { useSubscription } from '@/src/hooks/useSubscription';

export default function SubscriptionSettingsScreen() {
  const { error, restore } = useSubscription();

  return (
    <Screen>
      <View style={styles.card}>
        <Text style={styles.title}>Restore purchases</Text>
        <Text style={styles.copy}>Call RevenueCat restore flow so users can recover paid access after reinstall or device change.</Text>
        <PrimaryButton
          label="Restore purchases"
          onPress={() => {
            void restore();
          }}
        />
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}
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
