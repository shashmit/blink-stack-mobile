import type { AuthProvider } from '@/src/types/app';

export type AuthUser = {
  id: string;
  email: string;
  name?: string | null;
};

export type AuthCredentials = {
  email: string;
  password: string;
  name?: string;
};

export interface AuthService {
  readonly provider: AuthProvider;
  signIn(input: AuthCredentials): Promise<AuthUser>;
  signUp(input: AuthCredentials): Promise<AuthUser>;
  signOut(): Promise<void>;
  getCurrentUser(): Promise<AuthUser | null>;
}
