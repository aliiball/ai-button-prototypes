import { useId } from "react";
import { motion } from "framer-motion";
import { SharedDefs, filterIds } from "../shared/filters";
import type { MotifProps } from "../shared/types";

/**
 * Şarkı söyleyen çanak / su damlası — offset bir noktadan asimetrik konsantrik ripple.
 */
export function SingingBowlMotif({ palette, hovered }: MotifProps) {
  const id = useId().replace(/:/g, "");
  const F = filterIds(id);
  const ringCount = 5;

  // ripple merkezi sağ-yukarıdan
  const cx = 4;
  const cy = -3;

  return (
    <svg viewBox="-30 -30 60 60" aria-hidden width="100%" height="100%">
      <SharedDefs suffix={id} />

      {/* aura — düz bir oval havuz */}
      <ellipse cx="0" cy="0" rx="26" ry="14" fill={palette.auraMid} opacity={0.16} filter={F.halo} />

      {/* alt yüzey çizgileri (havuz hissi) */}
      <ellipse cx="0" cy="0" rx="22" ry="11" fill="none" stroke={palette.orbitDeep} strokeWidth={0.4} opacity={0.5} />
      <ellipse cx="0" cy="0" rx="18" ry="8" fill="none" stroke={palette.orbitDeep} strokeWidth={0.3} opacity={0.35} />

      {/* asimetrik konsantrik ellipse ripples — merkez offset */}
      {Array.from({ length: ringCount }).map((_, i) => (
        <motion.ellipse
          key={i}
          cx={cx}
          cy={cy}
          rx="4"
          ry="2"
          fill="none"
          stroke={palette.orbitMid}
          strokeWidth={1}
          animate={{
            rx: [4, 22, 26],
            ry: [2, 12, 14],
            opacity: [0.85, 0.25, 0],
            strokeWidth: [1.3, 0.5, 0.2],
          }}
          transition={{
            duration: hovered ? 2.4 : 4,
            repeat: Infinity,
            delay: i * (hovered ? 0.55 : 0.85),
            ease: "easeOut",
          }}
        />
      ))}

      {/* merkez damla / ses kaynağı */}
      <motion.circle
        cx={cx}
        cy={cy}
        r="2.2"
        fill={palette.nucleusCore}
        filter={F.glow}
        animate={{ scale: hovered ? [1, 1.5, 1] : [1, 1.2, 1] }}
        transition={{ duration: hovered ? 1 : 1.6, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      />
      <circle cx={cx} cy={cy} r="0.9" fill={palette.boltBright} />

      {/* dalga tepesi vurgusu — uçtaki ışıltı */}
      <motion.circle
        cx={cx - 16}
        cy={cy + 2}
        r="1"
        fill={palette.electron}
        opacity={0.7}
        filter={F.soft}
        animate={{ opacity: [0.3, 0.9, 0.3] }}
        transition={{ duration: 1.8, repeat: Infinity }}
      />
    </svg>
  );
}
