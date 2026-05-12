import { useId } from "react";
import { motion } from "framer-motion";
import { SharedDefs, filterIds } from "../shared/filters";
import { useRafTime } from "../shared/use-raf-time";
import type { VariantProps } from "../shared/types";

const LH_ROT_DUR = { calm: 7, normal: 4, intense: 2 } as const;
const LH_BEAM_LEN = { calm: 22, normal: 26, intense: 28 } as const;

/**
 * Pulsar · Lighthouse — sadece 2 zıt ışın (deniz feneri). Tüm grup döner.
 * Flare yok. Çekirdek nötr pulse.
 */
export function PulsarLighthouseStyle({ palette, hovered, intensity }: VariantProps) {
  const id = useId().replace(/:/g, "");
  const F = filterIds(id);
  const beamGrad = `lh-b-${id}`;
  const coreGrad = `lh-c-${id}`;
  const rotDur = hovered ? LH_ROT_DUR[intensity] * 0.55 : LH_ROT_DUR[intensity];
  const beamLen = LH_BEAM_LEN[intensity];

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

      {/* aura */}
      <circle cx="0" cy="0" r="22" fill={palette.auraMid} opacity={0.18} filter={F.halo} />

      <motion.g
        animate={{ rotate: 360 }}
        transition={{ duration: rotDur, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "center" }}
      >
        {/* üst ışın — koni şeklinde */}
        <g>
          <polygon
            points={`-3.2,-2 3.2,-2 1.4,${-beamLen} -1.4,${-beamLen}`}
            fill={`url(#${beamGrad})`}
            filter={F.glow}
          />
          <line x1="0" y1="-2" x2="0" y2={-beamLen} stroke={palette.boltBright} strokeWidth={0.6} opacity={0.85} />
        </g>
        {/* alt ışın — koni */}
        <g transform="rotate(180)">
          <polygon
            points={`-3.2,-2 3.2,-2 1.4,${-beamLen} -1.4,${-beamLen}`}
            fill={`url(#${beamGrad})`}
            filter={F.glow}
            opacity={0.85}
          />
          <line x1="0" y1="-2" x2="0" y2={-beamLen} stroke={palette.boltBright} strokeWidth={0.5} opacity={0.7} />
        </g>
      </motion.g>

      {/* fener kuyruğu — küçük tek halka */}
      <circle cx="0" cy="0" r="9" fill="none" stroke={palette.orbitMid} strokeWidth={0.5} opacity={0.4} />

      {/* çekirdek */}
      <motion.circle
        cx="0" cy="0" r="4" fill={`url(#${coreGrad})`} filter={F.glow}
        animate={{ scale: [1, 1.18, 1] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "center" }}
      />
      <circle cx="0" cy="0" r="1.4" fill={palette.nucleusCore} />
    </svg>
  );
}

const HB_PERIOD = { calm: 1.2, normal: 0.9, intense: 0.6 } as const;

/**
 * Pulsar · Heartbeat — flare yok. Sadece çekirdek + her atımda tek expanding halka.
 * P-QRS biçimi: küçük pre-pulse, sonra büyük pulse.
 */
export function PulsarHeartbeatStyle({ palette, hovered, intensity }: VariantProps) {
  const id = useId().replace(/:/g, "");
  const F = filterIds(id);
  const t = useRafTime();
  const period = HB_PERIOD[intensity] * (hovered ? 0.65 : 1);
  const coreGrad = `hb-c-${id}`;

  // EKG-vari çift atım: 0..0.10 küçük P, 0.10..0.30 büyük QRS, sonra dinlen.
  const phase = ((t / period) % 1 + 1) % 1;
  let coreScale = 1;
  if (phase < 0.08) coreScale = 1 + (phase / 0.08) * 0.25;
  else if (phase < 0.16) coreScale = 1.25 - ((phase - 0.08) / 0.08) * 0.25;
  else if (phase < 0.26) coreScale = 1 + ((phase - 0.16) / 0.10) * 0.85;
  else if (phase < 0.36) coreScale = 1.85 - ((phase - 0.26) / 0.10) * 0.85;
  else coreScale = 1;

  // tek expanding halka — QRS'de tetiklenir
  const ringPhase = phase < 0.16 ? -1 : (phase - 0.16) / 0.84; // 0..1
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

      {/* aura — yumuşak */}
      <circle cx="0" cy="0" r="22" fill={palette.auraMid} opacity={0.18} filter={F.halo} />

      {/* expanding halka */}
      {ringPhase >= 0 && (
        <circle
          cx="0" cy="0" r={ringR}
          fill="none" stroke={palette.electron}
          strokeWidth={ringSW} opacity={ringOpacity}
          filter={F.glow}
        />
      )}

      {/* iç sabit halka */}
      <circle cx="0" cy="0" r="9" fill="none" stroke={palette.orbitMid} strokeWidth={0.5} opacity={0.35} />

      {/* atan çekirdek */}
      <circle cx="0" cy="0" r={4 * coreScale} fill={`url(#${coreGrad})`} filter={F.glow} />
      <circle cx="0" cy="0" r="1.4" fill={palette.nucleusCore} />
    </svg>
  );
}
