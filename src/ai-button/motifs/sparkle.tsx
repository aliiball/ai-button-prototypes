import { useId } from "react";
import { motion } from "framer-motion";
import { SharedDefs, filterIds } from "../shared/filters";
import type { MotifProps } from "../shared/types";

/**
 * 4-köşeli AI yıldızı (Anthropic/Gemini stilinde).
 * Ana yıldız ortada, iki küçük yıldız zıt köşelerde.
 */
export function SparkleMotif({ palette, hovered }: MotifProps) {
  const id = useId().replace(/:/g, "");
  const F = filterIds(id);
  const grad = `sp-${id}`;

  // 4-köşeli yıldız path (concave diamond)
  const star = (s: number) =>
    `M0,${-s} C${s * 0.18},${-s * 0.18} ${s * 0.18},${-s * 0.18} ${s},0 C${s * 0.18},${s * 0.18} ${s * 0.18},${s * 0.18} 0,${s} C${-s * 0.18},${s * 0.18} ${-s * 0.18},${s * 0.18} ${-s},0 C${-s * 0.18},${-s * 0.18} ${-s * 0.18},${-s * 0.18} 0,${-s} Z`;

  return (
    <svg viewBox="-30 -30 60 60" aria-hidden width="100%" height="100%">
      <SharedDefs suffix={id} />
      <defs>
        <radialGradient id={grad} cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor={palette.nucleusCore} />
          <stop offset="50%" stopColor={palette.nucleusMid} />
          <stop offset="100%" stopColor={palette.nucleusDeep} />
        </radialGradient>
      </defs>

      <motion.g
        animate={{ rotate: hovered ? 90 : 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{ transformOrigin: "center" }}
      >
        <motion.path
          d={star(22)}
          fill={`url(#${grad})`}
          stroke={palette.orbitHighlight}
          strokeWidth={0.4}
          filter={F.glow}
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "center" }}
        />
      </motion.g>

      <motion.g
        animate={{ rotate: -360 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "center" }}
      >
        <motion.path
          d={star(7)}
          fill={palette.electron}
          opacity={0.9}
          filter={F.soft}
          transform="translate(-17, -14)"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        />
        <motion.path
          d={star(5)}
          fill={palette.boltBright}
          opacity={0.85}
          filter={F.soft}
          transform="translate(16, 13)"
          animate={{ opacity: [0.4, 0.9, 0.4] }}
          transition={{ duration: 2.2, repeat: Infinity, delay: 0.6 }}
        />
      </motion.g>
    </svg>
  );
}
