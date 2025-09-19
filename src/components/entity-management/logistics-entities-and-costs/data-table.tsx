import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type {
  ColumnDef,
  SortingState,
  ColumnFiltersState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTablePagination } from "@/components/table-pagination";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, MoreHorizontal } from "lucide-react";
import type { LogisticsEntity } from "./logistics-entity-types";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onAddEntity?: () => void;
  onEditEntity?: (entity: LogisticsEntity) => void;
  onDeleteEntity?: (entity: LogisticsEntity) => void;
  onToggleStatus?: (entity: LogisticsEntity) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onAddEntity,
  onEditEntity,
  onDeleteEntity,
  onToggleStatus,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
  });

  return (
    <div>
      {/* Header Section - Mobile Responsive */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4">
        <Input
          placeholder="Cari entitas logistik..."
          value={(table.getColumn("namaEntitasInternal")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("namaEntitasInternal")?.setFilterValue(event.target.value)
          }
          className="w-full sm:max-w-sm"
        />
        {onAddEntity && (
          <Button onClick={onAddEntity} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Tambah Entitas
          </Button>
        )}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Tidak ada data entitas logistik.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={columns.length}>
                <DataTablePagination table={table} />
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>

      {/* Mobile Card Layout */}
      <div className="md:hidden space-y-4">
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => {
            const entity = row.original as LogisticsEntity;
            return (
              <div
                key={row.id}
                className="bg-card border rounded-lg p-4 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <h3 className="font-medium text-sm">{entity.namaEntitasInternal}</h3>
                    <p className="text-sm text-muted-foreground">
                      {entity.kodeEntitas}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {entity.deskripsi}
                    </p>
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          entity.status === "ACTIVE"
                            ? "bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20 dark:bg-green-400/10 dark:text-green-400 dark:ring-green-400/30"
                            : "bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20 dark:bg-red-400/10 dark:text-red-400 dark:ring-red-400/30"
                        }`}
                      >
                        {entity.status === "ACTIVE" ? "Aktif" : "Tidak Aktif"}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Dibuat:{" "}
                      {new Date(entity.created_at).toLocaleDateString("id-ID")}
                    </p>
                  </div>
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
                        Salin ID
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {onEditEntity && (
                        <DropdownMenuItem onClick={() => onEditEntity(entity)}>
                          Edit
                        </DropdownMenuItem>
                      )}
                      {onToggleStatus && (
                        <DropdownMenuItem onClick={() => onToggleStatus(entity)}>
                          {entity.status === "ACTIVE" ? "Nonaktifkan" : "Aktifkan"}
                        </DropdownMenuItem>
                      )}
                      {onDeleteEntity && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => onDeleteEntity(entity)}
                            className="text-red-600"
                          >
                            Hapus
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Tidak ada data entitas logistik.
          </div>
        )}
        
        {/* Mobile Pagination */}
        <div className="mt-4">
          <DataTablePagination table={table} />
        </div>
      </div>
    </div>
  );
}