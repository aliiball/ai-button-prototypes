import { useId } from "react";
import { motion } from "framer-motion";
import { SharedDefs, filterIds } from "../shared/filters";
import type { MotifProps } from "../shared/types";
import type { PulsarConfig } from "../../atelier/configs";

const PULSE_DUR = { calm: 2.6, normal: 1.8, intense: 1.0 } as const;
const FLARE_COUNT = { calm: 10, normal: 14, intense: 20 } as const;
const ROT_DUR = { calm: 28, normal: 18, intense: 9 } as const;
const RING_COUNT = { calm: 2, normal: 3, intense: 4 } as const;

function resolveConfig(intensity: "calm" | "normal" | "intense", config?: unknown): PulsarConfig {
  const def: PulsarConfig = {
    flareCount: FLARE_COUNT[intensity],
    flareLength: 24,
    rotationDuration: ROT_DUR[intensity],
    ringCount: RING_COUNT[intensity],
    ringDuration: 1.4,
    auraPulse: PULSE_DUR[intensity],
    coreMinScale: 1.0,
    coreMaxScale: 1.6,
    flareAlternation: true,
    flareStrokeWidth: 0.6,
    auraIntensity: 0.22,
    hoverSpeedBoost: 1.8,
  };
  return { ...def, ...(config as Partial<PulsarConfig> | undefined) };
}

export function PulsarMotif({ palette, hovered, intensity = "normal", config }: MotifProps) {
  const id = useId().replace(/:/g, "");
  const F = filterIds(id);
  const c = resolveConfig(intensity, config);
  const coreGrad = `pl-c-${id}`;
  const dur = hovered ? c.auraPulse / c.hoverSpeedBoost : c.auraPulse;
  const rotDur = hovered ? c.rotationDuration / c.hoverSpeedBoost : c.rotationDuration;

  return (
    <svg viewBox="-30 -30 60 60" aria-hidden width="100%" height="100%">
      <SharedDefs suffix={id} />
      <defs>
        <radialGradient id={coreGrad}>
          <stop offset="0%" stopColor={palette.nucleusCore} />
          <stop offset="50%" stopColor={palette.electron} />
          <stop offset="100%" stopColor={palette.nucleusDeep} />
        </radialGradient>
      </defs>

      <motion.circle
        cx="0"
        cy="0"
        r="22"
        fill={palette.auraMid}
        opacity={c.auraIntensity}
        filter={F.halo}
        animate={{ scale: [1, 1.18, 1], opacity: [c.auraIntensity * 0.7, c.auraIntensity * 1.6, c.auraIntensity * 0.7] }}
        transition={{ duration: dur, repeat: Infinity, ease: "easeOut" }}
        style={{ transformOrigin: "center" }}
      />

      {c.flareCount > 0 && (
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: rotDur, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "center" }}
        >
          {Array.from({ length: c.flareCount }).map((_, i) => {
            const alt = c.flareAlternation;
            const isOdd = i % 2 === 0;
            const sw = alt ? (isOdd ? c.flareStrokeWidth : c.flareStrokeWidth * 0.65) : c.flareStrokeWidth;
            const op = alt ? (isOdd ? 0.55 : 0.3) : 0.5;
            return (
              <line
                key={i}
                x1="0"
                y1="0"
                x2="0"
                y2={-c.flareLength}
                transform={`rotate(${(i * 360) / c.flareCount})`}
                stroke={palette.boltBright}
                strokeWidth={sw}
                strokeLinecap="round"
                opacity={op}
              />
            );
          })}
        </motion.g>
      )}

      {Array.from({ length: c.ringCount }).map((_, i) => (
        <motion.circle
          key={i}
          cx="0"
          cy="0"
          r="6"
          fill="none"
          stroke={palette.electron}
          strokeWidth={1.4}
          animate={{
            r: [4, 22, 26],
            opacity: [0.95, 0.2, 0],
            strokeWidth: [2, 0.6, 0.2],
          }}
          transition={{
            duration: c.ringDuration,
            repeat: Infinity,
            delay: i * (c.ringDuration / Math.max(c.ringCount, 1)),
            ease: "easeOut",
          }}
          filter={F.glow}
        />
      ))}

      <motion.circle
        cx="0"
        cy="0"
        r="4"
        fill={`url(#${coreGrad})`}
        filter={F.glow}
        animate={{ scale: [c.coreMinScale, c.coreMaxScale, c.coreMinScale] }}
        transition={{ duration: dur, repeat: Infinity, ease: "easeOut" }}
        style={{ transformOrigin: "center" }}
      />
      <circle cx="0" cy="0" r="1.4" fill={palette.nucleusCore} />
    </svg>
  );
}
