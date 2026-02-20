import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

type PrimaryButtonProps = {
  label: string;
  onPress(): void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary';
};

export function PrimaryButton({ label, onPress, disabled = false, loading = false, variant = 'primary' }: PrimaryButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        variant === 'secondary' ? styles.secondary : styles.primary,
        pressed && !isDisabled ? styles.pressed : null,
        isDisabled ? styles.disabled : null,
      ]}>
      {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.label}>{label}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  primary: {
    backgroundColor: '#2563eb',
  },
  secondary: {
    backgroundColor: '#1f2937',
    borderWidth: 1,
    borderColor: '#334155',
  },
  pressed: {
    opacity: 0.9,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
