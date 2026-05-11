import { useId } from "react";
import { motion } from "framer-motion";
import { SharedDefs, filterIds } from "../shared/filters";
import type { MotifProps } from "../shared/types";

/**
 * RGB-split glitch — bir glyph 3 renk kanalına ayrılmış, faz/offset ile titrer.
 */
export function GlitchMotif({ palette, hovered }: MotifProps) {
  const id = useId().replace(/:/g, "");
  const F = filterIds(id);

  // basit "AI" glyph yerine kare + içinde küçük çapraz tasarım
  const glyph = (
    <g>
      <rect x="-10" y="-10" width="20" height="20" rx="3" fill="none" strokeWidth={2} />
      <line x1="-5" y1="-5" x2="5" y2="5" strokeWidth={1.6} strokeLinecap="round" />
      <line x1="5" y1="-5" x2="-5" y2="5" strokeWidth={1.6} strokeLinecap="round" />
    </g>
  );

  return (
    <svg viewBox="-30 -30 60 60" aria-hidden width="100%" height="100%">
      <SharedDefs suffix={id} />

      {/* aura */}
      <rect x="-22" y="-22" width="44" height="44" rx="10" fill={palette.auraOuter} opacity={0.4} />
      <circle cx="0" cy="0" r="22" fill={palette.auraMid} opacity={0.12} filter={F.halo} />

      {/* RGB split — 3 layer offset */}
      <motion.g
        stroke={palette.boltMid}
        animate={{ x: hovered ? [-3, -1, -3, -2] : [-2, -1, -2] }}
        transition={{ duration: hovered ? 0.18 : 0.6, repeat: Infinity, ease: "linear" }}
      >
        {glyph}
      </motion.g>
      <motion.g
        stroke={palette.electron}
        animate={{ x: hovered ? [2, 1, 2, 3] : [1, 2, 1] }}
        transition={{ duration: hovered ? 0.2 : 0.7, repeat: Infinity, ease: "linear" }}
      >
        {glyph}
      </motion.g>
      <motion.g
        stroke={palette.orbitHighlight}
        animate={{ x: hovered ? [0, -1, 1, 0] : 0 }}
        transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
      >
        {glyph}
      </motion.g>

      {/* scanline'lar (yatay glitch çizgileri) */}
      {[-14, -6, 4, 10, 16].map((y, i) => (
        <motion.line
          key={y}
          x1="-22"
          y1={y}
          x2="22"
          y2={y}
          stroke={palette.boltBright}
          strokeWidth={0.4}
          animate={{ opacity: [0, 0.6, 0], x: hovered ? [-3, 3, -3] : 0 }}
          transition={{
            duration: hovered ? 0.4 : 0.9,
            repeat: Infinity,
            delay: i * 0.13,
            ease: "linear",
          }}
        />
      ))}

      {/* ani glitch bloğu */}
      <motion.rect
        x="-22"
        y="-4"
        width="44"
        height="2"
        fill={palette.electron}
        opacity={0.5}
        animate={{
          y: [-20, 20, -20],
          opacity: [0, 0.7, 0],
          height: [1, 3, 1],
        }}
        transition={{
          duration: hovered ? 0.9 : 2.4,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </svg>
  );
}
