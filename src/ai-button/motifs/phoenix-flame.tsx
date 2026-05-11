import { useId } from "react";
import { motion } from "framer-motion";
import { SharedDefs, filterIds } from "../shared/filters";
import type { MotifProps } from "../shared/types";

/**
 * Phoenix alev — yukarı süzülen tüy-vari alev şekilleri + parçacık spark'ları.
 */
export function PhoenixFlameMotif({ palette, hovered }: MotifProps) {
  const id = useId().replace(/:/g, "");
  const F = filterIds(id);
  const flameGrad = `pf-${id}`;
  const innerGrad = `pf-i-${id}`;

  // alev konturu — alttan yukarı doğru sivrilen, kıvrımlı path
  const flameOuter = "M0,16 C-9,12 -10,-2 -4,-10 C-1,-6 -2,-2 -1,-1 C-3,-7 0,-15 0,-22 C4,-14 2,-6 4,-3 C4,-7 3,-13 5,-10 C9,-2 9,12 0,16 Z";
  const flameInner = "M0,12 C-5,8 -6,-2 -2,-8 C0,-4 -1,-1 0,1 C-1,-4 1,-12 1,-16 C3,-10 1,-4 2,-2 C3,-7 4,-8 4,-6 C6,-1 6,9 0,12 Z";

  return (
    <svg viewBox="-30 -30 60 60" aria-hidden width="100%" height="100%">
      <SharedDefs suffix={id} />
      <defs>
        <linearGradient id={flameGrad} x1="50%" y1="100%" x2="50%" y2="0%">
          <stop offset="0%" stopColor={palette.nucleusDeep} />
          <stop offset="40%" stopColor={palette.boltMid} />
          <stop offset="80%" stopColor={palette.electron} />
          <stop offset="100%" stopColor={palette.nucleusCore} />
        </linearGradient>
        <linearGradient id={innerGrad} x1="50%" y1="100%" x2="50%" y2="0%">
          <stop offset="0%" stopColor={palette.boltMid} />
          <stop offset="100%" stopColor={palette.nucleusCore} />
        </linearGradient>
      </defs>

      {/* outer aura */}
      <motion.ellipse
        cx="0"
        cy="-2"
        rx="14"
        ry="20"
        fill={palette.auraMid}
        opacity={0.2}
        filter={F.halo}
        animate={{ scale: hovered ? [1, 1.1, 0.95, 1] : [1, 1.04, 0.98, 1] }}
        transition={{ duration: hovered ? 1.4 : 2.4, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "0 -2px" }}
      />

      {/* outer flame */}
      <motion.path
        d={flameOuter}
        fill={`url(#${flameGrad})`}
        stroke={palette.orbitHighlight}
        strokeWidth={0.3}
        filter={F.glow}
        animate={{
          scaleX: hovered ? [1, 1.08, 0.94, 1.05, 1] : [1, 1.04, 0.97, 1.02, 1],
          scaleY: hovered ? [1, 0.96, 1.05, 0.97, 1] : [1, 0.98, 1.02, 0.99, 1],
        }}
        transition={{ duration: hovered ? 0.9 : 1.8, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "0 16px" }}
      />

      {/* inner flame */}
      <motion.path
        d={flameInner}
        fill={`url(#${innerGrad})`}
        opacity={0.85}
        filter={F.soft}
        animate={{
          scaleX: hovered ? [1, 0.92, 1.08, 1] : [1, 0.96, 1.04, 1],
          scaleY: hovered ? [1, 1.06, 0.95, 1] : [1, 1.03, 0.98, 1],
        }}
        transition={{ duration: hovered ? 0.7 : 1.4, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "0 12px" }}
      />

      {/* uçan spark'lar */}
      {[
        { x: -8, delay: 0 },
        { x: 7, delay: 0.4 },
        { x: -3, delay: 0.8 },
        { x: 9, delay: 1.2 },
      ].map((s, i) => (
        <motion.circle
          key={i}
          cx={s.x}
          cy="-18"
          r="1.1"
          fill={palette.boltBright}
          filter={F.glow}
          animate={{
            cy: [-12, -26, -12],
            opacity: [0, 1, 0],
            cx: [s.x, s.x + (i % 2 ? 3 : -3), s.x],
          }}
          transition={{
            duration: hovered ? 1.2 : 2.4,
            repeat: Infinity,
            delay: s.delay,
            ease: "easeOut",
          }}
        />
      ))}
    </svg>
  );
}
