"use client";

import { useEffect, useState } from 'react';
import { apiService } from '@/services/api';
import { IDozenten } from '@/app/dozenten/IDozenten';
import DataTable from '@/components/DataTable';
import LehrbetriebForm from '@/components/DozentenForm';

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

const dozenten_url = 'http://localhost/hoffmann-295/src/backend/dozenten.php';

export default function DozentenPage() {
  const [list, setList] = useState<IDozenten[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<IDozenten | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await apiService.getAll<IDozenten[]>(dozenten_url);
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

  const handleEdit = (item: IDozenten) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  const handleDelete = async (item: IDozenten) => {
    if (confirm(`Möchten Sie ${item.vorname} ${item.nachname} wirklich löschen?`)) {
      try {
        await apiService.delete(Number(item.id_dozent), dozenten_url, "id_dozent");
        await loadData();
      } catch (error) {
        alert("Löschen fehlgeschlagen");
      }
    }
  };

  const handleSave = async (data: Partial<IDozenten>) => {
    try {
      if (selectedItem) {
        await apiService.update(data as IDozenten, dozenten_url);
      } else {
        await apiService.create(data, dozenten_url);
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
            <CardTitle>Dozenten Management</CardTitle>
            <CardDescription>
              Verwalten Sie Kursleiter und Dozenten
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
            <div className="space-y-6">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : (
            <DataTable 
              data={list} 
              columns={[
                { header: 'ID', accessor: 'id_dozent' },
                { header: 'Vorname', accessor: 'vorname' },
                { header: 'Nachname', accessor: 'nachname' },
                { header: 'Email', accessor: 'email' },
                { header: 'Ort', accessor: 'ort' },
                { header: 'Land', accessor: 'nr_country' },
                { header: 'Telefon', accessor: 'telefon' },
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