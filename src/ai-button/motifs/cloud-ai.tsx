import { useId } from "react";
import { motion } from "framer-motion";
import { SharedDefs, filterIds } from "../shared/filters";
import type { MotifProps } from "../shared/types";

/**
 * Bulut AI — yumuşak bulut silueti + içinde twinkle sparkle'lar.
 */
export function CloudAiMotif({ palette, hovered }: MotifProps) {
  const id = useId().replace(/:/g, "");
  const F = filterIds(id);
  const cloudGrad = `cl-${id}`;

  // bulut path — 4 üst üste binmiş yuvarlak + alt düz
  const cloud = "M-18,4 C-22,4 -22,-4 -16,-5 C-16,-12 -6,-14 -2,-9 C2,-15 14,-12 14,-4 C20,-5 22,4 16,4 Z";

  const star = (s: number) =>
    `M0,${-s} C${s * 0.18},${-s * 0.18} ${s * 0.18},${-s * 0.18} ${s},0 C${s * 0.18},${s * 0.18} ${s * 0.18},${s * 0.18} 0,${s} C${-s * 0.18},${s * 0.18} ${-s * 0.18},${s * 0.18} ${-s},0 C${-s * 0.18},${-s * 0.18} ${-s * 0.18},${-s * 0.18} 0,${-s} Z`;

  return (
    <svg viewBox="-30 -30 60 60" aria-hidden width="100%" height="100%">
      <SharedDefs suffix={id} />
      <defs>
        <linearGradient id={cloudGrad} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={palette.nucleusCore} />
          <stop offset="60%" stopColor={palette.nucleusMid} />
          <stop offset="100%" stopColor={palette.nucleusDeep} />
        </linearGradient>
      </defs>

      {/* aura */}
      <ellipse cx="0" cy="0" rx="22" ry="14" fill={palette.auraMid} opacity={0.18} filter={F.halo} />

      {/* bulut gövdesi */}
      <motion.path
        d={cloud}
        fill={`url(#${cloudGrad})`}
        stroke={palette.orbitHighlight}
        strokeWidth={0.4}
        strokeOpacity={0.7}
        filter={F.glow}
        animate={{ x: hovered ? [-1.5, 1.5, -1.5] : [-0.6, 0.6, -0.6] }}
        transition={{ duration: hovered ? 1.4 : 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* iç parlaklık — bulutun ön yüzünde sheen */}
      <ellipse cx="-4" cy="-7" rx="8" ry="3" transform="rotate(-15 -4 -7)" fill={palette.nucleusCore} opacity={0.5} filter={F.soft} />

      {/* sparkle'lar — bulutun üstü/içi */}
      <motion.path
        d={star(3.4)}
        transform="translate(-2, -4)"
        fill={palette.boltBright}
        filter={F.glow}
        animate={{ scale: hovered ? [0.8, 1.3, 0.8] : [0.85, 1.1, 0.85], rotate: 360 }}
        transition={{
          scale: { duration: 1.6, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: hovered ? 5 : 12, repeat: Infinity, ease: "linear" },
        }}
        style={{ transformOrigin: "-2px -4px" }}
      />
      <motion.path
        d={star(2)}
        transform="translate(7, -10)"
        fill={palette.electron}
        filter={F.soft}
        animate={{ scale: [0.7, 1.2, 0.7], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.4, repeat: Infinity, delay: 0.4 }}
        style={{ transformOrigin: "7px -10px" }}
      />
      <motion.path
        d={star(1.6)}
        transform="translate(-10, -2)"
        fill={palette.nucleusCore}
        filter={F.soft}
        animate={{ scale: [0.7, 1.2, 0.7], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.8, repeat: Infinity, delay: 0.7 }}
        style={{ transformOrigin: "-10px -2px" }}
      />
    </svg>
  );
}
