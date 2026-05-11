import { useId } from "react";
import { motion } from "framer-motion";
import { SharedDefs, filterIds } from "../shared/filters";
import type { MotifProps } from "../shared/types";

/**
 * Iridescent vinyl/CD diski — konsantrik oluklar + rainbow refleksiyon.
 */
export function VinylDiskMotif({ palette, hovered }: MotifProps) {
  const id = useId().replace(/:/g, "");
  const F = filterIds(id);
  const bodyGrad = `vd-${id}`;
  const sheenGrad = `vd-sh-${id}`;

  const grooves = [18, 16, 14, 12, 10, 8];

  return (
    <svg viewBox="-30 -30 60 60" aria-hidden width="100%" height="100%">
      <SharedDefs suffix={id} />
      <defs>
        <radialGradient id={bodyGrad} cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor={palette.boltDeep} />
          <stop offset="80%" stopColor={palette.nucleusDeep} />
          <stop offset="100%" stopColor={palette.auraOuter} />
        </radialGradient>
        <linearGradient id={sheenGrad} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={palette.boltMid} stopOpacity={0} />
          <stop offset="40%" stopColor={palette.electron} stopOpacity={0.6} />
          <stop offset="55%" stopColor={palette.nucleusCore} stopOpacity={0.85} />
          <stop offset="70%" stopColor={palette.boltMid} stopOpacity={0.6} />
          <stop offset="100%" stopColor={palette.nucleusMid} stopOpacity={0} />
        </linearGradient>
      </defs>

      {/* aura */}
      <circle cx="0" cy="0" r="22" fill={palette.auraMid} opacity={0.2} filter={F.halo} />

      <motion.g
        animate={{ rotate: 360 }}
        transition={{ duration: hovered ? 3 : 9, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "center" }}
      >
        {/* disk gövdesi */}
        <circle cx="0" cy="0" r="20" fill={`url(#${bodyGrad})`} stroke={palette.orbitHighlight} strokeWidth={0.5} strokeOpacity={0.5} />

        {/* iridescent diagonal sheen */}
        <circle cx="0" cy="0" r="20" fill={`url(#${sheenGrad})`} opacity={0.7} />

        {/* groove rings */}
        {grooves.map((r, i) => (
          <circle
            key={i}
            cx="0"
            cy="0"
            r={r}
            fill="none"
            stroke={palette.orbitDeep}
            strokeWidth={0.3}
            opacity={0.4}
          />
        ))}

        {/* etiket merkezi */}
        <circle cx="0" cy="0" r="6" fill={palette.electron} opacity={0.9} />
        <circle cx="0" cy="0" r="6" fill="none" stroke={palette.orbitHighlight} strokeWidth={0.3} />

        {/* merkez delik */}
        <circle cx="0" cy="0" r="1.4" fill={palette.auraOuter} />

        {/* sparkle highlight */}
        <circle cx="-8" cy="-10" r="2" fill={palette.nucleusCore} opacity={0.7} filter={F.soft} />
      </motion.g>
    </svg>
  );
}
