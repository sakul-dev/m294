"use client";

import { useEffect, useState } from "react";
import { apiService } from "@/services/api";
import { ILernende } from "@/app/lernende/ILernende";
import DataTable from "@/app/DataTable";
import LernendeForm from "@/app/lernende/LernendeForm";

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

const lernenden_url = "http://localhost/hoffmann-295/src/backend/lernende.php";

export default function LernendePage() {
  const [list, setList] = useState<ILernende[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ILernende | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await apiService.getAll<ILernende[]>(lernenden_url);
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

  const handleEdit = (item: ILernende) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  const handleDelete = async (item: ILernende) => {
    if (
      confirm(
        `Möchten Sie ${item.vorname} ${item.nachname} wirklich löschen?`
      )
    ) {
      try {
        await apiService.delete(
          Number(item.id_lernende),
          lernenden_url,
          "id_lernende"
        );
        await loadData();
      } catch {
        alert("Löschen fehlgeschlagen");
      }
    }
  };

  const handleSave = async (data: Partial<ILernende>) => {
    try {
      if (selectedItem) {
        await apiService.update(data as ILernende, lernenden_url);
      } else {
        await apiService.create(data, lernenden_url);
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
            <CardTitle>Lernende Management</CardTitle>
            <CardDescription>
              Verwalten Sie Lernende, Kontaktdaten und Stammdaten
            </CardDescription>
          </div>

          <Button onClick={handleCreateNew}>
            <Plus className="mr-2 h-4 w-4" />
            Neuer Lernender
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
                { header: "ID", accessor: "id_lernende" },
                { header: "Vorname", accessor: "vorname" },
                { header: "Nachname", accessor: "nachname" },
                { header: "Email", accessor: "email" },
                { header: "Privat Mail", accessor: "emailPrivat" },
                { header: "Ort", accessor: "ort" },
                { header: "Platz", accessor: "platz" },
                { header: "Strasse", accessor: "strasse" },
                { header: "Land", accessor: "nr_country" },
                { header: "Geschlecht", accessor: "gender" },
                { header: "Telefon", accessor: "telefon" },
                { header: "Geburtsdatum", accessor: "birthdate" },
              ]}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </CardContent>
      </Card>

      {isModalOpen && (
        <LernendeForm
          item={selectedItem}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </main>
  );
}
