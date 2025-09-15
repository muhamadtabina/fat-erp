import React, { useState, useEffect, type ReactNode } from "react";
import { refreshAccessToken, userLogout } from "@/lib/api/auth/AuthApi";
import { AuthContext, type AuthContextType } from "@/contexts/AuthContext";

// Constants for localStorage keys
const ACCESS_TOKEN_KEY = "access_token";
const USER_DATA_KEY = "user_data";

// Helper functions for localStorage
const saveTokenToStorage = (token: string) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
};

const getTokenFromStorage = (): string | null => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

const saveUserToStorage = (user: User) => {
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
};

const getUserFromStorage = (): User | null => {
  const userData = localStorage.getItem(USER_DATA_KEY);
  return userData ? JSON.parse(userData) : null;
};

const clearStorageData = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(USER_DATA_KEY);
};

// Definisikan interface User jika belum diimpor
interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthProviderProps {
  children: ReactNode;
}

// Hanya ekspor component dari file ini
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!accessToken && !!user;

  const refreshToken = async (): Promise<boolean> => {
    try {
      const response = await refreshAccessToken();
      if (response.ok) {
        const data = await response.json();
        if (data.data && data.data.access_token) {
          setAccessToken(data.data.access_token);
          saveTokenToStorage(data.data.access_token);
          if (data.data.user) {
            setUser(data.data.user);
            saveUserToStorage(data.data.user);
          }
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error("Token refresh failed:", error);
      return false;
    }
  };

  const login = (token: string, userData: User) => {
    setAccessToken(token);
    setUser(userData);
    // Simpan ke localStorage untuk persistensi
    saveTokenToStorage(token);
    saveUserToStorage(userData);
  };

  const logout = async () => {
    try {
      if (accessToken) {
        await userLogout(accessToken);
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setAccessToken(null);
      setUser(null);
      // Hapus data dari localStorage
      clearStorageData();
      window.location.href = "/login";
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);

      // Pertama, coba ambil token dari localStorage
      const storedToken = getTokenFromStorage();
      const storedUser = getUserFromStorage();

      if (storedToken && storedUser) {
        // Jika ada token di localStorage, set state
        setAccessToken(storedToken);
        setUser(storedUser);
        setIsLoading(false);
        return;
      }

      // Jika tidak ada token di localStorage, cek refresh token cookie
      const hasRefreshToken = document.cookie.includes("refresh_token=");

      if (hasRefreshToken) {
        const refreshSuccess = await refreshToken();
        if (!refreshSuccess) {
          setAccessToken(null);
          setUser(null);
          clearStorageData();
        }
      } else {
        // Tidak ada refresh token, set state ke tidak terautentikasi
        setAccessToken(null);
        setUser(null);
        clearStorageData();
      }

      setIsLoading(false);
    };
    initializeAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!accessToken) return;

    const refreshInterval = setInterval(async () => {
      const success = await refreshToken();
      if (!success) {
        logout();
      }
    }, 14 * 60 * 1000); // 14 minutes

    return () => clearInterval(refreshInterval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  const value: AuthContextType = {
    user,
    accessToken,
    isAuthenticated,
    isLoading,
    login,
    logout,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
