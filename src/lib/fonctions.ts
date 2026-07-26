import type { Fonction } from './types';

export const FONCTIONS: Fonction[] = [
  {
    id: 0, nom: 'Sujet', couleur: '#3366CC', isGroupType: false,
    svgHtml: '<svg width="36" height="18" viewBox="0 0 36 18"><ellipse cx="18" cy="9" rx="17" ry="8" fill="#3366CC"/></svg>',
  },
  {
    id: 1, nom: 'Groupe sujet', couleur: '#3366CC', isGroupType: true,
    svgHtml: '<svg width="44" height="18" viewBox="0 0 44 18"><ellipse cx="22" cy="9" rx="17" ry="8" fill="#3366CC"/><ellipse cx="4" cy="9" rx="3.5" ry="5" fill="#3366CC" opacity="0.7"/><ellipse cx="40" cy="9" rx="3.5" ry="5" fill="#3366CC" opacity="0.7"/></svg>',
  },
  {
    id: 2, nom: 'Prédicat', couleur: '#CC3333', isGroupType: false,
    svgHtml: '<svg width="36" height="18" viewBox="0 0 36 18"><ellipse cx="18" cy="9" rx="17" ry="8" fill="#CC3333"/></svg>',
  },
  {
    id: 3, nom: 'Compl. direct', couleur: '#CC3333', isGroupType: false,
    svgHtml: '<svg width="36" height="18" viewBox="0 0 36 18"><ellipse cx="18" cy="9" rx="17" ry="8" fill="none" stroke="#CC3333" stroke-width="2"/></svg>',
  },
  {
    id: 4, nom: 'Compl. de phrase', couleur: '#33AA66', isGroupType: true,
    svgHtml: '<svg width="44" height="22" viewBox="0 0 44 22"><ellipse cx="22" cy="8" rx="16" ry="7" fill="#33AA66"/><rect x="8" y="15" width="28" height="4" rx="2" fill="#33AA66" opacity="0.7"/><circle cx="10" cy="20" r="3" fill="#33AA66"/><circle cx="34" cy="20" r="3" fill="#33AA66"/></svg>',
  },
  {
    id: 5, nom: 'Compl. indirect', couleur: '#9933CC', isGroupType: false,
    svgHtml: '<svg width="36" height="20" viewBox="0 0 36 20"><ellipse cx="18" cy="9" rx="17" ry="8" fill="none" stroke="#9933CC" stroke-width="2"/><line x1="3" y1="9" x2="33" y2="9" stroke="#9933CC" stroke-width="2"/></svg>',
  },
  {
    id: 6, nom: 'Attribut du sujet', couleur: '#CC7700', isGroupType: false,
    svgHtml: '<svg width="44" height="18" viewBox="0 0 44 18"><ellipse cx="22" cy="9" rx="17" ry="8" fill="none" stroke="#CC7700" stroke-width="2"/><line x1="2" y1="9" x2="10" y2="9" stroke="#CC7700" stroke-width="2"/><polygon points="2,6 2,12 7,9" fill="#CC7700"/><line x1="34" y1="9" x2="42" y2="9" stroke="#CC7700" stroke-width="2"/><polygon points="42,6 42,12 37,9" fill="#CC7700"/></svg>',
  },
];
