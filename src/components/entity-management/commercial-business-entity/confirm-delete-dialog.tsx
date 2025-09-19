import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";
import { type Entity } from "./entity-types";

interface ConfirmDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entity: Entity | null;
  onEntityDeleted: (entityId: string) => void;
}

export function ConfirmDeleteDialog({
  open,
  onOpenChange,
  entity,
  onEntityDeleted,
}: ConfirmDeleteDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirmDelete = async () => {
    if (!entity) return;

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      onEntityDeleted(entity.id);
      onOpenChange(false);
    } catch (error) {
      console.error("Error deleting entity:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  if (!entity) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-left text-lg font-semibold">
                Hapus Entitas
              </DialogTitle>
              <DialogDescription className="text-left text-sm text-muted-foreground">
                Tindakan ini tidak dapat dibatalkan.
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
                <span className="text-sm font-medium break-words">
                  {entity.name}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Tipe Bisnis:
                </span>
                <span className="text-sm font-medium">
                  {entity.businessType}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between border-t pt-2">
              <span className="text-sm font-medium text-muted-foreground">
                NPWP:
              </span>
              <span className="text-sm font-mono font-medium">
                {entity.npwp}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between border-t pt-2">
              <span className="text-sm font-medium text-muted-foreground">
                Status:
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

            <div className="flex flex-col sm:flex-row sm:justify-between border-t pt-2">
              <span className="text-sm font-medium text-muted-foreground">
                Dibuat:
              </span>
              <span className="text-sm font-medium">
                {new Date(entity.created_at).toLocaleDateString("id-ID", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-800 dark:text-red-200 leading-relaxed">
              <strong>Peringatan:</strong> Menghapus entitas ini akan menghapus
              semua data terkait termasuk transaksi, laporan, dan konfigurasi
              yang berhubungan dengan entitas ini. Tindakan ini tidak dapat
              dikembalikan. Pastikan entitas ini tidak memiliki transaksi yang
              masih aktif.
            </p>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            Batal
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirmDelete}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading ? "Menghapus..." : "Ya, Hapus Entitas"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
