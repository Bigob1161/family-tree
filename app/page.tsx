"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { OrnamentDivider } from "@/components/ornament";
import { NeonBackground } from "@/components/neon-background";
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
      <NeonBackground />

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
          <div className="absolute inset-0 rounded-3xl bg-primary/30 blur-3xl animate-pulse" />
          <div className="neon-glow rounded-3xl">
            <Logo size={140} className="relative" />
          </div>
        </motion.div>

        <div className="space-y-3">
          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="neon-text max-w-lg text-4xl font-black tracking-tight sm:text-6xl"
          >
            Семейный архив
          </motion.h1>
          <p className="mx-auto max-w-md text-lg text-muted-foreground">
            Цифровой музей памяти вашего рода. Сохраняйте истории, фотографии и связи поколений в неоновом свете.
          </p>
        </div>

        <OrnamentDivider className="w-48 text-primary" />

        <div className="flex flex-col gap-4 sm:flex-row">
          <Button
            size="lg"
            onClick={handleCreate}
            className="neon-button h-12 gap-2 px-8 text-base font-semibold"
          >
            <TreePine className="h-5 w-5" />
            Создать семейное древо
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigateTo("/tree")}
            className="neon-button h-12 gap-2 bg-background/40 px-8 text-base font-semibold"
          >
            <Users className="h-5 w-5" />
            Войти в архив
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-8 text-center text-sm text-muted-foreground">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="neon-card rounded-xl p-4"
          >
            <div className="text-2xl font-bold text-primary drop-shadow-[0_0_8px_rgba(0,243,255,0.6)]">∞</div>
            <div>Родственники</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="neon-card rounded-xl p-4"
          >
            <div className="text-2xl font-bold text-accent drop-shadow-[0_0_8px_rgba(176,38,255,0.6)]">📸</div>
            <div>Фотогалерея</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="neon-card rounded-xl p-4"
          >
            <div className="text-2xl font-bold text-primary drop-shadow-[0_0_8px_rgba(0,243,255,0.6)]">📅</div>
            <div>Хронология</div>
          </motion.div>
        </div>
      </motion.div>
    </main>
  );
}
