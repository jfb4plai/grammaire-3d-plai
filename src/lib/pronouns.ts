const PRONOUNS_BY_FONCTION: Record<number, string[]> = {
  0: ['il', 'elle', 'on'],
  1: ['il', 'elle', 'ils', 'elles', 'on'],
  2: [],
  3: ['le', 'la', "l'", 'les'],
  4: ['y', 'là', 'alors'],
  5: ['lui', 'leur', 'y', 'en'],
  6: ['le'],
};

export function pronounsForFonction(fonctionId: number | null): string[] {
  if (fonctionId === null) return [];
  return PRONOUNS_BY_FONCTION[fonctionId] ?? [];
}
