import { createClient } from '@supabase/supabase-js';

import { env, requiresConfig } from '@/src/config/env';
import type { AuthCredentials, AuthService, AuthUser } from '@/src/services/auth/types';

let supabaseClient: ReturnType<typeof createClient> | null = null;

function getSupabaseClient() {
  if (supabaseClient) {
    return supabaseClient;
  }

  supabaseClient = createClient(
    requiresConfig(env.supabaseUrl, 'EXPO_PUBLIC_SUPABASE_URL'),
    requiresConfig(env.supabaseAnonKey, 'EXPO_PUBLIC_SUPABASE_ANON_KEY'),
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
      },
    },
  );

  return supabaseClient;
}

function mapUser(user: { id: string; email?: string | null; user_metadata?: Record<string, unknown> }): AuthUser {
  return {
    id: user.id,
    email: user.email ?? '',
    name: typeof user.user_metadata?.name === 'string' ? user.user_metadata.name : null,
  };
}

export const supabaseAuthService: AuthService = {
  provider: 'supabase',
  async signIn(input: AuthCredentials) {
    const { data, error } = await getSupabaseClient().auth.signInWithPassword({
      email: input.email,
      password: input.password,
    });

    if (error || !data.user) {
      throw new Error(error?.message ?? 'Unable to sign in with Supabase.');
    }

    return mapUser(data.user);
  },
  async signUp(input: AuthCredentials) {
    const { data, error } = await getSupabaseClient().auth.signUp({
      email: input.email,
      password: input.password,
      options: {
        data: {
          name: input.name ?? '',
        },
      },
    });

    if (error || !data.user) {
      throw new Error(error?.message ?? 'Unable to sign up with Supabase.');
    }

    return mapUser(data.user);
  },
  async signOut() {
    const { error } = await getSupabaseClient().auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
  },
  async getCurrentUser() {
    const { data, error } = await getSupabaseClient().auth.getUser();
    if (error) {
      throw new Error(error.message);
    }

    return data.user ? mapUser(data.user) : null;
  },
};
