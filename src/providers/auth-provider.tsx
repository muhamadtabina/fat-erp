import React, { useState, useEffect, type ReactNode } from "react";
import { refreshAccessToken, userLogout } from "@/lib/api/auth/auth-api";
import { AuthContext, type AuthContextType } from "@/contexts/auth-context";

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

  const isAuthenticated = !!accessToken;

  const refreshToken = async (): Promise<boolean> => {
    try {
      const data = await refreshAccessToken();
      if (data.code === 200 && data.data && data.data.access_token) {
        setAccessToken(data.data.access_token);
        saveTokenToStorage(data.data.access_token);
        if (data.data.user) {
          setUser(data.data.user);
          saveUserToStorage(data.data.user);
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error("Token refresh failed:", error);
      return false;
    }
  };

  // Function to get new token for API calls
  const getRefreshedToken = async (): Promise<string | null> => {
    const success = await refreshToken();
    return success ? accessToken : null;
  };

  const login = (token: string, userData?: User) => {
    setAccessToken(token);
    if (userData) {
      setUser(userData);
    }
    // Simpan ke localStorage untuk persistensi
    saveTokenToStorage(token);
    if (userData) {
      saveUserToStorage(userData);
    }
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

      if (storedToken) {
        // Jika ada token di localStorage, set state
        setAccessToken(storedToken);
        if (storedUser) {
          setUser(storedUser);
        }
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
    getRefreshedToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
