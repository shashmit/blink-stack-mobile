import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth, useSignIn, useSignUp, useUser } from '@clerk/clerk-expo';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react';

import { env } from '@/src/config/env';
import { getNativeAuthService } from '@/src/services/auth';
import type { AuthCredentials, AuthUser } from '@/src/services/auth/types';
import type { AppStatus, AuthProvider } from '@/src/types/app';

const ONBOARDING_KEY = 'vibing:onboarding:complete';

type SessionContextValue = {
  authProvider: AuthProvider;
  status: AppStatus;
  user: AuthUser | null;
  isSignedIn: boolean;
  onboardingCompleted: boolean;
  signIn(input: AuthCredentials): Promise<void>;
  signUp(input: AuthCredentials): Promise<void>;
  signOut(): Promise<void>;
  completeOnboarding(): Promise<void>;
  refresh(): Promise<void>;
};

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

async function readOnboardingState(): Promise<boolean> {
  return (await AsyncStorage.getItem(ONBOARDING_KEY)) === 'true';
}

function mapClerkUser(user: ReturnType<typeof useUser>['user']): AuthUser | null {
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    email: user.primaryEmailAddress?.emailAddress ?? '',
    name: user.fullName ?? user.firstName ?? null,
  };
}

function NativeSessionProvider({ children }: PropsWithChildren) {
  const authService = useMemo(() => getNativeAuthService(), []);
  const [status, setStatus] = useState<AppStatus>('loading');
  const [user, setUser] = useState<AuthUser | null>(null);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);

  const refresh = useCallback(async () => {
    const currentUser = await authService.getCurrentUser();
    setUser(currentUser);
  }, [authService]);

  useEffect(() => {
    void (async () => {
      try {
        const [currentUser, onboarding] = await Promise.all([authService.getCurrentUser(), readOnboardingState()]);
        setUser(currentUser);
        setOnboardingCompleted(onboarding);
        setStatus('ready');
      } catch {
        setStatus('error');
      }
    })();
  }, [authService]);

  const completeOnboarding = useCallback(async () => {
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    setOnboardingCompleted(true);
  }, []);

  const signIn = useCallback(
    async (input: AuthCredentials) => {
      const signedInUser = await authService.signIn(input);
      setUser(signedInUser);
    },
    [authService],
  );

  const signUp = useCallback(
    async (input: AuthCredentials) => {
      const signedUpUser = await authService.signUp(input);
      setUser(signedUpUser);
    },
    [authService],
  );

  const signOut = useCallback(async () => {
    await authService.signOut();
    setUser(null);
  }, [authService]);

  const value = useMemo<SessionContextValue>(
    () => ({
      authProvider: env.authProvider,
      status,
      user,
      isSignedIn: Boolean(user),
      onboardingCompleted,
      signIn,
      signUp,
      signOut,
      completeOnboarding,
      refresh,
    }),
    [status, user, onboardingCompleted, signIn, signUp, signOut, completeOnboarding, refresh],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

function ClerkSessionProvider({ children }: PropsWithChildren) {
  const { isLoaded: authLoaded, signOut: clerkSignOut } = useAuth();
  const { isLoaded: clerkUserLoaded, user: clerkUser } = useUser();
  const { isLoaded: signInLoaded, signIn, setActive: setSignInActive } = useSignIn();
  const { isLoaded: signUpLoaded, signUp, setActive: setSignUpActive } = useSignUp();

  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const [onboardingLoaded, setOnboardingLoaded] = useState(false);

  useEffect(() => {
    void (async () => {
      const onboarding = await readOnboardingState();
      setOnboardingCompleted(onboarding);
      setOnboardingLoaded(true);
    })();
  }, []);

  const user = useMemo(() => mapClerkUser(clerkUser), [clerkUser]);

  const completeOnboarding = useCallback(async () => {
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    setOnboardingCompleted(true);
  }, []);

  const signInWithClerk = useCallback(
    async (input: AuthCredentials) => {
      if (!signInLoaded || !signIn || !setSignInActive) {
        throw new Error('Clerk sign in is not ready yet.');
      }

      const attempt = await signIn.create({
        identifier: input.email,
        password: input.password,
      });

      if (attempt.status !== 'complete' || !attempt.createdSessionId) {
        throw new Error('Clerk sign in requires additional verification. Customize this flow for OTP/MFA.');
      }

      await setSignInActive({ session: attempt.createdSessionId });
    },
    [signInLoaded, signIn, setSignInActive],
  );

  const signUpWithClerk = useCallback(
    async (input: AuthCredentials) => {
      if (!signUpLoaded || !signUp || !setSignUpActive) {
        throw new Error('Clerk sign up is not ready yet.');
      }

      const attempt = await signUp.create({
        emailAddress: input.email,
        password: input.password,
        firstName: input.name,
      });

      if (attempt.status !== 'complete' || !attempt.createdSessionId) {
        throw new Error('Clerk sign up needs verification. Update this template for OTP/email verification.');
      }

      await setSignUpActive({ session: attempt.createdSessionId });
    },
    [signUpLoaded, signUp, setSignUpActive],
  );

  const status: AppStatus = authLoaded && clerkUserLoaded && onboardingLoaded ? 'ready' : 'loading';

  const value = useMemo<SessionContextValue>(
    () => ({
      authProvider: 'clerk',
      status,
      user,
      isSignedIn: Boolean(user),
      onboardingCompleted,
      signIn: signInWithClerk,
      signUp: signUpWithClerk,
      signOut: clerkSignOut,
      completeOnboarding,
      refresh: async () => Promise.resolve(),
    }),
    [status, user, onboardingCompleted, signInWithClerk, signUpWithClerk, clerkSignOut, completeOnboarding],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function SessionProvider({ children }: PropsWithChildren) {
  if (env.authProvider === 'clerk') {
    return <ClerkSessionProvider>{children}</ClerkSessionProvider>;
  }

  return <NativeSessionProvider>{children}</NativeSessionProvider>;
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used inside SessionProvider.');
  }

  return context;
}
