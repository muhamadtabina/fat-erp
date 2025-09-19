import { DataTable } from "./data-table";
import { createColumns, type User } from "./columns";
import { AddUserDialog } from "./add-user-dialog";
import { EditUserDialog } from "./edit-user-dialog";
import { useAlert } from "@/contexts/alert-context";
import { Skeleton } from "@/components/ui/skeleton";
import { useUsers, useDeleteUser } from "@/hooks/use-users";
import React from "react";

export default function UsersPage() {
  const { showAlert } = useAlert();
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);

  // Menggunakan React Query hooks
  const {
    data: usersResponse,
    isLoading,
    error,
  } = useUsers({ page: 1, limit: 100 });
  const deleteUserMutation = useDeleteUser();

  // Extract data dari response
  const data = usersResponse?.data.data || [];

  const handleAddUser = () => {
    setIsAddDialogOpen(true);
  };

  const handleUserAdded = () => {
    // Tidak perlu manual refresh, React Query akan handle invalidation
    setIsAddDialogOpen(false);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };

  const handleUserUpdated = () => {
    // Tidak perlu manual refresh, React Query akan handle invalidation
    setIsEditDialogOpen(false);
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

    // Menggunakan mutation dari React Query
    deleteUserMutation.mutate(user.id);
  };

  if (isLoading) {
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
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="">
      <div className="mb-2 px-4 py-2 bg-secondary rounded-md">
        <h1 className="font-semibold">List Users</h1>
      </div>
      <DataTable
        data={data}
        columns={createColumns(handleEditUser, handleDeleteUser)}
        onAddUser={handleAddUser}
        onEditUser={handleEditUser}
        onDeleteUser={handleDeleteUser}
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
