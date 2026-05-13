import { useId, useMemo } from "react";
import { motion } from "framer-motion";
import { SharedDefs, filterIds } from "../shared/filters";
import { useOrbit } from "../shared/use-orbit";
import { useRafTime } from "../shared/use-raf-time";
import { useBolts } from "../shared/use-bolt";
import type { MotifProps } from "../shared/types";
import type { AtomConfig } from "../../atelier/configs";

const PERIOD = { calm: 12, normal: 7, intense: 4 } as const;
const PULSE_DUR = { calm: 2.4, normal: 1.6, intense: 1.0 } as const;
const SCALE_BREATH = {
  calm: [1, 1.03, 1],
  normal: [1, 1.06, 1],
  intense: [1, 1.1, 1],
} as const;
const BOLT_MODE_BY_INTENSITY = {
  calm: "none",
  normal: "hover",
  intense: "always",
} as const;

function resolveConfig(intensity: "calm" | "normal" | "intense", config?: unknown): AtomConfig {
  const def: AtomConfig = {
    orbitRx: 22,
    orbitRy: 9,
    orbitPeriod: PERIOD[intensity],
    electronCount: 3,
    orbitPlaneCount: 3,
    nucleusRadius: 4,
    auraPulseDur: PULSE_DUR[intensity],
    auraOpacity: 0.55,
    showAura: true,
    boltMode: BOLT_MODE_BY_INTENSITY[intensity],
    boltThickness: 1.6,
    glowStrength: intensity === "intense" ? 2.4 : 1.6,
    hoverScale: intensity === "intense" ? 1.2 : 1.12,
  };
  return { ...def, ...(config as Partial<AtomConfig> | undefined) };
}

export function AtomMotif({ palette, hovered, intensity = "normal", config }: MotifProps) {
  const id = useId().replace(/:/g, "");
  const F = filterIds(id);
  const c = resolveConfig(intensity, config);

  const planeAngles = useMemo(
    () => Array.from({ length: c.orbitPlaneCount }, (_, i) => (i * 180) / c.orbitPlaneCount),
    [c.orbitPlaneCount],
  );

  const orbitPositions = useOrbit({
    rx: c.orbitRx,
    ry: c.orbitRy,
    period: c.orbitPeriod,
    count: Math.max(c.orbitPlaneCount, 1),
  });

  // Quark-modu: tek plane'de N elektron — orbitPlaneCount=1 ve electronCount>1
  const t = useRafTime();
  const isQuark = c.orbitPlaneCount === 1 && c.electronCount > 1;
  const quarkPositions = useMemo(() => {
    if (!isQuark) return null;
    return Array.from({ length: c.electronCount }, (_, i) => {
      const theta =
        ((t * (hovered ? 1.6 : 1)) / c.orbitPeriod) * 2 * Math.PI +
        (i * 2 * Math.PI) / c.electronCount;
      return { x: Math.cos(theta) * c.orbitRx, y: Math.sin(theta) * c.orbitRy };
    });
  }, [isQuark, c.electronCount, c.orbitPeriod, c.orbitRx, c.orbitRy, t, hovered]);

  const electronPositions = quarkPositions ?? orbitPositions;
  const boltsActive =
    c.boltMode === "always" || (c.boltMode === "hover" && hovered);
  const bolts = useBolts(electronPositions, boltsActive);

  const nucleusGrad = `nuc-${id}`;
  const auraGrad = `aura-${id}`;

  return (
    <motion.svg
      viewBox="-30 -30 60 60"
      aria-hidden
      width="100%"
      height="100%"
      animate={{ scale: hovered ? c.hoverScale : [...SCALE_BREATH[intensity]] }}
      transition={
        hovered
          ? { duration: 0.3 }
          : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
      }
      style={{ transformOrigin: "center" }}
    >
      <SharedDefs suffix={id} />
      <defs>
        <radialGradient id={nucleusGrad} cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor={palette.nucleusCore} />
          <stop offset="35%" stopColor={palette.nucleusMid} />
          <stop offset="100%" stopColor={palette.nucleusDeep} />
        </radialGradient>
        <radialGradient id={auraGrad} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={palette.auraInner} stopOpacity="0.95" />
          <stop offset="55%" stopColor={palette.auraMid} stopOpacity="0.35" />
          <stop offset="100%" stopColor={palette.auraOuter} stopOpacity="0" />
        </radialGradient>
      </defs>

      <g filter={F.depth}>
        {planeAngles.map((angle) => (
          <g key={angle} transform={`rotate(${angle})`}>
            <ellipse cx="0" cy="0" rx={c.orbitRx} ry={c.orbitRy} fill="none" stroke={palette.orbitDeep} strokeWidth={3.6} opacity={0.55} filter={F.halo} />
            <ellipse cx="0" cy="0" rx={c.orbitRx} ry={c.orbitRy} fill="none" stroke={palette.orbitMid} strokeWidth={1.4} opacity={0.9} filter={F.soft} />
            <ellipse cx="0" cy="0" rx={c.orbitRx} ry={c.orbitRy} fill="none" stroke={palette.orbitHighlight} strokeWidth={0.55} opacity={0.95} />
          </g>
        ))}

        {electronPositions.map((p, i) => (
          <circle key={`e-${i}`} cx={p.x} cy={p.y} r={1.9} fill={palette.electron} filter={F.glow} />
        ))}

        <g>
          {bolts.map((b, i) =>
            b ? (
              <g key={`b-${i}`} opacity={b.intensity}>
                <path d={b.d} fill="none" stroke={palette.boltDeep} strokeWidth={c.boltThickness * 2.1} strokeLinecap="round" strokeLinejoin="round" opacity={0.7} filter={F.halo} />
                <path d={b.d} fill="none" stroke={palette.boltMid} strokeWidth={c.boltThickness} strokeLinecap="round" strokeLinejoin="round" opacity={0.95} filter={F.soft} />
                <path d={b.d} fill="none" stroke={palette.boltBright} strokeWidth={c.boltThickness * 0.44} strokeLinecap="round" strokeLinejoin="round" />
              </g>
            ) : null,
          )}
        </g>

        {c.showAura && (
          <motion.circle
            cx="0"
            cy="0"
            r="7"
            fill={`url(#${auraGrad})`}
            animate={{ scale: [1, 1.25, 1], opacity: [c.auraOpacity * 0.6, c.auraOpacity * 1.4, c.auraOpacity * 0.6] }}
            transition={{ duration: c.auraPulseDur, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "center" }}
          />
        )}
        <circle cx="0" cy="0" r={c.nucleusRadius} fill={`url(#${nucleusGrad})`} filter={F.glow} />
      </g>
    </motion.svg>
  );
}
