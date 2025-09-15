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

export const userLogin = async ({
  email,
  password,
}: LoginCredentials): Promise<Response> => {
  return await fetch(`${import.meta.env.VITE_API_PATH}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      email,
      password,
    }),
  });
};

export const userLogout = async (token: string): Promise<Response> => {
  return await fetch(`${import.meta.env.VITE_API_PATH}/auth/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });
};

export const refreshAccessToken = async (): Promise<Response> => {
  return await fetch(`${import.meta.env.VITE_API_PATH}/auth/refresh-token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    credentials: "include",
  });
};

export const userRegister = async ({
  name,
  email,
  password,
  role,
}: RegisterCredentials): Promise<Response> => {
  return await fetch(`${import.meta.env.VITE_API_PATH}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      name,
      email,
      password,
      role,
    }),
  });
};
