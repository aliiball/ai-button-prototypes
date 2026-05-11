import { useId } from "react";
import { motion } from "framer-motion";
import { SharedDefs, filterIds } from "../shared/filters";
import type { MotifProps } from "../shared/types";

/**
 * Kuyruklu yıldız — diyagonal hareket + iz partikül kuyruğu.
 */
export function CometMotif({ palette, hovered }: MotifProps) {
  const id = useId().replace(/:/g, "");
  const F = filterIds(id);
  const headGrad = `cm-h-${id}`;
  const trail = [0.95, 0.7, 0.5, 0.35, 0.22, 0.13, 0.07];

  return (
    <svg viewBox="-30 -30 60 60" aria-hidden width="100%" height="100%">
      <SharedDefs suffix={id} />
      <defs>
        <radialGradient id={headGrad} cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor={palette.nucleusCore} />
          <stop offset="55%" stopColor={palette.electron} />
          <stop offset="100%" stopColor={palette.nucleusDeep} />
        </radialGradient>
      </defs>

      {/* arka plan halo */}
      <circle cx="0" cy="0" r="24" fill={palette.auraMid} opacity={0.1} filter={F.halo} />

      <motion.g
        animate={{ x: [-26, 26, -26], y: [22, -22, 22] }}
        transition={{
          duration: hovered ? 2.6 : 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {trail.map((op, i) => (
          <circle
            key={i}
            cx={-(i + 1) * 2.2}
            cy={(i + 1) * 1.8}
            r={3.4 - i * 0.4}
            fill={palette.electron}
            opacity={op * 0.6}
            filter={F.soft}
          />
        ))}
        <circle cx="0" cy="0" r="4.6" fill={`url(#${headGrad})`} filter={F.glow} />
        <circle cx="-1" cy="-1" r="1.4" fill={palette.nucleusCore} opacity={0.9} />
      </motion.g>
    </svg>
  );
}
