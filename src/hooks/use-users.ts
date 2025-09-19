import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllUsers, deleteUser, updateUser } from "@/lib/api/users/users-api";
import type { UpdateUserRequest } from "@/lib/api/users/users-api";
import { useAlert } from "@/contexts/alert-context";

// Query key factory untuk konsistensi
export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (params: { page: number; limit: number }) =>
    [...userKeys.lists(), params] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
};

// Hook untuk fetch users dengan pagination
export const useUsers = (params: { page: number; limit: number }) => {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => getAllUsers(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });
};

// Hook untuk delete user
export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  const { showAlert } = useAlert();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      showAlert("success", "User berhasil dihapus");
    },
    onError: (error: Error) => {
      showAlert(
        "error",
        error.message || "Terjadi kesalahan saat menghapus user"
      );
    },
  });
};

// Hook untuk update user
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  const { showAlert } = useAlert();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserRequest }) =>
      updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      showAlert("success", "User berhasil diperbarui");
    },
    onError: (error: Error) => {
      showAlert(
        "error",
        error.message || "Terjadi kesalahan saat memperbarui user"
      );
    },
  });
};
