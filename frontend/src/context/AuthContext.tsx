import React, { createContext, useEffect, useState } from 'react';
import api from '../api.ts';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '@/context/constants.ts';
import { jwtDecode } from 'jwt-decode';

interface AuthContextProps {
  isAuthenticated: boolean;
  user: any;
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
  user: null,
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
  const [user, setUser] = useState(null);

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
      const user = localStorage.getItem('user');
      if (user) {
        console.log('user', user);
        setUser(JSON.parse(user));
      }
    }
  };

  const login = async (username: string, password: string) => {
    const response = await api.post('/token/', {
      username,
      password,
    });
    const data = response.data;
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
  };

  // Refresh the token
  const refresh = async () => {
    const refreshedToken = localStorage.getItem(REFRESH_TOKEN);
    try {
      const response = await api.post('/token/refresh/', {
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
    const response = await api.post('/user/register/', {
      username,
      first_name: firstName,
      last_name: lastName,
      email,
      password,
    });
    const data = response.data;
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: Boolean(isAuthenticated),
        user,
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
