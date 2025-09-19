import axiosInstance from "../axios-instance";

export interface Account {
  id: string;
  code: string;
  name: string;
  type: "DEBIT" | "CREDIT";
  balance: number;
  status: "ACTIVE" | "INACTIVE";
  parentId?: string;
  children?: Account[];
  isGroup: boolean;
}

export interface CreateAccountData {
  code: string;
  name: string;
  type: "DEBIT" | "CREDIT";
  parentId?: string;
  isGroup: boolean;
}

export interface UpdateAccountData {
  code?: string;
  name?: string;
  type?: "DEBIT" | "CREDIT";
  status?: "ACTIVE" | "INACTIVE";
  parentId?: string;
  isGroup?: boolean;
}

export interface AccountsResponse {
  success: boolean;
  message: string;
  data: Account[];
}

export interface AccountResponse {
  success: boolean;
  message: string;
  data: Account;
}

// Get all accounts with hierarchical structure
export const getAllAccounts = async (): Promise<AccountsResponse> => {
  const response = await axiosInstance.get("/accounts");
  return response.data;
};

// Get account by ID
export const getAccountById = async (id: string): Promise<AccountResponse> => {
  const response = await axiosInstance.get(`/accounts/${id}`);
  return response.data;
};

// Create new account
export const createAccount = async (
  data: CreateAccountData
): Promise<AccountResponse> => {
  const response = await axiosInstance.post("/accounts", data);
  return response.data;
};

// Update account
export const updateAccount = async (
  id: string,
  data: UpdateAccountData
): Promise<AccountResponse> => {
  const response = await axiosInstance.put(`/accounts/${id}`, data);
  return response.data;
};

// Delete account
export const deleteAccount = async (
  id: string
): Promise<{ success: boolean; message: string }> => {
  const response = await axiosInstance.delete(`/accounts/${id}`);
  return response.data;
};

// Toggle account status
export const toggleAccountStatus = async (
  id: string
): Promise<AccountResponse> => {
  const response = await axiosInstance.patch(`/accounts/${id}/toggle-status`);
  return response.data;
};
