import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import type { LogisticsEntity } from "./logistics-entity-types";

export type { LogisticsEntity };

export const createColumns = (
  onEditEntity?: (entity: LogisticsEntity) => void,
  onDeleteEntity?: (entity: LogisticsEntity) => void,
  onToggleStatus?: (entity: LogisticsEntity) => void
): ColumnDef<LogisticsEntity>[] => [
  {
    accessorKey: "namaEntitasInternal",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 lg:px-3"
        >
          Nama Entitas Internal
          <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("namaEntitasInternal")}</div>;
    },
  },
  {
    accessorKey: "kodeEntitas",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 lg:px-3"
        >
          Kode Entitas
          <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <div className="font-mono text-sm">{row.getValue("kodeEntitas")}</div>;
    },
  },
  {
    accessorKey: "deskripsi",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 lg:px-3"
        >
          Deskripsi
          <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const deskripsi = row.getValue("deskripsi") as string;
      return (
        <div className="max-w-[300px] truncate" title={deskripsi}>
          {deskripsi}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 lg:px-3"
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <div
          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
            status === "ACTIVE"
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
          }`}
        >
          {status === "ACTIVE" ? "Aktif" : "Tidak Aktif"}
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const entity = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(entity.id)}
            >
              Copy entity ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onEditEntity?.(entity)}>
              Edit entitas
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onToggleStatus?.(entity)}>
              {entity.status === "ACTIVE" ? "Nonaktifkan" : "Aktifkan"} entitas
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDeleteEntity?.(entity)}
              className="text-red-600"
            >
              Delete entitas
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];