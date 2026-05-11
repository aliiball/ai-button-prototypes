import { useId } from "react";
import { motion } from "framer-motion";
import { SharedDefs, filterIds } from "../shared/filters";
import type { MotifProps } from "../shared/types";

/**
 * 8 sabit yıldız + 7 bağlantı çizgisi (asimetrik yıldız haritası).
 * Edge'ler sırayla çizilir, yıldızlar twinkle yapar.
 */
export function ConstellationMotif({ palette, hovered }: MotifProps) {
  const id = useId().replace(/:/g, "");
  const F = filterIds(id);

  // Big-Dipper-vari asimetrik dizilim
  const stars: Array<{ x: number; y: number; r: number; bright: boolean }> = [
    { x: -18, y: -12, r: 2.0, bright: true },
    { x: -9, y: -16, r: 1.4, bright: false },
    { x: -2, y: -8, r: 2.2, bright: true },
    { x: 8, y: -12, r: 1.6, bright: false },
    { x: 14, y: -2, r: 2.4, bright: true },
    { x: 6, y: 8, r: 1.8, bright: false },
    { x: -6, y: 14, r: 2.0, bright: true },
    { x: -16, y: 6, r: 1.4, bright: false },
  ];

  const edges: Array<[number, number]> = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],
    [4, 5],
    [5, 6],
    [6, 7],
  ];

  const star = (s: number) =>
    `M0,${-s} C${s * 0.2},${-s * 0.2} ${s * 0.2},${-s * 0.2} ${s},0 C${s * 0.2},${s * 0.2} ${s * 0.2},${s * 0.2} 0,${s} C${-s * 0.2},${s * 0.2} ${-s * 0.2},${s * 0.2} ${-s},0 C${-s * 0.2},${-s * 0.2} ${-s * 0.2},${-s * 0.2} 0,${-s} Z`;

  return (
    <svg viewBox="-30 -30 60 60" aria-hidden width="100%" height="100%">
      <SharedDefs suffix={id} />

      {/* edges */}
      {edges.map(([a, b], i) => {
        const sa = stars[a];
        const sb = stars[b];
        return (
          <motion.line
            key={i}
            x1={sa.x}
            y1={sa.y}
            x2={sb.x}
            y2={sb.y}
            stroke={palette.orbitMid}
            strokeWidth={hovered ? 0.9 : 0.6}
            strokeLinecap="round"
            opacity={0.55}
            animate={{
              opacity: hovered ? [0.3, 0.95, 0.3] : [0.2, 0.7, 0.2],
            }}
            transition={{
              duration: hovered ? 1.6 : 2.6,
              repeat: Infinity,
              delay: i * 0.18,
              ease: "easeInOut",
            }}
            filter={F.soft}
          />
        );
      })}

      {/* halo glow line backing */}
      {edges.map(([a, b], i) => {
        const sa = stars[a];
        const sb = stars[b];
        return (
          <line
            key={`h-${i}`}
            x1={sa.x}
            y1={sa.y}
            x2={sb.x}
            y2={sb.y}
            stroke={palette.auraMid}
            strokeWidth={2.4}
            opacity={0.18}
            filter={F.halo}
          />
        );
      })}

      {/* stars */}
      {stars.map((s, i) => (
        <motion.g
          key={i}
          transform={`translate(${s.x}, ${s.y})`}
          animate={{
            scale: hovered ? [0.85, 1.25, 0.85] : [0.9, 1.1, 0.9],
            opacity: [0.55, 1, 0.55],
          }}
          transition={{
            duration: 1.6 + (i % 3) * 0.4,
            repeat: Infinity,
            delay: i * 0.22,
            ease: "easeInOut",
          }}
          style={{ transformOrigin: `${s.x}px ${s.y}px` }}
        >
          <path
            d={star(s.r)}
            fill={s.bright ? palette.nucleusCore : palette.electron}
            filter={F.glow}
          />
        </motion.g>
      ))}
    </svg>
  );
}
