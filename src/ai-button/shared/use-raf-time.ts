import { useEffect, useRef, useState } from "react";

/**
 * rAF-tabanlı sürekli zaman (saniye) — animasyonlu motiflerin paylaştığı hook.
 * Component mount'tan itibaren geçen saniyeyi state olarak verir.
 */
export function useRafTime(): number {
  const [t, setT] = useState(0);
  const startRef = useRef<number | null>(null);

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

  return t;
}
