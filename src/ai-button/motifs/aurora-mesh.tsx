import { useId } from "react";
import { motion } from "framer-motion";
import { SharedDefs, filterIds } from "../shared/filters";
import type { MotifProps } from "../shared/types";

/**
 * Apple Intelligence-stil aurora: 3 blurred elliptik blob + iridescent overlay.
 * Yumuşak, akan, "modern AI" merkez hissi.
 */
export function AuroraMeshMotif({ palette, hovered }: MotifProps) {
  const id = useId().replace(/:/g, "");
  const F = filterIds(id);
  const clipId = `am-clip-${id}`;
  const overlayGrad = `am-ov-${id}`;
  const blobA = `am-a-${id}`;
  const blobB = `am-b-${id}`;
  const blobC = `am-c-${id}`;

  const dur = hovered ? 4 : 7;

  return (
    <svg viewBox="-30 -30 60 60" aria-hidden width="100%" height="100%">
      <SharedDefs suffix={id} />
      <defs>
        <clipPath id={clipId}>
          <rect x="-24" y="-24" width="48" height="48" rx="12" />
        </clipPath>
        <radialGradient id={blobA} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={palette.boltMid} stopOpacity={1} />
          <stop offset="100%" stopColor={palette.boltMid} stopOpacity={0} />
        </radialGradient>
        <radialGradient id={blobB} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={palette.electron} stopOpacity={1} />
          <stop offset="100%" stopColor={palette.electron} stopOpacity={0} />
        </radialGradient>
        <radialGradient id={blobC} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={palette.nucleusMid} stopOpacity={1} />
          <stop offset="100%" stopColor={palette.nucleusMid} stopOpacity={0} />
        </radialGradient>
        <linearGradient id={overlayGrad} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={palette.boltMid} stopOpacity={0.35} />
          <stop offset="33%" stopColor={palette.electron} stopOpacity={0.3} />
          <stop offset="66%" stopColor={palette.nucleusMid} stopOpacity={0.3} />
          <stop offset="100%" stopColor={palette.auraMid} stopOpacity={0.35} />
        </linearGradient>
      </defs>

      {/* outer halo */}
      <rect
        x="-26"
        y="-26"
        width="52"
        height="52"
        rx="14"
        fill={palette.auraMid}
        opacity={0.18}
        filter={F.halo}
      />

      <g clipPath={`url(#${clipId})`}>
        {/* base dark mat — düşük opacity ki ürettiğimiz blob'lar parlasın */}
        <rect
          x="-24"
          y="-24"
          width="48"
          height="48"
          fill={palette.nucleusDeep}
          opacity={0.55}
        />

        {/* 3 blob — out-of-phase animation */}
        <motion.ellipse
          rx="20"
          ry="14"
          fill={`url(#${blobA})`}
          filter={F.halo}
          animate={{
            cx: [-10, 6, -8, -10],
            cy: [-8, 4, 6, -8],
            scale: [1, 1.15, 0.95, 1],
          }}
          transition={{ duration: dur, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.ellipse
          rx="16"
          ry="20"
          fill={`url(#${blobB})`}
          filter={F.halo}
          animate={{
            cx: [10, -8, 12, 10],
            cy: [-4, 8, 4, -4],
            scale: [1.1, 0.95, 1.15, 1.1],
          }}
          transition={{
            duration: dur * 1.2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />
        <motion.ellipse
          rx="18"
          ry="14"
          fill={`url(#${blobC})`}
          filter={F.halo}
          animate={{
            cx: [0, 8, -6, 0],
            cy: [12, -6, 8, 12],
            scale: [0.95, 1.2, 1, 0.95],
          }}
          transition={{
            duration: dur * 0.9,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />

        {/* iridescent overlay — birleştirici */}
        <rect
          x="-24"
          y="-24"
          width="48"
          height="48"
          fill={`url(#${overlayGrad})`}
          opacity={0.6}
        />

        {/* shine highlight */}
        <motion.ellipse
          cx="-8"
          cy="-12"
          rx="9"
          ry="3"
          transform="rotate(-25 -8 -12)"
          fill={palette.nucleusCore}
          opacity={0.35}
          filter={F.soft}
          animate={{ opacity: [0.25, 0.5, 0.25] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      </g>

      {/* clip kenar parlaması */}
      <rect
        x="-24"
        y="-24"
        width="48"
        height="48"
        rx="12"
        fill="none"
        stroke={palette.orbitHighlight}
        strokeWidth={0.5}
        opacity={0.4}
      />
    </svg>
  );
}
