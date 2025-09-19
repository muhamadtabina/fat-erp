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
import type { Entity } from "./entity-types";

export type { Entity };

export const createColumns = (
  onEditEntity?: (entity: Entity) => void,
  onDeleteEntity?: (entity: Entity) => void,
  onToggleStatus?: (entity: Entity) => void
): ColumnDef<Entity>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 lg:px-3"
        >
          Nama Entitas
          <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("name")}</div>;
    },
  },
  {
    accessorKey: "businessType",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 lg:px-3"
        >
          Tipe Badan Usaha
          <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <div>{row.getValue("businessType")}</div>;
    },
  },
  {
    accessorKey: "npwp",
    header: "NPWP",
    cell: ({ row }) => {
      const npwp = row.getValue("npwp") as string;
      return <div className="font-mono text-sm">{npwp}</div>;
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
        <div className="flex items-center">
          <span
            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
              status === "ACTIVE"
                ? "bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20 dark:bg-green-400/10 dark:text-green-400 dark:ring-green-400/30"
                : "bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20 dark:bg-red-400/10 dark:text-red-400 dark:ring-red-400/30"
            }`}
          >
            {status === "ACTIVE" ? "Aktif" : "Tidak Aktif"}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 lg:px-3"
        >
          Tanggal Dibuat
          <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("created_at"));
      return <div>{date.toLocaleDateString("id-ID")}</div>;
    },
  },
  {
    id: "actions",
    header: "Aksi",
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
            <DropdownMenuLabel>Aksi</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(entity.id)}
            >
              Salin ID Entitas
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onEditEntity?.(entity)}>
              Edit Entitas
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onToggleStatus?.(entity)}>
              {entity.status === "ACTIVE" ? "Non-aktifkan" : "Aktifkan"}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDeleteEntity?.(entity)}
              className="text-red-600"
            >
              Hapus Entitas
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
