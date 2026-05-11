import { useEffect, useId, useRef, useState } from "react";
import { SharedDefs, filterIds } from "../shared/filters";
import type { MotifProps } from "../shared/types";

/**
 * Token stream — yatay sütunlarda akan karakterler. LLM token akışı hissi.
 */
export function TokenStreamMotif({ palette, hovered }: MotifProps) {
  const id = useId().replace(/:/g, "");
  const F = filterIds(id);

  const [t, setT] = useState(0);
  const startRef = useRef<number | null>(null);
  const hoveredRef = useRef(hovered);
  useEffect(() => {
    hoveredRef.current = hovered;
  }, [hovered]);

  useEffect(() => {
    let raf = 0;
    const tick = (now: number) => {
      if (startRef.current == null) startRef.current = now;
      setT((now - startRef.current) / 1000);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // 5 sütun, her sütunda 7 karakter akıyor
  const cols = 5;
  const rowsPerCol = 7;
  const speed = hoveredRef.current ? 16 : 8;

  const chars = ["0", "1", "{", "}", "[", "]", ":", "/", ";"];
  const seeds = useRef(
    Array.from({ length: cols }, () => ({
      offset: Math.random() * 7,
      charSeed: Math.floor(Math.random() * 100),
    })),
  ).current;

  return (
    <svg viewBox="-30 -30 60 60" aria-hidden width="100%" height="100%">
      <SharedDefs suffix={id} />

      {/* aura backing */}
      <rect x="-22" y="-22" width="44" height="44" rx="6" fill={palette.auraMid} opacity={0.16} filter={F.halo} />

      {/* dış çerçeve */}
      <rect x="-20" y="-20" width="40" height="40" rx="4" fill={palette.auraOuter} fillOpacity={0.6} stroke={palette.orbitMid} strokeWidth={0.4} strokeOpacity={0.5} />

      {Array.from({ length: cols }).map((_, c) => {
        const colX = -16 + c * 8;
        const s = seeds[c];
        const colOffset = (t * speed + s.offset * 6) % (rowsPerCol * 5);
        return (
          <g key={c}>
            {Array.from({ length: rowsPerCol }).map((_, r) => {
              const baseY = -16 + r * 5;
              const y = ((baseY + colOffset + 16) % 32) - 16;
              const charIdx = (r + c * 3 + Math.floor(t * 3) + s.charSeed) % chars.length;
              const ch = chars[charIdx];
              // distance from edge for fade
              const fade = 1 - Math.abs(y) / 16;
              const isHead = r === 0;
              return (
                <text
                  key={r}
                  x={colX}
                  y={y}
                  fontSize="5"
                  fontFamily="JetBrains Mono, ui-monospace, monospace"
                  fontWeight={700}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={isHead ? palette.nucleusCore : palette.electron}
                  opacity={isHead ? Math.max(0, fade) : Math.max(0, fade * 0.7)}
                  filter={isHead ? F.glow : undefined}
                >
                  {ch}
                </text>
              );
            })}
          </g>
        );
      })}

      {/* alt edge fade gradient overlay */}
      <rect x="-20" y="14" width="40" height="6" fill={palette.auraOuter} opacity={0.7} />
      <rect x="-20" y="-20" width="40" height="4" fill={palette.auraOuter} opacity={0.7} />
    </svg>
  );
}
