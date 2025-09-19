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
import { useRegister } from "@/hooks/use-auth";

import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface AddUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserAdded: () => void;
}

const roles = [
  { value: "Admin", label: "Admin" },
  { value: "Lead Accountant", label: "Lead Accountant" },
  { value: "Kitchen Accountant", label: "Kitchen Accountant" },
  { value: "Junior Accountant", label: "Junior Accountant" },
  { value: "Ahli Gizi", label: "Ahli Gizi" },
];

// REFACTOR: Menggunakan const assertion untuk type safety yang lebih baik
const ALL_ROLES = [
  "Admin",
  "Lead Accountant",
  "Kitchen Accountant",
  "Junior Accountant",
  "Ahli Gizi",
] as const;

const FormSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
  role: z.enum(ALL_ROLES, {
    message: "Role wajib dipilih.",
  }),
});

type FormData = z.infer<typeof FormSchema>;

export function AddUserDialog({
  open,
  onOpenChange,
  onUserAdded,
}: AddUserDialogProps) {
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: undefined as unknown as FormData["role"],
    },
    mode: "onBlur",
  });

  // REFACTOR: Menggabungkan logika menutup dialog dan mereset form
  const handleCloseAndReset = () => {
    reset();
    onOpenChange(false);
  };

  const onSubmit = async (data: FormData) => {
    registerMutation.mutate(data, {
      onSuccess: () => {
        onUserAdded();
        handleCloseAndReset();
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-lg font-semibold">
            Tambah User Baru
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Isi form di bawah untuk menambahkan user baru ke sistem.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Nama *
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Masukkan nama lengkap"
              {...register("name")}
              disabled={registerMutation.isPending}
              aria-invalid={!!errors.name}
              className="text-sm"
            />
            {errors.name && (
              <p className="text-xs text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email *
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Masukkan email"
              {...register("email")}
              disabled={registerMutation.isPending}
              aria-invalid={!!errors.email}
              className="text-sm"
            />
            {errors.email && (
              <p className="text-xs text-red-600">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Password *
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Masukkan password (min. 8 karakter)"
              {...register("password")}
              disabled={registerMutation.isPending}
              aria-invalid={!!errors.password}
              className="text-sm"
            />
            {errors.password && (
              <p className="text-xs text-red-600">{errors.password.message}</p>
            )}
          </div>

          {/* Role (Select needs Controller) */}
          <div className="space-y-2">
            <Label htmlFor="role" className="text-sm font-medium">
              Role *
            </Label>
            <Controller
              control={control}
              name="role"
              render={({ field }) => (
                <Select
                  disabled={registerMutation.isPending}
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <SelectTrigger id="role" className="text-sm">
                    <SelectValue placeholder="Pilih role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((r) => (
                      <SelectItem
                        key={r.value}
                        value={r.value}
                        className="text-sm"
                      >
                        {r.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.role && (
              <p className="text-xs text-red-600">{errors.role.message}</p>
            )}
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleCloseAndReset}
              disabled={registerMutation.isPending}
              className="w-full sm:w-auto"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={registerMutation.isPending}
              className="w-full sm:w-auto"
            >
              {registerMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {registerMutation.isPending ? "Menambahkan..." : "Tambah User"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
