/* ─── Continuum — Pre-Seeded Show Bible (Demo Data) ─── */

import type { CharacterAsset, LeitmotifAsset, SetAsset } from "./types.js";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CHARACTERS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const CHARACTERS: CharacterAsset[] = [
  {
    id: "char-ren",
    projectId: "proj-ronin-echoes",
    name: "Ren Akiyama",
    epithet: "The Cyber Samurai",
    visualDna: {
      faceSeed: "ren-akiyama-v1-seed-7f3a",
      hairColor: "#1a1a2e",
      eyeColor: "#00ff88",
      skinTone: "#d4a574",
      distinguishingFeatures: [
        "glowing cybernetic left eye with green HUD overlay",
        "diagonal scar across right cheek",
        "short spiky black hair with single neon-green streak",
      ],
      attire: {
        canonical:
          "long black armored trenchcoat with neon-green circuit-trace trim, dark tactical pants, heavy combat boots",
        colorPalette: ["#0a0a0a", "#1a1a2e", "#00ff88", "#2d2d44"],
        forbidden: [
          "casual clothing",
          "shorts",
          "bright cheerful colors",
          "Hawaiian shirt",
          "medieval armor",
          "suit and tie",
        ],
      },
      negativePrompts: [
        "blond hair",
        "blue eyes",
        "clean-shaven face without scar",
        "two normal human eyes",
        "smiling cheerfully",
        "wearing white or pastel colors",
      ],
    },
    voiceProfile: {
      timbreDescription:
        "deep, gravelly, measured — speaks in short precise sentences",
      ttsModel: "onyx",
    },
    avatarUrl: "https://agent.livepeer.org/a/aHR0cHM6Ly92M2IuZmFsLm1lZGlhL2ZpbGVzL2IvMGFhOWQ3MWUvS3RWQUplcmdRRkUxcUFVOWdXTTdNLmpwZw.85e66edb7653a7de/KtVAJergQFE1qAU9gWM7M.jpg",
    createdAt: "2026-09-10T04:00:00Z",
  },
  {
    id: "char-yuki",
    projectId: "proj-ronin-echoes",
    name: "Yuki Tanabe",
    epithet: "The Ghost Hacker",
    visualDna: {
      faceSeed: "yuki-tanabe-v1-seed-9c2b",
      hairColor: "#e8e0f0",
      eyeColor: "#c084fc",
      skinTone: "#fae0c8",
      distinguishingFeatures: [
        "long silver-lavender hair reaching mid-back",
        "violet holographic eye implants that glow when hacking",
        "small constellation tattoo on left temple",
      ],
      attire: {
        canonical:
          "oversized dark-purple hoodie with shifting holographic patterns, black leggings, white high-top sneakers with purple accents",
        colorPalette: ["#2d1b4e", "#c084fc", "#e8e0f0", "#1a1a2e"],
        forbidden: [
          "formal dress",
          "military uniform",
          "heavy armor",
          "red or orange clothing",
          "traditional Japanese clothing",
        ],
      },
      negativePrompts: [
        "dark hair",
        "normal human eyes without glow",
        "no tattoo on face",
        "muscular build",
        "wearing bright red",
        "short hair",
      ],
    },
    voiceProfile: {
      timbreDescription:
        "soft, fast-paced, slightly playful — uses tech jargon casually",
      ttsModel: "nova",
    },
    avatarUrl: "https://agent.livepeer.org/a/aHR0cHM6Ly92M2IuZmFsLm1lZGlhL2ZpbGVzL2IvMGFhOWQxMmIvRjZjTG5KZE43SkZLaFNTLXFCMkgxLmpwZw.47fdb1a8514009fd/F6cLnJdN7JFKhSS-qB2H1.jpg",
    createdAt: "2026-09-10T04:00:00Z",
  },
  {
    id: "char-vance",
    projectId: "proj-solaris-drift",
    name: "Dr. Alistair Vance",
    epithet: "The Derelict Astrobiologist",
    visualDna: {
      faceSeed: "vance-solaris-seed-3d8a",
      hairColor: "#4a4a52",
      eyeColor: "#d4a373",
      skinTone: "#c58f68",
      distinguishingFeatures: [
        "amber telemetry visor with real-time biometric HUD overlay",
        "frostbitten left eyebrow",
        "titanium neck collar seal with oxygen flow diode",
      ],
      attire: {
        canonical:
          "weathered white reinforced EVA space pressure suit, gold thermal chest harness, magnetic utility clips",
        colorPalette: ["#f8fafc", "#d97706", "#334155", "#0284c7"],
        forbidden: [
          "casual street clothes",
          "short sleeves",
          "heavy military firearms",
          "neon streetwear",
        ],
      },
      negativePrompts: [
        "young teenage face",
        "bright neon cyberpunk jacket",
        "casual t-shirt",
        "medieval armor",
        "smiling broadly",
      ],
    },
    voiceProfile: {
      timbreDescription:
        "calm, analytical, reverberant over internal suit comms",
      ttsModel: "echo",
    },
    avatarUrl: "https://agent.livepeer.org/a/aHR0cHM6Ly92M2IuZmFsLm1lZGlhL2ZpbGVzL2IvMGFhOWQ3ZjIvbW9yZlZDa2w1ZXp2UWMwRjRFU3o3LmpwZw.b0f48dc187ef08c8/morfVCkl5ezvQc0F4ESz7.jpg",
    createdAt: "2026-09-10T04:00:00Z",
  },
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// LEITMOTIFS (Character Theme Music)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const LEITMOTIFS: LeitmotifAsset[] = [
  {
    id: "leit-ren-theme",
    projectId: "proj-ronin-echoes",
    name: "Ren's Blade — Synthwave March",
    boundToCharacterId: "char-ren",
    mood: "intense, determined, brooding",
    bpm: 120,
    key: "D minor",
    instruments: [
      "analog synth lead",
      "deep sub-bass",
      "808 kick drum",
      "distorted electric guitar stabs",
      "reverb-heavy snare",
    ],
    audioUrl: "https://agent.livepeer.org/a/aHR0cHM6Ly92M2IuZmFsLm1lZGlhL2ZpbGVzL2IvMGFhOWQ3ZGIvTGd0LUwtZEEyT0UwZXM1eE83anNFX291dHB1dC5tcDM.440ba9383ebbbd15/Lgt-L-dA2OE0es5xO7jsE_output.mp3",
    createdAt: "2026-09-10T04:00:00Z",
  },
  {
    id: "leit-yuki-theme",
    projectId: "proj-ronin-echoes",
    name: "Ghost Protocol — Ambient Glitch",
    boundToCharacterId: "char-yuki",
    mood: "mysterious, playful, digital, ethereal",
    bpm: 95,
    key: "F# minor",
    instruments: [
      "glitch percussion",
      "soft pad synth",
      "plucked harp samples",
      "bitcrushed vocal chops",
      "lo-fi piano",
    ],
    audioUrl: "https://agent.livepeer.org/a/aHR0cHM6Ly92M2IuZmFsLm1lZGlhL2ZpbGVzL2IvMGFhOWQ3MjIvWnJvY0RKREZIaUJzc19PcVU1VzN0X291dHB1dC5tcDM.1fd97797c700d26c/ZrocDJDFHiBss_OqU5W3t_output.mp3",
    createdAt: "2026-09-10T04:00:00Z",
  },
  {
    id: "leit-solaris-drift",
    projectId: "proj-solaris-drift",
    name: "Distress Echo — Derelict Transmission",
    boundToCharacterId: "char-vance",
    mood: "haunting, cavernous, isolated, hypnotic",
    bpm: 78,
    key: "C# minor",
    instruments: [
      "bowed metallic drone",
      "low-frequency sub pulse",
      "intermittent radio static clicks",
      "reverb-drenched glass harmonica",
    ],
    audioUrl: "https://agent.livepeer.org/a/aHR0cHM6Ly92M2IuZmFsLm1lZGlhL2ZpbGVzL2IvMGFhOWQ3ZjcveW9vSWhXdjg4TjRtemNBNXkwdFBIX291dHB1dC5tcDM.9fa53b76e0fcc4c3/yooIhWv88N4mzcA5y0tPH_output.mp3",
    createdAt: "2026-09-10T04:00:00Z",
  },
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SETS (Canonical Environments)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const SETS: SetAsset[] = [
  {
    id: "set-neo-tokyo",
    projectId: "proj-ronin-echoes",
    name: "Neo-Tokyo Rain District",
    description:
      "A rain-soaked cyberpunk alley in a neon-drenched megacity. Towering holographic billboards flicker above narrow streets. Steam rises from sewer grates. Wet asphalt reflects fragmented neon light in purples, greens, and electric blues.",
    colorPalette: ["#0a0a1a", "#7c3aed", "#00ff88", "#06b6d4", "#1e1b4b"],
    lightingSchema:
      "volumetric neon fog, wet reflective surfaces, strong rim lighting from holographic ads, deep shadows in alleyways",
    timeOfDay: "night",
    negativePrompts: [
      "daylight",
      "sunshine",
      "rural countryside",
      "clean sterile environment",
      "natural forest",
      "bright cheerful atmosphere",
    ],
    imageUrl: "https://agent.livepeer.org/a/aHR0cHM6Ly92M2IuZmFsLm1lZGlhL2ZpbGVzL2IvMGFhOWQ4MDEvc3ZZOHV1Tk10VUxSXzB4WHFNQUJRLmpwZw.26042ef301363d28/svY8uuNMtULR_0xXqMABQ.jpg",
    createdAt: "2026-09-10T04:00:00Z",
  },
  {
    id: "set-sky-garden",
    projectId: "proj-ronin-echoes",
    name: "The Floating Sky Garden",
    description:
      "A hidden rooftop sanctuary atop the city's tallest skyscraper. Bioluminescent plants glow softly among reclaimed concrete. A crescent moon hangs low. The distant city lights form a glittering carpet far below.",
    colorPalette: ["#0f172a", "#22d3ee", "#a78bfa", "#ecfdf5", "#064e3b"],
    lightingSchema:
      "soft bioluminescent glow from plants, moonlit ambiance, warm lantern accents, long gentle shadows",
    timeOfDay: "late night, moonlit",
    negativePrompts: [
      "harsh sunlight",
      "indoor scene",
      "underground tunnel",
      "desert landscape",
      "crowded city street",
    ],
    imageUrl: "/assets/vault/sky-garden.jpg",
    createdAt: "2026-09-10T04:00:00Z",
  },
  {
    id: "set-derelict-alpha",
    projectId: "proj-solaris-drift",
    name: "Derelict Station Alpha — Cryo Junction",
    description:
      "An abandoned orbital station corridor floating in zero-g around Kepler-452b. Emergency amber beacons pulse rhythmically. Frosted observation glass reveals deep-space stars and planetary shadows.",
    colorPalette: ["#090d16", "#f59e0b", "#0284c7", "#334155", "#0f172a"],
    lightingSchema:
      "rhythmic amber emergency strobes, cold blue starlight from cracked viewports, volumetric zero-g dust motes",
    timeOfDay: "orbital night",
    negativePrompts: [
      "earth city",
      "rain",
      "trees",
      "blue sky",
      "warm cozy room",
      "crowded street",
    ],
    imageUrl: "/assets/vault/derelict-alpha.jpg",
    createdAt: "2026-09-10T04:00:00Z",
  },
];
