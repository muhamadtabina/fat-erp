import { createContext, useContext } from "react";

// Definisikan interface Anda di sini
interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, userData?: User) => void;
  logout: () => void;
  refreshToken: () => Promise<boolean>;
  getRefreshedToken: () => Promise<string | null>;
}

// Buat dan ekspor Context
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

// Buat dan ekspor custom hook untuk menggunakan context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
