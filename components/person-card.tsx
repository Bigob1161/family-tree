"use client";

import { PersonAvatar } from "@/components/person-avatar";
import { Card } from "@/components/ui/card";
import { calculateAge, cn } from "@/lib/utils";
import { Person } from "@/lib/types";
import { RELATIONSHIP_LABELS } from "@/lib/types";
import { AnimatedTooltip } from "@/components/animated-tooltip";

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

  function handleDragStart(e: React.DragEvent<HTMLDivElement>) {
    e.dataTransfer.setData("personId", person.id);
    e.dataTransfer.effectAllowed = "link";
    onDragStart?.();
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "link";
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    onDrop?.();
  }

  const tooltipContent = (
    <div className="text-center">
      <p className="font-semibold text-primary drop-shadow-[0_0_6px_rgba(0,243,255,0.5)]">{person.firstName} {person.lastName}</p>
      <p className="text-xs text-muted-foreground">
        {age !== null ? `${age} лет` : RELATIONSHIP_LABELS[person.relationshipType]}
      </p>
      {person.birthDate && (
        <p className="text-xs text-muted-foreground">{person.birthDate}</p>
      )}
    </div>
  );

  return (
    <AnimatedTooltip content={tooltipContent}>
      <div
        draggable
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={(e) => {
          e.stopPropagation();
          onClick?.();
        }}
        style={style}
        className={cn(
          "group absolute cursor-grab select-none transition-all duration-200 ease-out active:cursor-grabbing hover:z-10 hover:scale-105 hover:-translate-y-1.5",
          className
        )}
      >
        <Card
          className={cn(
            "neon-card flex w-36 flex-col items-center gap-2 bg-card/95 p-3 backdrop-blur-sm transition-all",
            isSelected && "border-primary shadow-[0_0_20px_rgba(0,243,255,0.35)]"
          )}
        >
          <PersonAvatar src={person.photoUrl} name={`${person.firstName} ${person.lastName}`} size="md" />
          <div className="text-center">
            <p className="truncate text-sm font-bold text-card-foreground">
              {person.firstName}
            </p>
            <p className="truncate text-xs text-muted-foreground">{person.lastName}</p>
            <p className="mt-1 text-xs font-medium text-primary drop-shadow-[0_0_6px_rgba(0,243,255,0.4)]">
              {age !== null ? `${age} лет` : RELATIONSHIP_LABELS[person.relationshipType]}
            </p>
          </div>
        </Card>
      </div>
    </AnimatedTooltip>
  );
}
