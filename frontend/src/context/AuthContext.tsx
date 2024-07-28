import React, { createContext, useEffect, useState } from 'react';
import apiClient from '../api/apiClient.ts';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '@/context/constants.ts';
import { jwtDecode } from 'jwt-decode';

interface AuthContextProps {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (
    username: string,
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => Promise<void>;
  refresh: () => Promise<void>;
  logout: () => void;
}

const initialProps: AuthContextProps = {
  isAuthenticated: false,
  login: async () => {},
  register: async () => {},
  refresh: async () => {},
  logout: () => {},
};

const AuthContext = createContext<AuthContextProps>(initialProps);

type AuthProviderProps = {
  children: React.ReactNode;
};
const AuthProvider: React.FC<AuthProviderProps> = ({
  children,
}: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // Check if the user is authenticated
  useEffect(() => {
    auth().catch((error) => {
      console.log('error', error);
      setIsAuthenticated(false);
    });
  }, []);

  // Refresh the token

  // Authenticate
  const auth = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      setIsAuthenticated(false);
      return;
    }

    const decoded = jwtDecode(token);
    const tokenExp = decoded.exp;
    const now = Date.now() / 1000; // to get in seconds

    if (tokenExp && tokenExp < now) {
      await refresh();
    } else {
      setIsAuthenticated(true);
    }
  };

  const login = async (username: string, password: string) => {
    return await apiClient
      .post('/token/', {
        username,
        password,
      })
      .then((response) => {
        const data = response.data;
        localStorage.setItem(ACCESS_TOKEN, data.access);
        localStorage.setItem(REFRESH_TOKEN, data.refresh);
        localStorage.setItem('user', JSON.stringify(data.user));
        setIsAuthenticated(true);
      });
  };

  // Refresh the token
  const refresh = async () => {
    const refreshedToken = localStorage.getItem(REFRESH_TOKEN);
    try {
      const response = await apiClient.post('/token/refresh/', {
        refresh: refreshedToken,
      });

      if (response.status === 200) {
        localStorage.setItem(ACCESS_TOKEN, response.data.access);
        localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.log('error', error);
      setIsAuthenticated(false);
    }
  };

  const register = async (
    username: string,
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => {
    const response = await apiClient.post('/user/register/', {
      username,
      first_name: firstName,
      last_name: lastName,
      email,
      password,
    });
    const data = response.data;
    localStorage.setItem(ACCESS_TOKEN, data.access);
    localStorage.setItem(REFRESH_TOKEN, data.refresh);
  };

  const logout = () => {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: Boolean(isAuthenticated),
        login,
        register,
        logout,
        refresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
