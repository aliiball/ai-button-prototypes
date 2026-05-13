import { useId } from "react";
import { motion } from "framer-motion";
import { SharedDefs, filterIds } from "../shared/filters";
import { useRafTime } from "../shared/use-raf-time";
import type { VariantProps } from "../shared/types";
import type { VortexConfig } from "../../atelier/configs";

const SPEED_MULT = { calm: 1.6, normal: 1, intense: 0.5 } as const;

function resolveConfig(intensity: "calm" | "normal" | "intense", config?: unknown): VortexConfig {
  const def: VortexConfig = {
    ringCount: 5,
    baseRotation: 14 * SPEED_MULT[intensity],
    ringFalloff: 0.7,
    outerRx: 22,
    aspect: 5,
    centerHole: 2.2,
    auraStrength: 0.13,
    strokeWidth: 0.8,
    hoverSpeedBoost: 2.5,
    rotationDir: "cw",
  };
  return { ...def, ...(config as Partial<VortexConfig> | undefined) };
}

/**
 * Vortex · Funnel — koni perspektifi. Ring'ler yukarıdan aşağıya kayar, rx daralır.
 */
export function VortexFunnelStyle({ palette, hovered, intensity, config }: VariantProps) {
  const id = useId().replace(/:/g, "");
  const F = filterIds(id);
  const c = resolveConfig(intensity, config);
  const palette2 = [palette.auraMid, palette.orbitMid, palette.boltMid, palette.electron, palette.boltBright, palette.orbitHighlight, palette.nucleusMid];

  // funnel: rings'lerin cy değerleri yukarıdan aşağıya dağılır
  const rings = Array.from({ length: c.ringCount }, (_, i) => {
    const t = i / Math.max(c.ringCount - 1, 1);
    const cy = -11 + t * 22;
    const rx = c.outerRx - i * ((c.outerRx - 6) / Math.max(c.ringCount - 1, 1));
    const ry = rx / c.aspect;
    const dur = c.baseRotation * Math.pow(c.ringFalloff, i);
    const sw = c.strokeWidth + i * 0.07;
    const op = 0.45 + (i / Math.max(c.ringCount - 1, 1)) * 0.55;
    return { cy, rx, ry, dur, stroke: palette2[i % palette2.length], sw, op, isClose: i >= c.ringCount - 2 };
  });

  return (
    <svg viewBox="-30 -30 60 60" aria-hidden width="100%" height="100%">
      <SharedDefs suffix={id} />
      <circle cx="0" cy="0" r="24" fill={palette.auraMid} opacity={c.auraStrength} filter={F.halo} />

      {rings.map((r, i) => {
        const dirSign = c.rotationDir === "ccw" ? -1 : c.rotationDir === "alternate" ? (i % 2 === 0 ? 1 : -1) : 1;
        return (
          <motion.g
            key={i}
            animate={{ rotate: 360 * dirSign }}
            transition={{ duration: hovered ? r.dur / c.hoverSpeedBoost : r.dur, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: `0px ${r.cy}px` }}
          >
            <ellipse cx="0" cy={r.cy} rx={r.rx} ry={r.ry} fill="none" stroke={r.stroke} strokeWidth={r.sw} opacity={r.op} filter={r.isClose ? F.glow : F.soft} />
          </motion.g>
        );
      })}

      <circle cx="0" cy="13" r={c.centerHole} fill={palette.nucleusCore} filter={F.glow} />
    </svg>
  );
}

/**
 * Vortex · Galactic Disk — eğik düzlemde konsantrik ring'ler + dolanan parlak yıldız.
 */
export function VortexGalacticDiskStyle({ palette, hovered, intensity, config }: VariantProps) {
  const id = useId().replace(/:/g, "");
  const F = filterIds(id);
  const c = resolveConfig(intensity, config);
  const t = useRafTime();
  const period = c.baseRotation * (hovered ? 1 / c.hoverSpeedBoost : 1) / 2.5;
  const tilt = -65;
  const palette2 = [palette.auraMid, palette.orbitMid, palette.boltMid, palette.electron, palette.boltBright, palette.orbitHighlight, palette.nucleusMid];

  const theta = (t / Math.max(period, 0.5)) * 2 * Math.PI;
  const orbitRx = c.outerRx - 4;
  const orbitRy = orbitRx / c.aspect;
  const lx = orbitRx * Math.cos(theta);
  const ly = orbitRy * Math.sin(theta);
  const a = (tilt * Math.PI) / 180;
  const dotX = lx * Math.cos(a) - ly * Math.sin(a);
  const dotY = lx * Math.sin(a) + ly * Math.cos(a);

  const rings = Array.from({ length: c.ringCount }, (_, i) => {
    const rx = c.outerRx - i * ((c.outerRx - 6) / Math.max(c.ringCount - 1, 1));
    const ry = rx / c.aspect;
    const sw = c.strokeWidth + i * 0.08;
    const op = 0.4 + (i / Math.max(c.ringCount - 1, 1)) * 0.6;
    return { rx, ry, sw, op, stroke: palette2[i % palette2.length], isClose: i >= c.ringCount - 2 };
  });

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

      <circle cx="0" cy="0" r="24" fill={palette.auraMid} opacity={c.auraStrength} filter={F.halo} />

      <g transform={`rotate(${tilt})`}>
        {rings.map((r, i) => (
          <ellipse key={i} cx="0" cy="0" rx={r.rx} ry={r.ry} fill="none" stroke={r.stroke} strokeWidth={r.sw} opacity={r.op} filter={r.isClose ? F.glow : F.soft} />
        ))}
      </g>

      <circle cx={dotX} cy={dotY} r={1.8} fill={palette.boltBright} filter={F.glow} />
      <circle cx="0" cy="0" r={c.centerHole + 2.5} fill={`url(#${coreGrad})`} filter={F.glow} />
      <circle cx="0" cy="0" r="1.6" fill={palette.nucleusCore} />
    </svg>
  );
}
