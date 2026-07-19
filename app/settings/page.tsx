"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/logo";
import { OrnamentDivider } from "@/components/ornament";
import { NeonBackground } from "@/components/neon-background";
import { useFamilyStore } from "@/lib/store";
import { calculateAge } from "@/lib/utils";
import { navigateTo } from "@/lib/navigate";
import { ArrowLeft, Moon, Trash2, BarChart3, CalendarDays, History, Download, Upload, Sparkles } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const family = useFamilyStore((state) => state.family);
  const people = useFamilyStore((state) => state.family?.people || []);
  const photos = useFamilyStore((state) => state.family?.photos || []);
  const darkMode = useFamilyStore((state) => state.darkMode);
  const toggleDarkMode = useFamilyStore((state) => state.toggleDarkMode);
  const deletePerson = useFamilyStore((state) => state.deletePerson);
  const setFamily = useFamilyStore((state) => state.setFamily);
  const [importText, setImportText] = useState("");

  if (!family) {
    return (
      <div className="relative flex h-screen flex-col items-center justify-center gap-6 px-6 text-center carpet-texture">
        <NeonBackground />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 flex flex-col items-center gap-4"
        >
          <Logo size={80} />
          <h2 className="text-2xl font-bold text-foreground">Семейный архив</h2>
          <OrnamentDivider className="w-40 text-primary drop-shadow-[0_0_8px_rgba(0,243,255,0.4)]" />
          <p className="max-w-sm text-muted-foreground">
            Создайте семью, чтобы открыть настройки.
          </p>
          <Button
            size="lg"
            onClick={() => navigateTo("/")}
            className="neon-button mt-2 gap-2 px-6"
          >
            <ArrowLeft className="h-4 w-4" />
            На главную
          </Button>
        </motion.div>
      </div>
    );
  }

  const stats = {
    total: people.length,
    men: people.filter((p) => p.gender === "male").length,
    women: people.filter((p) => p.gender === "female").length,
    photos: photos.length,
    generations: calculateGenerations(people),
  };

  function handleClear() {
    if (confirm("Удалить всех родственников и фотографии?")) {
      for (const person of people) deletePerson(person.id);
      toast.success("Данные очищены");
      navigateTo("/");
    }
  }

  function handleExport() {
    const data = JSON.stringify({ family, photos }, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `family-archive-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Архив экспортирован");
  }

  function handleImport() {
    try {
      const parsed = JSON.parse(importText);
      if (!parsed.family) throw new Error("Неверный формат");
      setFamily(parsed.family);
      setImportText("");
      toast.success("Архив импортирован");
      navigateTo("/tree");
    } catch {
      toast.error("Не удалось импортировать JSON");
    }
  }

  return (
    <div className="relative min-h-screen carpet-texture">
      <NeonBackground />
      <header className="neon-card sticky top-0 z-20 flex items-center gap-3 border-b border-border px-4 py-3 sm:px-6">
        <Button variant="ghost" size="icon" onClick={() => navigateTo("/tree")} className="text-foreground hover:bg-primary/10 hover:text-primary hover:shadow-[0_0_12px_rgba(0,243,255,0.2)]">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-bold text-foreground">Настройки</h1>
      </header>

      <main className="relative z-10 mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-6"
        >
          <Card className="neon-card border-0">
            <CardContent className="flex flex-col items-center gap-3 p-8">
              <Logo size={80} />
              <h2 className="text-2xl font-bold text-primary drop-shadow-[0_0_8px_rgba(0,243,255,0.4)]">Family Archive</h2>
              <OrnamentDivider className="w-32" />
              <p className="text-sm text-muted-foreground">Версия 1.1.0 · Цифровой архив рода</p>
            </CardContent>
          </Card>

          <Card className="neon-card border-0 overflow-hidden">
            <CardContent className="divide-y divide-border/50 p-0">
              <button onClick={() => navigateTo("/statistics")} className="w-full text-left" type="button">
                <div className="flex items-center justify-between p-4 transition-colors hover:bg-primary/5">
                  <div className="flex items-center gap-3">
                    <BarChart3 className="h-5 w-5 text-primary drop-shadow-[0_0_8px_rgba(0,243,255,0.4)]" />
                    <span className="text-foreground">Статистика семьи</span>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    <p>{stats.total} родственников</p>
                    <p>{stats.generations} поколений</p>
                  </div>
                </div>
              </button>

              <button onClick={() => navigateTo("/dates")} className="w-full text-left" type="button">
                <div className="flex items-center justify-between p-4 transition-colors hover:bg-primary/5">
                  <div className="flex items-center gap-3">
                    <CalendarDays className="h-5 w-5 text-primary drop-shadow-[0_0_8px_rgba(0,243,255,0.4)]" />
                    <span className="text-foreground">Даты и дни рождения</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {people.filter((p) => p.birthDate).length} дат
                  </span>
                </div>
              </button>

              <button onClick={() => navigateTo("/timeline")} className="w-full text-left" type="button">
                <div className="flex items-center justify-between p-4 transition-colors hover:bg-primary/5">
                  <div className="flex items-center gap-3">
                    <History className="h-5 w-5 text-primary drop-shadow-[0_0_8px_rgba(0,243,255,0.4)]" />
                    <span className="text-foreground">История семьи</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {people.filter((p) => p.birthDate).length} событий
                  </span>
                </div>
              </button>

              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <Moon className="h-5 w-5 text-primary drop-shadow-[0_0_8px_rgba(0,243,255,0.4)]" />
                  <span className="text-foreground">Темная тема</span>
                </div>
                <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
              </div>
            </CardContent>
          </Card>

          <Card className="neon-card border-0">
            <CardContent className="space-y-4 p-6">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-primary drop-shadow-[0_0_8px_rgba(0,243,255,0.4)]">
                <Sparkles className="h-5 w-5" />
                Резервная копия
              </h3>
              <Button onClick={handleExport} className="neon-button w-full gap-2">
                <Download className="h-4 w-4" />
                Экспортировать JSON
              </Button>
              <div className="space-y-2">
                <Input
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  placeholder="Вставьте JSON для импорта..."
                  className="border-primary/30 bg-background/80 focus:border-primary focus:ring-primary/30"
                />
                <Button onClick={handleImport} disabled={!importText.trim()} className="neon-button w-full gap-2">
                  <Upload className="h-4 w-4" />
                  Импортировать
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="neon-card border-2 border-destructive/30">
            <CardContent className="p-4">
              <Button
                variant="destructive"
                className="w-full gap-2 bg-destructive/20 text-destructive hover:bg-destructive hover:text-destructive-foreground hover:shadow-[0_0_24px_rgba(255,42,109,0.5)]"
                onClick={handleClear}
              >
                <Trash2 className="h-4 w-4" />
                Очистить все данные
              </Button>
              <p className="mt-2 text-center text-xs text-muted-foreground">
                Удалит всех родственников и фотографии безвозвратно
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}

function calculateGenerations(people: { id: string; parentId?: string }[]) {
  const byId = new Map(people.map((p) => [p.id, p]));
  const depths = new Set<number>();
  for (const person of people) {
    let depth = 0;
    let current: typeof person | undefined = person;
    const seen = new Set<string>();
    while (current?.parentId && byId.has(current.parentId) && !seen.has(current.id)) {
      seen.add(current.id);
      depth++;
      current = byId.get(current.parentId);
    }
    depths.add(depth);
  }
  return depths.size;
}
