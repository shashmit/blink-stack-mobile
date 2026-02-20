import { Link, router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AuthForm } from '@/src/components/forms/AuthForm';
import { Screen } from '@/src/components/ui/Screen';
import { toErrorMessage } from '@/src/lib/errors';
import type { AuthCredentials } from '@/src/services/auth/types';
import { useSession } from '@/src/hooks/useSession';

export default function LoginScreen() {
  const { signIn, authProvider } = useSession();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (values: AuthCredentials) => {
    setSubmitting(true);
    setError(null);

    try {
      await signIn(values);
      router.replace('/');
    } catch (value) {
      setError(toErrorMessage(value));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Screen scroll>
      <View style={styles.header}>
        <Text style={styles.title}>Sign in</Text>
        <Text style={styles.copy}>Provider: {authProvider}</Text>
      </View>

      <AuthForm error={error} isSubmitting={submitting} mode="login" onSubmit={handleSubmit} />

      <Text style={styles.footer}>
        New here?{' '}
        <Link href="/(auth)/signup" style={styles.link}>
          Create account
        </Link>
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 4,
    marginTop: 20,
    marginBottom: 16,
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
  footer: {
    color: '#94a3b8',
    fontSize: 14,
    marginTop: 6,
  },
  link: {
    color: '#60a5fa',
    fontWeight: '700',
  },
});
