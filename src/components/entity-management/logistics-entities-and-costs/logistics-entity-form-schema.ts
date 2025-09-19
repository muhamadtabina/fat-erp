import { z } from "zod";

export const logisticsEntityFormSchema = z.object({
  namaEntitasInternal: z
    .string()
    .min(1, "Nama Entitas Internal wajib diisi")
    .min(3, "Nama Entitas Internal minimal 3 karakter")
    .max(100, "Nama Entitas Internal maksimal 100 karakter"),
  
  kodeEntitas: z
    .string()
    .min(1, "Kode Entitas wajib diisi")
    .min(3, "Kode Entitas minimal 3 karakter")
    .max(20, "Kode Entitas maksimal 20 karakter")
    .regex(/^[A-Z0-9-]+$/, "Kode Entitas hanya boleh mengandung huruf kapital, angka, dan tanda hubung"),
  
  deskripsi: z
    .string()
    .min(1, "Deskripsi wajib diisi")
    .min(10, "Deskripsi minimal 10 karakter")
    .max(500, "Deskripsi maksimal 500 karakter"),
});

export type LogisticsEntityFormData = z.infer<typeof logisticsEntityFormSchema>;