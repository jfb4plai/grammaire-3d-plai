import { describe, it, expect } from 'vitest';
import { pronounsForFonction } from './pronouns';

describe('pronounsForFonction', () => {
  it('returns subject pronouns for Sujet (0) and Groupe sujet (1)', () => {
    expect(pronounsForFonction(0)).toEqual(['il', 'elle', 'on']);
    expect(pronounsForFonction(1)).toEqual(['il', 'elle', 'ils', 'elles', 'on']);
  });

  it('returns direct-object pronouns for Compl. direct (3)', () => {
    expect(pronounsForFonction(3)).toEqual(['le', 'la', "l'", 'les']);
  });

  it('returns indirect-object pronouns for Compl. indirect (5)', () => {
    expect(pronounsForFonction(5)).toEqual(['lui', 'leur', 'y', 'en']);
  });

  it('returns an empty list for Prédicat (2) — the verb group is not substituted by a pronoun', () => {
    expect(pronounsForFonction(2)).toEqual([]);
  });

  it('returns an empty list when no fonction is assigned', () => {
    expect(pronounsForFonction(null)).toEqual([]);
  });
});
