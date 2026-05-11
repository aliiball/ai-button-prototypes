import { useId } from "react";
import { motion } from "framer-motion";
import { SharedDefs, filterIds } from "../shared/filters";
import type { MotifProps } from "../shared/types";

/**
 * Yazım imleci (I-beam) + yanında AI sparkle. Cursor / AI yazıyor.
 */
export function TextCursorMotif({ palette, hovered }: MotifProps) {
  const id = useId().replace(/:/g, "");
  const F = filterIds(id);
  const sparkleGrad = `tc-sp-${id}`;

  const star = (s: number) =>
    `M0,${-s} C${s * 0.18},${-s * 0.18} ${s * 0.18},${-s * 0.18} ${s},0 C${s * 0.18},${s * 0.18} ${s * 0.18},${s * 0.18} 0,${s} C${-s * 0.18},${s * 0.18} ${-s * 0.18},${s * 0.18} ${-s},0 C${-s * 0.18},${-s * 0.18} ${-s * 0.18},${-s * 0.18} 0,${-s} Z`;

  return (
    <svg viewBox="-30 -30 60 60" aria-hidden width="100%" height="100%">
      <SharedDefs suffix={id} />
      <defs>
        <radialGradient id={sparkleGrad} cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor={palette.nucleusCore} />
          <stop offset="55%" stopColor={palette.electron} />
          <stop offset="100%" stopColor={palette.nucleusDeep} />
        </radialGradient>
      </defs>

      {/* aura */}
      <circle cx="0" cy="0" r="22" fill={palette.auraMid} opacity={0.15} filter={F.halo} />

      {/* I-beam imleci */}
      <motion.g
        transform="translate(-6, 0)"
        animate={{ opacity: hovered ? [0.4, 1, 0.4] : [0.5, 1, 0.5] }}
        transition={{
          duration: hovered ? 0.6 : 1.2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* dikey çubuk */}
        <rect x="-1" y="-16" width="2" height="32" rx="1" fill={palette.orbitHighlight} filter={F.glow} />
        {/* üst serif */}
        <rect x="-5" y="-17" width="10" height="2" rx="1" fill={palette.orbitHighlight} />
        {/* alt serif */}
        <rect x="-5" y="15" width="10" height="2" rx="1" fill={palette.orbitHighlight} />
      </motion.g>

      {/* sağ üstte AI sparkle */}
      <motion.g
        transform="translate(11, -10)"
        animate={{ rotate: hovered ? 360 : 0 }}
        transition={{ duration: hovered ? 3 : 8, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "11px -10px" }}
      >
        <motion.path
          d={star(7)}
          fill={`url(#${sparkleGrad})`}
          stroke={palette.orbitHighlight}
          strokeWidth={0.3}
          filter={F.glow}
          animate={{ scale: [0.9, 1.15, 0.9] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "center" }}
        />
      </motion.g>

      {/* tip noktaları (yazılıyor hissi) */}
      {[6, 10, 14].map((cx, i) => (
        <motion.circle
          key={cx}
          cx={cx}
          cy={6}
          r="1.2"
          fill={palette.electron}
          opacity={0.7}
          filter={F.soft}
          animate={{ opacity: [0, 0.9, 0] }}
          transition={{
            duration: hovered ? 0.9 : 1.6,
            repeat: Infinity,
            delay: i * 0.25,
          }}
        />
      ))}
    </svg>
  );
}
