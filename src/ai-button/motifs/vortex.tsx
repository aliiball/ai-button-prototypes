import { useId } from "react";
import { motion } from "framer-motion";
import { SharedDefs, filterIds } from "../shared/filters";
import type { MotifProps } from "../shared/types";
import type { VortexConfig } from "../../atelier/configs";

const SPEED_MULT = { calm: 1.6, normal: 1, intense: 0.5 } as const;
const PULSE_DUR = { calm: 2.4, normal: 1.8, intense: 1.2 } as const;

function resolveConfig(intensity: "calm" | "normal" | "intense", config?: unknown): VortexConfig {
  const def: VortexConfig = {
    ringCount: 5,
    baseRotation: 14 * SPEED_MULT[intensity],
    ringFalloff: 0.7,
    outerRx: 22,
    aspect: 2.2,
    centerHole: 3.5,
    auraStrength: 0.15,
    strokeWidth: 0.8,
    hoverSpeedBoost: 2.5,
    rotationDir: "cw",
  };
  return { ...def, ...(config as Partial<VortexConfig> | undefined) };
}

export function VortexMotif({ palette, hovered, intensity = "normal", config }: MotifProps) {
  const id = useId().replace(/:/g, "");
  const F = filterIds(id);
  const c = resolveConfig(intensity, config);
  const centerGrad = `vx-c-${id}`;

  // Renk paleti — N ring boyunca uzanan stroke katmanları
  const palette2 = [
    palette.auraMid,
    palette.orbitMid,
    palette.boltMid,
    palette.electron,
    palette.boltBright,
    palette.orbitHighlight,
    palette.nucleusMid,
    palette.boltBright,
  ];

  const rings = Array.from({ length: c.ringCount }, (_, i) => {
    const t = i / Math.max(c.ringCount - 1, 1);
    const rx = c.outerRx - i * ((c.outerRx - 6) / Math.max(c.ringCount - 1, 1));
    const ry = rx / c.aspect;
    const dur = c.baseRotation * Math.pow(c.ringFalloff, i);
    const rot = (i * 30) % 360;
    const sw = c.strokeWidth + i * 0.07;
    const op = 0.4 + (i / Math.max(c.ringCount - 1, 1)) * 0.6;
    return { rx, ry, rot, dur, stroke: palette2[i % palette2.length], sw, op, isCloseToCenter: i >= c.ringCount - 2 };
  });

  return (
    <svg viewBox="-30 -30 60 60" aria-hidden width="100%" height="100%">
      <SharedDefs suffix={id} />
      <defs>
        <radialGradient id={centerGrad} cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor={palette.boltDeep} />
          <stop offset="60%" stopColor={palette.nucleusDeep} />
          <stop offset="100%" stopColor={palette.auraOuter} stopOpacity={0} />
        </radialGradient>
      </defs>

      <circle cx="0" cy="0" r="24" fill={palette.auraMid} opacity={c.auraStrength} filter={F.halo} />

      {rings.map((r, i) => {
        const dirSign = c.rotationDir === "ccw" ? -1 : c.rotationDir === "alternate" ? (i % 2 === 0 ? 1 : -1) : 1;
        return (
          <motion.g
            key={i}
            animate={{ rotate: 360 * dirSign }}
            transition={{
              duration: hovered ? r.dur / c.hoverSpeedBoost : r.dur,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{ transformOrigin: "center" }}
          >
            <ellipse
              cx="0" cy="0" rx={r.rx} ry={r.ry}
              transform={`rotate(${r.rot})`}
              fill="none" stroke={r.stroke} strokeWidth={r.sw}
              opacity={r.op} filter={r.isCloseToCenter ? F.glow : F.soft}
            />
          </motion.g>
        );
      })}

      <motion.circle
        cx="0"
        cy="0"
        r={c.centerHole}
        fill={`url(#${centerGrad})`}
        animate={{ scale: hovered ? [1, 1.3, 1] : [1, 1.1, 1] }}
        transition={{ duration: PULSE_DUR[intensity], repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "center" }}
      />
      <circle cx="0" cy="0" r="1.4" fill={palette.nucleusCore} filter={F.glow} />
    </svg>
  );
}
