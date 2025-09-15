// src/components/providers/AlertProvider.tsx

import { useState } from "react";
import type { ReactNode } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CheckCircle, XCircle, HelpCircle } from "lucide-react";

// Import the context and types from the new file
import { AlertContext, type AlertType } from "@/contexts/AlertContext"; // Adjust the import path if necessary

// Define the internal state type for the provider
interface AlertState {
  isOpen: boolean;
  type: AlertType;
  title: string;
  message: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

// Export ONLY the component from this file
export function AlertProvider({ children }: { children: ReactNode }) {
  const [alertState, setAlertState] = useState<AlertState>({
    isOpen: false,
    type: "success",
    title: "",
    message: "",
  });

  const showAlert = (
    type: AlertType,
    message: string,
    title?: string
  ): Promise<boolean> => {
    return new Promise((resolve) => {
      const defaultTitles = {
        success: "Success",
        error: "Oops", // Corrected typo from "Ups"
        confirm: "Are you sure?",
      };

      setAlertState({
        isOpen: true,
        type,
        title: title || defaultTitles[type],
        message,
        onConfirm: () => {
          setAlertState((prev) => ({ ...prev, isOpen: false }));
          resolve(true);
        },
        onCancel: () => {
          setAlertState((prev) => ({ ...prev, isOpen: false }));
          resolve(false);
        },
      });
    });
  };

  const getIcon = () => {
    switch (alertState.type) {
      case "success":
        return <CheckCircle className="h-6 w-6 text-green-600" />;
      case "error":
        return <XCircle className="h-6 w-6 text-red-600" />;
      case "confirm":
        return <HelpCircle className="h-6 w-6 text-blue-600" />;
      default:
        return null;
    }
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <AlertDialog
        open={alertState.isOpen}
        onOpenChange={(open) => {
          if (!open) {
            // This ensures clicking outside or pressing Escape resolves the promise as "false"
            alertState.onCancel?.();
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              {getIcon()}
              {alertState.title}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {alertState.message}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            {alertState.type === "confirm" ? (
              <>
                <AlertDialogCancel onClick={alertState.onCancel}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction onClick={alertState.onConfirm}>
                  Yes
                </AlertDialogAction>
              </>
            ) : (
              <AlertDialogAction onClick={alertState.onConfirm}>
                OK
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AlertContext.Provider>
  );
}
