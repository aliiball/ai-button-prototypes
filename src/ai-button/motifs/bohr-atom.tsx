import { useId } from "react";
import { motion } from "framer-motion";
import { SharedDefs, filterIds } from "../shared/filters";
import type { MotifProps } from "../shared/types";

/**
 * Klasik Bohr atom modeli — düz konsantrik daire orbitler + her birinde 1 elektron.
 * Atom motifinden farklı: 3D ellipse değil, 2D daire orbitler.
 */
export function BohrAtomMotif({ palette, hovered }: MotifProps) {
  const id = useId().replace(/:/g, "");
  const F = filterIds(id);
  const coreGrad = `bohr-${id}`;

  const orbits = [
    { r: 9, dur: 4 },
    { r: 14, dur: 7 },
    { r: 20, dur: 11 },
  ];

  return (
    <svg viewBox="-30 -30 60 60" aria-hidden width="100%" height="100%">
      <SharedDefs suffix={id} />
      <defs>
        <radialGradient id={coreGrad} cx="40%" cy="35%" r="80%">
          <stop offset="0%" stopColor={palette.nucleusCore} />
          <stop offset="55%" stopColor={palette.nucleusMid} />
          <stop offset="100%" stopColor={palette.nucleusDeep} />
        </radialGradient>
      </defs>

      {/* aura */}
      <circle cx="0" cy="0" r="22" fill={palette.auraMid} opacity={0.15} filter={F.halo} />

      {/* orbit halkaları */}
      {orbits.map((o, i) => (
        <circle
          key={i}
          cx="0"
          cy="0"
          r={o.r}
          fill="none"
          stroke={palette.orbitMid}
          strokeWidth={0.5}
          strokeDasharray="0.6 1.2"
          opacity={0.55}
        />
      ))}

      {/* her orbitte 1 dönen elektron */}
      {orbits.map((o, i) => (
        <motion.g
          key={`e-${i}`}
          animate={{ rotate: 360 }}
          transition={{
            duration: hovered ? o.dur / 2 : o.dur,
            repeat: Infinity,
            ease: "linear",
            delay: i * 0.3,
          }}
          style={{ transformOrigin: "center" }}
        >
          <circle cx="0" cy={-o.r} r="2" fill={palette.electron} filter={F.glow} />
          <circle cx="0" cy={-o.r} r="0.8" fill={palette.nucleusCore} />
        </motion.g>
      ))}

      {/* ikinci orbit: ters yönde + faz farkı */}
      <motion.g
        animate={{ rotate: -360 }}
        transition={{ duration: hovered ? 3.5 : 8, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "center" }}
      >
        <circle cx="0" cy={14} r="1.6" fill={palette.boltBright} filter={F.glow} />
      </motion.g>

      {/* çekirdek */}
      <motion.circle
        cx="0"
        cy="0"
        r="4"
        fill={`url(#${coreGrad})`}
        stroke={palette.orbitHighlight}
        strokeWidth={0.3}
        filter={F.glow}
        animate={{ scale: hovered ? [1, 1.18, 1] : [1, 1.08, 1] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "center" }}
      />
    </svg>
  );
}
