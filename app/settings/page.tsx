"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Logo } from "@/components/logo";
import { OrnamentDivider } from "@/components/ornament";
import { useFamilyStore } from "@/lib/store";
import { calculateAge } from "@/lib/utils";
import { ArrowLeft, Moon, Trash2, BarChart3, CalendarDays, History } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const router = useRouter();
  const family = useFamilyStore((state) => state.family);
  const people = useFamilyStore((state) => state.family?.people || []);
  const photos = useFamilyStore((state) => state.family?.photos || []);
  const darkMode = useFamilyStore((state) => state.darkMode);
  const toggleDarkMode = useFamilyStore((state) => state.toggleDarkMode);
  const deletePerson = useFamilyStore((state) => state.deletePerson);

  if (!family) {
    if (typeof window !== "undefined") {
      router.replace("/");
    }
    return null;
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
      toggleDarkMode();
      toggleDarkMode();
      toast.success("Данные очищены");
      router.push("/");
    }
  }

  return (
    <div className="min-h-screen bg-background paper-texture">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-card/90 px-4 py-3 backdrop-blur sm:px-6">
        <Link href="/tree">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-lg font-semibold text-foreground">Настройки</h1>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-6"
        >
          <Card className="border-border bg-card">
            <CardContent className="flex flex-col items-center gap-3 p-8">
              <Logo size={72} />
              <h2 className="text-xl font-semibold text-primary">Family Archive</h2>
              <OrnamentDivider className="w-32" />
              <p className="text-sm text-muted-foreground">Версия 1.0.0</p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardContent className="divide-y divide-border p-0">
              <Link href="/statistics">
                <div className="flex items-center justify-between p-4 transition-colors hover:bg-secondary">
                  <div className="flex items-center gap-3">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    <span className="text-foreground">Статистика семьи</span>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    <p>{stats.total} родственников</p>
                    <p>{stats.generations} поколений</p>
                  </div>
                </div>
              </Link>

              <Link href="/dates">
                <div className="flex items-center justify-between p-4 transition-colors hover:bg-secondary">
                  <div className="flex items-center gap-3">
                    <CalendarDays className="h-5 w-5 text-primary" />
                    <span className="text-foreground">Даты и дни рождения</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {people.filter((p) => p.birthDate).length} дат
                  </span>
                </div>
              </Link>

              <Link href="/timeline">
                <div className="flex items-center justify-between p-4 transition-colors hover:bg-secondary">
                  <div className="flex items-center gap-3">
                    <History className="h-5 w-5 text-primary" />
                    <span className="text-foreground">История семьи</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {people.filter((p) => p.birthDate).length} событий
                  </span>
                </div>
              </Link>

              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <Moon className="h-5 w-5 text-primary" />
                  <span className="text-foreground">Темная тема</span>
                </div>
                <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
              </div>
            </CardContent>
          </Card>

          <Card className="border-destructive/50 bg-card">
            <CardContent className="p-4">
              <Button
                variant="destructive"
                className="w-full gap-2"
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
