"use client";

import { useEffect, useState } from "react";
import { IKurs } from "@/app/kurs/IKurs";

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
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

interface Props {
  item?: IKurs | null;
  onClose: () => void;
  onSave: (data: Partial<IKurs>) => void;
}

export default function KursForm({
  item,
  onClose,
  onSave,
}: Props) {
  const [formData, setFormData] =
    useState<Partial<IKurs>>({
      kursNummer: "",
      kursThema: "",
      kursInhalt: "",
      nr_dozent: "",
      startdatum: "",
      enddatum: "",
      dauer_in_tagen: "",
    });

  useEffect(() => {
    if (item) setFormData(item);
  }, [item]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
              ? `Kurs bearbeiten`
              : "Neuen Kurs erfassen"}
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
              <Label>Kurs Nummer</Label>
              <Input
                name="kursNummer"
                value={formData.kursNummer || ""}
                onChange={handleChange}
                required
                maxLength={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Dozent</Label>
              <Input
                name="nr_dozent"
                value={formData.nr_dozent || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>Kurs Thema</Label>
            <Input
              name="kursThema"
              value={formData.kursThema || ""}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label>Kurs Inhalt</Label>
            <Textarea
              name="kursInhalt"
              value={formData.kursInhalt || ""}
              onChange={handleChange}
              rows={4}
            />
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label>Startdatum</Label>
              <Input
                type="date"
                name="startdatum"
                value={formData.startdatum || ""}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label>Enddatum</Label>
              <Input
                type="date"
                name="enddatum"
                value={formData.enddatum || ""}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label>Dauer (Tage)</Label>
              <Input
                type="number"
                name="dauer_in_tagen"
                value={formData.dauer_in_tagen || ""}
                onChange={handleChange}
              />
            </div>
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
