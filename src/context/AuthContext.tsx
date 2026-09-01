import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { StoredUser, User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => { success: boolean; error?: string };
  signup: (data: { name: string; email: string; phone: string; password: string }) => { success: boolean; error?: string };
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const USERS_KEY = 'railway-users';
const SESSION_KEY = 'railway-auth';

const DEMO_USER: StoredUser = {
  name: 'Rahul Sharma',
  email: 'demo@railways.gov.in',
  phone: '9876543210',
  password: 'demo123',
  initials: 'RS',
  ticketBooked: true,
  booking: {
    pnr: '4521987634',
    trainNumber: '12345',
    trainName: 'Poorva Express',
    from: 'New Delhi',
    fromCode: 'NDLS',
    to: 'Howrah',
    toCode: 'HWH',
    travelDate: '2026-09-05',
    class: 'SL',
    seat: 'S5 / 42',
    status: 'Confirmed',
  },
};

function loadUsers(): StoredUser[] {
  const stored = localStorage.getItem(USERS_KEY);
  const users: StoredUser[] = stored ? JSON.parse(stored) : [];
  if (!users.some((u) => u.email === DEMO_USER.email)) {
    users.push(DEMO_USER);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }
  return users;
}

function saveUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function toPublicUser({ password: _, ...user }: StoredUser): User {
  return user;
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = sessionStorage.getItem(SESSION_KEY);
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const login = useCallback((email: string, password: string) => {
    const normalized = email.trim().toLowerCase();
    const found = loadUsers().find((u) => u.email.toLowerCase() === normalized);

    if (!found) {
      return { success: false, error: 'No account found with this email. Please sign up first.' };
    }
    if (found.password !== password) {
      return { success: false, error: 'Incorrect password. Please try again.' };
    }

    const publicUser = toPublicUser(found);
    setUser(publicUser);
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(publicUser));
    return { success: true };
  }, []);

  const signup = useCallback(
    (data: { name: string; email: string; phone: string; password: string }) => {
      const name = data.name.trim();
      const email = data.email.trim().toLowerCase();
      const phone = data.phone.trim();

      if (!name || name.length < 2) {
        return { success: false, error: 'Please enter your full name.' };
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return { success: false, error: 'Please enter a valid email address.' };
      }
      if (!/^\d{10}$/.test(phone)) {
        return { success: false, error: 'Please enter a valid 10-digit mobile number.' };
      }
      if (data.password.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters.' };
      }

      const users = loadUsers();
      if (users.some((u) => u.email.toLowerCase() === email)) {
        return { success: false, error: 'An account with this email already exists.' };
      }

      const newUser: StoredUser = {
        name,
        email,
        phone,
        password: data.password,
        initials: getInitials(name),
        ticketBooked: false,
      };

      users.push(newUser);
      saveUsers(users);

      const publicUser = toPublicUser(newUser);
      setUser(publicUser);
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(publicUser));
      return { success: true };
    },
    [],
  );

  const logout = useCallback(() => {
    setUser(null);
    sessionStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem('railway-tracked');
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
