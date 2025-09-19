import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Building2,
  CreditCard,
  Calculator,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";
import { type Entity } from "./entity-types";
import {
  entityFormSchema,
  type EntityFormData,
  BUSINESS_TYPE_OPTIONS,
} from "./entity-form-schema";

interface EditEntityPageProps {
  entity?: Entity;
}

export function EditEntityPage({
  entity: propEntity,
}: EditEntityPageProps = {}) {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [entity, setEntity] = useState<Entity | null>(propEntity || null);

  // Initialize React Hook Form
  const form = useForm<EntityFormData>({
    resolver: zodResolver(entityFormSchema),
    defaultValues: {
      legalName: "",
      entityType: "",
      npwp: "",
      address: "",
      email: "",
      phone: "",
      bankAccounts: [{ bankName: "", accountNumber: "", accountName: "" }],
      startDate: "",
      openingBalance: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "bankAccounts",
  });

  // Load entity data when component mounts or id changes
  useEffect(() => {
    if (id && !propEntity) {
      // In a real app, you would fetch the entity by ID from an API
      // For now, we'll get it from localStorage or sample data
      const sampleEntities = [
        {
          id: "1",
          name: "PT Teknologi Maju",
          businessType: "PT (Perseroan Terbatas)",
          npwp: "01.234.567.8-901.000",
          status: "ACTIVE" as const,
          created_at: "2024-01-15T08:00:00Z",
        },
        {
          id: "2",
          name: "CV Digital Solutions",
          businessType: "CV (Commanditaire Vennootschap)",
          npwp: "02.345.678.9-012.000",
          status: "ACTIVE" as const,
          created_at: "2024-02-20T10:30:00Z",
        },
      ];

      const foundEntity = sampleEntities.find((e) => e.id === id);
      if (foundEntity) {
        setEntity(foundEntity);
      } else {
        // Entity not found, redirect back
        navigate("/entity-management");
        return;
      }
    }
  }, [id, propEntity, navigate]);

  // Pre-fill form when entity is loaded
  useEffect(() => {
    if (entity) {
      form.reset({
        legalName: entity.name || "",
        entityType: entity.businessType || "",
        npwp: entity.npwp || "",
        address: "",
        email: "",
        phone: "",
        bankAccounts: [{ bankName: "", accountNumber: "", accountName: "" }],
        startDate: "",
        openingBalance: "",
      });
    }
  }, [entity, form]);

  const onSubmit = async (data: EntityFormData) => {
    if (!entity) return;

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const updatedEntity: Entity = {
        ...entity,
        name: data.legalName,
        businessType: data.entityType,
        npwp: data.npwp,
      };

      console.log("Entity updated:", updatedEntity);

      // Navigate back to entity management with success message
      navigate("/commercial-business-entity", {
        state: {
          message: `Entitas ${data.legalName} berhasil diperbarui`,
          type: "success",
        },
      });
    } catch (error) {
      console.error("Error updating entity:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/commercial-business-entity");
  };

  if (!entity) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Button>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Entitas</h1>
        <p className="text-muted-foreground">
          Perbarui informasi entitas bisnis {entity.name}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Legal & General Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                1. Informasi Legal & Umum
              </CardTitle>
              <CardDescription>
                Informasi dasar dan legal entitas bisnis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="legalName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Nama Entitas Legal{" "}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Masukkan nama entitas legal"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="entityType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Tipe Badan Usaha <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih tipe badan usaha" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {BUSINESS_TYPE_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="npwp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Nomor Pokok Wajib Pajak (NPWP){" "}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="00.000.000.0-000.000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nomor Telepon</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Masukkan nomor telepon"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Alamat Lengkap <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Masukkan alamat lengkap"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Email <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Masukkan email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Banking Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                2. Informasi Perbankan
              </CardTitle>
              <CardDescription>
                Informasi rekening bank untuk transaksi bisnis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="space-y-4 p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Rekening Bank {index + 1}</h4>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => remove(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name={`bankAccounts.${index}.bankName`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nama Bank</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Masukkan nama bank"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`bankAccounts.${index}.accountNumber`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nomor Rekening</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Masukkan nomor rekening"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`bankAccounts.${index}.accountName`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nama Akun Rekening</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Masukkan nama akun rekening"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  append({ bankName: "", accountNumber: "", accountName: "" })
                }
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Tambah Rekening Baru
              </Button>
            </CardContent>
          </Card>

          {/* Initial Accounting Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                3. Konfigurasi Akuntansi Awal (Opsional)
              </CardTitle>
              <CardDescription>
                Pengaturan awal untuk sistem akuntansi entitas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tanggal Mulai Pembukuan</FormLabel>
                      <FormControl>
                        <DatePicker
                          value={
                            field.value ? new Date(field.value) : undefined
                          }
                          onChange={(date) =>
                            field.onChange(
                              date ? date.toISOString().split("T")[0] : ""
                            )
                          }
                          placeholder="Pilih tanggal mulai pembukuan"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="openingBalance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Input Saldo Awal (Opening Balance)</FormLabel>
                      <FormControl>
                        <Input placeholder="Contoh: 50000000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="text-sm text-muted-foreground">
                Fitur ini untuk migrasi perusahaan Anda dapat meninggalkan saldo
                awal untuk akun-akun seperti Kas, Bank, dll.
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Menyimpan..." : "Perbarui"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
