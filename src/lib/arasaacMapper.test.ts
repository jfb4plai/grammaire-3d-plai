import { describe, it, expect } from 'vitest';
import { mapArasaacResponse } from './arasaacMapper';

describe('mapArasaacResponse', () => {
  it('maps a well-formed response', () => {
    const input = {
      pictograms: [
        { id: 2179, url: 'https://static.arasaac.org/pictograms/2179/2179_500.png', keywords: [{ keyword: 'chat' }] },
      ],
    };
    expect(mapArasaacResponse(input)).toEqual([
      { id: 2179, url: 'https://static.arasaac.org/pictograms/2179/2179_500.png', keywords: ['chat'] },
    ]);
  });

  it('drops entries missing id or url', () => {
    const input = { pictograms: [{ id: 0, url: '', keywords: [] }] };
    expect(mapArasaacResponse(input)).toEqual([]);
  });

  it('returns an empty array when the shape is unexpected', () => {
    expect(mapArasaacResponse(null)).toEqual([]);
    expect(mapArasaacResponse({})).toEqual([]);
    expect(mapArasaacResponse({ pictograms: 'nope' })).toEqual([]);
  });

  it('handles plain-string keywords as well as keyword objects', () => {
    const input = { pictograms: [{ id: 1, url: 'u', keywords: ['chat', { keyword: 'félin' }] }] };
    expect(mapArasaacResponse(input)).toEqual([{ id: 1, url: 'u', keywords: ['chat', 'félin'] }]);
  });
});
