import { useId } from "react";
import { motion } from "framer-motion";
import { SharedDefs, filterIds } from "../shared/filters";
import type { MotifProps } from "../shared/types";

/**
 * Geodesik küre — 3D wireframe küresel ağ. Lat-long + diagonal great circles.
 */
export function GeodesicSphereMotif({ palette, hovered }: MotifProps) {
  const id = useId().replace(/:/g, "");
  const F = filterIds(id);

  return (
    <svg viewBox="-30 -30 60 60" aria-hidden width="100%" height="100%">
      <SharedDefs suffix={id} />

      {/* aura */}
      <circle cx="0" cy="0" r="22" fill={palette.auraMid} opacity={0.16} filter={F.halo} />

      <motion.g
        animate={{ rotate: 360 }}
        transition={{ duration: hovered ? 8 : 22, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "center" }}
      >
        {/* dış küre dolu zemin */}
        <circle cx="0" cy="0" r="20" fill={palette.auraOuter} fillOpacity={0.5} stroke={palette.orbitMid} strokeWidth={0.7} />

        {/* horizontal latitude lines (ellipsler — küresel perspektif) */}
        {[
          { ry: 5, opacity: 0.5 },
          { ry: 11, opacity: 0.65 },
          { ry: 16, opacity: 0.55 },
          { ry: 19, opacity: 0.4 },
        ].map((e, i) => (
          <ellipse
            key={`h-${i}`}
            cx="0"
            cy={i === 0 ? -12 : i === 1 ? -4 : i === 2 ? 6 : 14}
            rx="20"
            ry={e.ry}
            fill="none"
            stroke={palette.orbitMid}
            strokeWidth={0.5}
            opacity={e.opacity}
          />
        ))}

        {/* longitude lines */}
        {[
          { rotate: 0 },
          { rotate: 30 },
          { rotate: 60 },
          { rotate: 90 },
          { rotate: 120 },
          { rotate: 150 },
        ].map((l, i) => (
          <ellipse
            key={`v-${i}`}
            cx="0"
            cy="0"
            rx={20 * Math.abs(Math.cos((l.rotate * Math.PI) / 180))}
            ry="20"
            fill="none"
            stroke={palette.orbitMid}
            strokeWidth={0.5}
            opacity={0.6}
          />
        ))}

        {/* triangle accents — geodesik vertexler */}
        {[
          [0, -20],
          [17, -10],
          [17, 10],
          [0, 20],
          [-17, 10],
          [-17, -10],
        ].map(([x, y], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r="1.3"
            fill={palette.electron}
            filter={F.glow}
          />
        ))}

        {/* highlight rim */}
        <circle cx="0" cy="0" r="20" fill="none" stroke={palette.orbitHighlight} strokeWidth={0.3} opacity={0.6} />
      </motion.g>

      {/* merkez parlak nokta */}
      <motion.circle
        cx="0"
        cy="0"
        r="2.4"
        fill={palette.nucleusCore}
        filter={F.glow}
        animate={{ scale: hovered ? [1, 1.3, 1] : [1, 1.1, 1] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "center" }}
      />
    </svg>
  );
}
