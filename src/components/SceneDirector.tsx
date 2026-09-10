import { useState } from "react";
import { Clapperboard, Sparkles, Loader2 } from "lucide-react";
import type { VaultState, SceneResult, RenderProgress } from "@shared/types";

interface SceneDirectorProps {
  vault: VaultState;
  selectedCharacters: string[];
  selectedSet: string;
  selectedLeitmotifs: string[];
  onToggleCharacter: (id: string) => void;
  onSelectSet: (id: string) => void;
  onToggleLeitmotif: (id: string) => void;
  onSceneRendered: (scene: SceneResult) => void;
}

export default function SceneDirector({
  vault,
  selectedCharacters,
  selectedSet,
  selectedLeitmotifs,
  onToggleCharacter,
  onSelectSet,
  onToggleLeitmotif,
  onSceneRendered,
}: SceneDirectorProps) {
  const [prompt, setPrompt] = useState("");
  const [episodeNum, setEpisodeNum] = useState(1);
  const [sceneNum, setSceneNum] = useState(1);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<RenderProgress | null>(null);

  const canRender = prompt.trim() && selectedCharacters.length > 0 && selectedSet && !loading;

  const handleRender = async () => {
    if (!canRender) return;
    setLoading(true);
    setProgress({ phase: "querying-dkg", message: "Starting render pipeline…", progress: 5 });

    try {
      const res = await fetch("/api/scenes/render", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          episodeNumber: episodeNum,
          sceneNumber: sceneNum,
          prompt: prompt.trim(),
          cast: {
            characterIds: selectedCharacters,
            setId: selectedSet,
            leitmotifIds: selectedLeitmotifs,
          },
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Render failed");
      }

      const scene: SceneResult = await res.json();
      onSceneRendered(scene);
      setProgress({ phase: "complete", message: "Scene rendered and Knowledge Asset minted.", progress: 100 });
      setPrompt("");
      setSceneNum((n) => n + 1);
    } catch (err) {
      setProgress({
        phase: "error",
        message: `Error: ${(err as Error).message}`,
        progress: 0,
      });
    } finally {
      setLoading(false);
      setTimeout(() => setProgress(null), 4000);
    }
  };

  return (
    <div className="director-prompt-card fade-in">
      <div className="prompt-header">
        <div className="signal" />
        <span className="mono" style={{ color: "var(--teal)", letterSpacing: "0.14em" }}>
          Director Console
        </span>
        <div style={{ marginLeft: "auto", display: "flex", gap: 10, alignItems: "center" }}>
          <div className="mono" style={{ display: "flex", alignItems: "center", gap: 4 }}>
            EP
            <input
              type="number"
              min={1}
              value={episodeNum}
              onChange={(e) => setEpisodeNum(Number(e.target.value))}
              style={{
                width: 40,
                padding: "4px 6px",
                border: "1px solid var(--border-2)",
                borderRadius: 4,
                background: "var(--bg)",
                color: "var(--text)",
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                textAlign: "center",
              }}
            />
          </div>
          <div className="mono" style={{ display: "flex", alignItems: "center", gap: 4 }}>
            SC
            <input
              type="number"
              min={1}
              value={sceneNum}
              onChange={(e) => setSceneNum(Number(e.target.value))}
              style={{
                width: 40,
                padding: "4px 6px",
                border: "1px solid var(--border-2)",
                borderRadius: 4,
                background: "var(--bg)",
                color: "var(--text)",
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                textAlign: "center",
              }}
            />
          </div>
        </div>
      </div>

      {/* ── Cast Chips ── */}
      <div style={{ marginBottom: 14 }}>
        <div className="mono" style={{ marginBottom: 8 }}>Cast</div>
        <div className="cast-selector">
          {vault.characters.map((c) => (
            <button
              key={c.id}
              className={`cast-chip ${selectedCharacters.includes(c.id) ? "active" : ""}`}
              onClick={() => onToggleCharacter(c.id)}
            >
              {c.name}
            </button>
          ))}
          {vault.sets.map((s) => (
            <button
              key={s.id}
              className={`cast-chip set ${selectedSet === s.id ? "active" : ""}`}
              onClick={() => onSelectSet(s.id)}
            >
              {s.name}
            </button>
          ))}
          {vault.leitmotifs.map((l) => (
            <button
              key={l.id}
              className={`cast-chip sound ${selectedLeitmotifs.includes(l.id) ? "active" : ""}`}
              onClick={() => onToggleLeitmotif(l.id)}
            >
              {l.name.split("—")[0]}
            </button>
          ))}
        </div>
      </div>

      {/* ── Prompt ── */}
      <textarea
        id="scene-prompt"
        className="prompt-input"
        placeholder="Describe the scene action… e.g. 'Ren walks through the rain-soaked alley, neon reflections glinting off his trenchcoat. He stops and looks up at a flickering holographic billboard.'"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        disabled={loading}
      />

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button
          id="render-button"
          className="render-button"
          disabled={!canRender}
          onClick={handleRender}
        >
          {loading ? (
            <Loader2 size={16} className="spin" />
          ) : (
            <Clapperboard size={16} />
          )}
          {loading ? "Rendering…" : "Direct Scene"}
        </button>

        <Sparkles size={14} style={{ color: "var(--gold)", opacity: 0.5 }} />
        <span style={{ fontSize: 11, color: "var(--text-3)" }}>
          DKG-verified constraints auto-injected
        </span>
      </div>

      {/* ── Progress ── */}
      {progress && (
        <div className="progress-bar-container fade-in">
          <div className="progress-bar-track">
            <div
              className="progress-bar-fill"
              style={{ width: `${progress.progress}%` }}
            />
          </div>
          <div className="progress-message">
            <span className="mono" style={{ color: progress.phase === "error" ? "var(--rose)" : "var(--teal)" }}>
              [{progress.phase}]
            </span>{" "}
            {progress.message}
          </div>
        </div>
      )}
    </div>
  );
}
