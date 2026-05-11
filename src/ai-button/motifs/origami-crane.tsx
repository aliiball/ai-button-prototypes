import { useId } from "react";
import { motion } from "framer-motion";
import { SharedDefs, filterIds } from "../shared/filters";
import type { MotifProps } from "../shared/types";

/**
 * Origami turnası — stilize kağıt katlamalar + kanat çırpma.
 */
export function OrigamiCraneMotif({ palette, hovered }: MotifProps) {
  const id = useId().replace(/:/g, "");
  const F = filterIds(id);
  const paperA = `oc-a-${id}`;
  const paperB = `oc-b-${id}`;

  return (
    <svg viewBox="-30 -30 60 60" aria-hidden width="100%" height="100%">
      <SharedDefs suffix={id} />
      <defs>
        <linearGradient id={paperA} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={palette.nucleusCore} />
          <stop offset="100%" stopColor={palette.nucleusMid} />
        </linearGradient>
        <linearGradient id={paperB} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={palette.nucleusMid} />
          <stop offset="100%" stopColor={palette.nucleusDeep} />
        </linearGradient>
      </defs>

      {/* aura */}
      <circle cx="0" cy="0" r="22" fill={palette.auraMid} opacity={0.16} filter={F.halo} />

      {/* gövde */}
      <polygon
        points="-6,4 6,4 0,12"
        fill={`url(#${paperB})`}
        stroke={palette.orbitHighlight}
        strokeWidth={0.3}
      />

      {/* boyun + baş */}
      <polygon
        points="-2,-2 2,-2 6,-12 4,-13 0,-9 -1,-3"
        fill={`url(#${paperA})`}
        stroke={palette.orbitHighlight}
        strokeWidth={0.3}
      />
      {/* gaga */}
      <polygon points="6,-12 10,-14 6,-11" fill={palette.boltBright} />

      {/* sol kanat (flap) */}
      <motion.polygon
        points="-2,2 -18,-10 -16,-2 -8,4"
        fill={`url(#${paperA})`}
        stroke={palette.orbitHighlight}
        strokeWidth={0.3}
        filter={F.soft}
        animate={{ rotate: hovered ? [-15, 8, -15] : [-5, 0, -5] }}
        transition={{
          duration: hovered ? 0.7 : 1.6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ transformOrigin: "-2px 2px" }}
      />

      {/* sağ kanat (flap) */}
      <motion.polygon
        points="2,2 18,-10 16,-2 8,4"
        fill={`url(#${paperB})`}
        stroke={palette.orbitHighlight}
        strokeWidth={0.3}
        filter={F.soft}
        animate={{ rotate: hovered ? [15, -8, 15] : [5, 0, 5] }}
        transition={{
          duration: hovered ? 0.7 : 1.6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ transformOrigin: "2px 2px" }}
      />

      {/* kuyruk */}
      <polygon
        points="0,4 -3,16 -1,14 1,14 3,16"
        fill={`url(#${paperB})`}
        stroke={palette.orbitHighlight}
        strokeWidth={0.3}
      />

      {/* iç katlama çizgileri */}
      <line x1="0" y1="4" x2="0" y2="12" stroke={palette.orbitHighlight} strokeWidth={0.4} opacity={0.6} />
      <line x1="-2" y1="-2" x2="6" y2="-12" stroke={palette.orbitHighlight} strokeWidth={0.4} opacity={0.6} />

      {/* gözü */}
      <circle cx="5" cy="-11" r="0.7" fill={palette.nucleusDeep} />
    </svg>
  );
}
