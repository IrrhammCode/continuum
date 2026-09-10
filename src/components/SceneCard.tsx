import { ExternalLink, FileJson } from "lucide-react";
import type { SceneResult } from "@shared/types";

interface SceneCardProps {
  scene: SceneResult;
}

export default function SceneCard({ scene }: SceneCardProps) {
  const imageOutput = scene.livepeerOutputs.find((o) => o.type === "image");
  const videoOutput = scene.livepeerOutputs.find((o) => o.type === "video");
  const audioOutput = scene.livepeerOutputs.find((o) => o.type === "audio");

  const totalCost = scene.livepeerOutputs.reduce((sum, o) => sum + o.costUsd, 0);

  const isMock = imageOutput?.url.includes("example.invalid");

  return (
    <div className="scene-card fade-in" id={`scene-${scene.id}`}>
      {/* ── Media Preview ── */}
      <div className="scene-media" style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, var(--surface-2), var(--bg))",
        position: "relative",
      }}>
        {isMock ? (
          <div style={{ textAlign: "center" }}>
            <div className="mono" style={{ color: "var(--violet)", fontSize: 13, fontWeight: 700, marginBottom: 4 }}>MOCK RENDER</div>
            <div style={{ fontSize: 10, color: "var(--text-3)", marginTop: 4 }}>
              Switch to LIVEPEER_MODE=real for actual generation
            </div>
          </div>
        ) : videoOutput ? (
          <video
            src={videoOutput.url}
            controls
            poster={imageOutput?.url}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : imageOutput ? (
          <img
            src={imageOutput.url}
            alt={scene.request.prompt}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div className="mono">No media</div>
        )}

        {/* DKG Badge */}
        <div style={{
          position: "absolute",
          top: 10,
          right: 10,
          padding: "4px 10px",
          borderRadius: 6,
          background: "rgba(0,0,0,0.7)",
          backdropFilter: "blur(8px)",
          border: "1px solid var(--border-2)",
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}>
          <FileJson size={11} style={{ color: "var(--teal)" }} />
          <span className="mono" style={{ color: "var(--teal)", fontSize: 8 }}>DKG VERIFIED</span>
        </div>
      </div>

      {/* ── Info ── */}
      <div className="scene-info">
        <div className="scene-title">
          Episode {scene.request.episodeNumber} — Scene {scene.request.sceneNumber}
        </div>
        <div className="scene-prompt">
          {scene.request.prompt}
        </div>

        {/* Tags */}
        <div className="scene-tags">
          {Object.keys(scene.dkgConstraints.characterTraitsInjected).map((name) => (
            <span key={name} className="scene-tag character">{name}</span>
          ))}
          {scene.dkgConstraints.leitmotifsBound.map((name) => (
            <span key={name} className="scene-tag sound">{name}</span>
          ))}
          <span className="scene-tag set">{scene.dkgConstraints.setConstraintsApplied[0]?.split(":")[0] ?? "Set"}</span>
          <span className="scene-tag ual" title={scene.ual}>
            UAL: {scene.ual?.slice(-12)}
          </span>
        </div>

        {/* Cost */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
          <span className="mono" style={{ fontSize: 9 }}>
            Cost: ${totalCost.toFixed(3)} · {scene.livepeerOutputs.length} outputs
          </span>
          {!isMock && imageOutput && (
            <a
              href={imageOutput.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--violet)", display: "flex", alignItems: "center", gap: 4, fontSize: 11 }}
            >
              <ExternalLink size={10} /> Open
            </a>
          )}
        </div>

        {/* Audio Player */}
        {audioOutput && !isMock && (
          <div style={{ marginTop: 10 }}>
            <audio src={audioOutput.url} controls style={{ width: "100%", height: 28 }} />
          </div>
        )}

        {/* Constraint Log */}
        <details className="constraint-log">
          <summary>DKG Constraint Injection Log</summary>
          <pre>{JSON.stringify(scene.dkgConstraints, null, 2)}</pre>
        </details>

        {/* Lineage */}
        <details className="constraint-log" style={{ marginTop: 8 }}>
          <summary>Provenance Lineage</summary>
          <pre>{JSON.stringify(scene.lineage, null, 2)}</pre>
        </details>
      </div>
    </div>
  );
}
