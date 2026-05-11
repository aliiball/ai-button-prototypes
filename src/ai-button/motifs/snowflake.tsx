import { useId } from "react";
import { motion } from "framer-motion";
import { SharedDefs, filterIds } from "../shared/filters";
import type { MotifProps } from "../shared/types";

/**
 * 6-katlı simetrik kar tanesi fractal. Rotasyon + nefes pulse.
 */
export function SnowflakeMotif({ palette, hovered }: MotifProps) {
  const id = useId().replace(/:/g, "");
  const F = filterIds(id);

  const arm = (
    <g>
      <line x1="0" y1="0" x2="0" y2="-22" stroke={palette.orbitMid} strokeWidth={1} strokeLinecap="round" />
      {/* yan dallar */}
      <line x1="0" y1="-10" x2="-4" y2="-14" stroke={palette.orbitMid} strokeWidth={0.7} strokeLinecap="round" />
      <line x1="0" y1="-10" x2="4" y2="-14" stroke={palette.orbitMid} strokeWidth={0.7} strokeLinecap="round" />
      <line x1="0" y1="-16" x2="-3" y2="-19" stroke={palette.orbitMid} strokeWidth={0.6} strokeLinecap="round" />
      <line x1="0" y1="-16" x2="3" y2="-19" stroke={palette.orbitMid} strokeWidth={0.6} strokeLinecap="round" />
      {/* uç sparkle */}
      <circle cx="0" cy="-22" r="1.4" fill={palette.boltBright} filter={F.glow} />
      {/* mid sparkle */}
      <circle cx="0" cy="-14" r="0.9" fill={palette.electron} />
    </g>
  );

  return (
    <svg viewBox="-30 -30 60 60" aria-hidden width="100%" height="100%">
      <SharedDefs suffix={id} />

      {/* aura */}
      <circle cx="0" cy="0" r="22" fill={palette.auraMid} opacity={0.18} filter={F.halo} />

      <motion.g
        animate={{ rotate: 360 }}
        transition={{ duration: hovered ? 12 : 32, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "center" }}
      >
        <motion.g
          animate={{ scale: hovered ? [0.9, 1.08, 0.9] : [0.95, 1.05, 0.95] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "center" }}
        >
          {[0, 60, 120, 180, 240, 300].map((deg) => (
            <g key={deg} transform={`rotate(${deg})`}>
              {arm}
            </g>
          ))}
          {/* merkez */}
          <circle cx="0" cy="0" r="2.4" fill={palette.nucleusCore} filter={F.glow} />
        </motion.g>
      </motion.g>
    </svg>
  );
}
