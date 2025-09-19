import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  userLogin,
  userLogout,
  userRegister,
  refreshAccessToken,
} from "../lib/api/auth/auth-api";
import { useNavigate } from "react-router";
import { useAuth } from "@/contexts/auth-context";
import { useAlert } from "@/contexts/alert-context";
import { userKeys } from "./use-users";

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  role: string;
}

// Query keys
export const authKeys = {
  all: ["auth"] as const,
  user: () => [...authKeys.all, "user"] as const,
  refreshToken: () => [...authKeys.all, "refresh"] as const,
};

// Login mutation
export const useLogin = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { login } = useAuth();
  const { showAlert } = useAlert();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => userLogin(credentials),
    onSuccess: (data) => {
      if (data.code === 200 && data.data?.access_token) {
        // Simpan ke localStorage
        localStorage.setItem("access_token", data.data.access_token);

        // Simpan user jika tersedia
        if (data.data.user) {
          localStorage.setItem("user_data", JSON.stringify(data.data.user));
          queryClient.setQueryData(authKeys.user(), data.data.user);
        }

        // Update AuthContext state immediately (tanpa menunggu user)
        login(data.data.access_token, data.data.user);

        // Navigate to dashboard
        navigate("/dashboard");
      } else {
        showAlert("error", data.message || "Login gagal");
      }
    },
    onError: (error: Error) => {
      const apiError = error as ApiError;
      const message =
        apiError.response?.data?.message || "Terjadi kesalahan saat login";
      showAlert("error", message);
    },
  });
};

// Register mutation
export const useRegister = () => {
  const queryClient = useQueryClient();
  const { showAlert } = useAlert();

  return useMutation({
    mutationFn: (credentials: RegisterCredentials) => userRegister(credentials),
    onSuccess: (data) => {
      if (data.code === 201 || data.code === 200) {
        queryClient.invalidateQueries({ queryKey: userKeys.lists() });
        showAlert("success", data.message || "Registrasi berhasil");
      } else {
        showAlert("error", data.message || "Registrasi gagal");
      }
    },
    onError: (error: Error) => {
      const apiError = error as ApiError;
      const message =
        apiError.response?.data?.message || "Terjadi kesalahan saat registrasi";
      showAlert("error", message);
    },
  });
};

// Logout mutation
export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showAlert } = useAlert();

  return useMutation({
    mutationFn: () => {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("No token found");
      return userLogout(token);
    },
    onSuccess: (data) => {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user_data");
      queryClient.clear();
      showAlert("success", data.message || "Logout berhasil");
      navigate("/login");
    },
    onError: (error: Error) => {
      // Even if logout fails on server, clear local data
      localStorage.removeItem("access_token");
      localStorage.removeItem("user_data");
      queryClient.clear();
      navigate("/login");
      const apiError = error as ApiError;
      const message = apiError.response?.data?.message || "Logout berhasil";
      showAlert("success", message);
    },
  });
};

// Refresh token mutation
export const useRefreshToken = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: refreshAccessToken,
    onSuccess: (data) => {
      if (data.code === 200 && data.data?.access_token) {
        localStorage.setItem("access_token", data.data.access_token);
        if (data.data.user) {
          queryClient.setQueryData(authKeys.user(), data.data.user);
        }
      }
    },
    onError: () => {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user_data");
      queryClient.clear();
      window.location.href = "/login";
    },
  });
};

// Check if user is authenticated
export const useIsAuthenticated = () => {
  const token = localStorage.getItem("access_token");
  return !!token;
};

// Get current user from query cache
export const useCurrentUser = () => {
  const queryClient = useQueryClient();
  return queryClient.getQueryData(authKeys.user());
};

// Custom hook to get auth status and user info
export const useAuthStatus = () => {
  const isAuthenticated = useIsAuthenticated();
  const currentUser = useCurrentUser();

  return {
    isAuthenticated,
    user: currentUser,
    isLoading: false, // Since we're using localStorage, no loading state needed
  };
};

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}
