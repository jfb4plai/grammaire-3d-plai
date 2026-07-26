const TOKEN_RE = /[\p{L}\p{M}]+['’]|[\p{L}\p{M}]+(?:-[\p{L}\p{M}]+)*|[^\s]/gu;

export function tokenizePhrase(phrase: string): string[] {
  const trimmed = phrase.trim();
  if (!trimmed) return [];
  return trimmed.match(TOKEN_RE) ?? [];
}
