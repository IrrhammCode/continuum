import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router";
import { Icon } from "../components/StudioShell";
import type { SceneResult, CharacterAsset, SetAsset, LeitmotifAsset } from "@shared/types";
import { useProject } from "../context/ProjectContext";

export function DirectorStudio() {
  const navigate = useNavigate();
  const location = useLocation();
  const { projects, activeProject, selectProjectId } = useProject();

  // ── Vault state from live backend ──
  const [vaultChars, setVaultChars] = useState<CharacterAsset[]>([]);
  const [vaultSets, setVaultSets] = useState<SetAsset[]>([]);
  const [vaultMotifs, setVaultMotifs] = useState<LeitmotifAsset[]>([]);

  // Selected cast
  const [selectedCharIds, setSelectedCharIds] = useState<string[]>([]);
  const [selectedSetId, setSelectedSetId] = useState<string>("");
  const [selectedMotifIds, setSelectedMotifIds] = useState<string[]>([]);

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
    ])
      .then(([chars, sets, sounds]) => {
        setVaultChars(chars ?? []);
        setVaultSets(sets ?? []);
        setVaultMotifs(sounds ?? []);
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
      })
      .catch(() => {});
  }, []);

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

    const payload = {
      projectId: activeProject?.id ?? "proj-ronin-echoes",
      episodeNumber: 1,
      sceneNumber: (projectScenes.length || 0) + 1,
      prompt: prompt.trim(),
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

      {/* ── Cast & Setting Selector ── */}
      <div className="context-strip" style={{ flexWrap: "wrap", gap: "16px" }}>
        {/* Cast Selection */}
        <div className="context-block">
          <label>
            CAST <span>({selectedCharIds.length} SELECTED)</span>
          </label>
          <div className="chips">
            {vaultChars.map((c) => (
              <button
                key={c.id}
                className={`person-chip ${selectedCharIds.includes(c.id) ? "selected" : ""}`}
                onClick={() => toggleChar(c.id)}
                title={`Click to toggle ${c.name}`}
                style={{
                  borderColor: selectedCharIds.includes(c.id) ? "#7657d8" : "#d8d5dd",
                  background: selectedCharIds.includes(c.id) ? "#f4effc" : "#fbfaf8",
                }}
              >
                <i className={`portrait ${c.name.includes("Yuki") ? "yuki" : "ren"}`}></i>
                {c.name}
                {selectedCharIds.includes(c.id) && <Icon name="check" size={13} />}
              </button>
            ))}
          </div>
        </div>

        {/* Setting Selection */}
        <div className="context-block setting">
          <label>
            LOCATION <span>DKG ANCHORED</span>
          </label>
          <div className="chips">
            {vaultSets.map((s) => (
              <button
                key={s.id}
                className={`place-chip ${selectedSetId === s.id ? "selected" : ""}`}
                onClick={() => setSelectedSetId(s.id)}
                style={{
                  borderColor: selectedSetId === s.id ? "#1b9e91" : "#d8d5dd",
                  background: selectedSetId === s.id ? "#e8f8f5" : "#fbfaf8",
                }}
              >
                <i></i>
                {s.name}
                {selectedSetId === s.id && <Icon name="check" size={13} />}
              </button>
            ))}
          </div>
        </div>

        {/* Bound Sound Leitmotif */}
        <div className="motif" style={{ marginLeft: "auto" }}>
          <Icon name="wave" size={19} />
          <div>
            <small>BOUND LEITMOTIF</small>
            <strong>
              {selectedMotif?.name ?? "None"} <span>· {selectedMotif?.key ?? ""}</span>
            </strong>
          </div>
        </div>
      </div>

      {/* ── Director's Intention & Action Prompt ── */}
      <section className="director-panel">
        <div className="director-panel-top">
          <div>
            <p className="eyebrow">DIRECTOR'S INTENTION</p>
            <span style={{ fontSize: "12px", color: "#666" }}>
              Write what happens. The DKG engine automatically locks faces, clothes, and lighting to eliminate visual drift.
            </span>
          </div>
          <button className="constraint" onClick={() => navigate("/vault")}>
            <Icon name="lock" size={13} /> 14 DKG constraints active
          </button>
        </div>

        <textarea
          rows={3}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your scene direction..."
          disabled={rendering}
        />

        <div className="prompt-tools">
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              type="button"
              className="add-detail"
              onClick={() =>
                setPrompt(
                  "Ren stops beneath the neon ramen sign, rain dripping from his trenchcoat. He draws his blade as purple thunder lights the wet street."
                )
              }
            >
              <Icon name="spark" size={14} /> Quick sample: Rain action
            </button>
            <button
              type="button"
              className="add-detail"
              onClick={() =>
                setPrompt(
                  "Yuki hacks the surveillance terminal on the rooftop garden. Holographic data pulses in violet around her face as crescent moonlight shines down."
                )
              }
            >
              <Icon name="spark" size={14} /> Quick sample: Yuki hacking
            </button>
          </div>
          <span>CINEMATIC · 24 FPS · 2.39:1</span>
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
