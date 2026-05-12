import { useId } from "react";
import { motion } from "framer-motion";
import { SharedDefs, filterIds } from "../shared/filters";
import { useRafTime } from "../shared/use-raf-time";
import type { VariantProps } from "../shared/types";

const SPEED_MULT = { calm: 1.6, normal: 1, intense: 0.5 } as const;

/**
 * Vortex · Funnel — koni perspektifi. Ring'ler yukarıdan aşağıya kayar, rx daralır.
 * Bir kuyu / huni gibi.
 */
export function VortexFunnelStyle({ palette, hovered, intensity }: VariantProps) {
  const id = useId().replace(/:/g, "");
  const F = filterIds(id);
  const mult = SPEED_MULT[intensity];

  const rings = [
    { cy: -11, rx: 22, ry: 3.4, dur: 14 * mult, stroke: palette.auraMid, sw: 0.7, op: 0.45 },
    { cy: -6,  rx: 18, ry: 3.0, dur: 11 * mult, stroke: palette.orbitMid, sw: 0.75, op: 0.6 },
    { cy: -1,  rx: 14, ry: 2.6, dur: 8 * mult,  stroke: palette.boltMid, sw: 0.85, op: 0.75 },
    { cy: 4,   rx: 10, ry: 2.2, dur: 6 * mult,  stroke: palette.electron, sw: 0.95, op: 0.9 },
    { cy: 9,   rx: 6,  ry: 1.7, dur: 4 * mult,  stroke: palette.boltBright, sw: 1.1, op: 1 },
  ];

  return (
    <svg viewBox="-30 -30 60 60" aria-hidden width="100%" height="100%">
      <SharedDefs suffix={id} />

      <circle cx="0" cy="0" r="24" fill={palette.auraMid} opacity={0.13} filter={F.halo} />

      {rings.map((r, i) => (
        <motion.g
          key={i}
          animate={{ rotate: 360 }}
          transition={{ duration: hovered ? r.dur / 2.5 : r.dur, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: `0px ${r.cy}px` }}
        >
          <ellipse
            cx="0" cy={r.cy} rx={r.rx} ry={r.ry}
            fill="none" stroke={r.stroke} strokeWidth={r.sw}
            opacity={r.op} filter={i >= 3 ? F.glow : F.soft}
          />
        </motion.g>
      ))}

      {/* aşağıdaki parlak çekirdek */}
      <circle cx="0" cy="13" r="2.2" fill={palette.nucleusCore} filter={F.glow} />
    </svg>
  );
}

/**
 * Vortex · Galactic Disk — eğik düzlemde konsantrik ring'ler + dolanan parlak yıldız.
 */
export function VortexGalacticDiskStyle({ palette, hovered, intensity }: VariantProps) {
  const id = useId().replace(/:/g, "");
  const F = filterIds(id);
  const t = useRafTime();
  const period = (intensity === "calm" ? 12 : intensity === "intense" ? 3 : 6) * (hovered ? 0.55 : 1);
  const tilt = -65; // derece

  const theta = (t / period) * 2 * Math.PI;
  const orbitRx = 18;
  const orbitRy = 4.5;
  const lx = orbitRx * Math.cos(theta);
  const ly = orbitRy * Math.sin(theta);
  // tilt rotation
  const a = (tilt * Math.PI) / 180;
  const dotX = lx * Math.cos(a) - ly * Math.sin(a);
  const dotY = lx * Math.sin(a) + ly * Math.cos(a);

  const coreGrad = `vg-c-${id}`;

  return (
    <svg viewBox="-30 -30 60 60" aria-hidden width="100%" height="100%">
      <SharedDefs suffix={id} />
      <defs>
        <radialGradient id={coreGrad} cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor={palette.nucleusCore} />
          <stop offset="60%" stopColor={palette.nucleusMid} />
          <stop offset="100%" stopColor={palette.nucleusDeep} stopOpacity={0} />
        </radialGradient>
      </defs>

      <circle cx="0" cy="0" r="24" fill={palette.auraMid} opacity={0.14} filter={F.halo} />

      <g transform={`rotate(${tilt})`}>
        {/* konsantrik eğik ring'ler */}
        {[
          { rx: 22, ry: 5.5, sw: 0.6, op: 0.4, stroke: palette.auraMid },
          { rx: 18, ry: 4.5, sw: 0.75, op: 0.6, stroke: palette.orbitMid },
          { rx: 14, ry: 3.6, sw: 0.85, op: 0.75, stroke: palette.boltMid },
          { rx: 10, ry: 2.6, sw: 0.95, op: 0.9, stroke: palette.electron },
          { rx: 6, ry: 1.6, sw: 1.1, op: 1, stroke: palette.boltBright },
        ].map((r, i) => (
          <ellipse
            key={i} cx="0" cy="0" rx={r.rx} ry={r.ry}
            fill="none" stroke={r.stroke} strokeWidth={r.sw}
            opacity={r.op} filter={i >= 3 ? F.glow : F.soft}
          />
        ))}
      </g>

      {/* dolanan parlak yıldız (eğik orbit üstünde) */}
      <circle cx={dotX} cy={dotY} r={1.8} fill={palette.boltBright} filter={F.glow} />

      {/* merkez gradient çekirdek */}
      <circle cx="0" cy="0" r="6" fill={`url(#${coreGrad})`} filter={F.glow} />
      <circle cx="0" cy="0" r="1.6" fill={palette.nucleusCore} />
    </svg>
  );
}
