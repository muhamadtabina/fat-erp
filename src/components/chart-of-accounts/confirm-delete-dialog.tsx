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
import type { Account } from "./chart-of-accounts";

interface ConfirmDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  account: Account | null;
  onAccountDeleted: (accountId: string) => void;
}

export function ConfirmDeleteDialog({
  open,
  onOpenChange,
  account,
  onAccountDeleted,
}: ConfirmDeleteDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirmDelete = async () => {
    if (!account) return;

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      onAccountDeleted(account.id);
      onOpenChange(false);
    } catch (error) {
      console.error("Error deleting account:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  if (!account) return null;

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
                Hapus Akun
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
                  Kode Akun:
                </span>
                <span className="text-sm font-mono font-medium">
                  {account.code}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Tipe:
                </span>
                <span className="text-sm font-medium">{account.type}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between border-t pt-2">
              <span className="text-sm font-medium text-muted-foreground">
                Nama Akun:
              </span>
              <span className="text-sm font-medium break-words">
                {account.name}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between border-t pt-2">
              <span className="text-sm font-medium text-muted-foreground">
                Saldo:
              </span>
              <span className="text-sm font-semibold">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(account.balance)}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-800 dark:text-red-200 leading-relaxed">
              <strong>Peringatan:</strong> Menghapus akun ini akan menghapus
              semua data terkait dan tidak dapat dikembalikan. Pastikan akun ini
              tidak memiliki transaksi yang masih aktif.
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
            {isLoading ? "Menghapus..." : "Ya, Hapus Akun"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
