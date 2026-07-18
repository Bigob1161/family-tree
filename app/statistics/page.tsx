"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Logo } from "@/components/logo";
import { OrnamentDivider } from "@/components/ornament";
import { useFamilyStore } from "@/lib/store";
import { calculateAge, parseDateParts } from "@/lib/utils";
import { ArrowLeft, Users, User, Camera, Calendar } from "lucide-react";

export default function StatisticsPage() {
  const family = useFamilyStore((state) => state.family);
  const people = useFamilyStore((state) => state.family?.people || []);
  const photos = useFamilyStore((state) => state.family?.photos || []);

  const stats = useMemo(() => {
    const total = people.length;
    const men = people.filter((p) => p.gender === "male").length;
    const women = people.filter((p) => p.gender === "female").length;
    const other = total - men - women;

    const ages = people
      .map((p) => calculateAge(p.birthDate))
      .filter((a): a is number => a !== null)
      .sort((a, b) => a - b);

    const generations = new Set<number>();
    const byId = new Map(people.map((p) => [p.id, p]));
    for (const person of people) {
      let depth = 0;
      let current: typeof person | undefined = person;
      const seen = new Set<string>();
      while (current?.parentId && byId.has(current.parentId) && !seen.has(current.id)) {
        seen.add(current.id);
        depth++;
        current = byId.get(current.parentId);
      }
      generations.add(depth);
    }

    const decades: Record<string, number> = {};
    for (const person of people) {
      const parts = parseDateParts(person.birthDate);
      if (!parts) continue;
      const year = parts[2];
      const decade = `${Math.floor(year / 10) * 10}-е`;
      decades[decade] = (decades[decade] || 0) + 1;
    }

    return {
      total,
      men,
      women,
      other,
      avgAge: ages.length ? Math.round(ages.reduce((a, b) => a + b, 0) / ages.length) : null,
      oldest: ages.length ? ages[ages.length - 1] : null,
      youngest: ages.length ? ages[0] : null,
      generations: generations.size,
      withBirthDate: people.filter((p) => p.birthDate).length,
      photos: photos.length,
      decades,
    };
  }, [people, photos.length]);

  if (!family) return null;

  return (
    <div className="min-h-screen bg-background paper-texture">
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-card/90 px-4 py-3 backdrop-blur sm:px-6">
        <div className="flex items-center gap-3">
          <Link href="/tree">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <Logo size={36} />
            <h1 className="text-lg font-semibold text-foreground">Статистика</h1>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-6"
        >
          <Card className="border-border bg-card">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-semibold text-primary">Статистика семьи</h2>
              <OrnamentDivider className="mx-auto mt-3 w-32" />
              <p className="mt-4 text-muted-foreground">
                Цифры, поколения и интересные факты о вашем роде.
              </p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard icon={<Users className="h-5 w-5" />} label="Всего" value={stats.total} />
            <StatCard icon={<User className="h-5 w-5" />} label="Мужчин" value={stats.men} />
            <StatCard icon={<User className="h-5 w-5" />} label="Женщин" value={stats.women} />
            <StatCard icon={<Camera className="h-5 w-5" />} label="Фото" value={stats.photos} />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Card className="border-border bg-card">
              <CardContent className="space-y-3 p-5">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">Возраст</span>
                </div>
                <div className="space-y-1 text-sm">
                  <p>
                    Средний возраст: <strong className="text-foreground">{stats.avgAge ?? "—"}</strong>
                  </p>
                  <p>
                    Старший: <strong className="text-foreground">{stats.oldest ?? "—"}</strong>
                  </p>
                  <p>
                    Младший: <strong className="text-foreground">{stats.youngest ?? "—"}</strong>
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardContent className="space-y-3 p-5">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">Поколения</span>
                </div>
                <div className="space-y-1 text-sm">
                  <p>
                    Поколений в дереве: <strong className="text-foreground">{stats.generations}</strong>
                  </p>
                  <p>
                    С датой рождения: <strong className="text-foreground">{stats.withBirthDate}</strong>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {Object.keys(stats.decades).length > 0 && (
            <Card className="border-border bg-card">
              <CardContent className="p-5">
                <h3 className="mb-4 text-sm font-medium text-secondary-foreground">Десятилетия рождений</h3>
                <div className="space-y-3">
                  {Object.entries(stats.decades)
                    .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
                    .map(([decade, count]) => {
                      const max = Math.max(...Object.values(stats.decades));
                      const pct = max ? (count / max) * 100 : 0;
                      return (
                        <div key={decade} className="flex items-center gap-3">
                          <span className="w-16 text-sm text-muted-foreground">{decade}</span>
                          <div className="flex-1 overflow-hidden rounded-full bg-secondary">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ duration: 0.8 }}
                              className="h-3 rounded-full bg-primary"
                            />
                          </div>
                          <span className="w-8 text-right text-sm font-medium text-foreground">{count}</span>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </main>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <Card className="border-border bg-card">
      <CardContent className="flex flex-col items-center gap-1 p-4 text-center">
        <div className="text-primary">{icon}</div>
        <span className="text-2xl font-semibold text-foreground">{value}</span>
        <span className="text-xs text-muted-foreground">{label}</span>
      </CardContent>
    </Card>
  );
}
