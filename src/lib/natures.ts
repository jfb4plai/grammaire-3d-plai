import type { Nature } from './types';

export const NATURES: Nature[] = [
  { id: 0, nom: 'Nom', svgHtml: '<svg width="24" height="24" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" fill="#222"/></svg>' },
  { id: 1, nom: 'Déterminant', svgHtml: '<svg width="24" height="24" viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" fill="#222"/></svg>' },
  { id: 2, nom: 'Adjectif', svgHtml: '<svg width="24" height="24" viewBox="0 0 24 24"><polygon points="12,2 22,22 2,22" fill="#222"/></svg>' },
  { id: 3, nom: 'Verbe', svgHtml: '<svg width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#222"/></svg>' },
  { id: 4, nom: 'Pronom', svgHtml: '<svg width="24" height="24" viewBox="0 0 24 24"><rect x="2" y="8" width="20" height="8" fill="#222"/></svg>' },
  { id: 5, nom: 'Préposition', svgHtml: '<svg width="24" height="24" viewBox="0 0 24 24"><polygon points="12,2 22,12 12,22 2,12" fill="#222"/></svg>' },
  { id: 6, nom: 'Adverbe', svgHtml: '<svg width="24" height="24" viewBox="0 0 24 24"><path d="M2,14 A10,10 0 0,1 22,14 Z" fill="#222"/></svg>' },
  { id: 7, nom: 'Conjonction', svgHtml: '<svg width="24" height="24" viewBox="0 0 24 24"><text x="4" y="20" font-size="20" font-weight="bold" fill="#222">+</text></svg>' },
];
