import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useUpdateUser } from "@/hooks/use-users";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface EditUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserUpdated: () => void;
  user: User | null;
}

interface FormData {
  name: string;
  email: string;
  role: string;
}

const roles = [{ value: "Admin", label: "Admin" }];

export function EditUserDialog({
  open,
  onOpenChange,
  onUserUpdated,
  user,
}: EditUserDialogProps) {
  const updateUserMutation = useUpdateUser();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    role: "",
  });

  // Update form data when user prop changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
      });
    }
  }, [user]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.role) {
      return;
    }

    if (!user) {
      return;
    }

    updateUserMutation.mutate(
      {
        id: user.id,
        data: {
          name: formData.name,
          email: formData.email,
          role: formData.role,
        },
      },
      {
        onSuccess: () => {
          onUserUpdated();
          onOpenChange(false);
        },
      }
    );
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
      });
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-lg font-semibold">Edit User</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Perbarui informasi user di bawah ini.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Nama
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Masukkan nama lengkap"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              disabled={updateUserMutation.isPending}
              required
              className="text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Masukkan email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              disabled={updateUserMutation.isPending}
              required
              className="text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role" className="text-sm font-medium">
              Role
            </Label>
            <Select
              value={formData.role}
              onValueChange={(value) => handleInputChange("role", value)}
              disabled={updateUserMutation.isPending}
              required
            >
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="Pilih role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem
                    key={role.value}
                    value={role.value}
                    className="text-sm"
                  >
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={updateUserMutation.isPending}
              className="w-full sm:w-auto"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={updateUserMutation.isPending}
              className="w-full sm:w-auto"
            >
              {updateUserMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {updateUserMutation.isPending
                ? "Memperbarui..."
                : "Perbarui User"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
