"use client";

import { useEffect, useState } from "react";
import { apiService } from "@/services/api";
import { IKurs } from "@/app/kurs/IKurs";
import DataTable from "@/app/DataTable";
import KursForm from "@/app/kurs/KursForm";

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

const kurs_url =
  "http://localhost/hoffmann-295/src/backend/kurs.php";

export default function KursPage() {
  const [list, setList] = useState<IKurs[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<IKurs | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await apiService.getAll<IKurs[]>(kurs_url);
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

  const handleEdit = (item: IKurs) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  const handleDelete = async (item: IKurs) => {
    if (
      confirm(
        `Möchten Sie Kurs ${item.kursNummer} wirklich löschen?`
      )
    ) {
      try {
        await apiService.delete(
          Number(item.id_kurs),
          kurs_url,
          "id_kurs"
        );
        await loadData();
      } catch {
        alert("Löschen fehlgeschlagen");
      }
    }
  };

  const handleSave = async (data: Partial<IKurs>) => {
    try {
      if (selectedItem) {
        await apiService.update(data as IKurs, kurs_url);
      } else {
        await apiService.create(data, kurs_url);
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
            <CardTitle>Kurse Management</CardTitle>
            <CardDescription>
              Verwalten Sie Kurse, Themen und Termine
            </CardDescription>
          </div>

          <Button onClick={handleCreateNew}>
            <Plus className="mr-2 h-4 w-4" />
            Neuer Kurs
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
                { header: "ID", accessor: "id_kurs" },
                { header: "Kurs Nr.", accessor: "kursNummer" },
                { header: "Thema", accessor: "kursThema" },
                { header: "Inhalt", accessor: "kursInhalt" },
                { header: "Dozent", accessor: "nr_dozent" },
                { header: "Startdatum", accessor: "startdatum" },
                { header: "Enddatum", accessor: "enddatum" },
                { header: "Dauer (Tage)", accessor: "dauer_in_tagen" },
              ]}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </CardContent>
      </Card>

      {isModalOpen && (
        <KursForm
          item={selectedItem}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </main>
  );
}
