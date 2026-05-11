import { useEffect, useId, useRef, useState } from "react";
import { SharedDefs, filterIds } from "../shared/filters";
import type { MotifProps } from "../shared/types";

/**
 * 7×7 piksel grid, diagonal sin dalgası ile opacity. Generative AI hissi.
 */
export function PixelGridMotif({ palette, hovered }: MotifProps) {
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

  const N = 7;
  const cellSize = 4.2;
  const gap = 1.2;
  const total = N * (cellSize + gap) - gap;
  const start = -total / 2;
  const speed = hoveredRef.current ? 3 : 1.5;

  return (
    <svg viewBox="-30 -30 60 60" aria-hidden width="100%" height="100%">
      <SharedDefs suffix={id} />

      {/* aura backing */}
      <rect
        x={start - 2}
        y={start - 2}
        width={total + 4}
        height={total + 4}
        rx="4"
        fill={palette.auraMid}
        opacity={0.12}
        filter={F.halo}
      />

      {Array.from({ length: N }).map((_, i) =>
        Array.from({ length: N }).map((_, j) => {
          const phase = t * speed + i * 0.32 + j * 0.22;
          const wave = Math.max(0, Math.sin(phase));
          const opacity = 0.18 + 0.82 * wave;
          // alternating fills
          const fill =
            (i + j) % 3 === 0
              ? palette.boltBright
              : (i + j) % 2 === 0
                ? palette.nucleusMid
                : palette.electron;
          // corners get a touch of bright
          const isCorner =
            (i === 0 || i === N - 1) && (j === 0 || j === N - 1);
          return (
            <rect
              key={`${i}-${j}`}
              x={start + i * (cellSize + gap)}
              y={start + j * (cellSize + gap)}
              width={cellSize}
              height={cellSize}
              rx="0.9"
              fill={isCorner ? palette.boltBright : fill}
              opacity={opacity}
              filter={wave > 0.7 ? F.soft : undefined}
            />
          );
        }),
      )}
    </svg>
  );
}
