"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { OrnamentDivider } from "@/components/ornament";
import { CarpetBackground } from "@/components/carpet-background";
import { useFamilyStore } from "@/lib/store";
import { navigateTo } from "@/lib/navigate";
import { TreePine, Users } from "lucide-react";

export default function LandingPage() {
  const family = useFamilyStore((state) => state.family);
  const createFamily = useFamilyStore((state) => state.createFamily);

  useEffect(() => {
    if (family) {
      navigateTo("/tree");
    }
  }, [family]);

  function handleCreate() {
    createFamily("Моя семья");
    navigateTo("/tree");
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden carpet-texture px-6 text-center">
      <CarpetBackground />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background/60" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center gap-8"
      >
        <motion.div
          initial={{ scale: 0.6, rotate: -8 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 180, damping: 14, delay: 0.2 }}
          className="relative"
        >
          <div className="absolute inset-0 rounded-3xl bg-accent/20 blur-2xl" />
          <Logo size={140} className="relative" />
        </motion.div>

        <div className="space-y-3">
          <h1 className="max-w-lg text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
            Семейный архив
          </h1>
          <p className="mx-auto max-w-md text-lg text-muted-foreground">
            Цифровой музей памяти вашего рода. Сохраняйте истории, фотографии и связи поколений во восточном узоре.
          </p>
        </div>

        <OrnamentDivider className="w-48 text-accent" />

        <div className="flex flex-col gap-4 sm:flex-row">
          <Button
            size="lg"
            onClick={handleCreate}
            className="carpet-button h-12 gap-2 px-8 text-base font-semibold text-primary-foreground"
          >
            <TreePine className="h-5 w-5" />
            Создать семейное древо
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigateTo("/tree")}
            className="h-12 gap-2 border-2 border-accent/50 px-8 text-base font-semibold text-foreground hover:bg-accent/10 hover:text-accent"
          >
            <Users className="h-5 w-5" />
            Войти в архив
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-8 text-center text-sm text-muted-foreground">
          <div className="carpet-card rounded-xl p-4">
            <div className="text-2xl font-bold text-accent">∞</div>
            <div>Родственники</div>
          </div>
          <div className="carpet-card rounded-xl p-4">
            <div className="text-2xl font-bold text-primary">📸</div>
            <div>Фотогалерея</div>
          </div>
          <div className="carpet-card rounded-xl p-4">
            <div className="text-2xl font-bold text-secondary">📅</div>
            <div>Хронология</div>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
