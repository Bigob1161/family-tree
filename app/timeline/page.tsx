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
import { ArrowLeft, Calendar } from "lucide-react";

export default function TimelinePage() {
  const family = useFamilyStore((state) => state.family);
  const people = useFamilyStore((state) => state.family?.people || []);

  const events = useMemo(() => {
    const list = people
      .filter((p) => p.birthDate)
      .map((p) => {
        const parts = parseDateParts(p.birthDate);
        const date = parts ? new Date(parts[2], parts[1] - 1, parts[0]) : new Date(0);
        return {
          id: p.id,
          type: "birth" as const,
          title: `Родился(ась) ${p.firstName} ${p.lastName}`,
          date,
          year: parts ? parts[2] : 0,
          person: p,
        };
      })
      .sort((a, b) => a.date.getTime() - b.date.getTime());
    return list;
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
            <h1 className="text-lg font-bold text-foreground">История семьи</h1>
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
              <h2 className="text-2xl font-bold text-accent">Хронология рода</h2>
              <OrnamentDivider className="mx-auto mt-3 w-32" />
              <p className="mt-4 text-muted-foreground">
                Важные события и поколения вашей семьи в порядке времени.
              </p>
            </CardContent>
          </Card>

          {events.length === 0 ? (
            <Card className="carpet-card border-0">
              <CardContent className="p-8 text-center text-muted-foreground">
                <Calendar className="mx-auto mb-3 h-10 w-10 text-accent" />
                Пока нет событий. Добавьте даты рождения родственникам, чтобы увидеть историю семьи.
              </CardContent>
            </Card>
          ) : (
            <div className="relative space-y-4 pl-6">
              <div className="absolute bottom-0 left-3 top-0 w-px bg-border" />
              {events.map((event, index) => (
                <motion.div
                  key={`${event.id}-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="relative"
                >
                  <div className="absolute -left-3 top-4 h-3 w-3 -translate-x-1/2 rounded-full bg-accent ring-2 ring-background" />
                  <Link href={getPagePath(`/person/${event.person.id}`)}>
                    <Card className="carpet-card border-0 transition-colors hover:border-accent hover:bg-accent/5">
                      <CardContent className="flex items-center gap-4 p-4">
                        <PersonAvatar
                          src={event.person.photoUrl}
                          name={`${event.person.firstName} ${event.person.lastName}`}
                          size="sm"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{event.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {event.person.birthDate}
                          </p>
                        </div>
                        <span className="rounded-full bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground">
                          {event.year}
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
