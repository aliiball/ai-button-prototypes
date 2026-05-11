import { useId } from "react";
import { motion } from "framer-motion";
import { SharedDefs, filterIds } from "../shared/filters";
import type { MotifProps } from "../shared/types";

/**
 * 3D dönen oktahedron — 4 görünür yüz (polygon) + edge highlights.
 * scaleX cycle ile 3D rotasyon yanılsaması.
 */
export function PolyhedronMotif({ palette, hovered }: MotifProps) {
  const id = useId().replace(/:/g, "");
  const F = filterIds(id);
  const lightFace = `pl-light-${id}`;
  const darkFace = `pl-dark-${id}`;

  return (
    <svg viewBox="-30 -30 60 60" aria-hidden width="100%" height="100%">
      <SharedDefs suffix={id} />
      <defs>
        <linearGradient id={lightFace} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={palette.nucleusCore} />
          <stop offset="100%" stopColor={palette.nucleusMid} />
        </linearGradient>
        <linearGradient id={darkFace} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={palette.nucleusMid} />
          <stop offset="100%" stopColor={palette.nucleusDeep} />
        </linearGradient>
      </defs>

      {/* aura backing */}
      <motion.circle
        cx="0"
        cy="0"
        r="20"
        fill={palette.auraMid}
        opacity={0.18}
        filter={F.halo}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "center" }}
      />

      <motion.g
        animate={{ rotate: 360 }}
        transition={{
          duration: hovered ? 4 : 14,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{ transformOrigin: "center" }}
      >
        <motion.g
          animate={{ scaleX: [1, 0.25, 1, 0.25, 1] }}
          transition={{
            duration: hovered ? 1.8 : 4.2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ transformOrigin: "center" }}
        >
          {/* 4 görünür yüz: top-left, top-right, bottom-left, bottom-right */}
          <polygon
            points="0,-20 -18,0 0,0"
            fill={`url(#${lightFace})`}
            stroke={palette.orbitHighlight}
            strokeWidth={0.5}
          />
          <polygon
            points="0,-20 18,0 0,0"
            fill={`url(#${darkFace})`}
            stroke={palette.orbitHighlight}
            strokeWidth={0.5}
          />
          <polygon
            points="-18,0 0,0 0,20"
            fill={`url(#${darkFace})`}
            stroke={palette.orbitHighlight}
            strokeWidth={0.5}
          />
          <polygon
            points="0,0 18,0 0,20"
            fill={`url(#${lightFace})`}
            stroke={palette.orbitHighlight}
            strokeWidth={0.5}
          />

          {/* hot edges */}
          <line
            x1="0"
            y1="-20"
            x2="0"
            y2="20"
            stroke={palette.boltBright}
            strokeWidth={0.5}
            opacity={0.9}
            filter={F.glow}
          />
          <line
            x1="-18"
            y1="0"
            x2="18"
            y2="0"
            stroke={palette.boltBright}
            strokeWidth={0.5}
            opacity={0.9}
            filter={F.glow}
          />
        </motion.g>
      </motion.g>

      {/* core hot dot */}
      <circle
        cx="0"
        cy="0"
        r="1.6"
        fill={palette.nucleusCore}
        filter={F.glow}
      />
    </svg>
  );
}
