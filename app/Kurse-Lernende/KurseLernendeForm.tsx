"use client";

import { useEffect, useState } from "react";
import { IKurseLernende } from "@/app/kurse-lernende/IKurseLernende";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface Props {
  item?: IKurseLernende | null;
  onClose: () => void;
  onSave: (data: Partial<IKurseLernende>) => void;
}

export default function KurseLernendeForm({
  item,
  onClose,
  onSave,
}: Props) {
  const [formData, setFormData] =
    useState<Partial<IKurseLernende>>({
      nr_lernende: "",
      nr_kurs: "",
      note: "",
    });

  useEffect(() => {
    if (item) setFormData(item);
  }, [item]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {item
              ? `Kurs-Lernende Beziehung bearbeiten`
              : "Neue Kurs-Lernende Beziehung erfassen"}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave(formData);
          }}
          className="space-y-6"
        >
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Lernende</Label>
              <Input
                name="nr_lernende"
                value={formData.nr_lernende || ""}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Kurs</Label>
              <Input
                name="nr_kurs"
                value={formData.nr_kurs || ""}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>Note</Label>
            <Input
              type="number"
              step="0.01"
              name="note"
              value={formData.note || ""}
              onChange={handleChange}
            />
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Abbrechen
            </Button>
            <Button type="submit">
              Speichern
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
