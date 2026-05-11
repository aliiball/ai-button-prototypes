import { useId } from "react";
import { motion } from "framer-motion";
import { SharedDefs, filterIds } from "../shared/filters";
import type { MotifProps } from "../shared/types";

/**
 * Holografik kart — 3D flip + iridescent yüzey parıltısı.
 */
export function HolographicCardMotif({ palette, hovered }: MotifProps) {
  const id = useId().replace(/:/g, "");
  const F = filterIds(id);
  const front = `hc-f-${id}`;
  const back = `hc-b-${id}`;

  return (
    <svg viewBox="-30 -30 60 60" aria-hidden width="100%" height="100%">
      <SharedDefs suffix={id} />
      <defs>
        <linearGradient id={front} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={palette.boltMid} />
          <stop offset="30%" stopColor={palette.electron} />
          <stop offset="60%" stopColor={palette.nucleusMid} />
          <stop offset="100%" stopColor={palette.auraMid} />
        </linearGradient>
        <linearGradient id={back} x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={palette.nucleusDeep} />
          <stop offset="100%" stopColor={palette.orbitDeep} />
        </linearGradient>
      </defs>

      {/* aura */}
      <circle cx="0" cy="0" r="22" fill={palette.auraMid} opacity={0.18} filter={F.halo} />

      <motion.g
        animate={{ scaleX: hovered ? [1, 0.1, -1, -0.1, 1] : [1, 0.4, 1] }}
        transition={{
          duration: hovered ? 2.6 : 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ transformOrigin: "center" }}
      >
        {/* kart gövdesi */}
        <rect
          x="-14"
          y="-18"
          width="28"
          height="36"
          rx="4"
          fill={`url(#${front})`}
          stroke={palette.orbitHighlight}
          strokeWidth={0.5}
          filter={F.glow}
        />

        {/* satır işaretleri (kart yüzü desenler) */}
        <rect x="-10" y="-12" width="20" height="2" rx="1" fill={palette.orbitHighlight} opacity={0.55} />
        <rect x="-10" y="-7" width="14" height="1.5" rx="0.7" fill={palette.orbitHighlight} opacity={0.45} />
        <rect x="-10" y="-3" width="17" height="1.5" rx="0.7" fill={palette.orbitHighlight} opacity={0.45} />

        {/* alt çip */}
        <rect x="-9" y="6" width="9" height="7" rx="1.2" fill={`url(#${back})`} stroke={palette.orbitHighlight} strokeWidth={0.3} />
        <line x1="-9" y1="9.5" x2="0" y2="9.5" stroke={palette.boltBright} strokeWidth={0.4} opacity={0.7} />

        {/* sağ alt parlak nokta */}
        <circle cx="9" cy="11" r="1.4" fill={palette.nucleusCore} filter={F.glow} />
      </motion.g>

      {/* tarayan ışık çizgisi */}
      <motion.rect
        x="-14"
        y="-18"
        width="3"
        height="36"
        fill={palette.nucleusCore}
        opacity={0.45}
        animate={{ x: [-14, 11, -14] }}
        transition={{ duration: hovered ? 1.6 : 3.2, repeat: Infinity, ease: "easeInOut" }}
      />
    </svg>
  );
}
