import { Navigate, Outlet } from "react-router";
import { useAuth } from "@/contexts/AuthContext";

// Perhatikan: Komponen ini tidak lagi membutuhkan 'children' sebagai props
export const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // 1. Tampilkan loading spinner saat status autentikasi sedang diperiksa
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // 2. Jika autentikasi selesai dan pengguna terautentikasi,
  //    render komponen anak yang cocok melalui <Outlet />
  if (isAuthenticated) {
    return <Outlet />;
  }

  // 3. Jika tidak terautentikasi, alihkan ke halaman login
  return <Navigate to="/login" replace />;
};
