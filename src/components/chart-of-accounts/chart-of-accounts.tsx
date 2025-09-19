import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  ChevronRight,
  Plus,
  FolderOpen,
  File,
  MoreHorizontal,
  Edit,
  Power,
  Trash2,
} from "lucide-react";
import { AddAccountDialog } from "./add-account-dialog";
import { EditAccountDialog } from "./edit-account-dialog";
import { ConfirmDeleteDialog } from "./confirm-delete-dialog";
import { ConfirmToggleStatusDialog } from "./confirm-toggle-status-dialog";
// import { useToggleAccountStatus } from "@/hooks/use-accounts";

export interface Account {
  id: string;
  code: string;
  name: string;
  type: "DEBIT" | "CREDIT";
  balance: number;
  status: "ACTIVE" | "INACTIVE";
  parentId?: string;
  children?: Account[];
  isGroup: boolean;
  createdAt: string;
}

// Sample data structure matching the image
const sampleAccounts: Account[] = [
  {
    id: "1000",
    code: "1000",
    name: "ASET",
    type: "DEBIT",
    balance: 1510000000,
    status: "ACTIVE",
    isGroup: true,
    createdAt: "2024-01-15T08:30:00Z",
    children: [
      {
        id: "1100",
        code: "1100",
        name: "Aset Lancar",
        type: "DEBIT",
        balance: 515000000,
        status: "ACTIVE",
        parentId: "1000",
        isGroup: true,
        createdAt: "2024-01-15T08:35:00Z",
        children: [
          {
            id: "1101",
            code: "1101",
            name: "Kas",
            type: "DEBIT",
            balance: 50000000,
            status: "ACTIVE",
            parentId: "1100",
            isGroup: false,
            createdAt: "2024-01-15T08:40:00Z",
          },
          {
            id: "1102",
            code: "1102",
            name: "Bank BCA",
            type: "DEBIT",
            balance: 125000000,
            status: "ACTIVE",
            parentId: "1100",
            isGroup: false,
            createdAt: "2024-01-16T09:15:00Z",
          },
          {
            id: "1103",
            code: "1103",
            name: "Bank Mandiri",
            type: "DEBIT",
            balance: 85000000,
            status: "INACTIVE",
            parentId: "1100",
            isGroup: false,
            createdAt: "2024-01-17T10:20:00Z",
          },
          {
            id: "1104",
            code: "1104",
            name: "Piutang Usaha",
            type: "DEBIT",
            balance: 75000000,
            status: "ACTIVE",
            parentId: "1100",
            isGroup: false,
            createdAt: "2024-01-18T11:30:00Z",
          },
          {
            id: "1105",
            code: "1105",
            name: "Persediaan Barang Dagang",
            type: "DEBIT",
            balance: 180000000,
            status: "ACTIVE",
            parentId: "1100",
            isGroup: false,
            createdAt: "2024-01-19T14:45:00Z",
          },
        ],
      },
    ],
  },
  {
    id: "2000",
    code: "200000",
    name: "KEWAJIBAN DAN MODAL",
    type: "CREDIT",
    balance: 1510000000,
    status: "ACTIVE",
    isGroup: true,
    createdAt: "2024-01-15T08:30:00Z",
    children: [
      {
        id: "2100",
        code: "210000",
        name: "Kewajiban",
        type: "CREDIT",
        balance: 755000000,
        status: "ACTIVE",
        parentId: "2000",
        isGroup: true,
        createdAt: "2024-01-15T08:35:00Z",
        children: [
          {
            id: "2110",
            code: "211000",
            name: "Kewajiban Lancar",
            type: "CREDIT",
            balance: 455000000,
            status: "ACTIVE",
            parentId: "2100",
            isGroup: true,
            createdAt: "2024-01-15T08:40:00Z",
            children: [
              {
                id: "2111",
                code: "211100",
                name: "Hutang Pajak",
                type: "CREDIT",
                balance: 25000000,
                status: "ACTIVE",
                parentId: "2110",
                isGroup: false,
                createdAt: "2024-01-20T09:00:00Z",
              },
              {
                id: "2112",
                code: "211200",
                name: "Hutang Usaha",
                type: "CREDIT",
                balance: 85000000,
                status: "ACTIVE",
                parentId: "2110",
                isGroup: false,
                createdAt: "2024-01-21T10:15:00Z",
              },
              {
                id: "2114",
                code: "211400",
                name: "Biaya Yang Masih Harus Dibayar",
                type: "CREDIT",
                balance: 45000000,
                status: "INACTIVE",
                parentId: "2110",
                isGroup: false,
                createdAt: "2024-01-22T11:30:00Z",
              },
              {
                id: "2115",
                code: "211500",
                name: "Hutang Bank & Lembaga Keuangan",
                type: "CREDIT",
                balance: 150000000,
                status: "ACTIVE",
                parentId: "2110",
                isGroup: false,
                createdAt: "2024-01-23T13:45:00Z",
              },
              {
                id: "2116",
                code: "211600",
                name: "Hutang Afiliasi",
                type: "CREDIT",
                balance: 75000000,
                status: "ACTIVE",
                parentId: "2110",
                isGroup: false,
                createdAt: "2024-01-24T15:20:00Z",
              },
              {
                id: "2117",
                code: "211600",
                name: "Hutang Pemegang Saham",
                type: "CREDIT",
                balance: 50000000,
                status: "ACTIVE",
                parentId: "2110",
                isGroup: false,
                createdAt: "2024-01-25T16:10:00Z",
              },
              {
                id: "2118",
                code: "211800",
                name: "Hutang Pihak Ketiga",
                type: "CREDIT",
                balance: 25000000,
                status: "ACTIVE",
                parentId: "2110",
                isGroup: false,
                createdAt: "2024-01-26T08:30:00Z",
              },
            ],
          },
          {
            id: "2120",
            code: "212000",
            name: "Kewajiban Jangka Panjang",
            type: "CREDIT",
            balance: 300000000,
            status: "ACTIVE",
            parentId: "2100",
            isGroup: true,
            createdAt: "2024-01-15T08:45:00Z",
            children: [
              {
                id: "2121",
                code: "212100",
                name: "Hutang Bank",
                type: "CREDIT",
                balance: 300000000,
                status: "ACTIVE",
                parentId: "2120",
                isGroup: false,
                createdAt: "2024-01-27T09:45:00Z",
              },
            ],
          },
        ],
      },
    ],
  },
];

interface AccountRowProps {
  account: Account;
  level: number;
  onToggle: (accountId: string) => void;
  expandedItems: Set<string>;
  onEdit: (account: Account) => void;
  onToggleStatus: (account: Account) => void;
  onDelete: (account: Account) => void;
}

const AccountRow: React.FC<AccountRowProps> = ({
  account,
  level,
  onToggle,
  expandedItems,
  onEdit,
  onToggleStatus,
  onDelete,
}) => {
  const isExpanded = expandedItems.has(account.id);
  const hasChildren = account.children && account.children.length > 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString));
  };

  const paddingLeft = level * 24;

  return (
    <>
      {/* Desktop Table Row */}
      <div
        className="hidden md:flex items-center py-3 px-4 hover:bg-accent/50 border-b border-border transition-colors group"
        style={{ paddingLeft: `${paddingLeft + 16}px` }}
      >
        {/* Toggle button for groups */}
        <div className="w-6 h-6 flex items-center justify-center mr-2">
          {hasChildren ? (
            <Button
              variant="ghost"
              size="sm"
              className="w-6 h-6 p-0"
              onClick={() => onToggle(account.id)}
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          ) : null}
        </div>

        {/* Icon */}
        <div className="w-6 h-6 flex items-center justify-center mr-3">
          {account.isGroup ? (
            <FolderOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          ) : (
            <File className="h-4 w-4 text-muted-foreground" />
          )}
        </div>

        {/* Account Code */}
        <div className="w-20 text-sm font-mono text-muted-foreground mr-4">
          {account.code}
        </div>

        {/* Account Name */}
        <div className="flex-1 text-sm font-medium text-foreground mr-4">
          {account.name}
        </div>

        {/* Account Type Badge */}
        <div className="w-16 mr-6">
          <Badge
            variant={account.type === "DEBIT" ? "default" : "secondary"}
            className={
              account.type === "DEBIT"
                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
            }
          >
            {account.type}
          </Badge>
        </div>

        {/* Account Status Badge */}
        <div className="w-20 mr-4">
          <Badge
            variant={account.status === "ACTIVE" ? "default" : "secondary"}
            className={
              account.status === "ACTIVE"
                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
            }
          >
            {account.status === "ACTIVE" ? "Aktif" : "Non-aktif"}
          </Badge>
        </div>

        {/* Balance */}
        <div className="w-40 text-right text-sm font-semibold text-foreground mr-4">
          {formatCurrency(account.balance)}
        </div>

        {/* Created At */}
        <div className="w-32 text-right text-xs text-muted-foreground mr-4">
          {formatDate(account.createdAt)}
        </div>

        {/* Actions Dropdown */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onClick={() => onEdit(account)}
                className="cursor-pointer"
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onToggleStatus(account)}
                className="cursor-pointer"
              >
                <Power className="mr-2 h-4 w-4" />
                {account.status === "ACTIVE" ? "Non-aktifkan" : "Aktifkan"}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(account)}
                className="cursor-pointer text-red-600 focus:text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Card Layout */}
      <div
        className="md:hidden border-b border-border"
        style={{ marginLeft: `${paddingLeft}px` }}
      >
        <div className="p-4 hover:bg-accent/50 transition-colors">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              {/* Toggle button for groups */}
              {hasChildren && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-6 h-6 p-0"
                  onClick={() => onToggle(account.id)}
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              )}

              {/* Icon */}
              <div className="w-5 h-5 flex items-center justify-center">
                {account.isGroup ? (
                  <FolderOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                ) : (
                  <File className="h-4 w-4 text-muted-foreground" />
                )}
              </div>

              {/* Account Code */}
              <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded">
                {account.code}
              </span>
            </div>

            {/* Actions Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={() => onEdit(account)}
                  className="cursor-pointer"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onToggleStatus(account)}
                  className="cursor-pointer"
                >
                  <Power className="mr-2 h-4 w-4" />
                  {account.status === "ACTIVE" ? "Non-aktifkan" : "Aktifkan"}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDelete(account)}
                  className="cursor-pointer text-red-600 focus:text-red-600"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Account Name */}
          <h3 className="font-medium text-foreground mb-2 text-sm">
            {account.name}
          </h3>

          {/* Account Details */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Tipe:</span>
              <Badge
                variant={account.type === "DEBIT" ? "default" : "secondary"}
                className={`text-xs ${
                  account.type === "DEBIT"
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                }`}
              >
                {account.type}
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Status:</span>
              <Badge
                variant={account.status === "ACTIVE" ? "default" : "secondary"}
                className={`text-xs ${
                  account.status === "ACTIVE"
                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                    : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
                }`}
              >
                {account.status === "ACTIVE" ? "Aktif" : "Non-aktif"}
              </Badge>
            </div>
          </div>

          {/* Balance */}
          <div className="mt-2 pt-2 border-t border-border">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Saldo:</span>
              <span className="text-sm font-semibold text-foreground">
                {formatCurrency(account.balance)}
              </span>
            </div>
          </div>

          {/* Created At */}
          <div className="mt-2 pt-2 border-t border-border">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Dibuat:</span>
              <span className="text-xs text-muted-foreground">
                {formatDate(account.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Render children if expanded */}
      {hasChildren &&
        isExpanded &&
        account.children?.map((child) => (
          <AccountRow
            key={child.id}
            account={child}
            level={level + 1}
            onToggle={onToggle}
            expandedItems={expandedItems}
            onEdit={onEdit}
            onToggleStatus={onToggleStatus}
            onDelete={onDelete}
          />
        ))}
    </>
  );
};

export default function ChartOfAccounts() {
  const [accounts, setAccounts] = useState<Account[]>(sampleAccounts);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(
    new Set(["1000", "1100", "2000", "2100", "2110", "2120"])
  );
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isToggleStatusDialogOpen, setIsToggleStatusDialogOpen] =
    useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  // const toggleAccountStatusMutation = useToggleAccountStatus();

  const handleToggle = (accountId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(accountId)) {
      newExpanded.delete(accountId);
    } else {
      newExpanded.add(accountId);
    }
    setExpandedItems(newExpanded);
  };

  const handleAddAccount = () => {
    setIsAddDialogOpen(true);
  };

  const handleAccountAdded = () => {
    console.log("Account added, refresh data");
  };

  const handleEditAccount = (account: Account) => {
    setSelectedAccount(account);
    setIsEditDialogOpen(true);
  };

  const handleAccountUpdated = (updatedAccount: Account) => {
    // Update the account in the accounts array
    const updateAccountInTree = (accounts: Account[]): Account[] => {
      return accounts.map((account) => {
        if (account.id === updatedAccount.id) {
          return updatedAccount;
        }
        if (account.children) {
          return {
            ...account,
            children: updateAccountInTree(account.children),
          };
        }
        return account;
      });
    };

    setAccounts(updateAccountInTree(accounts));
    console.log("Account updated:", updatedAccount);
  };

  const handleToggleAccountStatus = (account: Account) => {
    setSelectedAccount(account);
    setIsToggleStatusDialogOpen(true);
  };

  const handleConfirmToggleStatus = () => {
    if (selectedAccount) {
      // Untuk sementara, langsung update status tanpa API call karena menggunakan data statis
      const newStatus: "ACTIVE" | "INACTIVE" =
        selectedAccount.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
      const updatedAccount = { ...selectedAccount, status: newStatus };
      handleAccountUpdated(updatedAccount);
      setIsToggleStatusDialogOpen(false);

      // Simulasi success message
      console.log(
        `Status akun ${selectedAccount.name} berhasil diubah menjadi ${newStatus}`
      );

      // Uncomment baris di bawah ini ketika backend sudah siap
      // toggleAccountStatusMutation.mutate(selectedAccount.id, {
      //   onSuccess: (data) => {
      //     const newStatus: "ACTIVE" | "INACTIVE" =
      //       selectedAccount.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
      //     const updatedAccount = { ...selectedAccount, status: newStatus };
      //     handleAccountUpdated(updatedAccount);
      //     setIsToggleStatusDialogOpen(false);
      //   },
      //   onError: (error) => {
      //     console.error("Failed to toggle account status:", error);
      //   },
      // });
    }
  };

  const handleDeleteAccount = (account: Account) => {
    setSelectedAccount(account);
    setIsDeleteDialogOpen(true);
  };

  const handleAccountDeleted = (accountId: string) => {
    // Remove the account from the accounts array
    const removeAccountFromTree = (accounts: Account[]): Account[] => {
      return accounts.filter((account) => {
        if (account.id === accountId) {
          return false;
        }
        if (account.children) {
          account.children = removeAccountFromTree(account.children);
        }
        return true;
      });
    };

    setAccounts(removeAccountFromTree(accounts));
    console.log("Account deleted:", accountId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">
            Chart of Accounts
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Kelola struktur dan data akun
          </p>
        </div>
        <Button
          onClick={handleAddAccount}
          className="flex items-center gap-2 w-full sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          <span className="sm:inline">Tambah Akun Baru</span>
        </Button>
      </div>

      {/* Accounts Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Daftar Akun</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-hidden">
            {/* Desktop Table Header */}
            <div className="hidden md:flex items-center py-3 px-4 bg-muted/50 border-b border-border font-medium text-sm text-muted-foreground">
              <div className="ml-17">Kode</div>
              <div className="flex-1 ml-11">Nama Akun</div>
              <div className="w-16 mr-6">Tipe</div>
              <div className="w-20 mr-4">Status</div>
              <div className="w-40 text-right mr-4">Saldo</div>
              <div className="w-32 text-right mr-4">Dibuat</div>
              <div className="w-8"></div>
            </div>

            {/* Mobile Header */}
            <div className="md:hidden bg-muted/50 border-b border-border p-4">
              <h3 className="font-medium text-sm text-muted-foreground">
                Daftar Akun
              </h3>
            </div>

            {/* Account Rows */}
            <div>
              {accounts.map((account) => (
                <AccountRow
                  key={account.id}
                  account={account}
                  level={0}
                  onToggle={handleToggle}
                  expandedItems={expandedItems}
                  onEdit={handleEditAccount}
                  onToggleStatus={handleToggleAccountStatus}
                  onDelete={handleDeleteAccount}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Account Dialog */}
      <AddAccountDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAccountAdded={handleAccountAdded}
      />

      {/* Edit Account Dialog */}
      <EditAccountDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        account={selectedAccount}
        onAccountUpdated={handleAccountUpdated}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        account={selectedAccount}
        onAccountDeleted={handleAccountDeleted}
      />

      {/* Confirm Toggle Status Dialog */}
      <ConfirmToggleStatusDialog
        open={isToggleStatusDialogOpen}
        onOpenChange={setIsToggleStatusDialogOpen}
        account={selectedAccount}
        onConfirm={handleConfirmToggleStatus}
        isLoading={false}
      />
    </div>
  );
}
