"use client";

import { useEffect, useState } from 'react';
import { apiService } from '@/services/api';
import { ILehrbetriebe } from '@/app/lehrbetriebe/ILehrbetriebe';
import DataTable from '@/app/DataTable';
import LehrbetriebForm from '@/app/lehrbetriebe/LehrbetriebeForm';

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

const lehrbetrieb_url = 'http://localhost/hoffmann-295/src/backend/lehrbetrieb.php';

export default function LehrbetriebPage() {
  const [list, setList] = useState<ILehrbetriebe[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ILehrbetriebe | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await apiService.getAll<ILehrbetriebe[]>(lehrbetrieb_url);
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

  const handleEdit = (item: ILehrbetriebe) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  const handleDelete = async (item: ILehrbetriebe) => {
    if (confirm(`Möchten Sie ${item.firma} wirklich löschen?`)) {
      try {
        await apiService.delete(Number(item.id_lehrbetrieb), lehrbetrieb_url, "id_lehrbetrieb");
        await loadData();
      } catch (error) {
        alert("Löschen fehlgeschlagen");
      }
    }
  };

  const handleSave = async (data: Partial<ILehrbetriebe>) => {
    try {
      if (selectedItem) {
        await apiService.update(data as ILehrbetriebe, lehrbetrieb_url);
      } else {
        await apiService.create(data, lehrbetrieb_url);
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
            <CardTitle>Lehrbetrieb Management</CardTitle>
            <CardDescription>
              Verwalten Sie registrierte Ausbildungsbetriebe
            </CardDescription>
          </div>

          <Button onClick={handleCreateNew}>
            <Plus className="mr-2 h-4 w-4" />
            Neuer Lehrbetrieb
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
                { header: 'ID', accessor: 'id_lehrbetrieb' },
                { header: 'Firma', accessor: 'firma' },
                { header: 'Ort', accessor: 'ort' },
                { header: 'Platz', accessor: 'platz' },
                { header: 'Strasse', accessor: 'strasse' },
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