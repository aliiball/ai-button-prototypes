# AI Buton Prototipleri

Bir AI asistanı tetikleyici butonun **64 motif** canlı prototipi + **Atölye konfigüratörü** (4 ana motif × 3 stil × 3 yoğunluk × 4 palet). React + Vite + Tailwind + framer-motion.

## Yerel çalıştırma

```bash
npm install
npm run dev
# http://localhost:5173/ai-button-prototypes/
```

## Build

```bash
npm run build
npm run preview
```

## GitHub Pages

`main` branch'ine push'lanır push'lanmaz `.github/workflows/deploy.yml` otomatik build + deploy yapar.

1. Repo: `aliiball/ai-button-prototypes`
2. `git push -u origin main`
3. Repo **Settings → Pages → Source: GitHub Actions**
4. Canlı URL: `https://aliiball.github.io/ai-button-prototypes/`

Repo adı farklı olursa `vite.config.ts` içindeki `base: "/ai-button-prototypes/"` değerini güncelle (repo-adı ile birebir aynı olmalı, başta ve sonda `/`).

## Tab yapısı

- **Galeri** — 64 motif kart, iridescent palet, hover'da motif animasyonu.
- **Atölye** — 4 ana motif (Atom, Vorteks, Plazma, Pulsar) üzerinde 3 eksende konfigürasyon:
  - **Stil (A)**: her motif için 3 topolojik varyant (örn. Atom → Klasik / Quark / Minimal).
  - **Yoğunluk (B)**: Sakin / Normal / Yoğun — animasyon hızı, parçacık sayısı, glow yoğunluğu.
  - **Palet (C)**: Iridescent / Warm / Ocean / Cyber.
  - Sol kontrol paneli + 180px büyük preview + 4×3 mini kombinasyon ızgarası.
  - URL hash derin-link: `#atelier/<motif>/<stil>/<yoğunluk>/<palet>` — kopyala butonu ile paylaşılabilir.

## Dosya yapısı

```
src/
├── App.tsx                          # Tab sahibi + Galeri + Header/Footer
├── atelier-view.tsx                 # Atölye konfigüratörü
├── main.tsx
├── styles.css                       # Tailwind + 4 glass-shell paleti
└── ai-button/
    ├── index.ts                     # MOTIFS registry (64) + dış export
    ├── ai-button.tsx                # <AIButton motif palette size onClick />
    ├── styles.ts                    # STYLES registry (12) + STYLES_BY_PARENT
    ├── shared/
    │   ├── glass-shell.tsx          # Dairesel cam kabuk (shellClass paletten)
    │   ├── filters.tsx              # Ortak SVG filter defs (depth/glow/halo/soft)
    │   ├── use-orbit.ts             # rAF elliptik orbit hook
    │   ├── use-bolt.ts              # Procedural lightning hook
    │   ├── use-raf-time.ts          # Paylaşılan rAF zaman akışı
    │   ├── palettes.ts              # 4 palet (iridescent / warm / ocean / cyber)
    │   └── types.ts                 # MotifProps, VariantProps, IntensityId, PaletteId
    ├── motifs/                      # 64 motif (intensity opsiyonel; default "normal")
    │   ├── atom.tsx                 #   ↳ atom/vortex/plasma-ball/pulsar intensity-aware
    │   ├── vortex.tsx
    │   ├── plasma-ball.tsx
    │   ├── pulsar.tsx
    │   └── … (60 diğer motif)
    └── styles/                      # 8 yeni stil varyantı (VariantProps)
        ├── atom-styles.tsx          #   Quark, Minimal
        ├── vortex-styles.tsx        #   Funnel, Galactic Disk
        ├── plasma-styles.tsx        #   Sleeping, Pulse-sync
        └── pulsar-styles.tsx        #   Lighthouse, Heartbeat
```

## Mimari notlar

- **Composition over duplication.** 64 motifi tek `MOTIFS` registry'sinde, 12 stil varyantını ayrı `STYLES` registry'sinde tut. Atölye'deki "klasik" stiller mevcut motifleri doğrudan sarar (intensity prop'u opsiyonel → contravariance ile uyumlu).
- **Tek motif, çok palet.** Her motif `palette.nucleusCore`, `palette.boltMid` gibi semantik isimlerle okur. Yeni palet eklemek = `Palette` obje + ona uygun bir `.glass-shell-<id>` CSS sınıfı yazmak.
- **3-eksenli varyant modeli.** A (stil, ayrı component), B (yoğunluk, `intensity` prop), C (palet, `palette` prop) bağımsız eksenlerdir. Atölye konfigüratörü üçünü serbestçe çarpar.
- **Performans.** Galeride her satırda `IntersectionObserver` var; görünmeyen satırın motiflerine `paused={true}` prop'u iner → hover'da bolt üretimi durur, rAF döngüleri devam etse de görsel maliyeti düşer.
- **Filtre ID çakışması yok.** Her motif kendi `useId()`'siyle benzersiz suffix oluşturur — aynı sayfada 64+12 buton render olsa bile SVG filter ID çakışması olmaz.
- **URL hash derin-link.** Atölye state'i hash'e yazılır (`#atelier/atom/atom-quark/intense/cyber`); paylaşılan link aynı konfigürasyonu açar.

## Yeni motif eklemek

1. `src/ai-button/motifs/<isim>.tsx` yaz (`MotifProps` signature).
2. `src/ai-button/index.ts`'teki `MOTIFS` dizisine ekle.

## Yeni stil varyantı eklemek (Atölye için)

1. `src/ai-button/styles/<motif>-styles.tsx`'e yeni component yaz (`VariantProps` signature — `intensity` zorunlu).
2. `src/ai-button/styles.ts`'teki `STYLES` dizisine kayıt ekle (`id`, `parentId`, `label`, `description`, `Component`).

## Yeni palet eklemek

1. `src/ai-button/shared/palettes.ts`'e yeni `Palette` obje + `PALETTES` ve `PALETTE_MAP`'e kayıt.
2. `src/ai-button/shared/types.ts`'teki `PaletteId` union'a yeni id'yi ekle.
3. `src/styles.css`'e palete uygun bir `.glass-shell-<id>` sınıfı yaz.
