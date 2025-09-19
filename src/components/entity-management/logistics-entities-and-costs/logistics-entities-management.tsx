import { DataTable } from "./data-table";
import { createColumns, type LogisticsEntity } from "./columns";
import { useState } from "react";
import { useNavigate } from "react-router";
import { ConfirmDeleteDialog } from "./confirm-delete-dialog";
import { ConfirmToggleStatusDialog } from "./confirm-toggle-status-dialog";

// Sample logistics entity data
const sampleLogisticsEntities: LogisticsEntity[] = [
  {
    id: "1",
    namaEntitasInternal: "Pusat Logistik & Distribusi - GMC",
    kodeEntitas: "PLD-001",
    deskripsi:
      "Fungsi utama entitas ini adalah mengelola distribusi barang dari gudang pusat ke berbagai cabang dan outlet retail di seluruh Indonesia.",
    status: "ACTIVE",
    created_at: "2024-01-15T08:30:00Z",
  },
  {
    id: "2",
    namaEntitasInternal: "Warehouse Management System",
    kodeEntitas: "WMS-002",
    deskripsi:
      "Sistem manajemen gudang yang mengatur penyimpanan, pengambilan, dan tracking inventory secara real-time.",
    status: "ACTIVE",
    created_at: "2024-02-20T10:15:00Z",
  },
  {
    id: "3",
    namaEntitasInternal: "Transportation Hub Jakarta",
    kodeEntitas: "THJ-003",
    deskripsi:
      "Hub transportasi utama untuk wilayah Jakarta dan sekitarnya, menangani pengiriman last-mile delivery.",
    status: "INACTIVE",
    created_at: "2024-03-10T14:45:00Z",
  },
  {
    id: "4",
    namaEntitasInternal: "Cold Chain Logistics",
    kodeEntitas: "CCL-004",
    deskripsi:
      "Spesialisasi dalam penanganan produk yang memerlukan suhu terkontrol seperti makanan beku dan obat-obatan.",
    status: "ACTIVE",
    created_at: "2024-04-05T09:20:00Z",
  },
  {
    id: "5",
    namaEntitasInternal: "E-commerce Fulfillment Center",
    kodeEntitas: "EFC-005",
    deskripsi:
      "Pusat pemenuhan pesanan khusus untuk platform e-commerce dengan automated sorting dan packaging.",
    status: "ACTIVE",
    created_at: "2024-05-12T11:30:00Z",
  },
];

export default function LogisticsEntitiesManagement() {
  const navigate = useNavigate();
  const [entities, setEntities] = useState<LogisticsEntity[]>(
    sampleLogisticsEntities
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isToggleStatusDialogOpen, setIsToggleStatusDialogOpen] =
    useState(false);
  const [selectedEntity, setSelectedEntity] = useState<LogisticsEntity | null>(
    null
  );

  const handleAddEntity = () => {
    navigate("/logistics-entities-and-costs/add");
  };

  const handleEditEntity = (entity: LogisticsEntity) => {
    navigate(`/logistics-entities-and-costs/edit/${entity.id}`);
  };

  const handleEntityUpdated = (updatedEntity: LogisticsEntity) => {
    const updatedEntities = entities.map((e) =>
      e.id === updatedEntity.id ? updatedEntity : e
    );
    setEntities(updatedEntities);
    console.log("Entity updated:", updatedEntity);
  };

  const handleDeleteEntity = (entity: LogisticsEntity) => {
    setSelectedEntity(entity);
    setIsDeleteDialogOpen(true);
  };

  const handleEntityDeleted = (entityId: string) => {
    const updatedEntities = entities.filter((e) => e.id !== entityId);
    setEntities(updatedEntities);
    console.log("Entity deleted:", entityId);
  };

  const handleToggleStatus = (entity: LogisticsEntity) => {
    setSelectedEntity(entity);
    setIsToggleStatusDialogOpen(true);
  };

  const handleConfirmToggleStatus = () => {
    if (selectedEntity) {
      const newStatus: "ACTIVE" | "INACTIVE" =
        selectedEntity.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

      const updatedEntity = { ...selectedEntity, status: newStatus };
      handleEntityUpdated(updatedEntity);
      setIsToggleStatusDialogOpen(false);

      console.log(
        `Status entitas ${selectedEntity.namaEntitasInternal} berhasil diubah menjadi ${newStatus}`
      );
    }
  };

  const columns = createColumns(
    handleEditEntity,
    handleDeleteEntity,
    handleToggleStatus
  );

  return (
    <div className="container mx-auto">
      <div className="mb-2">
        <h1 className="text-2xl font-bold tracking-tight">
          Logistics Entities & Costs
        </h1>
        <p className="text-muted-foreground">
          Kelola entitas logistik dan biaya operasional untuk sistem distribusi
          perusahaan
        </p>
      </div>

      <DataTable
        columns={columns}
        data={entities}
        onAddEntity={handleAddEntity}
        onEditEntity={handleEditEntity}
        onDeleteEntity={handleDeleteEntity}
        onToggleStatus={handleToggleStatus}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        entity={selectedEntity}
        onEntityDeleted={handleEntityDeleted}
      />

      {/* Confirm Toggle Status Dialog */}
      <ConfirmToggleStatusDialog
        open={isToggleStatusDialogOpen}
        onOpenChange={setIsToggleStatusDialogOpen}
        onConfirm={handleConfirmToggleStatus}
        entity={selectedEntity}
      />
    </div>
  );
}
