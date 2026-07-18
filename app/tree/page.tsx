"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FamilyTree } from "@/components/tree/family-tree";
import { AddPersonDialog } from "@/components/add-person-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/logo";
import { OrnamentDivider } from "@/components/ornament";
import { useFamilyStore } from "@/lib/store";
import { calculateAge } from "@/lib/utils";
import { Search, Settings, UserPlus, TreePine } from "lucide-react";
import Link from "next/link";

export default function TreePage() {
  const router = useRouter();
  const family = useFamilyStore((state) => state.family);
  const people = useFamilyStore((state) => state.family?.people || []);
  const searchQuery = useFamilyStore((state) => state.searchQuery);
  const setSearchQuery = useFamilyStore((state) => state.setSearchQuery);
  const [showSearch, setShowSearch] = useState(false);

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return people.filter((p) =>
      `${p.firstName} ${p.lastName}`.toLowerCase().includes(q)
    );
  }, [searchQuery, people]);

  if (!family) {
    if (typeof window !== "undefined") {
      router.replace("/");
    }
    return null;
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      <header className="z-20 flex items-center justify-between border-b border-border bg-card/80 px-4 py-3 backdrop-blur sm:px-6">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <Logo size={36} />
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold leading-tight text-foreground">
                Family Archive
              </h1>
              <p className="text-xs text-muted-foreground">{family.name}</p>
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
                  className="h-9 w-full pr-8"
                  autoFocus
                />
                {searchQuery && (
                  <div className="absolute right-0 top-10 z-30 w-60 rounded-md border border-border bg-card p-2 shadow-lg">
                    {searchResults.length === 0 ? (
                      <p className="px-2 py-1 text-sm text-muted-foreground">
                        Ничего не найдено
                      </p>
                    ) : (
                      searchResults.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => {
                            router.push(`/person/${p.id}`);
                            setSearchQuery("");
                            setShowSearch(false);
                          }}
                          className="w-full rounded px-2 py-1.5 text-left text-sm hover:bg-secondary"
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
          >
            <Search className="h-5 w-5" />
          </Button>

          <AddPersonDialog>
            <Button variant="ghost" size="icon">
              <UserPlus className="h-5 w-5" />
            </Button>
          </AddPersonDialog>

          <Link href="/settings">
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </header>

      <main className="relative flex-1">
        {people.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-6 bg-background paper-texture px-6 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center gap-4"
            >
              <TreePine className="h-20 w-20 text-accent" />
              <h2 className="text-2xl font-semibold text-foreground">
                Ваше семейное древо еще не посажено
              </h2>
              <OrnamentDivider className="w-40" />
              <p className="max-w-sm text-muted-foreground">
                Добавьте первого родственника, чтобы начать собирать историю вашей семьи.
              </p>
              <AddPersonDialog>
                <Button className="mt-2 gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
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
