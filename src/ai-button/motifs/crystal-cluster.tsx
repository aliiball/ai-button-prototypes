import { useId } from "react";
import { motion } from "framer-motion";
import { SharedDefs, filterIds } from "../shared/filters";
import type { MotifProps } from "../shared/types";

/**
 * Çoklu elmas/kristal parçalarının kümesi. Her birinin kendi gradient'i + ind. pulse.
 */
export function CrystalClusterMotif({ palette, hovered }: MotifProps) {
  const id = useId().replace(/:/g, "");
  const F = filterIds(id);
  const g1 = `cc-1-${id}`;
  const g2 = `cc-2-${id}`;
  const g3 = `cc-3-${id}`;

  // diamond facet path (top, right, bottom, left → asymmetric)
  const diamond = (s: number) => `M0,${-s} L${s * 0.7},0 L0,${s} L${-s * 0.7},0 Z`;

  return (
    <svg viewBox="-30 -30 60 60" aria-hidden width="100%" height="100%">
      <SharedDefs suffix={id} />
      <defs>
        <linearGradient id={g1} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={palette.nucleusCore} />
          <stop offset="100%" stopColor={palette.boltMid} />
        </linearGradient>
        <linearGradient id={g2} x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={palette.electron} />
          <stop offset="100%" stopColor={palette.nucleusDeep} />
        </linearGradient>
        <linearGradient id={g3} x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor={palette.orbitHighlight} />
          <stop offset="100%" stopColor={palette.orbitMid} />
        </linearGradient>
      </defs>

      {/* halo */}
      <circle cx="0" cy="0" r="22" fill={palette.auraMid} opacity={0.18} filter={F.halo} />

      {/* arka büyük kristal */}
      <motion.g
        transform="translate(2, 4) rotate(8)"
        animate={{ scale: hovered ? [1, 1.05, 1] : [1, 1.02, 1] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "center" }}
      >
        <path d={diamond(16)} fill={`url(#${g1})`} stroke={palette.orbitHighlight} strokeWidth={0.4} filter={F.glow} />
        <line x1="0" y1="-16" x2="0" y2="16" stroke={palette.orbitHighlight} strokeWidth={0.3} opacity={0.6} />
      </motion.g>

      {/* sol-üst orta */}
      <motion.g
        transform="translate(-11, -10) rotate(-15)"
        animate={{ scale: hovered ? [0.95, 1.12, 0.95] : [0.97, 1.05, 0.97] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
        style={{ transformOrigin: "center" }}
      >
        <path d={diamond(10)} fill={`url(#${g2})`} stroke={palette.orbitHighlight} strokeWidth={0.4} filter={F.glow} />
      </motion.g>

      {/* sağ-üst küçük */}
      <motion.g
        transform="translate(11, -11) rotate(20)"
        animate={{ scale: hovered ? [0.9, 1.15, 0.9] : [0.95, 1.05, 0.95] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
        style={{ transformOrigin: "center" }}
      >
        <path d={diamond(7.5)} fill={`url(#${g3})`} stroke={palette.orbitHighlight} strokeWidth={0.4} filter={F.glow} />
      </motion.g>

      {/* alt sol minik */}
      <motion.g
        transform="translate(-13, 9) rotate(35)"
        animate={{ scale: [0.9, 1.2, 0.9] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 0.9 }}
        style={{ transformOrigin: "center" }}
      >
        <path d={diamond(5)} fill={palette.electron} stroke={palette.orbitHighlight} strokeWidth={0.3} filter={F.soft} />
      </motion.g>

      {/* sparkle */}
      <motion.circle
        cx="6"
        cy="-2"
        r="1.4"
        fill={palette.nucleusCore}
        filter={F.glow}
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.6, repeat: Infinity }}
      />
    </svg>
  );
}
