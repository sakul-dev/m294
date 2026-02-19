"use client";

import { useEffect, useState } from 'react';
import { apiService } from '@/services/api';
import { IKurse } from '@/app/kurse/IKurse';
import DataTable from '@/components/DataTable';
import LehrbetriebForm from '@/components/KurseForm';

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

const kurse_url = 'http://localhost/hoffmann-295/src/backend/kurs.php';

export default function KursePage() {
  const [list, setList] = useState<IKurse[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<IKurse | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await apiService.getAll<IKurse[]>(kurse_url);
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

  const handleEdit = (item: IKurse) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  const handleDelete = async (item: IKurse) => {
    if (confirm(`Möchten Sie ${item.kursNummer} wirklich löschen?`)) {
      try {
        await apiService.delete(Number(item.id_kurs), kurse_url, "id_kurs");
        await loadData();
      } catch (error) {
        alert("Löschen fehlgeschlagen");
      }
    }
  };

  const handleSave = async (data: Partial<IKurse>) => {
    try {
      if (selectedItem) {
        await apiService.update(data as IKurse, kurse_url);
      } else {
        await apiService.create(data, kurse_url);
      }
      setModalOpen(false);
      await loadData();
    } catch (error) {
      console.error("Save error:", error);
      alert("Fehler beim Speichern");
    }
  };

  return (
    <main className="p-8">
      <Card className="max-w-7xl mx-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="space-y-1">
            <CardTitle>Kurs Management</CardTitle>
            <CardDescription>
              Verwalten Sie das aktuelle Kursangebot
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
            <div className="space-y-6">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : (
            <DataTable 
              data={list} 
              columns={[
                { header: 'ID', accessor: 'id_kurs' },
                { header: 'Kursnummer', accessor: 'kursNummer' },
                { header: 'Kursthema', accessor: 'kursThema' },
                { header: 'Dozent ID', accessor: 'nr_dozent' },
                { header: 'Startdatum', accessor: 'startdatum' },
                { header: 'Enddatum', accessor: 'enddatum' },
                { header: 'Dauer (Tage)', accessor: 'dauer_in_tagen' },
              ]} 
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </CardContent>
      </Card>

      {isModalOpen && (
        <LehrbetriebForm 
          item={selectedItem} 
          onClose={() => setModalOpen(false)} 
          onSave={handleSave} 
        />
      )}
    </main>
  );
}