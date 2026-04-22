import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type {
  AuthContextType,
  Profile,
  ProfileUpdate,
  Session,
  SignUpInput,
  User,
  UserSettings,
  UserSettingsUpdate,
} from '../types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEYS = {
  accounts: 'proflow_local_accounts',
  session: 'proflow_local_session',
};

interface StoredAccount {
  user: User;
  password: string;
  profile: Profile;
  settings: UserSettings;
}

const nowIso = () => new Date().toISOString();

const buildAvatarUrl = (firstName: string, lastName: string, email: string) => {
  const displayName = [firstName, lastName].filter(Boolean).join(' ') || email;
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=FBBF24&color=fff`;
};

const createAccount = (input: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}): StoredAccount => {
  const timestamp = nowIso();
  const user: User = {
    id: crypto.randomUUID(),
    email: input.email.trim().toLowerCase(),
    user_metadata: {
      first_name: input.firstName,
      last_name: input.lastName,
    },
  };

  return {
    user,
    password: input.password,
    profile: {
      id: user.id,
      email: user.email,
      first_name: input.firstName,
      last_name: input.lastName,
      avatar_url: buildAvatarUrl(input.firstName, input.lastName, user.email),
      job_title: 'Member',
      company_name: 'Sellora',
      bio: null,
      terms_accepted_at: timestamp,
      onboarding_completed: false,
      created_at: timestamp,
      updated_at: timestamp,
    },
    settings: {
      user_id: user.id,
      theme: 'light',
      email_notifications: true,
      push_notifications: false,
      two_factor_enabled: false,
      timezone: 'Asia/Kolkata',
      language: 'en-US',
      created_at: timestamp,
      updated_at: timestamp,
    },
  };
};

const readAccounts = (): StoredAccount[] => {
  const raw = localStorage.getItem(STORAGE_KEYS.accounts);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as StoredAccount[];
  } catch {
    return [];
  }
};

const writeAccounts = (accounts: StoredAccount[]) => {
  localStorage.setItem(STORAGE_KEYS.accounts, JSON.stringify(accounts));
};

const buildSession = (user: User): Session => ({
  user,
  access_token: `local-${user.id}`,
});

const ensureSeedAccount = () => {
  const existing = readAccounts();
  if (existing.length > 0) return existing;

  const seed = createAccount({
    email: 'demo@sellora.app',
    password: 'demo12345',
    firstName: 'Demo',
    lastName: 'User',
  });
  writeAccounts([seed]);
  return [seed];
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const accounts = ensureSeedAccount();
    const rawSession = localStorage.getItem(STORAGE_KEYS.session);

    if (rawSession) {
      try {
        const storedSession = JSON.parse(rawSession) as Session;
        const account = accounts.find(({ user: accountUser }) => accountUser.id === storedSession.user.id);
        if (account) {
          setSession(buildSession(account.user));
          setUser(account.user);
          setProfile(account.profile);
          setSettings(account.settings);
        } else {
          localStorage.removeItem(STORAGE_KEYS.session);
        }
      } catch {
        localStorage.removeItem(STORAGE_KEYS.session);
      }
    }

    setLoading(false);
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const account = readAccounts().find(
      (item) => item.user.email === email.trim().toLowerCase() && item.password === password,
    );

    if (!account) {
      throw new Error('Invalid email or password.');
    }

    const nextSession = buildSession(account.user);
    localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(nextSession));
    setSession(nextSession);
    setUser(account.user);
    setProfile(account.profile);
    setSettings(account.settings);
  }, []);

  const signUp = useCallback(async (input: SignUpInput) => {
    const accounts = readAccounts();
    const email = input.email.trim().toLowerCase();

    if (accounts.some((account) => account.user.email === email)) {
      throw new Error('An account with this email already exists.');
    }

    const account = createAccount({
      email,
      password: input.password,
      firstName: input.firstName.trim(),
      lastName: input.lastName.trim(),
    });

    const nextAccounts = [...accounts, account];
    writeAccounts(nextAccounts);
  }, []);

  const signOut = useCallback(async () => {
    localStorage.removeItem(STORAGE_KEYS.session);
    setSession(null);
    setUser(null);
    setProfile(null);
    setSettings(null);
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    if (!email.trim()) {
      throw new Error('Email is required.');
    }
  }, []);

  const updateProfile = useCallback(async (data: ProfileUpdate) => {
    if (!user || !profile) throw new Error('No authenticated user');

    const accounts = readAccounts();
    const nextProfile: Profile = {
      ...profile,
      ...data,
      updated_at: nowIso(),
    };
    nextProfile.avatar_url =
      nextProfile.avatar_url ??
      buildAvatarUrl(nextProfile.first_name ?? '', nextProfile.last_name ?? '', user.email);

    const nextAccounts = accounts.map((account) =>
      account.user.id === user.id
        ? {
            ...account,
            user: {
              ...account.user,
              user_metadata: {
                ...account.user.user_metadata,
                first_name: nextProfile.first_name,
                last_name: nextProfile.last_name,
              },
            },
            profile: nextProfile,
          }
        : account,
    );

    writeAccounts(nextAccounts);

    const nextUser = nextAccounts.find((account) => account.user.id === user.id)?.user ?? user;
    const nextSession = buildSession(nextUser);
    localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(nextSession));
    setUser(nextUser);
    setSession(nextSession);
    setProfile(nextProfile);
  }, [profile, user]);

  const updateSettings = useCallback(async (data: UserSettingsUpdate) => {
    if (!user || !settings) throw new Error('No authenticated user');

    const nextSettings: UserSettings = {
      ...settings,
      ...data,
      updated_at: nowIso(),
    };

    const nextAccounts = readAccounts().map((account) =>
      account.user.id === user.id
        ? {
            ...account,
            settings: nextSettings,
          }
        : account,
    );

    writeAccounts(nextAccounts);
    setSettings(nextSettings);
  }, [settings, user]);

  const value: AuthContextType = {
    session,
    user,
    profile,
    settings,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
    updateSettings,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
