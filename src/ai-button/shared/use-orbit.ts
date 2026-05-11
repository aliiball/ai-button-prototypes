import { useEffect, useRef, useState } from "react";

export type Vec2 = { x: number; y: number };

export type OrbitOptions = {
  /** Elliptik orbit major axis */
  rx?: number;
  /** Elliptik orbit minor axis */
  ry?: number;
  /** Orbit period (saniye) */
  period?: number;
  /** Orbit/electron sayısı */
  count?: number;
  /** Aktif değilse hesaplama duraklatılır (IntersectionObserver entegrasyonu) */
  active?: boolean;
};

/**
 * rAF-tabanlı elliptik orbit hesaplaması.
 * `count` adet ayrı orbit düzleminde (eşit açıyla) dönen tek elektronun pozisyonlarını döner.
 * Kaynak: sahibinden-v2 AtomButton.
 */
export function useOrbit({
  rx = 22,
  ry = 9,
  period = 7,
  count = 3,
  active = true,
}: OrbitOptions = {}): Vec2[] {
  const [positions, setPositions] = useState<Vec2[]>(
    () => Array.from({ length: count }, () => ({ x: rx, y: 0 })),
  );
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const tick = (now: number) => {
      if (startRef.current == null) startRef.current = now;
      const t = (now - startRef.current) / 1000;
      const out: Vec2[] = [];
      for (let i = 0; i < count; i++) {
        const angleDeg = (i * 180) / count; // 0 / 60 / 120 / ...
        const leadBegin = i * -(period / count);
        const progress = (((t - leadBegin) / period) % 1 + 1) % 1;
        const theta = progress * 2 * Math.PI;
        const lx = rx * Math.cos(theta);
        const ly = ry * Math.sin(theta);
        const a = (angleDeg * Math.PI) / 180;
        out.push({
          x: lx * Math.cos(a) - ly * Math.sin(a),
          y: lx * Math.sin(a) + ly * Math.cos(a),
        });
      }
      setPositions(out);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, rx, ry, period, count]);

  return positions;
}
