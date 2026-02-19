"use client";

import { useEffect, useState } from "react";
import { ILehrbetriebe } from "@/app/lehrbetriebe/ILehrbetriebe";

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
  item?: ILehrbetriebe | null;
  onClose: () => void;
  onSave: (data: Partial<ILehrbetriebe>) => void;
}

export default function LernendeForm({
  item,
  onClose,
  onSave,
}: Props) {
  const [formData, setFormData] =
    useState<Partial<ILehrbetriebe>>({
      firma: "",
      ort: "",
      strasse: "",
      platz: "",
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
              ? `Lernenden bearbeiten`
              : "Neuen Lernenden erfassen"}
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
              <Label>Vorname</Label>
              <Input
                name="vorname"
                value={formData.vorname || ""}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Nachname</Label>
              <Input
                name="nachname"
                value={formData.nachname || ""}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>E-Mail</Label>
            <Input
              type="email"
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 space-y-2">
              <Label>Strasse</Label>
              <Input
                name="strasse"
                value={formData.strasse || ""}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label>Haus-Nr.</Label>
              <Input
                name="platz"
                value={formData.platz || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Wohnort</Label>
            <Input
              name="ort"
              value={formData.ort || ""}
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
