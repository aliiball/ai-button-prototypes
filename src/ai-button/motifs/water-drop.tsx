import { useId } from "react";
import { motion } from "framer-motion";
import { SharedDefs, filterIds } from "../shared/filters";
import type { MotifProps } from "../shared/types";

/**
 * Su damlası — düşen damla + çarpma anında ripple halkaları.
 */
export function WaterDropMotif({ palette, hovered }: MotifProps) {
  const id = useId().replace(/:/g, "");
  const F = filterIds(id);
  const dropGrad = `wd-${id}`;
  const dur = hovered ? 1.6 : 2.6;

  // klasik damla şekli (gözyaşı)
  const drop = "M0,-10 C-4,-4 -7,0 -7,5 C-7,9 -3,11 0,11 C3,11 7,9 7,5 C7,0 4,-4 0,-10 Z";

  return (
    <svg viewBox="-30 -30 60 60" aria-hidden width="100%" height="100%">
      <SharedDefs suffix={id} />
      <defs>
        <radialGradient id={dropGrad} cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor={palette.nucleusCore} />
          <stop offset="55%" stopColor={palette.electron} />
          <stop offset="100%" stopColor={palette.nucleusDeep} />
        </radialGradient>
      </defs>

      {/* aura */}
      <ellipse cx="0" cy="6" rx="22" ry="10" fill={palette.auraMid} opacity={0.16} filter={F.halo} />

      {/* alt yüzey (su) */}
      <ellipse cx="0" cy="18" rx="20" ry="2" fill={palette.orbitDeep} opacity={0.5} />

      {/* ripple halkaları — çarpma anında genleşir */}
      {[0, 1, 2].map((i) => (
        <motion.ellipse
          key={i}
          cx="0"
          cy="18"
          rx="4"
          ry="1"
          fill="none"
          stroke={palette.electron}
          strokeWidth={1.2}
          animate={{
            rx: [4, 22, 24],
            ry: [1, 3.5, 4],
            opacity: [0, 0.85, 0],
            strokeWidth: [1.6, 0.6, 0.2],
          }}
          transition={{
            duration: dur,
            repeat: Infinity,
            delay: i * (dur / 3),
            ease: "easeOut",
            times: [0, 0.4, 1],
          }}
          filter={F.soft}
        />
      ))}

      {/* damla — yukarıdan aşağı düşüyor */}
      <motion.g
        animate={{ y: [-22, 6, -22], opacity: [1, 0, 1] }}
        transition={{
          duration: dur,
          repeat: Infinity,
          ease: ["easeIn", "linear"],
          times: [0, 0.55, 1],
        }}
      >
        <path
          d={drop}
          fill={`url(#${dropGrad})`}
          stroke={palette.orbitHighlight}
          strokeWidth={0.4}
          filter={F.glow}
        />
        {/* damla içinde highlight */}
        <ellipse cx="-2" cy="-3" rx="2" ry="3" fill={palette.nucleusCore} opacity={0.55} />
      </motion.g>

      {/* damla splash partikülleri — çarpma anında */}
      {[
        { x: -8, dx: -2, delay: 0 },
        { x: 8, dx: 2, delay: 0.2 },
        { x: -4, dx: -1, delay: 0.4 },
        { x: 4, dx: 1, delay: 0.6 },
      ].map((s, i) => (
        <motion.circle
          key={i}
          cx={s.x}
          cy={18}
          r="0.9"
          fill={palette.nucleusCore}
          opacity={0.7}
          filter={F.glow}
          animate={{
            cx: [s.x, s.x + s.dx * 4, s.x],
            cy: [18, 10, 18],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: dur,
            repeat: Infinity,
            delay: s.delay,
            ease: "easeOut",
          }}
        />
      ))}
    </svg>
  );
}
