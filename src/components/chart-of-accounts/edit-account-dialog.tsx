import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Account } from "./chart-of-accounts";

interface EditAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  account: Account | null;
  onAccountUpdated: (account: Account) => void;
}

export function EditAccountDialog({
  open,
  onOpenChange,
  account,
  onAccountUpdated,
}: EditAccountDialogProps) {
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    type: "DEBIT" as "DEBIT" | "CREDIT",
    status: "ACTIVE" as "ACTIVE" | "INACTIVE",
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (account) {
      setFormData({
        code: account.code,
        name: account.name,
        type: account.type,
        status: account.status,
      });
    }
  }, [account]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account) return;

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const updatedAccount: Account = {
        ...account,
        code: formData.code,
        name: formData.name,
        type: formData.type,
        status: formData.status,
      };

      onAccountUpdated(updatedAccount);
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating account:", error);
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
          <DialogTitle className="text-lg font-semibold">Edit Akun</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Ubah informasi akun. Klik simpan untuk menyimpan perubahan.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Account Code */}
          <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
            <Label htmlFor="code" className="text-sm font-medium sm:text-right">
              Kode Akun
            </Label>
            <div className="sm:col-span-3">
              <Input
                id="code"
                name="code"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
                placeholder="Masukkan kode akun"
                className="w-full"
                required
              />
            </div>
          </div>

          {/* Account Name */}
          <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
            <Label htmlFor="name" className="text-sm font-medium sm:text-right">
              Nama Akun
            </Label>
            <div className="sm:col-span-3">
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Masukkan nama akun"
                className="w-full"
                required
              />
            </div>
          </div>

          {/* Account Type */}
          <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
            <Label htmlFor="type" className="text-sm font-medium sm:text-right">
              Tipe Akun
            </Label>
            <div className="sm:col-span-3">
              <Select
                value={formData.type}
                onValueChange={(value: "DEBIT" | "CREDIT") =>
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih tipe akun" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DEBIT">DEBIT</SelectItem>
                  <SelectItem value="CREDIT">CREDIT</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Account Status */}
          <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
            <Label
              htmlFor="status"
              className="text-sm font-medium sm:text-right"
            >
              Status
            </Label>
            <div className="sm:col-span-3">
              <Select
                value={formData.status}
                onValueChange={(value: "ACTIVE" | "INACTIVE") =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger className="w-full text-sm">
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE" className="text-sm">
                    Aktif
                  </SelectItem>
                  <SelectItem value="INACTIVE" className="text-sm">
                    Non-aktif
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Action Buttons */}
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
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto text-sm"
            >
              {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
