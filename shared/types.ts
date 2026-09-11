/* ─── Continuum — Core Type Definitions ─── */

export interface BrandComplianceInfo {
  owner: string;                // e.g. "Aether Global Corp"
  licenseType: string;          // e.g. "Commercial Enterprise", "Commercial Talent Release & Global Ad Rights"
  version: string;              // e.g. "v2.4"
  brandSafetyScore: number;     // 0-100
  authorizedParties?: string[];
}

export interface BrandComplianceCertificate {
  id?: string;
  brandName: string;
  guidelineVersion: string;
  licenseAgreement: string;
  owner: string;
  brandSafetyScore?: number;
  verifiedAssets: {
    name: string;
    ual: string;
    type: string;
    license: string;
    royaltyShare?: string;
    assetId?: string;
    category?: string;
    licenseType?: string;
    brandSafetyScore?: number;
  }[];
  safetyChecks: {
    rule: string;
    status: "passed" | "warning" | "PASS" | "WARN";
    description?: string;
    detail?: string;
  }[];
  certificateHash: string;
  timestamp: string;
  issuedAt?: string;
  provenanceUal: string;
}

// ── Vault Asset Types ──

export interface CharacterAsset {
  id: string;
  projectId?: string;           // linked series project
  name: string;
  epithet: string;              // e.g. "The Cyber Samurai"
  visualDna: {
    faceSeed: string;           // deterministic face reference hash
    hairColor: string;          // hex
    eyeColor: string;           // hex
    skinTone: string;           // hex
    distinguishingFeatures: string[];  // e.g. ["cybernetic left eye", "scar across right cheek"]
    attire: AttireConstraint;
    negativePrompts: string[];  // things this character must NEVER look like
  };
  voiceProfile?: {
    timbreDescription: string;  // e.g. "deep, gravelly, calm"
    ttsModel?: string;
  };
  createdAt: string;            // ISO timestamp
  ual?: string;                 // DKG Universal Asset Locator
  avatarUrl?: string;           // generated Livepeer portrait URL
  brandCompliance?: BrandComplianceInfo;
  compliance?: BrandComplianceInfo;
}

export interface AttireConstraint {
  canonical: string;            // e.g. "black trenchcoat with neon-green circuit trim"
  colorPalette: string[];       // hex values
  forbidden: string[];          // e.g. ["shorts", "Hawaiian shirt"]
}

export interface LeitmotifAsset {
  id: string;
  projectId?: string;           // linked series project
  name: string;                 // e.g. "Ren's Synthwave Theme"
  boundToCharacterId?: string;  // linked character (relational)
  mood: string;                 // e.g. "intense", "melancholic", "triumphant"
  bpm: number;
  key: string;                  // e.g. "D minor"
  instruments: string[];        // e.g. ["synth pad", "electric bass", "808 drums"]
  audioUrl?: string;            // generated Livepeer audio URL
  createdAt: string;
  ual?: string;
  brandCompliance?: BrandComplianceInfo;
  compliance?: BrandComplianceInfo;
}

export interface SetAsset {
  id: string;
  projectId?: string;           // linked series project
  name: string;                 // e.g. "Neo-Tokyo Rain District"
  description: string;
  colorPalette: string[];       // hex values
  lightingSchema: string;       // e.g. "neon-lit, wet reflections, volumetric fog"
  timeOfDay: string;            // e.g. "night", "golden hour"
  negativePrompts: string[];    // things this set must NEVER contain
  createdAt: string;
  ual?: string;
  imageUrl?: string;            // generated Livepeer concept art URL
  brandCompliance?: BrandComplianceInfo;
  compliance?: BrandComplianceInfo;
}

export interface PropAsset {
  id: string;
  projectId?: string;           // linked series project
  name: string;                 // e.g. "Kensai Katana"
  category: "prop" | "lore";    // Prop artifact vs World Lore rule
  type: string;                 // e.g. "Weapon", "Communications", "Forensic Clue", "Faction", "Anomaly"
  boundToCharacterId?: string;  // linked character in project roster
  boundToSetId?: string;        // linked environment
  description: string;          // Visual & material details
  loreSignificance: string;     // Narrative backstory & importance
  negativePrompts?: string[];   // Visual anti-drift constraints
  visualTheme: "blade" | "transmitter" | "cell" | "device" | "relic" | "holocron";
  createdAt: string;
  ual?: string;                 // did:dkg:continuum/prop/...
  imageUrl?: string;            // generated Livepeer concept art / render URL
  brandCompliance?: BrandComplianceInfo;
  compliance?: BrandComplianceInfo;
}

// ── Project & Series Types ──

export interface Project {
  id: string;
  title: string;
  genre: string;
  logline: string;
  seasonNumber: number;
  totalEpisodes: number;
  createdAt: string;
  ual?: string;
  isCommercialBrand?: boolean;
  brandCompliance?: BrandComplianceInfo;
  compliance?: BrandComplianceInfo;
}

// ── Scene & Episode Types ──

export interface SceneCast {
  characterIds: string[];
  setId: string;
  leitmotifIds: string[];
}

export interface SceneRequest {
  projectId?: string;
  episodeNumber: number;
  sceneNumber: number;
  prompt: string;               // user's natural language direction
  cast: SceneCast;
  campaignMode?: "cinematic" | "commercial";
  aspectRatio?: "16:9" | "9:16";
  campaignObjective?: string;
  callToAction?: string;
}

export interface SceneResult {
  id: string;
  projectId?: string;
  request: SceneRequest;
  composedPrompt: string;       // the full prompt after DKG injection
  dkgConstraints: DkgConstraintLog;
  livepeerOutputs: LivepeerOutput[];
  lineage: SceneLineage;
  createdAt: string;
  ual?: string;
  complianceCertificate?: BrandComplianceCertificate;
}

export interface DkgConstraintLog {
  characterTraitsInjected: Record<string, string[]>;
  negativePromptsInjected: string[];
  leitmotifsBound: string[];
  setConstraintsApplied: string[];
}

export interface LivepeerOutput {
  type: "image" | "video" | "audio";
  url: string;
  capability: string;           // e.g. "flux-dev", "kling", "sonilo"
  costUsd: number;
  elapsedMs: number;
}

export interface SceneLineage {
  derivedFrom: {
    characters: string[];       // UALs
    leitmotifs: string[];       // UALs
    set: string;                // UAL
  };
  provenance: {
    generatedAt: string;
    livepeerCapabilities: string[];
    promptFingerprint: string;
  };
}

// ── DKG Knowledge Asset Types ──

export interface KnowledgeAssetRef {
  ual: string;
  type: "project" | "character" | "leitmotif" | "set" | "prop" | "scene";
  name: string;
  createdAt: string;
}

export interface GraphNode {
  id: string;
  type: "project" | "character" | "leitmotif" | "set" | "prop" | "scene";
  label: string;
  projectId?: string;
  data: Record<string, unknown>;
}

export interface GraphEdge {
  source: string;
  target: string;
  predicate: string;            // e.g. "ex:hasLeitmotif", "prov:wasDerivedFrom"
  label: string;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

// ── API Response Wrappers ──

export interface VaultState {
  characters: CharacterAsset[];
  leitmotifs: LeitmotifAsset[];
  sets: SetAsset[];
  props?: PropAsset[];
}

export interface RenderProgress {
  phase: "querying-dkg" | "composing-prompt" | "generating-keyframe" | "animating-video" | "generating-audio" | "minting-scene-ka" | "complete" | "error";
  message: string;
  progress: number;             // 0-100
}
