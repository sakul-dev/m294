"use client";

import { useEffect, useState } from "react";
import { ILehrbetriebLernende } from "@/app/lehrbetrieb-lernende/ILehrbetriebLernende";

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
  item?: ILehrbetriebLernende | null;
  onClose: () => void;
  onSave: (data: Partial<ILehrbetriebLernende>) => void;
}

export default function LehrbetriebLernendeForm({
  item,
  onClose,
  onSave,
}: Props) {
  const [formData, setFormData] =
    useState<Partial<ILehrbetriebLernende>>({
      nr_lehrbetrieb: "",
      nr_lernende: "",
      lehrstart: "",
      lehrende: "",
      beruf: "",
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
              ? `Lehrbetrieb-Lernende Beziehung bearbeiten`
              : "Neue Lehrbetrieb-Lernende Beziehung erfassen"}
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
              <Label>Lehrbetrieb</Label>
              <Input
                name="nr_lehrbetrieb"
                value={formData.nr_lehrbetrieb || ""}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Lernende</Label>
              <Input
                name="nr_lernende"
                value={formData.nr_lernende || ""}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>Beruf</Label>
            <Input
              name="beruf"
              value={formData.beruf || ""}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Lehrstart</Label>
              <Input
                type="date"
                name="lehrstart"
                value={formData.lehrstart || ""}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label>Lehrende</Label>
              <Input
                type="date"
                name="lehrende"
                value={formData.lehrende || ""}
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
