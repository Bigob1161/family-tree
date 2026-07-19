"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFamilyStore } from "@/lib/store";
import { Family } from "@/lib/types";
import { navigateTo } from "@/lib/navigate";
import { Users, Copy, Check } from "lucide-react";
import { toast } from "sonner";

function encodeFamily(family: Family): string {
  try {
    const json = JSON.stringify(family);
    return btoa(unescape(encodeURIComponent(json)));
  } catch {
    return "";
  }
}

export function decodeFamily(encoded: string): Family | null {
  try {
    const json = decodeURIComponent(escape(atob(encoded)));
    const parsed = JSON.parse(json);
    if (!parsed.id || !Array.isArray(parsed.people) || !Array.isArray(parsed.photos)) {
      return null;
    }
    return parsed as Family;
  } catch {
    return null;
  }
}

interface JoinFamilyDialogProps {
  open: boolean;
  encodedFamily: string;
  onClose: () => void;
}

export function JoinFamilyDialog({ open, encodedFamily, onClose }: JoinFamilyDialogProps) {
  const family = useFamilyStore((state) => state.family);
  const mergeFamily = useFamilyStore((state) => state.mergeFamily);
  const setFamily = useFamilyStore((state) => state.setFamily);
  const setCollaboratorName = useFamilyStore((state) => state.setCollaboratorName);
  const collaboratorName = useFamilyStore((state) => state.collaboratorName);
  const [name, setName] = useState(collaboratorName);

  const imported = decodeFamily(encodedFamily);

  function handleJoin() {
    if (!imported) return;
    setCollaboratorName(name.trim());
    if (family) {
      mergeFamily(imported);
      toast.success(`Добавлено ${imported.people.length} родственников из приглашения`);
    } else {
      setFamily(imported);
      toast.success("Вы присоединились к семейному древу");
    }
    navigateTo("/tree");
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="border-primary/30 bg-card/95 backdrop-blur-md sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="neon-text flex items-center gap-2 text-xl font-bold">
            <Users className="h-5 w-5" />
            Приглашение в семейное древо
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {imported ? (
            <>
              <p className="text-sm text-muted-foreground">
                Владелец поделился древом <span className="font-semibold text-foreground">«{imported.name}»</span>.
                {family
                  ? " Новые карточки будут объединены с вашим текущим древом."
                  : " Присоединитесь, чтобы просматривать и добавлять своих родственников."}
              </p>

              <div className="space-y-2">
                <Label htmlFor="collabName">Ваше имя (будет видно на добавленных карточках)</Label>
                <Input
                  id="collabName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Например, Алишер"
                  className="border-primary/30 bg-background/80 focus:border-primary focus:ring-primary/30"
                />
              </div>

              <Button onClick={handleJoin} className="neon-button w-full gap-2">
                <Users className="h-4 w-4" />
                {family ? "Объединить древа" : "Присоединиться к древу"}
              </Button>
            </>
          ) : (
            <p className="text-sm text-destructive">Ссылка приглашения повреждена или устарела.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function ShareFamilyButton() {
  const family = useFamilyStore((state) => state.family);
  const [copied, setCopied] = useState(false);

  if (!family) return null;

  async function handleCopy() {
    const encoded = encodeFamily(family!);
    const url = `${window.location.origin}${window.location.pathname}?family=${encoded}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Ссылка-приглашение скопирована");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Не удалось скопировать ссылку");
    }
  }

  return (
    <Button onClick={handleCopy} variant="outline" className="neon-button w-full gap-2 bg-background/60 hover:text-background">
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      {copied ? "Скопировано" : "Скопировать ссылку-приглашение"}
    </Button>
  );
}
