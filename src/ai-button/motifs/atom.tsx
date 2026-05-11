import { useId } from "react";
import { motion } from "framer-motion";
import { SharedDefs, filterIds } from "../shared/filters";
import { useOrbit } from "../shared/use-orbit";
import { useBolts } from "../shared/use-bolt";
import type { MotifProps } from "../shared/types";

export function AtomMotif({ palette, hovered }: MotifProps) {
  const id = useId().replace(/:/g, "");
  const F = filterIds(id);
  const positions = useOrbit({ rx: 22, ry: 9, period: 7, count: 3 });
  const bolts = useBolts(positions, hovered);
  const nucleusGrad = `nuc-${id}`;
  const auraGrad = `aura-${id}`;

  return (
    <motion.svg
      viewBox="-30 -30 60 60"
      aria-hidden
      width="100%"
      height="100%"
      animate={{ scale: hovered ? 1.12 : [1, 1.06, 1] }}
      transition={
        hovered
          ? { duration: 0.3 }
          : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
      }
      style={{ transformOrigin: "center" }}
    >
      <SharedDefs suffix={id} />
      <defs>
        <radialGradient id={nucleusGrad} cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor={palette.nucleusCore} />
          <stop offset="35%" stopColor={palette.nucleusMid} />
          <stop offset="100%" stopColor={palette.nucleusDeep} />
        </radialGradient>
        <radialGradient id={auraGrad} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={palette.auraInner} stopOpacity="0.95" />
          <stop offset="55%" stopColor={palette.auraMid} stopOpacity="0.35" />
          <stop offset="100%" stopColor={palette.auraOuter} stopOpacity="0" />
        </radialGradient>
      </defs>

      <g filter={F.depth}>
        {[0, 60, 120].map((angle) => (
          <g key={angle} transform={`rotate(${angle})`}>
            <ellipse
              cx="0"
              cy="0"
              rx="22"
              ry="9"
              fill="none"
              stroke={palette.orbitDeep}
              strokeWidth={3.6}
              opacity={0.55}
              filter={F.halo}
            />
            <ellipse
              cx="0"
              cy="0"
              rx="22"
              ry="9"
              fill="none"
              stroke={palette.orbitMid}
              strokeWidth={1.4}
              opacity={0.9}
              filter={F.soft}
            />
            <ellipse
              cx="0"
              cy="0"
              rx="22"
              ry="9"
              fill="none"
              stroke={palette.orbitHighlight}
              strokeWidth={0.55}
              opacity={0.95}
            />
          </g>
        ))}

        {positions.map((p, i) => (
          <circle
            key={`e-${i}`}
            cx={p.x}
            cy={p.y}
            r={1.9}
            fill={palette.electron}
            filter={F.glow}
          />
        ))}

        <g>
          {bolts.map((b, i) =>
            b ? (
              <g key={`b-${i}`} opacity={b.intensity}>
                <path
                  d={b.d}
                  fill="none"
                  stroke={palette.boltDeep}
                  strokeWidth={3.4}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity={0.7}
                  filter={F.halo}
                />
                <path
                  d={b.d}
                  fill="none"
                  stroke={palette.boltMid}
                  strokeWidth={1.6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity={0.95}
                  filter={F.soft}
                />
                <path
                  d={b.d}
                  fill="none"
                  stroke={palette.boltBright}
                  strokeWidth={0.7}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            ) : null,
          )}
        </g>

        <motion.circle
          cx="0"
          cy="0"
          r="7"
          fill={`url(#${auraGrad})`}
          animate={{ scale: [1, 1.25, 1], opacity: [0.55, 0.95, 0.55] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "center" }}
        />
        <circle
          cx="0"
          cy="0"
          r="4"
          fill={`url(#${nucleusGrad})`}
          filter={F.glow}
        />
      </g>
    </motion.svg>
  );
}
