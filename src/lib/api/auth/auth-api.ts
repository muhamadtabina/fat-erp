import axiosInstance from "../axios-instance";

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  role: string;
}

interface AuthResponse {
  code: number;
  status: string;
  message: string;
  data?: {
    access_token: string;
    user?: {
      id: string;
      name: string;
      email: string;
      role: string;
    };
  };
}

export const userLogin = async ({
  email,
  password,
}: LoginCredentials): Promise<AuthResponse> => {
  const response = await axiosInstance.post("/auth/login", {
    email,
    password,
  });
  return response.data;
};

export const userLogout = async (
  token: string
): Promise<{ success: boolean; message: string }> => {
  const response = await axiosInstance.post(
    "/auth/logout",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const refreshAccessToken = async (): Promise<AuthResponse> => {
  const response = await axiosInstance.post("/auth/refresh-token");
  return response.data;
};

export const userRegister = async ({
  name,
  email,
  password,
  role,
}: RegisterCredentials): Promise<AuthResponse> => {
  const response = await axiosInstance.post("/auth/register", {
    name,
    email,
    password,
    role,
  });
  return response.data;
};
