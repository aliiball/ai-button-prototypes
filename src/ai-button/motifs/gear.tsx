import { useId } from "react";
import { motion } from "framer-motion";
import { SharedDefs, filterIds } from "../shared/filters";
import type { MotifProps } from "../shared/types";

/**
 * Dişli (gear) — dönen mekanik çark + ortada AI sparkle. Agent / mekanik.
 */
export function GearMotif({ palette, hovered }: MotifProps) {
  const id = useId().replace(/:/g, "");
  const F = filterIds(id);
  const bodyGrad = `gr-${id}`;
  const sparkGrad = `gr-s-${id}`;

  // dişlerle gear gövdesi — 8 diş, dış r=18, iç r=13
  const buildGear = () => {
    const teeth = 8;
    const outer = 18;
    const inner = 13;
    const toothWidthRatio = 0.55;
    let p = "";
    for (let i = 0; i < teeth; i++) {
      const baseAngle = (i / teeth) * Math.PI * 2;
      const half = ((Math.PI * 2) / teeth) * 0.5;
      const tipHalf = half * toothWidthRatio;
      // 4 nokta: tabandan tabana
      const a1 = baseAngle - half;
      const a2 = baseAngle - tipHalf;
      const a3 = baseAngle + tipHalf;
      const a4 = baseAngle + half;
      const pts = [
        [inner * Math.cos(a1), inner * Math.sin(a1)],
        [outer * Math.cos(a2), outer * Math.sin(a2)],
        [outer * Math.cos(a3), outer * Math.sin(a3)],
        [inner * Math.cos(a4), inner * Math.sin(a4)],
      ];
      pts.forEach((pt, j) => {
        p += (i === 0 && j === 0 ? "M" : "L") + pt[0].toFixed(2) + "," + pt[1].toFixed(2);
      });
    }
    return p + " Z";
  };

  const gearPath = buildGear();
  const star = (s: number) =>
    `M0,${-s} C${s * 0.18},${-s * 0.18} ${s * 0.18},${-s * 0.18} ${s},0 C${s * 0.18},${s * 0.18} ${s * 0.18},${s * 0.18} 0,${s} C${-s * 0.18},${s * 0.18} ${-s * 0.18},${s * 0.18} ${-s},0 C${-s * 0.18},${-s * 0.18} ${-s * 0.18},${-s * 0.18} 0,${-s} Z`;

  return (
    <svg viewBox="-30 -30 60 60" aria-hidden width="100%" height="100%">
      <SharedDefs suffix={id} />
      <defs>
        <radialGradient id={bodyGrad} cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor={palette.nucleusMid} />
          <stop offset="100%" stopColor={palette.nucleusDeep} />
        </radialGradient>
        <radialGradient id={sparkGrad}>
          <stop offset="0%" stopColor={palette.nucleusCore} />
          <stop offset="60%" stopColor={palette.electron} />
          <stop offset="100%" stopColor={palette.nucleusDeep} />
        </radialGradient>
      </defs>

      {/* aura */}
      <circle cx="0" cy="0" r="22" fill={palette.auraMid} opacity={0.18} filter={F.halo} />

      <motion.g
        animate={{ rotate: 360 }}
        transition={{ duration: hovered ? 4 : 11, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "center" }}
      >
        {/* gear gövdesi */}
        <path
          d={gearPath}
          fill={`url(#${bodyGrad})`}
          stroke={palette.orbitHighlight}
          strokeWidth={0.5}
          filter={F.glow}
        />

        {/* iç çember — bearing hole */}
        <circle cx="0" cy="0" r="7" fill={palette.auraOuter} stroke={palette.orbitMid} strokeWidth={0.5} />

        {/* 4 vida — dekoratif */}
        {[0, 90, 180, 270].map((deg) => {
          const a = (deg * Math.PI) / 180;
          return (
            <circle
              key={deg}
              cx={Math.cos(a) * 10}
              cy={Math.sin(a) * 10}
              r="0.9"
              fill={palette.boltBright}
              opacity={0.7}
            />
          );
        })}
      </motion.g>

      {/* ortada sabit (dönmüyor) AI sparkle */}
      <motion.path
        d={star(5)}
        fill={`url(#${sparkGrad})`}
        stroke={palette.orbitHighlight}
        strokeWidth={0.3}
        filter={F.glow}
        animate={{ rotate: hovered ? 360 : 180, scale: [0.9, 1.15, 0.9] }}
        transition={{
          rotate: { duration: hovered ? 3 : 8, repeat: Infinity, ease: "linear" },
          scale: { duration: 1.6, repeat: Infinity, ease: "easeInOut" },
        }}
        style={{ transformOrigin: "center" }}
      />
    </svg>
  );
}
