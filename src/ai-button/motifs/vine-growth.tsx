import { useId } from "react";
import { motion } from "framer-motion";
import { SharedDefs, filterIds } from "../shared/filters";
import type { MotifProps } from "../shared/types";

/**
 * Dal / vine büyümesi — alttan yukarı dallanan organik fractal.
 */
export function VineGrowthMotif({ palette, hovered }: MotifProps) {
  const id = useId().replace(/:/g, "");
  const F = filterIds(id);
  const leafGrad = `vg-${id}`;

  // ana sap + 4 dal + uçlarda yaprak
  return (
    <svg viewBox="-30 -30 60 60" aria-hidden width="100%" height="100%">
      <SharedDefs suffix={id} />
      <defs>
        <radialGradient id={leafGrad}>
          <stop offset="0%" stopColor={palette.nucleusCore} />
          <stop offset="60%" stopColor={palette.electron} />
          <stop offset="100%" stopColor={palette.nucleusDeep} />
        </radialGradient>
      </defs>

      {/* aura */}
      <ellipse cx="0" cy="0" rx="18" ry="22" fill={palette.auraMid} opacity={0.18} filter={F.halo} />

      {/* ana sap (dikey kıvrılan) */}
      <motion.path
        d="M0,20 C-3,12 3,4 -2,-4 C-5,-10 2,-16 0,-22"
        fill="none"
        stroke={palette.orbitMid}
        strokeWidth={1.6}
        strokeLinecap="round"
        filter={F.soft}
        animate={{ opacity: [0.85, 1, 0.85] }}
        transition={{ duration: 2.4, repeat: Infinity }}
      />
      <path
        d="M0,20 C-3,12 3,4 -2,-4 C-5,-10 2,-16 0,-22"
        fill="none"
        stroke={palette.orbitHighlight}
        strokeWidth={0.4}
        strokeLinecap="round"
      />

      {/* sol dal */}
      <motion.path
        d="M0,4 C-4,2 -8,0 -12,-2"
        fill="none"
        stroke={palette.orbitMid}
        strokeWidth={1.1}
        strokeLinecap="round"
        filter={F.soft}
        animate={{ pathLength: hovered ? [0.6, 1, 0.6] : [0.7, 1, 0.7] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* sağ dal */}
      <motion.path
        d="M-2,-4 C2,-6 6,-7 10,-6"
        fill="none"
        stroke={palette.orbitMid}
        strokeWidth={1.1}
        strokeLinecap="round"
        filter={F.soft}
        animate={{ pathLength: hovered ? [0.6, 1, 0.6] : [0.7, 1, 0.7] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
      />

      {/* küçük dal — sağ aşağı */}
      <motion.path
        d="M-3,14 C-1,16 3,18 6,18"
        fill="none"
        stroke={palette.orbitMid}
        strokeWidth={0.9}
        strokeLinecap="round"
        filter={F.soft}
        animate={{ pathLength: [0.6, 1, 0.6] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
      />

      {/* yaprak / berry uçlar */}
      {[
        { cx: -12, cy: -2, r: 2 },
        { cx: 10, cy: -6, r: 2.2 },
        { cx: 0, cy: -22, r: 2.6 },
        { cx: 6, cy: 18, r: 1.6 },
      ].map((leaf, i) => (
        <motion.circle
          key={i}
          cx={leaf.cx}
          cy={leaf.cy}
          r={leaf.r}
          fill={`url(#${leafGrad})`}
          stroke={palette.orbitHighlight}
          strokeWidth={0.3}
          filter={F.glow}
          animate={{
            scale: hovered ? [0.85, 1.2, 0.85] : [0.9, 1.08, 0.9],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 1.8 + i * 0.3,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut",
          }}
          style={{ transformOrigin: `${leaf.cx}px ${leaf.cy}px` }}
        />
      ))}
    </svg>
  );
}
