import { useId } from "react";
import { motion } from "framer-motion";
import { SharedDefs, filterIds } from "../shared/filters";
import type { MotifProps } from "../shared/types";

/**
 * AI Core — koyu dış küre + içinde parlayan reaktör çekirdek + iç içe halka.
 */
export function AiCoreMotif({ palette, hovered }: MotifProps) {
  const id = useId().replace(/:/g, "");
  const F = filterIds(id);
  const shellGrad = `ac-s-${id}`;
  const coreGrad = `ac-c-${id}`;

  return (
    <svg viewBox="-30 -30 60 60" aria-hidden width="100%" height="100%">
      <SharedDefs suffix={id} />
      <defs>
        <radialGradient id={shellGrad} cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor={palette.nucleusDeep} stopOpacity={0.5} />
          <stop offset="70%" stopColor={palette.auraOuter} stopOpacity={0.95} />
          <stop offset="100%" stopColor={palette.auraOuter} stopOpacity={1} />
        </radialGradient>
        <radialGradient id={coreGrad}>
          <stop offset="0%" stopColor={palette.nucleusCore} />
          <stop offset="40%" stopColor={palette.boltBright} />
          <stop offset="100%" stopColor={palette.electron} stopOpacity={0} />
        </radialGradient>
      </defs>

      {/* aura */}
      <motion.circle
        cx="0"
        cy="0"
        r="22"
        fill={palette.auraMid}
        opacity={0.18}
        filter={F.halo}
        animate={{ scale: hovered ? [1, 1.12, 1] : [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "center" }}
      />

      {/* koyu dış kabuk */}
      <circle
        cx="0"
        cy="0"
        r="18"
        fill={`url(#${shellGrad})`}
        stroke={palette.orbitMid}
        strokeWidth={0.6}
        strokeOpacity={0.6}
      />

      {/* iç halka */}
      <motion.circle
        cx="0"
        cy="0"
        r="13"
        fill="none"
        stroke={palette.orbitHighlight}
        strokeWidth={0.5}
        strokeDasharray="2 1.2"
        opacity={0.7}
        animate={{ rotate: 360 }}
        transition={{ duration: hovered ? 5 : 12, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "center" }}
      />

      {/* ikinci halka — ters yön */}
      <motion.circle
        cx="0"
        cy="0"
        r="9"
        fill="none"
        stroke={palette.electron}
        strokeWidth={0.5}
        strokeDasharray="1.4 1"
        opacity={0.6}
        animate={{ rotate: -360 }}
        transition={{ duration: hovered ? 3.5 : 9, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "center" }}
      />

      {/* glow halo for core */}
      <motion.circle
        cx="0"
        cy="0"
        r="9"
        fill={`url(#${coreGrad})`}
        animate={{ scale: hovered ? [1, 1.4, 1] : [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: hovered ? 1 : 1.8, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "center" }}
      />

      {/* hot inner core */}
      <motion.circle
        cx="0"
        cy="0"
        r="3"
        fill={palette.nucleusCore}
        filter={F.glow}
        animate={{ scale: [0.85, 1.15, 0.85] }}
        transition={{ duration: hovered ? 0.7 : 1.4, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "center" }}
      />
    </svg>
  );
}
