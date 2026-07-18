import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Family, Person, Photo, RelationshipType } from "@/lib/types";

interface FamilyState {
  family: Family | null;
  selectedPersonId: string | null;
  darkMode: boolean;
  searchQuery: string;
  setFamily: (family: Family) => void;
  createFamily: (name: string) => void;
  addPerson: (person: Omit<Person, "id">) => void;
  updatePerson: (person: Person) => void;
  deletePerson: (id: string) => void;
  connectPeople: (sourceId: string, targetId: string, relationship: RelationshipType) => void;
  addPhoto: (photo: Omit<Photo, "id">) => void;
  deletePhoto: (id: string) => void;
  setSelectedPersonId: (id: string | null) => void;
  toggleDarkMode: () => void;
  setSearchQuery: (query: string) => void;
}

function generateId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

function cleanPhotoUrls(people: Person[], photos: Photo[]) {
  const personIds = new Set(people.map((p) => p.id));
  return photos.filter((ph) => personIds.has(ph.personId));
}

export const useFamilyStore = create<FamilyState>()(
  persist(
    (set, get) => ({
      family: null,
      selectedPersonId: null,
      darkMode: false,
      searchQuery: "",

      setFamily: (family) => set({ family }),

      createFamily: (name) =>
        set({
          family: {
            id: generateId(),
            name,
            createdAt: Date.now(),
            people: [],
            photos: [],
          },
        }),

      addPerson: (person) =>
        set((state) => {
          if (!state.family) return state;
          const newPerson: Person = { ...person, id: generateId() };
          return {
            family: {
              ...state.family,
              people: [...state.family.people, newPerson],
            },
          };
        }),

      updatePerson: (person) =>
        set((state) => {
          if (!state.family) return state;
          return {
            family: {
              ...state.family,
              people: state.family.people.map((p) =>
                p.id === person.id ? person : p
              ),
            },
          };
        }),

      deletePerson: (id) =>
        set((state) => {
          if (!state.family) return state;
          const remaining = state.family.people.filter((p) => p.id !== id);
          const photos = state.family.photos.filter((ph) => ph.personId !== id);
          const cleaned = cleanPhotoUrls(remaining, photos);
          const updated = remaining.map((p) =>
            p.parentId === id ? { ...p, parentId: undefined } : p
          );
          return {
            family: { ...state.family, people: updated, photos: cleaned },
            selectedPersonId:
              state.selectedPersonId === id ? null : state.selectedPersonId,
          };
        }),

      connectPeople: (sourceId, targetId, relationship) =>
        set((state) => {
          if (!state.family) return state;
          return {
            family: {
              ...state.family,
              people: state.family.people.map((p) =>
                p.id === sourceId
                  ? { ...p, parentId: targetId, relationshipType: relationship }
                  : p
              ),
            },
          };
        }),

      addPhoto: (photo) =>
        set((state) => {
          if (!state.family) return state;
          const newPhoto: Photo = { ...photo, id: generateId() };
          return {
            family: { ...state.family, photos: [...state.family.photos, newPhoto] },
          };
        }),

      deletePhoto: (id) =>
        set((state) => {
          if (!state.family) return state;
          return {
            family: {
              ...state.family,
              photos: state.family.photos.filter((p) => p.id !== id),
            },
          };
        }),

      setSelectedPersonId: (id) => set({ selectedPersonId: id }),

      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),

      setSearchQuery: (query) => set({ searchQuery: query }),
    }),
    {
      name: "familytree-storage",
    }
  )
);
