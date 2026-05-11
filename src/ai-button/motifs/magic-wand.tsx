import { useId } from "react";
import { motion } from "framer-motion";
import { SharedDefs, filterIds } from "../shared/filters";
import type { MotifProps } from "../shared/types";

/**
 * Sihirli değnek + tip'te büyük sparkle + arkada iz partikülleri.
 * Notion AI tarzı.
 */
export function MagicWandMotif({ palette, hovered }: MotifProps) {
  const id = useId().replace(/:/g, "");
  const F = filterIds(id);
  const wandGrad = `mw-stick-${id}`;
  const tipGrad = `mw-tip-${id}`;

  const star = (s: number) =>
    `M0,${-s} C${s * 0.18},${-s * 0.18} ${s * 0.18},${-s * 0.18} ${s},0 C${s * 0.18},${s * 0.18} ${s * 0.18},${s * 0.18} 0,${s} C${-s * 0.18},${s * 0.18} ${-s * 0.18},${s * 0.18} ${-s},0 C${-s * 0.18},${-s * 0.18} ${-s * 0.18},${-s * 0.18} 0,${-s} Z`;

  // Tail sparkles — değneğin alt-sol köşesinden yukarı-sağ tip'e doğru
  const trail = [
    { s: 1.4, x: -19, y: 19, delay: 0 },
    { s: 1.6, x: -14, y: 14, delay: 0.15 },
    { s: 1.8, x: -9, y: 9, delay: 0.3 },
    { s: 2.0, x: -4, y: 4, delay: 0.45 },
    { s: 1.4, x: -23, y: 14, delay: 0.6 },
    { s: 1.4, x: -16, y: 22, delay: 0.75 },
  ];

  return (
    <svg viewBox="-30 -30 60 60" aria-hidden width="100%" height="100%">
      <SharedDefs suffix={id} />
      <defs>
        <linearGradient id={wandGrad} x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={palette.nucleusDeep} />
          <stop offset="100%" stopColor={palette.nucleusMid} />
        </linearGradient>
        <radialGradient id={tipGrad} cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor={palette.nucleusCore} />
          <stop offset="55%" stopColor={palette.nucleusMid} />
          <stop offset="100%" stopColor={palette.nucleusDeep} />
        </radialGradient>
      </defs>

      <motion.g
        animate={{ rotate: hovered ? [-4, 4, -4] : 0 }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "center" }}
      >
        {/* değnek gövdesi (diyagonal rect) */}
        <g transform="rotate(-45)">
          <rect
            x="-2"
            y="0"
            width="3"
            height="28"
            rx="1.4"
            fill={`url(#${wandGrad})`}
            stroke={palette.orbitHighlight}
            strokeWidth={0.3}
            filter={F.depth}
          />
        </g>

        {/* tip — büyük sparkle */}
        <motion.g
          transform="translate(9, -9)"
          animate={{ rotate: hovered ? 360 : 180 }}
          transition={{ duration: hovered ? 4 : 8, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "9px -9px" }}
        >
          <motion.path
            d={star(8)}
            fill={`url(#${tipGrad})`}
            stroke={palette.orbitHighlight}
            strokeWidth={0.4}
            filter={F.glow}
            animate={{ scale: [0.92, 1.12, 0.92] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "center" }}
          />
        </motion.g>

        {/* iz partikülleri */}
        {trail.map((p, i) => (
          <motion.path
            key={i}
            d={star(p.s)}
            transform={`translate(${p.x}, ${p.y})`}
            fill={i % 2 === 0 ? palette.electron : palette.boltBright}
            filter={F.soft}
            animate={{
              opacity: hovered ? [0, 0.95, 0] : [0, 0.5, 0],
              scale: [0.6, 1.1, 0.6],
            }}
            transition={{
              duration: hovered ? 1.2 : 2,
              repeat: Infinity,
              delay: p.delay,
              ease: "easeOut",
            }}
            style={{ transformOrigin: "center" }}
          />
        ))}
      </motion.g>
    </svg>
  );
}
