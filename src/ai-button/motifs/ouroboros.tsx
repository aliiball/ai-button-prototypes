import { useId } from "react";
import { motion } from "framer-motion";
import { SharedDefs, filterIds } from "../shared/filters";
import type { MotifProps } from "../shared/types";

/**
 * Ouroboros — kuyruğunu yiyen halka şeklinde yılan. Sonsuz döngü metaforu.
 */
export function OuroborosMotif({ palette, hovered }: MotifProps) {
  const id = useId().replace(/:/g, "");
  const F = filterIds(id);
  const grad = `our-${id}`;
  const headGrad = `our-h-${id}`;

  return (
    <svg viewBox="-30 -30 60 60" aria-hidden width="100%" height="100%">
      <SharedDefs suffix={id} />
      <defs>
        <linearGradient id={grad} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={palette.orbitDeep} />
          <stop offset="50%" stopColor={palette.boltMid} />
          <stop offset="100%" stopColor={palette.electron} />
        </linearGradient>
        <radialGradient id={headGrad}>
          <stop offset="0%" stopColor={palette.nucleusCore} />
          <stop offset="60%" stopColor={palette.boltMid} />
          <stop offset="100%" stopColor={palette.nucleusDeep} />
        </radialGradient>
      </defs>

      {/* aura */}
      <circle cx="0" cy="0" r="22" fill={palette.auraMid} opacity={0.16} filter={F.halo} />

      <motion.g
        animate={{ rotate: 360 }}
        transition={{ duration: hovered ? 6 : 14, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "center" }}
      >
        {/* gövde (halka şeridi) - 320° açı, kalanı boş kalır ki baş ve kuyruk birleşsin */}
        <path
          d="M 16 0 A 16 16 0 1 1 14 -7.5"
          fill="none"
          stroke={palette.orbitDeep}
          strokeWidth={6.5}
          strokeLinecap="round"
          opacity={0.5}
          filter={F.halo}
        />
        <path
          d="M 16 0 A 16 16 0 1 1 14 -7.5"
          fill="none"
          stroke={`url(#${grad})`}
          strokeWidth={4.5}
          strokeLinecap="round"
          filter={F.soft}
        />
        <path
          d="M 16 0 A 16 16 0 1 1 14 -7.5"
          fill="none"
          stroke={palette.orbitHighlight}
          strokeWidth={0.7}
          strokeLinecap="round"
          strokeDasharray="0.6 2"
          opacity={0.85}
        />

        {/* yılan kafası */}
        <g transform="translate(14, -7.5) rotate(-50)">
          <ellipse cx="0" cy="0" rx="5" ry="3.6" fill={`url(#${headGrad})`} stroke={palette.orbitHighlight} strokeWidth={0.4} filter={F.glow} />
          {/* göz */}
          <circle cx="2" cy="-1" r="0.7" fill={palette.nucleusCore} />
        </g>

        {/* kuyruk ucu — kafanın ağzına giriyor (16,0 noktası) */}
        <circle cx="16" cy="0" r="2" fill={palette.electron} filter={F.glow} />
      </motion.g>
    </svg>
  );
}
