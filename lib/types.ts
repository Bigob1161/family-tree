export type Gender = "male" | "female" | "other";

export type RelationshipType =
  | "father"
  | "mother"
  | "son"
  | "daughter"
  | "grandfather"
  | "grandmother"
  | "grandson"
  | "granddaughter"
  | "husband"
  | "wife"
  | "brother"
  | "sister"
  | "other";

export interface Person {
  id: string;
  firstName: string;
  lastName: string;
  birthDate?: string; // DD.MM.YYYY
  gender: Gender;
  photoUrl?: string;
  parentId?: string;
  relationshipType: RelationshipType;
  notes?: string;
}

export interface Photo {
  id: string;
  personId: string;
  url: string;
  caption?: string;
  createdAt: number;
}

export interface Family {
  id: string;
  name: string;
  createdAt: number;
  people: Person[];
  photos: Photo[];
}

export interface FamilyEvent {
  id: string;
  personId: string;
  title: string;
  date: string; // DD.MM.YYYY
  type: "birth" | "wedding" | "death" | "other";
  description?: string;
}

export const RELATIONSHIP_LABELS: Record<RelationshipType, string> = {
  father: "Отец",
  mother: "Мать",
  son: "Сын",
  daughter: "Дочь",
  grandfather: "Дед",
  grandmother: "Бабушка",
  grandson: "Внук",
  granddaughter: "Внучка",
  husband: "Муж",
  wife: "Жена",
  brother: "Брат",
  sister: "Сестра",
  other: "Другой",
};

export const GENDER_LABELS: Record<Gender, string> = {
  male: "Мужской",
  female: "Женский",
  other: "Другой",
};

export function relationshipFromConnection(
  sourceGender: Gender,
  targetGender: Gender,
  relation: "parent" | "child" | "spouse" | "sibling"
): RelationshipType {
  if (relation === "parent") {
    return targetGender === "female" ? "mother" : "father";
  }
  if (relation === "child") {
    return sourceGender === "female" ? "daughter" : "son";
  }
  if (relation === "spouse") {
    return sourceGender === "female" ? "wife" : "husband";
  }
  return sourceGender === "female" ? "sister" : "brother";
}
