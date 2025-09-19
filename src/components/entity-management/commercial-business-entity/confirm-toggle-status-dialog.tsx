import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle, Power } from "lucide-react";
import { Loader2 } from "lucide-react";
import type { Entity } from "./columns";

interface ConfirmToggleStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entity: Entity | null;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function ConfirmToggleStatusDialog({
  open,
  onOpenChange,
  entity,
  onConfirm,
  isLoading = false,
}: ConfirmToggleStatusDialogProps) {
  const handleConfirm = () => {
    onConfirm();
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  if (!entity) return null;

  const isDeactivating = entity.status === "ACTIVE";
  const actionText = isDeactivating ? "Nonaktifkan" : "Aktifkan";
  const actionDescription = isDeactivating
    ? "Entitas ini akan dinonaktifkan dan tidak dapat digunakan untuk transaksi."
    : "Entitas ini akan diaktifkan kembali dan dapat digunakan untuk transaksi.";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-w-[95vw]">
        <DialogHeader className="pb-4">
          <div className="flex items-start sm:items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full flex-shrink-0 ${
                isDeactivating
                  ? "bg-orange-100 dark:bg-orange-900/30"
                  : "bg-green-100 dark:bg-green-900/30"
              }`}
            >
              <Power
                className={`h-5 w-5 ${
                  isDeactivating
                    ? "text-orange-600 dark:text-orange-400"
                    : "text-green-600 dark:text-green-400"
                }`}
              />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-left text-lg font-semibold">
                {actionText} Entitas
              </DialogTitle>
              <DialogDescription className="text-left text-sm text-muted-foreground">
                {actionDescription}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-lg bg-muted/50 p-4 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="flex flex-col sm:flex-row sm:justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Nama Entitas:
                </span>
                <span className="text-sm font-medium truncate">
                  {entity.name}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Tipe Bisnis:
                </span>
                <span className="text-sm font-medium truncate">
                  {entity.businessType}
                </span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                NPWP:
              </span>
              <span className="text-sm font-mono font-medium">
                {entity.npwp}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                Status Saat Ini:
              </span>
              <span
                className={`text-sm font-medium ${
                  entity.status === "ACTIVE"
                    ? "text-green-600 dark:text-green-400"
                    : "text-gray-600 dark:text-gray-400"
                }`}
              >
                {entity.status === "ACTIVE" ? "Aktif" : "Non-aktif"}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                Status Setelah Perubahan:
              </span>
              <span
                className={`text-sm font-medium ${
                  !isDeactivating
                    ? "text-green-600 dark:text-green-400"
                    : "text-gray-600 dark:text-gray-400"
                }`}
              >
                {isDeactivating ? "Non-aktif" : "Aktif"}
              </span>
            </div>
          </div>

          {isDeactivating && (
            <div className="rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 p-4">
              <div className="flex gap-3">
                <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-orange-800 dark:text-orange-200 mb-1">
                    Peringatan
                  </p>
                  <p className="text-orange-700 dark:text-orange-300">
                    Entitas yang dinonaktifkan tidak dapat digunakan untuk mencatat
                    transaksi baru. Pastikan tidak ada transaksi yang sedang
                    berjalan dengan entitas ini.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
            className="w-full sm:w-auto text-sm"
          >
            Batal
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={isLoading}
            className={`w-full sm:w-auto text-sm ${
              isDeactivating 
                ? "bg-orange-600 hover:bg-orange-700 dark:bg-orange-600 dark:hover:bg-orange-700" 
                : "bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700"
            }`}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {actionText} Entitas
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}