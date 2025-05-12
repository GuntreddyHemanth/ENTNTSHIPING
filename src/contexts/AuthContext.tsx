import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { authenticateUser, getUserById } from '../utils/localStorageUtils';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check for existing session on initialization
  useEffect(() => {
    const checkExistingSession = () => {
      const userId = localStorage.getItem('entnt_user_id');
      if (userId) {
        const user = getUserById(userId);
        if (user) {
          setUser(user);
        } else {
          // Invalid user ID in localStorage, clear it
          localStorage.removeItem('entnt_user_id');
        }
      }
      setLoading(false);
    };

    checkExistingSession();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const authenticatedUser = authenticateUser(email, password);
      
      if (authenticatedUser) {
        setUser(authenticatedUser);
        localStorage.setItem('entnt_user_id', authenticatedUser.id);
        setLoading(false);
        return true;
      } else {
        setError('Invalid email or password');
        setLoading(false);
        return false;
      }
    } catch (err) {
      setError('An error occurred during login');
      setLoading(false);
      return false;
    }
  };

  const logout = (): void => {
    localStorage.removeItem('entnt_user_id');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};