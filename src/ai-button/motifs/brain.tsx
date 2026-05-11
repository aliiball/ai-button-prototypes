import { useId } from "react";
import { motion } from "framer-motion";
import { SharedDefs, filterIds } from "../shared/filters";
import type { MotifProps } from "../shared/types";

/**
 * Anatomik beyin silueti — iki yarımküre + kıvrım çizgileri.
 * Sinapsler ritmik atar.
 */
export function BrainMotif({ palette, hovered }: MotifProps) {
  const id = useId().replace(/:/g, "");
  const F = filterIds(id);
  const grad = `br-${id}`;

  // Yarımküre paths
  const leftHemi =
    "M-2,-16 C-8,-18 -16,-14 -17,-6 C-19,0 -19,6 -14,12 C-9,17 -3,14 -2,10 Z";
  const rightHemi =
    "M2,-16 C8,-18 16,-14 17,-6 C19,0 19,6 14,12 C9,17 3,14 2,10 Z";

  // İç kıvrımlar (gyri)
  const folds = [
    "M-12,-12 Q-9,-8 -12,-4",
    "M-10,-2 Q-7,2 -10,6",
    "M12,-12 Q9,-8 12,-4",
    "M10,-2 Q7,2 10,6",
    "M-6,-8 Q-3,-4 -6,0",
    "M6,-8 Q3,-4 6,0",
  ];

  return (
    <svg viewBox="-30 -30 60 60" aria-hidden width="100%" height="100%">
      <SharedDefs suffix={id} />
      <defs>
        <radialGradient id={grad} cx="50%" cy="40%" r="80%">
          <stop offset="0%" stopColor={palette.nucleusMid} />
          <stop offset="100%" stopColor={palette.nucleusDeep} />
        </radialGradient>
      </defs>

      {/* nefes alan halo */}
      <motion.ellipse
        cx="0"
        cy="-2"
        rx="22"
        ry="20"
        fill={palette.auraMid}
        opacity={0.2}
        filter={F.halo}
        animate={{ scale: [1, 1.08, 1], opacity: [0.15, 0.35, 0.15] }}
        transition={{ duration: 2.4, repeat: Infinity }}
        style={{ transformOrigin: "center" }}
      />

      {/* beyin gövdesi */}
      <g filter={F.depth}>
        <path
          d={leftHemi}
          fill={`url(#${grad})`}
          stroke={palette.orbitHighlight}
          strokeWidth={0.6}
        />
        <path
          d={rightHemi}
          fill={`url(#${grad})`}
          stroke={palette.orbitHighlight}
          strokeWidth={0.6}
        />
        {/* orta çizgi */}
        <line
          x1="0"
          y1="-14"
          x2="0"
          y2="12"
          stroke={palette.nucleusDeep}
          strokeWidth={0.6}
          opacity={0.7}
        />
        {/* kıvrımlar */}
        {folds.map((d, i) => (
          <path
            key={i}
            d={d}
            fill="none"
            stroke={palette.orbitHighlight}
            strokeWidth={0.5}
            opacity={0.85}
          />
        ))}
      </g>

      {/* sinaps parıltıları */}
      {[
        { x: -10, y: -8 },
        { x: 10, y: -8 },
        { x: -8, y: 2 },
        { x: 8, y: 2 },
        { x: 0, y: -4 },
        { x: -12, y: 6 },
        { x: 12, y: 6 },
      ].map((p, i) => (
        <motion.circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={1.2}
          fill={palette.electron}
          filter={F.glow}
          animate={{
            opacity: hovered ? [0.6, 1, 0.6] : [0.3, 1, 0.3],
            scale: [0.6, 1.4, 0.6],
          }}
          transition={{
            duration: hovered ? 1.1 : 1.8,
            repeat: Infinity,
            delay: i * 0.2,
          }}
          style={{ transformOrigin: `${p.x}px ${p.y}px` }}
        />
      ))}
    </svg>
  );
}
