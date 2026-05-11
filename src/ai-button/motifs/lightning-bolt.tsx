import { useId } from "react";
import { motion } from "framer-motion";
import { SharedDefs, filterIds } from "../shared/filters";
import type { MotifProps } from "../shared/types";

/**
 * Tek dikey zikzak yıldırım. 3-katman stroke + periyodik flash.
 */
export function LightningBoltMotif({ palette, hovered }: MotifProps) {
  const id = useId().replace(/:/g, "");
  const F = filterIds(id);

  // Klasik zikzak yıldırım path
  const bolt = "M-2,-22 L4,-8 L-3,-4 L6,8 L-2,12 L3,22";
  const fork1 = "M4,-8 L9,-2";
  const fork2 = "M-3,-4 L-8,3";

  return (
    <svg viewBox="-30 -30 60 60" aria-hidden width="100%" height="100%">
      <SharedDefs suffix={id} />

      {/* aura */}
      <motion.circle
        cx="0"
        cy="0"
        r="20"
        fill={palette.auraMid}
        opacity={0.18}
        filter={F.halo}
        animate={{ opacity: hovered ? [0.15, 0.4, 0.15] : [0.12, 0.25, 0.12] }}
        transition={{ duration: hovered ? 0.5 : 1.4, repeat: Infinity }}
      />

      {[
        { stroke: palette.boltDeep, sw: 6, op: 0.55, filter: F.halo },
        { stroke: palette.boltMid, sw: 2.8, op: 0.9, filter: F.soft },
        { stroke: palette.boltBright, sw: 1, op: 1 },
      ].map((s, i) => (
        <motion.g
          key={i}
          animate={{ opacity: hovered ? [s.op, s.op * 0.4, s.op] : [s.op, s.op * 0.6, s.op] }}
          transition={{ duration: hovered ? 0.4 : 1.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <path
            d={bolt}
            fill="none"
            stroke={s.stroke}
            strokeWidth={s.sw}
            strokeLinecap="round"
            strokeLinejoin="round"
            filter={s.filter}
          />
          <path
            d={fork1}
            fill="none"
            stroke={s.stroke}
            strokeWidth={s.sw * 0.7}
            strokeLinecap="round"
            filter={s.filter}
          />
          <path
            d={fork2}
            fill="none"
            stroke={s.stroke}
            strokeWidth={s.sw * 0.7}
            strokeLinecap="round"
            filter={s.filter}
          />
        </motion.g>
      ))}
    </svg>
  );
}
