import { useId } from "react";
import { motion } from "framer-motion";
import { SharedDefs, filterIds } from "../shared/filters";
import type { MotifProps } from "../shared/types";

/**
 * Asimetrik 4-köşeli yıldız kümesi (Gemini tarzı).
 * 1 büyük + 4 farklı boy küçük yıldız, organik dizilim.
 */
export function StarClusterMotif({ palette, hovered }: MotifProps) {
  const id = useId().replace(/:/g, "");
  const F = filterIds(id);
  const grad = `sc-${id}`;

  const star = (s: number) =>
    `M0,${-s} C${s * 0.18},${-s * 0.18} ${s * 0.18},${-s * 0.18} ${s},0 C${s * 0.18},${s * 0.18} ${s * 0.18},${s * 0.18} 0,${s} C${-s * 0.18},${s * 0.18} ${-s * 0.18},${s * 0.18} ${-s},0 C${-s * 0.18},${-s * 0.18} ${-s * 0.18},${-s * 0.18} 0,${-s} Z`;

  const minors: Array<{ s: number; x: number; y: number; dur: number; col: string; delay: number }> = [
    { s: 7, x: -13, y: -12, dur: 18, col: palette.electron, delay: 0 },
    { s: 5, x: 14, y: 8, dur: 9, col: palette.boltBright, delay: 0.4 },
    { s: 3, x: -10, y: 11, dur: 24, col: palette.nucleusCore, delay: 0.8 },
    { s: 2.4, x: 12, y: -15, dur: 6, col: palette.electron, delay: 1.2 },
  ];

  return (
    <svg viewBox="-30 -30 60 60" aria-hidden width="100%" height="100%">
      <SharedDefs suffix={id} />
      <defs>
        <radialGradient id={grad} cx="50%" cy="45%" r="60%">
          <stop offset="0%" stopColor={palette.nucleusCore} />
          <stop offset="55%" stopColor={palette.nucleusMid} />
          <stop offset="100%" stopColor={palette.nucleusDeep} />
        </radialGradient>
      </defs>

      <motion.g
        animate={{ rotate: hovered ? 30 : 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        style={{ transformOrigin: "center" }}
      >
        <motion.path
          d={star(14)}
          transform="translate(2, -3)"
          fill={`url(#${grad})`}
          stroke={palette.orbitHighlight}
          strokeWidth={0.4}
          filter={F.glow}
          animate={{ scale: hovered ? [1, 1.18, 1] : [1, 1.08, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "center" }}
        />
      </motion.g>

      {minors.map((m, i) => (
        <motion.g
          key={i}
          animate={{ rotate: 360 }}
          transition={{
            duration: hovered ? m.dur / 2 : m.dur,
            repeat: Infinity,
            ease: "linear",
            delay: m.delay,
          }}
          style={{ transformOrigin: "center" }}
        >
          <motion.path
            d={star(m.s)}
            transform={`translate(${m.x}, ${m.y})`}
            fill={m.col}
            opacity={0.9}
            filter={F.soft}
            animate={{ scale: hovered ? [0.9, 1.25, 0.9] : [0.85, 1.05, 0.85] }}
            transition={{
              duration: 1.8 + i * 0.3,
              repeat: Infinity,
              delay: m.delay,
            }}
          />
        </motion.g>
      ))}
    </svg>
  );
}
