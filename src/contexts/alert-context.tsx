import { createContext, useContext } from "react";

// Define the types needed for the context
export type AlertType = "success" | "error" | "confirm";

export interface AlertContextType {
  showAlert: (
    type: AlertType,
    message: string,
    title?: string
  ) => Promise<boolean>;
}

// Create and export the context
export const AlertContext = createContext<AlertContextType | undefined>(
  undefined
);

// Create and export the custom hook
export function useAlert() {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
}
