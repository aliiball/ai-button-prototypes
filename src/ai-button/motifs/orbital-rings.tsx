import { useId } from "react";
import { motion } from "framer-motion";
import { SharedDefs, filterIds } from "../shared/filters";
import { useOrbit } from "../shared/use-orbit";
import type { MotifProps } from "../shared/types";

/**
 * Satürn benzeri eğik halka + halkanın üzerinde gezen bir parlak nokta + merkez küresi.
 */
export function OrbitalRingsMotif({ palette, hovered }: MotifProps) {
  const id = useId().replace(/:/g, "");
  const F = filterIds(id);
  const grad = `or-${id}`;
  const positions = useOrbit({
    rx: 24,
    ry: 7,
    period: hovered ? 4 : 7,
    count: 1,
  });

  return (
    <svg viewBox="-30 -30 60 60" aria-hidden width="100%" height="100%">
      <SharedDefs suffix={id} />
      <defs>
        <radialGradient id={grad} cx="40%" cy="35%" r="70%">
          <stop offset="0%" stopColor={palette.nucleusCore} />
          <stop offset="100%" stopColor={palette.nucleusDeep} />
        </radialGradient>
      </defs>

      <g transform="rotate(-18)">
        {/* halka — 3 katman */}
        <ellipse
          cx="0"
          cy="0"
          rx="24"
          ry="7"
          fill="none"
          stroke={palette.orbitDeep}
          strokeWidth={3.2}
          opacity={0.45}
          filter={F.halo}
        />
        <ellipse
          cx="0"
          cy="0"
          rx="24"
          ry="7"
          fill="none"
          stroke={palette.orbitMid}
          strokeWidth={1.4}
          opacity={0.85}
          filter={F.soft}
        />
        <ellipse
          cx="0"
          cy="0"
          rx="24"
          ry="7"
          fill="none"
          stroke={palette.orbitHighlight}
          strokeWidth={0.5}
          opacity={0.95}
        />

        {/* gezici nokta */}
        {positions[0] && (
          <>
            <circle
              cx={positions[0].x}
              cy={positions[0].y}
              r={3.2}
              fill={palette.electron}
              opacity={0.6}
              filter={F.halo}
            />
            <circle
              cx={positions[0].x}
              cy={positions[0].y}
              r={1.8}
              fill={palette.nucleusCore}
              filter={F.glow}
            />
          </>
        )}
      </g>

      {/* merkez küresi */}
      <motion.circle
        cx="0"
        cy="0"
        r="10"
        fill={palette.auraMid}
        opacity={0.3}
        filter={F.halo}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2.2, repeat: Infinity }}
        style={{ transformOrigin: "center" }}
      />
      <circle
        cx="0"
        cy="0"
        r="7.5"
        fill={`url(#${grad})`}
        filter={F.glow}
      />
    </svg>
  );
}
