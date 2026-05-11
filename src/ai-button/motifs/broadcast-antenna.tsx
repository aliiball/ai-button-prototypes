import { useId } from "react";
import { motion } from "framer-motion";
import { SharedDefs, filterIds } from "../shared/filters";
import type { MotifProps } from "../shared/types";

/**
 * Yayın anteni — alttan üçgen kule + tepeden radyal dalgalar.
 */
export function BroadcastAntennaMotif({ palette, hovered }: MotifProps) {
  const id = useId().replace(/:/g, "");
  const F = filterIds(id);

  // anten tepe konumu
  const tipX = 0;
  const tipY = -10;
  const waveCount = 3;

  return (
    <svg viewBox="-30 -30 60 60" aria-hidden width="100%" height="100%">
      <SharedDefs suffix={id} />

      {/* aura */}
      <circle cx={tipX} cy={tipY} r="22" fill={palette.auraMid} opacity={0.18} filter={F.halo} />

      {/* anten kulesi — alttan tepeye üçgen */}
      <polygon
        points={`${tipX},${tipY} ${tipX - 7},${20} ${tipX + 7},${20}`}
        fill="none"
        stroke={palette.orbitMid}
        strokeWidth={0.8}
      />
      {/* kule iç destek çizgileri */}
      <line x1={tipX} y1={tipY} x2={tipX} y2={20} stroke={palette.orbitMid} strokeWidth={0.5} />
      <line x1={tipX - 5} y1={10} x2={tipX + 5} y2={10} stroke={palette.orbitMid} strokeWidth={0.5} />
      <line x1={tipX - 3} y1={2} x2={tipX + 3} y2={2} stroke={palette.orbitMid} strokeWidth={0.5} />
      <line x1={tipX - 1.5} y1={-5} x2={tipX + 1.5} y2={-5} stroke={palette.orbitMid} strokeWidth={0.5} />

      {/* anten ucu — parlak nokta */}
      <motion.circle
        cx={tipX}
        cy={tipY}
        r="2.2"
        fill={palette.nucleusCore}
        filter={F.glow}
        animate={{ scale: hovered ? [1, 1.4, 1] : [1, 1.2, 1] }}
        transition={{ duration: hovered ? 0.6 : 1.2, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: `${tipX}px ${tipY}px` }}
      />

      {/* radyal dalgalar — tepeden dışa, sadece üst yarımdan */}
      {Array.from({ length: waveCount }).map((_, i) => (
        <motion.path
          key={i}
          d={`M${tipX - 14},${tipY} A 14 14 0 0 1 ${tipX + 14},${tipY}`}
          fill="none"
          stroke={palette.electron}
          strokeWidth={1.4}
          strokeLinecap="round"
          animate={{
            opacity: [0, 0.9, 0],
            scale: [0.4, 1.5, 1.8],
          }}
          transition={{
            duration: hovered ? 1.6 : 2.6,
            repeat: Infinity,
            delay: i * (hovered ? 0.45 : 0.75),
            ease: "easeOut",
          }}
          style={{ transformOrigin: `${tipX}px ${tipY}px` }}
          filter={F.soft}
        />
      ))}

      {/* yan parlak dot'lar — sinyal partikülleri */}
      {[
        { x: -16, y: tipY + 3, delay: 0 },
        { x: 16, y: tipY + 3, delay: 0.4 },
        { x: -10, y: tipY - 6, delay: 0.8 },
        { x: 10, y: tipY - 6, delay: 1.2 },
      ].map((p, i) => (
        <motion.circle
          key={i}
          cx={p.x}
          cy={p.y}
          r="0.9"
          fill={palette.boltBright}
          filter={F.glow}
          animate={{ opacity: [0, 0.95, 0], scale: [0.5, 1.2, 0.5] }}
          transition={{
            duration: hovered ? 1.2 : 2,
            repeat: Infinity,
            delay: p.delay,
          }}
        />
      ))}
    </svg>
  );
}
