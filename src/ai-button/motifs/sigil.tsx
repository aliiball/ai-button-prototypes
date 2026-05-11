import { useId } from "react";
import { motion } from "framer-motion";
import { SharedDefs, filterIds } from "../shared/filters";
import type { MotifProps } from "../shared/types";

/**
 * Soyut geometrik sigil/rune — daireler + çizgiler + kesişim noktaları.
 */
export function SigilMotif({ palette, hovered }: MotifProps) {
  const id = useId().replace(/:/g, "");
  const F = filterIds(id);

  return (
    <svg viewBox="-30 -30 60 60" aria-hidden width="100%" height="100%">
      <SharedDefs suffix={id} />

      {/* aura */}
      <circle cx="0" cy="0" r="22" fill={palette.auraMid} opacity={0.16} filter={F.halo} />

      <motion.g
        animate={{ rotate: hovered ? 360 : 0 }}
        transition={{ duration: hovered ? 14 : 30, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "center" }}
      >
        {/* dış çember */}
        <circle cx="0" cy="0" r="20" fill="none" stroke={palette.orbitMid} strokeWidth={0.6} opacity={0.7} />
        {/* iç çember */}
        <circle cx="0" cy="0" r="12" fill="none" stroke={palette.orbitMid} strokeWidth={0.5} opacity={0.55} />
      </motion.g>

      {/* statik 3 yıldız uçlu çizgiler — Üçgen sigil */}
      <g>
        <line x1="0" y1="-18" x2="15.6" y2="9" stroke={palette.boltMid} strokeWidth={1} strokeLinecap="round" opacity={0.85} filter={F.soft} />
        <line x1="15.6" y1="9" x2="-15.6" y2="9" stroke={palette.boltMid} strokeWidth={1} strokeLinecap="round" opacity={0.85} filter={F.soft} />
        <line x1="-15.6" y1="9" x2="0" y2="-18" stroke={palette.boltMid} strokeWidth={1} strokeLinecap="round" opacity={0.85} filter={F.soft} />

        {/* highlight stripes */}
        <line x1="0" y1="-18" x2="15.6" y2="9" stroke={palette.boltBright} strokeWidth={0.3} strokeLinecap="round" />
        <line x1="15.6" y1="9" x2="-15.6" y2="9" stroke={palette.boltBright} strokeWidth={0.3} strokeLinecap="round" />
        <line x1="-15.6" y1="9" x2="0" y2="-18" stroke={palette.boltBright} strokeWidth={0.3} strokeLinecap="round" />
      </g>

      {/* iç dik çubuk */}
      <line x1="0" y1="-12" x2="0" y2="6" stroke={palette.orbitHighlight} strokeWidth={0.5} opacity={0.6} />

      {/* uç noktaları glowing */}
      {[
        { cx: 0, cy: -18 },
        { cx: 15.6, cy: 9 },
        { cx: -15.6, cy: 9 },
      ].map((p, i) => (
        <motion.circle
          key={i}
          cx={p.cx}
          cy={p.cy}
          r="2"
          fill={palette.nucleusCore}
          filter={F.glow}
          animate={{ opacity: hovered ? [0.5, 1, 0.5] : [0.4, 0.9, 0.4], scale: [0.85, 1.15, 0.85] }}
          transition={{
            duration: hovered ? 1 : 1.8,
            repeat: Infinity,
            delay: i * 0.3,
            ease: "easeInOut",
          }}
          style={{ transformOrigin: `${p.cx}px ${p.cy}px` }}
        />
      ))}

      {/* merkez gözü */}
      <circle cx="0" cy="0" r="2.4" fill={palette.electron} filter={F.glow} />
      <circle cx="0" cy="0" r="1" fill={palette.nucleusCore} />
    </svg>
  );
}
