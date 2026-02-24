import { useState } from 'react';
import type { LoginCredentials } from '../types/admin.types';

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState<string>('');

  const login = (credentials: LoginCredentials) => {

    if (credentials.username === 'admin' && credentials.password === 'password') {
      setIsLoggedIn(true);
      setError('');
      return true;
    } else {
      setError('Invalid credentials');
      return false;
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
  };

  return {
    isLoggedIn,
    error,
    login,
    logout
  };
};