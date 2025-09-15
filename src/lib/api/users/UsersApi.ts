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
  token: string,
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
  const url = `${import.meta.env.VITE_API_PATH}/users${
    queryString ? `?${queryString}` : ""
  }`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
};

export const getUserById = async (
  token: string,
  id: string
): Promise<Response> => {
  return await fetch(`${import.meta.env.VITE_API_PATH}/users/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });
};

export const updateUser = async (
  token: string,
  id: string,
  userData: UpdateUserRequest
): Promise<Response> => {
  return await fetch(`${import.meta.env.VITE_API_PATH}/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
    body: JSON.stringify(userData),
  });
};

export const deleteUser = async (
  token: string,
  id: string
): Promise<Response> => {
  return await fetch(`${import.meta.env.VITE_API_PATH}/users/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });
};
