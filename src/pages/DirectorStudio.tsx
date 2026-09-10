import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router";
import { Icon } from "../components/StudioShell";
import type { SceneResult, CharacterAsset, SetAsset, LeitmotifAsset, PropAsset } from "@shared/types";
import { useProject } from "../context/ProjectContext";

export function DirectorStudio() {
  const navigate = useNavigate();
  const location = useLocation();
  const { projects, activeProject, selectProjectId } = useProject();

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

  // Project scenes & history drawer state
  const [projectScenes, setProjectScenes] = useState<SceneResult[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Prompt state
  const [prompt, setPrompt] = useState(
    "Ren steps beneath the awning of a shuttered ramen shop. Yuki waits in the rain across the street, holding a broken transmitter. The city hum falls away as Ren recognizes the signal."
  );

  // Pipeline state
  const [rendering, setRendering] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [currentPhaseMsg, setCurrentPhaseMsg] = useState("");
  const [lastResult, setLastResult] = useState<SceneResult | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState<"continuity" | "provenance" | "json">("continuity");
  const [renderError, setRenderError] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement>(null);

  // ── Fetch vault data from backend ──
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
          // If no scenes yet for this project, reset lastResult
          if (activeProject.id !== "proj-ronin-echoes") {
            setLastResult(null);
          }
        }
      })
      .catch(() => {});

    // Adaptive sample prompt per project
    if (activeProject.id === "proj-solaris-drift") {
      setPrompt(
        "Dr. Vance enters the cryogenic junction of Derelict Station Alpha. Amber emergency strobes illuminate floating debris as the long-silent communicator chimes."
      );
    }
  }, [activeProject?.id]);

  // Handle vault navigation from Characters, Sets, Sound, and Props & Lore pages
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

  // ── Get display names for selected items ──
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
    };

    try {
      // Try streaming endpoint first
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
                setProjectScenes((prev) => {
                  const exists = prev.some((s) => s.id === data.id);
                  return exists ? prev : [...prev, data];
                });
                setCurrentStep(5);
                setCurrentPhaseMsg("Scene rendered and verified. Knowledge Asset minted.");
              } else if (event === "error") {
                setRenderError(data.error ?? "Rendering failed");
              }
            } catch {}
          }
        }
      } else {
        // Fallback to standard POST
        const res = await fetch("/api/scenes/render", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const data: SceneResult = await res.json();
          setLastResult(data);
          setProjectScenes((prev) => {
            const exists = prev.some((s) => s.id === data.id);
            return exists ? prev : [...prev, data];
          });
          setCurrentStep(5);
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

  // Total cost of all outputs
  const totalCost = lastResult?.livepeerOutputs?.reduce((sum, o) => sum + (o.costUsd ?? 0), 0) ?? 0;
  const totalElapsed = lastResult?.livepeerOutputs?.reduce((sum, o) => sum + (o.elapsedMs ?? 0), 0) ?? 0;

  return (
    <section className="workspace">
      {/* ── Top Scene Context ── */}
      <div className="breadcrumb" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          <div className="project-selector-wrap">
            <select
              className="project-select-dropdown"
              value={activeProject?.id ?? ""}
              onChange={(e) => selectProjectId(e.target.value)}
              aria-label="Select active project"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>
          <Icon name="chevron" size={14} />
          <span>SEASON {String(activeProject?.seasonNumber ?? 1).padStart(2, "0")}</span>
          <Icon name="chevron" size={14} />
          <b>EPISODE 01 · SCENE {String((projectScenes.length || 0) + 1).padStart(2, "0")}</b>
        </div>

        <button
          type="button"
          className="outline-button"
          onClick={() => setIsHistoryOpen(true)}
          style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", fontWeight: 700, padding: "5px 12px", background: "#fff" }}
        >
          <span>Project Scenes ({projectScenes.length})</span>
        </button>
      </div>

      <div className="scene-head">
        <div>
          <p className="eyebrow">
            DIRECTOR STUDIO / {activeProject?.title?.toUpperCase() ?? "CYBERPUNK: RONIN ECHOES"}
          </p>
          <h1>
            The rain remembers <span>every name.</span>
          </h1>
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <button className="outline-button" onClick={() => setIsHistoryOpen(true)}>
            View History ({projectScenes.length})
          </button>
          <button className="outline-button" onClick={() => navigate("/episodes")}>
            <Icon name="layers" size={16} /> Storyboard View
          </button>
        </div>
      </div>

      {/* ── Cast, Location & Props Palette ── */}
      <div className="context-strip" style={{ flexWrap: "wrap", gap: "18px", alignItems: "flex-start" }}>
        {/* Cast Selection */}
        <div className="context-block">
          <label style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
            CAST <span style={{ background: "#7657d8", color: "#fff", padding: "1px 7px", borderRadius: "10px", fontSize: "10px", fontWeight: 700 }}>{selectedCharIds.length} SELECTED</span>
          </label>
          <div className="chips" style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {vaultChars.map((c) => {
              const isSelected = selectedCharIds.includes(c.id);
              return (
                <button
                  key={c.id}
                  type="button"
                  className={`person-chip ${isSelected ? "selected" : ""}`}
                  onClick={() => toggleChar(c.id)}
                  title={`Click to toggle ${c.name}`}
                  style={{
                    borderColor: isSelected ? "#7657d8" : "#e2e0e7",
                    background: isSelected ? "#f5f0ff" : "#ffffff",
                    boxShadow: isSelected ? "0 0 0 1.5px #7657d8, 0 3px 8px rgba(118,87,216,0.18)" : "0 1px 3px rgba(0,0,0,0.06)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "6px 14px 6px 6px",
                    borderRadius: "12px",
                    transition: "all 0.15s ease",
                    cursor: "pointer",
                  }}
                >
                  {c.avatarUrl ? (
                    <img
                      src={c.avatarUrl}
                      alt={c.name}
                      style={{
                        width: "42px",
                        height: "42px",
                        borderRadius: "8px",
                        objectFit: "cover",
                        flexShrink: 0,
                        boxShadow: "0 2px 4px rgba(0,0,0,0.12)",
                        border: isSelected ? "2px solid #7657d8" : "1px solid rgba(0,0,0,0.08)",
                      }}
                    />
                  ) : (
                    <div style={{ width: "42px", height: "42px", borderRadius: "8px", background: "linear-gradient(135deg, #7657d8, #a78bfa)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: "14px" }}>
                      {c.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div style={{ textAlign: "left", display: "flex", flexDirection: "column" }}>
                    <span style={{ fontSize: "13px", fontWeight: 700, color: "#181725", lineHeight: 1.2 }}>{c.name}</span>
                    <span style={{ fontSize: "10.5px", color: isSelected ? "#7657d8" : "#7c7a88", fontWeight: 500 }}>
                      {c.epithet ? c.epithet.slice(0, 24) : "Canon Character"}
                    </span>
                  </div>
                  {isSelected && (
                    <span style={{ marginLeft: "4px", width: "18px", height: "18px", borderRadius: "50%", background: "#7657d8", color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon name="check" size={11} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Setting Selection */}
        <div className="context-block setting">
          <label style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
            LOCATION <span style={{ background: "#0d9488", color: "#fff", padding: "1px 7px", borderRadius: "10px", fontSize: "10px", fontWeight: 700 }}>DKG ANCHORED</span>
          </label>
          <div className="chips" style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {vaultSets.map((s) => {
              const isSelected = selectedSetId === s.id;
              const displayImg = s.imageUrl || (s.name.includes("Garden") ? "/assets/vault/sky-garden.jpg" : s.name.includes("Derelict") ? "/assets/vault/derelict-alpha.jpg" : "https://agent.livepeer.org/a/aHR0cHM6Ly92M2IuZmFsLm1lZGlhL2ZpbGVzL2IvMGFhOWQ4MDEvc3ZZOHV1Tk10VUxSXzB4WHFNQUJRLmpwZw.26042ef301363d28/svY8uuNMtULR_0xXqMABQ.jpg");
              return (
                <button
                  key={s.id}
                  type="button"
                  className={`place-chip ${isSelected ? "selected" : ""}`}
                  onClick={() => setSelectedSetId(s.id)}
                  style={{
                    borderColor: isSelected ? "#0d9488" : "#e2e0e7",
                    background: isSelected ? "#f0fdfa" : "#ffffff",
                    boxShadow: isSelected ? "0 0 0 1.5px #0d9488, 0 3px 8px rgba(13,148,136,0.18)" : "0 1px 3px rgba(0,0,0,0.06)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "6px 14px 6px 6px",
                    borderRadius: "12px",
                    transition: "all 0.15s ease",
                    cursor: "pointer",
                  }}
                >
                  <img
                    src={displayImg}
                    alt={s.name}
                    style={{
                      width: "62px",
                      height: "42px",
                      borderRadius: "8px",
                      objectFit: "cover",
                      flexShrink: 0,
                      boxShadow: "0 2px 4px rgba(0,0,0,0.12)",
                      border: isSelected ? "2px solid #0d9488" : "1px solid rgba(0,0,0,0.08)",
                    }}
                  />
                  <div style={{ textAlign: "left", display: "flex", flexDirection: "column" }}>
                    <span style={{ fontSize: "13px", fontWeight: 700, color: "#181725", lineHeight: 1.2 }}>{s.name}</span>
                    <span style={{ fontSize: "10.5px", color: isSelected ? "#0d9488" : "#7c7a88", fontWeight: 500 }}>
                      {s.timeOfDay || "Atmospheric Set"}
                    </span>
                  </div>
                  {isSelected && (
                    <span style={{ marginLeft: "4px", width: "18px", height: "18px", borderRadius: "50%", background: "#0d9488", color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon name="check" size={11} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Props & Gear Selection */}
        {vaultProps.length > 0 && (
          <div className="context-block props-block" style={{ width: "100%" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
              PROPS & GEAR <span style={{ background: "#d97706", color: "#fff", padding: "1px 7px", borderRadius: "10px", fontSize: "10px", fontWeight: 700 }}>{selectedPropIds.length} SELECTED</span>
            </label>
            <div className="chips" style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {vaultProps.map((p) => {
                const isSelected = selectedPropIds.includes(p.id);
                const displayImg = p.imageUrl || (p.name.includes("Katana") ? "/assets/continuity/ren-anchor-2.jpg" : p.name.includes("Cartridge") ? "/assets/vault/sky-garden.jpg" : "/assets/vault/derelict-alpha.jpg");
                return (
                  <button
                    key={p.id}
                    type="button"
                    className={`person-chip prop-chip ${isSelected ? "selected" : ""}`}
                    onClick={() => toggleProp(p.id)}
                    title={p.description}
                    style={{
                      borderColor: isSelected ? "#d97706" : "#e2e0e7",
                      background: isSelected ? "#fffbeb" : "#ffffff",
                      boxShadow: isSelected ? "0 0 0 1.5px #d97706, 0 3px 8px rgba(217,119,6,0.18)" : "0 1px 3px rgba(0,0,0,0.06)",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "6px 14px 6px 6px",
                      borderRadius: "12px",
                      transition: "all 0.15s ease",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <img
                      src={displayImg}
                      alt={p.name}
                      style={{
                        width: "42px",
                        height: "42px",
                        borderRadius: "8px",
                        objectFit: "cover",
                        flexShrink: 0,
                        boxShadow: "0 2px 4px rgba(0,0,0,0.12)",
                        border: isSelected ? "2px solid #d97706" : "1px solid rgba(0,0,0,0.08)",
                      }}
                    />
                    <div style={{ textAlign: "left", display: "flex", flexDirection: "column" }}>
                      <span style={{ fontSize: "13px", fontWeight: 700, color: "#181725", lineHeight: 1.2 }}>{p.name}</span>
                      <span style={{ fontSize: "10.5px", color: isSelected ? "#d97706" : "#7c7a88", fontWeight: 500 }}>
                        {p.type || (p.category === "lore" ? "Canon Lore" : "Physical Prop")}
                      </span>
                    </div>
                    {isSelected && (
                      <span style={{ marginLeft: "4px", width: "18px", height: "18px", borderRadius: "50%", background: "#d97706", color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                        <Icon name="check" size={11} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Bound Sound Leitmotif */}
        <div className="motif" style={{ marginLeft: "auto", background: "#fbfaf8", border: "1px solid #e2e0e7", padding: "8px 16px", borderRadius: "12px", display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "34px", height: "34px", borderRadius: "8px", background: "#fef3c7", color: "#d97706", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="wave" size={18} />
          </div>
          <div>
            <small style={{ fontSize: "10px", color: "#8a8894", fontWeight: 700, display: "block" }}>BOUND LEITMOTIF</small>
            <strong style={{ fontSize: "12.5px", color: "#181725" }}>
              {selectedMotif?.name ?? "None"} <span style={{ color: "#7657d8", fontWeight: 600 }}>· {selectedMotif?.key ?? ""}</span>
            </strong>
          </div>
        </div>
      </div>

      {/* ── Director's Intention & Action Prompt ── */}
      <section className="director-panel" style={{ marginTop: "18px", borderRadius: "14px", border: "1px solid #dfdce4", background: "#ffffff", padding: "18px 20px", boxShadow: "0 2px 10px rgba(0,0,0,0.03)" }}>
        <div className="director-panel-top" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
              <p className="eyebrow" style={{ margin: 0, fontSize: "13px", fontWeight: 800, letterSpacing: "0.8px", color: "#181725" }}>DIRECTOR'S INTENTION & BLOCKING</p>
              <span style={{ fontSize: "10px", fontWeight: 700, background: "#ede9fe", color: "#6d28d9", padding: "2px 8px", borderRadius: "12px" }}>
                ✨ NEURO-SYMBOLIC PIPELINE
              </span>
            </div>
            <span style={{ fontSize: "12px", color: "#6b687a" }}>
              Direct camera trajectory, scene blocking, and dramatic character action. DKG Knowledge Assets continuously anchor facial geometry, lighting schemas, and leitmotifs to eliminate visual drift.
            </span>
          </div>
          <button className="constraint" onClick={() => navigate("/vault")} style={{ flexShrink: 0 }}>
            <Icon name="lock" size={13} /> DKG Canon Guards Active
          </button>
        </div>

        {/* Cinematic Framing & Mood Directives */}
        <div style={{ background: "#f8f7fa", border: "1px solid #ebe8f0", borderRadius: "10px", padding: "10px 14px", marginBottom: "14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "10px", fontWeight: 800, color: "#6b687a", letterSpacing: "0.5px", minWidth: "90px" }}>
              CAMERA SHOT:
            </span>
            <button type="button" className="preset-chip-btn" onClick={() => appendDirective("2.39:1 Anamorphic Wide Tracking Shot")}>
              🎥 Anamorphic Wide
            </button>
            <button type="button" className="preset-chip-btn" onClick={() => appendDirective("Macro Close-Up on Ocular Implant with Retinal HUD")}>
              🔍 Macro Retinal Focus
            </button>
            <button type="button" className="preset-chip-btn" onClick={() => appendDirective("Low-Angle Hero Stance with Wet Asphalt Reflections")}>
              🎬 Low-Angle Hero
            </button>
            <button type="button" className="preset-chip-btn" onClick={() => appendDirective("Over-the-Shoulder Tracking Shot through Heavy Downpour")}>
              🌧️ Over-the-Shoulder
            </button>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "10px", fontWeight: 800, color: "#6b687a", letterSpacing: "0.5px", minWidth: "90px" }}>
              ATMOSPHERE:
            </span>
            <button type="button" className="preset-chip-btn" onClick={() => appendDirective("Volumetric Neon Fog and Glistening Acid Rain Streaks")}>
              ⚡ Neon Fog & Rain
            </button>
            <button type="button" className="preset-chip-btn" onClick={() => appendDirective("Bioluminescent Moonlit Glow and Drifting Plant Mist")}>
              🌌 Moonlit Flora
            </button>
            <button type="button" className="preset-chip-btn" onClick={() => appendDirective("Rhythmic Amber Emergency Strobes in Zero-G Void")}>
              🚨 Amber Zero-G Strobes
            </button>
            <button type="button" className="preset-chip-btn" onClick={() => appendDirective("Cyan Holographic Glitch Distortions")}>
              💻 Holographic Glitch
            </button>
          </div>
        </div>

        {/* Quick Story Presets */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", margin: "10px 0 12px", alignItems: "center" }}>
          <span style={{ fontSize: "10px", fontWeight: 800, color: "#8a8894", letterSpacing: "0.5px" }}>
            STORY PRESETS:
          </span>
          <button type="button" className="preset-chip-btn" onClick={() => applyPreset("alley")}>
            ⚡ Rain Alley Standoff
          </button>
          <button type="button" className="preset-chip-btn" onClick={() => applyPreset("skyline")}>
            ⚡ Skyline Data Breach
          </button>
          <button type="button" className="preset-chip-btn" onClick={() => applyPreset("derelict")}>
            ⚡ Derelict Cryo Echo
          </button>
        </div>

        {/* Prompt Textarea */}
        <textarea
          rows={3}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your scene direction, blocking, camera movement, and character actions..."
          disabled={rendering}
          style={{ width: "100%", borderRadius: "10px", padding: "12px 14px", fontSize: "14px", lineHeight: "1.5", border: "1px solid #d4d0dc" }}
        />

        {/* Live Active Canon Injection Strip */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "8px", flexWrap: "wrap", gap: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "10.5px", color: "#6b687a", fontWeight: 700 }}>DKG BINDINGS:</span>
            {selectedCharNames.length > 0 && (
              <span style={{ fontSize: "10.5px", background: "#f5f0ff", color: "#6d28d9", padding: "2px 8px", borderRadius: "6px", fontWeight: 600 }}>
                🎭 {selectedCharNames.join(", ")}
              </span>
            )}
            {selectedSet && (
              <span style={{ fontSize: "10.5px", background: "#f0fdfa", color: "#0f766e", padding: "2px 8px", borderRadius: "6px", fontWeight: 600 }}>
                📍 {selectedSet.name}
              </span>
            )}
            {selectedPropIds.length > 0 && (
              <span style={{ fontSize: "10.5px", background: "#fffbeb", color: "#b45309", padding: "2px 8px", borderRadius: "6px", fontWeight: 600 }}>
                🗡️ {vaultProps.filter((p) => selectedPropIds.includes(p.id)).map((p) => p.name).join(", ")}
              </span>
            )}
          </div>
          <span style={{ fontSize: "10px", color: "#8a8894", letterSpacing: "0.5px", fontWeight: 700 }}>CINEMATIC · 24 FPS · 2.39:1</span>
        </div>
      </section>

      {/* ── Render Pipeline Action Bar ── */}
      <section className="render-row">
        <div className="pipeline">
          <div className="pipeline-label">
            <span>RENDER PIPELINE</span>
            <b>{rendering ? `GENERATING CINEMATIC MEDIA (${elapsedSec}s)…` : "READY TO DIRECT"}</b>
          </div>
          <ol>
            <li className={currentStep >= 1 || (!rendering && lastResult) ? "done" : ""}>
              <Icon name="check" size={13} />
              <span>DKG constraints</span>
            </li>
            <li
              className={
                currentStep >= 2 || (!rendering && lastResult)
                  ? "done"
                  : currentStep === 1
                  ? "active"
                  : ""
              }
            >
              <Icon name="check" size={13} />
              <span>Keyframe (Flux)</span>
            </li>
            <li
              className={
                currentStep >= 3 || (!rendering && lastResult)
                  ? "done"
                  : currentStep === 2
                  ? "active"
                  : ""
              }
            >
              <i></i>
              <span>Animate (Pixverse)</span>
            </li>
            <li
              className={
                currentStep >= 4 || (!rendering && lastResult)
                  ? "done"
                  : currentStep === 3
                  ? "active"
                  : ""
              }
            >
              <i></i>
              <span>Audio (Sonilo)</span>
            </li>
            <li
              className={
                currentStep >= 5 || (!rendering && lastResult)
                  ? "done"
                  : currentStep === 4
                  ? "active"
                  : ""
              }
            >
              <i></i>
              <span>Mint Scene KA</span>
            </li>
          </ol>
          {rendering && currentPhaseMsg && (
            <div style={{ marginTop: "8px", fontSize: "12px", color: "#7657d8", fontWeight: 500, display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ display: "inline-block", width: "6px", height: "6px", borderRadius: "50%", background: "#7657d8", animation: "pulse 1.2s infinite" }}></span>
              {currentPhaseMsg}
            </div>
          )}
        </div>

        <button
          className={`direct-button ${rendering ? "is-rendering" : ""}`}
          onClick={handleDirectScene}
          disabled={rendering}
        >
          <Icon name={rendering ? "spark" : "play"} size={17} />
          {rendering ? `Rendering (${elapsedSec}s)…` : "Direct scene"}
          <Icon name="arrow" size={17} />
        </button>
      </section>

      {/* ── Rendered Scene Output ── */}
      <section className="output-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">RENDERED SCENE OUTPUT</p>
            <h2>Episode 01 — Scene 03: Signal in the rain</h2>
          </div>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <button
              className="outline-button"
              style={{ fontSize: "12px", padding: "6px 12px" }}
              onClick={() => navigate("/graph")}
            >
              <Icon name="graph" size={13} /> DKG Knowledge Mesh
            </button>
            <div className="version">
              <span></span> DKG ANCHORED VERSION
            </div>
          </div>
        </div>

        {renderError && (
          <div style={{ background: "#fef3f2", border: "1px solid #fca5a5", borderRadius: "8px", padding: "12px 16px", marginBottom: "16px", fontSize: "13px", color: "#b91c1c" }}>
            <strong>Render Error:</strong> {renderError}
          </div>
        )}

        <div className="output-grid">
          {/* Cinema Screen Frame — REAL MEDIA */}
          <article className="cinema-frame">
            <div className="frame-top">
              <span className="verified">
                <Icon name="check" size={12} /> DKG VERIFIED
              </span>
              <span className="time">
                {hasRealVideo ? "VIDEO" : hasRealMedia ? "KEYFRAME" : "00:05 / 00:12"}
              </span>
            </div>

            {/* Render real media or fallback CSS canvas */}
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
                {/* Fallback CSS Canvas */}
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
              {hasRealMedia && (
                <div style={{ display: "flex", gap: "8px", fontSize: "10px", fontFamily: "DM Mono", color: "#aaa" }}>
                  {lastResult?.livepeerOutputs?.map((o, i) => (
                    <span key={i} style={{ background: "#1a1a2e", padding: "2px 8px", borderRadius: "4px" }}>
                      {o.capability} · {(o.elapsedMs / 1000).toFixed(1)}s · ${o.costUsd.toFixed(3)}
                    </span>
                  ))}
                </div>
              )}
              {!hasRealMedia && (
                <>
                  <div className="progress">
                    <i style={{ width: isPlaying ? "80%" : "42%" }}></i>
                  </div>
                  <span>2.39 : 1 CINEMATIC</span>
                </>
              )}
            </div>
          </article>

          {/* Clean Provenance Card */}
          <aside className="provenance">
            <div className="provenance-head">
              <p className="eyebrow">PROVENANCE LINEAGE</p>
              <button
                onClick={() => navigate("/graph")}
                title="View in Knowledge Graph"
                style={{ fontSize: "11px", color: "#7657d8", fontWeight: 700 }}
              >
                View Graph →
              </button>
            </div>

            <div className="origin-node scene-node">
              <span>SCENE KNOWLEDGE ASSET</span>
              <strong>Signal in the Rain</strong>
              <small>{lastResult?.ual ?? "did:dkg:continuum/scene/b9033c9626ca57b4"}</small>
            </div>

            <div className="tree-line"></div>

            <div className="source-nodes">
              <div className="origin-node ren-node">
                <span>CHARACTER</span>
                <strong>{selectedCharNames.join(", ") || "Select cast"}</strong>
                <small>VISUAL DNA</small>
              </div>
              <div className="origin-node set-node">
                <span>LOCATION</span>
                <strong>{selectedSet?.name.split(" ")[0] ?? "Select set"}</strong>
                <small>LIGHTING</small>
              </div>
            </div>

            {hasRealMedia && totalCost > 0 && (
              <div style={{ marginTop: "12px", padding: "8px 12px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "6px", fontSize: "11px" }}>
                <strong>Livepeer Cost:</strong> ${totalCost.toFixed(4)} · <strong>Render Time:</strong> {(totalElapsed / 1000).toFixed(1)}s
              </div>
            )}

            <div className="provenance-note">
              <Icon name="lock" size={15} />
              <span>Zero visual drift guaranteed by OriginTrail DKG</span>
            </div>
          </aside>
        </div>

        {/* Audio Leitmotif Bar */}
        <div className="audio-bar">
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
          <span>{hasRealAudio ? "LIVE" : "00:12"}</span>
          <button onClick={() => navigate("/sound")} title="Open sonic vault">
            <Icon name="wave" size={17} />
          </button>
          {hasRealAudio && (
            <audio ref={audioRef} src={audioOutput!.url} preload="auto" />
          )}
        </div>
      </section>

      {/* ── Inspector Tabs ── */}
      <section className="inspector-tabs">
        <div className="tab-list">
          <button
            onClick={() => setActiveTab("continuity")}
            className={activeTab === "continuity" ? "active" : ""}
          >
            Continuity Rules & DNA
          </button>
          <button
            onClick={() => setActiveTab("provenance")}
            className={activeTab === "provenance" ? "active" : ""}
          >
            Injected Negative Guards
          </button>
          <button
            onClick={() => setActiveTab("json")}
            className={activeTab === "json" ? "active" : ""}
          >
            OriginTrail JSON-LD
          </button>
        </div>

        <div className="tab-content" style={{ display: "block", paddingTop: "14px" }}>
          {activeTab === "continuity" && (
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <Icon name="graph" size={18} />
              <span>
                <strong>Characters Locked:</strong> {selectedCharNames.join(", ")} ·{" "}
                <strong>Attire:</strong> Long black armored trenchcoat with neon-green circuit-trace trim ·{" "}
                <strong>Lighting:</strong> Volumetric neon fog, wet asphalt reflections.
              </span>
            </div>
          )}

          {activeTab === "provenance" && (
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <Icon name="lock" size={18} />
              <span>
                <strong>{lastResult?.dkgConstraints?.negativePromptsInjected?.length ?? 17} Anti-Drift Guards Active:</strong>{" "}
                {lastResult?.dkgConstraints?.negativePromptsInjected?.join(", ") ??
                  "no blond hair, no blue eyes, no missing cheek scar, no casual t-shirts, no cheerful smiles, no daylight, no rural forest."}
              </span>
            </div>
          )}

          {activeTab === "json" && (
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
                      "@id": lastResult.ual,
                      "prov:wasDerivedFrom": lastResult.lineage.derivedFrom,
                      "ex:promptFingerprint": lastResult.lineage.provenance.promptFingerprint,
                      "ex:livepeerOutputs": lastResult.livepeerOutputs?.map((o) => ({
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
                            Load Scene ↗
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
                    Enter direction in the prompt box and click "Direct scene" to render the pilot scene via Livepeer and OriginTrail DKG.
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
    </section>
  );
}
