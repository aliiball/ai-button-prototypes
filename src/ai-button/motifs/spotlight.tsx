import { useId } from "react";
import { motion } from "framer-motion";
import { SharedDefs, filterIds } from "../shared/filters";
import type { MotifProps } from "../shared/types";

/**
 * Diyagonal spotlight ışını + içinde dans eden toz parçacıkları.
 */
export function SpotlightMotif({ palette, hovered }: MotifProps) {
  const id = useId().replace(/:/g, "");
  const F = filterIds(id);
  const beamGrad = `sp-b-${id}`;
  const sourceGrad = `sp-s-${id}`;

  // koniformat beam — sol üstten sağ alta
  const beamPath = "M-19,-19 L-13,-15 L17,17 L11,21 Z";

  const dust = [
    { cx: -10, cy: -6, delay: 0 },
    { cx: -4, cy: 0, delay: 0.3 },
    { cx: 4, cy: 8, delay: 0.6 },
    { cx: 10, cy: 14, delay: 0.9 },
    { cx: -6, cy: -2, delay: 1.2 },
    { cx: 2, cy: 4, delay: 1.5 },
  ];

  return (
    <svg viewBox="-30 -30 60 60" aria-hidden width="100%" height="100%">
      <SharedDefs suffix={id} />
      <defs>
        <linearGradient id={beamGrad} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={palette.nucleusCore} stopOpacity={0.9} />
          <stop offset="30%" stopColor={palette.electron} stopOpacity={0.55} />
          <stop offset="100%" stopColor={palette.nucleusMid} stopOpacity={0} />
        </linearGradient>
        <radialGradient id={sourceGrad}>
          <stop offset="0%" stopColor={palette.nucleusCore} />
          <stop offset="100%" stopColor={palette.electron} stopOpacity={0} />
        </radialGradient>
      </defs>

      {/* ışın halo */}
      <path d={beamPath} fill={`url(#${beamGrad})`} filter={F.halo} opacity={0.55} />

      {/* ana beam */}
      <motion.path
        d={beamPath}
        fill={`url(#${beamGrad})`}
        filter={F.soft}
        animate={{ opacity: hovered ? [0.75, 1, 0.75] : [0.65, 0.9, 0.65] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* dust partikülleri */}
      {dust.map((d, i) => (
        <motion.circle
          key={i}
          cx={d.cx}
          cy={d.cy}
          r="0.9"
          fill={palette.nucleusCore}
          opacity={0.85}
          filter={F.glow}
          animate={{
            cx: [d.cx, d.cx + 4, d.cx - 2, d.cx],
            cy: [d.cy, d.cy - 3, d.cy + 2, d.cy],
            opacity: [0.4, 1, 0.4],
          }}
          transition={{
            duration: hovered ? 1.6 : 2.8,
            repeat: Infinity,
            delay: d.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* kaynak — sol üstte parlak nokta */}
      <circle cx="-19" cy="-19" r="6" fill={`url(#${sourceGrad})`} />
      <circle cx="-19" cy="-19" r="2.2" fill={palette.nucleusCore} filter={F.glow} />

      {/* ışıkla aydınlanan yer — sağ altta küçük halka */}
      <ellipse cx="14" cy="19" rx="4.5" ry="1.6" fill={palette.boltBright} opacity={0.5} filter={F.glow} />
    </svg>
  );
}
