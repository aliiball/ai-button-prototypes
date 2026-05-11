import { useId } from "react";
import { motion } from "framer-motion";
import { SharedDefs, filterIds } from "../shared/filters";
import type { MotifProps } from "../shared/types";

/**
 * 5 dikey çubuk, sırayla yukarı-aşağı zıplar.
 * Hover'da daha geniş + hızlı.
 */
const BARS = [
  { x: -16, h: 14 },
  { x: -8, h: 20 },
  { x: 0, h: 26 },
  { x: 8, h: 20 },
  { x: 16, h: 14 },
];

export function EqualizerMotif({ palette, hovered }: MotifProps) {
  const id = useId().replace(/:/g, "");
  const F = filterIds(id);
  const grad = `eq-${id}`;
  const dur = hovered ? 0.7 : 1.4;

  return (
    <svg viewBox="-30 -30 60 60" aria-hidden width="100%" height="100%">
      <SharedDefs suffix={id} />
      <defs>
        <linearGradient id={grad} x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor={palette.nucleusCore} />
          <stop offset="60%" stopColor={palette.nucleusMid} />
          <stop offset="100%" stopColor={palette.nucleusDeep} />
        </linearGradient>
      </defs>

      <g filter={F.glow}>
        {BARS.map((b, i) => (
          <motion.rect
            key={i}
            x={b.x - 2.5}
            width={5}
            rx={2.5}
            ry={2.5}
            fill={`url(#${grad})`}
            stroke={palette.orbitHighlight}
            strokeWidth={0.3}
            animate={{
              height: [b.h * 0.4, b.h, b.h * 0.4],
              y: [-b.h * 0.2, -b.h / 2, -b.h * 0.2],
            }}
            transition={{
              duration: dur,
              repeat: Infinity,
              delay: i * (dur / BARS.length),
              ease: "easeInOut",
            }}
          />
        ))}
      </g>

      {/* alt taban */}
      <rect
        x={-22}
        y={14}
        width={44}
        height={1.2}
        rx={0.6}
        fill={palette.orbitMid}
        opacity={0.6}
      />
    </svg>
  );
}
