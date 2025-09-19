export interface LogisticsEntity {
  id: string;
  namaEntitasInternal: string;
  kodeEntitas: string;
  deskripsi: string;
  status: "ACTIVE" | "INACTIVE";
  created_at: string;
}