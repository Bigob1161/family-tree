"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RELATIONSHIP_LABELS, RelationshipType } from "@/lib/types";

interface ConnectDialogProps {
  sourceId: string;
  targetId: string;
  onClose: () => void;
  onConnect: (relationship: RelationshipType) => void;
}

const options: RelationshipType[] = [
  "father",
  "mother",
  "son",
  "daughter",
  "grandfather",
  "grandmother",
  "grandson",
  "granddaughter",
  "husband",
  "wife",
  "brother",
  "sister",
  "other",
];

export function ConnectDialog({ onClose, onConnect }: ConnectDialogProps) {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-primary">Какая связь между ними?</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-2 py-4">
          {options.map((rel) => (
            <Button
              key={rel}
              variant="outline"
              className="justify-start border-border hover:bg-secondary hover:text-secondary-foreground"
              onClick={() => onConnect(rel)}
            >
              {RELATIONSHIP_LABELS[rel]}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
