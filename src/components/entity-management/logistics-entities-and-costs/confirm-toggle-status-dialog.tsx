import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle, Power, Loader2 } from "lucide-react";
import { type LogisticsEntity } from "./logistics-entity-types";

interface ConfirmToggleStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entity: LogisticsEntity | null;
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
    ? "Entitas logistik ini akan dinonaktifkan dan tidak dapat digunakan untuk operasi logistik."
    : "Entitas logistik ini akan diaktifkan kembali dan dapat digunakan untuk operasi logistik.";

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
                {actionText} Entitas Logistik
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
                  {entity.namaEntitasInternal}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Kode Entitas:
                </span>
                <span className="text-sm font-mono font-medium">
                  {entity.kodeEntitas}
                </span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:justify-between border-t pt-2">
              <span className="text-sm font-medium text-muted-foreground">
                Deskripsi:
              </span>
              <span className="text-sm font-medium text-right max-w-xs break-words">
                {entity.deskripsi}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between border-t pt-2">
              <span className="text-sm font-medium text-muted-foreground">
                Status Saat Ini:
              </span>
              <span
                className={`text-sm font-medium ${
                  entity.status === "ACTIVE"
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {entity.status === "ACTIVE" ? "Aktif" : "Tidak Aktif"}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between border-t pt-2">
              <span className="text-sm font-medium text-muted-foreground">
                Status Setelah Perubahan:
              </span>
              <span
                className={`text-sm font-medium ${
                  !isDeactivating
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {!isDeactivating ? "Aktif" : "Tidak Aktif"}
              </span>
            </div>
          </div>

          {isDeactivating && (
            <div className="rounded-lg bg-orange-50 dark:bg-orange-900/20 p-4 border border-orange-200 dark:border-orange-800">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-orange-800 dark:text-orange-200">
                    Peringatan Nonaktifkan Entitas
                  </h4>
                  <p className="text-sm text-orange-700 dark:text-orange-300">
                    Menonaktifkan entitas logistik ini akan:
                  </p>
                  <ul className="text-sm text-orange-700 dark:text-orange-300 list-disc list-inside space-y-1 ml-2">
                    <li>Menghentikan semua operasi logistik yang menggunakan entitas ini</li>
                    <li>Mempengaruhi laporan dan analisis yang sedang berjalan</li>
                    <li>Dapat diaktifkan kembali kapan saja jika diperlukan</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {!isDeactivating && (
            <div className="rounded-lg bg-green-50 dark:bg-green-900/20 p-4 border border-green-200 dark:border-green-800">
              <div className="flex items-start gap-3">
                <Power className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-green-800 dark:text-green-200">
                    Aktivasi Entitas
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Mengaktifkan entitas logistik ini akan:
                  </p>
                  <ul className="text-sm text-green-700 dark:text-green-300 list-disc list-inside space-y-1 ml-2">
                    <li>Memungkinkan entitas untuk digunakan dalam operasi logistik</li>
                    <li>Mengembalikan akses ke semua fitur dan fungsi</li>
                    <li>Melanjutkan pelacakan dan pelaporan data</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

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
        </div>
      </DialogContent>
    </Dialog>
  );
}