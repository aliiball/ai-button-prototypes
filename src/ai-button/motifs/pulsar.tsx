import { useId } from "react";
import { motion } from "framer-motion";
import { SharedDefs, filterIds } from "../shared/filters";
import type { MotifProps } from "../shared/types";

/**
 * Pulsar — merkezden dışa periyodik radyal flare patlaması.
 */
export function PulsarMotif({ palette, hovered }: MotifProps) {
  const id = useId().replace(/:/g, "");
  const F = filterIds(id);
  const coreGrad = `pl-c-${id}`;
  const flareCount = 14;
  const dur = hovered ? 1 : 1.8;

  return (
    <svg viewBox="-30 -30 60 60" aria-hidden width="100%" height="100%">
      <SharedDefs suffix={id} />
      <defs>
        <radialGradient id={coreGrad}>
          <stop offset="0%" stopColor={palette.nucleusCore} />
          <stop offset="50%" stopColor={palette.electron} />
          <stop offset="100%" stopColor={palette.nucleusDeep} />
        </radialGradient>
      </defs>

      {/* aura */}
      <motion.circle
        cx="0"
        cy="0"
        r="22"
        fill={palette.auraMid}
        opacity={0.22}
        filter={F.halo}
        animate={{ scale: [1, 1.18, 1], opacity: [0.15, 0.35, 0.15] }}
        transition={{ duration: dur, repeat: Infinity, ease: "easeOut" }}
        style={{ transformOrigin: "center" }}
      />

      {/* radyal flare ışınları — dönen */}
      <motion.g
        animate={{ rotate: 360 }}
        transition={{ duration: hovered ? 8 : 18, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "center" }}
      >
        {Array.from({ length: flareCount }).map((_, i) => (
          <line
            key={i}
            x1="0"
            y1="0"
            x2="0"
            y2={-24}
            transform={`rotate(${(i * 360) / flareCount})`}
            stroke={palette.boltBright}
            strokeWidth={i % 2 === 0 ? 0.6 : 0.4}
            strokeLinecap="round"
            opacity={i % 2 === 0 ? 0.55 : 0.3}
          />
        ))}
      </motion.g>

      {/* dış genleşen halkalar (atış) */}
      {[0, 1, 2].map((i) => (
        <motion.circle
          key={i}
          cx="0"
          cy="0"
          r="6"
          fill="none"
          stroke={palette.electron}
          strokeWidth={1.4}
          animate={{
            r: [4, 22, 26],
            opacity: [0.95, 0.2, 0],
            strokeWidth: [2, 0.6, 0.2],
          }}
          transition={{
            duration: dur * 1.4,
            repeat: Infinity,
            delay: i * (dur / 2.5),
            ease: "easeOut",
          }}
          filter={F.glow}
        />
      ))}

      {/* parlak çekirdek — atan */}
      <motion.circle
        cx="0"
        cy="0"
        r="4"
        fill={`url(#${coreGrad})`}
        filter={F.glow}
        animate={{ scale: [1, 1.6, 1] }}
        transition={{ duration: dur, repeat: Infinity, ease: "easeOut" }}
        style={{ transformOrigin: "center" }}
      />
      <circle cx="0" cy="0" r="1.4" fill={palette.nucleusCore} />
    </svg>
  );
}
