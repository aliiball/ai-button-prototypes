import { useId } from "react";
import { motion } from "framer-motion";
import { SharedDefs, filterIds } from "../shared/filters";
import type { MotifProps } from "../shared/types";

/**
 * Möbius şeridi — bükülmüş 3D halka. İki taraflı bant gradient ile.
 */
export function MobiusStripMotif({ palette, hovered }: MotifProps) {
  const id = useId().replace(/:/g, "");
  const F = filterIds(id);
  const topGrad = `mob-t-${id}`;
  const botGrad = `mob-b-${id}`;

  // Mobius'u figure-eight-vari iki cubic ile temsil et
  const topHalf = "M-20,0 C-20,-14 -8,-14 0,-2 C8,-14 20,-14 20,0";
  const bottomHalf = "M-20,0 C-20,14 -8,14 0,2 C8,14 20,14 20,0";
  // twist'i göstermek için orta çapraz
  const twistCross1 = "M-3,-5 L3,5";
  const twistCross2 = "M3,-5 L-3,5";

  return (
    <svg viewBox="-30 -30 60 60" aria-hidden width="100%" height="100%">
      <SharedDefs suffix={id} />
      <defs>
        <linearGradient id={topGrad} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={palette.boltMid} />
          <stop offset="50%" stopColor={palette.electron} />
          <stop offset="100%" stopColor={palette.nucleusMid} />
        </linearGradient>
        <linearGradient id={botGrad} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={palette.nucleusDeep} />
          <stop offset="50%" stopColor={palette.orbitMid} />
          <stop offset="100%" stopColor={palette.boltDeep} />
        </linearGradient>
      </defs>

      {/* aura */}
      <ellipse cx="0" cy="0" rx="24" ry="14" fill={palette.auraMid} opacity={0.18} filter={F.halo} />

      <motion.g
        animate={{ rotate: hovered ? [0, 4, -4, 0] : [0, 2, -2, 0] }}
        transition={{ duration: hovered ? 2 : 4, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "center" }}
      >
        {/* alt yarım (büyük arka bant) */}
        <path d={bottomHalf} fill="none" stroke={`url(#${botGrad})`} strokeWidth={6.5} strokeLinecap="round" filter={F.soft} opacity={0.92} />
        <path d={bottomHalf} fill="none" stroke={palette.orbitDeep} strokeWidth={0.5} strokeLinecap="round" opacity={0.6} />

        {/* üst yarım (önde geçen bant) */}
        <path d={topHalf} fill="none" stroke={`url(#${topGrad})`} strokeWidth={7} strokeLinecap="round" filter={F.glow} />
        <path d={topHalf} fill="none" stroke={palette.orbitHighlight} strokeWidth={0.5} strokeLinecap="round" opacity={0.85} />

        {/* twist marker — ortada bantı kesen ince çapraz şerit */}
        <motion.g
          animate={{ scale: hovered ? [1, 1.2, 1] : [1, 1.08, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "center" }}
        >
          <path d={twistCross1} stroke={palette.nucleusCore} strokeWidth={1} strokeLinecap="round" filter={F.glow} />
          <path d={twistCross2} stroke={palette.nucleusCore} strokeWidth={1} strokeLinecap="round" filter={F.glow} />
        </motion.g>
      </motion.g>

      {/* uç parlamaları */}
      <circle cx="-20" cy="0" r="1.6" fill={palette.electron} filter={F.glow} />
      <circle cx="20" cy="0" r="1.6" fill={palette.electron} filter={F.glow} />
    </svg>
  );
}
