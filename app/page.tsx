"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { OrnamentDivider } from "@/components/ornament";
import { useFamilyStore } from "@/lib/store";
import { TreePine } from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const family = useFamilyStore((state) => state.family);
  const createFamily = useFamilyStore((state) => state.createFamily);

  useEffect(() => {
    if (family) {
      router.replace("/tree");
    }
  }, [family, router]);

  function handleCreate() {
    createFamily("Моя семья");
    router.push("/tree");
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background paper-texture px-6 text-center">
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="ornament"
              x="0"
              y="0"
              width="80"
              height="80"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="40" cy="40" r="1.5" fill="currentColor" className="text-accent/40" />
              <path
                d="M20 20h40v40H20z"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-accent/20"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#ornament)" />
        </svg>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 flex flex-col items-center gap-6"
      >
        <motion.div
          initial={{ scale: 0.8, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          <Logo size={120} />
        </motion.div>

        <h1 className="max-w-md text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Семейный архив
        </h1>
        <p className="max-w-sm text-lg text-muted-foreground">
          Цифровой музей памяти вашего рода. Сохраняйте истории, фотографии и связи поколений.
        </p>

        <OrnamentDivider className="w-40" />

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            size="lg"
            onClick={handleCreate}
            className="gap-2 bg-primary px-8 text-primary-foreground hover:bg-primary/90"
          >
            <TreePine className="h-5 w-5" />
            Создать семейное древо
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => router.push("/tree")}
            className="border-border px-8 hover:bg-secondary"
          >
            Войти в архив
          </Button>
        </div>
      </motion.div>
    </main>
  );
}
