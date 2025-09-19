import axiosInstance from "../axios-instance";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface PaginationRequest {
  page?: number;
  limit?: number;
}

export interface PaginationResponse {
  data: User[];
  page: number;
  limit: number;
  total_items: number;
  total_pages: number;
}

export interface ApiResponse {
  code: number;
  status: string;
  message: string;
  data: PaginationResponse;
}

export interface UpdateUserRequest {
  name: string;
  email: string;
  role: string;
}

export interface UpdateUserResponse {
  code: number;
  status: string;
  message: string;
}

export const getAllUsers = async (
  pagination?: PaginationRequest
): Promise<ApiResponse> => {
  const params = new URLSearchParams();

  if (pagination?.page) {
    params.append("page", pagination.page.toString());
  }
  if (pagination?.limit) {
    params.append("limit", pagination.limit.toString());
  }

  const queryString = params.toString();
  const url = `/users${queryString ? `?${queryString}` : ""}`;

  const response = await axiosInstance.get(url);
  return response.data;
};

export const getUserById = async (id: string): Promise<User> => {
  const response = await axiosInstance.get(`/users/${id}`);
  return response.data.data;
};

export const updateUser = async (
  id: string,
  userData: UpdateUserRequest
): Promise<UpdateUserResponse> => {
  const response = await axiosInstance.put(`/users/${id}`, userData);
  return response.data;
};

export const deleteUser = async (
  id: string
): Promise<{ success: boolean; message: string }> => {
  const response = await axiosInstance.delete(`/users/${id}`);
  return response.data;
};
