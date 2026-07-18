"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CarpetBackground } from "@/components/carpet-background";
import { Logo } from "@/components/logo";
import { OrnamentDivider } from "@/components/ornament";
import { PersonAvatar } from "@/components/person-avatar";
import { useFamilyStore } from "@/lib/store";
import { parseDateParts } from "@/lib/utils";
import { getPagePath } from "@/lib/navigate";
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

  if (!family) return null;

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
          <Card className="carpet-card border-0">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-accent">Дни рождения</h2>
              <OrnamentDivider className="mx-auto mt-3 w-32" />
              <p className="mt-4 text-muted-foreground">
                Список дней рождения родственников, отсортированный по близости даты.
              </p>
            </CardContent>
          </Card>

          {upcoming.length === 0 ? (
            <Card className="carpet-card border-0">
              <CardContent className="p-8 text-center text-muted-foreground">
                <Cake className="mx-auto mb-3 h-10 w-10 text-accent" />
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
                  <Link href={getPagePath(`/person/${item.person.id}`)}>
                    <Card className="carpet-card border-0 transition-colors hover:border-accent hover:bg-accent/5">
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
                                ? "bg-accent text-accent-foreground"
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
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
