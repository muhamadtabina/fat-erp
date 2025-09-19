import { useState } from "react";
import { useNavigate } from "react-router";
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
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ArrowLeft, Building2, Loader2 } from "lucide-react";
import {
  logisticsEntityFormSchema,
  type LogisticsEntityFormData,
} from "./logistics-entity-form-schema";

export default function AddLogisticsEntityPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LogisticsEntityFormData>({
    resolver: zodResolver(logisticsEntityFormSchema),
    defaultValues: {
      namaEntitasInternal: "",
      kodeEntitas: "",
      deskripsi: "",
    },
  });

  const onSubmit = async (data: LogisticsEntityFormData) => {
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("Logistics Entity Data:", data);

      // Navigate back with success message
      navigate("/logistics-entities-and-costs", {
        state: {
          message: `Entitas logistik "${data.namaEntitasInternal}" berhasil ditambahkan!`,
          type: "success",
        },
      });
    } catch (error) {
      console.error("Error adding logistics entity:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/logistics-entities-and-costs");
  };

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
          Tambah Entitas Logistik Baru
        </h1>
        <p className="text-muted-foreground">
          Buat profil entitas logistik baru untuk sistem distribusi perusahaan
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
                "Simpan"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
