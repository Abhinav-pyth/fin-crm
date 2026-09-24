import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { User } from '../types/user';
import { db } from '../data/database';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    if (isSupabaseConfigured()) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          loadUserData(session.user.id);
        } else {
          setLoading(false);
        }
      });

      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          loadUserData(session.user.id);
        } else {
          setUser(null);
          setLoading(false);
        }
      });

      return () => subscription.unsubscribe();
    } else {
      // Demo mode - auto login as super admin
      const demoUser: User = {
        id: 'user-1',
        email: 'superadmin@cloudcrm.com',
        full_name: 'Rajesh Kumar',
        role: 'super_admin',
        organization_id: 'org-1',
        status: 'active',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2024-01-15T10:30:00Z',
      };
      setUser(demoUser);
      setLoading(false);
    }
  }, []);

  const loadUserData = async (userId: string) => {
    try {
      const userData = await db.users.getById(userId);
      setUser(userData);
    } catch (error) {
      console.error('Failed to load user data:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured()) {
      // Demo mode - accept any login
      const demoUsers = await db.users.getAll();
      const foundUser = demoUsers.find(u => u.email === email);
      if (foundUser) {
        setUser(foundUser);
        return { error: null };
      }
      return { error: 'Invalid credentials. Try: superadmin@cloudcrm.com' };
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      return { error: error.message };
    }
    return { error: null };
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    if (!isSupabaseConfigured()) {
      return { error: 'Sign up is disabled in demo mode. Use existing credentials.' };
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      return { error: error.message };
    }

    return { error: null };
  };

  const signOut = async () => {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut();
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
