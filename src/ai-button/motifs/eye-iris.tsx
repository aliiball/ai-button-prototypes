import { useId } from "react";
import { motion } from "framer-motion";
import { SharedDefs, filterIds } from "../shared/filters";
import type { MotifProps } from "../shared/types";

/**
 * Açılıp kapanan iris. Hover'da pupille büyür ve dik bakar.
 */
export function EyeIrisMotif({ palette, hovered }: MotifProps) {
  const id = useId().replace(/:/g, "");
  const F = filterIds(id);
  const irisGrad = `ir-${id}`;
  const lashGrad = `ls-${id}`;

  return (
    <svg viewBox="-30 -30 60 60" aria-hidden width="100%" height="100%">
      <SharedDefs suffix={id} />
      <defs>
        <radialGradient id={irisGrad} cx="40%" cy="35%" r="70%">
          <stop offset="0%" stopColor={palette.auraInner} />
          <stop offset="50%" stopColor={palette.nucleusMid} />
          <stop offset="100%" stopColor={palette.nucleusDeep} />
        </radialGradient>
        <linearGradient id={lashGrad} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={palette.orbitHighlight} stopOpacity="0" />
          <stop offset="100%" stopColor={palette.orbitHighlight} stopOpacity="0.9" />
        </linearGradient>
        <clipPath id={`clip-${id}`}>
          <path d="M-22,0 Q0,-14 22,0 Q0,14 -22,0 Z" />
        </clipPath>
      </defs>

      {/* göz kapağı / outline */}
      <motion.path
        d="M-22,0 Q0,-14 22,0 Q0,14 -22,0 Z"
        fill={palette.nucleusDeep}
        opacity={0.4}
        animate={{
          // hover'da göz tam açık, idle'da hafif kıpır
          scaleY: hovered ? 1.05 : [1, 0.92, 1],
        }}
        transition={{ duration: hovered ? 0.3 : 3.6, repeat: hovered ? 0 : Infinity }}
        style={{ transformOrigin: "center" }}
      />

      <g clipPath={`url(#clip-${id})`}>
        {/* iris */}
        <motion.circle
          cx="0"
          cy="0"
          r="9"
          fill={`url(#${irisGrad})`}
          filter={F.glow}
          animate={{ scale: hovered ? 1.15 : [1, 1.04, 1] }}
          transition={{
            duration: hovered ? 0.4 : 2.6,
            repeat: hovered ? 0 : Infinity,
            ease: "easeInOut",
          }}
          style={{ transformOrigin: "center" }}
        />
        {/* iris desen */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
          <line
            key={deg}
            x1="0"
            y1="-9"
            x2="0"
            y2="-3"
            stroke={palette.orbitHighlight}
            strokeWidth={0.5}
            opacity={0.65}
            transform={`rotate(${deg})`}
          />
        ))}
        {/* pupil */}
        <motion.circle
          cx="0"
          cy="0"
          r={hovered ? 3 : 4.2}
          fill={palette.nucleusDeep}
          animate={{ r: hovered ? 3 : [4.2, 3.5, 4.2] }}
          transition={{ duration: 2.6, repeat: Infinity }}
        />
        {/* parıltı */}
        <circle cx="-2.6" cy="-2.6" r="1.4" fill={palette.nucleusCore} />
      </g>

      {/* üst kirpik vurgusu */}
      <path
        d="M-22,0 Q0,-14 22,0"
        fill="none"
        stroke={`url(#${lashGrad})`}
        strokeWidth={1.2}
        opacity={0.8}
      />
    </svg>
  );
}
