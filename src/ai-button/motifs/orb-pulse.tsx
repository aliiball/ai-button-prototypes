import { useId } from "react";
import { motion } from "framer-motion";
import { SharedDefs, filterIds } from "../shared/filters";
import type { MotifProps } from "../shared/types";

/**
 * Solid enerji küresi + 3 eş merkezli genleşip kaybolan halka.
 */
export function OrbPulseMotif({ palette, hovered }: MotifProps) {
  const id = useId().replace(/:/g, "");
  const F = filterIds(id);
  const orbGrad = `orb-${id}`;
  const rings = [0, 1, 2];

  return (
    <svg viewBox="-30 -30 60 60" aria-hidden width="100%" height="100%">
      <SharedDefs suffix={id} />
      <defs>
        <radialGradient id={orbGrad} cx="38%" cy="32%" r="80%">
          <stop offset="0%" stopColor={palette.nucleusCore} />
          <stop offset="50%" stopColor={palette.nucleusMid} />
          <stop offset="100%" stopColor={palette.nucleusDeep} />
        </radialGradient>
      </defs>

      {rings.map((i) => (
        <motion.circle
          key={i}
          cx="0"
          cy="0"
          r={9}
          fill="none"
          stroke={palette.orbitMid}
          strokeWidth={1.2}
          animate={{
            r: [9, 22, 26],
            opacity: [0.6, 0.15, 0],
            strokeWidth: [1.6, 0.8, 0.3],
          }}
          transition={{
            duration: hovered ? 1.8 : 2.6,
            repeat: Infinity,
            delay: i * (hovered ? 0.5 : 0.8),
            ease: "easeOut",
          }}
          filter={F.soft}
        />
      ))}

      <motion.circle
        cx="0"
        cy="0"
        r="11"
        fill={palette.auraMid}
        opacity={0.25}
        filter={F.halo}
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "center" }}
      />
      <motion.circle
        cx="0"
        cy="0"
        r="8"
        fill={`url(#${orbGrad})`}
        filter={F.glow}
        animate={{ scale: [1, 1.04, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "center" }}
      />
      <circle
        cx="-2.4"
        cy="-3"
        r="2.2"
        fill={palette.nucleusCore}
        opacity={0.85}
        filter={F.soft}
      />
    </svg>
  );
}
