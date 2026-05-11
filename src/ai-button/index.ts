import type { MotifEntry, MotifId } from "./shared/types";
// Hero / Iconic
import { AuroraMeshMotif } from "./motifs/aurora-mesh";
import { StarClusterMotif } from "./motifs/star-cluster";
import { SparkleMotif } from "./motifs/sparkle";
// Organic & flowing
import { LiquidBlobMotif } from "./motifs/liquid-blob";
import { FlowingRibbonMotif } from "./motifs/flowing-ribbon";
import { InfinityFlowMotif } from "./motifs/infinity-flow";
import { MagicWandMotif } from "./motifs/magic-wand";
import { VineGrowthMotif } from "./motifs/vine-growth";
import { OuroborosMotif } from "./motifs/ouroboros";
import { OrigamiCraneMotif } from "./motifs/origami-crane";
import { PhoenixFlameMotif } from "./motifs/phoenix-flame";
// Geometric / structural
import { PolyhedronMotif } from "./motifs/polyhedron";
import { PrismMotif } from "./motifs/prism";
import { HexagonHiveMotif } from "./motifs/hexagon-hive";
import { PixelGridMotif } from "./motifs/pixel-grid";
import { MobiusStripMotif } from "./motifs/mobius-strip";
import { TrefoilKnotMotif } from "./motifs/trefoil-knot";
import { SnowflakeMotif } from "./motifs/snowflake";
import { TessellationMotif } from "./motifs/tessellation";
import { CrystalClusterMotif } from "./motifs/crystal-cluster";
import { GeodesicSphereMotif } from "./motifs/geodesic-sphere";
import { GearMotif } from "./motifs/gear";
// Orbital / particle systems
import { AtomMotif } from "./motifs/atom";
import { OrbitalRingsMotif } from "./motifs/orbital-rings";
import { SpiralGalaxyMotif } from "./motifs/spiral-galaxy";
import { ParticleSwarmMotif } from "./motifs/particle-swarm";
import { ConstellationMotif } from "./motifs/constellation";
import { BohrAtomMotif } from "./motifs/bohr-atom";
// Energy & light
import { OrbPulseMotif } from "./motifs/orb-pulse";
import { SoapBubbleMotif } from "./motifs/soap-bubble";
import { VortexMotif } from "./motifs/vortex";
import { LightbulbMotif } from "./motifs/lightbulb";
import { PlasmaBallMotif } from "./motifs/plasma-ball";
import { LightningBoltMotif } from "./motifs/lightning-bolt";
import { EclipseMotif } from "./motifs/eclipse";
import { VinylDiskMotif } from "./motifs/vinyl-disk";
import { PulsarMotif } from "./motifs/pulsar";
import { AiCoreMotif } from "./motifs/ai-core";
// Motion / trail
import { CometMotif } from "./motifs/comet";
import { SpotlightMotif } from "./motifs/spotlight";
import { BezierPenMotif } from "./motifs/bezier-pen";
import { HeartPulseMotif } from "./motifs/heart-pulse";
import { WaterDropMotif } from "./motifs/water-drop";
// Cognition / connection
import { NeuralWebMotif } from "./motifs/neural-web";
import { BrainMotif } from "./motifs/brain";
import { DnaHelixMotif } from "./motifs/dna-helix";
import { QuantumCloudMotif } from "./motifs/quantum-cloud";
// Optical / cinematic
import { CameraApertureMotif } from "./motifs/camera-aperture";
import { GlitchMotif } from "./motifs/glitch";
import { MandelbrotMotif } from "./motifs/mandelbrot";
// UI / sound metaphor
import { ChatBubbleMotif } from "./motifs/chat-bubble";
import { VoiceWaveMotif } from "./motifs/voice-wave";
import { EqualizerMotif } from "./motifs/equalizer";
import { TextCursorMotif } from "./motifs/text-cursor";
import { CodeBracketsMotif } from "./motifs/code-brackets";
import { HolographicCardMotif } from "./motifs/holographic-card";
import { SigilMotif } from "./motifs/sigil";
import { RadialSpectrumMotif } from "./motifs/radial-spectrum";
import { SingingBowlMotif } from "./motifs/singing-bowl";
import { TokenStreamMotif } from "./motifs/token-stream";
import { CloudAiMotif } from "./motifs/cloud-ai";
import { PixelSpriteMotif } from "./motifs/pixel-sprite";
import { BroadcastAntennaMotif } from "./motifs/broadcast-antenna";
// Watcher
import { EyeIrisMotif } from "./motifs/eye-iris";

export const MOTIFS: MotifEntry[] = [
  // Hero / Iconic
  { id: "aurora-mesh", label: "Aurora", description: "Apple Intelligence tarzı yumuşak iridescent renk bulutu.", Component: AuroraMeshMotif },
  { id: "star-cluster", label: "Yıldız Kümesi", description: "Gemini tarzı asimetrik 5 yıldız dizilimi.", Component: StarClusterMotif },
  { id: "sparkle", label: "Sparkle", description: "4-köşeli AI yıldızı + yumuşak rotasyon.", Component: SparkleMotif },

  // Organic & flowing
  { id: "liquid-blob", label: "Sıvı Blob", description: "8-anchor morphing organik şekil. Lava lamp.", Component: LiquidBlobMotif },
  { id: "flowing-ribbon", label: "Akan Kurdele", description: "Copilot tarzı 3 katmanlı S-eğrisi silk.", Component: FlowingRibbonMotif },
  { id: "infinity-flow", label: "Sonsuzluk", description: "∞ yolunda akan ışık. Sürekli düşünme.", Component: InfinityFlowMotif },
  { id: "magic-wand", label: "Sihirli Değnek", description: "Diyagonal değnek + tip sparkle + iz partikülleri.", Component: MagicWandMotif },
  { id: "vine-growth", label: "Dal Büyümesi", description: "Alttan yukarı dallanan organik fractal + yapraklar.", Component: VineGrowthMotif },
  { id: "ouroboros", label: "Ouroboros", description: "Kuyruğunu yiyen halka yılan. Sonsuz döngü.", Component: OuroborosMotif },
  { id: "origami-crane", label: "Origami Turna", description: "Stilize kağıt katlamalar + kanat çırpma.", Component: OrigamiCraneMotif },
  { id: "phoenix-flame", label: "Phoenix Alev", description: "Yukarı süzülen tüy-vari alev + uçan spark'lar.", Component: PhoenixFlameMotif },

  // Geometric / structural
  { id: "polyhedron", label: "Polihedron", description: "3D dönen oktahedron + parlak edge'ler.", Component: PolyhedronMotif },
  { id: "prism", label: "Prizma", description: "Dönen elmas + faceted gradient.", Component: PrismMotif },
  { id: "hexagon-hive", label: "Petek", description: "Merkez altıgen + 6 komşu sıralı yanış.", Component: HexagonHiveMotif },
  { id: "pixel-grid", label: "Piksel Grid", description: "7×7 grid, diagonal sin dalgası ile yanar.", Component: PixelGridMotif },
  { id: "mobius-strip", label: "Möbius Şeridi", description: "Bükülmüş 3D halka, iki taraflı gradient bant.", Component: MobiusStripMotif },
  { id: "trefoil-knot", label: "Trefoil Düğüm", description: "3-loop matematik düğümü, gradient stroke.", Component: TrefoilKnotMotif },
  { id: "snowflake", label: "Kar Tanesi", description: "6-katlı simetrik fractal + dönüş.", Component: SnowflakeMotif },
  { id: "tessellation", label: "Tesselasyon", description: "Üçgen tile grid + faz dalgalı renk geçişi.", Component: TessellationMotif },
  { id: "crystal-cluster", label: "Kristal Kümesi", description: "Çoklu elmas parçaları, her biri kendi gradient'i.", Component: CrystalClusterMotif },
  { id: "geodesic-sphere", label: "Geodesik Küre", description: "3D wireframe küresel ağ, lat-long + dönüş.", Component: GeodesicSphereMotif },
  { id: "gear", label: "Dişli", description: "Dönen mekanik çark + ortada AI sparkle.", Component: GearMotif },

  // Orbital / particle systems
  { id: "atom", label: "Atom", description: "3 elliptik orbit + elektronlar + hover fractal şimşek.", Component: AtomMotif },
  { id: "orbital-rings", label: "Satürn Halkası", description: "Eğik halka + üzerinde gezen parlak nokta.", Component: OrbitalRingsMotif },
  { id: "spiral-galaxy", label: "Sarmal Galaksi", description: "Logaritmik 3 sarmal + akan ışık.", Component: SpiralGalaxyMotif },
  { id: "particle-swarm", label: "Parçacık Sürüsü", description: "16 parçacık flock; hover'da merkeze toplanır.", Component: ParticleSwarmMotif },
  { id: "constellation", label: "Konstellasyon", description: "8 yıldız + 7 bağlantı (yıldız haritası).", Component: ConstellationMotif },
  { id: "bohr-atom", label: "Bohr Atom", description: "Klasik düz konsantrik orbitler + dönen elektronlar.", Component: BohrAtomMotif },

  // Energy & light
  { id: "orb-pulse", label: "Enerji Küresi", description: "Solid orb + 3 eş merkezli genleşen halka.", Component: OrbPulseMotif },
  { id: "soap-bubble", label: "İridescent Köpük", description: "Tek iridescent sabun köpüğü, offset gradient.", Component: SoapBubbleMotif },
  { id: "vortex", label: "Vorteks", description: "Konsantrik döndürülmüş ellipse tünel.", Component: VortexMotif },
  { id: "lightbulb", label: "Ampul", description: "Edison ampul + filaman + çevre sparkle.", Component: LightbulbMotif },
  { id: "plasma-ball", label: "Plazma Topu", description: "Tesla küresi, merkezden çepere zigzag arc'lar.", Component: PlasmaBallMotif },
  { id: "lightning-bolt", label: "Şimşek", description: "Tek dikey zikzak yıldırım + flash.", Component: LightningBoltMotif },
  { id: "eclipse", label: "Güneş Tutulması", description: "Koyu merkez disk + korona halkası + ışın hüzmeleri.", Component: EclipseMotif },
  { id: "vinyl-disk", label: "Vinyl Disk", description: "Iridescent dönen disk + rainbow refleksiyon.", Component: VinylDiskMotif },
  { id: "pulsar", label: "Pulsar", description: "Radyal flare patlaması + periyodik atış halkaları.", Component: PulsarMotif },
  { id: "ai-core", label: "AI Çekirdek", description: "Koyu küre + içinde parlayan reaktör çekirdek.", Component: AiCoreMotif },

  // Motion / trail
  { id: "comet", label: "Kuyruklu Yıldız", description: "Diyagonal hareket + iz partikül kuyruğu.", Component: CometMotif },
  { id: "spotlight", label: "Spotlight", description: "Diyagonal ışın + dans eden toz partikülleri.", Component: SpotlightMotif },
  { id: "bezier-pen", label: "Bezier Kalem", description: "Kalemin kendi yolunu çizmesi. Generative pen.", Component: BezierPenMotif },
  { id: "heart-pulse", label: "Kalp Atışı", description: "EKG çizgisi + periyodik P-QRS-T spike.", Component: HeartPulseMotif },
  { id: "water-drop", label: "Su Damlası", description: "Düşen damla + çarpma anında ripple halkaları.", Component: WaterDropMotif },

  // Cognition / connection
  { id: "neural-web", label: "Sinir Ağı", description: "6 düğüm + sırayla ışıyan bağlantılar.", Component: NeuralWebMotif },
  { id: "brain", label: "Beyin", description: "Beyin silueti + kıvrımlar + atan sinapsler.", Component: BrainMotif },
  { id: "dna-helix", label: "DNA Sarmalı", description: "Çift sinüsoidal sarmal + yatay basamaklar.", Component: DnaHelixMotif },
  { id: "quantum-cloud", label: "Kuantum Bulutu", description: "Gaussian dağılan stokastik nokta alanı.", Component: QuantumCloudMotif },

  // Optical / cinematic
  { id: "camera-aperture", label: "Diyafram", description: "6 yapraklı kamera diyaframı açılıp kapanır.", Component: CameraApertureMotif },
  { id: "glitch", label: "Glitch", description: "RGB-split glyph + scanline'lar + ani bloklar.", Component: GlitchMotif },
  { id: "mandelbrot", label: "Mandelbrot", description: "Stilize fractal silueti + iridescent kontur halkaları.", Component: MandelbrotMotif },

  // UI / sound metaphor
  { id: "chat-bubble", label: "Sohbet Balonu", description: "Konuşma balonu + 3 typing dot + sparkle.", Component: ChatBubbleMotif },
  { id: "voice-wave", label: "Ses Dalgası", description: "Yatay sinüs dalgaları sürekli akar.", Component: VoiceWaveMotif },
  { id: "equalizer", label: "Ekolayzır", description: "5 dikey çubuk + hover'da reaktif yükselme.", Component: EqualizerMotif },
  { id: "text-cursor", label: "Yazım İmleci", description: "I-beam imleç + yanında AI sparkle.", Component: TextCursorMotif },
  { id: "code-brackets", label: "Kod Parantezleri", description: "{ } parantez + ortada typing dot.", Component: CodeBracketsMotif },
  { id: "holographic-card", label: "Holografik Kart", description: "3D flip + iridescent yüzey + scan line.", Component: HolographicCardMotif },
  { id: "sigil", label: "Sigil", description: "Üçgen + çift çember + parlayan uç noktaları.", Component: SigilMotif },
  { id: "radial-spectrum", label: "Radyal Spektrum", description: "Dairesel ses spektrumu, radyal çubuklar.", Component: RadialSpectrumMotif },
  { id: "singing-bowl", label: "Ses Halkası", description: "Offset noktadan asimetrik konsantrik ripple.", Component: SingingBowlMotif },
  { id: "token-stream", label: "Token Akışı", description: "5 sütun akan karakterler. LLM token stream.", Component: TokenStreamMotif },
  { id: "cloud-ai", label: "Bulut AI", description: "Bulut silueti + içinde twinkle sparkle'lar.", Component: CloudAiMotif },
  { id: "pixel-sprite", label: "Pixel Sprite", description: "8-bit retro AI yüzü, blink eden gözler.", Component: PixelSpriteMotif },
  { id: "broadcast-antenna", label: "Anten Yayını", description: "Anten kulesi + tepeden radyal yayın dalgaları.", Component: BroadcastAntennaMotif },

  // Watcher
  { id: "eye-iris", label: "İris", description: "Açılıp kapanan iris; hover'da bakar. AI gözü.", Component: EyeIrisMotif },
];

export const MOTIF_MAP: Record<MotifId, MotifEntry> = MOTIFS.reduce(
  (acc, m) => {
    acc[m.id] = m;
    return acc;
  },
  {} as Record<MotifId, MotifEntry>,
);

export { AIButton } from "./ai-button";
export type { AIButtonProps } from "./ai-button";
export { PALETTES, iridescent, getPalette } from "./shared/palettes";
export type { Palette, PaletteId, MotifId, MotifEntry } from "./shared/types";
