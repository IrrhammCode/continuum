import { User, Music, MapPin } from "lucide-react";
import type { VaultState } from "@shared/types";

interface VaultDrawerProps {
  vault: VaultState;
  selectedCharacters: string[];
  selectedSet: string;
  selectedLeitmotifs: string[];
  onToggleCharacter: (id: string) => void;
  onSelectSet: (id: string) => void;
  onToggleLeitmotif: (id: string) => void;
}

export default function VaultDrawer({
  vault,
  selectedCharacters,
  selectedSet,
  selectedLeitmotifs,
  onToggleCharacter,
  onSelectSet,
  onToggleLeitmotif,
}: VaultDrawerProps) {
  return (
    <aside className="vault-sidebar">
      {/* ── Characters ── */}
      <div className="vault-section">
        <div className="vault-section-header">
          <User size={13} style={{ color: "var(--violet)" }} />
          <h3>Characters</h3>
          <span className="count">{vault.characters.length}</span>
        </div>
        {vault.characters.map((c) => (
          <div
            key={c.id}
            id={`vault-char-${c.id}`}
            className={`asset-card ${selectedCharacters.includes(c.id) ? "selected" : ""}`}
            onClick={() => onToggleCharacter(c.id)}
          >
            <div className="asset-name">{c.name}</div>
            <div className="asset-meta">{c.epithet}</div>
            <div className="color-swatch-row">
              {c.visualDna.attire.colorPalette.map((hex) => (
                <div
                  key={hex}
                  className="color-swatch"
                  style={{ background: hex }}
                  title={hex}
                />
              ))}
            </div>
            <div className="asset-meta" style={{ marginTop: 6, fontSize: 10 }}>
              {c.visualDna.distinguishingFeatures.slice(0, 2).join(" · ")}
            </div>
            {c.ual && <span className="asset-ual">{c.ual}</span>}
          </div>
        ))}
      </div>

      {/* ── Leitmotifs ── */}
      <div className="vault-section">
        <div className="vault-section-header">
          <Music size={13} style={{ color: "var(--gold)" }} />
          <h3>Leitmotifs</h3>
          <span className="count">{vault.leitmotifs.length}</span>
        </div>
        {vault.leitmotifs.map((l) => (
          <div
            key={l.id}
            id={`vault-leit-${l.id}`}
            className={`asset-card ${selectedLeitmotifs.includes(l.id) ? "selected" : ""}`}
            onClick={() => onToggleLeitmotif(l.id)}
          >
            <div className="asset-name">{l.name}</div>
            <div className="asset-meta">
              {l.mood} · {l.bpm} BPM · {l.key}
            </div>
            <div className="asset-meta" style={{ marginTop: 4, fontSize: 10 }}>
              {l.instruments.slice(0, 3).join(", ")}
            </div>
            {l.ual && <span className="asset-ual">{l.ual}</span>}
          </div>
        ))}
      </div>

      {/* ── Sets ── */}
      <div className="vault-section">
        <div className="vault-section-header">
          <MapPin size={13} style={{ color: "var(--teal)" }} />
          <h3>Sets</h3>
          <span className="count">{vault.sets.length}</span>
        </div>
        {vault.sets.map((s) => (
          <div
            key={s.id}
            id={`vault-set-${s.id}`}
            className={`asset-card ${selectedSet === s.id ? "selected" : ""}`}
            onClick={() => onSelectSet(s.id)}
          >
            <div className="asset-name">{s.name}</div>
            <div className="asset-meta">{s.timeOfDay}</div>
            <div className="color-swatch-row">
              {s.colorPalette.map((hex) => (
                <div
                  key={hex}
                  className="color-swatch"
                  style={{ background: hex }}
                  title={hex}
                />
              ))}
            </div>
            {s.ual && <span className="asset-ual">{s.ual}</span>}
          </div>
        ))}
      </div>
    </aside>
  );
}
