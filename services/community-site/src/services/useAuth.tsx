import React, { useState, useEffect, useContext, createContext } from 'react';
import { useApi } from './useApi';

type User = {
  id: number;
  username: string;
  email: string;
  eth_wallet: string;
  kyc: string;
  confirmed: boolean;
};

export type UpdateUserPayload = {
  username: string;
  password: string;
  eth_wallet: string;
};

type Context = {
  user: User | null;
  signin?: (username: string, password: string) => Promise<any>;
  signup?: (
    username: string,
    email: string,
    ethWallet: string,
    password: string,
    token: string,
  ) => Promise<any>;
  signout?: () => void;
  sendPasswordResetEmail?: (email: string, token: string) => Promise<any>;
  resetPassword?: (code: string, password: string, passwordConfirmation: string) => Promise<any>;
  emailConfirmation?: (email?: string) => Promise<any>;
  updateUser?: (payload: Partial<UpdateUserPayload>) => Promise<any>;
  refreshUser?: () => Promise<any>;
  setSessionExpired?: () => void;
  clearSessionExpired?: () => void;
  isSessionExpired?: () => boolean;
};

const initialState: Context = {
  user: null,
};

const AuthContext = createContext<Context>(initialState);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const auth = useProvideAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};

function useProvideAuth() {
  const [user, setUser] = useState<User | null>(null);
  const api = useApi();

  const signin = async (username: string, password: string) => {
    const result = await api.post('/auth/local', {
      identifier: username,
      password: password,
    });

    if (result.success) {
      if (result.response.jwt) {
        localStorage.setItem('auth', result.response.jwt);
      }

      if (result.response.user) {
        const user = result.response.user;
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
      }
    }

    return result;
  };
  const signup = async (
    username: string,
    email: string,
    ethWallet: string,
    password: string,
    token: string,
  ) => {
    return await api.post('/auth/local/register', {
      username: username,
      password: password,
      eth_wallet: ethWallet,
      email: email,
      token: token,
      confirmed: false,
    });
  };
  const signout = () => {
    localStorage.removeItem('auth');
    localStorage.removeItem('user');
    setUser(null);
  };
  const sendPasswordResetEmail = async (email: string, token: string) => {
    return await api.post('/auth/forgot-password', {
      email: email,
      token: token,
    });
  };
  const resetPassword = async (code: string, password: string, passwordConfirmation: string) => {
    const result = await api.post('/auth/reset-password', {
      code,
      password,
      passwordConfirmation,
    });

    if (result.success) {
      const user = result.response.user;

      if (user.confirmed) {
        if (result.response.jwt) {
          localStorage.setItem('auth', result.response.jwt);
        }

        if (result.response.user) {
          localStorage.setItem('user', JSON.stringify(user));
          setUser(user);
        }
      }
    }

    return result;
  };
  const emailConfirmation = async (email?: string) => {
    const result = await api.post('/auth/send-email-confirmation', {
      email: email ?? user!.email,
    });
    return result;
  };
  const updateUser = async (payload: Partial<UpdateUserPayload>) => {
    const result = await api.put(`/users/${user!.id}`, payload, true);

    if (result.success) {
      const user = result.response;
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
    }

    return result;
  };
  const refreshUser = async () => {
    const result = await api.get('/users/me', true);
    if (result.success) {
      if (result.response) {
        const user = result.response;
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
      }
    }
    return result;
  };

  const setSessionExpired = () => {
    localStorage.setItem('sessionExpired', 'true');
    signout();
    window.location.reload();
  };

  const clearSessionExpired = () => localStorage.removeItem('sessionExpired');

  const isSessionExpired = () => localStorage.getItem('sessionExpired') === 'true';

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setUser(JSON.parse(user));
    }
  }, []);

  return {
    user,
    signin,
    signup,
    signout,
    sendPasswordResetEmail,
    resetPassword,
    emailConfirmation,
    updateUser,
    refreshUser,
    setSessionExpired,
    isSessionExpired,
    clearSessionExpired,
  };
}
