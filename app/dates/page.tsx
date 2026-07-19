"use client";

import { useMemo, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { NeonBackground } from "@/components/neon-background";
import { Logo } from "@/components/logo";
import { OrnamentDivider } from "@/components/ornament";
import { PersonAvatar } from "@/components/person-avatar";
import { useFamilyStore } from "@/lib/store";
import { parseDateParts } from "@/lib/utils";
import { navigateTo } from "@/lib/navigate";
import { ArrowLeft, Cake } from "lucide-react";

function getDaysUntilBirthday(day: number, month: number): number {
  const today = new Date();
  const current = new Date(today.getFullYear(), month - 1, day);
  if (current < new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
    current.setFullYear(today.getFullYear() + 1);
  }
  const diff = current.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default function DatesPage() {
  const family = useFamilyStore((state) => state.family);
  const people = useFamilyStore((state) => state.family?.people || []);

  const upcoming = useMemo(() => {
    return people
      .filter((p) => p.birthDate)
      .map((p) => {
        const parts = parseDateParts(p.birthDate);
        if (!parts) return null;
        const [, month, day] = parts;
        const days = getDaysUntilBirthday(day, month);
        return { person: p, days, date: p.birthDate! };
      })
      .filter(Boolean)
      .sort((a, b) => a!.days - b!.days) as {
      person: (typeof people)[number];
      days: number;
      date: string;
    }[];
  }, [people]);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!family) {
    return (
      <div className="relative flex h-screen flex-col items-center justify-center gap-6 px-6 text-center carpet-texture">
        <NeonBackground />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 flex flex-col items-center gap-4"
        >
          <Cake className="h-20 w-20 text-primary drop-shadow-[0_0_8px_rgba(0,243,255,0.4)]" />
          <h2 className="text-2xl font-bold text-foreground">Важные даты</h2>
          <p className="max-w-sm text-muted-foreground">
            Создайте семью, чтобы увидеть дни рождения родственников.
          </p>
        </motion.div>
      </div>
    );
  }

  if (!mounted) return null;

  return (
    <div className="relative min-h-screen carpet-texture">
      <NeonBackground />
      <header className="neon-card sticky top-0 z-20 flex items-center justify-between border-b border-border px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigateTo("/tree")} className="text-foreground hover:bg-primary/10 hover:text-primary hover:shadow-[0_0_12px_rgba(0,243,255,0.2)]">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <Logo size={36} />
            <h1 className="text-lg font-bold text-foreground">Важные даты</h1>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-6"
        >
          <Card className="neon-card border-0">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-primary drop-shadow-[0_0_8px_rgba(0,243,255,0.4)]">Дни рождения</h2>
              <OrnamentDivider className="mx-auto mt-3 w-32" />
              <p className="mt-4 text-muted-foreground">
                Список дней рождения родственников, отсортированный по близости даты.
              </p>
            </CardContent>
          </Card>

          {upcoming.length === 0 ? (
            <Card className="neon-card border-0">
              <CardContent className="p-8 text-center text-muted-foreground">
                <Cake className="mx-auto mb-3 h-10 w-10 text-primary drop-shadow-[0_0_8px_rgba(0,243,255,0.4)]" />
                Пока нет дат рождения. Добавьте их в профилях родственников.
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-3">
              {upcoming.map((item, index) => (
                <motion.div
                  key={item.person.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <button
                    onClick={() => navigateTo(`/person/${item.person.id}`)}
                    className="w-full text-left"
                    type="button"
                  >
                    <Card className="neon-card border-0 transition-colors hover:border-primary hover:bg-primary/5">
                      <CardContent className="flex items-center gap-4 p-4">
                        <PersonAvatar
                          src={item.person.photoUrl}
                          name={`${item.person.firstName} ${item.person.lastName}`}
                          size="sm"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-foreground">
                            {item.person.firstName} {item.person.lastName}
                          </p>
                          <p className="text-sm text-muted-foreground">{item.date}</p>
                        </div>
                        <span
                          className={`rounded-full px-3 py-1 text-sm font-medium ${
                            item.days === 0
                              ? "bg-primary text-primary-foreground"
                              : item.days <= 7
                                ? "bg-accent text-accent-foreground shadow-[0_0_12px_rgba(176,38,255,0.4)]"
                                : "bg-secondary text-secondary-foreground"
                          }`}
                        >
                          {item.days === 0
                            ? "Сегодня!"
                            : item.days === 1
                              ? "Завтра"
                              : `Через ${item.days} дн.`}
                        </span>
                      </CardContent>
                    </Card>
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
