import { useId } from "react";
import { motion } from "framer-motion";
import { SharedDefs, filterIds } from "../shared/filters";
import { useRafTime } from "../shared/use-raf-time";
import type { VariantProps } from "../shared/types";
import type { PulsarConfig } from "../../atelier/configs";

const PULSE_DUR_BY_INT = { calm: 2.6, normal: 1.8, intense: 1.0 } as const;
const ROT_DUR_BY_INT = { calm: 28, normal: 18, intense: 9 } as const;

function resolveConfig(intensity: "calm" | "normal" | "intense", config?: unknown): PulsarConfig {
  const def: PulsarConfig = {
    flareCount: 14,
    flareLength: 24,
    rotationDuration: ROT_DUR_BY_INT[intensity],
    ringCount: 3,
    ringDuration: 1.4,
    auraPulse: PULSE_DUR_BY_INT[intensity],
    coreMinScale: 1.0,
    coreMaxScale: 1.6,
    flareAlternation: true,
    flareStrokeWidth: 0.6,
    auraIntensity: 0.22,
    hoverSpeedBoost: 1.8,
  };
  return { ...def, ...(config as Partial<PulsarConfig> | undefined) };
}

/**
 * Pulsar · Lighthouse — 2 zıt koni ışın, deniz feneri gibi döner.
 */
export function PulsarLighthouseStyle({ palette, hovered, intensity, config }: VariantProps) {
  const id = useId().replace(/:/g, "");
  const F = filterIds(id);
  const c = resolveConfig(intensity, config);
  const beamGrad = `lh-b-${id}`;
  const coreGrad = `lh-c-${id}`;
  const rotDur = hovered ? c.rotationDuration / c.hoverSpeedBoost : c.rotationDuration;
  const beamLen = c.flareLength;

  return (
    <svg viewBox="-30 -30 60 60" aria-hidden width="100%" height="100%">
      <SharedDefs suffix={id} />
      <defs>
        <linearGradient id={beamGrad} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor={palette.boltBright} stopOpacity={0.95} />
          <stop offset="60%" stopColor={palette.boltMid} stopOpacity={0.45} />
          <stop offset="100%" stopColor={palette.boltMid} stopOpacity={0} />
        </linearGradient>
        <radialGradient id={coreGrad}>
          <stop offset="0%" stopColor={palette.nucleusCore} />
          <stop offset="55%" stopColor={palette.electron} />
          <stop offset="100%" stopColor={palette.nucleusDeep} />
        </radialGradient>
      </defs>

      <circle cx="0" cy="0" r="22" fill={palette.auraMid} opacity={c.auraIntensity * 0.82} filter={F.halo} />

      <motion.g
        animate={{ rotate: 360 }}
        transition={{ duration: rotDur, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "center" }}
      >
        <g>
          <polygon points={`-3.2,-2 3.2,-2 1.4,${-beamLen} -1.4,${-beamLen}`} fill={`url(#${beamGrad})`} filter={F.glow} />
          <line x1="0" y1="-2" x2="0" y2={-beamLen} stroke={palette.boltBright} strokeWidth={c.flareStrokeWidth + 0.2} opacity={0.85} />
        </g>
        <g transform="rotate(180)">
          <polygon points={`-3.2,-2 3.2,-2 1.4,${-beamLen} -1.4,${-beamLen}`} fill={`url(#${beamGrad})`} filter={F.glow} opacity={0.85} />
          <line x1="0" y1="-2" x2="0" y2={-beamLen} stroke={palette.boltBright} strokeWidth={c.flareStrokeWidth} opacity={0.7} />
        </g>
      </motion.g>

      {c.ringCount > 0 && (
        <circle cx="0" cy="0" r="9" fill="none" stroke={palette.orbitMid} strokeWidth={0.5} opacity={0.4} />
      )}

      <motion.circle
        cx="0" cy="0" r="4" fill={`url(#${coreGrad})`} filter={F.glow}
        animate={{ scale: [c.coreMinScale, c.coreMaxScale, c.coreMinScale] }}
        transition={{ duration: c.auraPulse, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "center" }}
      />
      <circle cx="0" cy="0" r="1.4" fill={palette.nucleusCore} />
    </svg>
  );
}

/**
 * Pulsar · Heartbeat — flare yok, EKG-vari çift atım + tek expanding halka.
 */
export function PulsarHeartbeatStyle({ palette, hovered, intensity, config }: VariantProps) {
  const id = useId().replace(/:/g, "");
  const F = filterIds(id);
  const c = resolveConfig(intensity, config);
  const t = useRafTime();
  const period = c.ringDuration * (hovered ? 1 / c.hoverSpeedBoost : 1);
  const coreGrad = `hb-c-${id}`;

  const phase = ((t / period) % 1 + 1) % 1;
  let coreScale = c.coreMinScale;
  const range = c.coreMaxScale - c.coreMinScale;
  if (phase < 0.08) coreScale = c.coreMinScale + (phase / 0.08) * range * 0.28;
  else if (phase < 0.16) coreScale = c.coreMinScale + range * 0.28 - ((phase - 0.08) / 0.08) * range * 0.28;
  else if (phase < 0.26) coreScale = c.coreMinScale + ((phase - 0.16) / 0.10) * range;
  else if (phase < 0.36) coreScale = c.coreMaxScale - ((phase - 0.26) / 0.10) * range;
  else coreScale = c.coreMinScale;

  const ringPhase = phase < 0.16 ? -1 : (phase - 0.16) / 0.84;
  const ringR = ringPhase < 0 ? 0 : 4 + ringPhase * 22;
  const ringOpacity = ringPhase < 0 ? 0 : Math.max(0, 0.95 - ringPhase * 1.1);
  const ringSW = ringPhase < 0 ? 0 : Math.max(0.2, 2 - ringPhase * 1.8);

  return (
    <svg viewBox="-30 -30 60 60" aria-hidden width="100%" height="100%">
      <SharedDefs suffix={id} />
      <defs>
        <radialGradient id={coreGrad}>
          <stop offset="0%" stopColor={palette.nucleusCore} />
          <stop offset="55%" stopColor={palette.electron} />
          <stop offset="100%" stopColor={palette.nucleusDeep} />
        </radialGradient>
      </defs>

      <circle cx="0" cy="0" r="22" fill={palette.auraMid} opacity={c.auraIntensity * 0.82} filter={F.halo} />

      {ringPhase >= 0 && c.ringCount > 0 && (
        <circle cx="0" cy="0" r={ringR} fill="none" stroke={palette.electron} strokeWidth={ringSW} opacity={ringOpacity} filter={F.glow} />
      )}

      <circle cx="0" cy="0" r="9" fill="none" stroke={palette.orbitMid} strokeWidth={0.5} opacity={0.35} />

      <circle cx="0" cy="0" r={4 * coreScale} fill={`url(#${coreGrad})`} filter={F.glow} />
      <circle cx="0" cy="0" r="1.4" fill={palette.nucleusCore} />
    </svg>
  );
}
