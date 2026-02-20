import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/src/components/ui/PrimaryButton';
import { Screen } from '@/src/components/ui/Screen';
import { useSubscription } from '@/src/hooks/useSubscription';

export default function SubscriptionScreen() {
  const { availablePackages, bypassForTemplate, error, hasActiveSubscription, isProcessingPurchase, purchase, refresh, status } =
    useSubscription();

  return (
    <Screen scroll>
      <View style={styles.header}>
        <Text style={styles.title}>Subscription Gate</Text>
        <Text style={styles.copy}>RevenueCat status: {status}</Text>
      </View>

      {hasActiveSubscription ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Subscription active</Text>
          <PrimaryButton
            label="Continue to app"
            onPress={() => {
              router.replace('/(app)');
            }}
          />
        </View>
      ) : null}

      {availablePackages.length > 0 ? (
        <View style={styles.list}>
          {availablePackages.map((pkg) => (
            <View key={pkg.identifier} style={styles.card}>
              <Text style={styles.cardTitle}>{pkg.product.title}</Text>
              <Text style={styles.cardCopy}>{pkg.product.description}</Text>
              <Text style={styles.price}>{pkg.product.priceString}</Text>
              <PrimaryButton
                label="Start subscription"
                loading={isProcessingPurchase}
                onPress={() => {
                  void purchase(pkg);
                }}
              />
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>No packages loaded</Text>
          <Text style={styles.cardCopy}>
            Add RevenueCat API keys and products to show plans here, then press refresh.
          </Text>
          <PrimaryButton
            label="Refresh offerings"
            variant="secondary"
            onPress={() => {
              void refresh();
            }}
          />
        </View>
      )}

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {status === 'disabled' ? (
        <PrimaryButton
          label="Continue in template mode"
          onPress={() => {
            void (async () => {
              await bypassForTemplate();
              router.replace('/(app)');
            })();
          }}
        />
      ) : null}

      <PrimaryButton
        label="Billing settings"
        variant="secondary"
        onPress={() => {
          router.push('/(subscription)/settings');
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 8,
    gap: 6,
  },
  title: {
    color: '#f8fafc',
    fontSize: 28,
    fontWeight: '700',
  },
  copy: {
    color: '#94a3b8',
    fontSize: 15,
  },
  list: {
    gap: 12,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
    backgroundColor: '#0f172a',
    padding: 16,
    gap: 10,
  },
  cardTitle: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: '600',
  },
  cardCopy: {
    color: '#94a3b8',
    fontSize: 14,
    lineHeight: 20,
  },
  price: {
    color: '#22d3ee',
    fontWeight: '700',
    fontSize: 18,
  },
  error: {
    color: '#fb7185',
    fontSize: 14,
  },
});
