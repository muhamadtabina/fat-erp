export interface Entity {
  id: string;
  name: string;
  businessType: string;
  npwp: string;
  status: "ACTIVE" | "INACTIVE";
  created_at: string;
}

export const BUSINESS_TYPES = [
  "PT (Perseroan Terbatas)",
  "CV (Commanditaire Vennootschap)",
  "UD (Usaha Dagang)",
  "Firma",
  "Koperasi",
  "Yayasan",
  "Perorangan",
] as const;

export type BusinessType = (typeof BUSINESS_TYPES)[number];
