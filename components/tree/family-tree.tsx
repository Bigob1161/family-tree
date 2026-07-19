"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PersonCard } from "@/components/person-card";
import { useFamilyStore } from "@/lib/store";
import { Person } from "@/lib/types";
import { cn } from "@/lib/utils";
import { navigateToPerson } from "@/lib/navigate";
import { ConnectDialog } from "@/components/tree/connect-dialog";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, Maximize, Sparkles, Search } from "lucide-react";
import { toast } from "sonner";

const CARD_WIDTH = 144;
const CARD_HEIGHT = 160;
const GAP_X = 64;
const GAP_Y = 120;

interface TreeNode {
  person: Person;
  x: number;
  y: number;
  depth: number;
}

function buildTreeLayout(people: Person[]): TreeNode[] {
  if (people.length === 0) return [];

  const byId = new Map(people.map((p) => [p.id, p]));
  const childrenMap = new Map<string, Person[]>();

  for (const person of people) {
    if (person.parentId) {
      const list = childrenMap.get(person.parentId) || [];
      list.push(person);
      childrenMap.set(person.parentId, list);
    }
  }

  const roots = people.filter((p) => !p.parentId || !byId.has(p.parentId));
  const nodes: TreeNode[] = [];
  const visited = new Set<string>();

  function layoutSubtree(root: Person, startX: number, level: number): number {
    if (visited.has(root.id)) return startX;
    visited.add(root.id);

    const children = childrenMap.get(root.id) || [];
    let nextX = startX;

    if (children.length > 0) {
      for (const child of children) {
        nextX = layoutSubtree(child, nextX, level + 1);
      }
      const firstChild = children[0];
      const lastChild = children[children.length - 1];
      const first = nodes.find((n) => n.person.id === firstChild.id)!;
      const last = nodes.find((n) => n.person.id === lastChild.id)!;
      const x = (first.x + last.x) / 2;
      nodes.push({ person: root, x, y: level * GAP_Y, depth: level });
    } else {
      nodes.push({ person: root, x: startX, y: level * GAP_Y, depth: level });
      nextX += CARD_WIDTH + GAP_X;
    }

    return nextX;
  }

  let cursorX = 0;
  for (const root of roots) {
    cursorX = layoutSubtree(root, cursorX, 0);
  }

  for (const person of people) {
    if (!visited.has(person.id)) {
      nodes.push({ person, x: cursorX, y: 0, depth: 0 });
      cursorX += CARD_WIDTH + GAP_X;
    }
  }

  const minX = Math.min(...nodes.map((n) => n.x), 0);
  const maxX = Math.max(...nodes.map((n) => n.x + CARD_WIDTH));
  const width = maxX - minX;
  const offsetX = -minX - width / 2;

  return nodes.map((n) => ({ ...n, x: n.x + offsetX }));
}

export function FamilyTree({ className }: { className?: string }) {
  const people = useFamilyStore((state) => state.family?.people || []);
  const selectedId = useFamilyStore((state) => state.selectedPersonId);
  const setSelectedId = useFamilyStore((state) => state.setSelectedPersonId);
  const connectPeople = useFamilyStore((state) => state.connectPeople);

  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 80 });
  const [dragging, setDragging] = useState(false);
  const [lastMouse, setLastMouse] = useState({ x: 0, y: 0 });
  const [connectDialog, setConnectDialog] = useState<{
    sourceId: string;
    targetId: string;
  } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const nodes = useMemo(() => buildTreeLayout(people), [people]);

  useEffect(() => {
    centerTree();
  }, [people.length]);

  function centerTree() {
    if (!containerRef.current) return;
    const { clientWidth, clientHeight } = containerRef.current;
    setPan({ x: clientWidth / 2 - CARD_WIDTH / 2, y: clientHeight / 2 - CARD_HEIGHT / 2 });
    setScale(1);
  }

  function handleWheel(e: React.WheelEvent) {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setScale((s) => Math.min(Math.max(s * delta, 0.3), 2.5));
  }

  function handleMouseDown(e: React.MouseEvent) {
    if ((e.target as HTMLElement).closest("[data-person-card]")) return;
    setDragging(true);
    setLastMouse({ x: e.clientX, y: e.clientY });
  }

  function handleMouseMove(e: React.MouseEvent) {
    if (!dragging) return;
    const dx = e.clientX - lastMouse.x;
    const dy = e.clientY - lastMouse.y;
    setPan((p) => ({ x: p.x + dx, y: p.y + dy }));
    setLastMouse({ x: e.clientX, y: e.clientY });
  }

  function handleMouseUp() {
    setDragging(false);
  }

  function handleDrop(sourceId: string, targetId: string) {
    if (sourceId === targetId) return;
    setConnectDialog({ sourceId, targetId });
  }

  function highlightPath(id: string) {
    setSelectedId(id);
    toast("Выбран: " + people.find((p) => p.id === id)?.firstName);
  }

  const lines = useMemo(() => {
    const byId = new Map(nodes.map((n) => [n.person.id, n]));
    const result: {
      key: string;
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      selected: boolean;
    }[] = [];
    for (const node of nodes) {
      if (!node.person.parentId) continue;
      const parent = byId.get(node.person.parentId);
      if (!parent) continue;
      const selected =
        selectedId === node.person.id || selectedId === parent.person.id;
      result.push({
        key: `${parent.person.id}-${node.person.id}`,
        x1: parent.x + CARD_WIDTH / 2,
        y1: parent.y + CARD_HEIGHT,
        x2: node.x + CARD_WIDTH / 2,
        y2: node.y,
        selected,
      });
    }
    return result;
  }, [nodes, selectedId]);

  if (!mounted) return null;

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative h-full w-full cursor-grab overflow-hidden bg-background active:cursor-grabbing",
        className
      )}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="absolute right-4 bottom-4 z-10 flex flex-col gap-2">
        <Button variant="secondary" size="icon" className="neon-card border-0 text-primary hover:bg-primary/20" onClick={() => setScale((s) => Math.min(s * 1.2, 2.5))}>
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button variant="secondary" size="icon" className="neon-card border-0 text-primary hover:bg-primary/20" onClick={() => setScale((s) => Math.max(s / 1.2, 0.3))}>
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button variant="secondary" size="icon" className="neon-card border-0 text-primary hover:bg-primary/20" onClick={centerTree}>
          <Maximize className="h-4 w-4" />
        </Button>
      </div>

      <motion.div
        className="absolute inset-0 origin-top-left"
        animate={{ x: pan.x, y: pan.y, scale }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
          {lines.map((line) => (
            <path
              key={line.key}
              d={`M${line.x1},${line.y1} V${(line.y1 + line.y2) / 2} H${line.x2} V${line.y2}`}
              className={line.selected ? "tree-line-selected" : "tree-line"}
            />
          ))}
        </svg>

        {nodes.map((node) => (
          <div
            key={node.person.id}
            data-person-card
            style={{ left: node.x, top: node.y }}
          >
            <PersonCard
              person={node.person}
              isSelected={selectedId === node.person.id}
              onClick={() => {
                highlightPath(node.person.id);
                navigateToPerson(node.person.id);
              }}
              onDragStart={() => setSelectedId(node.person.id)}
              onDrop={() => {
                const sourceId = selectedId;
                if (sourceId) handleDrop(sourceId, node.person.id);
              }}
            />
          </div>
        ))}
      </motion.div>

      <AnimatePresence>
        {connectDialog && (
          <ConnectDialog
            sourceId={connectDialog.sourceId}
            targetId={connectDialog.targetId}
            onClose={() => setConnectDialog(null)}
            onConnect={(relationship) => {
              connectPeople(connectDialog.sourceId, connectDialog.targetId, relationship);
              setConnectDialog(null);
              toast.success("Связь добавлена");
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
