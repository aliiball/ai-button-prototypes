import { useId } from "react";
import { motion } from "framer-motion";
import { SharedDefs, filterIds } from "../shared/filters";
import type { MotifProps } from "../shared/types";

/**
 * Sohbet balonu + içinde 3 typing dot ve küçük bir sparkle.
 * AI chat kanonu.
 */
export function ChatBubbleMotif({ palette, hovered }: MotifProps) {
  const id = useId().replace(/:/g, "");
  const F = filterIds(id);
  const bubGrad = `cb-${id}`;
  const dur = hovered ? 0.7 : 1.4;

  // balon yolu: yuvarlak köşeli dikdörtgen + sol-alt köşeden çıkan kuyruk
  const bubble =
    "M-20,-15 C-23,-15 -23,-12 -23,-9 L-23,3 C-23,6 -20,8 -17,8 L-12,8 L-16,16 L-6,8 L18,8 C21,8 23,6 23,3 L23,-9 C23,-12 21,-15 18,-15 Z";

  return (
    <svg viewBox="-30 -30 60 60" aria-hidden width="100%" height="100%">
      <SharedDefs suffix={id} />
      <defs>
        <linearGradient id={bubGrad} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={palette.nucleusMid} />
          <stop offset="100%" stopColor={palette.nucleusDeep} />
        </linearGradient>
      </defs>

      {/* balon */}
      <motion.path
        d={bubble}
        fill={`url(#${bubGrad})`}
        stroke={palette.orbitHighlight}
        strokeWidth={0.6}
        filter={F.depth}
        animate={{ scale: hovered ? 1.05 : [1, 1.02, 1] }}
        transition={{ duration: 2.4, repeat: Infinity }}
        style={{ transformOrigin: "center" }}
      />

      {/* sparkle (sol-üstte) */}
      <g transform="translate(-12, -7)">
        <motion.path
          d="M0,-3 L0.8,-0.8 L3,0 L0.8,0.8 L0,3 L-0.8,0.8 L-3,0 L-0.8,-0.8 Z"
          fill={palette.nucleusCore}
          filter={F.glow}
          animate={{ rotate: 360, scale: [0.9, 1.1, 0.9] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "center" }}
        />
      </g>

      {/* 3 typing dot */}
      {[-4, 2, 8].map((cx, i) => (
        <motion.circle
          key={i}
          cx={cx}
          cy={-3}
          r={2}
          fill={palette.nucleusCore}
          filter={F.soft}
          animate={{ opacity: [0.3, 1, 0.3], cy: [-2, -5, -2] }}
          transition={{
            duration: dur,
            repeat: Infinity,
            delay: i * (dur / 3),
            ease: "easeInOut",
          }}
        />
      ))}
    </svg>
  );
}
