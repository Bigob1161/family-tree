"use client";

import { useMemo, useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
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
import { NeonBackground } from "@/components/neon-background";
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
import { navigateTo, navigateToPerson } from "@/lib/navigate";
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
  Heart,
  Share2,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

function PersonPageInner() {
  const searchParams = useSearchParams();
  const rawId = searchParams.get("id");
  const family = useFamilyStore((state) => state.family);
  const people = useFamilyStore((state) => state.family?.people || []);
  const photos = useFamilyStore((state) => state.family?.photos || []);
  const updatePerson = useFamilyStore((state) => state.updatePerson);
  const deletePerson = useFamilyStore((state) => state.deletePerson);
  const addPhoto = useFamilyStore((state) => state.addPhoto);
  const deletePhoto = useFamilyStore((state) => state.deletePhoto);
  const [isEditing, setIsEditing] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const person = useMemo(
    () => people.find((p) => p.id === rawId) || people[0],
    [people, rawId]
  );

  const id = person?.id ?? rawId ?? "";

  const parent = useMemo(
    () => people.find((p) => p.id === person?.parentId),
    [people, person]
  );

  const children = useMemo(
    () => people.filter((p) => p.parentId === id),
    [people, id]
  );

  const siblings = useMemo(
    () => people.filter((p) => p.parentId && p.parentId === person?.parentId && p.id !== id),
    [people, person, id]
  );

  const personPhotos = useMemo(
    () => photos.filter((p) => p.personId === id),
    [photos, id]
  );

  const [editForm, setEditForm] = useState<Partial<Person>>(() => person || {});

  useEffect(() => {
    if (person) setEditForm(person);
  }, [person?.id]);

  function handleSave() {
    if (!person) return;
    const updated: Person = { ...person, ...editForm } as Person;
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

  function handleShare() {
    if (!person) return;
    const text = `${person.firstName} ${person.lastName} — Family Archive`;
    if (navigator.share) {
      navigator.share({ title: text, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Ссылка скопирована");
    }
  }

  const age = person ? calculateAge(person.birthDate) : null;

  if (!mounted) return null;

  if (!family || !person) {
    return (
      <div className="relative flex h-screen flex-col items-center justify-center gap-6 px-6 text-center carpet-texture">
        <NeonBackground />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 flex flex-col items-center gap-4"
        >
          <User className="h-20 w-20 text-primary drop-shadow-[0_0_8px_var(--primary)]" />
          <h2 className="text-2xl font-bold text-foreground">Человек не найден</h2>
          <p className="max-w-sm text-muted-foreground">
            Вернитесь к семейному древу или создайте новую семью.
          </p>
          <Button
            size="lg"
            onClick={() => navigateTo("/tree")}
            className="neon-button mt-2 gap-2 px-6"
          >
            <ArrowLeft className="h-4 w-4" />
            К древу
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen carpet-texture">
      <NeonBackground />
      <header className="neon-card sticky top-0 z-20 flex items-center justify-between border-b border-border px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigateTo("/tree")}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-primary/10 hover:text-primary hover:shadow-[0_0_12px_var(--primary)]"
            type="button"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-bold text-foreground">Профиль</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleShare}
            className="text-foreground hover:bg-primary/10 hover:text-primary hover:shadow-[0_0_12px_var(--primary)]"
          >
            <Share2 className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsEditing(!isEditing)}
            className="text-foreground hover:bg-primary/10 hover:text-primary hover:shadow-[0_0_12px_var(--primary)]"
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
          <Card className="neon-card overflow-hidden border-0">
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
                    <h2 className="text-2xl font-bold text-primary drop-shadow-[0_0_8px_var(--primary)]">
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

          <Card className="neon-card border-0">
            <CardContent className="space-y-4 p-6">
              <DetailRow
                icon={<Calendar className="h-4 w-4 text-primary drop-shadow-[0_0_8px_var(--primary)]" />}
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
                icon={<User className="h-4 w-4 text-primary drop-shadow-[0_0_8px_var(--primary)]" />}
                label="Возраст"
                value={age !== null ? `${age} лет` : "—"}
              />
              <DetailRow
                icon={<User className="h-4 w-4 text-primary drop-shadow-[0_0_8px_var(--primary)]" />}
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
                icon={<Users className="h-4 w-4 text-primary drop-shadow-[0_0_8px_var(--primary)]" />}
                label="Родитель/супруг"
                value={parent ? `${parent.firstName} ${parent.lastName}` : "—"}
              />
            </CardContent>
          </Card>

          {(person.notes || isEditing) && (
            <Card className="neon-card border-0">
              <CardContent className="p-6">
                <h3 className="mb-2 text-sm font-medium text-primary drop-shadow-[0_0_8px_var(--primary)]">
                  Заметки
                </h3>
                {isEditing ? (
                  <Textarea
                    value={editForm.notes || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, notes: e.target.value })
                    }
                    rows={4}
                    className="border-primary/30 bg-background/80 focus:border-primary focus:ring-primary/30"
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
            <Button onClick={handleSave} className="neon-button w-full">
              <Save className="mr-2 h-4 w-4" />
              Сохранить изменения
            </Button>
          )}

          <Card className="neon-card border-0">
            <CardContent className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-primary drop-shadow-[0_0_8px_var(--primary)]">Галерея</h3>
                <div className="flex items-center gap-2">
                  <PhotoUpload onUpload={handleAddUploadedPhoto} />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAddPhotoUrl}
                    className="gap-1 neon-button bg-background/60 hover:text-background"
                  >
                    <LinkIcon className="h-4 w-4" />
                    URL
                  </Button>
                </div>
              </div>
              {personPhotos.length === 0 ? (
                <div className="rounded-lg border border-dashed border-primary/30 bg-background/80 p-8 text-center text-muted-foreground">
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

          {siblings.length > 0 && (
            <Card className="neon-card border-0">
              <CardContent className="p-6">
                <div className="mb-4 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-accent" />
                  <h3 className="text-lg font-semibold text-primary drop-shadow-[0_0_8px_var(--primary)]">Братья и сестры</h3>
                </div>
                <div className="space-y-2">
                  {siblings.map((sibling) => (
                    <button
                      key={sibling.id}
                      onClick={() => navigateToPerson(sibling.id)}
                      className="w-full text-left"
                      type="button"
                    >
                      <div className="neon-card flex items-center gap-3 border p-3 transition-colors hover:border-primary hover:bg-primary/5">
                        <PersonAvatar
                          src={sibling.photoUrl}
                          name={`${sibling.firstName} ${sibling.lastName}`}
                          size="sm"
                        />
                        <div>
                          <p className="font-medium text-foreground">
                            {sibling.firstName} {sibling.lastName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {calculateAge(sibling.birthDate) !== null
                              ? `${calculateAge(sibling.birthDate)} лет`
                              : RELATIONSHIP_LABELS[sibling.relationshipType]}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="neon-card border-0">
            <CardContent className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-destructive" />
                  <h3 className="text-lg font-semibold text-primary drop-shadow-[0_0_8px_var(--primary)]">Дети и родственники</h3>
                </div>
                <AddPersonDialog defaultParentId={person.id}>
                  <Button variant="outline" size="sm" className="gap-1 neon-button bg-background/60 hover:text-background">
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
                    <button
                      key={child.id}
                      onClick={() => navigateToPerson(child.id)}
                      className="w-full text-left"
                      type="button"
                    >
                      <div className="neon-card flex items-center gap-3 border p-3 transition-colors hover:border-primary hover:bg-primary/5">
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
                    </button>
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

export default function PersonPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <PersonPageInner />
    </Suspense>
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
            <SelectTrigger className="w-40 border-primary/30 bg-background/80 focus:border-primary focus:ring-primary/30">
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
            className="w-40 border-primary/30 bg-background/80 focus:border-primary focus:ring-primary/30"
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
    <div className="neon-card group relative aspect-square overflow-hidden rounded-xl border">
      <img
        src={photo.url}
        alt={photo.caption || "Фото"}
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <button
        onClick={onDelete}
        className="absolute right-2 top-2 rounded-full bg-destructive p-1 text-destructive-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:shadow-[0_0_12px_rgba(255,42,109,0.6)]"
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
}
