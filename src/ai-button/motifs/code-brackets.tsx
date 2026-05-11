import { useId } from "react";
import { motion } from "framer-motion";
import { SharedDefs, filterIds } from "../shared/filters";
import type { MotifProps } from "../shared/types";

/**
 * Kod parantezleri { } + ortada akıp yanan içerik noktaları.
 */
export function CodeBracketsMotif({ palette, hovered }: MotifProps) {
  const id = useId().replace(/:/g, "");
  const F = filterIds(id);

  // { şekli — sol parantez
  const leftBrace =
    "M-4,-18 C-8,-18 -10,-14 -10,-10 L-10,-4 C-10,-1 -12,0 -14,0 C-12,0 -10,1 -10,4 L-10,10 C-10,14 -8,18 -4,18";
  // } şekli — sağ parantez (mirror)
  const rightBrace =
    "M4,-18 C8,-18 10,-14 10,-10 L10,-4 C10,-1 12,0 14,0 C12,0 10,1 10,4 L10,10 C10,14 8,18 4,18";

  return (
    <svg viewBox="-30 -30 60 60" aria-hidden width="100%" height="100%">
      <SharedDefs suffix={id} />

      {/* aura */}
      <circle cx="0" cy="0" r="22" fill={palette.auraMid} opacity={0.15} filter={F.halo} />

      <motion.path
        d={leftBrace}
        fill="none"
        stroke={palette.orbitMid}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={F.glow}
        animate={{ x: hovered ? [-2, 0, -2] : [0, -1, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.path
        d={rightBrace}
        fill="none"
        stroke={palette.orbitMid}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={F.glow}
        animate={{ x: hovered ? [2, 0, 2] : [0, 1, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* highlight stripes on braces */}
      <path
        d={leftBrace}
        fill="none"
        stroke={palette.orbitHighlight}
        strokeWidth={0.5}
        strokeLinecap="round"
      />
      <path
        d={rightBrace}
        fill="none"
        stroke={palette.orbitHighlight}
        strokeWidth={0.5}
        strokeLinecap="round"
      />

      {/* iç içerik — 3 typing dot */}
      {[-5, 0, 5].map((cx, i) => (
        <motion.circle
          key={cx}
          cx={cx}
          cy="0"
          r="1.6"
          fill={palette.electron}
          filter={F.glow}
          animate={{
            opacity: [0.3, 1, 0.3],
            scale: [0.7, 1.15, 0.7],
          }}
          transition={{
            duration: hovered ? 0.7 : 1.4,
            repeat: Infinity,
            delay: i * (hovered ? 0.18 : 0.32),
            ease: "easeInOut",
          }}
          style={{ transformOrigin: `${cx}px 0` }}
        />
      ))}
    </svg>
  );
}
