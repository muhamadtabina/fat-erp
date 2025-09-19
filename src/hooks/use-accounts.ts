import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAlert } from "@/contexts/alert-context";
import {
  getAllAccounts,
  getAccountById,
  createAccount,
  updateAccount,
  deleteAccount,
  toggleAccountStatus,
  type Account,
  type CreateAccountData,
  type UpdateAccountData,
} from "@/lib/api/accounts/account-api";

// Query keys
export const accountsKeys = {
  all: ["accounts"] as const,
  lists: () => [...accountsKeys.all, "list"] as const,
  list: (filters: string) => [...accountsKeys.lists(), { filters }] as const,
  details: () => [...accountsKeys.all, "detail"] as const,
  detail: (id: string) => [...accountsKeys.details(), id] as const,
};

// Get all accounts
export const useAccounts = () => {
  return useQuery({
    queryKey: accountsKeys.lists(),
    queryFn: getAllAccounts,
    select: (data) => data.data,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get account by ID
export const useAccount = (id: string) => {
  return useQuery({
    queryKey: accountsKeys.detail(id),
    queryFn: () => getAccountById(id),
    select: (data) => data.data,
    enabled: !!id,
  });
};

// Create account mutation
export const useCreateAccount = () => {
  const queryClient = useQueryClient();
  const { showAlert } = useAlert();

  return useMutation({
    mutationFn: createAccount,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: accountsKeys.lists() });
      showAlert("success", data.message || "Akun berhasil dibuat");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Gagal membuat akun";
      showAlert("error", message);
    },
  });
};

// Update account mutation
export const useUpdateAccount = () => {
  const queryClient = useQueryClient();
  const { showAlert } = useAlert();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAccountData }) =>
      updateAccount(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: accountsKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: accountsKeys.detail(variables.id),
      });
      showAlert("success", data.message || "Akun berhasil diperbarui");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Gagal memperbarui akun";
      showAlert("error", message);
    },
  });
};

// Delete account mutation
export const useDeleteAccount = () => {
  const queryClient = useQueryClient();
  const { showAlert } = useAlert();

  return useMutation({
    mutationFn: deleteAccount,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: accountsKeys.lists() });
      showAlert("success", data.message || "Akun berhasil dihapus");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Gagal menghapus akun";
      showAlert("error", message);
    },
  });
};

// Toggle account status mutation
export const useToggleAccountStatus = () => {
  const queryClient = useQueryClient();
  const { showAlert } = useAlert();

  return useMutation({
    mutationFn: toggleAccountStatus,
    onSuccess: (data, accountId) => {
      queryClient.invalidateQueries({ queryKey: accountsKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: accountsKeys.detail(accountId),
      });
      showAlert("success", data.message || "Status akun berhasil diubah");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Gagal mengubah status akun";
      showAlert("error", message);
    },
  });
};
