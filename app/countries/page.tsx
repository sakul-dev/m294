"use client";

import { useEffect, useState } from 'react';
import { apiService } from '@/services/api';
import { ICountries } from '@/app/countries/ICountries';
import DataTable from '@/app/DataTable';
import CountriesForm from '@/app/countries/CountriesForm';

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

const countries_url = 'http://localhost/hoffmann-295/src/backend/countries.php';

export default function CountriesPage() {
  const [list, setList] = useState<ICountries[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ICountries | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await apiService.getAll<ICountries[]>(countries_url);
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

  const handleEdit = (item: ICountries) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  const handleDelete = async (item: ICountries) => {
    if (confirm(`Möchten Sie ${item.country} wirklich löschen?`)) {
      try {
        await apiService.delete(Number(item.id_country), countries_url, "id_country");
        await loadData();
      } catch (error) {
        alert("Löschen fehlgeschlagen");
      }
    }
  };

  const handleSave = async (data: Partial<ICountries>) => {
    try {
      if (selectedItem) {
        await apiService.update(data as ICountries, countries_url);
      } else {
        await apiService.create(data, countries_url);
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
            <CardTitle>Länder Management</CardTitle>
            <CardDescription>
              Verwalten Sie die verfügbaren Länder
            </CardDescription>
          </div>

          <Button onClick={handleCreateNew}>
            <Plus className="mr-2 h-4 w-4" />
            Neues Land
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
                { header: 'ID', accessor: 'id_country' },
                { header: 'Land', accessor: 'country' },
              ]} 
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </CardContent>
      </Card>

      {isModalOpen && (
        <CountriesForm 
          item={selectedItem} 
          onClose={() => setModalOpen(false)} 
          onSave={handleSave} 
        />
      )}
    </main>
  );
}