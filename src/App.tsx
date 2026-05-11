import { useEffect, useRef, useState } from "react";
import { AIButton, MOTIFS, iridescent } from "./ai-button";
import type { MotifEntry } from "./ai-button";

/**
 * Galeri sayfası. Tek iridescent palette, 28 motif, responsive 4-sütun grid.
 * Görünmeyen kartlar IntersectionObserver ile duraklatılır.
 */
export default function App() {
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number | null>(null);

  const handlePick = (motif: MotifEntry) => {
    setToast(motif.label);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 1800);
    console.log("[AI Button] seçildi:", { motif: motif.id });
  };

  return (
    <div className="min-h-screen pb-24">
      <Header />

      <main className="mx-auto max-w-6xl px-4 sm:px-8 py-8 sm:py-12">
        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {MOTIFS.map((motif, idx) => (
            <MotifCard
              key={motif.id}
              motif={motif}
              index={idx}
              onPick={handlePick}
            />
          ))}
        </ul>
      </main>

      <Footer />

      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="toast-pop fixed bottom-6 left-1/2 -translate-x-1/2 z-50 rounded-full border border-fuchsia-200/20 bg-page-panel/95 px-5 py-3 text-sm font-mono uppercase tracking-[0.16em] text-page-ink shadow-2xl backdrop-blur"
        >
          {toast} seçildi
        </div>
      )}
    </div>
  );
}

function Header() {
  return (
    <header className="border-b border-white/5 bg-page-bg/40 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 sm:px-8 py-5 sm:py-7 flex flex-col gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-page-mute">
          Atölye · AI Buton Prototipleri
        </p>
        <h1 className="font-serif text-2xl sm:text-3xl md:text-[42px] font-light tracking-tight leading-tight">
          {MOTIFS.length} motif · iridescent palet — AI buton atölyesi
        </h1>
        <p className="text-sm text-page-mute max-w-2xl">
          Her kart bir AI buton motifinin canlı hâli. Hover'da motifin etkileşim
          animasyonu açılır. Tıkla — alt-orta toast'ta seçim görünür.
        </p>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="mx-auto max-w-6xl px-4 sm:px-8 py-10 text-center text-xs font-mono uppercase tracking-[0.18em] text-page-mute/70">
      Atölye · 2026
    </footer>
  );
}

function MotifCard({
  motif,
  index,
  onPick,
}: {
  motif: MotifEntry;
  index: number;
  onPick: (m: MotifEntry) => void;
}) {
  const ref = useRef<HTMLLIElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) setVisible(entry.isIntersecting);
      },
      { rootMargin: "120px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <li
      ref={ref}
      className="rounded-2xl border border-white/5 bg-page-panel/40 backdrop-blur px-4 sm:px-5 py-5 sm:py-6 flex flex-col items-center gap-3 text-center"
    >
      <AIButton
        motif={motif.id}
        palette={iridescent}
        size={88}
        paused={!visible}
        onClick={() => onPick(motif)}
      />
      <div className="flex items-baseline gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-page-mute">
          {String(index + 1).padStart(2, "0")}
        </span>
        <h2 className="font-serif text-base sm:text-lg font-light tracking-tight">
          {motif.label}
        </h2>
      </div>
      <p className="text-xs text-page-mute leading-relaxed line-clamp-3 min-h-[3rem]">
        {motif.description}
      </p>
    </li>
  );
}
