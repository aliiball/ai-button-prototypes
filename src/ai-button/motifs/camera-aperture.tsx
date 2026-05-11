import { useId } from "react";
import { motion } from "framer-motion";
import { SharedDefs, filterIds } from "../shared/filters";
import type { MotifProps } from "../shared/types";

/**
 * Kamera diyaframı — 6 yaprak açılıp kapanır. Mekanik sci-fi.
 */
export function CameraApertureMotif({ palette, hovered }: MotifProps) {
  const id = useId().replace(/:/g, "");
  const F = filterIds(id);
  const leafGrad = `ap-${id}`;

  // Tek bir yaprak — dış uçtan merkeze doğru daralan üçgen-ish polygon
  const leaf = "M0,-19 L9,-12 L4,3 L-1,3 L-6,-12 Z";

  return (
    <svg viewBox="-30 -30 60 60" aria-hidden width="100%" height="100%">
      <SharedDefs suffix={id} />
      <defs>
        <linearGradient id={leafGrad} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={palette.nucleusMid} />
          <stop offset="100%" stopColor={palette.nucleusDeep} />
        </linearGradient>
      </defs>

      {/* aura backing */}
      <circle cx="0" cy="0" r="22" fill={palette.auraMid} opacity={0.15} filter={F.halo} />

      {/* dış halka */}
      <circle cx="0" cy="0" r="20" fill="none" stroke={palette.orbitMid} strokeWidth={1} opacity={0.7} />
      <circle cx="0" cy="0" r="20" fill="none" stroke={palette.orbitHighlight} strokeWidth={0.3} opacity={0.9} />

      <motion.g
        animate={{ rotate: hovered ? 30 : 0 }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
        style={{ transformOrigin: "center" }}
      >
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <motion.g
            key={deg}
            transform={`rotate(${deg})`}
            animate={{ scale: hovered ? 0.5 : 1 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            style={{ transformOrigin: "center" }}
          >
            <path
              d={leaf}
              fill={`url(#${leafGrad})`}
              stroke={palette.orbitHighlight}
              strokeWidth={0.3}
              filter={F.soft}
            />
          </motion.g>
        ))}
      </motion.g>

      {/* merkez parlak nokta — diyafram açık olduğunda görünür */}
      <motion.circle
        cx="0"
        cy="0"
        r="3"
        fill={palette.boltBright}
        filter={F.glow}
        animate={{
          scale: hovered ? [1, 2.4, 1] : [1, 1.2, 1],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "center" }}
      />
    </svg>
  );
}
