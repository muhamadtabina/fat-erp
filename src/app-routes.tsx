import { Routes, Route, Navigate } from "react-router";
import { useAuth } from "@/contexts/auth-context";
import UserLogin from "@/components/auth/login-page";
import { ProtectedRoute } from "@/components/protected-route";
import Layout from "./components/layout/layout";
import Dashboard from "./Dashboard/Dashboard";
import { Loader2 } from "lucide-react";
import Users from "./components/users/Users";
import ChartOfAccounts from "./components/chart-of-accounts/chart-of-accounts";
import CommercialBusinessEntity from "./components/entity-management/commercial-business-entity/entity-management";
import { AddEntityPage } from "./components/entity-management/commercial-business-entity/add-entity-page";
import { EditEntityPage } from "./components/entity-management/commercial-business-entity/edit-entity-page";
import LogisticsEntitiesManagement from "./components/entity-management/logistics-entities-and-costs/logistics-entities-management";
import AddLogisticsEntityPage from "./components/entity-management/logistics-entities-and-costs/add-logistics-entity-page";

export default function AppRoutes() {
  const { isAuthenticated, isLoading } = useAuth();

  // Tampilkan loading indicator saat sesi sedang diverifikasi
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-10 w-10 animate-spin" />
      </div>
    );
  }
  return (
    <Routes>
      <Route path="/login" element={<UserLogin />} />
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/chart-of-accounts" element={<ChartOfAccounts />} />
          <Route
            path="/commercial-business-entity"
            element={<CommercialBusinessEntity />}
          />
          <Route
            path="/commercial-business-entity/add"
            element={<AddEntityPage />}
          />
          <Route
            path="/commercial-business-entity/edit/:id"
            element={<EditEntityPage />}
          />
          <Route
            path="/logistics-entities-and-costs"
            element={<LogisticsEntitiesManagement />}
          />
          <Route
            path="/logistics-entities-and-costs/add"
            element={<AddLogisticsEntityPage />}
          />
        </Route>
      </Route>
      <Route path="*" element={<h1>404: Halaman Tidak Ditemukan</h1>} />
    </Routes>
  );
}
