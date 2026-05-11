import { useId } from "react";
import { motion } from "framer-motion";
import { SharedDefs, filterIds } from "../shared/filters";
import type { MotifProps } from "../shared/types";

/**
 * 3-loop matematik düğümü (trefoil). Parametrik knot eğrisi + gradient stroke.
 */
export function TrefoilKnotMotif({ palette, hovered }: MotifProps) {
  const id = useId().replace(/:/g, "");
  const F = filterIds(id);
  const grad = `tk-${id}`;

  // (2,3)-torus knot parametric: x=(2+cos(3t))cos(2t), y=(2+cos(3t))sin(2t)
  const buildKnot = () => {
    const N = 100;
    const scale = 7.5;
    let p = "";
    for (let i = 0; i <= N; i++) {
      const t = (i / N) * 2 * Math.PI;
      const r = 2 + Math.cos(3 * t);
      const x = r * Math.cos(2 * t) * scale * 0.66;
      const y = r * Math.sin(2 * t) * scale * 0.66;
      p += (i === 0 ? "M" : "L") + x.toFixed(2) + "," + y.toFixed(2);
    }
    return p + " Z";
  };
  const knotPath = buildKnot();

  return (
    <svg viewBox="-30 -30 60 60" aria-hidden width="100%" height="100%">
      <SharedDefs suffix={id} />
      <defs>
        <linearGradient id={grad} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={palette.boltMid} />
          <stop offset="50%" stopColor={palette.electron} />
          <stop offset="100%" stopColor={palette.nucleusMid} />
        </linearGradient>
      </defs>

      {/* aura */}
      <circle cx="0" cy="0" r="22" fill={palette.auraMid} opacity={0.16} filter={F.halo} />

      <motion.g
        animate={{ rotate: 360 }}
        transition={{ duration: hovered ? 8 : 22, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "center" }}
      >
        {/* deep back halo */}
        <path d={knotPath} fill="none" stroke={palette.orbitDeep} strokeWidth={6} strokeLinejoin="round" opacity={0.5} filter={F.halo} />
        {/* gradient mid */}
        <path d={knotPath} fill="none" stroke={`url(#${grad})`} strokeWidth={2.6} strokeLinejoin="round" filter={F.glow} />
        {/* bright thin top */}
        <path d={knotPath} fill="none" stroke={palette.orbitHighlight} strokeWidth={0.6} strokeLinejoin="round" />
      </motion.g>

      {/* merkez nokta */}
      <circle cx="0" cy="0" r="1.4" fill={palette.nucleusCore} filter={F.glow} />
    </svg>
  );
}
