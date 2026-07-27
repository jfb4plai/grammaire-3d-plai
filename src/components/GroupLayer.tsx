import type { TokenData } from '../lib/types';
import { FONCTIONS } from '../lib/fonctions';
import { toPixels } from '../lib/coordinates';
import { estimateTokenWidth } from '../lib/layout';
import { computeGroupBBox } from '../lib/groups';

const TOKEN_HEIGHT = 90;
const TOKEN_HEIGHT_TBI = 130;

interface Props {
  tokens: TokenData[];
  containerSize: { x: number; y: number };
  tbiMode: boolean;
}

export function GroupLayer({ tokens, containerSize, tbiMode }: Props) {
  const groups = new Map<string, TokenData[]>();
  for (const t of tokens) {
    if (!t.groupId) continue;
    const list = groups.get(t.groupId) ?? [];
    list.push(t);
    groups.set(t.groupId, list);
  }

  return (
    <svg className="group-layer" width={containerSize.x} height={containerSize.y}>
      {Array.from(groups.entries()).map(([groupId, members]) => {
        const boxes = members.map((t) => {
          const p = toPixels({ x: t.normX, y: t.normY }, containerSize);
          return {
            x: p.x,
            y: p.y,
            width: estimateTokenWidth(t.mot, tbiMode),
            height: tbiMode ? TOKEN_HEIGHT_TBI : TOKEN_HEIGHT,
          };
        });
        const bbox = computeGroupBBox(boxes, 14);
        if (!bbox) return null;
        const fonction = members[0].fonctionId !== null ? FONCTIONS[members[0].fonctionId] : null;
        const color = fonction?.couleur ?? '#6366f1';
        return (
          <rect
            key={groupId}
            x={bbox.x}
            y={bbox.y}
            width={bbox.width}
            height={bbox.height}
            rx={16}
            fill={color}
            fillOpacity={0.08}
            stroke={color}
            strokeWidth={2}
            strokeDasharray="6 4"
          />
        );
      })}
    </svg>
  );
}
