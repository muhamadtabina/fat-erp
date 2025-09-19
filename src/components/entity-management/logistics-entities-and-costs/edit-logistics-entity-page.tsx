import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useForm } from "react-hook-form";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Building2, Loader2 } from "lucide-react";
import { type LogisticsEntity } from "./logistics-entity-types";
import {
  logisticsEntityFormSchema,
  type LogisticsEntityFormData,
} from "./logistics-entity-form-schema";

interface EditLogisticsEntityPageProps {
  entity?: LogisticsEntity;
}

export function EditLogisticsEntityPage({
  entity: propEntity,
}: EditLogisticsEntityPageProps = {}) {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [entity, setEntity] = useState<LogisticsEntity | null>(
    propEntity || null
  );

  // Initialize React Hook Form
  const form = useForm<LogisticsEntityFormData>({
    resolver: zodResolver(logisticsEntityFormSchema),
    defaultValues: {
      namaEntitasInternal: "",
      kodeEntitas: "",
      deskripsi: "",
    },
  });

  // Load entity data when component mounts or id changes
  useEffect(() => {
    if (id && !propEntity) {
      // In a real app, you would fetch the entity by ID from an API
      // For now, we'll get it from sample data
      const sampleEntities = [
        {
          id: "1",
          namaEntitasInternal: "Pusat Logistik & Distribusi - GMC",
          kodeEntitas: "PLD-001",
          deskripsi: "Pusat distribusi utama untuk wilayah Jakarta dan sekitarnya",
          status: "ACTIVE" as const,
          created_at: "2024-01-15T08:00:00Z",
        },
        {
          id: "2",
          namaEntitasInternal: "Gudang Regional Surabaya",
          kodeEntitas: "GRS-002",
          deskripsi: "Gudang regional untuk melayani wilayah Jawa Timur",
          status: "ACTIVE" as const,
          created_at: "2024-01-20T10:30:00Z",
        },
      ];

      const foundEntity = sampleEntities.find((e) => e.id === id);
      if (foundEntity) {
        setEntity(foundEntity);
        // Populate form with entity data
        form.reset({
          namaEntitasInternal: foundEntity.namaEntitasInternal,
          kodeEntitas: foundEntity.kodeEntitas,
          deskripsi: foundEntity.deskripsi,
        });
      } else {
        // Entity not found, redirect back
        navigate("/logistics-entities-and-costs");
      }
    } else if (propEntity) {
      // If entity is passed as prop, use it
      setEntity(propEntity);
      form.reset({
        namaEntitasInternal: propEntity.namaEntitasInternal,
        kodeEntitas: propEntity.kodeEntitas,
        deskripsi: propEntity.deskripsi,
      });
    }
  }, [id, propEntity, form, navigate]);

  const onSubmit = async (data: LogisticsEntityFormData) => {
    if (!entity) return;

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("Updated Logistics Entity Data:", { ...entity, ...data });

      // Navigate back with success message
      navigate("/logistics-entities-and-costs", {
        state: {
          message: `Entitas logistik "${data.namaEntitasInternal}" berhasil diperbarui!`,
          type: "success",
        },
      });
    } catch (error) {
      console.error("Error updating logistics entity:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/logistics-entities-and-costs");
  };

  if (!entity) {
    return (
      <div className="container mx-auto">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
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
        <h1 className="text-3xl font-bold tracking-tight">
          Edit Entitas Logistik
        </h1>
        <p className="text-muted-foreground">
          Perbarui informasi entitas logistik "{entity.namaEntitasInternal}"
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Logistics Entity Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                1. Informasi Entitas Logistik
              </CardTitle>
              <CardDescription>
                Informasi dasar entitas logistik dan operasional
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="namaEntitasInternal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Nama Entitas Internal{" "}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Contoh: Pusat Logistik & Distribusi - GMC"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="kodeEntitas"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kode Entitas</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="PLD-001"
                          {...field}
                          className="font-mono"
                          style={{ textTransform: "uppercase" }}
                          onChange={(e) =>
                            field.onChange(e.target.value.toUpperCase())
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="deskripsi"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Deskripsi <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Fungsi utama entitas..."
                        className="min-h-[120px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="text-sm text-muted-foreground bg-muted/50 p-4 rounded-lg">
                <strong>CATATAN:</strong> Form ini tidak memiliki field NPWP atau
                Tipe Badan Usaha karena ini bukan entitas legal.
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
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                "Simpan Perubahan"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default EditLogisticsEntityPage;