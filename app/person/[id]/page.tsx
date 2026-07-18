"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { Separator } from "@/components/ui/separator";
import { PersonAvatar } from "@/components/person-avatar";
import { OrnamentDivider } from "@/components/ornament";
import { CarpetBackground } from "@/components/carpet-background";
import { AddPersonDialog } from "@/components/add-person-dialog";
import { PhotoUpload } from "@/components/photo-upload";
import { useFamilyStore } from "@/lib/store";
import {
  Gender,
  Person,
  Photo,
  RelationshipType,
  GENDER_LABELS,
  RELATIONSHIP_LABELS,
} from "@/lib/types";
import { calculateAge, formatDateInput, isValidDate, cn } from "@/lib/utils";
import { navigateTo, getPagePath } from "@/lib/navigate";
import {
  ArrowLeft,
  Calendar,
  Edit2,
  Trash2,
  User,
  Link as LinkIcon,
  X,
  Users,
  Save,
} from "lucide-react";
import { toast } from "sonner";

export default function PersonPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const family = useFamilyStore((state) => state.family);
  const people = useFamilyStore((state) => state.family?.people || []);
  const photos = useFamilyStore((state) => state.family?.photos || []);
  const updatePerson = useFamilyStore((state) => state.updatePerson);
  const deletePerson = useFamilyStore((state) => state.deletePerson);
  const addPhoto = useFamilyStore((state) => state.addPhoto);
  const deletePhoto = useFamilyStore((state) => state.deletePhoto);
  const [isEditing, setIsEditing] = useState(false);

  const person = useMemo(
    () => people.find((p) => p.id === id),
    [people, id]
  );

  const parent = useMemo(
    () => people.find((p) => p.id === person?.parentId),
    [people, person]
  );

  const children = useMemo(
    () => people.filter((p) => p.parentId === id),
    [people, id]
  );

  const personPhotos = useMemo(
    () => photos.filter((p) => p.personId === id),
    [photos, id]
  );

  const [editForm, setEditForm] = useState<Partial<Person>>(() => person || {});

  if (!family || !person) {
    return (
      <div className="relative flex h-screen flex-col items-center justify-center gap-6 px-6 text-center carpet-texture">
        <CarpetBackground />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 flex flex-col items-center gap-4"
        >
          <User className="h-20 w-20 text-accent" />
          <h2 className="text-2xl font-bold text-foreground">Человек не найден</h2>
          <p className="max-w-sm text-muted-foreground">
            Вернитесь к семейному древу или создайте новую семью.
          </p>
          <Button
            size="lg"
            onClick={() => navigateTo("/tree")}
            className="carpet-button mt-2 gap-2 px-6 text-primary-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            К древу
          </Button>
        </motion.div>
      </div>
    );
  }

  function handleSave() {
    const updated: Person = {
      ...person,
      ...editForm,
    } as Person;
    if (!updated.firstName.trim() || !updated.lastName.trim()) {
      toast.error("Введите имя и фамилию");
      return;
    }
    if (updated.birthDate && !isValidDate(updated.birthDate)) {
      toast.error("Неверный формат даты");
      return;
    }
    updatePerson(updated);
    setIsEditing(false);
    toast.success("Сохранено");
  }

  function handleDelete() {
    if (!person) return;
    if (confirm("Удалить человека из семейного дерева?")) {
      deletePerson(person.id);
      navigateTo("/tree");
    }
  }

  function handleAddPhotoUrl() {
    if (!person) return;
    const url = prompt("Вставьте ссылку на фотографию:");
    if (url?.trim()) {
      addPhoto({ personId: person.id, url: url.trim(), createdAt: Date.now() });
      toast.success("Фото добавлено");
    }
  }

  function handleAddUploadedPhoto(url: string) {
    if (!person) return;
    addPhoto({ personId: person.id, url, createdAt: Date.now() });
  }

  const age = calculateAge(person.birthDate);

  return (
    <div className="relative min-h-screen carpet-texture">
      <CarpetBackground />
      <header className="carpet-card sticky top-0 z-20 flex items-center justify-between border-b border-border px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <Link href={getPagePath("/tree")}>
            <Button variant="ghost" size="icon" className="text-foreground hover:bg-accent/10 hover:text-accent">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-lg font-bold text-foreground">Профиль</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsEditing(!isEditing)}
            className="text-foreground hover:bg-accent/10 hover:text-accent"
          >
            <Edit2 className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleDelete} className="hover:bg-destructive/10">
            <Trash2 className="h-5 w-5 text-destructive" />
          </Button>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-6"
        >
          <Card className="carpet-card overflow-hidden border-0">
            <CardContent className="flex flex-col items-center gap-4 p-8">
              <PersonAvatar
                src={person.photoUrl}
                name={`${person.firstName} ${person.lastName}`}
                size="xl"
              />
              <div className="text-center">
                {isEditing ? (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="sr-only">Имя</Label>
                      <Input
                        value={editForm.firstName || ""}
                        onChange={(e) =>
                          setEditForm({ ...editForm, firstName: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label className="sr-only">Фамилия</Label>
                      <Input
                        value={editForm.lastName || ""}
                        onChange={(e) =>
                          setEditForm({ ...editForm, lastName: e.target.value })
                        }
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold text-accent">
                      {person.firstName} {person.lastName}
                    </h2>
                    <p className="text-muted-foreground">
                      {RELATIONSHIP_LABELS[person.relationshipType]}
                    </p>
                  </>
                )}
              </div>
              <OrnamentDivider className="w-32" />
            </CardContent>
          </Card>

          <Card className="carpet-card border-0">
            <CardContent className="space-y-4 p-6">
              <DetailRow
                icon={<Calendar className="h-4 w-4 text-accent" />}
                label="Дата рождения"
                value={person.birthDate || "—"}
                editing={isEditing}
                editValue={editForm.birthDate || ""}
                onEditChange={(v) =>
                  setEditForm({ ...editForm, birthDate: formatDateInput(v) })
                }
                inputMode="date"
              />
              <DetailRow
                icon={<User className="h-4 w-4 text-accent" />}
                label="Возраст"
                value={age !== null ? `${age} лет` : "—"}
              />
              <DetailRow
                icon={<User className="h-4 w-4 text-accent" />}
                label="Пол"
                value={GENDER_LABELS[person.gender]}
                editing={isEditing}
                editType="gender"
                editValue={editForm.gender || "other"}
                onEditChange={(v) =>
                  setEditForm({ ...editForm, gender: v as Gender })
                }
              />
              <DetailRow
                icon={<Users className="h-4 w-4 text-accent" />}
                label="Родитель/супруг"
                value={parent ? `${parent.firstName} ${parent.lastName}` : "—"}
              />
            </CardContent>
          </Card>

          {(person.notes || isEditing) && (
            <Card className="carpet-card border-0">
              <CardContent className="p-6">
                <h3 className="mb-2 text-sm font-medium text-accent">
                  Заметки
                </h3>
                {isEditing ? (
                  <Textarea
                    value={editForm.notes || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, notes: e.target.value })
                    }
                    rows={4}
                    className="border-border bg-background"
                  />
                ) : (
                  <p className="whitespace-pre-wrap text-foreground">
                    {person.notes || "Нет заметок"}
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {isEditing && (
            <Button
              onClick={handleSave}
              className="carpet-button w-full"
            >
              <Save className="mr-2 h-4 w-4" />
              Сохранить изменения
            </Button>
          )}

          <Card className="carpet-card border-0">
            <CardContent className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-accent">Галерея</h3>
                <div className="flex items-center gap-2">
                  <PhotoUpload onUpload={handleAddUploadedPhoto} />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAddPhotoUrl}
                    className="gap-1 border-border bg-background hover:border-accent hover:text-accent"
                  >
                    <LinkIcon className="h-4 w-4" />
                    URL
                  </Button>
                </div>
              </div>
              {personPhotos.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border bg-background/50 p-8 text-center text-muted-foreground">
                  В личной галерее пока нет фотографий
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {personPhotos.map((photo) => (
                    <PhotoCard
                      key={photo.id}
                      photo={photo}
                      onDelete={() => deletePhoto(photo.id)}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="carpet-card border-0">
            <CardContent className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-accent">Дети и родственники</h3>
                <AddPersonDialog defaultParentId={person.id}>
                  <Button variant="outline" size="sm" className="gap-1 border-border bg-background hover:border-accent hover:text-accent">
                    <User className="h-4 w-4" />
                    Добавить
                  </Button>
                </AddPersonDialog>
              </div>
              {children.length === 0 ? (
                <p className="text-center text-muted-foreground">
                  Пока нет детей или близких родственников
                </p>
              ) : (
                <div className="space-y-2">
                  {children.map((child) => (
                    <Link key={child.id} href={getPagePath(`/person/${child.id}`)}>
                      <div className="carpet-card flex items-center gap-3 border p-3 transition-colors hover:border-accent hover:bg-accent/5">
                        <PersonAvatar
                          src={child.photoUrl}
                          name={`${child.firstName} ${child.lastName}`}
                          size="sm"
                        />
                        <div>
                          <p className="font-medium text-foreground">
                            {child.firstName} {child.lastName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {calculateAge(child.birthDate) !== null
                              ? `${calculateAge(child.birthDate)} лет`
                              : RELATIONSHIP_LABELS[child.relationshipType]}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}

function DetailRow({
  icon,
  label,
  value,
  editing,
  editValue,
  onEditChange,
  inputMode,
  editType = "text",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  editing?: boolean;
  editValue?: string;
  onEditChange?: (value: string) => void;
  inputMode?: "text" | "date";
  editType?: "text" | "gender";
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-2">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {icon}
        <span>{label}</span>
      </div>
      {editing ? (
        editType === "gender" ? (
          <Select value={editValue} onValueChange={(v) => onEditChange?.(v ?? "")}>
            <SelectTrigger className="w-40 border-border bg-background">
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
        ) : (
          <Input
            value={editValue}
            onChange={(e) => onEditChange?.(e.target.value)}
            className="w-40 border-border bg-background"
            inputMode={inputMode === "date" ? "numeric" : "text"}
          />
        )
      ) : (
        <span className="font-medium text-foreground">{value}</span>
      )}
    </div>
  );
}

function PhotoCard({ photo, onDelete }: { photo: Photo; onDelete: () => void }) {
  return (
    <div className="carpet-card group relative aspect-square overflow-hidden rounded-xl border">
      <img
        src={photo.url}
        alt={photo.caption || "Фото"}
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <button
        onClick={onDelete}
        className="absolute right-2 top-2 rounded-full bg-destructive p-1 text-destructive-foreground opacity-0 transition-opacity group-hover:opacity-100"
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
}
