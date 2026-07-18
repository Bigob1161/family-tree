"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FamilyTree } from "@/components/tree/family-tree";
import { AddPersonDialog } from "@/components/add-person-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/logo";
import { OrnamentDivider } from "@/components/ornament";
import { CarpetBackground } from "@/components/carpet-background";
import { useFamilyStore } from "@/lib/store";
import { calculateAge } from "@/lib/utils";
import { navigateTo, getPagePath } from "@/lib/navigate";
import { Search, Settings, UserPlus, TreePine } from "lucide-react";
import Link from "next/link";

export default function TreePage() {
  const family = useFamilyStore((state) => state.family);
  const people = useFamilyStore((state) => state.family?.people || []);
  const searchQuery = useFamilyStore((state) => state.searchQuery);
  const setSearchQuery = useFamilyStore((state) => state.setSearchQuery);
  const createFamily = useFamilyStore((state) => state.createFamily);
  const [showSearch, setShowSearch] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return people.filter((p) =>
      `${p.firstName} ${p.lastName}`.toLowerCase().includes(q)
    );
  }, [searchQuery, people]);

  if (!family) {
    return (
      <div className="relative flex h-screen flex-col items-center justify-center gap-6 px-6 text-center carpet-texture">
        <CarpetBackground />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 flex flex-col items-center gap-4"
        >
          <TreePine className="h-20 w-20 text-accent" />
          <h2 className="text-2xl font-bold text-foreground">Семейный архив</h2>
          <OrnamentDivider className="w-40 text-accent" />
          <p className="max-w-sm text-muted-foreground">
            Создайте семью, чтобы начать собирать историю вашего рода.
          </p>
          <Button
            size="lg"
            onClick={() => {
              createFamily("Моя семья");
              navigateTo("/tree");
            }}
            className="carpet-button mt-2 gap-2 px-6 text-primary-foreground"
          >
            <UserPlus className="h-4 w-4" />
            Создать семью
          </Button>
        </motion.div>
      </div>
    );
  }

  if (!mounted) return null;

  return (
    <div className="relative flex h-screen flex-col overflow-hidden bg-background carpet-texture">
      <CarpetBackground />
      <header className="carpet-card z-20 flex items-center justify-between border-b border-border px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <Link href={getPagePath("/")} className="flex items-center gap-2">
            <Logo size={40} />
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold leading-tight text-foreground">
                Family Archive
              </h1>
              <p className="text-xs text-accent">{family.name}</p>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <AnimatePresence>
            {showSearch && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 240, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="relative overflow-hidden"
              >
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Поиск родственника..."
                  className="h-9 w-full border-accent/30 bg-card/80 pr-8 text-foreground placeholder:text-muted-foreground"
                  autoFocus
                />
                {searchQuery && (
                  <div className="absolute right-0 top-10 z-30 w-60 rounded-xl border border-accent/30 bg-card/95 p-2 shadow-xl backdrop-blur-sm">
                    {searchResults.length === 0 ? (
                      <p className="px-2 py-1 text-sm text-muted-foreground">
                        Ничего не найдено
                      </p>
                    ) : (
                      searchResults.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => {
                            navigateTo(`/person/${p.id}`);
                            setSearchQuery("");
                            setShowSearch(false);
                          }}
                          className="w-full rounded-lg px-2 py-1.5 text-left text-sm transition-colors hover:bg-accent/10"
                        >
                          <span className="font-medium text-foreground">
                            {p.firstName} {p.lastName}
                          </span>
                          <span className="ml-2 text-xs text-muted-foreground">
                            {calculateAge(p.birthDate) !== null
                              ? `${calculateAge(p.birthDate)} лет`
                              : ""}
                          </span>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSearch(!showSearch)}
            className="text-foreground hover:bg-accent/10 hover:text-accent"
          >
            <Search className="h-5 w-5" />
          </Button>

          <AddPersonDialog>
            <Button
              variant="ghost"
              size="icon"
              className="text-foreground hover:bg-accent/10 hover:text-accent"
            >
              <UserPlus className="h-5 w-5" />
            </Button>
          </AddPersonDialog>

          <Link href={getPagePath("/settings")}>
            <Button
              variant="ghost"
              size="icon"
              className="text-foreground hover:bg-accent/10 hover:text-accent"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </header>

      <main className="relative flex-1">
        {people.length === 0 ? (
          <div className="relative flex h-full flex-col items-center justify-center gap-6 px-6 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative z-10 flex flex-col items-center gap-4"
            >
              <TreePine className="h-20 w-20 text-accent" />
              <h2 className="text-2xl font-bold text-foreground">
                Ваше семейное древо еще не посажено
              </h2>
              <OrnamentDivider className="w-40 text-accent" />
              <p className="max-w-sm text-muted-foreground">
                Добавьте первого родственника, чтобы начать собирать историю вашей семьи.
              </p>
              <AddPersonDialog>
                <Button className="carpet-button mt-2 gap-2 px-6 text-primary-foreground">
                  <UserPlus className="h-4 w-4" />
                  Посадить первое семейное древо
                </Button>
              </AddPersonDialog>
            </motion.div>
          </div>
        ) : (
          <FamilyTree />
        )}
      </main>
    </div>
  );
}
