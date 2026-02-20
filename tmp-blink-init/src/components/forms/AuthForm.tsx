import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, Text, View } from 'react-native';
import { z } from 'zod';

import { PrimaryButton } from '@/src/components/ui/PrimaryButton';
import { TextField } from '@/src/components/ui/TextField';
import type { AuthCredentials } from '@/src/services/auth/types';

type AuthFormProps = {
  mode: 'login' | 'signup';
  isSubmitting: boolean;
  error: string | null;
  onSubmit(values: AuthCredentials): Promise<void>;
};

const LoginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const SignupSchema = LoginSchema.extend({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
});

type LoginValues = z.infer<typeof LoginSchema>;
type SignupValues = z.infer<typeof SignupSchema>;

export function AuthForm({ mode, isSubmitting, error, onSubmit }: AuthFormProps) {
  const isSignup = mode === 'signup';

  const form = useForm<LoginValues | SignupValues>({
    defaultValues: {
      email: '',
      password: '',
      ...(isSignup ? { name: '' } : {}),
    },
    resolver: zodResolver(isSignup ? SignupSchema : LoginSchema),
  });

  const submit = form.handleSubmit(async (values) => {
    await onSubmit(values as AuthCredentials);
  });

  return (
    <View style={styles.container}>
      {isSignup ? (
        <Controller
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <TextField
              autoCapitalize="words"
              error={fieldState.error?.message}
              label="Name"
              placeholder="Jane Doe"
              value={field.value ?? ''}
              onChangeText={field.onChange}
            />
          )}
        />
      ) : null}

      <Controller
        control={form.control}
        name="email"
        render={({ field, fieldState }) => (
          <TextField
            autoCapitalize="none"
            error={fieldState.error?.message}
            keyboardType="email-address"
            label="Email"
            placeholder="you@example.com"
            value={field.value}
            onChangeText={field.onChange}
          />
        )}
      />

      <Controller
        control={form.control}
        name="password"
        render={({ field, fieldState }) => (
          <TextField
            autoCapitalize="none"
            error={fieldState.error?.message}
            label="Password"
            placeholder="••••••••"
            secureTextEntry
            value={field.value}
            onChangeText={field.onChange}
          />
        )}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <PrimaryButton
        disabled={isSubmitting}
        label={isSignup ? 'Create account' : 'Sign in'}
        loading={isSubmitting}
        onPress={submit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 14,
  },
  error: {
    color: '#fb7185',
    fontSize: 13,
  },
});
