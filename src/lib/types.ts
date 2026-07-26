export interface Pictogram {
  id: number;
  url: string;
  keywords: string[];
}

export interface Fonction {
  id: number;
  nom: string;
  couleur: string;
  svgHtml: string;
  isGroupType: boolean;
}

export interface Nature {
  id: number;
  nom: string;
  svgHtml: string;
}

export interface TokenData {
  id: string;
  mot: string;
  originalMot: string | null;
  normX: number;
  normY: number;
  fonctionId: number | null;
  natureId: number | null;
  groupId: string | null;
  pictoOptions: Pictogram[];
  selectedPictoIdx: number;
  customImg: string | null;
  effaced: boolean;
}

export interface TeacherOptions {
  arasaac: boolean;
  word: boolean;
  symbol: boolean;
  manip: boolean;
  customImg: boolean;
  tbiMode: boolean;
}

export interface SceneData {
  tokens: TokenData[];
  options: TeacherOptions;
}

export interface SceneRecord {
  id: string;
  titre: string;
  data: SceneData;
  updatedAt: string;
}

export const DEFAULT_OPTIONS: TeacherOptions = {
  arasaac: false,
  word: true,
  symbol: true,
  manip: true,
  customImg: true,
  tbiMode: false,
};
