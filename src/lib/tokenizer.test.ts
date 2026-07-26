import { describe, it, expect } from 'vitest';
import { tokenizePhrase } from './tokenizer';

describe('tokenizePhrase', () => {
  it('splits a simple sentence into words and punctuation', () => {
    expect(tokenizePhrase('Le chat dort.')).toEqual(['Le', 'chat', 'dort', '.']);
  });

  it('keeps an elided determiner/pronoun as its own token with the apostrophe attached', () => {
    expect(tokenizePhrase("L'oiseau s'envole.")).toEqual(["L'", 'oiseau', "s'", 'envole', '.']);
  });

  it('keeps a hyphenated compound word as a single token', () => {
    expect(tokenizePhrase('Ma grand-mère arrive.')).toEqual(['Ma', 'grand-mère', 'arrive', '.']);
  });

  it('handles elision and compounds together', () => {
    expect(tokenizePhrase("L'oiseau de grand-mère s'envole.")).toEqual([
      "L'", 'oiseau', 'de', 'grand-mère', "s'", 'envole', '.',
    ]);
  });

  it('returns an empty array for blank input', () => {
    expect(tokenizePhrase('   ')).toEqual([]);
  });

  it('handles a curly apostrophe the same as a straight one', () => {
    expect(tokenizePhrase("L'oiseau vole.")).toEqual(["L'", 'oiseau', 'vole', '.']);
  });
});
