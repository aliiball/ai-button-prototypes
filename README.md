# AI Buton Prototipleri

Arsam'a entegre edilmeden önce yönetici onayına sunulacak **AI asistanı tetikleyici butonun** 12 farklı motifinin 2 paletle (warm + blue) toplam **24 görsel varyasyonu**.

Kaynak motif: `sahibindenv2` repo'sundaki `AtomButton` — procedurally animated atom (3 elliptik orbit, dönen electrons, hover'da fractal lightning, pulsating nucleus aura).

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

Repo `main` branch'ine push'lanır push'lanmaz `.github/workflows/deploy.yml` otomatik build + deploy yapar.

1. GitHub'da yeni repo aç: `aliiball/ai-button-prototypes`
2. `git remote add origin git@github.com:aliiball/ai-button-prototypes.git`
3. `git push -u origin main`
4. Repo **Settings → Pages → Source: GitHub Actions**
5. Canlı URL: `https://aliiball.github.io/ai-button-prototypes/`

Eğer repo adı farklı olursa `vite.config.ts` içindeki `base: "/ai-button-prototypes/"` değerini güncelle (repo-adı ile birebir aynı olmalı, başında ve sonunda `/`).

## Dosya yapısı

```
src/
├── App.tsx                      # Galeri (12 satır × 2 palet)
├── main.tsx
├── styles.css
└── ai-button/
    ├── index.ts                 # MOTIFS registry + dış export
    ├── ai-button.tsx            # <AIButton motif palette onClick />
    ├── shared/
    │   ├── glass-shell.tsx      # Dairesel cam kabuk
    │   ├── filters.tsx          # Ortak SVG filter defs
    │   ├── use-orbit.ts         # rAF elliptik orbit hook
    │   ├── use-bolt.ts          # Procedural lightning hook
    │   ├── palettes.ts          # warm + blue paletteleri
    │   └── types.ts
    └── motifs/                  # 12 motif (tek motif, palette prop'u ile her renkte çalışır)
        ├── atom.tsx
        ├── sparkle.tsx
        ├── neural-web.tsx
        ├── orb-pulse.tsx
        ├── prism.tsx
        ├── equalizer.tsx
        ├── compass-key.tsx
        ├── house.tsx
        ├── orbital-rings.tsx
        ├── particle-swarm.tsx
        ├── eye-iris.tsx
        └── infinity-flow.tsx
```

## Mimari notlar

- **Composition over duplication:** 24 buton görünür ama 12 motif dosyası. Palette `<AIButton>` prop'u olarak iner; her motif SVG değerlerini `palette.nucleusCore`, `palette.boltMid` semantik isimleriyle okur.
- **Performans:** Galeride her satırda `IntersectionObserver` var; görünmeyen satırın motiflerine `paused={true}` prop'u iner → hover'da bolt üretimi durur, rAF döngüleri devam etse de görsel maliyeti düşer.
- **Filtre ID'leri:** Her motif kendi `useId()`'siyle benzersiz suffix oluşturur — aynı sayfada 24 buton aynı anda render olsa bile SVG filter ID çakışması yok.
- **Yeni motif eklemek:** `motifs/<isim>.tsx` yaz → `index.ts`'teki `MOTIFS` dizisine ekle.
