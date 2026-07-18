"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Gender, Person, RelationshipType, GENDER_LABELS, RELATIONSHIP_LABELS } from "@/lib/types";
import { useFamilyStore } from "@/lib/store";
import { formatDateInput, isValidDate } from "@/lib/utils";
import { Plus } from "lucide-react";

interface AddPersonDialogProps {
  defaultParentId?: string;
  children?: React.ReactNode;
}

export function AddPersonDialog({ defaultParentId, children }: AddPersonDialogProps) {
  const addPerson = useFamilyStore((state) => state.addPerson);
  const [open, setOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState<Gender>("male");
  const [relationship, setRelationship] = useState<RelationshipType>("other");
  const [notes, setNotes] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [error, setError] = useState("");

  function handleDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    setBirthDate(formatDateInput(e.target.value));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      setError("Введите имя и фамилию");
      return;
    }
    if (birthDate && !isValidDate(birthDate)) {
      setError("Неверный формат даты (ДД.ММ.ГГГГ)");
      return;
    }

    addPerson({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      birthDate: birthDate || undefined,
      gender,
      photoUrl: photoUrl || undefined,
      parentId: defaultParentId,
      relationshipType: relationship,
      notes: notes.trim() || undefined,
    });

    setFirstName("");
    setLastName("");
    setBirthDate("");
    setGender("male");
    setRelationship("other");
    setNotes("");
    setPhotoUrl("");
    setError("");
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        {children || (
          <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="h-4 w-4" />
            Добавить родственника
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-primary">Добавить человека</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Имя</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Имя"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Фамилия</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Фамилия"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="birthDate">Дата рождения</Label>
            <Input
              id="birthDate"
              value={birthDate}
              onChange={handleDateChange}
              placeholder="ДД.ММ.ГГГГ"
              inputMode="numeric"
              className="date-mask"
            />
            <p className="text-xs text-muted-foreground">
              Вводите цифры подряд: 12051990 → 12.05.1990
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Пол</Label>
              <Select value={gender} onValueChange={(v) => setGender(v as Gender)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(["male", "female", "other"] as Gender[]).map((g) => (
                    <SelectItem key={g} value={g}>
                      {GENDER_LABELS[g]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Степень родства</Label>
              <Select value={relationship} onValueChange={(v) => setRelationship(v as RelationshipType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(RELATIONSHIP_LABELS) as RelationshipType[]).map((r) => (
                    <SelectItem key={r} value={r}>
                      {RELATIONSHIP_LABELS[r]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="photoUrl">Ссылка на фотографию</Label>
            <Input
              id="photoUrl"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Заметки и истории</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Расскажите о человеке..."
              rows={3}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
            Сохранить
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
