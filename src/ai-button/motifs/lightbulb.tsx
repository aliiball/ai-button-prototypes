import { useId } from "react";
import { motion } from "framer-motion";
import { SharedDefs, filterIds } from "../shared/filters";
import type { MotifProps } from "../shared/types";

/**
 * Edison ampul + filaman + çevresinde sparkle.
 * "İçgörü/fikir" metaforu.
 */
export function LightbulbMotif({ palette, hovered }: MotifProps) {
  const id = useId().replace(/:/g, "");
  const F = filterIds(id);
  const bulbGrad = `bl-${id}`;
  const haloGrad = `bh-${id}`;

  return (
    <svg viewBox="-30 -30 60 60" aria-hidden width="100%" height="100%">
      <SharedDefs suffix={id} />
      <defs>
        <radialGradient id={bulbGrad} cx="40%" cy="35%" r="75%">
          <stop offset="0%" stopColor={palette.auraInner} stopOpacity="0.85" />
          <stop offset="55%" stopColor={palette.nucleusMid} stopOpacity="0.55" />
          <stop offset="100%" stopColor={palette.nucleusDeep} stopOpacity="0.6" />
        </radialGradient>
        <radialGradient id={haloGrad} cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor={palette.auraInner} stopOpacity="0.9" />
          <stop offset="100%" stopColor={palette.auraOuter} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* sıcak halo */}
      <motion.circle
        cx="0"
        cy="-3"
        r="22"
        fill={`url(#${haloGrad})`}
        animate={{ scale: hovered ? 1.15 : [1, 1.06, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "center" }}
      />

      {/* ampul cam — armut şekli */}
      <path
        d="M0,-18 C-10,-18 -12,-10 -10,-2 C-9,4 -7,6 -6,10 L6,10 C7,6 9,4 10,-2 C12,-10 10,-18 0,-18 Z"
        fill={`url(#${bulbGrad})`}
        stroke={palette.orbitHighlight}
        strokeWidth={0.6}
        filter={F.depth}
      />

      {/* dudak (cam-vida geçişi) */}
      <rect x="-6" y="10" width="12" height="2" fill={palette.orbitMid} />
      {/* vida dişleri */}
      <rect x="-5.5" y="12.5" width="11" height="1.6" fill={palette.nucleusDeep} rx="0.4" />
      <rect x="-5.5" y="15" width="11" height="1.6" fill={palette.nucleusDeep} rx="0.4" />
      <rect x="-4.5" y="17.5" width="9" height="1.4" fill={palette.nucleusDeep} rx="0.4" />

      {/* filaman — zikzak çizgi */}
      <motion.path
        d="M-6,-2 L-4,2 L-2,-2 L0,2 L2,-2 L4,2 L6,-2"
        fill="none"
        stroke={palette.nucleusCore}
        strokeWidth={1.2}
        strokeLinecap="round"
        filter={F.glow}
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 1.4, repeat: Infinity }}
      />
      {/* filaman bağlantı çizgileri */}
      <line x1="-6" y1="-2" x2="-7" y2="6" stroke={palette.orbitMid} strokeWidth={0.6} />
      <line x1="6" y1="-2" x2="7" y2="6" stroke={palette.orbitMid} strokeWidth={0.6} />

      {/* etrafta sparkle (hover'da belirgin) */}
      {[
        { x: -18, y: -16, s: 2 },
        { x: 17, y: -14, s: 1.6 },
        { x: -20, y: 4, s: 1.4 },
        { x: 18, y: 6, s: 1.8 },
      ].map((sp, i) => (
        <motion.g
          key={i}
          animate={{
            opacity: hovered ? [0.4, 1, 0.4] : [0.1, 0.5, 0.1],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.25 }}
          style={{ transformOrigin: `${sp.x}px ${sp.y}px` }}
        >
          <line
            x1={sp.x - sp.s}
            y1={sp.y}
            x2={sp.x + sp.s}
            y2={sp.y}
            stroke={palette.electron}
            strokeWidth={0.6}
            strokeLinecap="round"
          />
          <line
            x1={sp.x}
            y1={sp.y - sp.s}
            x2={sp.x}
            y2={sp.y + sp.s}
            stroke={palette.electron}
            strokeWidth={0.6}
            strokeLinecap="round"
          />
        </motion.g>
      ))}
    </svg>
  );
}
