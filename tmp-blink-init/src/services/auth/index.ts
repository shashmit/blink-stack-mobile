import { env } from '@/src/config/env';
import { appwriteAuthService } from '@/src/services/auth/appwrite-auth-service';
import { basicAuthService } from '@/src/services/auth/basic-auth-service';
import { supabaseAuthService } from '@/src/services/auth/supabase-auth-service';
import type { AuthService } from '@/src/services/auth/types';

export function getNativeAuthService(): AuthService {
  switch (env.authProvider) {
    case 'supabase':
      return supabaseAuthService;
    case 'appwrite':
      return appwriteAuthService;
    case 'basic':
    default:
      return basicAuthService;
  }
}
