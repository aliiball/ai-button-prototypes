import { useId } from "react";
import { motion } from "framer-motion";
import { SharedDefs, filterIds } from "../shared/filters";
import type { MotifProps } from "../shared/types";

/**
 * Dönen elmas + faceted gradient + parlama (highlight stripe).
 */
export function PrismMotif({ palette, hovered }: MotifProps) {
  const id = useId().replace(/:/g, "");
  const F = filterIds(id);
  const lg1 = `pr1-${id}`;
  const lg2 = `pr2-${id}`;
  const lg3 = `pr3-${id}`;

  // 4 yüzlü stilize elmas
  return (
    <svg viewBox="-30 -30 60 60" aria-hidden width="100%" height="100%">
      <SharedDefs suffix={id} />
      <defs>
        <linearGradient id={lg1} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={palette.nucleusCore} />
          <stop offset="100%" stopColor={palette.nucleusMid} />
        </linearGradient>
        <linearGradient id={lg2} x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={palette.nucleusMid} />
          <stop offset="100%" stopColor={palette.nucleusDeep} />
        </linearGradient>
        <linearGradient id={lg3} x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={palette.orbitMid} />
          <stop offset="100%" stopColor={palette.nucleusCore} />
        </linearGradient>
      </defs>

      <motion.g
        animate={{ rotate: 360 }}
        transition={{
          duration: hovered ? 6 : 12,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{ transformOrigin: "center" }}
        filter={F.depth}
      >
        {/* sol yüz */}
        <polygon
          points="0,-19 -18,0 0,4 0,-19"
          fill={`url(#${lg1})`}
          stroke={palette.orbitHighlight}
          strokeWidth={0.4}
        />
        {/* sağ yüz */}
        <polygon
          points="0,-19 18,0 0,4 0,-19"
          fill={`url(#${lg2})`}
          stroke={palette.orbitHighlight}
          strokeWidth={0.4}
        />
        {/* alt sol */}
        <polygon
          points="-18,0 0,4 0,20 -18,0"
          fill={`url(#${lg3})`}
          stroke={palette.orbitHighlight}
          strokeWidth={0.4}
          opacity={0.85}
        />
        {/* alt sağ */}
        <polygon
          points="18,0 0,4 0,20 18,0"
          fill={`url(#${lg2})`}
          stroke={palette.orbitHighlight}
          strokeWidth={0.4}
          opacity={0.7}
        />

        {/* parlak vurgu */}
        <motion.polygon
          points="0,-19 -4,0 0,4 0,-19"
          fill={palette.nucleusCore}
          opacity={0.5}
          filter={F.soft}
          animate={{ opacity: [0.2, 0.7, 0.2] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.g>

      <motion.circle
        cx="0"
        cy="0"
        r="22"
        fill="none"
        stroke={palette.auraMid}
        strokeWidth={0.6}
        opacity={0.3}
        filter={F.halo}
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 2.8, repeat: Infinity }}
        style={{ transformOrigin: "center" }}
      />
    </svg>
  );
}
