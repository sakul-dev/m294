"use client";

import { useEffect, useState } from "react";
import { apiService } from "@/services/api";
import { IKurseLernende } from "@/app/kurse-lernende/IKurseLernende";
import DataTable from "@/app/DataTable";
import KurseLernendeForm from "@/app/kurse-lernende/KurseLernendeForm";

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

const kurse_lernende_url =
  "http://localhost/hoffmann-295/src/backend/kurse-lernende.php";

export default function KurseLernendePage() {
  const [list, setList] = useState<IKurseLernende[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<IKurseLernende | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await apiService.getAll<IKurseLernende[]>(kurse_lernende_url);
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

  const handleEdit = (item: IKurseLernende) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  const handleDelete = async (item: IKurseLernende) => {
    if (
      confirm(
        `Möchten Sie diese Kurs-Lernende Beziehung wirklich löschen?`
      )
    ) {
      try {
        await apiService.delete(
          Number(item.id_kurse_lernende),
          kurse_lernende_url,
          "id_kurse_lernende"
        );
        await loadData();
      } catch {
        alert("Löschen fehlgeschlagen");
      }
    }
  };

  const handleSave = async (data: Partial<IKurseLernende>) => {
    try {
      if (selectedItem) {
        await apiService.update(data as IKurseLernende, kurse_lernende_url);
      } else {
        await apiService.create(data, kurse_lernende_url);
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
            <CardTitle>Kurse-Lernende Management</CardTitle>
            <CardDescription>
              Verwalten Sie Kurs-Zuweisungen und Noten
            </CardDescription>
          </div>

          <Button onClick={handleCreateNew}>
            <Plus className="mr-2 h-4 w-4" />
            Neue Zuweisung
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
                { header: "ID", accessor: "id_kurse_lernende" },
                { header: "Lernende", accessor: "nr_lernende" },
                { header: "Kurs", accessor: "nr_kurs" },
                { header: "Note", accessor: "note" },
              ]}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </CardContent>
      </Card>

      {isModalOpen && (
        <KurseLernendeForm
          item={selectedItem}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </main>
  );
}
