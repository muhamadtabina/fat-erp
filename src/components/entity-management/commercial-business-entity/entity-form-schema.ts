import * as z from "zod";
import { BUSINESS_TYPES } from "./entity-types";

// Bank account schema
const bankAccountSchema = z.object({
  bankName: z.string().min(1, "Nama bank wajib diisi"),
  accountNumber: z.string().min(1, "Nomor rekening wajib diisi"),
  accountName: z.string().min(1, "Nama pemilik rekening wajib diisi"),
});

// Main entity form schema
export const entityFormSchema = z.object({
  legalName: z.string().min(1, "Nama entitas legal wajib diisi"),
  entityType: z.string().min(1, "Tipe badan usaha wajib dipilih"),
  npwp: z
    .string()
    .min(1, "NPWP wajib diisi")
    .regex(
      /^\d{2}\.\d{3}\.\d{3}\.\d{1}-\d{3}\.\d{3}$/,
      "Format NPWP tidak valid (contoh: 00.000.000.0-000.000)"
    ),
  address: z.string().min(1, "Alamat lengkap wajib diisi"),
  email: z
    .string()
    .min(1, "Email wajib diisi")
    .email("Format email tidak valid"),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[\d\s\-+()]+$/.test(val),
      "Format nomor telepon tidak valid"
    ),
  bankAccounts: z
    .array(bankAccountSchema)
    .min(1, "Minimal satu rekening bank harus diisi"),
  startDate: z.string().optional(),
  openingBalance: z
    .string()
    .optional()
    .refine(
      (val) => !val || !isNaN(Number(val)),
      "Saldo awal harus berupa angka"
    ),
});

export type EntityFormData = z.infer<typeof entityFormSchema>;

// Business type options for select component
export const BUSINESS_TYPE_OPTIONS = BUSINESS_TYPES.map((type) => ({
  value: type,
  label: type,
}));
