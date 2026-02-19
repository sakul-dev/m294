"use client";

import { useEffect, useState } from "react";
import { IDozent } from "@/app/dozent/IDozent";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

interface Props {
  item?: IDozent | null;
  onClose: () => void;
  onSave: (data: Partial<IDozent>) => void;
}

export default function DozentForm({
  item,
  onClose,
  onSave,
}: Props) {
  const [formData, setFormData] =
    useState<Partial<IDozent>>({
      vorname: "",
      nachname: "",
      strasse: "",
      platz: "",
      ort: "",
      gender: "M",
      telefon: "",
      email: "",
      birthdate: "",
      nr_country: "",
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
              ? `Dozent bearbeiten`
              : "Neuen Dozent erfassen"}
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

          <div className="space-y-2">
            <Label>Land</Label>
            <Input
              name="nr_country"
              value={formData.nr_country || ""}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Geschlecht</Label>
              <Select
                value={formData.gender}
                onValueChange={(v) =>
                  setFormData((p) => ({
                    ...p,
                    gender: v,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="M">Männlich</SelectItem>
                  <SelectItem value="F">Weiblich</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Telefon</Label>
              <Input
                name="telefon"
                value={formData.telefon || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Geburtsdatum</Label>
            <Input
              type="date"
              name="birthdate"
              value={formData.birthdate || ""}
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
