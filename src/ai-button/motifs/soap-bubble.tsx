import { useId } from "react";
import { motion } from "framer-motion";
import { SharedDefs, filterIds } from "../shared/filters";
import type { MotifProps } from "../shared/types";

/**
 * Tek iridescent sabun köpüğü — offset radialGradient + crescent sheen.
 * Apple Intelligence ikonu hissi.
 */
export function SoapBubbleMotif({ palette, hovered }: MotifProps) {
  const id = useId().replace(/:/g, "");
  const F = filterIds(id);
  const bubbleGrad = `sb-${id}`;
  const sheenGrad = `sb-sheen-${id}`;

  return (
    <svg viewBox="-30 -30 60 60" aria-hidden width="100%" height="100%">
      <SharedDefs suffix={id} />
      <defs>
        <radialGradient id={bubbleGrad} cx="32%" cy="28%" r="78%">
          <stop offset="0%" stopColor={palette.nucleusCore} stopOpacity={0.95} />
          <stop offset="22%" stopColor={palette.electron} stopOpacity={0.85} />
          <stop offset="48%" stopColor={palette.boltMid} stopOpacity={0.75} />
          <stop offset="72%" stopColor={palette.nucleusMid} stopOpacity={0.8} />
          <stop offset="100%" stopColor={palette.nucleusDeep} stopOpacity={0.95} />
        </radialGradient>
        <radialGradient id={sheenGrad} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={palette.nucleusCore} stopOpacity={0.95} />
          <stop offset="100%" stopColor={palette.nucleusCore} stopOpacity={0} />
        </radialGradient>
      </defs>

      {/* outer halo */}
      <motion.circle
        cx="0"
        cy="0"
        r="22"
        fill={palette.auraMid}
        opacity={0.2}
        filter={F.halo}
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "center" }}
      />

      {/* bubble core */}
      <motion.g
        animate={{ rotate: hovered ? [0, 8, -8, 0] : [0, 4, -4, 0] }}
        transition={{
          duration: hovered ? 3.2 : 6.4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ transformOrigin: "center" }}
      >
        <motion.circle
          cx="0"
          cy="0"
          r="19"
          fill={`url(#${bubbleGrad})`}
          stroke={palette.orbitHighlight}
          strokeWidth={0.5}
          strokeOpacity={0.4}
          filter={F.glow}
          animate={{ scale: hovered ? [1, 1.03, 1] : [1, 1.01, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "center" }}
        />
      </motion.g>

      {/* iridescent rim — ince halka */}
      <circle
        cx="0"
        cy="0"
        r="19"
        fill="none"
        stroke={palette.boltBright}
        strokeWidth={0.5}
        opacity={0.55}
      />

      {/* primary sheen — crescent top-left */}
      <motion.ellipse
        cx="-7"
        cy="-9"
        rx="6"
        ry="3.4"
        transform="rotate(-30 -7 -9)"
        fill={`url(#${sheenGrad})`}
        animate={{
          cx: [-7, -8, -7],
          opacity: [0.85, 1, 0.85],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* secondary sheen dot */}
      <motion.circle
        cx="5"
        cy="-11"
        r="1.6"
        fill={palette.nucleusCore}
        opacity={0.8}
        filter={F.soft}
        animate={{ opacity: [0.5, 0.95, 0.5] }}
        transition={{ duration: 1.8, repeat: Infinity, delay: 0.4 }}
      />
    </svg>
  );
}
