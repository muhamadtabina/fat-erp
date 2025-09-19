import { DataTable } from "./data-table";
import { createColumns, type Entity } from "./columns";
import { useState } from "react";
import { useNavigate } from "react-router";
import { ConfirmDeleteDialog } from "./confirm-delete-dialog";
import { ConfirmToggleStatusDialog } from "./confirm-toggle-status-dialog";

// Sample entity data
const sampleEntities: Entity[] = [
  {
    id: "1",
    name: "PT Maju Bersama",
    businessType: "PT (Perseroan Terbatas)",
    npwp: "01.234.567.8-901.000",
    status: "ACTIVE",
    created_at: "2024-01-15T08:30:00Z",
  },
  {
    id: "2",
    name: "CV Sukses Mandiri",
    businessType: "CV (Commanditaire Vennootschap)",
    npwp: "02.345.678.9-012.000",
    status: "ACTIVE",
    created_at: "2024-02-20T10:15:00Z",
  },
  {
    id: "3",
    name: "UD Berkah Jaya",
    businessType: "UD (Usaha Dagang)",
    npwp: "03.456.789.0-123.000",
    status: "INACTIVE",
    created_at: "2024-03-10T14:45:00Z",
  },
  {
    id: "4",
    name: "Koperasi Sejahtera",
    businessType: "Koperasi",
    npwp: "04.567.890.1-234.000",
    status: "ACTIVE",
    created_at: "2024-04-05T09:20:00Z",
  },
  {
    id: "5",
    name: "Yayasan Pendidikan Nusantara",
    businessType: "Yayasan",
    npwp: "05.678.901.2-345.000",
    status: "ACTIVE",
    created_at: "2024-05-12T11:30:00Z",
  },
  {
    id: "6",
    name: "Firma Dagang Utama",
    businessType: "Firma",
    npwp: "06.789.012.3-456.000",
    status: "INACTIVE",
    created_at: "2024-06-18T16:10:00Z",
  },
  {
    id: "7",
    name: "Toko Sari Rasa",
    businessType: "Perorangan",
    npwp: "07.890.123.4-567.000",
    status: "ACTIVE",
    created_at: "2024-07-22T13:25:00Z",
  },
  {
    id: "8",
    name: "PT Teknologi Digital",
    businessType: "PT (Perseroan Terbatas)",
    npwp: "08.901.234.5-678.000",
    status: "ACTIVE",
    created_at: "2024-08-30T07:40:00Z",
  },
];

export default function CommercialBusinessEntity() {
  const navigate = useNavigate();
  const [entities, setEntities] = useState<Entity[]>(sampleEntities);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isToggleStatusDialogOpen, setIsToggleStatusDialogOpen] =
    useState(false);
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);

  const handleAddEntity = () => {
    navigate("/commercial-business-entity/add");
  };

  const handleEditEntity = (entity: Entity) => {
    navigate(`/commercial-business-entity/edit/${entity.id}`);
  };

  const handleEntityUpdated = (updatedEntity: Entity) => {
    const updatedEntities = entities.map((e) =>
      e.id === updatedEntity.id ? updatedEntity : e
    );
    setEntities(updatedEntities);
    console.log("Entity updated:", updatedEntity);
  };

  const handleDeleteEntity = (entity: Entity) => {
    setSelectedEntity(entity);
    setIsDeleteDialogOpen(true);
  };

  const handleEntityDeleted = (entityId: string) => {
    const updatedEntities = entities.filter((e) => e.id !== entityId);
    setEntities(updatedEntities);
    console.log("Entity deleted:", entityId);
  };

  const handleToggleStatus = (entity: Entity) => {
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
        `Status entitas ${selectedEntity.name} berhasil diubah menjadi ${newStatus}`
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
          Commercial Business Entity
        </h1>
        <p className="text-muted-foreground">
          Kelola entitas bisnis dan informasi perusahaan
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
        entity={selectedEntity}
        onConfirm={handleConfirmToggleStatus}
        isLoading={false}
      />
    </div>
  );
}
