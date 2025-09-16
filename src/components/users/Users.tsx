import { DataTable } from "./DataTable";
import { createColumns, type User } from "./Columns";
import { getAllUsers, deleteUser } from "@/lib/api/users/UsersApi";
import { useAuth } from "@/contexts/AuthContext";
import { AddUserDialog } from "./AddUserDialog";
import { EditUserDialog } from "./EditUserDialog";
import { useAlert } from "@/contexts/AlertContext";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export default function UsersPage() {
  const { accessToken } = useAuth();
  const { showAlert } = useAlert();
  const [data, setData] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);

  const getData = React.useCallback(async () => {
    if (!accessToken) {
      setError("No access token available");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await getAllUsers(accessToken, { page: 1, limit: 100 });
      setData(response.data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  React.useEffect(() => {
    getData();
  }, [accessToken, getData]);

  const handleAddUser = () => {
    setIsAddDialogOpen(true);
  };

  const handleUserAdded = () => {
    getData();
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };

  const handleUserUpdated = () => {
    getData();
  };

  const handleDeleteUser = async (user: User) => {
    const isConfirmed = await showAlert(
      "confirm",
      `Apakah Anda yakin ingin menghapus user "${user.name}"? Tindakan ini tidak dapat dibatalkan.`,
      "Konfirmasi Hapus User"
    );

    if (!isConfirmed) {
      return;
    }

    if (!accessToken) {
      showAlert("error", "No access token available");
      return;
    }

    try {
      const response = await deleteUser(accessToken, user.id);

      if (response.ok) {
        showAlert("success", "User berhasil dihapus");
        getData();
      } else {
        const errorData = await response.json();
        showAlert("error", errorData.message || "Gagal menghapus user");
      }
    } catch (err) {
      showAlert(
        "error",
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat menghapus user"
      );
    }
  };

  if (loading) {
    return (
      <div className="">
        <div className="mb-8 px-4 py-2 bg-secondary rounded-md">
          <Skeleton className="h-6 w-24" />
        </div>
        <div className="space-y-4">
          {/* Header dengan tombol Add User */}
          <div className="flex items-center justify-between">
            <Skeleton className="h-9 w-64" />
            <Skeleton className="h-9 w-24" />
          </div>
          
          {/* Table skeleton */}
          <div className="rounded-md border">
            {/* Table header */}
            <div className="border-b bg-muted/50 p-4">
              <div className="flex space-x-4">
                <Skeleton className="h-4 w-8" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
            
            {/* Table rows */}
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="border-b p-4 last:border-b-0">
                <div className="flex space-x-4">
                  <Skeleton className="h-4 w-8" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            ))}
          </div>
          
          {/* Pagination skeleton */}
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-32" />
            <div className="flex space-x-2">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="">
      <div className="mb-8 px-4 py-2 bg-secondary rounded-md">
        <h1 className="font-semibold">All Users</h1>
      </div>
      <DataTable
        data={data}
        columns={createColumns(handleEditUser, handleDeleteUser)}
        onAddUser={handleAddUser}
        onEditUser={handleEditUser}
      />
      <AddUserDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onUserAdded={handleUserAdded}
      />
      <EditUserDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onUserUpdated={handleUserUpdated}
        user={selectedUser}
      />
    </div>
  );
}
