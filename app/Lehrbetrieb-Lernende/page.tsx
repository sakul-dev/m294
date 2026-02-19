"use client";

import { useEffect, useState } from "react";
import { apiService } from "@/services/api";
import { ILehrbetriebLernende } from "@/app/lehrbetrieb-lernende/ILehrbetriebLernende";
import DataTable from "@/app/DataTable";
import LehrbetriebLernendeForm from "@/app/lehrbetrieb-lernende/LehrbetriebLernendeForm";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus } from "lucide-react";

const lehrbetrieb_lernende_url =
  "http://localhost/hoffmann-295/src/backend/lehrbetrieb-lernende.php";

export default function LehrbetriebLernendePage() {
  const [list, setList] = useState<ILehrbetriebLernende[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ILehrbetriebLernende | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await apiService.getAll<ILehrbetriebLernende[]>(lehrbetrieb_lernende_url);
      setList(data);
    } catch (error) {
      console.error("Failed to fetch:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateNew = () => {
    setSelectedItem(null);
    setModalOpen(true);
  };

  const handleEdit = (item: ILehrbetriebLernende) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  const handleDelete = async (item: ILehrbetriebLernende) => {
    if (
      confirm(
        `Möchten Sie diese Lehrbetrieb-Lernende Beziehung wirklich löschen?`
      )
    ) {
      try {
        await apiService.delete(
          Number(item.id_lehrbetrieb_lernende),
          lehrbetrieb_lernende_url,
          "id_lehrbetrieb_lernende"
        );
        await loadData();
      } catch {
        alert("Löschen fehlgeschlagen");
      }
    }
  };

  const handleSave = async (data: Partial<ILehrbetriebLernende>) => {
    try {
      if (selectedItem) {
        await apiService.update(data as ILehrbetriebLernende, lehrbetrieb_lernende_url);
      } else {
        await apiService.create(data, lehrbetrieb_lernende_url);
      }
      setModalOpen(false);
      await loadData();
    } catch {
      alert("Fehler beim Speichern");
    }
  };

  return (
    <main className="p-8">
      <Card className="max-w-7xl mx-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="space-y-1">
            <CardTitle>Lehrbetrieb-Lernende Management</CardTitle>
            <CardDescription>
              Verwalten Sie Lehrbeziehungen und Ausbildungsdaten
            </CardDescription>
          </div>

          <Button onClick={handleCreateNew}>
            <Plus className="mr-2 h-4 w-4" />
            Neue Lehrbeziehung
          </Button>
        </CardHeader>

        <Separator />

        <CardContent className="pt-6">
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <DataTable
              data={list}
              columns={[
                { header: "ID", accessor: "id_lehrbetrieb_lernende" },
                { header: "Lehrbetrieb", accessor: "nr_lehrbetrieb" },
                { header: "Lernende", accessor: "nr_lernende" },
                { header: "Beruf", accessor: "beruf" },
                { header: "Lehrstart", accessor: "lehrstart" },
                { header: "Lehrende", accessor: "lehrende" },
              ]}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </CardContent>
      </Card>

      {isModalOpen && (
        <LehrbetriebLernendeForm
          item={selectedItem}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </main>
  );
}
