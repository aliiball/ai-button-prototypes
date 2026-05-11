import { useId } from "react";
import { motion } from "framer-motion";
import { SharedDefs, filterIds } from "../shared/filters";
import type { MotifProps } from "../shared/types";

/**
 * Stilize Mandelbrot silueti + iridescent katmanlı kontur halkaları.
 * Periyodik "zoom in/out" hissi için scale animasyonu.
 */
export function MandelbrotMotif({ palette, hovered }: MotifProps) {
  const id = useId().replace(/:/g, "");
  const F = filterIds(id);
  const bodyGrad = `mb-${id}`;

  // İkonik Mandelbrot kardiyoid + lob silueti (stilize)
  // Ana cardioid: r = (1 - cos θ) ölçeklenmiş; sol lobu (bulb): daire eklenmiş
  const buildSilhouette = () => {
    const N = 72;
    const scale = 10;
    let p = "";
    for (let i = 0; i <= N; i++) {
      const theta = (i / N) * 2 * Math.PI;
      // sağa açılan kalp eğrisi (kardiyoid): r = 1 - cos
      const r = (1 - Math.cos(theta)) * scale;
      // shift'le sağa doğru yerleştir
      const cx = r * Math.cos(theta) - 6;
      const cy = r * Math.sin(theta);
      p += (i === 0 ? "M" : "L") + cx.toFixed(2) + "," + cy.toFixed(2);
    }
    return p + " Z";
  };

  const silhouette = buildSilhouette();

  return (
    <svg viewBox="-30 -30 60 60" aria-hidden width="100%" height="100%">
      <SharedDefs suffix={id} />
      <defs>
        <radialGradient id={bodyGrad} cx="50%" cy="50%" r="80%">
          <stop offset="0%" stopColor={palette.nucleusDeep} />
          <stop offset="100%" stopColor={palette.auraOuter} />
        </radialGradient>
      </defs>

      {/* aura */}
      <circle cx="0" cy="0" r="22" fill={palette.auraMid} opacity={0.16} filter={F.halo} />

      <motion.g
        animate={{ scale: hovered ? [1, 1.25, 0.85, 1] : [1, 1.1, 0.92, 1] }}
        transition={{ duration: hovered ? 4 : 8, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "center" }}
      >
        {/* iridescent escape kontur halkaları (4 katman, dış→iç) */}
        <motion.path
          d={silhouette}
          fill="none"
          stroke={palette.boltMid}
          strokeWidth={3.6}
          opacity={0.7}
          filter={F.halo}
          animate={{ strokeWidth: [3.6, 4.4, 3.6] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
        <path d={silhouette} fill="none" stroke={palette.electron} strokeWidth={2.4} opacity={0.85} filter={F.soft} />
        <path d={silhouette} fill="none" stroke={palette.nucleusMid} strokeWidth={1.4} opacity={0.95} />
        <path d={silhouette} fill="none" stroke={palette.orbitHighlight} strokeWidth={0.5} />

        {/* iç kararması */}
        <path d={silhouette} fill={`url(#${bodyGrad})`} opacity={0.85} />

        {/* sol bulb (klasik Mandelbrot top lob) */}
        <circle cx="-15.5" cy="0" r="4.5" fill={palette.nucleusDeep} stroke={palette.electron} strokeWidth={0.7} opacity={0.85} />
        <circle cx="-15.5" cy="0" r="4.5" fill="none" stroke={palette.orbitHighlight} strokeWidth={0.3} />
      </motion.g>

      {/* merkez parlak nokta */}
      <circle cx="-6" cy="0" r="1.2" fill={palette.nucleusCore} filter={F.glow} />
    </svg>
  );
}
