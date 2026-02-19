"use client";

import { useEffect, useState } from "react";
import { apiService } from "@/services/api";
import { IDozent } from "@/app/dozent/IDozent";
import DataTable from "@/app/DataTable";
import DozentForm from "@/app/dozent/DozentForm";

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

const dozent_url =
  "http://localhost/hoffmann-295/src/backend/dozent.php";

export default function DozentPage() {
  const [list, setList] = useState<IDozent[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<IDozent | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await apiService.getAll<IDozent[]>(dozent_url);
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

  const handleEdit = (item: IDozent) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  const handleDelete = async (item: IDozent) => {
    if (
      confirm(
        `Möchten Sie ${item.vorname} ${item.nachname} wirklich löschen?`
      )
    ) {
      try {
        await apiService.delete(
          Number(item.id_dozent),
          dozent_url,
          "id_dozent"
        );
        await loadData();
      } catch {
        alert("Löschen fehlgeschlagen");
      }
    }
  };

  const handleSave = async (data: Partial<IDozent>) => {
    try {
      if (selectedItem) {
        await apiService.update(data as IDozent, dozent_url);
      } else {
        await apiService.create(data, dozent_url);
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
            <CardTitle>Dozenten Management</CardTitle>
            <CardDescription>
              Verwalten Sie Dozenten, Kontaktdaten und Stammdaten
            </CardDescription>
          </div>

          <Button onClick={handleCreateNew}>
            <Plus className="mr-2 h-4 w-4" />
            Neuer Dozent
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
                { header: "ID", accessor: "id_dozent" },
                { header: "Vorname", accessor: "vorname" },
                { header: "Nachname", accessor: "nachname" },
                { header: "Email", accessor: "email" },
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
        <DozentForm
          item={selectedItem}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </main>
  );
}
