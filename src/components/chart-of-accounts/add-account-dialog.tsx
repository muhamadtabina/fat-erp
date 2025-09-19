import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";

const ACCOUNT_TYPES = ["DEBIT", "CREDIT"] as const;

const ACCOUNT_CATEGORIES = [
  { value: "aset", label: "Aset" },
  { value: "kewajiban", label: "Kewajiban" },
  { value: "modal", label: "Modal" },
  { value: "pendapatan", label: "Pendapatan" },
  { value: "beban", label: "Beban" },
] as const;

const NORMAL_BALANCE_OPTIONS = [
  { value: "DEBIT", label: "Debit" },
  { value: "CREDIT", label: "Credit" },
] as const;

const ACCOUNT_TYPE_OPTIONS = [
  {
    value: "control",
    label: "Akun Induk (Control Account)",
    description:
      "Akun ini hanya berfungsi sebagai judul/folder dan tidak dapat digunakan untuk mencatat transaksi",
  },
  {
    value: "detail",
    label: "Akun Detail (Postable Account)",
    description:
      "Akun ini dapat digunakan untuk mencatat transaksi jurnal secara langsung",
  },
] as const;

// Updated schema with category field
const formSchema = z.object({
  code: z.string().min(1, "Nomor akun harus diisi"),
  name: z.string().min(1, "Nama akun harus diisi"),
  category: z.string().min(1, "Kategori akun harus dipilih"),
  normalBalance: z.enum(ACCOUNT_TYPES),
  accountType: z.enum(["control", "detail"]),
  parentId: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface AddAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAccountAdded?: () => void;
}

// Sample parent accounts data
const parentAccounts = [
  { id: "1000", name: "ASET" },
  { id: "1100", name: "Aset Lancar" },
  { id: "2000", name: "KEWAJIBAN" },
  { id: "2100", name: "Kewajiban Lancar" },
  { id: "3000", name: "MODAL" },
  { id: "4000", name: "PENDAPATAN" },
  { id: "5000", name: "BEBAN" },
];

export function AddAccountDialog({
  open,
  onOpenChange,
  onAccountAdded,
}: AddAccountDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
      name: "",
      category: "",
      normalBalance: "DEBIT" as const,
      accountType: "detail" as const,
      parentId: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      console.log("Form data:", data);
      // TODO: Implement API call to save account
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

      onAccountAdded?.();
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error("Error saving account:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-full max-w-[95vw]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Buat Akun Baru
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Tambahkan akun baru ke dalam Chart of Accounts
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Account Code */}
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Nomor Akun *
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="contoh: 1104"
                        className="text-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              {/* Account Category */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Kategori Akun *
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="text-sm">
                          <SelectValue placeholder="Pilih kategori akun" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ACCOUNT_CATEGORIES.map((category) => (
                          <SelectItem
                            key={category.value}
                            value={category.value}
                            className="text-sm"
                          >
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            {/* Account Name - Full Width */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Nama Akun *
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="contoh: Beban Gaji Karyawan"
                      className="text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Normal Balance */}
              <FormField
                control={form.control}
                name="normalBalance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Saldo Normal *
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="text-sm">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {NORMAL_BALANCE_OPTIONS.map((option) => (
                          <SelectItem
                            key={option.value}
                            value={option.value}
                            className="text-sm"
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              {/* Parent Account */}
              <FormField
                control={form.control}
                name="parentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Akun Induk
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="text-sm">
                          <SelectValue placeholder="Pilih akun induk (opsional)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {parentAccounts.map((account) => (
                          <SelectItem
                            key={account.id}
                            value={account.id}
                            className="text-sm"
                          >
                            {account.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            {/* Account Type Radio Group - Full Width */}
            <FormField
              control={form.control}
              name="accountType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Tipe Akun *
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="space-y-3"
                    >
                      {ACCOUNT_TYPE_OPTIONS.map((option) => (
                        <div
                          key={option.value}
                          className="flex items-start space-x-3 p-3 sm:p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
                        >
                          <RadioGroupItem
                            value={option.value}
                            id={`account-type-${option.value}`}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <Label
                              htmlFor={`account-type-${option.value}`}
                              className="font-medium cursor-pointer text-sm block"
                            >
                              {option.label}
                            </Label>
                            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                              {option.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

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
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Simpan Akun
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
