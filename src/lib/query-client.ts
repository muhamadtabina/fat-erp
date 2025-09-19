import { QueryClient } from "@tanstack/react-query";

// Type for error response structure
interface ErrorWithResponse {
  response?: {
    status?: number;
    data?: {
      message?: string;
    };
  };
  message?: string;
}

// Global error handler - akan digunakan di level hook, bukan di queryClient
const handleQueryError = (error: unknown) => {
  const hasResponse = error && typeof error === 'object' && 'response' in error;
  const errorWithResponse = hasResponse ? (error as ErrorWithResponse) : null;
  
  let errorMessage = "Terjadi kesalahan yang tidak terduga";
  
  if (errorWithResponse?.response?.data?.message) {
    errorMessage = errorWithResponse.response.data.message;
  } else if (errorWithResponse?.message) {
    errorMessage = errorWithResponse.message;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }
  
  // Log error for debugging
  console.error("Query Error:", error);
  
  return errorMessage;
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: (failureCount, error) => {
        // Type guard to check if error has response property
        const hasResponse = error && typeof error === 'object' && 'response' in error;
        const response = hasResponse ? (error as ErrorWithResponse).response : null;
        
        // Don't retry on 4xx errors except 401
        if (
          response?.status && 
          response.status >= 400 &&
          response.status < 500 &&
          response.status !== 401
        ) {
          return false;
        }
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
      // Hapus onError dari queries karena tidak didukung di React Query v5
    },
    mutations: {
      retry: (failureCount, error) => {
        // Don't retry mutations on client errors (4xx)
        const hasResponse = error && typeof error === 'object' && 'response' in error;
        const response = hasResponse ? (error as ErrorWithResponse).response : null;
        
        if (response?.status && response.status >= 400 && response.status < 500) {
          return false;
        }
        return failureCount < 2; // Retry once for server errors
      },
      // Hapus onError dari mutations karena tidak didukung di React Query v5
    },
  },
});

// Export handleQueryError untuk digunakan di hooks
export { handleQueryError };
