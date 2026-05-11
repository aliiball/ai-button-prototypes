import { useId } from "react";
import { motion } from "framer-motion";
import { SharedDefs, filterIds } from "../shared/filters";
import type { MotifProps } from "../shared/types";

/**
 * 7 düğüm + 9 bağlantı. Bağlantılar sırayla ışır (synaptic firing).
 */
const NODES: Array<{ x: number; y: number }> = [
  { x: 0, y: -18 },
  { x: -16, y: -8 },
  { x: 16, y: -8 },
  { x: -18, y: 10 },
  { x: 18, y: 10 },
  { x: 0, y: 18 },
  { x: 0, y: 0 }, // merkez
];

const EDGES: Array<[number, number]> = [
  [0, 1],
  [0, 2],
  [1, 3],
  [2, 4],
  [3, 5],
  [4, 5],
  [6, 0],
  [6, 3],
  [6, 4],
];

export function NeuralWebMotif({ palette, hovered }: MotifProps) {
  const id = useId().replace(/:/g, "");
  const F = filterIds(id);
  const edgeDur = 2.4;

  return (
    <svg viewBox="-30 -30 60 60" aria-hidden width="100%" height="100%">
      <SharedDefs suffix={id} />

      <g filter={F.depth}>
        {EDGES.map(([a, b], i) => {
          const na = NODES[a];
          const nb = NODES[b];
          return (
            <motion.line
              key={i}
              x1={na.x}
              y1={na.y}
              x2={nb.x}
              y2={nb.y}
              stroke={palette.orbitMid}
              strokeWidth={hovered ? 1.4 : 1}
              strokeLinecap="round"
              animate={{
                opacity: [0.2, 0.9, 0.2],
                strokeWidth: [0.8, 1.6, 0.8],
              }}
              transition={{
                duration: edgeDur,
                repeat: Infinity,
                delay: (i * edgeDur) / EDGES.length,
                ease: "easeInOut",
              }}
            />
          );
        })}

        {NODES.map((n, i) => (
          <g key={i}>
            <motion.circle
              cx={n.x}
              cy={n.y}
              r={2.8}
              fill={palette.orbitDeep}
              opacity={0.5}
              filter={F.halo}
              animate={{ scale: [1, 1.4, 1] }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                delay: i * 0.18,
              }}
              style={{ transformOrigin: `${n.x}px ${n.y}px` }}
            />
            <circle
              cx={n.x}
              cy={n.y}
              r={i === 6 ? 3 : 2}
              fill={i === 6 ? palette.nucleusCore : palette.electron}
              filter={F.glow}
            />
          </g>
        ))}
      </g>
    </svg>
  );
}
