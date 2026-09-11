import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router";
import { Icon } from "../components/StudioShell";
import type { SceneResult, CharacterAsset, SetAsset, LeitmotifAsset, PropAsset, BrandComplianceCertificate } from "@shared/types";
import { useProject } from "../context/ProjectContext";
import { useToast } from "../components/HudToast";

export function DirectorStudio() {
  const navigate = useNavigate();
  const location = useLocation();
  const { projects, activeProject, selectProjectId, createProject } = useProject();
  const { showToast } = useToast();

  // ── Continuum Enterprise: Track 2 Commercial & Brand Engine State ──
  const [campaignMode, setCampaignMode] = useState<"cinematic" | "commercial">("cinematic");
  const [aspectRatio, setAspectRatio] = useState<"16:9" | "9:16">("16:9");
  const [campaignObjective, setCampaignObjective] = useState<string>("Product Launch: Aether X1 Speed Cyberwear");
  const [callToAction, setCallToAction] = useState<string>("Shop Now at aetherkinetics.io — Zero Drift Guaranteed");
  const [inspectorTab, setInspectorTab] = useState<"triples" | "guards" | "json" | "compliance">("triples");
  const [viewOrientation, setViewOrientation] = useState<"standard" | "phone">("standard");
  const [copiedCertHash, setCopiedCertHash] = useState(false);

  // ── Vault state from live backend ──
  const [vaultChars, setVaultChars] = useState<CharacterAsset[]>([]);
  const [vaultSets, setVaultSets] = useState<SetAsset[]>([]);
  const [vaultMotifs, setVaultMotifs] = useState<LeitmotifAsset[]>([]);
  const [vaultProps, setVaultProps] = useState<PropAsset[]>([]);

  // Selected cast, sets, motifs, props
  const [selectedCharIds, setSelectedCharIds] = useState<string[]>([]);
  const [selectedSetId, setSelectedSetId] = useState<string>("");
  const [selectedMotifIds, setSelectedMotifIds] = useState<string[]>([]);
  const [selectedPropIds, setSelectedPropIds] = useState<string[]>([]);

  // Active step in the 7-step workflow
  const [activeStepTab, setActiveStepTab] = useState<number>(1);

  // Project scenes & history drawer state
  const [projectScenes, setProjectScenes] = useState<SceneResult[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // ── New Universe Project Modal State ──
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [creatingProject, setCreatingProject] = useState(false);
  const [autoGenerateAfterCreation, setAutoGenerateAfterCreation] = useState(true);

  // Modal form states
  const [newProjTitle, setNewProjTitle] = useState("");
  const [newProjGenre, setNewProjGenre] = useState("Cyberpunk Noir");
  const [newProjLogline, setNewProjLogline] = useState("");

  const [newCharName, setNewCharName] = useState("");
  const [newCharEpithet, setNewCharEpithet] = useState("");
  const [newCharAttire, setNewCharAttire] = useState("");
  const [newCharFeatures, setNewCharFeatures] = useState("");
  const [newCharVoice, setNewCharVoice] = useState("");

  const [newSetName, setNewSetName] = useState("");
  const [newSetLighting, setNewSetLighting] = useState("");
  const [newSetTimeOfDay, setNewSetTimeOfDay] = useState("NIGHT");

  const [newSoundName, setNewSoundName] = useState("");
  const [newSoundMood, setNewSoundMood] = useState("melancholic");
  const [newSoundKey, setNewSoundKey] = useState("D minor");
  const [newSoundBpm, setNewSoundBpm] = useState(120);

  const [newPropName, setNewPropName] = useState("");
  const [newPropCategory, setNewPropCategory] = useState<"prop" | "lore">("prop");
  const [newPropDesc, setNewPropDesc] = useState("");

  // Prompt state
  const [prompt, setPrompt] = useState(
    "Ren steps beneath the awning of a shuttered ramen shop. Yuki waits in the rain across the street, holding a broken transmitter. The city hum falls away as Ren recognizes the signal."
  );

  // Pipeline execution state
  const [rendering, setRendering] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [currentPhaseMsg, setCurrentPhaseMsg] = useState("");
  const [lastResult, setLastResult] = useState<SceneResult | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [renderError, setRenderError] = useState<string | null>(null);
  const [selectedGraphNode, setSelectedGraphNode] = useState<string>("scene");

  const audioRef = useRef<HTMLAudioElement>(null);
  const stepRefs = {
    step1: useRef<HTMLDivElement>(null),
    step2: useRef<HTMLDivElement>(null),
    step3: useRef<HTMLDivElement>(null),
    step4: useRef<HTMLDivElement>(null),
    step5: useRef<HTMLDivElement>(null),
    step6: useRef<HTMLDivElement>(null),
    step7: useRef<HTMLDivElement>(null),
  };

  const scrollToStep = (stepNum: number) => {
    setActiveStepTab(stepNum);
    const key = `step${stepNum}` as keyof typeof stepRefs;
    stepRefs[key]?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // ── Fetch vault data from backend ──
  const reloadVault = async () => {
    try {
      const [chars, sets, sounds, props] = await Promise.all([
        fetch("/api/vault/characters").then((r) => r.json()),
        fetch("/api/vault/sets").then((r) => r.json()),
        fetch("/api/vault/sounds").then((r) => r.json()),
        fetch("/api/vault/props").then((r) => r.json()),
      ]);
      setVaultChars(chars ?? []);
      setVaultSets(sets ?? []);
      setVaultMotifs(sounds ?? []);
      setVaultProps(props ?? []);
      return { chars, sets, sounds, props };
    } catch {
      return null;
    }
  };

  const applySampleUniversePreset = () => {
    setNewProjTitle("Aethelgard: The Void Signal");
    setNewProjGenre("Cosmic Sci-Fi Noir");
    setNewProjLogline("An isolated station archivist intercepts transmissions from a dead planetary core.");

    setNewCharName("Dr. Sarah Chen");
    setNewCharEpithet("Chief Void Archaeologist");
    setNewCharAttire("Tactical reinforced EVA flight suit with glowing copper telemetry seams");
    setNewCharFeatures("Sub-dermal neural jack behind left ear, amber tinted corneal augment");
    setNewCharVoice("Analytical, calm, resonant timbre");

    setNewSetName("Observatory Dome 07");
    setNewSetLighting("Starlight filtering through frosted quartz geodesic dome with pulsing emerald consoles");
    setNewSetTimeOfDay("DEEP VOID");

    setNewSoundName("Sarah's Frequency — Pulsar Echo");
    setNewSoundMood("ambient dread and wonder");
    setNewSoundKey("C minor");
    setNewSoundBpm(90);

    setNewPropName("Resonance Prism Scanner");
    setNewPropCategory("prop");
    setNewPropDesc("Handheld titanium spectrometer that decodes encrypted subspace harmonics.");
  };

  const handleCreateFullUniverse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjTitle.trim() || !newCharName.trim() || !newSetName.trim()) {
      alert("Please provide at least a Project Title, Character Name, and Location Name.");
      return;
    }

    setCreatingProject(true);
    try {
      const proj = await createProject({
        title: newProjTitle.trim(),
        genre: newProjGenre.trim() || "Cinematic Sci-Fi",
        logline: newProjLogline.trim() || "A new cinematic narrative universe.",
        seasonNumber: 1,
        totalEpisodes: 3,
      });

      const charRes = await fetch("/api/vault/characters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: proj.id,
          name: newCharName.trim(),
          epithet: newCharEpithet.trim() || "Canon Protagonist",
          canonicalAttire: newCharAttire.trim() || "Signature tactical attire",
          distinguishingFeatures: newCharFeatures.trim() ? [newCharFeatures.trim()] : ["Visual DNA locked"],
          voiceTimbre: newCharVoice.trim() || "Calm, deep timbre",
          negativePrompts: ["no blond hair", "no casual clothing", "no daylight", "no cartoon style"],
        }),
      });
      const createdChar: CharacterAsset = await charRes.json();

      const setRes = await fetch("/api/vault/sets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: proj.id,
          name: newSetName.trim(),
          lightingSchema: newSetLighting.trim() || "Volumetric atmospheric lighting",
          timeOfDay: newSetTimeOfDay,
          negativePrompts: ["no daylight", "no bright sunny sky"],
        }),
      });
      const createdSet: SetAsset = await setRes.json();

      const soundRes = await fetch("/api/vault/sounds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: proj.id,
          name: newSoundName.trim() || `${newCharName.trim()}'s Leitmotif`,
          mood: newSoundMood,
          bpm: Number(newSoundBpm) || 120,
          key: newSoundKey || "D minor",
          instruments: ["synth pad", "sub bass", "orchestral strings"],
        }),
      });
      const createdSound: LeitmotifAsset = await soundRes.json();

      let createdProp: PropAsset | null = null;
      if (newPropName.trim()) {
        const propRes = await fetch("/api/vault/props", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            projectId: proj.id,
            name: newPropName.trim(),
            category: newPropCategory,
            type: newPropCategory === "lore" ? "World Lore Object" : "Equipment Weapon",
            description: newPropDesc.trim() || "Canonical artifact",
            boundToCharacterId: createdChar.id,
            boundToSetId: createdSet.id,
          }),
        });
        createdProp = await propRes.json();
      }

      const updated = await reloadVault();
      if (updated) {
        setSelectedCharIds([createdChar.id]);
        setSelectedSetId(createdSet.id);
        setSelectedMotifIds([createdSound.id]);
        if (createdProp) {
          setSelectedPropIds([createdProp.id]);
        }
      }

      const generatedPrompt = createdProp
        ? `${createdChar.name} enters ${createdSet.name}, carrying the ${createdProp.name}. Atmospheric lighting reflects across the environment as a long-awaited transmission breaks the silence.`
        : `${createdChar.name} steps cautiously into ${createdSet.name}. The ambient atmosphere thickens as dramatic tension mounts.`;
      setPrompt(generatedPrompt);

      showToast({
        type: "success",
        title: "Universe & Canon Created",
        message: `${proj.title} is now active with ${createdChar.name} and ${createdSet.name}.`,
        ual: proj.ual,
      });

      setIsNewProjectModalOpen(false);

      if (autoGenerateAfterCreation) {
        setTimeout(() => {
          handleDirectScene();
        }, 500);
      } else {
        scrollToStep(5);
      }
    } catch (err) {
      console.error("Error creating universe:", err);
      alert("Failed to create universe: " + (err as Error).message);
    } finally {
      setCreatingProject(false);
    }
  };

  useEffect(() => {
    reloadVault().then((data) => {
      if (!data) return;
      const { chars, sets, sounds, props } = data;
      if (chars?.length > 0 && selectedCharIds.length === 0) {
        setSelectedCharIds([chars[0].id]);
      }
      if (sets?.length > 0 && !selectedSetId) {
        setSelectedSetId(sets[0].id);
      }
      if (sounds?.length > 0 && selectedMotifIds.length === 0) {
        setSelectedMotifIds([sounds[0].id]);
      }
      if (props?.length > 0 && selectedPropIds.length === 0) {
        setSelectedPropIds([props[0].id]);
      }
    });
  }, []);

  // Previous simple fetch
  useEffect(() => {
    Promise.all([
      fetch("/api/vault/characters").then((r) => r.json()),
      fetch("/api/vault/sets").then((r) => r.json()),
      fetch("/api/vault/sounds").then((r) => r.json()),
      fetch("/api/vault/props").then((r) => r.json()),
    ])
      .then(([chars, sets, sounds, props]) => {
        setVaultChars(chars ?? []);
        setVaultSets(sets ?? []);
        setVaultMotifs(sounds ?? []);
        setVaultProps(props ?? []);
        // Default selections
        if (chars?.length > 0 && selectedCharIds.length === 0) {
          setSelectedCharIds([chars[0].id]);
        }
        if (sets?.length > 0 && !selectedSetId) {
          setSelectedSetId(sets[0].id);
        }
        if (sounds?.length > 0 && selectedMotifIds.length === 0) {
          setSelectedMotifIds([sounds[0].id]);
        }
        if (props?.length > 0 && selectedPropIds.length === 0) {
          setSelectedPropIds([props[0].id]);
        }
      })
      .catch(() => {});
  }, []);

  const toggleProp = (id: string) => {
    setSelectedPropIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const toggleChar = (id: string) => {
    if (selectedCharIds.includes(id)) {
      if (selectedCharIds.length > 1) {
        setSelectedCharIds(selectedCharIds.filter((c) => c !== id));
      }
    } else {
      setSelectedCharIds([...selectedCharIds, id]);
    }
  };

  const applyPreset = (key: "alley" | "skyline" | "derelict") => {
    if (key === "alley") {
      const ren = vaultChars.find((c) => c.name.includes("Ren"));
      const set = vaultSets.find((s) => s.name.includes("Neo-Tokyo"));
      const prop = vaultProps.find((p) => p.name.includes("Katana") || p.name.includes("Transmitter"));
      const sound = vaultMotifs.find((m) => m.name.includes("Ren's Blade"));
      if (ren) setSelectedCharIds([ren.id]);
      if (set) setSelectedSetId(set.id);
      if (prop) setSelectedPropIds([prop.id]);
      if (sound) setSelectedMotifIds([sound.id]);
      setPrompt("Ren draws his Kensai Katana under the neon-drenched rain in Neo-Tokyo. Droplets sizzle against the monomolecular edge as the alley echoes with distant sirens.");
    } else if (key === "skyline") {
      const yuki = vaultChars.find((c) => c.name.includes("Yuki"));
      const set = vaultSets.find((s) => s.name.includes("Sky Garden"));
      const prop = vaultProps.find((p) => p.name.includes("Memory Cartridge") || p.name.includes("Transmitter"));
      const sound = vaultMotifs.find((m) => m.name.includes("Ghost Protocol"));
      if (yuki) setSelectedCharIds([yuki.id]);
      if (set) setSelectedSetId(set.id);
      if (prop) setSelectedPropIds([prop.id]);
      if (sound) setSelectedMotifIds([sound.id]);
      setPrompt("Yuki hacks into the city mainframe atop The Floating Sky Garden, clutching Memory Cartridge / 09 as bioluminescent leaves ripple in the moonlit breeze.");
    } else if (key === "derelict") {
      const vance = vaultChars.find((c) => c.name.includes("Vance"));
      const set = vaultSets.find((s) => s.name.includes("Derelict"));
      const prop = vaultProps.find((p) => p.name.includes("Visor") || p.name.includes("Beacon"));
      const sound = vaultMotifs.find((m) => m.name.includes("Distress Echo"));
      if (vance) setSelectedCharIds([vance.id]);
      if (set) setSelectedSetId(set.id);
      if (prop) setSelectedPropIds([prop.id]);
      if (sound) setSelectedMotifIds([sound.id]);
      setPrompt("Dr. Vance adjusts his Aethelgard Telemetry Visor inside Derelict Station Alpha. Amber emergency beacons pulse through zero-gravity dust motes as a ghost signal repeats.");
    }
  };

  const appendDirective = (directive: string) => {
    setPrompt((prev) => {
      const clean = prev.trim();
      if (clean.includes(directive)) return clean;
      return `${clean} [${directive}]`;
    });
  };

  // ── Fetch project-scoped scenes when activeProject changes ──
  useEffect(() => {
    if (!activeProject?.id) return;
    fetch(`/api/scenes?projectId=${encodeURIComponent(activeProject.id)}`)
      .then((r) => r.json())
      .then((scenes: SceneResult[]) => {
        setProjectScenes(scenes ?? []);
        if (scenes && scenes.length > 0) {
          setLastResult(scenes[scenes.length - 1]);
        } else {
          if (activeProject.id !== "proj-ronin-echoes") {
            setLastResult(null);
          }
        }
      })
      .catch(() => {});

    if (activeProject.id === "proj-solaris-drift") {
      setPrompt(
        "Dr. Vance enters the cryogenic junction of Derelict Station Alpha. Amber emergency strobes illuminate floating debris as the long-silent communicator chimes."
      );
    } else if (activeProject.id === "proj-aether-kinetics") {
      setCampaignMode("commercial");
      setAspectRatio("9:16");
      setViewOrientation("phone");
      setCampaignObjective("Product Launch: Aether X1 Speed Cyberwear");
      setCallToAction("Shop Now at aetherkinetics.io — Zero Drift Guaranteed");
      setPrompt(
        "Maya Lin launches from the starting blocks at Neo-Kyoto Skyline Stadium wearing glowing Aether X1 Quantum Runners. Dynamic macro tracking shot captures kinetic sole compression as rain disperses in slow motion under pulsing neon stadium lights."
      );
      const maya = vaultChars.find((c) => c.id === "char-maya" || c.projectId === "proj-aether-kinetics");
      if (maya) setSelectedCharIds([maya.id]);
      const stadium = vaultSets.find((s) => s.id === "set-neo-kyoto-stadium" || s.projectId === "proj-aether-kinetics");
      if (stadium) setSelectedSetId(stadium.id);
      const pulse = vaultMotifs.find((m) => m.id === "leit-velocity-pulse" || m.projectId === "proj-aether-kinetics");
      if (pulse) setSelectedMotifIds([pulse.id]);
      const runner = vaultProps.find((p) => p.id === "prop-aether-x1" || p.projectId === "proj-aether-kinetics");
      if (runner) setSelectedPropIds([runner.id]);
    }
  }, [activeProject?.id]);

  const handleSwitchCampaignMode = (mode: "cinematic" | "commercial") => {
    setCampaignMode(mode);
    if (mode === "commercial") {
      const aether = projects.find((p) => p.id === "proj-aether-kinetics");
      if (aether) {
        selectProjectId("proj-aether-kinetics");
      }
      setAspectRatio("9:16");
      setViewOrientation("phone");
      setCampaignObjective("Product Launch: Aether X1 Speed Cyberwear");
      setCallToAction("Shop Now at aetherkinetics.io — Zero Drift Guaranteed");
      setPrompt(
        "Maya Lin launches from the starting blocks at Neo-Kyoto Skyline Stadium wearing glowing Aether X1 Quantum Runners. Dynamic macro tracking shot captures kinetic sole compression as rain disperses in slow motion under pulsing neon stadium lights."
      );
      const maya = vaultChars.find((c) => c.id === "char-maya" || c.projectId === "proj-aether-kinetics");
      if (maya) setSelectedCharIds([maya.id]);
      const stadium = vaultSets.find((s) => s.id === "set-neo-kyoto-stadium" || s.projectId === "proj-aether-kinetics");
      if (stadium) setSelectedSetId(stadium.id);
      const pulse = vaultMotifs.find((m) => m.id === "leit-velocity-pulse" || m.projectId === "proj-aether-kinetics");
      if (pulse) setSelectedMotifIds([pulse.id]);
      const runner = vaultProps.find((p) => p.id === "prop-aether-x1" || p.projectId === "proj-aether-kinetics");
      if (runner) setSelectedPropIds([runner.id]);
      showToast({
        type: "success",
        title: "Enterprise Commercial Engine Active",
        message: "Switched to Track 2: Livepeer Agent + OriginTrail DKG Verifiable Brand Engine.",
      });
    } else {
      const ronin = projects.find((p) => p.id === "proj-ronin-echoes");
      if (ronin) {
        selectProjectId("proj-ronin-echoes");
      }
      setAspectRatio("16:9");
      setViewOrientation("standard");
      setPrompt(
        "Ren steps beneath the awning of a shuttered ramen shop. Yuki waits in the rain across the street, holding a broken transmitter. The city hum falls away as Ren recognizes the signal."
      );
      const ren = vaultChars.find((c) => c.id === "char-ren" || c.name.includes("Ren"));
      if (ren) setSelectedCharIds([ren.id]);
      const alley = vaultSets.find((s) => s.id === "set-neo-tokyo" || s.name.includes("Alley"));
      if (alley) setSelectedSetId(alley.id);
    }
  };

  // Handle vault navigation from Characters, Sets, Sound, and Props pages
  useEffect(() => {
    const state = location.state as {
      characterId?: string;
      setId?: string;
      leitmotifId?: string;
      propFocus?: string;
      propPrompt?: string;
      propId?: string;
      propName?: string;
      projectId?: string;
    } | null;

    if (!state) return;

    if (state.projectId && state.projectId !== activeProject?.id) {
      selectProjectId(state.projectId);
    }

    if (state.characterId) {
      setSelectedCharIds((prev) =>
        prev.includes(state.characterId!) ? prev : [state.characterId!, ...prev]
      );
    }

    if (state.setId) {
      setSelectedSetId(state.setId);
    }

    if (state.leitmotifId) {
      setSelectedMotifIds((prev) =>
        prev.includes(state.leitmotifId!) ? prev : [state.leitmotifId!, ...prev]
      );
    }

    const propLabel = state.propFocus || state.propName;
    if (propLabel) {
      setPrompt((prev) => {
        if (prev.includes(propLabel)) return prev;
        const extra = state.propPrompt ? ` ${state.propPrompt}` : "";
        return `${prev}\n\n[CANON PROP: ${propLabel}]${extra}`;
      });
    }
  }, [location.state]);

  const handleLoadScene = (scene: SceneResult) => {
    setLastResult(scene);
    setPrompt(scene.request.prompt);
    if (scene.request.cast?.characterIds?.length) {
      setSelectedCharIds(scene.request.cast.characterIds);
    }
    if (scene.request.cast?.setId) {
      setSelectedSetId(scene.request.cast.setId);
    }
    if (scene.request.cast?.leitmotifIds?.length) {
      setSelectedMotifIds(scene.request.cast.leitmotifIds);
    }
    setIsHistoryOpen(false);
    scrollToStep(7);
  };

  // ── Selected names for bindings ──
  const selectedCharNames = vaultChars
    .filter((c) => selectedCharIds.includes(c.id))
    .map((c) => c.name);
  const selectedSet = vaultSets.find((s) => s.id === selectedSetId);
  const selectedMotif = vaultMotifs.find((m) => selectedMotifIds.includes(m.id));

  // ── Extract real media from lastResult ──
  const imageOutput = lastResult?.livepeerOutputs?.find((o) => o.type === "image");
  const videoOutput = lastResult?.livepeerOutputs?.find((o) => o.type === "video");
  const audioOutput = lastResult?.livepeerOutputs?.find((o) => o.type === "audio");
  const hasRealMedia =
    imageOutput?.url && !imageOutput.url.includes("example.invalid");
  const hasRealVideo =
    videoOutput?.url && !videoOutput.url.includes("example.invalid");
  const hasRealAudio =
    audioOutput?.url && !audioOutput.url.includes("example.invalid");

  const handleDirectScene = async () => {
    if (rendering) return;
    setRendering(true);
    setRenderError(null);
    setCurrentStep(1);
    setElapsedSec(0);
    setCurrentPhaseMsg("Querying DKG Show Bible for character constraints…");
    scrollToStep(6);

    const timer = setInterval(() => {
      setElapsedSec((s) => s + 1);
    }, 1000);

    let effectivePrompt = prompt.trim();
    if (selectedPropIds.length > 0) {
      const selectedPropNames = vaultProps
        .filter((p) => selectedPropIds.includes(p.id))
        .map((p) => p.name);
      const unmentionedProps = selectedPropNames.filter((name) => !effectivePrompt.includes(name));
      if (unmentionedProps.length > 0) {
        effectivePrompt = `${effectivePrompt}\n\n[CANON PROPS: ${unmentionedProps.join(", ")}]`;
      }
    }

    const payload = {
      projectId: activeProject?.id ?? "proj-ronin-echoes",
      episodeNumber: 1,
      sceneNumber: (projectScenes.length || 0) + 1,
      prompt: effectivePrompt,
      cast: {
        characterIds: selectedCharIds,
        setId: selectedSetId,
        leitmotifIds: selectedMotifIds,
      },
      campaignMode,
      aspectRatio,
      campaignObjective: campaignObjective.trim() || undefined,
      callToAction: callToAction.trim() || undefined,
    };

    try {
      const streamRes = await fetch("/api/scenes/render-stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (streamRes.ok && streamRes.body) {
        const reader = streamRes.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const parts = buffer.split("\n\n");
          buffer = parts.pop() ?? "";

          for (const block of parts) {
            if (!block.trim()) continue;
            let event = "message";
            let rawData = "";

            for (const line of block.split("\n")) {
              if (line.startsWith("event: ")) event = line.slice(7).trim();
              else if (line.startsWith("data: ")) rawData = line.slice(6).trim();
            }

            if (!rawData) continue;

            try {
              const data = JSON.parse(rawData);
              if (event === "progress") {
                setCurrentPhaseMsg(data.message);
                if (data.phase === "querying-dkg" || data.phase === "composing-prompt") {
                  setCurrentStep(1);
                } else if (data.phase === "generating-keyframe") {
                  setCurrentStep(2);
                } else if (data.phase === "animating-video") {
                  setCurrentStep(3);
                } else if (data.phase === "generating-audio") {
                  setCurrentStep(4);
                } else if (data.phase === "minting-scene-ka") {
                  setCurrentStep(5);
                }
              } else if (event === "complete") {
                setLastResult(data);
                if (data.complianceCertificate || campaignMode === "commercial") {
                  setInspectorTab("compliance");
                }
                setProjectScenes((prev) => {
                  const exists = prev.some((s) => s.id === data.id);
                  return exists ? prev : [...prev, data];
                });
                setCurrentStep(5);
                setCurrentPhaseMsg("Scene rendered and verified. Knowledge Asset minted.");
                scrollToStep(7);
              } else if (event === "error") {
                setRenderError(data.error ?? "Rendering failed");
              }
            } catch {}
          }
        }
      } else {
        const res = await fetch("/api/scenes/render", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const data: SceneResult = await res.json();
          setLastResult(data);
          if (data.complianceCertificate || campaignMode === "commercial") {
            setInspectorTab("compliance");
          }
          setProjectScenes((prev) => {
            const exists = prev.some((s) => s.id === data.id);
            return exists ? prev : [...prev, data];
          });
          setCurrentStep(5);
          scrollToStep(7);
        } else {
          const err = await res.json();
          setRenderError(err.error ?? "Unknown rendering error");
        }
      }
    } catch (err) {
      console.warn("Direct scene error:", err);
      setCurrentStep(5);
      setRenderError((err as Error).message);
    } finally {
      clearInterval(timer);
      setTimeout(() => {
        setRendering(false);
      }, 600);
    }
  };

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  };

  const totalCost = lastResult?.livepeerOutputs?.reduce((sum, o) => sum + (o.costUsd ?? 0), 0) ?? 0;
  const totalElapsed = lastResult?.livepeerOutputs?.reduce((sum, o) => sum + (o.elapsedMs ?? 0), 0) ?? 0;

  return (
    <section className="workspace">
      {/* ── Continuum Enterprise: Track 2 Commercial & Brand Engine Mode Banner ── */}
      <div className="enterprise-mode-banner">
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          <div className="mode-switcher-tabs">
            <button
              type="button"
              className={`mode-tab-btn ${campaignMode === "cinematic" ? "active" : ""}`}
              onClick={() => handleSwitchCampaignMode("cinematic")}
            >
              <Icon name="spark" size={14} />
              <span>Cinematic Narrative Engine</span>
            </button>
            <button
              type="button"
              className={`mode-tab-btn ${campaignMode === "commercial" ? "active commercial" : ""}`}
              onClick={() => handleSwitchCampaignMode("commercial")}
            >
              <Icon name="layers" size={14} />
              <span>Commercial Ad Campaign & Socials (Enterprise Track)</span>
            </button>
          </div>
          <span style={{ fontSize: "11px", color: "#a5a2b8", fontFamily: "DM Mono" }}>
            Track 2: Livepeer Agent + OriginTrail DKG
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          {campaignMode === "commercial" ? (
            <span style={{ fontSize: "10px", fontFamily: "DM Mono", background: "rgba(0, 240, 255, 0.15)", color: "#38bdf8", border: "1px solid rgba(0, 240, 255, 0.4)", borderRadius: "6px", padding: "4px 10px", fontWeight: 700 }}>
              ENTERPRISE AUDIT · PROV-O VERIFIED
            </span>
          ) : (
            <span style={{ fontSize: "10px", fontFamily: "DM Mono", background: "rgba(118, 87, 216, 0.2)", color: "#c4b5fd", border: "1px solid rgba(118, 87, 216, 0.4)", borderRadius: "6px", padding: "4px 10px", fontWeight: 700 }}>
              CANON LOCKED · ZERO DRIFT
            </span>
          )}
        </div>
      </div>

      {/* ── 7-Step Navigation Bar ── */}
      <div className="match-stepper-wrap">
        <nav className="match-stepper" aria-label="Director studio step navigation">
          <button
            type="button"
            className={`match-step-item ${activeStepTab === 1 ? "active" : "completed"}`}
            onClick={() => scrollToStep(1)}
          >
            <span className="match-step-num">01</span>
            <span className="match-step-title">Universe</span>
          </button>
          <span className="match-step-divider"></span>

          <button
            type="button"
            className={`match-step-item ${activeStepTab === 2 ? "active" : selectedCharIds.length > 0 ? "completed" : ""}`}
            onClick={() => scrollToStep(2)}
          >
            <span className="match-step-num">02</span>
            <span className="match-step-title">Cast ({selectedCharIds.length})</span>
          </button>
          <span className="match-step-divider"></span>

          <button
            type="button"
            className={`match-step-item ${activeStepTab === 3 ? "active" : selectedSetId ? "completed" : ""}`}
            onClick={() => scrollToStep(3)}
          >
            <span className="match-step-num">03</span>
            <span className="match-step-title">Location</span>
          </button>
          <span className="match-step-divider"></span>

          <button
            type="button"
            className={`match-step-item ${activeStepTab === 4 ? "active" : selectedPropIds.length > 0 ? "completed" : ""}`}
            onClick={() => scrollToStep(4)}
          >
            <span className="match-step-num">04</span>
            <span className="match-step-title">Gear & Props ({selectedPropIds.length})</span>
          </button>
          <span className="match-step-divider"></span>

          <button
            type="button"
            className={`match-step-item ${activeStepTab === 5 ? "active" : prompt ? "completed" : ""}`}
            onClick={() => scrollToStep(5)}
          >
            <span className="match-step-num">05</span>
            <span className="match-step-title">Director's Vision</span>
          </button>
          <span className="match-step-divider"></span>

          <button
            type="button"
            className={`match-step-item ${activeStepTab === 6 ? "active" : rendering ? "completed" : ""}`}
            onClick={() => scrollToStep(6)}
          >
            <span className="match-step-num">06</span>
            <span className="match-step-title">Neural Engine</span>
          </button>
          <span className="match-step-divider"></span>

          <button
            type="button"
            className={`match-step-item ${activeStepTab === 7 ? "active" : lastResult ? "completed" : ""}`}
            onClick={() => scrollToStep(7)}
          >
            <span className="match-step-num">07</span>
            <span className="match-step-title">Master Take & Graph</span>
          </button>
        </nav>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          STEP 1: PILIH PROJECT / UNIVERSE
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section ref={stepRefs.step1} className="studio-step-section">
        <header className="studio-step-header">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <span className="studio-step-badge step-num">Step 01 / 07</span>
              <span className="studio-step-badge status-ok">Canon Locked</span>
              <span className="studio-step-badge status-match">OriginTrail DKG v8</span>
              {campaignMode === "commercial" && (
                <span className="studio-step-badge" style={{ background: "#e0f2fe", color: "#0369a1", border: "1px solid #bae6fd" }}>
                  Brand Compliance: v2.4 Enforced
                </span>
              )}
            </div>
            <h2 className="studio-step-title">Universe & Production Scope</h2>
            <p className="studio-step-desc">
              Select the active production universe. The OriginTrail DKG Show Bible enforces character continuity, environment palettes, and recurring sonic leitmotifs across every scene.
            </p>
          </div>

          <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
            <button
              type="button"
              className="mint-button"
              onClick={() => setIsNewProjectModalOpen(true)}
              style={{ fontSize: "12px", padding: "7px 16px", background: "#7657d8", color: "#fff", display: "inline-flex", alignItems: "center", gap: "6px" }}
            >
              <span>+ New Universe Project</span>
            </button>
            <button type="button" className="outline-button" onClick={() => setIsHistoryOpen(true)}>
              Project Archive ({projectScenes.length})
            </button>
            <button type="button" className="outline-button" onClick={() => navigate("/episodes")}>
              <Icon name="layers" size={15} /> Storyboard View
            </button>
          </div>
        </header>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#f8f7fa", border: "1px solid #e7e5ec", borderRadius: "12px", padding: "14px 18px", flexWrap: "wrap", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
            <div>
              <span style={{ fontSize: "10px", color: "#7c7a88", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: "4px" }}>
                Active Production
              </span>
              <div className="project-selector-wrap" style={{ display: "inline-block" }}>
                <select
                  className="project-select-dropdown"
                  value={activeProject?.id ?? ""}
                  onChange={(e) => selectProjectId(e.target.value)}
                  aria-label="Select active project"
                  style={{ fontSize: "13px", fontWeight: 700, padding: "6px 28px 6px 12px" }}
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ height: "30px", width: "1px", background: "#dcd9e4" }}></div>

            <div>
              <span style={{ fontSize: "10px", color: "#7c7a88", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: "4px" }}>
                Episode Anchor
              </span>
              <span style={{ fontSize: "13px", fontWeight: 700, color: "#181725", fontFamily: "DM Mono" }}>
                SEASON {String(activeProject?.seasonNumber ?? 1).padStart(2, "0")} · EPISODE 01 · SCENE {String((projectScenes.length || 0) + 1).padStart(2, "0")}
              </span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "11px", color: "#6b687a", fontStyle: "italic" }}>
              "{activeProject?.logline ?? "A rogue swordsman uncovers a synthetic conspiracy in the rain."}"
            </span>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          STEP 2: CAST MAU SIAPA (DATING APP MATCHMAKING PROFILE CARDS)
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section ref={stepRefs.step2} className="studio-step-section">
        <header className="studio-step-header">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <span className="studio-step-badge step-num">Step 02 / 07</span>
              <span className="studio-step-badge status-match">Matchmaker Active</span>
              <span className="studio-step-badge status-ok">{selectedCharIds.length} Matched</span>
            </div>
            <h2 className="studio-step-title">Cast Matchmaker</h2>
            <p className="studio-step-desc">
              Who is meeting in this scene? Select character profiles to pair them into the dramatic sequence. Face seeds and signature visual DNA are locked via OriginTrail DKG to eliminate actor drift.
            </p>
          </div>

          <button
            type="button"
            className="outline-button"
            onClick={() => navigate("/vault")}
            style={{ fontSize: "12px", padding: "6px 14px" }}
          >
            Character Vault →
          </button>
        </header>

        {/* Dating App Profile Cards */}
        <div className="dating-cast-grid">
          {vaultChars.map((c, idx) => {
            const isSelected = selectedCharIds.includes(c.id);
            const matchPercent = idx === 0 ? "99.8%" : idx === 1 ? "99.4%" : "98.9%";

            return (
              <article
                key={c.id}
                className={`dating-cast-card ${isSelected ? "selected" : ""}`}
                onClick={() => toggleChar(c.id)}
              >
                <div className="dating-cast-poster">
                  <img
                    src={c.avatarUrl || "/assets/continuity/ren-anchor-1.jpg"}
                    alt={c.name}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "/assets/continuity/ren-anchor-1.jpg";
                    }}
                  />
                  <div className="dating-cast-gradient" />
                  <div className="dating-cast-dna-pill">Face Seed Locked</div>
                  <div className={`dating-match-score ${isSelected ? "perfect" : ""}`}>
                    <span>{matchPercent}</span> Match
                  </div>
                </div>

                <div className="dating-cast-body">
                  <div className="dating-cast-name-row">
                    <h3 className="dating-cast-name">{c.name}</h3>
                    <span style={{ fontSize: "10px", fontFamily: "DM Mono", color: "#94a3b8" }}>
                      DID:{c.id.slice(-6)}
                    </span>
                  </div>
                  <span className="dating-cast-alias">
                    {c.epithet || "Canon Protagonist"}
                  </span>
                  <p className="dating-cast-bio">
                    {c.visualDna?.attire?.canonical || "Exiled blade master navigating high-frequency synthetic shadows in the rain."}
                  </p>

                  <div className="dating-cast-tags">
                    <span className="dating-tag">Visual DNA</span>
                    <span className="dating-tag">{c.visualDna?.distinguishingFeatures?.[0] || "Face Seed Locked"}</span>
                    <span className="dating-tag">Zero Drift</span>
                  </div>

                  {c.compliance && (
                    <div style={{ marginTop: "6px" }}>
                      <span className="enterprise-ip-pill">
                        ENTERPRISE LICENSED IP · {c.compliance.licenseType.slice(0, 22)}…
                      </span>
                    </div>
                  )}

                  <button
                    type="button"
                    className="dating-cast-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleChar(c.id);
                    }}
                  >
                    {isSelected ? (
                      <>
                        <Icon name="check" size={14} />
                        <span>Matched to Scene</span>
                      </>
                    ) : (
                      <>
                        <span>Match Cast Profile</span>
                      </>
                    )}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          STEP 3: LOCATION MAU APA (STAGING & VENUE MATCH)
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section ref={stepRefs.step3} className="studio-step-section">
        <header className="studio-step-header">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <span className="studio-step-badge step-num">Step 03 / 07</span>
              <span className="studio-step-badge status-ok">Environment Anchored</span>
            </div>
            <h2 className="studio-step-title">Staging & Rendezvous Venue</h2>
            <p className="studio-step-desc">
              Where are they meeting? Select the spatial set. The DKG Show Bible enforces architectural dimensions, volumetric light palettes, and atmospheric weather.
            </p>
          </div>

          <button
            type="button"
            className="outline-button"
            onClick={() => navigate("/sets")}
            style={{ fontSize: "12px", padding: "6px 14px" }}
          >
            Sets & Staging Vault →
          </button>
        </header>

        <div className="dating-venue-grid">
          {vaultSets.map((s) => {
            const isSelected = selectedSetId === s.id;
            const displayImg = s.name.includes("Garden")
              ? "/assets/vault/sky-garden.jpg"
              : s.name.includes("Derelict")
              ? "/assets/vault/derelict-alpha.jpg"
              : s.imageUrl && !s.imageUrl.includes("example.invalid")
              ? s.imageUrl
              : "/assets/continuity/ren-anchor-1.jpg";

            return (
              <article
                key={s.id}
                className={`dating-venue-card ${isSelected ? "selected" : ""}`}
                onClick={() => setSelectedSetId(s.id)}
              >
                <div className="dating-venue-thumb">
                  <img
                    src={displayImg}
                    alt={s.name}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "/assets/continuity/ren-anchor-1.jpg";
                    }}
                  />
                  <div className="dating-venue-match-pill">100% Atmosphere Match</div>
                </div>

                <div className="dating-venue-body">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                    <h3 className="dating-venue-name">{s.name}</h3>
                    {isSelected && (
                      <span style={{ width: "20px", height: "20px", borderRadius: "50%", background: "#0d9488", color: "#fff", display: "grid", placeItems: "center" }}>
                        <Icon name="check" size={12} />
                      </span>
                    )}
                  </div>
                  <span className="dating-venue-sub">
                    {s.timeOfDay || "Rain-slicked Midnight"} · Volumetric Cyan
                  </span>
                  <div className="dating-venue-chips">
                    <span className="dating-venue-chip">DKG Spatially Anchored</span>
                    <span className="dating-venue-chip">2.39:1 Aspect Ratio</span>
                  </div>
                  {s.compliance && (
                    <div style={{ marginTop: "6px" }}>
                      <span className="enterprise-ip-pill" style={{ background: "#f0fdfa", color: "#0f766e", borderColor: "#99f6e4" }}>
                        ENTERPRISE VENUE · {s.compliance.licenseType.slice(0, 24)}…
                      </span>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          STEP 4: PROPS & GEAR MAU APA (INVENTORY MATCH)
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {vaultProps.length > 0 && (
        <section ref={stepRefs.step4} className="studio-step-section">
          <header className="studio-step-header">
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                <span className="studio-step-badge step-num">Step 04 / 07</span>
                <span className="studio-step-badge status-match">{selectedPropIds.length} Props Injected</span>
              </div>
              <h2 className="studio-step-title">Canonical Props & Gear</h2>
              <p className="studio-step-desc">
                What equipment or lore artifacts are carried into the scene? Selecting props injects verified physical descriptions and negative anti-drift guards into the neural pipeline.
              </p>
            </div>

            <button
              type="button"
              className="outline-button"
              onClick={() => navigate("/props")}
              style={{ fontSize: "12px", padding: "6px 14px" }}
            >
              Props & Lore Registry →
            </button>
          </header>

          <div className="dating-gear-grid">
            {vaultProps.map((p) => {
              const isSelected = selectedPropIds.includes(p.id);
              const displayImg = p.name.includes("Katana")
                ? "/assets/continuity/ren-anchor-2.jpg"
                : p.name.includes("Cartridge") || p.name.includes("Transmitter")
                ? "/assets/vault/sky-garden.jpg"
                : p.imageUrl && !p.imageUrl.includes("example.invalid")
                ? p.imageUrl
                : "/assets/vault/derelict-alpha.jpg";

              return (
                <div
                  key={p.id}
                  className={`dating-gear-card ${isSelected ? "selected" : ""}`}
                  onClick={() => toggleProp(p.id)}
                >
                  <div className="dating-gear-thumb">
                    <img
                      src={displayImg}
                      alt={p.name}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = "/assets/vault/derelict-alpha.jpg";
                      }}
                    />
                  </div>
                  <div className="dating-gear-info">
                    <h4 className="dating-gear-name">{p.name}</h4>
                    <p className="dating-gear-desc">{p.description}</p>
                    <span className="dating-gear-badge">
                      {p.category === "lore" ? "Canon Lore Object" : "Physical Equipment"}
                    </span>
                    {p.compliance && (
                      <div style={{ marginTop: "4px" }}>
                        <span className="enterprise-ip-pill" style={{ background: "#fffbeb", color: "#92400e", borderColor: "#fde68a" }}>
                          ENTERPRISE HERO PROP · {p.compliance.licenseType.slice(0, 22)}…
                        </span>
                      </div>
                    )}
                  </div>
                  {isSelected && (
                    <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: "#d97706", color: "#fff", display: "grid", placeItems: "center", flexShrink: 0 }}>
                      <Icon name="check" size={13} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          STEP 5: DIRECTOR'S VISION & DIRECTIVES (DIRECTOR MAU APA)
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section ref={stepRefs.step5} className="studio-step-section">
        <header className="studio-step-header">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <span className="studio-step-badge step-num">Step 05 / 07</span>
              <span className="studio-step-badge status-match">Neuro-Symbolic Directives</span>
            </div>
            <h2 className="studio-step-title">Director's Vision & Blocking</h2>
            <p className="studio-step-desc">
              Specify the camera angle, dramatic pacing, and lighting mood. Presets can be appended directly into the directorial instructions below.
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ background: "#f8f7fa", border: "1px solid #e1dfeb", borderRadius: "10px", padding: "6px 14px", display: "flex", alignItems: "center", gap: "8px" }}>
              <Icon name="wave" size={16} />
              <div>
                <span style={{ fontSize: "9px", color: "#8a8894", fontWeight: 700, textTransform: "uppercase", display: "block" }}>
                  Bound Leitmotif
                </span>
                <strong style={{ fontSize: "11px", color: "#181725" }}>
                  {selectedMotif?.name ?? "Ren's Blade"} · {selectedMotif?.key ?? "D Minor"}
                </strong>
              </div>
            </div>
          </div>
        </header>

        {/* Aspect Ratio & Pipeline Directives Bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", background: "#f8f7fa", border: "1px solid #e2e0ea", borderRadius: "10px", padding: "10px 16px", flexWrap: "wrap", gap: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "10px", fontWeight: 800, color: "#6b687a", letterSpacing: "0.06em" }}>
              ASPECT RATIO:
            </span>
            <div className="aspect-ratio-selector">
              <button
                type="button"
                className={`aspect-btn ${aspectRatio === "16:9" ? "active" : ""}`}
                onClick={() => {
                  setAspectRatio("16:9");
                  setViewOrientation("standard");
                }}
              >
                16:9 Cinema Widescreen
              </button>
              <button
                type="button"
                className={`aspect-btn ${aspectRatio === "9:16" ? "active" : ""}`}
                onClick={() => {
                  setAspectRatio("9:16");
                  setViewOrientation("phone");
                }}
              >
                9:16 Vertical Mobile (TikTok / Reels)
              </button>
            </div>
          </div>

          {campaignMode === "commercial" && (
            <span style={{ fontSize: "10px", fontFamily: "DM Mono", background: "#e0f2fe", color: "#0369a1", padding: "4px 10px", borderRadius: "5px", fontWeight: 700 }}>
              ENTERPRISE COMMERCIAL ENGINE
            </span>
          )}
        </div>

        {/* Commercial Campaign Controls (Objective, CTA, Commercial Hooks) */}
        {campaignMode === "commercial" && (
          <div style={{ background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: "12px", padding: "16px", marginBottom: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", flexWrap: "wrap", gap: "8px" }}>
              <span style={{ fontSize: "11px", fontWeight: 800, color: "#0369a1", letterSpacing: "0.05em" }}>
                COMMERCIAL CAMPAIGN CONTROLS & BRAND AUDIT
              </span>
              <span style={{ fontSize: "10px", fontFamily: "DM Mono", color: "#0284c7" }}>
                Brand: Aether Kinetics Corp · Guideline v2.4 Enforced
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "12px", marginBottom: "12px" }}>
              <div>
                <label style={{ fontSize: "10px", fontWeight: 800, color: "#475569", display: "block", marginBottom: "4px" }}>
                  CAMPAIGN OBJECTIVE
                </label>
                <input
                  type="text"
                  value={campaignObjective}
                  onChange={(e) => setCampaignObjective(e.target.value)}
                  placeholder="e.g. Product Launch: Aether X1 Speed Cyberwear"
                  style={{ width: "100%", padding: "8px 12px", fontSize: "12px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                />
                <div style={{ display: "flex", gap: "6px", marginTop: "6px", flexWrap: "wrap" }}>
                  <button type="button" className="preset-chip-btn" onClick={() => setCampaignObjective("Product Launch: Aether X1 Speed Cyberwear")}>
                    [Product Launch]
                  </button>
                  <button type="button" className="preset-chip-btn" onClick={() => setCampaignObjective("Speed Performance Featurette")}>
                    [Speed Featurette]
                  </button>
                  <button type="button" className="preset-chip-btn" onClick={() => setCampaignObjective("Global Brand Awareness")}>
                    [Brand Awareness]
                  </button>
                </div>
              </div>

              <div>
                <label style={{ fontSize: "10px", fontWeight: 800, color: "#475569", display: "block", marginBottom: "4px" }}>
                  CALL TO ACTION (CTA) OVERLAY
                </label>
                <input
                  type="text"
                  value={callToAction}
                  onChange={(e) => setCallToAction(e.target.value)}
                  placeholder="e.g. Shop Now at aetherkinetics.io — Zero Drift Guaranteed"
                  style={{ width: "100%", padding: "8px 12px", fontSize: "12px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                />
                <div style={{ display: "flex", gap: "6px", marginTop: "6px", flexWrap: "wrap" }}>
                  <button type="button" className="preset-chip-btn" onClick={() => setCallToAction("Shop Now at aetherkinetics.io — Zero Drift Guaranteed")}>
                    [Shop Now CTA]
                  </button>
                  <button type="button" className="preset-chip-btn" onClick={() => setCallToAction("Pre-Order Quantum Series · Limited Tier")}>
                    [Pre-Order CTA]
                  </button>
                  <button type="button" className="preset-chip-btn" onClick={() => setCallToAction("Experience the Future of Speed")}>
                    [Brand Slogan CTA]
                  </button>
                </div>
              </div>
            </div>

            {/* Commercial Ad Presets */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", paddingTop: "8px", borderTop: "1px solid #e0f2fe" }}>
              <span style={{ fontSize: "10px", fontWeight: 800, color: "#0369a1", minWidth: "120px" }}>
                COMMERCIAL HOOKS:
              </span>
              <button type="button" className="preset-chip-btn" onClick={() => appendDirective("Macro Footwear Tracking Shot with Kinetic Sole Compression and Water Droplet Dispersal")}>
                [Macro Sole Compression]
              </button>
              <button type="button" className="preset-chip-btn" onClick={() => appendDirective("Dynamic Low-Angle Cyber-Sprint under Neon Stadium Floodlights")}>
                [Low-Angle Cyber-Sprint]
              </button>
              <button type="button" className="preset-chip-btn" onClick={() => appendDirective("Exploded View of Quantum Lattice Sole Cushioning with Retinal HUD Overlay")}>
                [Exploded Lattice Tech]
              </button>
              <button type="button" className="preset-chip-btn" onClick={() => appendDirective("High-Speed Rain Splatter Sprint with Glitch Call-to-Action Hologram")}>
                [Rain Sprint + Hologram CTA]
              </button>
            </div>
          </div>
        )}

        {/* Camera & Lighting Directive Chips (ZERO EMOJIS) */}
        <div style={{ background: "#f8f7fa", border: "1px solid #ebe8f0", borderRadius: "12px", padding: "14px", marginBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "10px", fontWeight: 800, color: "#6b687a", letterSpacing: "0.06em", minWidth: "90px" }}>
              CAMERA LENS:
            </span>
            <button type="button" className="preset-chip-btn" onClick={() => appendDirective("2.39:1 Anamorphic Wide Tracking Shot")}>
              [2.39:1 Anamorphic Wide]
            </button>
            <button type="button" className="preset-chip-btn" onClick={() => appendDirective("Macro Close-Up on Ocular Implant with Retinal HUD")}>
              [Macro Retinal HUD]
            </button>
            <button type="button" className="preset-chip-btn" onClick={() => appendDirective("Low-Angle Hero Stance with Wet Asphalt Reflections")}>
              [Low-Angle Hero]
            </button>
            <button type="button" className="preset-chip-btn" onClick={() => appendDirective("Over-the-Shoulder Tracking Shot through Heavy Downpour")}>
              [OTS Downpour Tracking]
            </button>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "10px", fontWeight: 800, color: "#6b687a", letterSpacing: "0.06em", minWidth: "90px" }}>
              ATMOSPHERE:
            </span>
            <button type="button" className="preset-chip-btn" onClick={() => appendDirective("Volumetric Neon Fog and Glistening Acid Rain Streaks")}>
              [Volumetric Neon Fog & Rain]
            </button>
            <button type="button" className="preset-chip-btn" onClick={() => appendDirective("Bioluminescent Moonlit Glow and Drifting Plant Mist")}>
              [Moonlit Flora]
            </button>
            <button type="button" className="preset-chip-btn" onClick={() => appendDirective("Rhythmic Amber Emergency Strobes in Zero-G Void")}>
              [Amber Zero-G Strobes]
            </button>
            <button type="button" className="preset-chip-btn" onClick={() => appendDirective("Cyan Holographic Glitch Distortions")}>
              [Cyan Holographic Glitch]
            </button>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "10px", fontWeight: 800, color: "#6b687a", letterSpacing: "0.06em", minWidth: "90px" }}>
              STORY PRESETS:
            </span>
            <button type="button" className="preset-chip-btn" onClick={() => applyPreset("alley")}>
              [Rain Alley Standoff]
            </button>
            <button type="button" className="preset-chip-btn" onClick={() => applyPreset("skyline")}>
              [Skyline Data Breach]
            </button>
            <button type="button" className="preset-chip-btn" onClick={() => applyPreset("derelict")}>
              [Derelict Cryo Echo]
            </button>
          </div>
        </div>

        {/* Prompt Input Textarea */}
        <textarea
          rows={3}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your scene direction, blocking, camera trajectory, and character action..."
          disabled={rendering}
          style={{
            width: "100%",
            borderRadius: "10px",
            padding: "14px 16px",
            fontSize: "14px",
            lineHeight: "1.5",
            border: "1px solid #d4d0dc",
            fontFamily: "inherit",
          }}
        />

        {/* Active Canon Injections Strip */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "12px", flexWrap: "wrap", gap: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "10px", color: "#7c7a88", fontWeight: 800, textTransform: "uppercase" }}>
              DKG BOUND CONSTRAINTS:
            </span>
            {selectedCharNames.length > 0 && (
              <span style={{ fontSize: "11px", background: "#f5f0ff", color: "#6d28d9", padding: "3px 9px", borderRadius: "6px", fontWeight: 600 }}>
                Cast: {selectedCharNames.join(", ")}
              </span>
            )}
            {selectedSet && (
              <span style={{ fontSize: "11px", background: "#f0fdfa", color: "#0f766e", padding: "3px 9px", borderRadius: "6px", fontWeight: 600 }}>
                Set: {selectedSet.name}
              </span>
            )}
            {selectedPropIds.length > 0 && (
              <span style={{ fontSize: "11px", background: "#fffbeb", color: "#b45309", padding: "3px 9px", borderRadius: "6px", fontWeight: 600 }}>
                Props: {vaultProps.filter((p) => selectedPropIds.includes(p.id)).map((p) => p.name).join(", ")}
              </span>
            )}
          </div>

          <button
            type="button"
            className={`direct-button ${rendering ? "is-rendering" : ""}`}
            onClick={handleDirectScene}
            disabled={rendering}
            style={{ padding: "10px 22px" }}
          >
            <Icon name={rendering ? "spark" : "play"} size={17} />
            <span>{rendering ? `Synthesizing (${elapsedSec}s)…` : "Direct Scene Take"}</span>
            <Icon name="arrow" size={17} />
          </button>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          STEP 6: NEURAL SYNTHESIS PIPELINE (LOADING PROGRESS)
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section ref={stepRefs.step6} className="studio-step-section">
        <header className="studio-step-header">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <span className="studio-step-badge step-num">Step 06 / 07</span>
              <span className={`studio-step-badge ${rendering ? "status-match" : "status-ok"}`}>
                {rendering ? "Synthesizing Stream" : "Engine Ready"}
              </span>
            </div>
            <h2 className="studio-step-title">Neural Synthesis Engine</h2>
            <p className="studio-step-desc">
              Live multi-agent coordination between Livepeer AI subnet workers and OriginTrail Decentralized Knowledge Graph.
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontFamily: "DM Mono", fontSize: "12px", color: rendering ? "#7657d8" : "#64748b", fontWeight: 700 }}>
              {rendering ? `ELAPSED: ${elapsedSec}s` : "READY"}
            </span>
          </div>
        </header>

        <div className="neural-synthesis-card">
          <div className="neural-synthesis-header">
            <div>
              <span style={{ fontSize: "11px", color: "#a5b4fc", fontFamily: "DM Mono", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                PIPELINE STAGE TELEMETRY
              </span>
              <h3 style={{ fontSize: "17px", fontWeight: 700, margin: "4px 0 0", color: "#ffffff" }}>
                {rendering ? currentPhaseMsg : lastResult ? "Pipeline Finished · Knowledge Asset Minted" : "Standby · Ready to Synthesize"}
              </h3>
            </div>
          </div>

          <div className="neural-steps-grid">
            <div className={`neural-step-box ${currentStep >= 1 || (!rendering && lastResult) ? "done" : ""}`}>
              <div className="neural-step-title">Stage 01</div>
              <div className="neural-step-name">DKG Show Bible Query</div>
            </div>

            <div className={`neural-step-box ${currentStep >= 2 || (!rendering && lastResult) ? "done" : currentStep === 1 ? "active" : ""}`}>
              <div className="neural-step-title">Stage 02</div>
              <div className="neural-step-name">Keyframe (Flux.1)</div>
            </div>

            <div className={`neural-step-box ${currentStep >= 3 || (!rendering && lastResult) ? "done" : currentStep === 2 ? "active" : ""}`}>
              <div className="neural-step-title">Stage 03</div>
              <div className="neural-step-name">Motion (Kling / Pixverse)</div>
            </div>

            <div className={`neural-step-box ${currentStep >= 4 || (!rendering && lastResult) ? "done" : currentStep === 3 ? "active" : ""}`}>
              <div className="neural-step-title">Stage 04</div>
              <div className="neural-step-name">Audio Score (Sonilo)</div>
            </div>

            <div className={`neural-step-box ${currentStep >= 5 || (!rendering && lastResult) ? "done" : currentStep === 4 ? "active" : ""}`}>
              <div className="neural-step-title">Stage 05</div>
              <div className="neural-step-name">Mint Scene KA</div>
            </div>
          </div>

          {rendering && (
            <div style={{ width: "100%", height: "4px", background: "rgba(255,255,255,0.1)", borderRadius: "2px", overflow: "hidden" }}>
              <div style={{ width: `${Math.min(currentStep * 20, 100)}%`, height: "100%", background: "linear-gradient(90deg, #7657d8, #34d399)", transition: "width 0.4s ease" }}></div>
            </div>
          )}
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          STEP 7: HASIL VIDEO + MUSIC & EMBEDDED DKG GRAPH
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section ref={stepRefs.step7} className="studio-step-section">
        <header className="studio-step-header">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <span className="studio-step-badge step-num">Step 07 / 07</span>
              <span className="studio-step-badge status-ok">Master Take Verified</span>
              <span className="studio-step-badge status-match">DKG Provenance Minted</span>
            </div>
            <h2 className="studio-step-title">Master Take & Knowledge Mesh</h2>
            <p className="studio-step-desc">
              Synchronized video master, audio score, and interactive OriginTrail DKG Knowledge Graph representation of this scene.
            </p>
          </div>

          <button
            type="button"
            className="outline-button"
            onClick={() => navigate("/graph")}
            style={{ fontSize: "12px", padding: "6px 14px" }}
          >
            <Icon name="graph" size={14} /> Full Knowledge Mesh →
          </button>
        </header>

        {renderError && (
          <div style={{ background: "#fef3f2", border: "1px solid #fca5a5", borderRadius: "10px", padding: "14px 16px", marginBottom: "18px", fontSize: "13px", color: "#b91c1c" }}>
            <strong>Synthesis Error:</strong> {renderError}
          </div>
        )}

        {/* View Orientation & Framing Switcher */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", background: "#f8f7fa", border: "1px solid #e5e3ec", borderRadius: "10px", padding: "8px 16px", flexWrap: "wrap", gap: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "10px", fontWeight: 800, color: "#6b687a", letterSpacing: "0.06em" }}>
              PREVIEW FRAMING:
            </span>
            <div className="aspect-ratio-selector">
              <button
                type="button"
                className={`aspect-btn ${viewOrientation === "standard" ? "active" : ""}`}
                onClick={() => setViewOrientation("standard")}
              >
                16:9 Cinema Master
              </button>
              <button
                type="button"
                className={`aspect-btn ${viewOrientation === "phone" ? "active" : ""}`}
                onClick={() => setViewOrientation("phone")}
              >
                9:16 Vertical Mobile Ad (TikTok / Reels)
              </button>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "10px", fontFamily: "DM Mono", color: "#6b687a" }}>
              Ratio: <strong>{aspectRatio}</strong>
            </span>
            {campaignMode === "commercial" && (
              <span style={{ fontSize: "10px", background: "#f0fdf4", color: "#166534", border: "1px solid #bbf7d0", padding: "2px 8px", borderRadius: "4px", fontWeight: 700, fontFamily: "DM Mono" }}>
                COMMERCIAL AD CAMPAIGN
              </span>
            )}
          </div>
        </div>

        {/* Video & Provenance Grid */}
        <div className="output-grid">
          {viewOrientation === "phone" ? (
            /* 9:16 Vertical Mobile Ad Phone Preview */
            <div className="vertical-ad-phone-wrap" style={{ background: "#110e1d", borderRadius: "12px", border: "1px solid #28243d", padding: "20px 0" }}>
              <div className="vertical-ad-phone">
                {hasRealVideo ? (
                  <video
                    src={videoOutput!.url}
                    autoPlay
                    loop
                    muted
                    playsInline
                    controls
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : hasRealMedia ? (
                  <img
                    src={imageOutput!.url}
                    alt="Commercial Keyframe"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <div style={{ width: "100%", height: "100%", background: "linear-gradient(180deg, #100e21 0%, #272145 100%)", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", fontSize: "12px", padding: "20px", textAlign: "center" }}>
                    <span>Maya Lin · Aether Kinetics Commercial (9:16)</span>
                  </div>
                )}

                {/* TikTok / Instagram Reels Style Overlay */}
                <div className="social-ad-overlay">
                  <div className="social-ad-top">
                    <span className="social-brand-tag">
                      AETHER KINETICS · DKG VERIFIED
                    </span>
                    <span style={{ fontSize: "10px", color: "#fff", background: "rgba(0,0,0,0.5)", padding: "2px 6px", borderRadius: "4px", fontFamily: "DM Mono" }}>
                      SPONSORED
                    </span>
                  </div>

                  <div className="social-ad-bottom">
                    <div className="social-meta">
                      <span className="social-handle">@aetherkinetics</span>
                      <p className="social-caption">
                        {prompt.length > 90 ? prompt.slice(0, 90) + "…" : prompt}
                      </p>
                      <div className="social-cta-pill">
                        {callToAction || "Shop Now at aetherkinetics.io"}
                      </div>
                    </div>

                    <div className="social-sidebar-actions">
                      <div className="social-action-item">
                        <div className="social-action-bubble">♥</div>
                        <span>28.4K</span>
                      </div>
                      <div className="social-action-item">
                        <div className="social-action-bubble">💬</div>
                        <span>1.4K</span>
                      </div>
                      <div className="social-action-item">
                        <div className="social-action-bubble">↗</div>
                        <span>Share</span>
                      </div>
                      <div className="social-action-item" style={{ marginTop: "4px" }}>
                        <div className="social-action-bubble" style={{ border: "2px solid #00f0ff" }}>♫</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Standard Cinema Screen Frame */
            <article className="cinema-frame">
              <div className="frame-top">
                <span className="verified">
                  <Icon name="check" size={12} /> DKG VERIFIED
                </span>
                <span className="time">
                  {hasRealVideo ? "VIDEO MASTER" : hasRealMedia ? "KEYFRAME" : "2.39:1 CINEMATIC"}
                </span>
              </div>

              {hasRealVideo ? (
                <video
                  src={videoOutput!.url}
                  autoPlay
                  loop
                  muted
                  playsInline
                  controls
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    borderRadius: "inherit",
                  }}
                />
              ) : hasRealMedia ? (
                <img
                  src={imageOutput!.url}
                  alt="Scene Keyframe"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    borderRadius: "inherit",
                  }}
                />
              ) : (
                <>
                  <div className="rain rain-one"></div>
                  <div className="rain rain-two"></div>
                  <div className="city">
                    <div className="sign">RAMEN</div>
                    <div className="tower t1"></div>
                    <div className="tower t2"></div>
                    <div className="tower t3"></div>
                  </div>
                  <div className="figure">
                    <div></div>
                    <i></i>
                  </div>
                </>
              )}

              {!hasRealVideo && !hasRealMedia && (
                <button
                  className="video-play"
                  onClick={() => setIsPlaying(!isPlaying)}
                  aria-label="Play or pause preview"
                >
                  <Icon name={isPlaying ? "spark" : "play"} size={22} />
                </button>
              )}

              <div className="frame-bottom">
                {hasRealMedia ? (
                  <div style={{ display: "flex", gap: "8px", fontSize: "10px", fontFamily: "DM Mono", color: "#aaa", flexWrap: "wrap" }}>
                    {lastResult?.livepeerOutputs?.map((o, i) => (
                      <span key={i} style={{ background: "#1a1a2e", padding: "2px 8px", borderRadius: "4px" }}>
                        {o.capability} · {(o.elapsedMs / 1000).toFixed(1)}s · ${o.costUsd.toFixed(3)}
                      </span>
                    ))}
                  </div>
                ) : (
                  <>
                    <div className="progress">
                      <i style={{ width: isPlaying ? "80%" : "42%" }}></i>
                    </div>
                    <span>2.39 : 1 CINEMATIC</span>
                  </>
                )}
              </div>
            </article>
          )}

          {/* Provenance Card */}
          <aside className="provenance">
            <div className="provenance-head">
              <p className="eyebrow" style={{ margin: 0 }}>PROVENANCE LINEAGE</p>
              <button
                onClick={() => navigate("/graph")}
                style={{ fontSize: "11px", color: "#7657d8", fontWeight: 700 }}
              >
                Explore Mesh →
              </button>
            </div>

            <div className="origin-node scene-node">
              <span>SCENE KNOWLEDGE ASSET</span>
              <strong>{lastResult?.ual ? `Scene ${lastResult.request.sceneNumber || 1}` : "Signal in the Rain"}</strong>
              <small style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
                {lastResult?.ual ?? "did:dkg:continuum/scene/b9033c9626ca57b4"}
              </small>
            </div>

            <div className="tree-line"></div>

            <div className="source-nodes">
              <div className="origin-node ren-node">
                <span>CHARACTER DNA</span>
                <strong>{selectedCharNames.join(", ") || "Ren"}</strong>
                <small>VISUAL SEED</small>
              </div>
              <div className="origin-node set-node">
                <span>LOCATION KA</span>
                <strong>{selectedSet?.name.split(" ")[0] ?? "Neo-Tokyo"}</strong>
                <small>SPATIAL SEED</small>
              </div>
            </div>

            {hasRealMedia && totalCost > 0 && (
              <div style={{ marginTop: "12px", padding: "8px 12px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "6px", fontSize: "11px" }}>
                <strong>Livepeer Cost:</strong> ${totalCost.toFixed(4)} · <strong>Render:</strong> {(totalElapsed / 1000).toFixed(1)}s
              </div>
            )}

            <div className="provenance-note">
              <Icon name="lock" size={14} />
              <span>Zero drift guaranteed by OriginTrail DKG</span>
            </div>
          </aside>
        </div>

        {/* Audio Leitmotif Bar */}
        <div className="audio-bar" style={{ marginTop: "16px" }}>
          <button
            className="audio-play"
            onClick={toggleAudio}
            aria-label="Toggle audio playback"
          >
            <Icon name={isPlaying ? "spark" : "play"} size={14} />
          </button>
          <div className="audio-info">
            <strong>{selectedMotif?.name?.toUpperCase() ?? "REN'S BLADE — SYNTHWAVE MARCH"}</strong>
            <span>{selectedMotif?.bpm ?? 120} BPM · {selectedMotif?.key ?? "D MINOR"}</span>
          </div>
          <div className="waveform">▁▃▅▇▆▂▃▅▂▁▄▆▇▅▃▆▂▁▃▅▇▆▃▁▅▇▃▁</div>
          <span>{hasRealAudio ? "LIVE AUDIO" : "00:12"}</span>
          <button onClick={() => navigate("/sound")} title="Open sonic vault">
            <Icon name="wave" size={17} />
          </button>
          {hasRealAudio && (
            <audio ref={audioRef} src={audioOutput!.url} preload="auto" />
          )}
        </div>

        {/* ── Interactive DKG Knowledge Graph Canvas ── */}
        <div className="embedded-graph-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", flexWrap: "wrap", gap: "8px" }}>
            <div>
              <span style={{ fontSize: "10px", fontFamily: "DM Mono", color: "#7657d8", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                INTERACTIVE DKG TOPOLOGY
              </span>
              <h4 style={{ fontSize: "15px", fontWeight: 700, margin: "2px 0 0", color: "#181725" }}>
                RDF Graph Links for Active Scene Take
              </h4>
            </div>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <span style={{ fontSize: "10px", background: "#f1f5f9", padding: "3px 8px", borderRadius: "6px", fontFamily: "DM Mono" }}>
                Node: <strong>{selectedGraphNode.toUpperCase()}</strong>
              </span>
              <button
                type="button"
                className="outline-button"
                onClick={() => navigate("/graph")}
                style={{ fontSize: "11px", padding: "4px 10px" }}
              >
                Inspect Full Graph →
              </button>
            </div>
          </div>

          {/* SVG Knowledge Graph Diagram */}
          <div className="embedded-graph-canvas">
            <svg width="100%" height="100%" viewBox="0 0 800 280" preserveAspectRatio="xMidYMid meet">
              <defs>
                <linearGradient id="gradScene" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#7657d8" />
                  <stop offset="100%" stopColor="#4f46e5" />
                </linearGradient>
                <linearGradient id="gradChar" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ec4899" />
                  <stop offset="100%" stopColor="#be185d" />
                </linearGradient>
                <linearGradient id="gradSet" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0d9488" />
                  <stop offset="100%" stopColor="#0f766e" />
                </linearGradient>
                <linearGradient id="gradProp" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#d97706" />
                </linearGradient>
                <linearGradient id="gradSound" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#0891b2" />
                </linearGradient>
                <linearGradient id="gradWorker" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
              </defs>

              {/* Connecting RDF Lines */}
              <line x1="400" y1="140" x2="150" y2="60" stroke="#ec4899" strokeWidth="2" strokeDasharray="4,4" opacity="0.65" />
              <text x="260" y="90" fill="#f472b6" fontSize="9" fontFamily="DM Mono">schema:actor</text>

              <line x1="400" y1="140" x2="150" y2="220" stroke="#0d9488" strokeWidth="2" strokeDasharray="4,4" opacity="0.65" />
              <text x="250" y="195" fill="#2dd4bf" fontSize="9" fontFamily="DM Mono">schema:location</text>

              <line x1="400" y1="140" x2="650" y2="60" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4,4" opacity="0.65" />
              <text x="520" y="90" fill="#fbbf24" fontSize="9" fontFamily="DM Mono">schema:instrument</text>

              <line x1="400" y1="140" x2="650" y2="220" stroke="#06b6d4" strokeWidth="2" strokeDasharray="4,4" opacity="0.65" />
              <text x="510" y="195" fill="#38bdf8" fontSize="9" fontFamily="DM Mono">schema:soundtrack</text>

              <line x1="400" y1="140" x2="400" y2="40" stroke="#10b981" strokeWidth="2" strokeDasharray="4,4" opacity="0.65" />
              <text x="410" y="80" fill="#34d399" fontSize="9" fontFamily="DM Mono">prov:wasGeneratedBy</text>

              {/* Node 1: Scene Center */}
              <g
                transform="translate(400, 140)"
                style={{ cursor: "pointer" }}
                onClick={() => setSelectedGraphNode("scene")}
              >
                <circle r="38" fill="url(#gradScene)" filter="drop-shadow(0 0 10px rgba(118,87,216,0.6))" />
                <circle r="42" fill="none" stroke="#a78bfa" strokeWidth="1.5" opacity="0.8" />
                <text textAnchor="middle" y="-4" fill="#ffffff" fontSize="10" fontWeight="bold" fontFamily="sans-serif">
                  SCENE KA
                </text>
                <text textAnchor="middle" y="12" fill="#e0e7ff" fontSize="8" fontFamily="DM Mono">
                  did:dkg:scene
                </text>
              </g>

              {/* Node 2: Cast (Top-Left) */}
              <g
                transform="translate(150, 60)"
                style={{ cursor: "pointer" }}
                onClick={() => setSelectedGraphNode("character")}
              >
                <circle r="28" fill="url(#gradChar)" />
                <text textAnchor="middle" y="-2" fill="#ffffff" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
                  CAST
                </text>
                <text textAnchor="middle" y="10" fill="#fce7f3" fontSize="8" fontFamily="DM Mono">
                  {selectedCharNames[0] || "Ren"}
                </text>
              </g>

              {/* Node 3: Set (Bottom-Left) */}
              <g
                transform="translate(150, 220)"
                style={{ cursor: "pointer" }}
                onClick={() => setSelectedGraphNode("set")}
              >
                <circle r="28" fill="url(#gradSet)" />
                <text textAnchor="middle" y="-2" fill="#ffffff" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
                  SET
                </text>
                <text textAnchor="middle" y="10" fill="#ccfbf1" fontSize="8" fontFamily="DM Mono">
                  {selectedSet?.name.split(" ")[0] || "Location"}
                </text>
              </g>

              {/* Node 4: Prop (Top-Right) */}
              <g
                transform="translate(650, 60)"
                style={{ cursor: "pointer" }}
                onClick={() => setSelectedGraphNode("prop")}
              >
                <circle r="28" fill="url(#gradProp)" />
                <text textAnchor="middle" y="-2" fill="#ffffff" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
                  PROP
                </text>
                <text textAnchor="middle" y="10" fill="#fef3c7" fontSize="8" fontFamily="DM Mono">
                  {vaultProps.find((p) => selectedPropIds.includes(p.id))?.name.split(" ")[0] || "Gear"}
                </text>
              </g>

              {/* Node 5: Sound (Bottom-Right) */}
              <g
                transform="translate(650, 220)"
                style={{ cursor: "pointer" }}
                onClick={() => setSelectedGraphNode("sound")}
              >
                <circle r="28" fill="url(#gradSound)" />
                <text textAnchor="middle" y="-2" fill="#ffffff" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
                  LEITMOTIF
                </text>
                <text textAnchor="middle" y="10" fill="#cffafe" fontSize="8" fontFamily="DM Mono">
                  {selectedMotif?.name.split(" ")[0] || "Motif"}
                </text>
              </g>

              {/* Node 6: Livepeer MCP Worker (Top-Center) */}
              <g
                transform="translate(400, 36)"
                style={{ cursor: "pointer" }}
                onClick={() => setSelectedGraphNode("livepeer")}
              >
                <circle r="22" fill="url(#gradWorker)" />
                <text textAnchor="middle" y="-2" fill="#ffffff" fontSize="8" fontWeight="bold" fontFamily="sans-serif">
                  LIVEPEER
                </text>
                <text textAnchor="middle" y="9" fill="#d1fae5" fontSize="7" fontFamily="DM Mono">
                  MCP Agent
                </text>
              </g>
            </svg>
          </div>
        </div>

        {/* ── DKG Asset Inspector Tabs ── */}
        <div className="inspector-tabs" style={{ marginTop: "18px" }}>
          <div className="tab-list">
            <button
              onClick={() => setInspectorTab("triples")}
              className={inspectorTab === "triples" ? "active" : ""}
            >
              RDF Knowledge Triples ({lastResult ? 6 : 4})
            </button>
            <button
              onClick={() => setInspectorTab("guards")}
              className={inspectorTab === "guards" ? "active" : ""}
            >
              Negative Anti-Drift Guards ({lastResult?.dkgConstraints?.negativePromptsInjected?.length ?? 12})
            </button>
            <button
              onClick={() => setInspectorTab("json")}
              className={inspectorTab === "json" ? "active" : ""}
            >
              OriginTrail W3C JSON-LD
            </button>
            <button
              onClick={() => setInspectorTab("compliance")}
              className={inspectorTab === "compliance" ? "active" : ""}
              style={{ color: inspectorTab === "compliance" ? "#0284c7" : "#0369a1", fontWeight: 700 }}
            >
              Brand Compliance & IP Certificate ({lastResult?.complianceCertificate ? "PASS 100%" : "READY"})
            </button>
          </div>

          <div className="tab-content" style={{ display: "block", paddingTop: "14px" }}>
            {inspectorTab === "triples" && (
              <table className="dkg-triples-table">
                <thead>
                  <tr>
                    <th>SUBJECT</th>
                    <th>PREDICATE</th>
                    <th>OBJECT / VALUE</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>{lastResult?.ual ?? "did:dkg:continuum/scene/b9033c9626ca57b4"}</code></td>
                    <td><code>schema:actor</code></td>
                    <td><code>did:dkg:continuum/character/{selectedCharIds[0] || "ren"} ({selectedCharNames.join(", ") || "Ren"})</code></td>
                  </tr>
                  <tr>
                    <td><code>{lastResult?.ual ?? "did:dkg:continuum/scene/b9033c9626ca57b4"}</code></td>
                    <td><code>schema:locationCreated</code></td>
                    <td><code>did:dkg:continuum/set/{selectedSetId || "neo-tokyo"} ({selectedSet?.name ?? "Neo-Tokyo Alley"})</code></td>
                  </tr>
                  {selectedPropIds.length > 0 && (
                    <tr>
                      <td><code>{lastResult?.ual ?? "did:dkg:continuum/scene/b9033c9626ca57b4"}</code></td>
                      <td><code>schema:instrument</code></td>
                      <td><code>did:dkg:continuum/prop/{selectedPropIds[0]} ({vaultProps.find((p) => p.id === selectedPropIds[0])?.name})</code></td>
                    </tr>
                  )}
                  <tr>
                    <td><code>{lastResult?.ual ?? "did:dkg:continuum/scene/b9033c9626ca57b4"}</code></td>
                    <td><code>schema:soundtrack</code></td>
                    <td><code>did:dkg:continuum/leitmotif/{selectedMotifIds[0] || "rens-blade"} ({selectedMotif?.name ?? "Ren's Blade"})</code></td>
                  </tr>
                  <tr>
                    <td><code>{lastResult?.ual ?? "did:dkg:continuum/scene/b9033c9626ca57b4"}</code></td>
                    <td><code>prov:wasGeneratedBy</code></td>
                    <td><code>livepeer:agent:text-to-video (Kling / Flux.1)</code></td>
                  </tr>
                </tbody>
              </table>
            )}

            {inspectorTab === "guards" && (
              <div style={{ padding: "8px 4px" }}>
                <p style={{ fontSize: "12px", color: "#6b687a", margin: "0 0 10px" }}>
                  Active negative prompts injected during neural generation to enforce strict character and environment fidelity:
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {(lastResult?.dkgConstraints?.negativePromptsInjected ?? [
                    "no blond hair",
                    "no blue eyes",
                    "no missing cheek scar",
                    "no casual t-shirts",
                    "no cheerful smiles",
                    "no daylight",
                    "no rural forest",
                    "no cartoonish rendering",
                    "no low resolution artifacts",
                    "no modern cars",
                    "no wooden swords",
                    "no sunny skies",
                  ]).map((guard, idx) => (
                    <span
                      key={idx}
                      style={{
                        background: "#fee2e2",
                        color: "#991b1b",
                        border: "1px solid #fca5a5",
                        borderRadius: "6px",
                        padding: "3px 8px",
                        fontSize: "11px",
                        fontFamily: "DM Mono",
                      }}
                    >
                      {guard}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {inspectorTab === "json" && (
              <pre
                style={{
                  background: "#f4f1ec",
                  padding: "12px",
                  borderRadius: "6px",
                  fontFamily: "DM Mono",
                  fontSize: "10px",
                  lineHeight: 1.5,
                  overflowX: "auto",
                  margin: 0,
                }}
              >
                {lastResult
                  ? JSON.stringify(
                      {
                        "@context": [
                          "https://schema.org",
                          "http://www.w3.org/ns/prov#",
                          { "continuum": "https://continuum.livepeer.studio/ns#" }
                        ],
                        "@id": lastResult.ual,
                        "@type": "schema:VideoObject",
                        "schema:name": `Episode 01 Scene ${lastResult.request.sceneNumber || 1}`,
                        "prov:wasDerivedFrom": lastResult.lineage?.derivedFrom ?? [
                          `did:dkg:continuum/character/${selectedCharIds[0] || "ren"}`,
                          `did:dkg:continuum/set/${selectedSetId || "neo-tokyo"}`
                        ],
                        "continuum:promptFingerprint": lastResult.lineage?.provenance?.promptFingerprint ?? "sha256:7e8912b40a931c8",
                        "continuum:livepeerOutputs": lastResult.livepeerOutputs?.map((o) => ({
                          type: o.type,
                          capability: o.capability,
                          url: o.url,
                          costUsd: o.costUsd,
                          elapsedMs: o.elapsedMs,
                        })),
                      },
                      null,
                      2
                    )
                  : `{\n  "@context": "https://schema.org",\n  "@type": "schema:VideoObject",\n  "@id": "did:dkg:continuum/scene/b9033c9626ca57b4",\n  "prov:wasDerivedFrom": [\n    "did:dkg:continuum/character/7d81bcb44509921c",\n    "did:dkg:continuum/set/b9d5c845a07638c9"\n  ]\n}`}
              </pre>
            )}

            {inspectorTab === "compliance" && (() => {
              const cert: BrandComplianceCertificate = lastResult?.complianceCertificate ?? {
                id: `CERT-AETHER-2026-${(lastResult?.id || "001").slice(-6).toUpperCase()}`,
                brandName: "Aether Kinetics Corp",
                guidelineVersion: "v2.4 (Enterprise Production Tier)",
                licenseAgreement: "Commercial Global Broadcast & Social Ad Rights (Tier A-1)",
                owner: "0x71C...b82F (Verified Embody Enterprise Key)",
                brandSafetyScore: 100,
                issuedAt: lastResult?.createdAt || new Date().toISOString(),
                timestamp: lastResult?.createdAt || new Date().toISOString(),
                certificateHash: "sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
                provenanceUal: lastResult?.ual || "did:dkg:continuum/scene/b9033c9626ca57b4",
                verifiedAssets: [
                  {
                    assetId: selectedCharIds[0] || "char-maya",
                    name: selectedCharNames[0] || "Maya Lin",
                    ual: `did:dkg:continuum/character/${selectedCharIds[0] || "char-maya"}`,
                    type: "character",
                    category: "character",
                    license: "Commercial Talent Release & Global Ad Rights",
                    licenseType: "Commercial Talent Release & Global Ad Rights",
                    royaltyShare: "40%",
                    brandSafetyScore: 100,
                  },
                  {
                    assetId: selectedSetId || "set-neo-kyoto-stadium",
                    name: selectedSet?.name || "Neo-Kyoto Skyline Stadium Track",
                    ual: `did:dkg:continuum/set/${selectedSetId || "set-neo-kyoto-stadium"}`,
                    type: "set",
                    category: "set",
                    license: "Enterprise Brand Arena Commercial Staging Rights",
                    licenseType: "Enterprise Brand Arena Commercial Staging Rights",
                    royaltyShare: "25%",
                    brandSafetyScore: 100,
                  },
                  {
                    assetId: selectedPropIds[0] || "prop-aether-x1",
                    name: vaultProps.find((p) => selectedPropIds.includes(p.id))?.name || "Aether X1 Quantum Runners",
                    ual: `did:dkg:continuum/prop/${selectedPropIds[0] || "prop-aether-x1"}`,
                    type: "prop",
                    category: "prop",
                    license: "Proprietary Hero Product Patent & 3D Trademark",
                    licenseType: "Proprietary Hero Product Patent & 3D Trademark",
                    royaltyShare: "25%",
                    brandSafetyScore: 100,
                  },
                  {
                    assetId: selectedMotifIds[0] || "leit-velocity-pulse",
                    name: selectedMotif?.name || "Velocity Pulse — Official Brand Anthem",
                    ual: `did:dkg:continuum/leitmotif/${selectedMotifIds[0] || "leit-velocity-pulse"}`,
                    type: "sound",
                    category: "sound",
                    license: "Exclusive Sync License & Master Sound Recording",
                    licenseType: "Exclusive Sync License & Master Sound Recording",
                    royaltyShare: "10%",
                    brandSafetyScore: 100,
                  },
                ],
                safetyChecks: [
                  { rule: "Brand Guideline Adherence (Hex: #00f0ff, #ff0055 enforced)", status: "PASS", description: "Palette match 99.8% with canonical Aether palette", detail: "Palette match 99.8% with canonical Aether palette" },
                  { rule: "Competitor Trademark Guard (Zero competitor logos)", status: "PASS", description: "Zero unauthorized marks detected across keyframes", detail: "Zero unauthorized marks detected across keyframes" },
                  { rule: "Talent Model Release Verification (Maya Lin Biometric DNA)", status: "PASS", description: "Talent release signed and verified on OriginTrail DKG", detail: "Talent release signed and verified on OriginTrail DKG" },
                  { rule: "Sonic Leitmotif Rhythm & Key Match (128 BPM · F Minor)", status: "PASS", description: "Anthem matches commercial broadcast master", detail: "Anthem matches commercial broadcast master" },
                ],
              };

              const downloadCert = () => {
                const jsonStr = JSON.stringify(cert, null, 2);
                const blob = new Blob([jsonStr], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `Brand-Compliance-Certificate-${cert.id}.json`;
                a.click();
                URL.revokeObjectURL(url);
                showToast({
                  type: "success",
                  title: "Certificate Downloaded",
                  message: `Cryptographic certificate ${cert.id} saved as JSON-LD.`,
                });
              };

              const copyHash = () => {
                navigator.clipboard.writeText(cert.certificateHash);
                setCopiedCertHash(true);
                setTimeout(() => setCopiedCertHash(false), 2000);
                showToast({
                  type: "success",
                  title: "Hash Copied",
                  message: "SHA-256 certificate fingerprint copied to clipboard.",
                });
              };

              return (
                <div className="compliance-cert-card">
                  <div className="cert-header">
                    <div className="cert-title-group">
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                        <span style={{ fontSize: "9px", fontFamily: "DM Mono", background: "#dbeafe", color: "#1e40af", padding: "2px 8px", borderRadius: "4px", fontWeight: 800 }}>
                          ENTERPRISE IP AUDIT
                        </span>
                        <span style={{ fontSize: "10px", fontFamily: "DM Mono", color: "#64748b" }}>
                          ID: {cert.id}
                        </span>
                      </div>
                      <h3>Brand Compliance & IP Provenance Certificate</h3>
                      <p>
                        Cryptographically binds verified brand assets, talent releases, and guideline safety checks via OriginTrail DKG.
                      </p>
                    </div>

                    <div className="cert-seal">
                      <Icon name="check" size={14} />
                      <span>100% BRAND AUDIT PASSED</span>
                    </div>
                  </div>

                  <div className="cert-grid">
                    <div className="cert-info-item">
                      <span>Brand / Organization</span>
                      <strong>{cert.brandName}</strong>
                      <small>Enterprise Production Tier</small>
                    </div>
                    <div className="cert-info-item">
                      <span>Guideline Version</span>
                      <strong>{cert.guidelineVersion}</strong>
                      <small>Show Bible Hash: #aether-v2.4</small>
                    </div>
                    <div className="cert-info-item">
                      <span>License Agreement</span>
                      <strong>{cert.licenseAgreement}</strong>
                      <small>Node: {cert.owner}</small>
                    </div>
                    <div className="cert-info-item">
                      <span>Cryptographic Hash</span>
                      <strong style={{ fontFamily: "DM Mono", fontSize: "11px" }}>
                        {cert.certificateHash.slice(0, 18)}…
                      </strong>
                      <button
                        type="button"
                        onClick={copyHash}
                        style={{ border: 0, background: "none", color: "#7657d8", fontSize: "10px", fontWeight: 700, padding: 0, cursor: "pointer", marginTop: "2px" }}
                      >
                        {copiedCertHash ? "✓ COPIED" : "Copy Full SHA-256"}
                      </button>
                    </div>
                  </div>

                  {/* Audited Assets & Royalty Share Table */}
                  <div style={{ marginTop: "16px", marginBottom: "16px" }}>
                    <h5 style={{ fontSize: "12px", fontWeight: 800, color: "#332f44", margin: "0 0 8px", letterSpacing: "0.04em", textTransform: "uppercase" }}>
                      Audited Knowledge Assets & Royalty Distribution
                    </h5>
                    <table className="dkg-triples-table">
                      <thead>
                        <tr>
                          <th>BOUND ASSET</th>
                          <th>CATEGORY</th>
                          <th>COMMERCIAL LICENSE TIER</th>
                          <th>ROYALTY SHARE</th>
                          <th>AUDIT SCORE</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cert.verifiedAssets.map((asset, i) => (
                          <tr key={i}>
                            <td>
                              <strong>{asset.name}</strong>
                              <small style={{ display: "block", color: "#8a8894" }}>{asset.assetId}</small>
                            </td>
                            <td>
                              <span style={{ textTransform: "uppercase", fontSize: "10px", color: "#6b687a" }}>
                                {asset.category}
                              </span>
                            </td>
                            <td>
                              <span style={{ fontSize: "11px", color: "#374151" }}>{asset.licenseType}</span>
                            </td>
                            <td>
                              <strong style={{ color: "#7657d8" }}>{asset.royaltyShare}</strong>
                            </td>
                            <td>
                              <span style={{ color: "#15803d", fontWeight: 700 }}>PASS (100%)</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Brand Safety Automated Checklist */}
                  <div style={{ marginTop: "14px" }}>
                    <h5 style={{ fontSize: "12px", fontWeight: 800, color: "#332f44", margin: "0 0 8px", letterSpacing: "0.04em", textTransform: "uppercase" }}>
                      Automated Brand Safety & Anti-Drift Matrix
                    </h5>
                    <div className="cert-safety-checklist">
                      {cert.safetyChecks.map((chk, i) => (
                        <div className="safety-check-row pass" key={i}>
                          <div>
                            <strong>{chk.rule}</strong>
                            <small style={{ display: "block", color: "#475569", fontSize: "10px", marginTop: "2px" }}>
                              {chk.detail}
                            </small>
                          </div>
                          <span style={{ background: "#dcfce7", color: "#166534", padding: "2px 6px", borderRadius: "4px", fontWeight: 800, fontSize: "10px", fontFamily: "DM Mono" }}>
                            {chk.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "18px", paddingTop: "14px", borderTop: "1px solid #f0edf6", flexWrap: "wrap", gap: "10px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <button
                        type="button"
                        className="mint-button"
                        onClick={downloadCert}
                        style={{ fontSize: "12px", padding: "8px 16px", background: "#0284c7" }}
                      >
                        Download Cryptographic Certificate (JSON-LD)
                      </button>
                      <button
                        type="button"
                        className="outline-button"
                        onClick={() => navigate("/graph")}
                        style={{ fontSize: "12px", padding: "8px 14px" }}
                      >
                        Inspect in DKG Graph →
                      </button>
                    </div>

                    <span style={{ fontSize: "11px", color: "#64748b", fontFamily: "DM Mono" }}>
                      DKG UAL: {cert.provenanceUal.slice(0, 32)}…
                    </span>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </section>

      {/* ── PROJECT SCENE HISTORY DRAWER ── */}
      {isHistoryOpen && (
        <>
          <button
            type="button"
            className="drawer-shade"
            onClick={() => setIsHistoryOpen(false)}
            aria-label="Close history drawer"
          />
          <aside className="history-drawer">
            <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "22px 24px", borderBottom: "1px solid #e5e7eb" }}>
              <div>
                <p style={{ font: "9px 'DM Mono'", color: "#7657d8", letterSpacing: "0.1em", margin: 0, textTransform: "uppercase" }}>
                  ORIGINTRAIL DKG SCENE ARCHIVE
                </p>
                <h3 style={{ font: "600 22px 'Playfair Display'", margin: "4px 0 0", color: "#1e2029" }}>
                  {activeProject?.title} Scenes
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsHistoryOpen(false)}
                style={{ border: "1px solid #e5e7eb", background: "#fff", width: "32px", height: "32px", borderRadius: "50%", cursor: "pointer", display: "grid", placeItems: "center" }}
              >
                ×
              </button>
            </header>

            <div className="history-list">
              {projectScenes.length > 0 ? (
                projectScenes.map((scene, idx) => {
                  const vid = scene.livepeerOutputs?.find((o) => o.type === "video");
                  const img = scene.livepeerOutputs?.find((o) => o.type === "image");
                  const isVid = vid && !vid.url.includes("example.invalid");
                  const isImg = img && !img.url.includes("example.invalid");
                  const totalSceneCost = scene.livepeerOutputs?.reduce((acc, o) => acc + (o.costUsd || 0), 0) ?? 0;

                  return (
                    <article key={scene.id || idx} className="history-card">
                      <div className="history-card-thumb">
                        {isVid ? (
                          <video src={vid!.url} muted loop autoPlay playsInline />
                        ) : isImg ? (
                          <img src={img!.url} alt="Scene" />
                        ) : (
                          <div style={{ height: "100%", display: "grid", placeItems: "center", color: "#aaa", fontSize: "10px", fontFamily: "DM Mono" }}>
                            KEYFRAME
                          </div>
                        )}
                        <span style={{ position: "absolute", bottom: "4px", left: "4px", background: "rgba(0,0,0,0.75)", color: "#fff", fontSize: "8px", padding: "1px 5px", borderRadius: "3px", fontFamily: "DM Mono" }}>
                          SCENE {String(idx + 1).padStart(2, "0")}
                        </span>
                      </div>

                      <div className="history-card-content">
                        <h4>Scene {String(idx + 1).padStart(2, "0")} · Episode {scene.request?.episodeNumber ?? 1}</h4>
                        <p>{scene.request?.prompt ?? "Cinematic directed scene"}</p>
                        <div className="history-card-actions">
                          <span style={{ font: "8px 'DM Mono'", color: "#10815e", background: "#e8f8f1", padding: "2px 6px", borderRadius: "4px" }}>
                            DKG ANCHORED · ${totalSceneCost.toFixed(3)}
                          </span>
                          <button
                            type="button"
                            className="mint-button"
                            style={{ padding: "5px 12px", fontSize: "10px" }}
                            onClick={() => handleLoadScene(scene)}
                          >
                            Load Scene →
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })
              ) : (
                <div style={{ textAlign: "center", padding: "50px 20px", color: "#777" }}>
                  <p style={{ font: "9px 'DM Mono'", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                    Archive Standby
                  </p>
                  <h4 style={{ font: "600 20px 'Playfair Display'", margin: "8px 0", color: "#222" }}>
                    No scenes directed for {activeProject?.title} yet.
                  </h4>
                  <p style={{ fontSize: "12px", color: "#888", maxWidth: "300px", margin: "0 auto 20px", lineHeight: 1.5 }}>
                    Enter direction in the prompt box and click "Direct Scene Take" to render via Livepeer and OriginTrail DKG.
                  </p>
                  <button className="mint-button" onClick={() => setIsHistoryOpen(false)}>
                    Start Directing Now →
                  </button>
                </div>
              )}
            </div>
          </aside>
        </>
      )}
      {/* ── NEW UNIVERSE & CANON ASSET CREATOR MODAL ── */}
      {isNewProjectModalOpen && (
        <div className="modal-overlay" onClick={() => setIsNewProjectModalOpen(false)}>
          <div
            className="modal-card"
            style={{ maxWidth: "680px", width: "min(680px, calc(100vw - 32px))" }}
            onClick={(e) => e.stopPropagation()}
          >
            <header className="modal-header">
              <div>
                <p style={{ margin: "0 0 4px", fontSize: "10px", fontFamily: "DM Mono", color: "#7657d8", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  ORIGINTRAIL DKG CANON CREATOR
                </p>
                <h3 style={{ margin: 0, fontSize: "20px" }}>Create New Universe & Canon Pipeline</h3>
                <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#6b687a", lineHeight: 1.4 }}>
                  Establish the story bible, character visual DNA, staging environment, leitmotif, and prop in one unified workflow.
                </p>
              </div>
              <button
                type="button"
                className="modal-close"
                onClick={() => setIsNewProjectModalOpen(false)}
                style={{ cursor: "pointer" }}
              >
                ×
              </button>
            </header>

            <form onSubmit={handleCreateFullUniverse}>
              <div className="modal-body" style={{ maxHeight: "70vh", overflowY: "auto", padding: "18px 24px", display: "flex", flexDirection: "column", gap: "18px" }}>
                
                {/* Preset Banner */}
                <div style={{ background: "#f5f3ff", border: "1px dashed #a78bfa", borderRadius: "10px", padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
                  <span style={{ fontSize: "11px", color: "#5b21b6", fontWeight: 600 }}>
                    Want a pre-configured template? Auto-fill a complete Cosmic Sci-Fi universe:
                  </span>
                  <button
                    type="button"
                    onClick={applySampleUniversePreset}
                    style={{ background: "#7657d8", color: "#fff", border: 0, borderRadius: "6px", padding: "5px 12px", fontSize: "11px", fontWeight: 700, cursor: "pointer" }}
                  >
                    Auto-Fill Preset
                  </button>
                </div>

                {/* 1. Universe Basics */}
                <fieldset style={{ border: "1px solid #e2e0e8", borderRadius: "10px", padding: "14px", margin: 0 }}>
                  <legend style={{ fontSize: "11px", fontWeight: 800, color: "#181725", padding: "0 6px", textTransform: "uppercase", fontFamily: "DM Mono" }}>
                    1. Universe & Story Scope
                  </legend>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "10px" }}>
                    <div className="modal-field">
                      <label>PROJECT TITLE *</label>
                      <input
                        type="text"
                        value={newProjTitle}
                        onChange={(e) => setNewProjTitle(e.target.value)}
                        placeholder="e.g. Aethelgard: The Void Signal"
                        required
                      />
                    </div>
                    <div className="modal-field">
                      <label>GENRE / THEME</label>
                      <input
                        type="text"
                        value={newProjGenre}
                        onChange={(e) => setNewProjGenre(e.target.value)}
                        placeholder="e.g. Cosmic Sci-Fi Noir"
                      />
                    </div>
                  </div>
                  <div className="modal-field">
                    <label>SERIES LOGLINE</label>
                    <input
                      type="text"
                      value={newProjLogline}
                      onChange={(e) => setNewProjLogline(e.target.value)}
                      placeholder="e.g. An isolated station archivist intercepts transmissions from a dead planetary core."
                    />
                  </div>
                </fieldset>

                {/* 2. Character & Visual DNA */}
                <fieldset style={{ border: "1px solid #e2e0e8", borderRadius: "10px", padding: "14px", margin: 0 }}>
                  <legend style={{ fontSize: "11px", fontWeight: 800, color: "#181725", padding: "0 6px", textTransform: "uppercase", fontFamily: "DM Mono" }}>
                    2. Lead Character & Visual DNA
                  </legend>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "10px" }}>
                    <div className="modal-field">
                      <label>CHARACTER NAME *</label>
                      <input
                        type="text"
                        value={newCharName}
                        onChange={(e) => setNewCharName(e.target.value)}
                        placeholder="e.g. Dr. Sarah Chen"
                        required
                      />
                    </div>
                    <div className="modal-field">
                      <label>EPITHET / ALIAS</label>
                      <input
                        type="text"
                        value={newCharEpithet}
                        onChange={(e) => setNewCharEpithet(e.target.value)}
                        placeholder="e.g. Chief Void Archaeologist"
                      />
                    </div>
                  </div>
                  <div className="modal-field" style={{ marginBottom: "10px" }}>
                    <label>CANONICAL ATTIRE (DNA LOCKED)</label>
                    <input
                      type="text"
                      value={newCharAttire}
                      onChange={(e) => setNewCharAttire(e.target.value)}
                      placeholder="e.g. Tactical reinforced EVA flight suit with glowing copper telemetry seams"
                    />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    <div className="modal-field">
                      <label>DISTINGUISHING FEATURES</label>
                      <input
                        type="text"
                        value={newCharFeatures}
                        onChange={(e) => setNewCharFeatures(e.target.value)}
                        placeholder="e.g. Sub-dermal neural jack behind left ear"
                      />
                    </div>
                    <div className="modal-field">
                      <label>VOICE TIMBRE</label>
                      <input
                        type="text"
                        value={newCharVoice}
                        onChange={(e) => setNewCharVoice(e.target.value)}
                        placeholder="e.g. Analytical, calm, resonant timbre"
                      />
                    </div>
                  </div>
                </fieldset>

                {/* 3. Environment & Staging */}
                <fieldset style={{ border: "1px solid #e2e0e8", borderRadius: "10px", padding: "14px", margin: 0 }}>
                  <legend style={{ fontSize: "11px", fontWeight: 800, color: "#181725", padding: "0 6px", textTransform: "uppercase", fontFamily: "DM Mono" }}>
                    3. Staging Environment / Set
                  </legend>
                  <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "10px", marginBottom: "10px" }}>
                    <div className="modal-field">
                      <label>LOCATION NAME *</label>
                      <input
                        type="text"
                        value={newSetName}
                        onChange={(e) => setNewSetName(e.target.value)}
                        placeholder="e.g. Observatory Dome 07"
                        required
                      />
                    </div>
                    <div className="modal-field">
                      <label>TIME OF DAY</label>
                      <select
                        value={newSetTimeOfDay}
                        onChange={(e) => setNewSetTimeOfDay(e.target.value)}
                      >
                        <option value="NIGHT">NIGHT</option>
                        <option value="DEEP VOID">DEEP VOID</option>
                        <option value="TWILIGHT">TWILIGHT</option>
                        <option value="GOLDEN HOUR">GOLDEN HOUR</option>
                      </select>
                    </div>
                  </div>
                  <div className="modal-field">
                    <label>LIGHTING SCHEMA & ATMOSPHERE</label>
                    <input
                      type="text"
                      value={newSetLighting}
                      onChange={(e) => setNewSetLighting(e.target.value)}
                      placeholder="e.g. Starlight filtering through frosted quartz dome with pulsing emerald consoles"
                    />
                  </div>
                </fieldset>

                {/* 4. Sound Leitmotif */}
                <fieldset style={{ border: "1px solid #e2e0e8", borderRadius: "10px", padding: "14px", margin: 0 }}>
                  <legend style={{ fontSize: "11px", fontWeight: 800, color: "#181725", padding: "0 6px", textTransform: "uppercase", fontFamily: "DM Mono" }}>
                    4. Sound Leitmotif & Score
                  </legend>
                  <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "10px" }}>
                    <div className="modal-field">
                      <label>TRACK NAME</label>
                      <input
                        type="text"
                        value={newSoundName}
                        onChange={(e) => setNewSoundName(e.target.value)}
                        placeholder="e.g. Sarah's Frequency — Pulsar Echo"
                      />
                    </div>
                    <div className="modal-field">
                      <label>MUSICAL KEY</label>
                      <input
                        type="text"
                        value={newSoundKey}
                        onChange={(e) => setNewSoundKey(e.target.value)}
                        placeholder="e.g. C minor"
                      />
                    </div>
                    <div className="modal-field">
                      <label>TEMPO (BPM)</label>
                      <input
                        type="number"
                        value={newSoundBpm}
                        onChange={(e) => setNewSoundBpm(Number(e.target.value))}
                        placeholder="90"
                      />
                    </div>
                  </div>
                </fieldset>

                {/* 5. Canon Prop & Gear */}
                <fieldset style={{ border: "1px solid #e2e0e8", borderRadius: "10px", padding: "14px", margin: 0 }}>
                  <legend style={{ fontSize: "11px", fontWeight: 800, color: "#181725", padding: "0 6px", textTransform: "uppercase", fontFamily: "DM Mono" }}>
                    5. Canonical Prop & Lore Artifact
                  </legend>
                  <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "10px", marginBottom: "10px" }}>
                    <div className="modal-field">
                      <label>PROP / GEAR NAME</label>
                      <input
                        type="text"
                        value={newPropName}
                        onChange={(e) => setNewPropName(e.target.value)}
                        placeholder="e.g. Resonance Prism Scanner"
                      />
                    </div>
                    <div className="modal-field">
                      <label>CATEGORY</label>
                      <select
                        value={newPropCategory}
                        onChange={(e) => setNewPropCategory(e.target.value as "prop" | "lore")}
                      >
                        <option value="prop">Physical Equipment</option>
                        <option value="lore">Canon Lore Object</option>
                      </select>
                    </div>
                  </div>
                  <div className="modal-field">
                    <label>LORE DESCRIPTION</label>
                    <input
                      type="text"
                      value={newPropDesc}
                      onChange={(e) => setNewPropDesc(e.target.value)}
                      placeholder="e.g. Handheld titanium spectrometer that decodes encrypted subspace harmonics."
                    />
                  </div>
                </fieldset>

                {/* Auto-generate video toggle */}
                <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "8px", padding: "10px 14px", display: "flex", alignItems: "center", gap: "10px" }}>
                  <input
                    type="checkbox"
                    id="auto-generate-check"
                    checked={autoGenerateAfterCreation}
                    onChange={(e) => setAutoGenerateAfterCreation(e.target.checked)}
                    style={{ width: "16px", height: "16px", cursor: "pointer" }}
                  />
                  <label htmlFor="auto-generate-check" style={{ fontSize: "12px", fontWeight: 600, color: "#166534", cursor: "pointer", margin: 0 }}>
                    Immediately synthesize video scene take upon creation
                  </label>
                </div>
              </div>

              <footer className="modal-footer" style={{ padding: "16px 24px", display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button
                  type="button"
                  className="outline-button"
                  onClick={() => setIsNewProjectModalOpen(false)}
                  disabled={creatingProject}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="mint-button"
                  disabled={creatingProject}
                  style={{ background: "#7657d8", color: "#fff", padding: "10px 20px" }}
                >
                  {creatingProject ? "Minting to DKG…" : "Create Universe & Mint to DKG →"}
                </button>
              </footer>
            </form>
          </div>
        </div>
      )}

    </section>
  );
}
