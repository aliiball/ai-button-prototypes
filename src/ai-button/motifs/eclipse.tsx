import { useId } from "react";
import { motion } from "framer-motion";
import { SharedDefs, filterIds } from "../shared/filters";
import type { MotifProps } from "../shared/types";

/**
 * Güneş tutulması — koyu merkez diskin etrafında parlayan korona + ışın hüzmeleri.
 */
export function EclipseMotif({ palette, hovered }: MotifProps) {
  const id = useId().replace(/:/g, "");
  const F = filterIds(id);
  const coronaGrad = `ec-co-${id}`;

  const rays = Array.from({ length: 16 }, (_, i) => (i * 360) / 16);

  return (
    <svg viewBox="-30 -30 60 60" aria-hidden width="100%" height="100%">
      <SharedDefs suffix={id} />
      <defs>
        <radialGradient id={coronaGrad} cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor={palette.nucleusCore} stopOpacity={0} />
          <stop offset="48%" stopColor={palette.nucleusCore} stopOpacity={0} />
          <stop offset="55%" stopColor={palette.electron} stopOpacity={0.9} />
          <stop offset="68%" stopColor={palette.boltMid} stopOpacity={0.55} />
          <stop offset="100%" stopColor={palette.nucleusDeep} stopOpacity={0} />
        </radialGradient>
      </defs>

      {/* outer aura */}
      <motion.circle
        cx="0"
        cy="0"
        r="24"
        fill={palette.auraMid}
        opacity={0.22}
        filter={F.halo}
        animate={{ scale: hovered ? [1, 1.1, 1] : [1, 1.05, 1] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "center" }}
      />

      {/* korona ışın hüzmeleri */}
      <motion.g
        animate={{ rotate: 360 }}
        transition={{ duration: hovered ? 12 : 30, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "center" }}
      >
        {rays.map((deg, i) => (
          <motion.line
            key={i}
            x1="0"
            y1="0"
            x2="0"
            y2={-22}
            transform={`rotate(${deg})`}
            stroke={palette.boltBright}
            strokeWidth={i % 2 === 0 ? 0.5 : 0.3}
            strokeLinecap="round"
            opacity={i % 2 === 0 ? 0.5 : 0.3}
            animate={{ opacity: [0.2, i % 2 === 0 ? 0.7 : 0.4, 0.2] }}
            transition={{
              duration: 1.8 + (i % 3) * 0.3,
              repeat: Infinity,
              delay: i * 0.08,
            }}
          />
        ))}
      </motion.g>

      {/* korona halkası */}
      <motion.circle
        cx="0"
        cy="0"
        r="16"
        fill={`url(#${coronaGrad})`}
        filter={F.glow}
        animate={{ scale: [1, 1.04, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "center" }}
      />

      {/* dark moon disk */}
      <circle
        cx="0"
        cy="0"
        r="11"
        fill={palette.auraOuter}
        stroke={palette.electron}
        strokeWidth={0.4}
        strokeOpacity={0.7}
        filter={F.soft}
      />
      {/* iç gölge tonlaması */}
      <circle cx="-2" cy="-2" r="9" fill="#000" opacity={0.4} />
    </svg>
  );
}
