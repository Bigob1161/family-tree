"use client";

import { motion } from "framer-motion";
import { PersonAvatar } from "@/components/person-avatar";
import { Card } from "@/components/ui/card";
import { calculateAge, cn } from "@/lib/utils";
import { Person } from "@/lib/types";
import { RELATIONSHIP_LABELS } from "@/lib/types";

interface PersonCardProps {
  person: Person;
  isSelected?: boolean;
  onClick?: () => void;
  onDragStart?: () => void;
  onDrop?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export function PersonCard({
  person,
  isSelected,
  onClick,
  onDragStart,
  onDrop,
  className,
  style,
}: PersonCardProps) {
  const age = calculateAge(person.birthDate);

  function handleDragStart(e: React.DragEvent) {
    e.dataTransfer.setData("personId", person.id);
    onDragStart?.();
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    onDrop?.();
  }

  return (
    <motion.div
      layoutId={person.id}
      draggable={false}
      onClick={onClick}
      whileHover={{ scale: 1.03, y: -4 }}
      whileTap={{ scale: 0.98 }}
      style={style}
      className={cn(
        "absolute cursor-grab active:cursor-grabbing",
        className
      )}
    >
      <Card
        className={cn(
          "flex w-36 flex-col items-center gap-2 border border-border bg-card p-3 shadow-md transition-shadow",
          isSelected && "ring-2 ring-primary shadow-xl"
        )}
      >
        <PersonAvatar src={person.photoUrl} name={`${person.firstName} ${person.lastName}`} size="md" />
        <div className="text-center">
          <p className="truncate text-sm font-semibold text-card-foreground">
            {person.firstName}
          </p>
          <p className="truncate text-xs text-muted-foreground">{person.lastName}</p>
          <p className="mt-1 text-xs text-accent font-medium">
            {age !== null ? `${age} лет` : RELATIONSHIP_LABELS[person.relationshipType]}
          </p>
        </div>
      </Card>
    </motion.div>
  );
}
