import { useId } from "react";
import { motion } from "framer-motion";
import { SharedDefs, filterIds } from "../shared/filters";
import type { MotifProps } from "../shared/types";

/**
 * Konsantrik döndürülmüş ellipse'ler = tünel/portal perspektifi.
 * Farklı hızlarla rotasyon = parallax.
 */
export function VortexMotif({ palette, hovered }: MotifProps) {
  const id = useId().replace(/:/g, "");
  const F = filterIds(id);
  const centerGrad = `vx-c-${id}`;

  const rings = [
    { rx: 22, ry: 10, rot: 0, dur: 14, stroke: palette.auraMid, sw: 0.6, op: 0.4 },
    { rx: 18, ry: 9, rot: 30, dur: 11, stroke: palette.orbitMid, sw: 0.7, op: 0.55 },
    { rx: 14, ry: 7, rot: 60, dur: 8, stroke: palette.boltMid, sw: 0.8, op: 0.7 },
    { rx: 10, ry: 5, rot: 90, dur: 6, stroke: palette.electron, sw: 0.9, op: 0.85 },
    { rx: 6, ry: 3, rot: 120, dur: 4, stroke: palette.boltBright, sw: 1.1, op: 1 },
  ];

  return (
    <svg viewBox="-30 -30 60 60" aria-hidden width="100%" height="100%">
      <SharedDefs suffix={id} />
      <defs>
        <radialGradient id={centerGrad} cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor={palette.boltDeep} />
          <stop offset="60%" stopColor={palette.nucleusDeep} />
          <stop offset="100%" stopColor={palette.auraOuter} stopOpacity={0} />
        </radialGradient>
      </defs>

      {/* outer aura halo */}
      <circle
        cx="0"
        cy="0"
        r="24"
        fill={palette.auraMid}
        opacity={0.15}
        filter={F.halo}
      />

      {rings.map((r, i) => (
        <motion.g
          key={i}
          animate={{ rotate: 360 }}
          transition={{
            duration: hovered ? r.dur / 2.5 : r.dur,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{ transformOrigin: "center" }}
        >
          <ellipse
            cx="0"
            cy="0"
            rx={r.rx}
            ry={r.ry}
            transform={`rotate(${r.rot})`}
            fill="none"
            stroke={r.stroke}
            strokeWidth={r.sw}
            opacity={r.op}
            filter={i >= 3 ? F.glow : F.soft}
          />
        </motion.g>
      ))}

      {/* center hole — koyu çekirdek */}
      <motion.circle
        cx="0"
        cy="0"
        r="3.5"
        fill={`url(#${centerGrad})`}
        animate={{ scale: hovered ? [1, 1.3, 1] : [1, 1.1, 1] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "center" }}
      />
      <circle
        cx="0"
        cy="0"
        r="1.4"
        fill={palette.nucleusCore}
        filter={F.glow}
      />
    </svg>
  );
}
