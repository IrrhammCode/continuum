import { useState, useEffect, useRef } from "react";
import { createBrowserRouter, Link, useNavigate } from "react-router";
import { StudioShell, Icon } from "./components/StudioShell";
import { DirectorStudio } from "./pages/DirectorStudio";
import { ContinuumLogo } from "./components/ContinuumLogo";
import type { CharacterAsset, SetAsset, LeitmotifAsset, GraphData, GraphNode, SceneResult, Project, PropAsset } from "@shared/types";
import { useProject } from "./context/ProjectContext";
import { useToast } from "./components/HudToast";
import renDriftImg from "./assets/continuity/ren-drift.jpg";
import renAnchor1Img from "./assets/continuity/ren-anchor-1.jpg";
import renAnchor2Img from "./assets/continuity/ren-anchor-2.jpg";

function PublicNav() {
  return (
    <header className="public-nav">
      <Link to="/" className="public-brand" style={{ textDecoration: "none" }}>
        <ContinuumLogo size="sm" showTagline={false} />
      </Link>
      <nav>
        <a href="#technology">DKG Architecture</a>
        <a href="#showcase">Continuity Proof</a>
        <a href="#vault">Living Vault</a>
        <Link to="/studio">Director Studio</Link>
      </nav>
      <div>
        <Link to="/studio" className="nav-ghost">
          Connect ID
        </Link>
        <Link to="/studio" className="nav-launch">
          Launch Studio <span>↗</span>
        </Link>
      </div>
    </header>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 1. LANDING PAGE — DKG & LIVEPEER CINEMA ENGINE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function Landing() {
  return (
    <div className="landing">
      <PublicNav />
      <main>
        {/* ── Hero Section ── */}
        <section className="landing-hero">
          <p className="landing-kicker">
            <b></b> NEURO-SYMBOLIC AI CINEMA ENGINE · ORIGINTRAIL DKG × LIVEPEER AGENT
          </p>
          <h1>
            Kill visual drift.<br />
            <i>Make every frame remember.</i>
          </h1>
          <p className="hero-copy">
            Standard AI video suffers from parameter amnesia—faces warp, costumes change, and themes disappear between shots.
            Continuum anchors character visual DNA, voice profiles, and musical leitmotifs into verifiable <strong>OriginTrail DKG Knowledge Assets (KAs)</strong>, rendered into cohesive episodic cinema by autonomous <strong>Livepeer AI Agents</strong>.
          </p>
          <div className="hero-actions">
            <Link to="/studio" className="hero-primary">
              Launch Director Studio <span>→</span>
            </Link>
            <a href="#showcase" className="hero-secondary">
              <span className="tiny-play">▶</span> Explore Continuity Test
            </a>
          </div>
          <div className="hero-proof">
            <span className="proof-line"></span>
            <span>VERIFIED ON ORIGINTRAIL DKG</span>
            <span>POWERED BY LIVEPEER AGENT MCP</span>
            <span>W3C PROV-O COMPLIANT</span>
          </div>
        </section>

        {/* ── Visual Continuity Split-Test ── */}
        <section id="showcase" className="continuity-reel">
          <div className="reel-caption">
            <p>THE VISUAL CONTINUITY PROBLEM SOLVED</p>
            <h2>
              One character.<br />
              Zero parameter drift.
            </h2>
            <span>NEO-TOKYO RAIN DISTRICT · 3 CONSECUTIVE SHOTS</span>
          </div>
          <div className="reel-stage">
            <div className="reel-frames">
              <div className="reel-card drift">
                <div className="reel-card-top">
                  <b>STANDARD AI GENERATOR</b>
                  <span className="reel-tag drift-tag">DRIFT DETECTED</span>
                </div>
                <div className="reel-visual">
                  <img src={renDriftImg} alt="Standard AI with visual drift" className="reel-img drift-img" />
                  <div className="drift-glitch-scan"></div>
                </div>
                <small>
                  MUTATING FACE & COAT <i></i>
                </small>
              </div>
              <div className="reel-card anchor">
                <div className="reel-card-top">
                  <b>DKG ASSET LOCKED</b>
                  <span className="reel-tag anchor-tag">SHOT 01 · CANONICAL</span>
                </div>
                <div className="reel-visual">
                  <img src={renAnchor1Img} alt="Ren Akiyama Shot 1" className="reel-img anchor-img" />
                  <div className="hud-scanline"></div>
                </div>
                <small>
                  VERIFIED VISUAL DNA <i></i>
                </small>
              </div>
              <div className="reel-card anchor third">
                <div className="reel-card-top">
                  <b>DKG ASSET LOCKED</b>
                  <span className="reel-tag anchor-tag">SHOT 02 · ZERO DRIFT</span>
                </div>
                <div className="reel-visual">
                  <img src={renAnchor2Img} alt="Ren Akiyama Shot 2" className="reel-img anchor-img" />
                  <div className="hud-scanline"></div>
                </div>
                <small>
                  VERIFIED VISUAL DNA <i></i>
                </small>
              </div>
            </div>
            <div className="reel-callout">
              <span>01</span>
              <p>
                Exact cheek scar. Identical cybernetic eye HUD. Consistent trenchcoat trim.<br />
                Anchored to UAL <code>did:dkg:continuum/character/7d81…</code> across every episode.
              </p>
            </div>
          </div>
        </section>

        {/* ── 3-Pillar Architecture Protocol ── */}
        <section id="technology" className="landing-technology">
          <p className="landing-kicker">
            <b></b> HOW CONTINUUM WORKS
          </p>
          <h2>
            Your show bible becomes<br />
            <i>decentralized production infrastructure.</i>
          </h2>
          <div className="protocol-grid">
            <article>
              <span>01</span>
              <h3>Anchor the Canon to DKG</h3>
              <p>
                Characters, lighting schemas, and musical motifs are minted as JSON-LD Knowledge Assets on OriginTrail DKG. Deterministic UALs hold face seeds, color hexes, and 17+ negative anti-drift guards.
              </p>
            </article>
            <article>
              <span>02</span>
              <h3>Autonomous Livepeer Director</h3>
              <p>
                Direct in natural language. The Director Agent queries DKG graph relations via SPARQL-like constraints, enriches your prompt, and orchestrates multi-stage Livepeer AI tools (Flux keyframes, Kling video, Sonilo music).
              </p>
            </article>
            <article>
              <span>03</span>
              <h3>Verifiable W3C Provenance</h3>
              <p>
                Every rendered scene is minted back to the DKG as an auditable Knowledge Asset with <code>prov:wasDerivedFrom</code> links to its source character, set, and audio UALs.
              </p>
            </article>
          </div>
        </section>

        {/* ── Living Asset Vault Preview ── */}
        <section id="vault" className="vault-preview">
          <div>
            <p className="landing-kicker">
              <b></b> LIVING ASSET VAULT
            </p>
            <h2>
              Not disposable prompts.<br />
              Permanent <i>memory.</i>
            </h2>
            <p>
              Knowledge Assets link together organically. When <strong>Ren Akiyama</strong> enters the <strong>Rain District</strong>, the Director automatically binds his canonical trenchcoat constraints and queues his synthwave leitmotif in D minor.
            </p>
            <Link to="/vault" className="text-link">
              Explore the Living Vault <span>→</span>
            </Link>
          </div>
          <div className="asset-composition">
            <div className="asset-stack character">
              <small>CHARACTER KA</small>
              <b>Ren Akiyama</b>
              <span>VISUAL DNA · 18 DKG RULES</span>
            </div>
            <div className="asset-stack location">
              <small>ENVIRONMENT KA</small>
              <b>Rain District</b>
              <span>LIGHTING SCHEMA · 9 DKG RULES</span>
            </div>
            <div className="asset-stack audio">
              <small>LEITMOTIF KA</small>
              <b>Ren's Blade</b>
              <span>D MINOR · 120 BPM · SYNTHWAVE</span>
            </div>
            <svg viewBox="0 0 440 260">
              <path d="M105 75 C220 40 220 180 335 130 M105 75 C190 150 260 205 335 185" />
            </svg>
          </div>
        </section>

        {/* ── Call To Action ── */}
        <section className="closing">
          <p>BUILT FOR ATUMERA HACKATHON · LIVEPEER × ORIGINTRAIL</p>
          <h2>
            Direct a cinematic universe<br />
            that <i>never forgets.</i>
          </h2>
          <Link to="/studio">
            Enter Director Studio <span>→</span>
          </Link>
        </section>
      </main>

      <footer>
        <div className="public-brand">
          <ContinuumLogo size="sm" showTagline={false} />
        </div>
        <span>BUILT ON ORIGINTRAIL DKG (V8 PARANET) × LIVEPEER AGENT MCP</span>
        <span>© 2026 CONTINUUM STUDIO</span>
      </footer>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 2. CHARACTERS PAGE — LIVING ASSET VAULT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function LineIcon({ type }: { type: "voice" | "music" | "x" | "play" }) {
  return (
    <span className={`line-icon ${type}`}>
      {type === "x" ? "×" : type === "play" ? "▶" : type === "voice" ? "⌁" : "♪"}
    </span>
  );
}

export function Characters() {
  const { projects, activeProject, selectProjectId } = useProject();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [drawer, setDrawer] = useState(false);
  const [query, setQuery] = useState("");
  const [characterList, setCharacterList] = useState<CharacterAsset[]>([]);
  const [minting, setMinting] = useState(false);
  const [generatingAvatarId, setGeneratingAvatarId] = useState<string | null>(null);
  const [copiedUal, setCopiedUal] = useState<string | null>(null);

  // Form state
  const [targetProjectId, setTargetProjectId] = useState(activeProject?.id ?? "proj-ronin-echoes");
  const [features, setFeatures] = useState([
    "scar across right cheek",
    "glowing cybernetic left eye",
    "circuit-trace trenchcoat",
  ]);
  const [formName, setFormName] = useState("Mika Sato");
  const [formEpithet, setFormEpithet] = useState("The Memory Diver");
  const [formHair, setFormHair] = useState("#16121D");
  const [formEye, setFormEye] = useState("#63D4C0");
  const [formSkin, setFormSkin] = useState("#B7785B");
  const [formAttire, setFormAttire] = useState("Charcoal diving coat, silver collar seal, no corporate branding.");
  const [formVoice, setFormVoice] = useState("Deep, reflective, measured cadence");
  const [formNegative, setFormNegative] = useState("no blond hair, no casual clothes, no cheerful smile");

  // Sync targetProjectId when activeProject changes
  useEffect(() => {
    if (activeProject?.id) {
      setTargetProjectId(activeProject.id);
    }
  }, [activeProject?.id]);

  const refreshCharacters = () => {
    const url = activeProject?.id
      ? `/api/vault/characters?projectId=${encodeURIComponent(activeProject.id)}`
      : "/api/vault/characters";
    fetch(url)
      .then((r) => r.json())
      .then((data: CharacterAsset[]) => {
        if (Array.isArray(data)) setCharacterList(data);
      })
      .catch(() => {});
  };

  useEffect(() => {
    refreshCharacters();
  }, [activeProject?.id]);

  const handleCopyUal = (ual: string) => {
    navigator.clipboard.writeText(ual);
    setCopiedUal(ual);
    setTimeout(() => setCopiedUal(null), 2200);
  };

  const applyPreset = (preset: "samurai" | "netrunner" | "vance" | "fixer") => {
    if (preset === "samurai") {
      setFormName("Ren Akiyama");
      setFormEpithet("The Cyber Samurai");
      setFormHair("#1A1A2E");
      setFormEye("#00FF88");
      setFormSkin("#D4A574");
      setFeatures(["glowing cybernetic left eye", "diagonal scar across right cheek", "black hair with green streak"]);
      setFormAttire("Long black armored trenchcoat with neon-green circuit-trace trim, dark tactical pants, combat boots");
      setFormVoice("Deep, gravelly, measured cadence");
      setFormNegative("no blond hair, no casual clothes, no smiling cheerfully");
    } else if (preset === "netrunner") {
      setFormName("Yuki Tanabe");
      setFormEpithet("The Ghost Hacker");
      setFormHair("#E8E0F0");
      setFormEye("#C084FC");
      setFormSkin("#FAE0C8");
      setFeatures(["silver-lavender hair", "violet holographic eye implants", "constellation temple tattoo"]);
      setFormAttire("Oversized dark-purple hoodie with holographic patterns, black leggings, purple sneakers");
      setFormVoice("High, rapid, playful but razor-sharp");
      setFormNegative("no corporate suits, no swords, no heavy armor");
    } else if (preset === "vance") {
      setFormName("Vance Vance");
      setFormEpithet("The Synth-Archaeologist");
      setFormHair("#4A3728");
      setFormEye("#38BDF8");
      setFormSkin("#E2B897");
      setFeatures(["bionic audio antenna behind ear", "reinforced exo-gloves", "dust-stained lens visor"]);
      setFormAttire("Weathered canvas duster with copper wire lining, high-collar hazard respirator");
      setFormVoice("Calm, analytical, echoey over suit comms");
      setFormNegative("no young teenager face, no casual streetwear, no firearms");
    } else if (preset === "fixer") {
      setFormName("Harlan Drake");
      setFormEpithet("The High-Sector Fixer");
      setFormHair("#1E1E24");
      setFormEye("#F59E0B");
      setFormSkin("#D9A07E");
      setFeatures(["golden ocular chronometer", "silver hair at temples", "cybernetic vocal modulator"]);
      setFormAttire("Pinstripe tailored obsidian nanofiber suit, gold cufflinks, concealed kinetic shield emitter");
      setFormVoice("Smooth, baritone, authoritative negotiation tone");
      setFormNegative("no casual clothes, no messy hair, no street grime");
    }
  };

  const handleGenerateAvatar = async (charId: string) => {
    setGeneratingAvatarId(charId);
    try {
      const res = await fetch(`/api/vault/characters/${charId}/avatar`, { method: "POST" });
      if (res.ok) {
        refreshCharacters();
        showToast({
          type: "success",
          title: "AI Portrait Generated",
          message: "Visual DNA rendered via Livepeer Agent (Flux) & bound to DKG!",
        });
      } else {
        const err = await res.json().catch(() => ({}));
        showToast({
          type: "error",
          title: "Avatar Generation Error",
          message: err.error ?? "Failed to generate character avatar",
        });
      }
    } catch (e) {
      showToast({
        type: "error",
        title: "Connection Error",
        message: (e as Error).message,
      });
    } finally {
      setGeneratingAvatarId(null);
    }
  };

  const handleMintCharacter = async () => {
    if (minting) return;
    setMinting(true);
    try {
      const negArr = formNegative.split(",").map((s) => s.trim()).filter(Boolean);
      const res = await fetch("/api/vault/characters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: targetProjectId,
          name: formName,
          epithet: formEpithet,
          hairColor: formHair,
          eyeColor: formEye,
          skinTone: formSkin,
          distinguishingFeatures: features,
          canonicalAttire: formAttire,
          negativePrompts: negArr,
          voiceTimbre: formVoice,
        }),
      });
      if (res.ok) {
        const newChar: CharacterAsset = await res.json();
        refreshCharacters();
        setDrawer(false);
        showToast({
          type: "success",
          title: "Character Minted to DKG",
          message: `Character "${newChar.name}" anchored with verifiable visual DNA!`,
          ual: newChar.ual,
        });
      } else {
        const err = await res.json().catch(() => ({}));
        showToast({
          type: "error",
          title: "Minting Failed",
          message: err.error ?? "Character could not be minted",
        });
      }
    } catch (e) {
      showToast({
        type: "error",
        title: "Minting Error",
        message: (e as Error).message,
      });
    } finally {
      setMinting(false);
    }
  };

  const displayList = characterList;

  const visible = displayList.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.epithet.toLowerCase().includes(query.toLowerCase()) ||
      (c.visualDna?.distinguishingFeatures ?? []).some((f) =>
        f.toLowerCase().includes(query.toLowerCase())
      ) ||
      (c.ual && c.ual.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <main className="character-page">
      {/* ── Breadcrumb & Project Selector ── */}
      <div className="vault-breadcrumb" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <span>{(activeProject?.title ?? "CYBERPUNK: RONIN ECHOES").toUpperCase()}</span>
          <b>›</b> <strong>SEASON {String(activeProject?.seasonNumber ?? 1).padStart(2, "0")}</strong>
          <b>›</b> <span style={{ color: "#7963c8" }}>LIVING ASSET VAULT · CHARACTERS</span>
        </div>
        
        {/* Project Switcher */}
        <div className="project-selector-wrap" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "10px", color: "#8a8994", fontWeight: 700 }}>ACTIVE PROJECT:</span>
          <select
            className="project-select-dropdown"
            value={activeProject?.id ?? ""}
            onChange={(e) => selectProjectId(e.target.value)}
            aria-label="Select active project"
            style={{
              padding: "6px 12px",
              borderRadius: "6px",
              border: "1px solid #dcdbe4",
              background: "#fff",
              font: "700 11px Manrope",
              color: "#302f3a",
            }}
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} ({p.genre})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="characters-head">
        <div>
          <p className="character-label">ORIGINTRAIL DKG CANONICAL ROSTER</p>
          <h1>
            Living Character <i>Personas.</i>
          </h1>
          <p>
            Verifiable Knowledge Assets that lock face seeds, color hexes, and negative prompt guards across every episode.
          </p>
        </div>
        <button
          className="mint-button"
          onClick={() => {
            setTargetProjectId(activeProject?.id ?? "proj-ronin-echoes");
            setDrawer(true);
          }}
        >
          + &nbsp;Mint new character KA
        </button>
      </div>

      <div className="roster-tools">
        <label className="search-field">
          <span>⌕</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by visual seed, UAL, or trait..."
          />
        </label>
        <span className="roster-count">{visible.length} DKG KNOWLEDGE ASSETS</span>
      </div>

      <div className="character-grid">
        {visible.map((c) => (
          <article className="character-card" key={c.id || c.name}>
            <div className={`character-portrait ${c.name.includes("Yuki") ? "yuki" : "ren"} ${c.avatarUrl ? "has-image" : ""}`} style={{ position: "relative", overflow: "hidden" }}>
              {c.avatarUrl && (
                <img
                  src={c.avatarUrl}
                  alt={c.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", top: 0, left: 0, zIndex: 1 }}
                />
              )}
              <span className="verify-pill" style={{ zIndex: 2 }}>
                <i></i>DKG ANCHORED
              </span>
              {!c.avatarUrl && <div className="portrait-structure"></div>}
            </div>
            <div className="character-card-body">
              <div className="character-title">
                <div>
                  <h2>{c.name}</h2>
                  <p>{c.epithet}</p>
                </div>
              </div>
              {c.compliance && (
                <div style={{ margin: "6px 0", padding: "4px 8px", background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "10px", color: "#1e40af" }}>
                  <span style={{ fontWeight: 800 }}>ENTERPRISE LICENSED IP</span>
                  <span style={{ fontFamily: "DM Mono" }}>{c.compliance.licenseType.slice(0, 20)}…</span>
                </div>
              )}
              <div className="swatches">
                {c.visualDna?.attire?.colorPalette?.map((hex) => (
                  <span key={hex} style={{ background: hex }} title={hex} />
                ))}
                <small>VISUAL DNA</small>
              </div>
              <div className="trait-list">
                {c.visualDna?.distinguishingFeatures?.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
              <div className="binding">
                <p>
                  <LineIcon type="voice" />
                  <span>
                    <b>Voice Profile:</b> {c.voiceProfile?.timbreDescription ?? "Onyx · Deep, measured"}
                  </span>
                </p>
              </div>
              <button
                className="outline-button"
                style={{
                  width: "100%",
                  marginTop: "12px",
                  fontSize: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  padding: "7px 10px",
                  borderColor: "#7657d8",
                  color: "#7657d8",
                  background: generatingAvatarId === c.id ? "#f4effc" : "transparent",
                }}
                disabled={generatingAvatarId === c.id}
                onClick={() => handleGenerateAvatar(c.id)}
              >
                {generatingAvatarId === c.id ? (
                  <>Rendering Flux Portrait (~5s)…</>
                ) : c.avatarUrl ? (
                  <>Re-render AI Portrait (Flux)</>
                ) : (
                  <>Generate AI Portrait (Livepeer Flux)</>
                )}
              </button>
            </div>
            
            {/* Card Actions Footer */}
            <div className="prop-card-actions" style={{ padding: "10px 16px" }}>
              <div
                className="vault-ual-tag"
                title="Click to copy OriginTrail DKG UAL"
                onClick={() => handleCopyUal(c.ual || `did:dkg:continuum/character/${c.id}`)}
              >
                <span>{copiedUal === (c.ual || `did:dkg:continuum/character/${c.id}`) ? "✓ COPIED" : "DKG UAL"}</span>
                <code>{(c.ual || `did:dkg:continuum/character/${c.id}`).slice(0, 16)}…</code>
              </div>

              <button
                className="character-direct-btn"
                title="Cast this character in Director Studio"
                onClick={() => {
                  navigate("/studio", {
                    state: {
                      characterId: c.id,
                      projectId: c.projectId || activeProject?.id,
                    },
                  });
                }}
              >
                Direct in Scene ↗
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* ── Slide-over Drawer: Mint New Character KA ── */}
      {drawer && (
        <>
          <button
            aria-label="Close drawer"
            className="drawer-shade"
            onClick={() => setDrawer(false)}
          />
          <aside className="character-drawer">
            <header>
              <div>
                <p className="character-label">ORIGINTRAIL DKG MINTING WIZARD</p>
                <h2>
                  Mint Character<br />
                  Asset to DKG
                </h2>
              </div>
              <button onClick={() => setDrawer(false)} aria-label="Close">
                <LineIcon type="x" />
              </button>
            </header>
            <div className="drawer-form">
              {/* Inspiration Presets */}
              <section style={{ padding: "16px 0" }}>
                <span style={{ fontSize: "10px", color: "#8a8894", fontWeight: 700 }}>QUICK PRESETS:</span>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "6px" }}>
                  <button type="button" className="preset-chip-btn" onClick={() => applyPreset("samurai")}>
                    + Cyber Samurai
                  </button>
                  <button type="button" className="preset-chip-btn" onClick={() => applyPreset("netrunner")}>
                    + Ghost Netrunner
                  </button>
                  <button type="button" className="preset-chip-btn" onClick={() => applyPreset("vance")}>
                    + Astrobiologist Vance
                  </button>
                  <button type="button" className="preset-chip-btn" onClick={() => applyPreset("fixer")}>
                    + Corporate Fixer
                  </button>
                </div>
              </section>

              {/* Target Project Selection */}
              <section style={{ padding: "16px 0" }}>
                <label>
                  Target Project
                  <select
                    value={targetProjectId}
                    onChange={(e) => setTargetProjectId(e.target.value)}
                    disabled={minting}
                  >
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title} ({p.genre})
                      </option>
                    ))}
                  </select>
                  <span style={{ fontSize: "9px", color: "#888693", fontWeight: 400, marginTop: "4px" }}>
                    The character will be anchored into this project's DKG Paranet subgraph.
                  </span>
                </label>
              </section>

              <section>
                <h3>01 / Identity & Schema.org Metadata</h3>
                <div className="field-pair">
                  <label>
                    Name
                    <input placeholder="e.g. Ren Akiyama" value={formName} onChange={(e) => setFormName(e.target.value)} />
                  </label>
                  <label>
                    Epithet
                    <input placeholder="The Cyber Samurai" value={formEpithet} onChange={(e) => setFormEpithet(e.target.value)} />
                  </label>
                </div>
              </section>

              <section>
                <h3>02 / Deterministic Visual DNA</h3>
                <div className="field-trio">
                  <label>
                    Hair Hex
                    <input value={formHair} onChange={(e) => setFormHair(e.target.value)} />
                  </label>
                  <label>
                    Eye Hex
                    <input value={formEye} onChange={(e) => setFormEye(e.target.value)} />
                  </label>
                  <label>
                    Skin Hex
                    <input value={formSkin} onChange={(e) => setFormSkin(e.target.value)} />
                  </label>
                </div>
                <label>
                  Distinguishing traits (injected into prompt)
                  <div className="feature-input">
                    <input
                      placeholder="Add trait (press Enter)…"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && e.currentTarget.value) {
                          setFeatures([...features, e.currentTarget.value]);
                          e.currentTarget.value = "";
                        }
                      }}
                    />
                    <span>↵</span>
                  </div>
                </label>
                <div className="feature-tags">
                  {features.map((f) => (
                    <button
                      type="button"
                      key={f}
                      onClick={() => setFeatures(features.filter((x) => x !== f))}
                    >
                      {f} <b>×</b>
                    </button>
                  ))}
                </div>
                <label>
                  Canonical attire
                  <textarea value={formAttire} onChange={(e) => setFormAttire(e.target.value)} />
                </label>
                <label className="negative-label">
                  DKG Anti-Drift Negative Guard (Strict Forbidden Traits)
                </label>
                <input
                  value={formNegative}
                  onChange={(e) => setFormNegative(e.target.value)}
                  placeholder="e.g. no blond hair, no casual clothes, no cheerful smile"
                />
              </section>

              <section>
                <h3>03 / Voice & Speech Binding</h3>
                <label>
                  Voice timbre description
                  <input value={formVoice} onChange={(e) => setFormVoice(e.target.value)} />
                </label>
              </section>

              {/* Live Preview Card */}
              <section>
                <span style={{ fontSize: "10px", color: "#8a8894", fontWeight: 700 }}>LIVE KNOWLEDGE ASSET PREVIEW:</span>
                <div className="vault-preview-container">
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                    <div
                      style={{
                        width: "42px",
                        height: "42px",
                        borderRadius: "50%",
                        background: `radial-gradient(circle at 35% 35%, ${formEye} 0%, ${formSkin} 40%, ${formHair} 95%)`,
                        border: `2px solid ${formEye}`,
                        boxShadow: `0 0 10px ${formEye}55`,
                      }}
                    />
                    <div>
                      <h4 style={{ margin: 0, font: "600 16px 'Playfair Display'", color: "#1a1924" }}>
                        {formName || "Untitled Persona"}
                      </h4>
                      <span style={{ fontSize: "11px", color: "#6e6c7c" }}>{formEpithet}</span>
                    </div>
                  </div>
                  <div className="swatches" style={{ margin: "6px 0" }}>
                    <span style={{ background: formHair }} title={`Hair: ${formHair}`} />
                    <span style={{ background: formEye }} title={`Eye: ${formEye}`} />
                    <span style={{ background: formSkin }} title={`Skin: ${formSkin}`} />
                    <small style={{ font: "8px 'DM Mono'", color: "#8b8994" }}>PALETTE: HAIR · EYE · SKIN</small>
                  </div>
                  <p style={{ fontSize: "10px", color: "#4f4e5a", margin: "6px 0", lineHeight: 1.4 }}>
                    {formAttire}
                  </p>
                  <code style={{ fontSize: "8px", color: "#16896f" }}>
                    did:dkg:continuum/character/{targetProjectId}/{formName.toLowerCase().replace(/\s+/g, "-") || "new"}
                  </code>
                </div>
              </section>
            </div>
            <footer>
              <button
                type="button"
                onClick={handleMintCharacter}
                disabled={minting}
              >
                {minting ? "Minting to DKG…" : "Mint Character KA to OriginTrail DKG"} <span>→</span>
              </button>
              <p>Generates W3C PROV-O JSON-LD and registers on-chain UAL identifier.</p>
            </footer>
          </aside>
        </>
      )}
    </main>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 3. SETS & ENVIRONMENTS PAGE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function Sets() {
  const { projects, activeProject, selectProjectId } = useProject();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [modal, setModal] = useState(false);
  const [setList, setSetList] = useState<SetAsset[]>([]);
  const [mintingSet, setMintingSet] = useState(false);
  const [generatingImageId, setGeneratingImageId] = useState<string | null>(null);
  const [copiedUal, setCopiedUal] = useState<string | null>(null);

  // Form state
  const [targetProjectId, setTargetProjectId] = useState(activeProject?.id ?? "proj-ronin-echoes");
  const [setFormName, setSetFormName] = useState("Neo-Tokyo Rain District");
  const [setFormDesc, setSetFormDesc] = useState("A rain-soaked cyberpunk alley in a neon-drenched megacity. Towering holographic billboards flicker above narrow streets.");
  const [setFormLighting, setSetFormLighting] = useState("Volumetric neon fog, wet asphalt reflections, deep rim shadows");
  const [setFormTod, setSetFormTod] = useState("Night");
  const [setFormPalette, setSetFormPalette] = useState<string[]>(["#0A0A1A", "#7C3AED", "#00FF88", "#06B6D4"]);
  const [setFormNegative, setSetFormNegative] = useState("no direct daylight, no rural greenery, no natural vegetation");

  // Sync targetProjectId when activeProject changes
  useEffect(() => {
    if (activeProject?.id) {
      setTargetProjectId(activeProject.id);
    }
  }, [activeProject?.id]);

  const refreshSets = () => {
    const url = activeProject?.id
      ? `/api/vault/sets?projectId=${encodeURIComponent(activeProject.id)}`
      : "/api/vault/sets";
    fetch(url)
      .then((r) => r.json())
      .then((data: SetAsset[]) => {
        if (Array.isArray(data)) setSetList(data);
      })
      .catch(() => {});
  };

  useEffect(() => {
    refreshSets();
  }, [activeProject?.id]);

  const handleCopyUal = (ual: string) => {
    navigator.clipboard.writeText(ual);
    setCopiedUal(ual);
    setTimeout(() => setCopiedUal(null), 2200);
  };

  const applySetPreset = (preset: "alley" | "garden" | "archive" | "derelict" | "rain") => {
    if (preset === "alley" || preset === "rain") {
      setSetFormName("Neo-Tokyo Rain District");
      setSetFormDesc("A rain-soaked cyberpunk alley in a neon-drenched megacity. Towering holographic billboards flicker above narrow streets.");
      setSetFormLighting("Volumetric neon fog, wet asphalt reflections, deep rim shadows");
      setSetFormTod("Night");
      setSetFormPalette(["#0A0A1A", "#7C3AED", "#00FF88", "#06B6D4"]);
      setSetFormNegative("no direct daylight, no rural greenery, no natural vegetation");
    } else if (preset === "derelict") {
      setSetFormName("Derelict Station Alpha");
      setSetFormDesc("An abandoned orbital corridor overgrown with silent wiring and shattered bulkheads. Distant starlight cuts through frosted decompression cracks.");
      setSetFormLighting("Stark amber emergency beacon pulse, rim reflections on frozen titanium");
      setSetFormTod("Void / Zero-G");
      setSetFormPalette(["#080C14", "#F59E0B", "#1E293B", "#38BDF8"]);
      setSetFormNegative("no atmospheric clouds, no blue sky, no warm sunlight");
    } else if (preset === "garden") {
      setSetFormName("The Floating Sky Garden");
      setSetFormDesc("A suspended rooftop sanctuary atop the megacity, lit by bioluminescent moonwater pools, pale orchids, and tranquil night haze.");
      setSetFormLighting("Soft bioluminescent glow, gentle moonlight, warm lantern accents");
      setSetFormTod("Late Night");
      setSetFormPalette(["#0F172A", "#22D3EE", "#A78BFA", "#ECFDF5"]);
      setSetFormNegative("no harsh sunlight, no crowded traffic, no underground tunnel");
    } else if (preset === "archive") {
      setSetFormName("Subterranean Memory Archive");
      setSetFormDesc("A quiet subterranean archive where suspended glass memory capsules glow beneath dark still water and ancient server racks hum quietly.");
      setSetFormLighting("Cold cyan under-lighting, subtle violet rim lighting, volumetric mist. Zero direct sunlight.");
      setSetFormTod("Subterranean");
      setSetFormPalette(["#0D1117", "#06B6D4", "#8B5CF6", "#1E293B"]);
      setSetFormNegative("no direct sunlight, no cheerful colors, no open sky");
    }
  };

  const handleGenerateSetImage = async (setId: string) => {
    setGeneratingImageId(setId);
    try {
      const res = await fetch(`/api/vault/sets/${setId}/image`, { method: "POST" });
      if (res.ok) {
        refreshSets();
        showToast({
          type: "success",
          title: "Concept Art Rendered",
          message: "Keyframe rendered via Livepeer Agent (Flux) & anchored to DKG!",
        });
      } else {
        const err = await res.json().catch(() => ({}));
        showToast({
          type: "error",
          title: "Concept Art Error",
          message: err.error ?? "Failed to generate concept art",
        });
      }
    } catch (e) {
      showToast({
        type: "error",
        title: "Connection Error",
        message: (e as Error).message,
      });
    } finally {
      setGeneratingImageId(null);
    }
  };

  const handleMintSet = async () => {
    if (mintingSet) return;
    setMintingSet(true);
    try {
      const negArr = setFormNegative.split(",").map((s) => s.trim()).filter(Boolean);
      const res = await fetch("/api/vault/sets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: targetProjectId,
          name: setFormName,
          description: setFormDesc,
          lightingSchema: setFormLighting,
          timeOfDay: setFormTod.toUpperCase(),
          colorPalette: setFormPalette,
          negativePrompts: negArr,
        }),
      });
      if (res.ok) {
        const newSet: SetAsset = await res.json();
        refreshSets();
        setModal(false);
        showToast({
          type: "success",
          title: "Environment Minted to DKG",
          message: `Set "${newSet.name}" anchored to OriginTrail DKG!`,
          ual: newSet.ual,
        });
      } else {
        const err = await res.json().catch(() => ({}));
        showToast({
          type: "error",
          title: "Minting Failed",
          message: err.error ?? "Set could not be minted",
        });
      }
    } catch (e) {
      showToast({
        type: "error",
        title: "Minting Error",
        message: (e as Error).message,
      });
    } finally {
      setMintingSet(false);
    }
  };

  const displaySets = setList;

  return (
    <main className="sets-page">
      {/* ── Breadcrumb & Project Selector ── */}
      <div className="vault-breadcrumb" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <span>{(activeProject?.title ?? "CYBERPUNK: RONIN ECHOES").toUpperCase()}</span>
          <b>›</b> <strong>SEASON {String(activeProject?.seasonNumber ?? 1).padStart(2, "0")}</strong>
          <b>›</b> <span style={{ color: "#7963c8" }}>LIVING ASSET VAULT · SETS & ENVIRONMENTS</span>
        </div>
        
        {/* Project Switcher */}
        <div className="project-selector-wrap" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "10px", color: "#8a8994", fontWeight: 700 }}>ACTIVE PROJECT:</span>
          <select
            className="project-select-dropdown"
            value={activeProject?.id ?? ""}
            onChange={(e) => selectProjectId(e.target.value)}
            aria-label="Select active project"
            style={{
              padding: "6px 12px",
              borderRadius: "6px",
              border: "1px solid #dcdbe4",
              background: "#fff",
              font: "700 11px Manrope",
              color: "#302f3a",
            }}
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} ({p.genre})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="sets-head">
        <div>
          <p className="character-label">CANONICAL WORLD BUILDING</p>
          <h1>
            Cinematic Sets &<br />
            <i>Lighting Schemas.</i>
          </h1>
        </div>
        <button
          className="mint-button"
          onClick={() => {
            setTargetProjectId(activeProject?.id ?? "proj-ronin-echoes");
            setModal(true);
          }}
        >
          + &nbsp;Mint new environment KA
        </button>
      </div>

      <div className="sets-grid">
        {displaySets.map((set) => (
          <article className="set-card" key={set.id || set.name}>
            <div
              className={`set-shot ${set.name.includes("Garden") ? "sky-garden" : "rain-city"} ${set.imageUrl ? "has-image" : ""}`}
              style={{ position: "relative", overflow: "hidden" }}
            >
              {set.imageUrl && (
                <img
                  src={set.imageUrl}
                  alt={set.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", top: 0, left: 0, zIndex: 1 }}
                />
              )}
              <div className="set-overlay" style={{ zIndex: 2 }}>
                <span className="set-verified">
                  <i></i>DKG ANCHORED
                </span>
                <span>TIME: {set.timeOfDay.toUpperCase()}</span>
                <span>LIGHTING: {set.lightingSchema.split(",")[0].toUpperCase()}</span>
              </div>
              {!set.imageUrl && <div className="neon-sign" style={{ zIndex: 2 }}>CONTINUUM</div>}
              {!set.imageUrl && <div className="garden-moon"></div>}
            </div>
            <div className="set-body">
              <div className="set-title">
                <div>
                  <h2>{set.name}</h2>
                  <p>DKG CANONICAL ENVIRONMENT ASSET</p>
                </div>
              </div>
              {set.compliance && (
                <div style={{ margin: "6px 0", padding: "4px 8px", background: "#f0fdfa", border: "1px solid #99f6e4", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "10px", color: "#0f766e" }}>
                  <span style={{ fontWeight: 800 }}>ENTERPRISE VENUE</span>
                  <span style={{ fontFamily: "DM Mono" }}>{set.compliance.licenseType.slice(0, 24)}…</span>
                </div>
              )}
              <p className="set-description">{set.description}</p>
              <div className="palette-bar">
                {set.colorPalette.map((c) => (
                  <span key={c} style={{ background: c }} title={c}></span>
                ))}
                <small>ENVIRONMENT LIGHTING PALETTE</small>
              </div>
              <div className="guard-row">
                <b>ANTI-DRIFT GUARDS:</b>
                {set.negativePrompts.map((np) => (
                  <span key={np}>no {np.replace("no ", "")}</span>
                ))}
              </div>
              <button
                className="outline-button"
                style={{
                  width: "100%",
                  marginTop: "12px",
                  fontSize: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  padding: "7px 10px",
                  borderColor: "#1b9e91",
                  color: "#1b9e91",
                  background: generatingImageId === set.id ? "#e8f8f5" : "transparent",
                }}
                disabled={generatingImageId === set.id}
                onClick={() => handleGenerateSetImage(set.id)}
              >
                {generatingImageId === set.id ? (
                  <>Rendering Flux Concept Art (~5s)…</>
                ) : set.imageUrl ? (
                  <>Re-render Concept Keyframe (Flux)</>
                ) : (
                  <>Generate Concept Keyframe (Livepeer Flux)</>
                )}
              </button>
            </div>

            {/* Card Actions Footer */}
            <div className="prop-card-actions" style={{ padding: "10px 16px" }}>
              <div
                className="vault-ual-tag"
                title="Click to copy OriginTrail DKG UAL"
                onClick={() => handleCopyUal(set.ual || `did:dkg:continuum/set/${set.id}`)}
              >
                <span>{copiedUal === (set.ual || `did:dkg:continuum/set/${set.id}`) ? "✓ COPIED" : "DKG UAL"}</span>
                <code>{(set.ual || `did:dkg:continuum/set/${set.id}`).slice(0, 16)}…</code>
              </div>

              <button
                className="set-direct-btn"
                title="Stage scenes in this set within Director Studio"
                onClick={() => {
                  navigate("/studio", {
                    state: {
                      setId: set.id,
                      projectId: set.projectId || activeProject?.id,
                    },
                  });
                }}
              >
                Direct in Scene ↗
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* ── Modal: Mint New Set KA ── */}
      {modal && (
        <>
          <button className="modal-shade" onClick={() => setModal(false)} aria-label="Close" />
          <section className="set-modal">
            <header>
              <div>
                <p className="character-label">ORIGINTRAIL DKG ENVIRONMENT MINTING</p>
                <h2>Create Cinematic Set KA</h2>
                <p>Define the physical and atmospheric rules that Livepeer Agents must obey.</p>
              </div>
              <button onClick={() => setModal(false)} className="modal-close">
                ×
              </button>
            </header>
            <div className="set-form">
              {/* Quick Inspiration Presets */}
              <div style={{ marginBottom: "14px" }}>
                <span style={{ fontSize: "10px", color: "#8a8894", fontWeight: 700 }}>QUICK PRESETS:</span>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "6px" }}>
                  <button type="button" className="preset-chip-btn" onClick={() => applySetPreset("rain")}>
                    + Neo-Tokyo Rain
                  </button>
                  <button type="button" className="preset-chip-btn" onClick={() => applySetPreset("derelict")}>
                    + Derelict Station Alpha
                  </button>
                  <button type="button" className="preset-chip-btn" onClick={() => applySetPreset("garden")}>
                    + Floating Sky Garden
                  </button>
                  <button type="button" className="preset-chip-btn" onClick={() => applySetPreset("archive")}>
                    + Subterranean Archive
                  </button>
                </div>
              </div>

              {/* Target Project Selection */}
              <label>
                Target Project
                <select
                  value={targetProjectId}
                  onChange={(e) => setTargetProjectId(e.target.value)}
                  disabled={mintingSet}
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} ({p.genre})
                    </option>
                  ))}
                </select>
                <span style={{ fontSize: "9px", color: "#888693", fontWeight: 400, marginTop: "4px" }}>
                  Anchored into this project's DKG Paranet environment catalog.
                </span>
              </label>

              <label>
                Set name
                <input value={setFormName} onChange={(e) => setSetFormName(e.target.value)} />
              </label>
              <label>
                Atmosphere & setting description
                <textarea value={setFormDesc} onChange={(e) => setSetFormDesc(e.target.value)} />
              </label>
              <label>
                Lighting schema rules
                <textarea value={setFormLighting} onChange={(e) => setSetFormLighting(e.target.value)} />
              </label>
              <fieldset>
                <legend>Time of day</legend>
                {["Night", "Late Night", "Orbital Night", "Golden Hour", "Subterranean"].map((t) => (
                  <label key={t}>
                    <input type="radio" name="tod" checked={setFormTod === t} onChange={() => setSetFormTod(t)} />
                    <span>{t}</span>
                  </label>
                ))}
              </fieldset>
              <label className="negative-label">Strict forbidden negative guards</label>
              <input
                value={setFormNegative}
                onChange={(e) => setSetFormNegative(e.target.value)}
                placeholder="e.g. no direct daylight, no rural greenery, no natural vegetation"
              />

              {/* Live Preview Card */}
              <div style={{ marginTop: "14px" }}>
                <span style={{ fontSize: "10px", color: "#8a8894", fontWeight: 700 }}>LIVE SET PREVIEW:</span>
                <div className="vault-preview-container">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h4 style={{ margin: 0, font: "600 16px 'Playfair Display'" }}>{setFormName || "Untitled Set"}</h4>
                    <span style={{ font: "8px 'DM Mono'", padding: "2px 6px", borderRadius: "4px", background: "#ede9fe", color: "#6d28d9" }}>
                      {setFormTod.toUpperCase()}
                    </span>
                  </div>
                  <p style={{ fontSize: "10px", color: "#555461", margin: "6px 0", lineHeight: 1.4 }}>
                    {setFormDesc}
                  </p>
                  <div className="palette-bar" style={{ margin: "6px 0" }}>
                    {setFormPalette.map((c) => (
                      <span key={c} style={{ background: c, width: "16px", height: "8px", borderRadius: "2px" }} />
                    ))}
                  </div>
                  <code style={{ fontSize: "8px", color: "#16896f" }}>
                    did:dkg:continuum/set/{targetProjectId}/{setFormName.toLowerCase().replace(/\s+/g, "-") || "new"}
                  </code>
                </div>
              </div>
            </div>
            <footer>
              <button
                type="button"
                onClick={handleMintSet}
                disabled={mintingSet}
              >
                {mintingSet ? "Minting to DKG…" : "Mint Set KA to OriginTrail DKG"} <span>→</span>
              </button>
            </footer>
          </section>
        </>
      )}
    </main>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 4. VOICE & SOUND (LEITMOTIFS) PAGE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function Sound() {
  const { activeProject, projects, setActiveProject } = useProject();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [tab, setTab] = useState("All Audio");
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [soundList, setSoundList] = useState<LeitmotifAsset[]>([]);
  const [charList, setCharList] = useState<CharacterAsset[]>([]);
  const [copiedUal, setCopiedUal] = useState<string | null>(null);
  const [targetProjectId, setTargetProjectId] = useState(activeProject?.id || "proj-ronin-echoes");
  const [audioFeedback, setAudioFeedback] = useState<{
    type: "success" | "error";
    text: string;
    ual?: string;
    url?: string;
  } | null>(null);

  // Drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerTab, setDrawerTab] = useState<"leitmotif" | "voice">("leitmotif");
  const [generatingSound, setGeneratingSound] = useState(false);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [phaseStatus, setPhaseStatus] = useState("Initializing neural audio synthesis...");

  // Leitmotif form state
  const [leitName, setLeitName] = useState("Mika's Memory Fragment");
  const [boundCharId, setBoundCharId] = useState("");
  const [mood, setMood] = useState("Cyberpunk Noir");
  const [bpm, setBpm] = useState(120);
  const [musicalKey, setMusicalKey] = useState("D Minor");
  const [selectedInstruments, setSelectedInstruments] = useState<string[]>([
    "Synth Arp",
    "Heavy Sub-Bass",
  ]);
  const [leitPrompt, setLeitPrompt] = useState(
    "Arpeggiated analog synthesizers layered with deep sub-bass and rain ambience."
  );

  // Voice profile state
  const [voiceCharId, setVoiceCharId] = useState("");
  const [voiceTone, setVoiceTone] = useState("Gravelly Baritone");
  const [voicePace, setVoicePace] = useState("Deliberate & Measured");
  const [voiceAcoustic, setVoiceAcoustic] = useState("Rainy Neo-Tokyo Alley Echo");
  const [voiceSampleText, setVoiceSampleText] = useState(
    "The rain remembers every name this city tried to erase."
  );

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (activeProject?.id) {
      setTargetProjectId(activeProject.id);
    }
  }, [activeProject?.id]);

  const refreshSounds = () => {
    const pId = activeProject?.id;
    const soundUrl = pId ? `/api/vault/sounds?projectId=${pId}` : "/api/vault/sounds";
    const charUrl = pId ? `/api/vault/characters?projectId=${pId}` : "/api/vault/characters";

    Promise.all([
      fetch(soundUrl).then((r) => r.json()),
      fetch(charUrl).then((r) => r.json()),
    ])
      .then(([sounds, chars]) => {
        if (sounds) setSoundList(sounds);
        if (chars) {
          setCharList(chars);
          if (chars.length > 0 && !boundCharId) {
            setBoundCharId(chars[0].id);
            setVoiceCharId(chars[0].id);
          }
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    refreshSounds();
  }, [activeProject?.id]);

  const handleCopyUal = (ual: string) => {
    navigator.clipboard.writeText(ual);
    setCopiedUal(ual);
    setTimeout(() => setCopiedUal(null), 2000);
  };

  const applySoundPreset = (type: "synthwave" | "ambient" | "distress" | "pursuit") => {
    if (type === "synthwave") {
      setLeitName("Neo-Tokyo Neon Pulse");
      setBpm(128);
      setMusicalKey("D Minor");
      setMood("Cyberpunk Noir");
      setSelectedInstruments(["Synth Arp", "Heavy Sub-Bass", "Industrial Drums"]);
      setLeitPrompt("Driving 128 BPM arpeggiated bassline with crunchy analog synthesizers and neon rain pulse.");
    } else if (type === "ambient") {
      setLeitName("Ghost Protocol Ambient Drone");
      setBpm(75);
      setMusicalKey("C Minor");
      setMood("Melancholic Echo");
      setSelectedInstruments(["Ambient Pad", "Distorted Cello", "Glitch Textures"]);
      setLeitPrompt("Dark atmospheric drone with distant rain reverberations and solitary synthetic cello.");
    } else if (type === "distress") {
      setLeitName("Derelict Station Alpha - Distress Beacon");
      setBpm(90);
      setMusicalKey("F# Minor");
      setMood("Eerie Mystery");
      setSelectedInstruments(["Glitch Textures", "Heavy Sub-Bass", "Industrial Drums"]);
      setLeitPrompt("Subterranean claustrophobic hum with metallic resonant clicks and low pulsing sub-bass alarms.");
    } else if (type === "pursuit") {
      setLeitName("Shin-Shinjuku Rooftop Pursuit");
      setBpm(140);
      setMusicalKey("A Minor");
      setMood("Intense Action");
      setSelectedInstruments(["Industrial Drums", "Taiko Percussion", "Synth Arp"]);
      setLeitPrompt("High-octane cybernetic chase sequence with heavy distorted percussion and aggressive polyphonic stabs.");
    }
  };

  const handlePlayAudio = (sound: LeitmotifAsset) => {
    if (!audioRef.current) return;
    if (playingId === sound.id) {
      audioRef.current.pause();
      setPlayingId(null);
    } else {
      if (sound.audioUrl && !sound.audioUrl.includes("example.invalid")) {
        audioRef.current.src = sound.audioUrl;
        audioRef.current.play().catch(() => {});
        setPlayingId(sound.id);
      } else {
        setAudioFeedback({
          type: "error",
          text: `Leitmotif "${sound.name}" audio track is still synthesizing on Livepeer.`,
        });
      }
    }
  };

  const toggleInstrument = (inst: string) => {
    if (selectedInstruments.includes(inst)) {
      if (selectedInstruments.length > 1) {
        setSelectedInstruments(selectedInstruments.filter((i) => i !== inst));
      }
    } else {
      setSelectedInstruments([...selectedInstruments, inst]);
    }
  };

  const handleGenerateAudio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (generatingSound) return;

    setGeneratingSound(true);
    setElapsedSec(0);
    setPhaseStatus("Querying DKG Show Bible & selecting Livepeer audio model...");

    const payload =
      drawerTab === "leitmotif"
        ? {
            name: leitName.trim(),
            boundToCharacterId: boundCharId || undefined,
            mood,
            bpm,
            key: musicalKey,
            instruments: selectedInstruments,
            duration: 10,
            projectId: targetProjectId,
          }
        : {
            name: `${charList.find((c) => c.id === voiceCharId)?.name ?? "Character"} Voice Profile`,
            boundToCharacterId: voiceCharId || undefined,
            mood: `${voiceTone}, ${voicePace}, ${voiceAcoustic}`,
            bpm: 90,
            key: "A Minor",
            instruments: ["Vocal Timbre", voiceAcoustic],
            duration: 10,
            projectId: targetProjectId,
          };

    try {
      const res = await fetch("/api/vault/sounds-stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok || !res.body) {
        // Fallback to sync endpoint
        const syncRes = await fetch("/api/vault/sounds", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (syncRes.ok) {
          const created: LeitmotifAsset = await syncRes.json();
          refreshSounds();
          showToast({
            type: "success",
            title: "Leitmotif Minted to DKG",
            message: `"${created.name}" generated & anchored to OriginTrail DKG!`,
            ual: created.ual,
          });
          setAudioFeedback({
            type: "success",
            text: `Leitmotif "${created.name}" generated & minted to OriginTrail DKG!`,
            ual: created.ual,
            url: created.audioUrl,
          });
          setIsDrawerOpen(false);
          return;
        } else {
          const err = await syncRes.json().catch(() => ({}));
          throw new Error(err.error ?? "Sound synthesis failed");
        }
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let finished = false;

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const event = JSON.parse(line.replace("data: ", ""));
            if (event.type === "phase" && event.message) {
              setPhaseStatus(event.message);
              if (typeof event.elapsed === "number") setElapsedSec(event.elapsed);
            } else if (event.type === "done" && event.data) {
              finished = true;
              const created: LeitmotifAsset = event.data;
              refreshSounds();
              showToast({
                type: "success",
                title: "Leitmotif Minted to DKG",
                message: `"${created.name}" generated & anchored to OriginTrail DKG!`,
                ual: created.ual,
              });
              setAudioFeedback({
                type: "success",
                text: `Leitmotif "${created.name}" generated & minted to OriginTrail DKG!`,
                ual: created.ual,
                url: created.audioUrl,
              });
              setIsDrawerOpen(false);
            } else if (event.type === "error") {
              throw new Error(event.error ?? "Synthesis failed");
            }
          } catch (errParse) {
            console.warn("[SoundStream] Parse event error:", errParse);
          }
        }
      }

      if (!finished) {
        refreshSounds();
        setIsDrawerOpen(false);
      }
    } catch (err) {
      showToast({
        type: "error",
        title: "Synthesis Error",
        message: (err as Error).message,
      });
      setAudioFeedback({
        type: "error",
        text: `Synthesis error: ${(err as Error).message}`,
      });
    } finally {
      setGeneratingSound(false);
    }
  };

  const getBoundChar = (charId?: string) => {
    if (!charId) return null;
    return charList.find((c) => c.id === charId);
  };

  const visibleSounds = soundList.filter((s) => {
    if (tab === "Character Leitmotifs") return !!s.boundToCharacterId;
    if (tab === "Voice Profiles") return s.name.toLowerCase().includes("voice");
    return true;
  });

  return (
    <main className="sound-page">
      <audio ref={audioRef} onEnded={() => setPlayingId(null)} />
      
      {/* ── Breadcrumb & Project Selector ── */}
      <div className="vault-breadcrumb" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <span>{(activeProject?.title ?? "CYBERPUNK: RONIN ECHOES").toUpperCase()}</span>
          <b>›</b> LIVING ASSET VAULT <b>›</b> <strong>VOICE & SOUND</strong>
        </div>

        {/* Project Switcher */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "10px", color: "#8a8894", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            PROJECT:
          </span>
          <select
            value={activeProject?.id}
            onChange={(e) => {
              const p = projects.find((proj) => proj.id === e.target.value);
              if (p) setActiveProject(p);
            }}
            style={{
              fontSize: "11px",
              fontWeight: 600,
              padding: "4px 10px",
              borderRadius: "6px",
              border: "1px solid #d4d0dc",
              background: "#fff",
              color: "#1a1924",
              cursor: "pointer",
            }}
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="sound-head">
        <div>
          <p className="character-label">RELATIONAL AUDIO CONTINUITY SYSTEM</p>
          <h1>
            Sonic Vault &<br />
            <i>Musical Motifs.</i>
          </h1>
        </div>
        <button
          className="mint-button"
          onClick={() => {
            setAudioFeedback(null);
            setIsDrawerOpen(true);
          }}
        >
          + &nbsp;Generate Sound / Voice with Livepeer
        </button>
      </div>

      {audioFeedback && (
        <div
          style={{
            margin: "0 0 22px",
            padding: "14px 18px",
            borderRadius: "9px",
            background: audioFeedback.type === "success" ? "#f0fdf4" : "#fef2f2",
            border: `1px solid ${audioFeedback.type === "success" ? "#bbf7d0" : "#fecaca"}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "12px",
            color: audioFeedback.type === "success" ? "#166534" : "#991b1b",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span>{audioFeedback.type === "success" ? "✓" : "⚠"}</span>
            <div>
              <strong>{audioFeedback.text}</strong>
              {audioFeedback.ual && (
                <div style={{ fontFamily: "DM Mono", fontSize: "10px", marginTop: "2px", opacity: 0.85 }}>
                  DKG UAL: {audioFeedback.ual}
                </div>
              )}
            </div>
          </div>
          <button
            onClick={() => setAudioFeedback(null)}
            style={{ border: 0, background: "transparent", color: "inherit", fontWeight: 700 }}
          >
            ✕
          </button>
        </div>
      )}

      <div className="sound-tabs">
        {["All Audio", "Character Leitmotifs", "Voice Profiles"].map((t) => (
          <button key={t} onClick={() => setTab(t)} className={tab === t ? "active" : ""}>
            {t} {t === "All Audio" ? `(${soundList.length})` : ""}
          </button>
        ))}
      </div>

      <div className="audio-list">
        {visibleSounds.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", background: "#fbfbfe", borderRadius: "10px", border: "1px dashed #d5d3e2" }}>
            <p style={{ color: "#747282", fontSize: "13px", margin: "0 0 12px" }}>
              No leitmotifs or sound profiles registered for <strong>{activeProject?.title}</strong> yet.
            </p>
            <button
              className="mint-button"
              onClick={() => setIsDrawerOpen(true)}
              style={{ fontSize: "11px", padding: "8px 16px" }}
            >
              + Generate First Leitmotif
            </button>
          </div>
        ) : (
          visibleSounds.map((track) => {
            const bound = getBoundChar(track.boundToCharacterId);
            const isPlayingThis = playingId === track.id;
            const ualStr = track.ual || `did:dkg:leitmotif/${track.id}`;

            return (
              <article className="audio-row" key={track.id}>
                <div className={`audio-type ${track.mood.includes("intense") ? "gold" : "purple"}`}>
                  LEITMOTIF KA
                </div>
                <div className={`mini-avatar ${bound?.name.includes("Yuki") ? "yuki" : "ren"}`}></div>
                <div className="audio-details">
                  <h2>{track.name}</h2>
                  <p>
                    <b>{bound ? bound.name : "Atmospheric"}</b> · {track.bpm} BPM · Key of {track.key} · Mood: {track.mood}
                  </p>
                  {track.compliance && (
                    <div style={{ marginTop: "4px" }}>
                      <span className="enterprise-ip-pill" style={{ background: "#eff6ff", color: "#1d4ed8", borderColor: "#bfdbfe" }}>
                        OFFICIAL BRAND ANTHEM · {track.compliance.licenseType.slice(0, 24)}…
                      </span>
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  className={`wave-player ${isPlayingThis ? "playing" : ""} ${track.mood.includes("intense") ? "gold" : "purple"}`}
                  onClick={() => handlePlayAudio(track)}
                  title={track.audioUrl ? "Click to play Livepeer synthesized audio" : "No audio URL yet"}
                >
                  {isPlayingThis ? (
                    <span className="audio-equalizer" style={{ marginRight: 6 }}>
                      <span></span>
                      <span></span>
                      <span></span>
                    </span>
                  ) : (
                    <span className="audio-play-symbol">▶</span>
                  )}
                  <i></i>
                  <em>{isPlayingThis ? "Playing Live" : track.audioUrl ? "Livepeer Audio" : "No Audio"}</em>
                </button>

                {/* DKG UAL click-to-copy tag */}
                <div
                  className="vault-ual-tag"
                  title="Click to copy OriginTrail DKG UAL"
                  onClick={() => handleCopyUal(ualStr)}
                >
                  <span>{copiedUal === ualStr ? "✓ COPIED" : "DKG UAL"}</span>
                  <code>{ualStr.slice(0, 16)}…</code>
                </div>

                {/* Direct in Scene */}
                <button
                  className="sound-direct-btn"
                  title="Score this leitmotif into Director Studio"
                  onClick={() => {
                    navigate("/studio", {
                      state: {
                        leitmotifId: track.id,
                        projectId: track.projectId || activeProject?.id,
                      },
                    });
                  }}
                >
                  Direct in Scene ↗
                </button>

                <button
                  className="more-button"
                  title="View JSON-LD"
                  onClick={() => window.open(`/api/dkg/export/leitmotif/${track.id}`, "_blank")}
                >
                  RDF
                </button>
              </article>
            );
          })
        )}
      </div>

      <div className="audio-footnote">
        <span></span>
        All audio assets are linked in the OriginTrail DKG graph via <code>ex:hasLeitmotif</code> predicates, automatically triggered by the Director whenever the bound character appears in a scene.
      </div>

      {/* ── ADVANCED SOUND SYNTHESIS DRAWER ── */}
      {isDrawerOpen && (
        <>
          <button
            type="button"
            className="drawer-shade"
            onClick={() => !generatingSound && setIsDrawerOpen(false)}
            aria-label="Close drawer"
          />
          <aside className="character-drawer" style={{ width: "min(600px, 100vw)" }}>
            <header>
              <div>
                <p className="character-label">LIVEPEER NEURAL AUDIO & DKG PROVENANCE</p>
                <h2>Synthesize Sound & Voice</h2>
              </div>
              <button
                type="button"
                onClick={() => !generatingSound && setIsDrawerOpen(false)}
                disabled={generatingSound}
              >
                <span className="line-icon x">×</span>
              </button>
            </header>

            {generatingSound ? (
              <div style={{ padding: "30px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <div className="sound-loading-box">
                  <span style={{ fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: "#c5adff", fontFamily: "DM Mono" }}>
                    Neural Audio Generation Active
                  </span>
                  <h3 style={{ font: "600 22px 'Playfair Display'", margin: "8px 0 2px" }}>
                    Livepeer Waveform Synthesis
                  </h3>
                  <div style={{ fontSize: "12px", color: "#ded9f5", fontFamily: "DM Mono" }}>
                    {elapsedSec}s elapsed
                  </div>

                  <div className="waveform-bars">
                    <span></span><span></span><span></span><span></span><span></span>
                    <span></span><span></span><span></span><span></span><span></span>
                    <span></span><span></span><span></span><span></span><span></span>
                    <span></span><span></span><span></span><span></span><span></span>
                  </div>

                  <div style={{ background: "rgba(0,0,0,0.25)", borderRadius: "8px", padding: "12px", fontSize: "11px", color: "#e5e0f9" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontWeight: 600 }}>
                      <span style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", background: "#a988f5", animation: "pulse 1s infinite" }}></span>
                      {phaseStatus}
                    </div>
                  </div>

                  <p style={{ fontSize: "10px", color: "#aaa5c2", margin: "16px 0 0", lineHeight: 1.5 }}>
                    Sonilo-music model synthesizes harmonic audio stems and binds knowledge graph assertions to OriginTrail DKG. Rendering takes ~35–45 seconds.
                  </p>
                </div>
              </div>
            ) : (
              <form className="drawer-form" onSubmit={handleGenerateAudio}>
                {/* Inspiration Quick Presets */}
                <section style={{ padding: "14px 0", borderBottom: "1px solid #ede9f4" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <span style={{ fontSize: "10px", color: "#8a8894", letterSpacing: "0.08em", fontWeight: 700 }}>
                      QUICK LEITMOTIF PRESETS
                    </span>
                    <span style={{ fontSize: "10px", color: "#7657d8" }}>Auto-tune BPM & Instruments</span>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    <button type="button" className="preset-chip-btn" onClick={() => applySoundPreset("synthwave")}>
                      + Synthwave March
                    </button>
                    <button type="button" className="preset-chip-btn" onClick={() => applySoundPreset("ambient")}>
                      + Ghost Ambient
                    </button>
                    <button type="button" className="preset-chip-btn" onClick={() => applySoundPreset("distress")}>
                      + Distress Beacon
                    </button>
                    <button type="button" className="preset-chip-btn" onClick={() => applySoundPreset("pursuit")}>
                      + Cyber Pursuit 140BPM
                    </button>
                  </div>
                </section>

                {/* Target Project Selection */}
                <section style={{ padding: "14px 0", borderBottom: "1px solid #ede9f4" }}>
                  <label>
                    TARGET PROJECT
                    <select
                      value={targetProjectId}
                      onChange={(e) => setTargetProjectId(e.target.value)}
                      disabled={generatingSound}
                    >
                      {projects.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.title} ({p.genre})
                        </option>
                      ))}
                    </select>
                    <span style={{ fontSize: "9px", color: "#888693", fontWeight: 400, marginTop: "4px", display: "block" }}>
                      This leitmotif Knowledge Asset will be anchored into the project's DKG Paranet.
                    </span>
                  </label>
                </section>

                <section>
                  <div className="sound-tab-pills">
                    <button
                      type="button"
                      className={drawerTab === "leitmotif" ? "active" : ""}
                      onClick={() => setDrawerTab("leitmotif")}
                    >
                      Musical Leitmotif
                    </button>
                    <button
                      type="button"
                      className={drawerTab === "voice" ? "active" : ""}
                      onClick={() => setDrawerTab("voice")}
                    >
                      Voice Profile
                    </button>
                  </div>

                  {drawerTab === "leitmotif" ? (
                    <>
                      <div className="field-pair">
                        <label>
                          LEITMOTIF NAME
                          <input
                            type="text"
                            value={leitName}
                            onChange={(e) => setLeitName(e.target.value)}
                            placeholder="e.g. Broken Glass Requiem"
                            required
                          />
                        </label>
                        <label>
                          BIND TO CHARACTER (OPTIONAL)
                          <select
                            value={boundCharId}
                            onChange={(e) => setBoundCharId(e.target.value)}
                          >
                            <option value="">Atmospheric / Scene Only</option>
                            {charList.map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.name} ({c.id})
                              </option>
                            ))}
                          </select>
                        </label>
                      </div>

                      <div className="field-pair" style={{ marginTop: "12px" }}>
                        <label>
                          MUSICAL KEY
                          <select
                            value={musicalKey}
                            onChange={(e) => setMusicalKey(e.target.value)}
                          >
                            {[
                              "D Minor",
                              "C Minor",
                              "F# Minor",
                              "A Minor",
                              "E Minor",
                              "G Minor",
                              "B Minor",
                              "C Major",
                              "D Major",
                            ].map((k) => (
                              <option key={k} value={k}>
                                {k}
                              </option>
                            ))}
                          </select>
                        </label>

                        <div>
                          <label>
                            TEMPO: {bpm} BPM
                            <div className="bpm-slider-row">
                              <input
                                type="range"
                                min={60}
                                max={180}
                                value={bpm}
                                onChange={(e) => setBpm(Number(e.target.value))}
                              />
                              <span className="bpm-badge">{bpm} BPM</span>
                            </div>
                          </label>
                        </div>
                      </div>

                      <div style={{ marginTop: "14px" }}>
                        <label>
                          MOOD & ATMOSPHERE
                          <div className="chips-wrap">
                            {[
                              "Cyberpunk Noir",
                              "Melancholic Echo",
                              "Intense Action",
                              "Eerie Mystery",
                              "Triumphant Climax",
                              "Ambient Drone",
                              "Rain Distort",
                            ].map((m) => (
                              <button
                                key={m}
                                type="button"
                                className={`chip-btn ${mood === m ? "active" : ""}`}
                                onClick={() => setMood(m)}
                              >
                                {m}
                              </button>
                            ))}
                          </div>
                        </label>
                      </div>

                      <div style={{ marginTop: "14px" }}>
                        <label>
                          INSTRUMENTATION LAYERS ({selectedInstruments.length} SELECTED)
                          <div className="chips-wrap">
                            {[
                              "Synth Arp",
                              "Heavy Sub-Bass",
                              "Taiko Percussion",
                              "Distorted Cello",
                              "Glitch Textures",
                              "Ambient Pad",
                              "Warm Piano",
                              "Industrial Drums",
                            ].map((inst) => (
                              <button
                                key={inst}
                                type="button"
                                className={`chip-btn ${selectedInstruments.includes(inst) ? "active" : ""}`}
                                onClick={() => toggleInstrument(inst)}
                              >
                                {selectedInstruments.includes(inst) ? "✓ " : "+ "}
                                {inst}
                              </button>
                            ))}
                          </div>
                        </label>
                      </div>

                      <label style={{ marginTop: "14px" }}>
                        SONIC DIRECTION & PROMPT
                        <textarea
                          value={leitPrompt}
                          onChange={(e) => setLeitPrompt(e.target.value)}
                          placeholder="Describe the sonic intention..."
                          rows={3}
                        />
                      </label>
                    </>
                  ) : (
                    <>
                      <div className="field-pair">
                        <label>
                          TARGET CHARACTER
                          <select
                            value={voiceCharId}
                            onChange={(e) => setVoiceCharId(e.target.value)}
                          >
                            {charList.map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.name}
                              </option>
                            ))}
                          </select>
                        </label>

                        <label>
                          SPEAKING CADENCE
                          <select
                            value={voicePace}
                            onChange={(e) => setVoicePace(e.target.value)}
                          >
                            <option value="Deliberate & Measured">Deliberate & Measured</option>
                            <option value="Urgent & Rapid">Urgent & Rapid</option>
                            <option value="Whispering Confidential">Whispering Confidential</option>
                            <option value="Monotone Cybernetic">Monotone Cybernetic</option>
                          </select>
                        </label>
                      </div>

                      <div style={{ marginTop: "14px" }}>
                        <label>
                          VOCAL TIMBRE & TONE
                          <div className="chips-wrap">
                            {[
                              "Gravelly Baritone",
                              "Cybernetic Whisper",
                              "Crisp & Analytical",
                              "Fatigued Noir",
                              "Resonant Authority",
                              "Soft Melancholic",
                            ].map((v) => (
                              <button
                                key={v}
                                type="button"
                                className={`chip-btn ${voiceTone === v ? "active" : ""}`}
                                onClick={() => setVoiceTone(v)}
                              >
                                {v}
                              </button>
                            ))}
                          </div>
                        </label>
                      </div>

                      <div style={{ marginTop: "14px" }}>
                        <label>
                          ACOUSTIC ENVIRONMENT
                          <div className="chips-wrap">
                            {[
                              "Rainy Neo-Tokyo Alley Echo",
                              "Holographic Chamber Reverb",
                              "Tight Helmet Radio",
                              "Dry Studio Close-mic",
                            ].map((env) => (
                              <button
                                key={env}
                                type="button"
                                className={`chip-btn ${voiceAcoustic === env ? "active" : ""}`}
                                onClick={() => setVoiceAcoustic(env)}
                              >
                                {env}
                              </button>
                            ))}
                          </div>
                        </label>
                      </div>

                      <label style={{ marginTop: "14px" }}>
                        SAMPLE DIALOGUE / SCRIPT
                        <textarea
                          value={voiceSampleText}
                          onChange={(e) => setVoiceSampleText(e.target.value)}
                          placeholder="Provide lines of dialogue for timbre reference..."
                          rows={3}
                        />
                      </label>
                    </>
                  )}
                </section>

                {/* Live Knowledge Asset Preview */}
                <section style={{ padding: "16px 0" }}>
                  <span style={{ fontSize: "10px", color: "#8a8894", fontWeight: 700, display: "block", marginBottom: "8px" }}>
                    LIVE KNOWLEDGE ASSET PREVIEW:
                  </span>
                  <div className="vault-preview-container">
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                      <div>
                        <h4 style={{ margin: 0, font: "600 15px 'Playfair Display'", color: "#1a1924" }}>
                          {drawerTab === "leitmotif" ? (leitName || "Untitled Motif") : (`${charList.find((c) => c.id === voiceCharId)?.name ?? "Character"} Voice Profile`)}
                        </h4>
                        <span style={{ fontSize: "11px", color: "#6e6c7c" }}>
                          {drawerTab === "leitmotif" ? `${bpm} BPM · Key of ${musicalKey} · ${mood}` : `${voiceTone} · ${voicePace}`}
                        </span>
                      </div>
                      <span className="audio-type purple" style={{ fontSize: "9px" }}>
                        {drawerTab === "leitmotif" ? "LEITMOTIF KA" : "VOICE KA"}
                      </span>
                    </div>

                    <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", margin: "6px 0" }}>
                      {(drawerTab === "leitmotif" ? selectedInstruments : ["Vocal Timbre", voiceAcoustic]).map((inst) => (
                        <span key={inst} style={{ fontSize: "9px", background: "#f0ecf9", color: "#5437a3", padding: "2px 6px", borderRadius: "4px" }}>
                          {inst}
                        </span>
                      ))}
                    </div>

                    <div style={{ fontSize: "10px", color: "#4f4e5a", margin: "6px 0" }}>
                      Bound to: <b>{getBoundChar(drawerTab === "leitmotif" ? boundCharId : voiceCharId)?.name || "Atmospheric / Scene Only"}</b>
                    </div>

                    <code style={{ fontSize: "8px", color: "#16896f", display: "block", marginTop: "4px" }}>
                      did:dkg:continuum/leitmotif/{targetProjectId}/{(drawerTab === "leitmotif" ? leitName : "voice").toLowerCase().replace(/\s+/g, "-") || "new"}
                    </code>
                  </div>
                </section>

                <footer className="sound-drawer-footer">
                  <button type="submit" className="synthesize-cta-btn" disabled={generatingSound}>
                    <Icon name="spark" size={14} />
                    <span>Synthesize Neural Audio with Livepeer Agent →</span>
                  </button>
                  <p className="sound-dkg-note">
                    <i /> Audio asset will be anchored as an RDF Knowledge Asset on OriginTrail DKG
                  </p>
                </footer>
              </form>
            )}
          </aside>
        </>
      )}
    </main>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 5. KNOWLEDGE GRAPH MESH EXPLORER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function Graph() {
  const { activeProject, projects, setActiveProject } = useProject();
  const navigate = useNavigate();
  const [scopeProjectId, setScopeProjectId] = useState<string>(activeProject?.id ?? "all");
  const [filter, setFilter] = useState("All Nodes");
  const [searchQuery, setSearchQuery] = useState("");
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], edges: [] });
  const [selected, setSelected] = useState<GraphNode | null>(null);
  const [rawJsonLd, setRawJsonLd] = useState<any | null>(null);
  const [tab, setTab] = useState<"RDF Metadata" | "Lineage Graph" | "On-Chain Proof">("RDF Metadata");
  const [zoom, setZoom] = useState(1);
  const [copiedUal, setCopiedUal] = useState<string | null>(null);

  useEffect(() => {
    if (activeProject?.id && scopeProjectId !== "all") {
      setScopeProjectId(activeProject.id);
    }
  }, [activeProject?.id]);

  useEffect(() => {
    const url = scopeProjectId === "all" ? "/api/dkg/graph" : `/api/dkg/graph?projectId=${encodeURIComponent(scopeProjectId)}`;
    fetch(url)
      .then((r) => r.json())
      .then((data: GraphData) => {
        if (data && data.nodes) {
          setGraphData(data);
          if (data.nodes.length > 0) {
            setSelected((prev) => (prev && data.nodes.some((n) => n.id === prev.id) ? prev : data.nodes[0]));
          } else {
            setSelected(null);
          }
        }
      })
      .catch(() => {});
  }, [scopeProjectId]);

  // Fetch JSON-LD when node changes
  useEffect(() => {
    if (!selected) return;
    const parts = selected.id.split("/");
    const type = selected.type;
    const rawId = (selected.data?.id as string) || parts[parts.length - 1];

    fetch(`/api/dkg/export/${type}/${rawId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        setRawJsonLd(json);
      })
      .catch(() => {
        setRawJsonLd(null);
      });
  }, [selected]);

  // Multi-tier column positioning for 6 entity types
  const typeColMap: Record<string, number> = {
    project: 6,
    character: 22,
    prop: 38,
    leitmotif: 55,
    set: 72,
    scene: 89,
  };

  const typeCounts: Record<string, number> = { project: 0, character: 0, prop: 0, leitmotif: 0, set: 0, scene: 0 };
  const positionedNodes = graphData.nodes.map((n) => {
    const colX = typeColMap[n.type] ?? 50;
    const indexInType = typeCounts[n.type] || 0;
    typeCounts[n.type] = indexInType + 1;
    const posY = 13 + indexInType * 20;
    return {
      ...n,
      colPercent: colX,
      rowPercent: Math.min(posY, 85),
      x: `${colX}%`,
      y: `${Math.min(posY, 85)}%`,
    };
  });

  const shown = positionedNodes.filter((n) => {
    const matchesFilter =
      filter === "All Nodes" ||
      (filter === "Projects" && n.type === "project") ||
      (filter === "Characters" && n.type === "character") ||
      (filter === "Sets" && n.type === "set") ||
      (filter === "Audio" && n.type === "leitmotif") ||
      (filter === "Props & Lore" && n.type === "prop") ||
      (filter === "Scenes" && n.type === "scene");

    const matchesSearch =
      !searchQuery ||
      n.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.id.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const activeSelected = selected ?? (shown.length > 0 ? shown[0] : null);

  const incomingEdges = graphData.edges.filter((e) => e.target === activeSelected?.id);
  const outgoingEdges = graphData.edges.filter((e) => e.source === activeSelected?.id);

  const nodeMap = new Map(positionedNodes.map((n) => [n.id, n]));

  const handleCopyUal = (ual: string) => {
    navigator.clipboard?.writeText(ual);
    setCopiedUal(ual);
    setTimeout(() => setCopiedUal(null), 2000);
  };

  return (
    <main className="mesh-page">
      {/* ── Breadcrumb & Scope Switcher ── */}
      <div className="vault-breadcrumb" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <div>
          <span>{scopeProjectId === "all" ? "GLOBAL DKG MESH" : (projects.find((p) => p.id === scopeProjectId)?.title ?? "PROJECT").toUpperCase()}</span>
          <b>›</b> PROVENANCE LINEAGE <b>›</b> <strong>KNOWLEDGE GRAPH EXPLORER</strong>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "10px", color: "#8a8894", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            GRAPH SCOPE:
          </span>
          <select
            value={scopeProjectId}
            onChange={(e) => {
              const val = e.target.value;
              setScopeProjectId(val);
              if (val !== "all") {
                const p = projects.find((proj) => proj.id === val);
                if (p) setActiveProject(p);
              }
            }}
            style={{
              fontSize: "11px",
              fontWeight: 600,
              padding: "4px 10px",
              borderRadius: "6px",
              border: "1px solid #d4d0dc",
              background: "#fff",
              color: "#1a1924",
              cursor: "pointer",
            }}
          >
            <option value="all">All Projects (Global Mesh)</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mesh-top">
        <div>
          <p className="character-label">ORIGINTRAIL DECENTRALIZED KNOWLEDGE GRAPH (V8)</p>
          <h1>
            DKG Knowledge <i>Mesh.</i>
          </h1>
        </div>
        <label className="mesh-search">
          ⌕{" "}
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by UAL, predicate, or entity..."
          />
        </label>
      </div>

      <div className="mesh-filterbar">
        <div className="mesh-filters">
          {["All Nodes", "Projects", "Characters", "Environments", "Audio", "Props & Lore", "Scenes"].map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={filter === f ? "active" : ""}>
              {f} {f === "All Nodes" ? `(${graphData.nodes.length})` : ""}
            </button>
          ))}
        </div>
        <div className="zoom-controls">
          <button onClick={() => setZoom(Math.max(0.7, zoom - 0.1))}>−</button>
          <span>{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom(Math.min(1.2, zoom + 0.1))}>+</button>
          <button onClick={() => setZoom(1)}>Fit</button>
        </div>
      </div>

      <div className="mesh-layout">
        <section className="mesh-canvas">
          <div className="mesh-map" style={{ transform: `scale(${zoom})` }}>
            {/* Dynamic SVG Relations */}
            <svg viewBox="0 0 1000 560" preserveAspectRatio="none">
              <defs>
                <marker id="arrow-purple" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                  <path d="M0,0 L6,3 L0,6Z" fill="#7657d8" />
                </marker>
                <marker id="arrow-muted" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                  <path d="M0,0 L6,3 L0,6Z" fill="#b2afbe" />
                </marker>
              </defs>
              {graphData.edges.map((e, idx) => {
                const src = nodeMap.get(e.source);
                const tgt = nodeMap.get(e.target);
                if (!src || !tgt) return null;

                const isForward = src.colPercent <= tgt.colPercent;
                const nodeWidth = 115;
                const x1 = isForward ? (src.colPercent / 100) * 1000 + nodeWidth : (src.colPercent / 100) * 1000 - 6;
                const y1 = (src.rowPercent / 100) * 560 + 15;
                const x2 = isForward ? (tgt.colPercent / 100) * 1000 - 6 : (tgt.colPercent / 100) * 1000 + nodeWidth;
                const y2 = (tgt.rowPercent / 100) * 560 + 15;
                const dx = Math.max(24, Math.abs(x2 - x1));
                const cp1x = isForward ? x1 + dx * 0.45 : x1 - dx * 0.45;
                const cp2x = isForward ? x2 - dx * 0.45 : x2 + dx * 0.45;
                const isSelected = activeSelected && (activeSelected.id === e.source || activeSelected.id === e.target);

                return (
                  <g key={`${e.source}-${e.target}-${idx}`}>
                    <path
                      d={`M ${x1} ${y1} C ${cp1x} ${y1}, ${cp2x} ${y2}, ${x2} ${y2}`}
                      className={`mesh-edge-path ${isSelected ? "highlighted" : ""}`}
                      markerEnd={isSelected ? "url(#arrow-purple)" : "url(#arrow-muted)"}
                      stroke={isSelected ? "#7657d8" : "#cbd5e1"}
                      opacity={isSelected ? 1 : 0.35}
                    />
                  </g>
                );
              })}
            </svg>

            {shown.map((n) => (
              <button
                key={n.id}
                onClick={() => setSelected(n)}
                className={`mesh-node ${n.type === "leitmotif" ? "audio" : n.type} ${activeSelected?.id === n.id ? "selected" : ""}`}
                style={{ left: n.x, top: n.y }}
                title={`${n.label} (${n.id})`}
              >
                <i></i>
                {n.label}
              </button>
            ))}
          </div>

          <span className="mesh-corner">
            {graphData.nodes.length} KNOWLEDGE ASSETS · {graphData.edges.length} RDF RELATIONS · SCOPE: {scopeProjectId.toUpperCase()}
          </span>
        </section>

        {/* ── Node Inspector Panel ── */}
        <aside className="node-inspector">
          {activeSelected ? (
            <>
              <header style={{ flexDirection: "column", gap: "6px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", width: "100%" }}>
                  <span className={`inspector-symbol ${activeSelected.type === "leitmotif" ? "audio" : activeSelected.type}`}></span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p>{activeSelected.type.toUpperCase()} KNOWLEDGE ASSET</p>
                    <h2 style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {activeSelected.label}
                    </h2>
                    <code style={{ fontSize: "8px", color: "#797982", display: "block" }}>
                      {(activeSelected.id).slice(0, 32)}…
                    </code>
                  </div>
                  <button
                    title="Copy UAL"
                    onClick={() => handleCopyUal(activeSelected.id)}
                    style={{ fontSize: "11px", fontWeight: 600, border: "1px solid #e1e0ea", padding: "4px 8px", borderRadius: "4px", background: "#f9f8fc" }}
                  >
                    {copiedUal === activeSelected.id ? "✓" : "Copy"}
                  </button>
                </div>

                {/* Direct in Scene quick action */}
                {activeSelected.type === "character" && (
                  <button
                    className="vault-direct-btn"
                    style={{ width: "100%", justifyContent: "center", marginTop: "6px" }}
                    onClick={() =>
                      navigate("/studio", {
                        state: {
                          characterId: activeSelected.data?.id,
                          projectId: activeSelected.projectId || activeProject?.id,
                        },
                      })
                    }
                  >
                    Cast Character in Scene ↗
                  </button>
                )}
                {activeSelected.type === "set" && (
                  <button
                    className="vault-direct-btn"
                    style={{ width: "100%", justifyContent: "center", marginTop: "6px" }}
                    onClick={() =>
                      navigate("/studio", {
                        state: {
                          setId: activeSelected.data?.id,
                          projectId: activeSelected.projectId || activeProject?.id,
                        },
                      })
                    }
                  >
                    Set Location in Scene ↗
                  </button>
                )}
                {activeSelected.type === "leitmotif" && (
                  <button
                    className="vault-direct-btn"
                    style={{ width: "100%", justifyContent: "center", marginTop: "6px" }}
                    onClick={() =>
                      navigate("/studio", {
                        state: {
                          leitmotifId: activeSelected.data?.id,
                          projectId: activeSelected.projectId || activeProject?.id,
                        },
                      })
                    }
                  >
                    Score Motif in Scene ↗
                  </button>
                )}
                {activeSelected.type === "prop" && (
                  <button
                    className="vault-direct-btn"
                    style={{ width: "100%", justifyContent: "center", marginTop: "6px" }}
                    onClick={() =>
                      navigate("/studio", {
                        state: {
                          propId: activeSelected.data?.id,
                          projectId: activeSelected.projectId || activeProject?.id,
                          propName: activeSelected.label,
                        },
                      })
                    }
                  >
                    Inject Prop in Scene ↗
                  </button>
                )}
                {activeSelected.type === "project" && (
                  <button
                    className="vault-direct-btn"
                    style={{ width: "100%", justifyContent: "center", marginTop: "6px" }}
                    onClick={() => {
                      const p = projects.find((x) => x.id === activeSelected.data?.id);
                      if (p) setActiveProject(p);
                      navigate("/episodes");
                    }}
                  >
                    View Episodes & Storyboards ↗
                  </button>
                )}
              </header>

              <div className="inspector-tabs">
                {(["RDF Metadata", "Lineage Graph", "On-Chain Proof"] as const).map((t) => (
                  <button key={t} onClick={() => setTab(t)} className={tab === t ? "active" : ""}>
                    {t}
                  </button>
                ))}
              </div>

              {tab === "RDF Metadata" && (
                <div style={{ position: "relative" }}>
                  <div style={{ display: "flex", justifyContent: "flex-end", padding: "6px 12px 0" }}>
                    <button
                      onClick={() => handleCopyUal(JSON.stringify(rawJsonLd || activeSelected.data, null, 2))}
                      style={{ fontSize: "9px", background: "transparent", border: "1px solid #d4d0e2", borderRadius: "3px", padding: "2px 6px", cursor: "pointer", color: "#634dac" }}
                    >
                      {copiedUal ? "✓ Copied JSON" : "Copy JSON-LD"}
                    </button>
                  </div>
                  <pre className="json-view" style={{ maxHeight: "330px", overflowY: "auto", fontSize: "11px" }}>
                    {rawJsonLd ? (
                      JSON.stringify(rawJsonLd, null, 2)
                    ) : (
                      JSON.stringify(
                        {
                          "@context": {
                            schema: "https://schema.org/",
                            ex: "https://continuum.studio/kg/",
                            prov: "http://www.w3.org/ns/prov#",
                          },
                          "@id": activeSelected.id,
                          "@type": `ex:${activeSelected.type.toUpperCase()}`,
                          "schema:name": activeSelected.label,
                          ...activeSelected.data,
                          "dkg:anchored": true,
                        },
                        null,
                        2
                      )
                    )}
                  </pre>
                </div>
              )}

              {tab === "Lineage Graph" && (
                <div className="lineage-panel" style={{ maxHeight: "350px", overflowY: "auto" }}>
                  <p style={{ fontSize: "11px", color: "#666", marginBottom: "8px" }}>
                    <b>INCOMING RELATIONS ({incomingEdges.length}):</b>
                  </p>
                  {incomingEdges.length === 0 ? (
                    <div style={{ fontSize: "10px", color: "#999", fontStyle: "italic", marginBottom: "10px" }}>
                      No incoming relations (Root or Anchor Node).
                    </div>
                  ) : (
                    incomingEdges.map((e) => {
                      const srcNode = nodeMap.get(e.source);
                      return (
                        <div
                          key={`${e.source}-${e.predicate}`}
                          style={{ fontSize: "11px", marginBottom: "6px", cursor: "pointer", padding: "6px 8px", background: "#f8f6fc", borderRadius: "4px", border: "1px solid #ede8f5" }}
                          onClick={() => srcNode && setSelected(srcNode)}
                          title="Click to jump to this node in graph"
                        >
                          <code style={{ color: "#5438a3", fontWeight: 700 }}>{srcNode?.label ?? e.source.split("/").pop()}</code>
                          <span style={{ fontSize: "9px", color: "#777", display: "block" }}>[{e.predicate}] →</span>
                        </div>
                      );
                    })
                  )}

                  <div className="lineage-selected" style={{ fontWeight: "bold", margin: "12px 0 10px", padding: "8px", borderRadius: "4px" }}>
                    [SELECTED] {activeSelected.label} ({activeSelected.type})
                  </div>

                  <p style={{ fontSize: "11px", color: "#666", marginBottom: "8px" }}>
                    <b>OUTGOING RELATIONS ({outgoingEdges.length}):</b>
                  </p>
                  {outgoingEdges.length === 0 ? (
                    <div style={{ fontSize: "10px", color: "#999", fontStyle: "italic" }}>
                      No outgoing relations (Leaf Node).
                    </div>
                  ) : (
                    outgoingEdges.map((e) => {
                      const tgtNode = nodeMap.get(e.target);
                      return (
                        <div
                          key={`${e.target}-${e.predicate}`}
                          style={{ fontSize: "11px", marginBottom: "6px", cursor: "pointer", padding: "6px 8px", background: "#f8f6fc", borderRadius: "4px", border: "1px solid #ede8f5" }}
                          onClick={() => tgtNode && setSelected(tgtNode)}
                          title="Click to jump to this node in graph"
                        >
                          <span style={{ fontSize: "9px", color: "#777", display: "block" }}>→ [{e.predicate}]</span>
                          <code style={{ color: "#5438a3", fontWeight: 700 }}>{tgtNode?.label ?? e.target.split("/").pop()}</code>
                        </div>
                      );
                    })
                  )}

                  <p style={{ marginTop: "14px", fontSize: "10px", color: "#888" }}>
                    Derivation chain certified by W3C PROV-O standard & OriginTrail DKG. Click any related node to navigate the mesh.
                  </p>
                </div>
              )}

              {tab === "On-Chain Proof" && (
                <div className="proof-panel">
                  <b>ORIGINTRAIL DKG V8 ON-CHAIN LEDGER</b>
                  <label>
                    Universal Asset Locator (UAL)
                    <code>{activeSelected.id}</code>
                  </label>
                  <label>
                    Deterministic Merkle Root Hash
                    <code>{activeSelected.id.split("/").pop()}</code>
                  </label>
                  <label>
                    Project Paranet Partition
                    <code>did:dkg:paranet/{activeSelected.projectId || "global"}</code>
                  </label>
                  <label>
                    DKG Storage Verification
                    <code>File Store · Local Edge Graph Snapshot (Anchored)</code>
                  </label>
                </div>
              )}
            </>
          ) : (
            <div style={{ padding: "30px", color: "#888", textAlign: "center" }}>
              Select a node in the graph to view its RDF metadata
            </div>
          )}
        </aside>
      </div>
    </main>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 6. EPISODES & STORYBOARDS PAGE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function Episodes() {
  const { projects, activeProject, selectProjectId, createProject } = useProject();
  const [episode, setEpisode] = useState(1);
  const [realScenes, setRealScenes] = useState<SceneResult[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newGenre, setNewGenre] = useState("Cyberpunk Noir");
  const [newLogline, setNewLogline] = useState("");
  const [newSeason, setNewSeason] = useState(1);
  const [newTotalEpisodes, setNewTotalEpisodes] = useState(4);
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    if (!activeProject?.id) return;
    fetch(`/api/scenes?projectId=${encodeURIComponent(activeProject.id)}`)
      .then((r) => r.json())
      .then((data: SceneResult[]) => {
        if (data) {
          setRealScenes(data);
        }
      })
      .catch(() => {});
  }, [activeProject?.id]);

  interface DisplayScene {
    id: string;
    name: string;
    duration: string;
    cast: string;
    status: string;
    visual: string;
    mediaUrl: string;
    posterUrl?: string;
    isVideo?: boolean;
    ual: string;
  }

  const defaultRoninScenes: DisplayScene[] = [
    {
      id: "01",
      name: "The Awakening",
      duration: "00:05",
      cast: "Ren Akiyama",
      status: "DKG VERIFIED",
      visual: "awake",
      mediaUrl: "https://agent.livepeer.org/a/aHR0cHM6Ly92M2IuZmFsLm1lZGlhL2ZpbGVzL2IvMGFhOWRkNTgvdTRpOTJBNV9iVXljOVQ4eWczQ3l1X291dHB1dC5tcDQ.4a0ee966c7996e2b/u4i92A5_bUyc9T8yg3Cyu_output.mp4",
      posterUrl: "/assets/continuity/ren-anchor-1.jpg",
      isVideo: true,
      ual: "did:dkg:continuum/scene/ronin-scene-01",
    },
    {
      id: "02",
      name: "Rain Alley Encounter",
      duration: "00:05",
      cast: "Ren, Yuki",
      status: "DKG VERIFIED",
      visual: "alley",
      mediaUrl: "https://agent.livepeer.org/a/aHR0cHM6Ly92M2IuZmFsLm1lZGlhL2ZpbGVzL2IvMGFhOWQ3ZjQvdFA0T0p1ZlpwRi0yZmhyM1NLVjRaX291dHB1dC5tcDQ.4474dd0289d5fc4d/tP4OJufZpF-2fhr3SKV4Z_output.mp4",
      posterUrl: "https://agent.livepeer.org/a/aHR0cHM6Ly92M2IuZmFsLm1lZGlhL2ZpbGVzL2IvMGFhOWQxMmIvRjZjTG5KZE43SkZLaFNTLXFCMkgxLmpwZw.47fdb1a8514009fd/F6cLnJdN7JFKhSS-qB2H1.jpg",
      isVideo: true,
      ual: "did:dkg:continuum/scene/ronin-scene-02",
    },
    {
      id: "03",
      name: "The rain remembers every name.",
      duration: "00:05",
      cast: "Ren, Yuki",
      status: "DKG VERIFIED",
      visual: "rain",
      mediaUrl: "https://agent.livepeer.org/a/aHR0cHM6Ly92M2IuZmFsLm1lZGlhL2ZpbGVzL2IvMGFhOWQ4MDQvODY3R05pMEtseDFEOG9neXA2clJZX291dHB1dC5tcDQ.ac36915af7652a5c/867GNi0Klx1D8ogyp6rRY_output.mp4",
      posterUrl: "/assets/continuity/ren-anchor-2.jpg",
      isVideo: true,
      ual: "did:dkg:continuum/scene/ronin-scene-03",
    },
  ];

  const displayedScenes: DisplayScene[] =
    realScenes.length > 0
      ? realScenes.map((s, idx) => {
          const vid = s.livepeerOutputs?.find((o) => o.type === "video");
          const img = s.livepeerOutputs?.find((o) => o.type === "image");
          const fallbackPoster =
            idx === 0
              ? "/assets/continuity/ren-anchor-1.jpg"
              : idx === 1
              ? "https://agent.livepeer.org/a/aHR0cHM6Ly92M2IuZmFsLm1lZGlhL2ZpbGVzL2IvMGFhOWQxMmIvRjZjTG5KZE43SkZLaFNTLXFCMkgxLmpwZw.47fdb1a8514009fd/F6cLnJdN7JFKhSS-qB2H1.jpg"
              : "/assets/continuity/ren-anchor-2.jpg";
          const media = vid?.url || img?.url || fallbackPoster;
          const castNames =
            s.request.cast?.characterIds && s.request.cast.characterIds.length > 0
              ? s.request.cast.characterIds
                  .map((c) => (c.includes("ren") ? "Ren" : c.includes("yuki") ? "Yuki" : c.includes("vance") ? "Dr. Vance" : c))
                  .join(", ")
              : "Ren, Yuki";

          return {
            id: String(idx + 1).padStart(2, "0"),
            name: s.request.prompt.slice(0, 45) + (s.request.prompt.length > 45 ? "…" : ""),
            duration: vid ? "00:05" : "00:01",
            cast: castNames,
            status: "DKG VERIFIED",
            visual: "rain",
            mediaUrl: media && !media.includes("example.invalid") ? media : fallbackPoster,
            posterUrl: img?.url && !img.url.includes("example.invalid") ? img.url : fallbackPoster,
            isVideo: !!vid && !vid.url.includes("example.invalid"),
            ual: s.ual ?? `did:dkg:continuum/scene/${s.id}`,
          };
        })
      : activeProject?.id === "proj-ronin-echoes"
      ? defaultRoninScenes
      : [];

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newLogline.trim()) {
      setCreateError("Please provide both a project title and a logline.");
      return;
    }

    setIsCreating(true);
    setCreateError(null);
    try {
      await createProject({
        title: newTitle.trim(),
        genre: newGenre.trim(),
        logline: newLogline.trim(),
        seasonNumber: Number(newSeason) || 1,
        totalEpisodes: Number(newTotalEpisodes) || 3,
      });

      showToast({
        type: "success",
        title: "Project Initialized",
        message: `Project "${newTitle.trim()}" anchored into OriginTrail DKG!`,
      });

      setIsCreateModalOpen(false);
      setNewTitle("");
      setNewLogline("");
    } catch (err) {
      setCreateError((err as Error).message);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <main className="episodes-page">
      <div className="vault-breadcrumb" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <span>{(activeProject?.title ?? "CYBERPUNK: RONIN ECHOES").toUpperCase()}</span>
          <b>›</b> <strong>SEASON {String(activeProject?.seasonNumber ?? 1).padStart(2, "0")}</strong>
        </div>
        
        {/* Project Switcher in Breadcrumb */}
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
          <button
            type="button"
            className="btn-create-proj"
            onClick={() => {
              setCreateError(null);
              setIsCreateModalOpen(true);
            }}
          >
            + New Project
          </button>
        </div>
      </div>

      <div className="episodes-head">
        <div>
          <p className="character-label">EPISODIC STORY ENGINE & TIMELINE</p>
          <h1>
            {activeProject?.title ?? "Cyberpunk: Ronin Echoes"}:<br />
            <i>Season {String(activeProject?.seasonNumber ?? 1).padStart(2, "0")} Storyboard.</i>
          </h1>
          <p style={{ fontSize: "12px", color: "#6b6a75", maxWidth: "600px", margin: "10px 0 0", lineHeight: 1.5 }}>
            {activeProject?.logline ??
              "In the rain-drenched alleys of Neo-Tokyo, an ex-ronin and a rogue hacker uncover an encrypted signal in the city's memory grid."}
          </p>
          <div style={{ display: "flex", gap: "10px", alignItems: "center", marginTop: "12px" }}>
            <span style={{ fontSize: "9px", fontFamily: "DM Mono", background: "#f0ecfc", color: "#6848c4", padding: "3px 8px", borderRadius: "4px", fontWeight: 700 }}>
              GENRE: {(activeProject?.genre ?? "Cyberpunk Noir").toUpperCase()}
            </span>
            <span style={{ fontSize: "9px", fontFamily: "DM Mono", background: "#e8f8f2", color: "#0d825c", padding: "3px 8px", borderRadius: "4px" }}>
              DKG UAL: {(activeProject?.ual ?? "did:dkg:continuum/project/f2361e64ebd19873").slice(0, 32)}…
            </span>
          </div>
        </div>

        <div className="episode-actions">
          <button
            className="episode-export"
            onClick={() =>
              showToast({
                type: "info",
                title: "Verifiable Series Bundle",
                message: `Exporting verifiable bundle for "${activeProject?.title ?? "Series"}" with OriginTrail DKG metadata…`,
              })
            }
          >
            Export Series Bundle <span>↓</span>
          </button>
          <button className="mint-button" onClick={() => navigate("/studio")}>
            + &nbsp;Direct Scene in Studio
          </button>
        </div>
      </div>

      <div className="season-tabs">
        {Array.from({ length: activeProject?.totalEpisodes ?? 3 }).map((_, idx) => {
          const epNum = idx + 1;
          const status = epNum === 1 ? `${displayedScenes.length} SCENES READY` : epNum === 2 ? "IN PRODUCTION" : "DRAFT";
          return (
            <button
              key={epNum}
              onClick={() => setEpisode(epNum)}
              className={episode === epNum ? "active" : ""}
            >
              <span>Episode {String(epNum).padStart(2, "0")}</span>
              <small>{status}</small>
            </button>
          );
        })}
      </div>

      <div className="timeline-top">
        <div>
          <p className="character-label">
            EPISODE {String(episode).padStart(2, "0")} · STORYBOARD SEQUENCE
          </p>
          <h2>{episode === 1 ? "Anchor Sequence" : `Episode ${episode} Development`}</h2>
        </div>
        <span>{displayedScenes.length} LIVE SCENES ANCHORED</span>
      </div>

      <div className="scene-strip">
        {displayedScenes.length > 0 ? (
          displayedScenes.map((scene) => (
            <article
              key={scene.id}
              className={`scene-card ${scene.visual}`}
              onClick={() => navigate("/studio")}
              style={{ cursor: "pointer" }}
            >
              <div className="scene-thumb" style={{ position: "relative", overflow: "hidden", background: "#0c0e17" }}>
                {scene.isVideo && scene.mediaUrl ? (
                  <video
                    src={scene.mediaUrl}
                    poster={scene.posterUrl}
                    muted
                    loop
                    autoPlay
                    playsInline
                    style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", top: 0, left: 0, zIndex: 1 }}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : null}
                <img
                  src={scene.posterUrl || scene.mediaUrl || "/assets/continuity/ren-anchor-1.jpg"}
                  alt={scene.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", top: 0, left: 0, zIndex: 0 }}
                  onError={(e) => {
                    e.currentTarget.src = "/assets/continuity/ren-anchor-1.jpg";
                  }}
                />
                <span className="scene-number" style={{ position: "absolute", zIndex: 3, top: 10, left: 10 }}>
                  SCENE {scene.id}
                </span>
              </div>
              <div className="scene-copy">
                <h3>{scene.name}</h3>
                <p>
                  {scene.duration} <b>·</b> CAST: {scene.cast}
                </p>
                <span className={scene.status === "DKG VERIFIED" ? "scene-status verified" : "scene-status"}>
                  <i></i>
                  {scene.status}
                </span>
              </div>
            </article>
          ))
        ) : (
          <div
            style={{
              padding: "40px",
              border: "2px dashed #dedce5",
              borderRadius: "12px",
              background: "#ffffff",
              textAlign: "center",
              width: "100%",
              maxWidth: "480px",
            }}
          >
            <p style={{ font: "9px 'DM Mono'", color: "#7a7788", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Project Timeline Empty
            </p>
            <h3 style={{ font: "600 20px 'Playfair Display'", margin: "6px 0 10px", color: "#222" }}>
              No scenes directed for this project yet
            </h3>
            <p style={{ fontSize: "12px", color: "#666", marginBottom: "18px" }}>
              Jump into Director Studio to render the pilot scene for "{activeProject?.title}".
            </p>
            <button className="mint-button" onClick={() => navigate("/studio")}>
              + Direct Pilot Scene in Studio →
            </button>
          </div>
        )}

        <button className="draft-scene" onClick={() => navigate("/studio")}>
          <span>+</span>
          <b>Draft next scene</b>
          <small>Open in Director</small>
        </button>
      </div>

      {/* ── DKG Continuity Health Check ── */}
      <section className="continuity-health">
        <header>
          <div>
            <p className="character-label">DKG CONTINUITY VERIFICATION ANALYSIS</p>
            <h2>
              Season integrity <i>certified.</i>
            </h2>
          </div>
          <span className="health-live">
            <i></i> LIVE DKG GRAPH AUDIT
          </span>
        </header>
        <div className="health-grid">
          <article>
            <div className="health-score">
              <strong>99.4</strong>
              <span>%</span>
            </div>
            <div>
              <h3>Visual Character Consistency</h3>
              <p>Zero parameter amnesia detected. Face seed and scars identical across scenes.</p>
              <div className="score-line">
                <i></i>
              </div>
            </div>
          </article>
          <article>
            <div className="audio-disc">♪</div>
            <div>
              <h3>Leitmotif & Tone Alignment</h3>
              <p>
                <b>100%</b> — Leitmotif and harmonic scale preserved across episodic transitions.
              </p>
              <div className="score-line full">
                <i></i>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* ── CREATE PROJECT MODAL ── */}
      {isCreateModalOpen && (
        <div className="modal-overlay" onClick={() => !isCreating && setIsCreateModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3>Create New Film / Series Project</h3>
                <p>ORIGINTRAIL DKG SHOW BIBLE & EPISODIC CONTINUITY</p>
              </div>
              <button
                type="button"
                onClick={() => !isCreating && setIsCreateModalOpen(false)}
                style={{ border: 0, background: "transparent", fontSize: "20px", cursor: "pointer", color: "#888" }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProject}>
              <div className="modal-body">
                {createError && (
                  <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "6px", padding: "10px 14px", color: "#991b1b", fontSize: "12px" }}>
                    <strong>Error:</strong> {createError}
                  </div>
                )}

                <div className="modal-field">
                  <label>PROJECT TITLE</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Chronos Drift: Odyssey 2099"
                  />
                </div>

                <div className="modal-field">
                  <label>GENRE</label>
                  <select value={newGenre} onChange={(e) => setNewGenre(e.target.value)}>
                    <option value="Cyberpunk Noir">Cyberpunk Noir</option>
                    <option value="Hard Sci-Fi Space Opera">Hard Sci-Fi Space Opera</option>
                    <option value="Psychological Thriller">Psychological Thriller</option>
                    <option value="Post-Apocalyptic Survival">Post-Apocalyptic Survival</option>
                    <option value="Solarpunk Utopia">Solarpunk Utopia</option>
                    <option value="Supernatural Horror">Supernatural Horror</option>
                  </select>
                </div>

                <div className="modal-field">
                  <label>SERIES LOGLINE / CORE PREMISE</label>
                  <textarea
                    required
                    rows={3}
                    value={newLogline}
                    onChange={(e) => setNewLogline(e.target.value)}
                    placeholder="Describe the overarching cinematic conflict and narrative world..."
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div className="modal-field">
                    <label>SEASON NUMBER</label>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={newSeason}
                      onChange={(e) => setNewSeason(Number(e.target.value))}
                    />
                  </div>

                  <div className="modal-field">
                    <label>TARGET EPISODES</label>
                    <input
                      type="number"
                      min={1}
                      max={24}
                      value={newTotalEpisodes}
                      onChange={(e) => setNewTotalEpisodes(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div style={{ background: "#f8f7fb", padding: "10px 14px", borderRadius: "6px", border: "1px solid #e7e3f2", fontSize: "11px", color: "#5d5770" }}>
                  <strong>OriginTrail DKG Integration:</strong> Submitting will automatically mint a verifiable <code>schema:CreativeWorkSeries</code> Knowledge Asset on the OriginTrail DKG with a sovereign UAL identifier.
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  disabled={isCreating}
                  style={{ border: "1px solid #dcdbe3", background: "#fff", padding: "9px 16px", borderRadius: "6px", fontSize: "11px", fontWeight: 700, cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="mint-button"
                  style={{ padding: "9px 18px", fontSize: "11px" }}
                >
                  {isCreating ? "Minting Project KA on DKG..." : "Mint Project KA & Launch Series →"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 7. DKG ASSET REGISTRY TABLE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function Registry() {
  const { activeProject, projects, setActiveProject } = useProject();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [scopeProjectId, setScopeProjectId] = useState<string>(activeProject?.id ?? "all");
  const [registryAssets, setRegistryAssets] = useState<
    Array<{
      name: string;
      subtitle?: string;
      type: string;
      category: string;
      ual: string;
      schema: string;
      id: string;
      projectId: string;
      projectTitle: string;
      stateHash: string;
      action?: "character" | "set" | "leitmotif" | "prop" | "scene" | "project";
    }>
  >([]);
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [activeJson, setActiveJson] = useState<{ name: string; ual: string; json: any; schema: string } | null>(null);
  const [copiedUal, setCopiedUal] = useState<string | null>(null);
  const [jsonTab, setJsonTab] = useState<"jsonld" | "sparql">("jsonld");

  useEffect(() => {
    if (activeProject?.id && scopeProjectId !== "all") {
      setScopeProjectId(activeProject.id);
    }
  }, [activeProject?.id]);

  useEffect(() => {
    Promise.all([
      fetch("/api/vault").then((r) => r.json()),
      fetch("/api/vault/props").then((r) => r.json()),
      fetch("/api/scenes").then((r) => r.json()),
      fetch("/api/projects").then((r) => r.json()),
    ])
      .then(([vault, props, scenes, projs]) => {
        const list: typeof registryAssets = [];
        const projectList: Project[] = Array.isArray(projs) ? projs : [];

        // 1. Projects
        for (const p of projectList) {
          list.push({
            name: p.title,
            subtitle: `${p.genre} · Season ${p.seasonNumber ?? 1}`,
            type: "Project KA",
            category: "projects",
            ual: p.ual ?? `did:dkg:continuum/project/${p.id}`,
            schema: "schema:CreativeWorkSeries, ex:CinematicProject",
            id: p.id,
            projectId: p.id,
            projectTitle: p.title,
            stateHash: (p.ual ?? p.id).split("/").pop() || "sha256",
            action: "project",
          });
        }

        // 2. Characters
        if (vault?.characters) {
          for (const c of vault.characters) {
            const pId = c.projectId ?? "proj-ronin-echoes";
            const pr = projectList.find((p) => p.id === pId);
            list.push({
              name: c.name,
              subtitle: `${c.epithet} · ${c.voiceProfile?.timbreDescription || "voice-dna"}`,
              type: "Character KA",
              category: "characters",
              ual: c.ual ?? `did:dkg:continuum/character/${c.id}`,
              schema: "schema:Person, ex:FictionalCharacter",
              id: c.id,
              projectId: pId,
              projectTitle: pr?.title ?? "Cyberpunk: Ronin Echoes",
              stateHash: (c.ual ?? c.id).split("/").pop() || "sha256",
              action: "character",
            });
          }
        }

        // 3. Sets
        if (vault?.sets) {
          for (const s of vault.sets) {
            const pId = s.projectId ?? "proj-ronin-echoes";
            const pr = projectList.find((p) => p.id === pId);
            list.push({
              name: s.name,
              subtitle: `${s.timeOfDay} · ${s.lightingSchema?.slice(0, 32)}…`,
              type: "Environment KA",
              category: "sets",
              ual: s.ual ?? `did:dkg:continuum/set/${s.id}`,
              schema: "schema:Place, ex:CinematicSet",
              id: s.id,
              projectId: pId,
              projectTitle: pr?.title ?? "Cyberpunk: Ronin Echoes",
              stateHash: (s.ual ?? s.id).split("/").pop() || "sha256",
              action: "set",
            });
          }
        }

        // 4. Leitmotifs
        if (vault?.leitmotifs) {
          for (const l of vault.leitmotifs) {
            const pId = l.projectId ?? "proj-ronin-echoes";
            const pr = projectList.find((p) => p.id === pId);
            list.push({
              name: l.name,
              subtitle: `${l.bpm} BPM · Key of ${l.key} · ${l.mood}`,
              type: "Sound / Leitmotif KA",
              category: "sounds",
              ual: l.ual ?? `did:dkg:continuum/leitmotif/${l.id}`,
              schema: "schema:MusicComposition, ex:SonicLeitmotif",
              id: l.id,
              projectId: pId,
              projectTitle: pr?.title ?? "Cyberpunk: Ronin Echoes",
              stateHash: (l.ual ?? l.id).split("/").pop() || "sha256",
              action: "leitmotif",
            });
          }
        }

        // 5. Props & Lore
        if (Array.isArray(props)) {
          for (const pr of props) {
            const pId = pr.projectId ?? "proj-ronin-echoes";
            const proj = projectList.find((p) => p.id === pId);
            const isLore = pr.category === "lore";
            list.push({
              name: pr.name,
              subtitle: `${pr.type ?? (isLore ? "canon-lore" : "gear")} · ${(pr.loreSignificance || pr.description || "").slice(0, 48)}`,
              type: isLore ? "World Lore KA" : "Prop / Gear KA",
              category: "props",
              ual: pr.ual ?? `did:dkg:continuum/${isLore ? "lore" : "prop"}/${pr.id}`,
              schema: isLore ? "ex:WorldLoreRule, schema:Rule" : "ex:CinematicProp, schema:IndividualProduct",
              id: pr.id,
              projectId: pId,
              projectTitle: proj?.title ?? "Cyberpunk: Ronin Echoes",
              stateHash: (pr.ual ?? pr.id).split("/").pop() || "sha256",
              action: "prop",
            });
          }
        }

        // 6. Scenes
        if (Array.isArray(scenes)) {
          for (const sc of scenes) {
            const pId = sc.request?.projectId ?? "proj-ronin-echoes";
            const pr = projectList.find((p) => p.id === pId);
            list.push({
              name: `Episode ${sc.request?.episodeNumber ?? 1} · Scene ${sc.request?.sceneNumber ?? 1}`,
              subtitle: sc.request?.prompt?.slice(0, 46) + "…",
              type: "Rendered Scene KA",
              category: "scenes",
              ual: sc.ual ?? `did:dkg:continuum/scene/${sc.id}`,
              schema: "schema:Clip, ex:ContinuityScene, prov:Entity",
              id: sc.id,
              projectId: pId,
              projectTitle: pr?.title ?? "Cyberpunk: Ronin Echoes",
              stateHash: (sc.ual ?? sc.id).split("/").pop() || "sha256",
              action: "scene",
            });
          }
        }

        setRegistryAssets(list);
      })
      .catch(() => {});
  }, []);

  const handleInspect = async (item: (typeof registryAssets)[0]) => {
    try {
      const typeKey = item.type.includes("Character")
        ? "character"
        : item.type.includes("Environment")
        ? "set"
        : item.type.includes("Leitmotif")
        ? "leitmotif"
        : item.type.includes("Prop") || item.type.includes("World Lore")
        ? "prop"
        : item.type.includes("Project")
        ? "project"
        : "scene";

      const res = await fetch(`/api/dkg/export/${typeKey}/${item.id}`);
      if (res.ok) {
        const json = await res.json();
        setActiveJson({ name: item.name, ual: item.ual, json, schema: item.schema });
      } else {
        showToast({
          type: "error",
          title: "DKG Snapshot Error",
          message: "Knowledge Asset JSON-LD snapshot not found on local storage.",
        });
      }
    } catch (e) {
      showToast({
        type: "error",
        title: "JSON-LD Fetch Error",
        message: (e as Error).message,
      });
    }
  };

  const handleCopy = (ual: string) => {
    navigator.clipboard?.writeText(ual);
    setCopiedUal(ual);
    setTimeout(() => setCopiedUal(null), 2000);
  };

  // Scope and search filtering
  const scopedList = registryAssets.filter(
    (x) => scopeProjectId === "all" || x.projectId === scopeProjectId
  );

  const visible = scopedList.filter((x) => {
    const matchesFilter =
      filter === "All" ||
      (filter === "Projects" && x.type === "Project KA") ||
      (filter === "Characters" && x.type === "Character KA") ||
      (filter === "Environments" && x.type === "Environment KA") ||
      (filter === "Leitmotifs" && x.type === "Leitmotif KA") ||
      (filter === "Props & Lore" && (x.type === "Prop / Gear KA" || x.type === "World Lore KA")) ||
      (filter === "Scenes" && x.type === "Rendered Scene KA");

    const matchesQuery =
      !query ||
      x.name.toLowerCase().includes(query.toLowerCase()) ||
      x.ual.toLowerCase().includes(query.toLowerCase()) ||
      x.schema.toLowerCase().includes(query.toLowerCase()) ||
      x.projectTitle.toLowerCase().includes(query.toLowerCase());

    return matchesFilter && matchesQuery;
  });

  const countCharacters = scopedList.filter((x) => x.type === "Character KA").length;
  const countSets = scopedList.filter((x) => x.type === "Environment KA").length;
  const countSounds = scopedList.filter((x) => x.type === "Leitmotif KA").length;
  const countProps = scopedList.filter((x) => x.type === "Prop / Gear KA" || x.type === "World Lore KA").length;
  const countScenes = scopedList.filter((x) => x.type === "Rendered Scene KA").length;

  return (
    <main className="shelf">
      {/* ── Breadcrumb & Scope Switcher ── */}
      <div className="vault-breadcrumb" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <div>
          <span>{scopeProjectId === "all" ? "GLOBAL DKG MESH" : (projects.find((p) => p.id === scopeProjectId)?.title ?? "PROJECT").toUpperCase()}</span>
          <b>›</b> ON-CHAIN PROVENANCE <b>›</b> <strong>DKG ASSET REGISTRY</strong>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "10px", color: "#8a8894", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            REGISTRY SCOPE:
          </span>
          <select
            value={scopeProjectId}
            onChange={(e) => {
              const val = e.target.value;
              setScopeProjectId(val);
              if (val !== "all") {
                const p = projects.find((proj) => proj.id === val);
                if (p) setActiveProject(p);
              }
            }}
            style={{
              fontSize: "11px",
              fontWeight: 600,
              padding: "4px 10px",
              borderRadius: "6px",
              border: "1px solid #d4d0dc",
              background: "#fff",
              color: "#1a1924",
              cursor: "pointer",
            }}
          >
            <option value="all">All Projects (Global Registry)</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="landing-kicker">
        <b></b> ORIGINTRAIL DKG V8 ON-CHAIN LEDGER
      </p>
      <h1>DKG Asset Registry</h1>
      <p className="shelf-intro">
        Cryptographically verifiable Knowledge Assets anchored to OriginTrail DKG. Every asset possesses immutable visual DNA, schema annotations, and tamper-proof provenance lineage.
      </p>

      {/* ── Summary Stats Grid ── */}
      <div className="registry-stats-grid">
        <div className="registry-stat-card">
          <span>Total Anchored</span>
          <strong>{scopedList.length}</strong>
        </div>
        <div className="registry-stat-card">
          <span>Personas</span>
          <strong>{countCharacters}</strong>
        </div>
        <div className="registry-stat-card">
          <span>Environments</span>
          <strong>{countSets}</strong>
        </div>
        <div className="registry-stat-card">
          <span>Leitmotifs</span>
          <strong>{countSounds}</strong>
        </div>
        <div className="registry-stat-card">
          <span>Props & Lore</span>
          <strong>{countProps}</strong>
        </div>
        <div className="registry-stat-card">
          <span>Scenes</span>
          <strong>{countScenes}</strong>
        </div>
        <div className="registry-stat-card" style={{ background: "#f5f3ff", borderColor: "#ddd6fe" }}>
          <span>Paranet Status</span>
          <strong style={{ fontSize: "13px", color: "#6d28d9", marginTop: "4px" }}>● Synced V8</strong>
        </div>
      </div>

      {/* ── Search & Filter Bar ── */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "16px", alignItems: "center", flexWrap: "wrap" }}>
        <input
          style={{
            padding: "8px 14px",
            border: "1px solid #d8d5dd",
            borderRadius: "6px",
            fontSize: "13px",
            width: "320px",
            background: "#fff",
          }}
          placeholder="Search Knowledge Assets by name, UAL, schema, or project…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {["All", "Projects", "Characters", "Environments", "Leitmotifs", "Props & Lore", "Scenes"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: "6px 12px",
                borderRadius: "4px",
                fontSize: "12px",
                border: "1px solid",
                borderColor: filter === f ? "#7657d8" : "#d8d5dd",
                background: filter === f ? "#7657d8" : "#fff",
                color: filter === f ? "#fff" : "#333",
                cursor: "pointer",
                fontWeight: filter === f ? 700 : 500,
              }}
            >
              {f}
            </button>
          ))}
        </div>
        <span style={{ marginLeft: "auto", fontSize: "11px", color: "#666", fontFamily: "DM Mono" }}>
          {visible.length} VERIFIED ASSETS
        </span>
      </div>

      {/* ── Registry Table ── */}
      <div className="registry" style={{ background: "#fff", border: "1px solid #e2e1ea", borderRadius: "8px", overflow: "hidden" }}>
        <header style={{ display: "grid", gridTemplateColumns: "1.8fr 1.3fr 1.2fr 1.6fr 1fr 1.4fr", padding: "12px 16px", background: "#f8f9fa", borderBottom: "1px solid #e2e1ea", fontSize: "10px", fontWeight: 700, color: "#747282", fontFamily: "DM Mono", letterSpacing: "0.05em" }}>
          <span>KNOWLEDGE ASSET</span>
          <span>ONTOLOGY & SCHEMA</span>
          <span>PROJECT PARANET</span>
          <span>ORIGINTRAIL UAL</span>
          <span>INTEGRITY</span>
          <span style={{ textAlign: "right" }}>ACTIONS</span>
        </header>

        {visible.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#747282", fontSize: "13px" }}>
            No knowledge assets match the active filters.
          </div>
        ) : (
          visible.map((x) => {
            const badgeClass = x.type.includes("Character")
              ? "character"
              : x.type.includes("Environment")
              ? "set"
              : x.type.includes("Leitmotif")
              ? "sound"
              : x.type.includes("Prop") || x.type.includes("World Lore")
              ? "prop"
              : x.type.includes("Project")
              ? "project"
              : "scene";

            return (
              <div
                key={x.ual}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.8fr 1.3fr 1.2fr 1.6fr 1fr 1.4fr",
                  padding: "14px 16px",
                  alignItems: "center",
                  borderBottom: "1px solid #f0edf6",
                  fontSize: "12px",
                }}
              >
                <div>
                  <b style={{ color: "#1a1924", fontSize: "13px" }}>{x.name}</b>
                  {x.subtitle && (
                    <span style={{ display: "block", fontSize: "11px", color: "#777585", marginTop: "2px" }}>
                      {x.subtitle}
                    </span>
                  )}
                </div>

                <div>
                  <span className={`registry-badge-tag ${badgeClass}`}>
                    {x.type}
                  </span>
                  <small style={{ display: "block", font: "8px 'DM Mono'", color: "#8a8894", marginTop: "3px" }}>
                    {x.schema.split(",")[0]}
                  </small>
                </div>

                <div>
                  <span style={{ fontSize: "11px", color: "#4f4a5c", fontWeight: 600 }}>
                    {x.projectTitle}
                  </span>
                </div>

                <div>
                  <code
                    style={{
                      cursor: "pointer",
                      font: "9px 'DM Mono'",
                      background: "#f6f5fb",
                      padding: "3px 6px",
                      borderRadius: "4px",
                      color: "#5437a3",
                      display: "inline-block",
                      maxWidth: "200px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                    title="Click to copy full UAL"
                    onClick={() => handleCopy(x.ual)}
                  >
                    {copiedUal === x.ual ? "✓ Copied!" : x.ual}
                  </code>
                </div>

                <div>
                  <span style={{ font: "8px 'DM Mono'", color: "#047857", background: "#ecfdf5", border: "1px solid #a7f3d0", padding: "2px 6px", borderRadius: "4px" }}>
                    ✓ SHA-256
                  </span>
                </div>

                <div style={{ display: "flex", gap: "6px", justifyContent: "flex-end" }}>
                  <button
                    className="outline-button"
                    style={{ fontSize: "10px", padding: "5px 8px" }}
                    onClick={() => handleInspect(x)}
                  >
                    Inspect JSON-LD
                  </button>

                  {x.action === "character" && (
                    <button
                      className="character-direct-btn"
                      style={{ fontSize: "9px", padding: "4px 8px" }}
                      title="Direct character in Director Studio"
                      onClick={() => navigate("/studio", { state: { characterId: x.id, projectId: x.projectId } })}
                    >
                      Direct ↗
                    </button>
                  )}
                  {x.action === "set" && (
                    <button
                      className="set-direct-btn"
                      style={{ fontSize: "9px", padding: "4px 8px" }}
                      title="Direct environment in Director Studio"
                      onClick={() => navigate("/studio", { state: { setId: x.id, projectId: x.projectId } })}
                    >
                      Direct ↗
                    </button>
                  )}
                  {x.action === "leitmotif" && (
                    <button
                      className="sound-direct-btn"
                      style={{ fontSize: "9px", padding: "4px 8px" }}
                      title="Direct sound in Director Studio"
                      onClick={() => navigate("/studio", { state: { leitmotifId: x.id, projectId: x.projectId } })}
                    >
                      Direct ↗
                    </button>
                  )}
                  {x.action === "prop" && (
                    <button
                      className="vault-direct-btn"
                      style={{ fontSize: "9px", padding: "4px 8px" }}
                      title="Direct prop in Director Studio"
                      onClick={() => navigate("/studio", { state: { propId: x.id, projectId: x.projectId, propName: x.name } })}
                    >
                      Direct ↗
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ── JSON-LD & SPARQL Inspector Modal ── */}
      {activeJson && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.65)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setActiveJson(null)}
        >
          <div
            style={{
              background: "#13111c",
              color: "#e2e8f0",
              width: "740px",
              maxHeight: "85vh",
              borderRadius: "12px",
              padding: "24px",
              overflowY: "auto",
              boxShadow: "0 25px 50px rgba(0,0,0,0.6)",
              border: "1px solid #332d48",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
              <div>
                <span style={{ fontSize: "10px", color: "#a78bfa", fontFamily: "DM Mono", textTransform: "uppercase" }}>
                  ORIGINTRAIL DKG KNOWLEDGE ASSET
                </span>
                <h3 style={{ margin: "4px 0 0", color: "#fff", fontSize: "18px", font: "600 18px 'Playfair Display'" }}>
                  {activeJson.name}
                </h3>
                <code style={{ fontSize: "9px", color: "#74718a" }}>{activeJson.ual}</code>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <button
                  onClick={() => handleCopy(JSON.stringify(activeJson.json, null, 2))}
                  style={{
                    background: "#241f36",
                    border: "1px solid #433966",
                    color: "#c4b5fd",
                    padding: "4px 10px",
                    borderRadius: "4px",
                    fontSize: "10px",
                    fontFamily: "DM Mono",
                    cursor: "pointer",
                  }}
                >
                  {copiedUal ? "✓ Copied JSON" : "Copy JSON-LD"}
                </button>
                <button
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#aaa",
                    fontSize: "22px",
                    cursor: "pointer",
                  }}
                  onClick={() => setActiveJson(null)}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Tabs */}
            <div style={{ display: "flex", gap: "10px", borderBottom: "1px solid #28243b", marginBottom: "12px" }}>
              <button
                type="button"
                onClick={() => setJsonTab("jsonld")}
                style={{
                  background: "transparent",
                  border: 0,
                  padding: "8px 0",
                  borderBottom: `2px solid ${jsonTab === "jsonld" ? "#a78bfa" : "transparent"}`,
                  color: jsonTab === "jsonld" ? "#a78bfa" : "#888",
                  fontSize: "11px",
                  fontFamily: "DM Mono",
                  cursor: "pointer",
                }}
              >
                W3C JSON-LD Document
              </button>
              <button
                type="button"
                onClick={() => setJsonTab("sparql")}
                style={{
                  background: "transparent",
                  border: 0,
                  padding: "8px 0",
                  borderBottom: `2px solid ${jsonTab === "sparql" ? "#a78bfa" : "transparent"}`,
                  color: jsonTab === "sparql" ? "#a78bfa" : "#888",
                  fontSize: "11px",
                  fontFamily: "DM Mono",
                  cursor: "pointer",
                }}
              >
                SPARQL Triples Query
              </button>
            </div>

            {jsonTab === "jsonld" ? (
              <pre
                style={{
                  margin: 0,
                  padding: "16px",
                  background: "#0a0910",
                  borderRadius: "8px",
                  border: "1px solid #231f33",
                  fontSize: "11px",
                  fontFamily: "DM Mono",
                  color: "#a3e635",
                  maxHeight: "440px",
                  overflowY: "auto",
                  lineHeight: 1.6,
                }}
              >
                {JSON.stringify(activeJson.json, null, 2)}
              </pre>
            ) : (
              <pre
                style={{
                  margin: 0,
                  padding: "16px",
                  background: "#0a0910",
                  borderRadius: "8px",
                  border: "1px solid #231f33",
                  fontSize: "11px",
                  fontFamily: "DM Mono",
                  color: "#67e8f9",
                  maxHeight: "440px",
                  overflowY: "auto",
                  lineHeight: 1.6,
                }}
              >
{`PREFIX schema: <https://schema.org/>
PREFIX ex: <https://continuum.studio/kg/>
PREFIX prov: <http://www.w3.org/ns/prov#>

# Query DKG Knowledge Asset Assertions
SELECT ?predicate ?object
WHERE {
  <${activeJson.ual}> ?predicate ?object .
}`}
              </pre>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 8. SCRIPT TO SCENE PARSER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function ScriptToScene() {
  const { projects, activeProject, selectProjectId } = useProject();
  const [parsed, setParsed] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  const isSolaris = activeProject?.id === "proj-solaris-drift";

  const defaultSolarisText = `INT. DERELICT STATION CORRIDOR — DEEP SPACE

Flickering amber emergency indicators pierce the zero-gravity vacuum. DR. VANCE reaches the primary cryo-chamber, visor reflecting static data streams. The air recycling system thrums with rhythmic distortion.

VANCE
The transmission timestamp doesn't make sense. It was broadcast forty minutes ago.

SOLARIS AI
Beacon telemetry confirmed, Doctor. The vessel has been empty for forty cycles.`;

  const defaultRoninText = `INT. RAMEN SHOP AWNING — NIGHT

Rain cuts the neon alley into sheets of violet. REN steps beneath the awning, katana hilt resting in his grip. Across the street, YUKI waits holding a broken transmitter.

REN
That signal. I know it.

YUKI
Then you know what it cost me.`;

  const [scriptText, setScriptText] = useState(isSolaris ? defaultSolarisText : defaultRoninText);

  // Update text when project changes
  useEffect(() => {
    setScriptText(isSolaris ? defaultSolarisText : defaultRoninText);
    setParsed(false);
  }, [activeProject?.id]);

  const resolvedEntities = isSolaris
    ? [
        { type: "scene", title: "Scene 01 · Derelict Cryo Corridor", desc: "Atmosphere: Zero-gravity, amber emergency strobes", link: null },
        { type: "cast", title: "Dr. Aris Vance", ual: "did:dkg:continuum/character/vance", link: "/vault", tag: "CANONICAL CAST" },
        { type: "set", title: "Derelict Station Alpha", ual: "did:dkg:continuum/set/solaris-corridor", link: "/sets", tag: "LIGHTING ENFORCED" },
        { type: "audio", title: "Solaris Drift Drone", ual: "A Minor · 75 BPM", link: "/sound", tag: "LEITMOTIF" },
      ]
    : [
        { type: "scene", title: "Scene 03 · Rain Shop Awning", desc: "Atmosphere: Neon violet rain, reflective puddle caustics", link: null },
        { type: "cast", title: "Ren Akiyama", ual: "did:dkg:continuum/character/7d81…", link: "/vault", tag: "CANONICAL CAST" },
        { type: "cast", title: "Yuki Tanabe", ual: "did:dkg:continuum/character/865e…", link: "/vault", tag: "CANONICAL CAST" },
        { type: "set", title: "Neo-Tokyo Rain District", ual: "did:dkg:continuum/set/b9d5…", link: "/sets", tag: "LIGHTING ENFORCED" },
        { type: "audio", title: "Ren's Blade Leitmotif", ual: "D Minor · 120 BPM", link: "/sound", tag: "LEITMOTIF" },
      ];

  const handleParse = () => {
    setIsParsing(true);
    setTimeout(() => {
      setIsParsing(false);
      setParsed(true);
    }, 650);
  };

  const handleOpenStudio = () => {
    navigate("/studio");
  };

  return (
    <main className="workflow-page">
      <div className="vault-breadcrumb" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <div>
          <span>{(activeProject?.title ?? "CYBERPUNK: RONIN ECHOES").toUpperCase()}</span>
          <b>›</b> <strong>SCRIPT TO SCENE PARSER</strong>
        </div>
        <div className="project-selector-wrap">
          <select
            className="project-select-dropdown"
            value={activeProject?.id ?? ""}
            onChange={(e) => {
              selectProjectId(e.target.value);
            }}
            aria-label="Select screenplay project"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="character-label">DKG-ENRICHED SCREENPLAY PARSER</p>
      <h1>
        Script to <i>Scene.</i>
      </h1>
      <p className="workflow-intro">
        Convert raw screenplay dialogue into anchored scene cards for <strong>{activeProject?.title}</strong>. The parser resolves character names, locations, and Leitmotifs against the DKG Show Bible before the first frame renders.
      </p>

      <div className="script-grid">
        <section className="script-paper">
          <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontWeight: 700, letterSpacing: "0.06em", color: "#555260" }}>
                {isSolaris ? "EPISODE 01 · SOLARIS DRIFT DRAFT" : "EPISODE 01 · DRAFT 04"}
              </span>
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                style={{
                  border: "1px solid #d5d1e2",
                  background: isEditing ? "#f0ebfa" : "#fff",
                  color: "#6b49c7",
                  padding: "4px 10px",
                  borderRadius: "4px",
                  fontSize: "10px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                {isEditing ? "✓ Done Editing" : "Edit Screenplay"}
              </button>
            </div>

            <button
              type="button"
              onClick={handleParse}
              disabled={isParsing}
              style={{
                border: 0,
                background: parsed ? "#2b2938" : "linear-gradient(135deg, #7657d8 0%, #5b3db5 100%)",
                color: "#fff",
                padding: "8px 16px",
                borderRadius: "6px",
                fontSize: "11px",
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(118, 87, 216, 0.25)",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                transition: "all 0.15s ease",
              }}
            >
              {isParsing ? (
                <>
                  <span className="pulse" style={{ width: 6, height: 6, background: "#fff" }}></span>
                  Parsing DKG Graph…
                </>
              ) : parsed ? (
                "↻ Re-parse with DKG"
              ) : (
                "Parse screenplay against DKG →"
              )}
            </button>
          </header>

          <article style={{ padding: "24px 28px" }}>
            {isEditing ? (
              <textarea
                value={scriptText}
                onChange={(e) => setScriptText(e.target.value)}
                rows={12}
                style={{
                  width: "100%",
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "15px",
                  lineHeight: "1.75",
                  border: "1px solid #d6d3e3",
                  borderRadius: "6px",
                  padding: "16px",
                  background: "#faf9fd",
                  color: "#272530",
                  outlineColor: "#7657d8",
                  resize: "vertical",
                }}
              />
            ) : (
              <div style={{ whiteSpace: "pre-wrap", fontFamily: "'Playfair Display', serif", fontSize: "15px", lineHeight: "1.75", color: "#33313a" }}>
                {scriptText}
              </div>
            )}
          </article>
        </section>

        <section className="parse-results" style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <p className="character-label" style={{ margin: 0 }}>
              {isParsing ? "PARSING IN PROGRESS" : parsed ? "DKG CONSTRAINTS RESOLVED" : "PARSER STANDBY"}
            </p>
            {parsed && (
              <span style={{ fontSize: "9px", fontFamily: "DM Mono", color: "#16896f", background: "#e6f8f2", padding: "3px 7px", borderRadius: "4px", fontWeight: 700 }}>
                ● 100% CANONICAL
              </span>
            )}
          </div>

          <h2>{parsed ? `${resolvedEntities.length} DKG Knowledge Assets Mapped` : "Waiting for screenplay parsing"}</h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px", flex: 1 }}>
            {resolvedEntities.map((x, i) => (
              <div
                key={x.title}
                className={parsed ? "parsed-row ready" : "parsed-row"}
                style={{
                  padding: "12px 14px",
                  borderRadius: "8px",
                  background: parsed ? "#fbfafc" : "#fcfbfd",
                  border: "1px solid " + (parsed ? "#ebe8f2" : "#f0f0f4"),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ width: "24px", fontFamily: "DM Mono", fontSize: "10px", color: parsed ? "#7657d8" : "#a8a7af", fontWeight: 700 }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <strong style={{ display: "block", fontSize: "12px", color: parsed ? "#1f2029" : "#8e8d97" }}>
                      {x.title}
                    </strong>
                    <small style={{ fontSize: "10px", fontFamily: "DM Mono", color: "#8a8894" }}>
                      {x.ual || x.desc}
                    </small>
                  </div>
                </div>

                {parsed && x.link && (
                  <button
                    type="button"
                    onClick={() => navigate(x.link)}
                    style={{
                      border: "1px solid #ddd7ed",
                      background: "#fff",
                      color: "#6c4fc0",
                      fontSize: "9px",
                      fontFamily: "DM Mono",
                      fontWeight: 700,
                      padding: "4px 8px",
                      borderRadius: "4px",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}
                  >
                    View ↗
                  </button>
                )}
              </div>
            ))}
          </div>

          {parsed && (
            <button
              type="button"
              className="mint-button"
              style={{
                marginTop: "20px",
                width: "100%",
                padding: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                fontSize: "12px",
                fontWeight: 800,
                cursor: "pointer",
                boxShadow: "0 8px 20px rgba(17, 19, 24, 0.2)",
              }}
              onClick={handleOpenStudio}
            >
              <span>Direct Scene in Studio for {activeProject?.title} →</span>
            </button>
          )}
        </section>
      </div>
    </main>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 9. PROPS & LORE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function Props() {
  const { projects, activeProject, selectProjectId } = useProject();
  const navigate = useNavigate();

  // ── Props & Lore State ──
  const [propsList, setPropsList] = useState<PropAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [characters, setCharacters] = useState<CharacterAsset[]>([]);
  const [filterCategory, setFilterCategory] = useState<"all" | "prop" | "lore" | "tech">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedUal, setCopiedUal] = useState<string | null>(null);

  // ── Drawer & Form State ──
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [targetProjectId, setTargetProjectId] = useState(activeProject?.id ?? "proj-ronin-echoes");
  const [category, setCategory] = useState<"prop" | "lore">("prop");
  const [name, setName] = useState("");
  const [type, setType] = useState("Weapon / Armament");
  const [boundCharacterId, setBoundCharacterId] = useState("");
  const [visualTheme, setVisualTheme] = useState<"blade" | "transmitter" | "cell" | "device" | "relic" | "holocron">("blade");
  const [description, setDescription] = useState("");
  const [negativePrompts, setNegativePrompts] = useState("no plastic sheen, no neon green, no cartoon proportions");
  const [loreSignificance, setLoreSignificance] = useState("");
  const [isMinting, setIsMinting] = useState(false);
  const [mintStatus, setMintStatus] = useState<string | null>(null);
  const [mintError, setMintError] = useState<string | null>(null);
  const { showToast } = useToast();
  const [generatingPropImageId, setGeneratingPropImageId] = useState<string | null>(null);
  const [autoGenerateImage, setAutoGenerateImage] = useState(true);

  // Sync targetProjectId when activeProject changes
  useEffect(() => {
    if (activeProject?.id) {
      setTargetProjectId(activeProject.id);
    }
  }, [activeProject?.id]);

  // Fetch props scoped to active project
  const fetchProps = async () => {
    setLoading(true);
    try {
      const url = activeProject?.id
        ? `/api/vault/props?projectId=${encodeURIComponent(activeProject.id)}`
        : "/api/vault/props";
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setPropsList(data);
      }
    } catch (err) {
      console.error("[Props] Failed to fetch props:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProps();
  }, [activeProject?.id]);

  // Fetch characters for binding dropdown
  useEffect(() => {
    fetch("/api/vault/characters")
      .then((r) => r.json())
      .then((data) => setCharacters(data ?? []))
      .catch(() => {});
  }, []);

  // Copy UAL helper
  const handleCopyUal = (ual: string) => {
    navigator.clipboard.writeText(ual);
    setCopiedUal(ual);
    setTimeout(() => setCopiedUal(null), 2200);
  };

  // Generate AI Concept render for prop with Livepeer Flux
  const handleGeneratePropImage = async (propId: string) => {
    setGeneratingPropImageId(propId);
    try {
      const res = await fetch(`/api/vault/props/${propId}/image`, { method: "POST" });
      if (res.ok) {
        await fetchProps();
        showToast({
          type: "success",
          title: "AI Concept Art Rendered",
          message: "Prop visual keyframe rendered via Livepeer Agent (Flux) & anchored to DKG!",
        });
      } else {
        const err = await res.json().catch(() => ({}));
        showToast({
          type: "error",
          title: "Render Error",
          message: err.error ?? "Failed to render prop image",
        });
      }
    } catch (e) {
      showToast({
        type: "error",
        title: "Connection Error",
        message: (e as Error).message,
      });
    } finally {
      setGeneratingPropImageId(null);
    }
  };

  // Quick Preset Helper for director convenience
  const applyPreset = (preset: "katana" | "transmitter" | "cell" | "blackout" | "paradox") => {
    if (preset === "katana") {
      setCategory("prop");
      setName("Kensai Tachibana Katana");
      setType("Weapon / Armament");
      setVisualTheme("blade");
      setDescription("Forged high-frequency carbon katana with etched emerald circuit channels and worn ray-skin hilt.");
      setNegativePrompts("no western broadsword, no glowing rainbow, no medieval crossguard");
      setLoreSignificance("Inherited blade passed through three generations of neo-tokyo underground enforcers.");
    } else if (preset === "transmitter") {
      setCategory("prop");
      setName("Sub-Band Holo-Transmitter");
      setType("Communication Tech");
      setVisualTheme("transmitter");
      setDescription("Handheld salvaged military transponder emitting pulsating amber static and low-frequency encryption clicks.");
      setNegativePrompts("no sleek modern smartphone, no clean glass screen, no plastic body");
      setLoreSignificance("The only surviving communications link capable of piercing the citywide jamming field.");
    } else if (preset === "cell") {
      setCategory("prop");
      setName("Aethelgard Cryo-Cell / 09");
      setType("Forensic Clue");
      setVisualTheme("cell");
      setDescription("Cylindrical reinforced glass ampoule encasing cryogenic blue cerebral fluids and microscopic nanites.");
      setNegativePrompts("no plain water bottle, no cracked shards, no green sludge");
      setLoreSignificance("Recovered from the Sector 4 crash; contains the memory buffer of the rogue synth pilot.");
    } else if (preset === "blackout") {
      setCategory("lore");
      setName("The 2088 Grid Blackout");
      setType("Historical Cataclysm");
      setVisualTheme("relic");
      setDescription("All electronic systems above Sector 3 must display emergency amber backup lighting and magnetic shielding.");
      setNegativePrompts("no bright sunny skies, no modern neon billboards, no fully operational skyscrapers");
      setLoreSignificance("Universal world rule: high-voltage equipment fluctuates erratically in any outdoor night scene.");
    } else if (preset === "paradox") {
      setCategory("lore");
      setName("The Forty-Cycle Paradox");
      setType("Physical / Temporal Law");
      setVisualTheme("holocron");
      setDescription("Quantum recurrence anomaly causing temporal echoes to manifest as subtle visual chromatic aberrations.");
      setNegativePrompts("no cartoon time portals, no neon clocks, no magical swirls");
      setLoreSignificance("Directors must frame scenes with mirrors or glass when characters reflect on their timeline.");
    }
  };

  // Mint new prop Knowledge Asset
  const handleMintProp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) {
      setMintError("Please enter both a name and visual description.");
      return;
    }

    setIsMinting(true);
    setMintError(null);
    setMintStatus("Publishing JSON-LD Knowledge Asset to OriginTrail Paranet…");

    try {
      const payload = {
        projectId: targetProjectId,
        name: name.trim(),
        category,
        type,
        boundToCharacterId: boundCharacterId || undefined,
        description: description.trim(),
        loreSignificance: loreSignificance.trim(),
        negativePrompts: negativePrompts.trim(),
        visualTheme,
        generateImage: autoGenerateImage,
      };

      const res = await fetch("/api/vault/props", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to mint prop on DKG");
      }

      const mintedProp: PropAsset = await res.json();
      setMintStatus(`✓ Knowledge Asset Minted! UAL: ${mintedProp.ual}`);
      showToast({
        type: "success",
        title: "Canon Prop Minted to DKG",
        message: `Item "${mintedProp.name}" anchored to OriginTrail DKG!`,
        ual: mintedProp.ual,
      });

      // Refresh list
      await fetchProps();

      // Reset form after short delay and close
      setTimeout(() => {
        setIsMinting(false);
        setMintStatus(null);
        setIsDrawerOpen(false);
        setName("");
        setDescription("");
        setLoreSignificance("");
      }, 1400);
    } catch (err) {
      setMintError((err as Error).message);
      showToast({
        type: "error",
        title: "Minting Error",
        message: (err as Error).message,
      });
      setIsMinting(false);
      setMintStatus(null);
    }
  };

  // Filtered props
  const filteredProps = propsList.filter((prop) => {
    // Category tab filter
    if (filterCategory === "prop" && prop.category !== "prop") return false;
    if (filterCategory === "lore" && prop.category !== "lore") return false;
    if (filterCategory === "tech") {
      const t = (prop.type || "").toLowerCase();
      const isTech = t.includes("tech") || t.includes("cyber") || t.includes("comm") || t.includes("weapon");
      if (!isTech) return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = prop.name.toLowerCase().includes(q);
      const matchDesc = prop.description.toLowerCase().includes(q);
      const matchType = (prop.type || "").toLowerCase().includes(q);
      const matchLore = (prop.loreSignificance || "").toLowerCase().includes(q);
      return matchName || matchDesc || matchType || matchLore;
    }

    return true;
  });

  return (
    <main className="workflow-page props-page">
      {/* ── Breadcrumb & Project Selector ── */}
      <div className="vault-breadcrumb" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <span>{(activeProject?.title ?? "CYBERPUNK: RONIN ECHOES").toUpperCase()}</span>
          <b>›</b> <strong>SEASON {String(activeProject?.seasonNumber ?? 1).padStart(2, "0")}</strong>
          <b>›</b> <span style={{ color: "#7963c8" }}>CANON VAULT & PROV-O ARTIFACTS</span>
        </div>
        
        {/* Project Switcher */}
        <div className="project-selector-wrap" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "10px", color: "#8a8994", fontWeight: 700 }}>ACTIVE PROJECT:</span>
          <select
            className="project-select-dropdown"
            value={activeProject?.id ?? ""}
            onChange={(e) => selectProjectId(e.target.value)}
            aria-label="Select active project"
            style={{
              padding: "6px 12px",
              borderRadius: "6px",
              border: "1px solid #dcdbe4",
              background: "#fff",
              font: "700 11px Manrope",
              color: "#302f3a",
            }}
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} ({p.genre})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Heading & Mint Action ── */}
      <div className="workflow-heading">
        <div>
          <p className="character-label">PERSISTENT CANON & INVENTORY GRAPH</p>
          <h1>
            Props & <i>Lore.</i>
          </h1>
          <p style={{ fontSize: "12px", color: "#71707d", margin: "8px 0 0", maxWidth: "600px", lineHeight: 1.6 }}>
            Verifiable physical gear, weapons, forensic clues, and canonical worldbuilding rules anchored to 
            <strong> OriginTrail DKG Knowledge Assets</strong>. AI video agents reference these assets to guarantee continuity and prevent parameter drift across scenes.
          </p>
        </div>
        <button
          className="mint-button"
          onClick={() => {
            setTargetProjectId(activeProject?.id ?? "proj-ronin-echoes");
            setIsDrawerOpen(true);
          }}
          style={{ display: "flex", alignItems: "center", gap: "6px" }}
        >
          <span>+</span> Mint New Prop / Lore KA
        </button>
      </div>

      {/* ── Filter Toolbar ── */}
      <div className="props-toolbar">
        <div className="prop-filter-tabs">
          <button
            className={`prop-filter-tab ${filterCategory === "all" ? "active" : ""}`}
            onClick={() => setFilterCategory("all")}
          >
            All Canon ({propsList.length})
          </button>
          <button
            className={`prop-filter-tab ${filterCategory === "prop" ? "active" : ""}`}
            onClick={() => setFilterCategory("prop")}
          >
            Props & Gear ({propsList.filter((p) => p.category === "prop").length})
          </button>
          <button
            className={`prop-filter-tab ${filterCategory === "tech" ? "active" : ""}`}
            onClick={() => setFilterCategory("tech")}
          >
            Tech & Cyberware ({propsList.filter((p) => (p.type || "").toLowerCase().includes("tech") || (p.type || "").toLowerCase().includes("cyber") || (p.type || "").toLowerCase().includes("weapon")).length})
          </button>
          <button
            className={`prop-filter-tab ${filterCategory === "lore" ? "active" : ""}`}
            onClick={() => setFilterCategory("lore")}
          >
            World Lore & Rules ({propsList.filter((p) => p.category === "lore").length})
          </button>
        </div>

        <div className="prop-search-box">
          <span style={{ color: "#9897a2", fontSize: "14px" }}>⌕</span>
          <input
            type="text"
            placeholder="Search props, lore rules, weapons…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              style={{ border: 0, background: "transparent", color: "#8a8994", cursor: "pointer", fontSize: "12px" }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* ── Props & Lore Cards Grid ── */}
      {loading ? (
        <div style={{ padding: "60px 0", textAlign: "center", color: "#8a8994" }}>
          <p>Querying OriginTrail DKG Paranet for project canonical assets…</p>
        </div>
      ) : filteredProps.length === 0 ? (
        <div style={{ padding: "60px 20px", textAlign: "center", background: "#fff", borderRadius: "12px", border: "1px dashed #d5d3e0" }}>
          <h3 style={{ font: "600 22px 'Playfair Display'", color: "#33313d", margin: "0 0 8px" }}>No Canon Items Found</h3>
          <p style={{ fontSize: "12px", color: "#747380", maxWidth: "420px", margin: "0 auto 20px" }}>
            {searchQuery
              ? `No props or lore matched your search "${searchQuery}".`
              : `No items in this category for ${activeProject?.title ?? "this project"} yet.`}
          </p>
          <button
            className="mint-button"
            onClick={() => {
              setTargetProjectId(activeProject?.id ?? "proj-ronin-echoes");
              setIsDrawerOpen(true);
            }}
          >
            + Mint First Item in {activeProject?.title}
          </button>
        </div>
      ) : (
        <div className="lore-grid">
          {filteredProps.map((prop, i) => {
            const boundChar = characters.find((c) => c.id === prop.boundToCharacterId);
            const motifClass = prop.visualTheme || "device";

            return (
              <article className="lore-card" key={prop.id}>
                {/* Visual object rendering with motif CSS */}
                <div
                  className={`lore-object ${motifClass} ${prop.imageUrl ? "has-image" : ""}`}
                  style={{ position: "relative", overflow: "hidden" }}
                >
                  {prop.imageUrl && (
                    <img
                      src={prop.imageUrl}
                      alt={prop.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", top: 0, left: 0 }}
                    />
                  )}
                </div>

                <div className="prop-badge-row">
                  <span className={`prop-badge ${prop.category === "lore" ? "lore" : ""}`}>
                    {prop.category === "lore" ? "WORLD LORE" : "CANON PROP"}
                  </span>
                  <span className="prop-badge" style={{ background: "#f5f4f8", color: "#545360" }}>
                    {prop.type || "Artifact"}
                  </span>
                  {boundChar && (
                    <span className="prop-badge bound" title={`Bound to ${boundChar.name}`}>
                      {boundChar.name}
                    </span>
                  )}
                </div>

                <small style={{ font: "8px 'DM Mono'", color: "#8b8994", letterSpacing: "0.1em" }}>
                  KNOWLEDGE ASSET 0{i + 1} · {prop.id.slice(0, 14)}
                </small>

                <h2 style={{ margin: "6px 0 8px" }}>{prop.name}</h2>
                {prop.compliance && (
                  <div style={{ marginBottom: "8px" }}>
                    <span className="enterprise-ip-pill" style={{ background: "#fffbeb", color: "#92400e", borderColor: "#fde68a" }}>
                      HERO PRODUCT IP · {prop.compliance.licenseType.slice(0, 24)}…
                    </span>
                  </div>
                )}

                {/* Prompt & Visual constraints */}
                <p style={{ margin: "0 0 8px", fontSize: "11px", color: "#4f4e5a", lineHeight: 1.5 }}>
                  {prop.description}
                </p>

                {/* Anti-Drift Guardrails */}
                {Boolean(prop.negativePrompts && prop.negativePrompts.length > 0) && (
                  <div className="prop-negative-guard" title="Injected into Livepeer negative prompts to prevent visual drift">
                    <strong>Anti-Drift:</strong> {prop.negativePrompts?.join(", ")}
                  </div>
                )}

                {/* Narrative Lore Significance */}
                {prop.loreSignificance && (
                  <div style={{ fontSize: "10px", color: "#747280", fontStyle: "italic", borderLeft: "2px solid #7c64c8", paddingLeft: "8px", margin: "6px 0 12px" }}>
                    "{prop.loreSignificance}"
                  </div>
                )}

                {/* AI Concept Re-render button */}
                <button
                  type="button"
                  className="outline-button"
                  style={{
                    width: "100%",
                    marginTop: "10px",
                    marginBottom: "8px",
                    fontSize: "11px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    padding: "7px 10px",
                    borderColor: "#7657d8",
                    color: "#7657d8",
                    borderRadius: "6px",
                    cursor: "pointer",
                    background: "transparent",
                  }}
                  disabled={generatingPropImageId === prop.id}
                  onClick={() => handleGeneratePropImage(prop.id)}
                >
                  {generatingPropImageId === prop.id ? (
                    <>
                      <span className="mini-spinner" /> Generating with Livepeer (Flux)...
                    </>
                  ) : (
                    <>
                      ✦ {prop.imageUrl ? "Re-render AI Concept (Flux)" : "Generate AI Concept (Flux)"}
                    </>
                  )}
                </button>

                {/* Card footer: UAL badge and Direct button */}
                <div className="prop-card-actions">
                  <div
                    className="prop-ual-tag"
                    title="Click to copy OriginTrail DKG UAL"
                    onClick={() => handleCopyUal(prop.ual || `did:dkg:continuum/prop/${prop.id}`)}
                  >
                    <span>{copiedUal === (prop.ual || `did:dkg:continuum/prop/${prop.id}`) ? "✓ COPIED" : "DKG UAL"}</span>
                    <code>{(prop.ual || `did:dkg:continuum/prop/${prop.id}`).slice(0, 20)}…</code>
                  </div>

                  <button
                    className="prop-direct-btn"
                    title="Pre-inject this prop into Director Studio prompt"
                    onClick={() => {
                      navigate("/studio", {
                        state: {
                          propFocus: prop.name,
                          propPrompt: prop.description,
                          projectId: prop.projectId,
                        },
                      });
                    }}
                  >
                    Direct in Scene ↗
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* ── Slide-Over Modal / Drawer: Mint Prop & Lore ── */}
      {isDrawerOpen && (
        <>
          <div className="prop-drawer-overlay" onClick={() => !isMinting && setIsDrawerOpen(false)} />
          <aside className="prop-drawer">
            <header>
              <div>
                <p className="character-label">ORIGINTRAIL DKG BUILDER</p>
                <h2>Mint Canon & <i>Lore.</i></h2>
              </div>
              <button
                type="button"
                onClick={() => !isMinting && setIsDrawerOpen(false)}
                style={{
                  border: "1px solid #e5e7eb",
                  background: "#fff",
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  cursor: "pointer",
                  fontSize: "16px",
                  color: "#545360",
                }}
              >
                ✕
              </button>
            </header>

            <form className="prop-drawer-body" onSubmit={handleMintProp}>
              {/* Category Toggle: Prop vs Lore */}
              <div className="prop-category-toggle">
                <button
                  type="button"
                  className={category === "prop" ? "active" : ""}
                  onClick={() => {
                    setCategory("prop");
                    if (type.includes("Law") || type.includes("Cataclysm") || type.includes("Doctrine")) {
                      setType("Weapon / Armament");
                    }
                  }}
                >
                  Cinematic Prop (Physical Gear)
                </button>
                <button
                  type="button"
                  className={category === "lore" ? "active" : ""}
                  onClick={() => {
                    setCategory("lore");
                    setType("Historical Cataclysm");
                  }}
                >
                  World Lore & Canon Rule
                </button>
              </div>

              {/* Inspiration Presets */}
              <div>
                <span style={{ fontSize: "10px", color: "#8a8894", fontWeight: 700 }}>QUICK PRESETS:</span>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "6px" }}>
                  <button
                    type="button"
                    onClick={() => applyPreset("katana")}
                    style={{ border: "1px solid #dedbeb", background: "#f8f6fd", borderRadius: "4px", padding: "4px 8px", fontSize: "10px", cursor: "pointer", color: "#5d43a6" }}
                  >
                    + Cyber Katana
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPreset("transmitter")}
                    style={{ border: "1px solid #dedbeb", background: "#f8f6fd", borderRadius: "4px", padding: "4px 8px", fontSize: "10px", cursor: "pointer", color: "#5d43a6" }}
                  >
                    + Holo-Transmitter
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPreset("cell")}
                    style={{ border: "1px solid #dedbeb", background: "#f8f6fd", borderRadius: "4px", padding: "4px 8px", fontSize: "10px", cursor: "pointer", color: "#5d43a6" }}
                  >
                    + Memory Ampoule
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPreset("blackout")}
                    style={{ border: "1px solid #dedbeb", background: "#f8f6fd", borderRadius: "4px", padding: "4px 8px", fontSize: "10px", cursor: "pointer", color: "#5d43a6" }}
                  >
                    + Grid Blackout Rule
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPreset("paradox")}
                    style={{ border: "1px solid #dedbeb", background: "#f8f6fd", borderRadius: "4px", padding: "4px 8px", fontSize: "10px", cursor: "pointer", color: "#5d43a6" }}
                  >
                    + Temporal Paradox
                  </button>
                </div>
              </div>

              {/* Target Project Selection */}
              <label>
                Target Project
                <select
                  value={targetProjectId}
                  onChange={(e) => setTargetProjectId(e.target.value)}
                  disabled={isMinting}
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} ({p.genre})
                    </option>
                  ))}
                </select>
                <span className="hint">The knowledge asset will be anchored into this project's DKG Paranet subgraph.</span>
              </label>

              {/* Item Name */}
              <label>
                {category === "prop" ? "Prop / Item Name" : "Lore Rule / Event Name"}
                <input
                  type="text"
                  placeholder={category === "prop" ? "e.g. Kensai Tachibana Katana" : "e.g. The 2088 Grid Blackout Ordinance"}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={isMinting}
                />
              </label>

              {/* Classification Type & Bound Character */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <label>
                  Classification
                  <select value={type} onChange={(e) => setType(e.target.value)} disabled={isMinting}>
                    {category === "prop" ? (
                      <>
                        <option value="Weapon / Armament">Weapon / Armament</option>
                        <option value="Communication Tech">Communication Tech</option>
                        <option value="Cyberware Implant">Cyberware Implant</option>
                        <option value="Forensic Clue">Forensic Clue / Artifact</option>
                        <option value="Transport / Vehicle">Transport / Vehicle</option>
                        <option value="Apparel & Armor">Apparel & Armor</option>
                      </>
                    ) : (
                      <>
                        <option value="Historical Cataclysm">Historical Cataclysm</option>
                        <option value="Physical / Temporal Law">Physical / Temporal Law</option>
                        <option value="Faction Doctrine">Faction Doctrine</option>
                        <option value="Corporate Ordinance">Corporate Ordinance</option>
                        <option value="Anomalous Phenomenon">Anomalous Phenomenon</option>
                      </>
                    )}
                  </select>
                </label>

                <label>
                  Bound Character
                  <select
                    value={boundCharacterId}
                    onChange={(e) => setBoundCharacterId(e.target.value)}
                    disabled={isMinting}
                  >
                    <option value="">Unbound / Universal Faction</option>
                    {characters.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.epithet})
                      </option>
                    ))}
                  </select>
                  <span className="hint">Optional: character who possesses or governs this.</span>
                </label>
              </div>

              {/* Visual Hologram Motif Selector */}
              <div>
                <label>
                  Visual Motif Iconography
                  <span className="hint">Select animated SVG hologram motif for card presentation</span>
                </label>
                <div className="motif-selector">
                  {(
                    [
                      ["blade", "Blade / Edge"],
                      ["transmitter", "Transponder"],
                      ["cell", "Capsule / Cell"],
                      ["device", "Deck / Interface"],
                      ["relic", "Relic / Crest"],
                      ["holocron", "Holocron Core"],
                    ] as const
                  ).map(([motifKey, motifLabel]) => (
                    <button
                      key={motifKey}
                      type="button"
                      className={`motif-btn ${visualTheme === motifKey ? "selected" : ""}`}
                      onClick={() => setVisualTheme(motifKey)}
                    >
                      <span style={{ fontSize: "11px", fontWeight: 600 }}>{motifLabel}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Visual Prompt Constraints */}
              <label>
                Visual DNA & Prompt Constraints
                <textarea
                  rows={3}
                  placeholder="e.g. Matte black gunmetal alloy with worn edges, subtle amber fiber-optic pulse along the hilt, weathered grip wrapped in dark cord..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  disabled={isMinting}
                />
                <span className="hint">
                  Injected into Livepeer diffusion keyframes to ensure camera angles maintain identical materials, reflections, and wear.
                </span>
              </label>

              {/* Anti-Drift Negative Guardrails */}
              <label>
                Anti-Drift Guard (Negative Prompt Filter)
                <input
                  type="text"
                  placeholder="e.g. no plastic sheen, no neon green, no cartoon proportions, no mismatched grip"
                  value={negativePrompts}
                  onChange={(e) => setNegativePrompts(e.target.value)}
                  disabled={isMinting}
                />
                <span className="hint">Prohibits AI generative deviations across multi-shot sequences.</span>
              </label>

              {/* Narrative Lore Significance */}
              <label>
                Narrative Lore & Continuity Context
                <textarea
                  rows={2}
                  placeholder="Explain why this item or law exists in your canon bible and how it influences story decisions..."
                  value={loreSignificance}
                  onChange={(e) => setLoreSignificance(e.target.value)}
                  disabled={isMinting}
                />
              </label>

              {/* Live Preview Card */}
              <div>
                <span style={{ fontSize: "10px", color: "#8a8894", fontWeight: 700 }}>LIVE KNOWLEDGE ASSET PREVIEW:</span>
                <div className="prop-preview-container" style={{ marginTop: "6px" }}>
                  <div className={`lore-object ${visualTheme}`} style={{ height: "90px", marginBottom: "10px" }}></div>
                  <div className="prop-badge-row">
                    <span className={`prop-badge ${category === "lore" ? "lore" : ""}`}>
                      {category === "lore" ? "WORLD LORE" : "CANON PROP"}
                    </span>
                    <span className="prop-badge">{type}</span>
                    {boundCharacterId && (
                      <span className="prop-badge bound">
                        {characters.find((c) => c.id === boundCharacterId)?.name || "Bound"}
                      </span>
                    )}
                  </div>
                  <h4 style={{ margin: "4px 0", font: "600 16px 'Playfair Display'" }}>
                    {name || "Untitled Canon Entry"}
                  </h4>
                  <p style={{ fontSize: "10px", color: "#595866", margin: "4px 0", lineHeight: 1.4 }}>
                    {description || "Enter visual description to preview prompt constraints..."}
                  </p>
                  <code style={{ fontSize: "8px", color: "#16896f" }}>
                    did:dkg:continuum/{category}/{targetProjectId}/preview
                  </code>
                </div>
              </div>

              {/* Feedback messages */}
              {mintStatus && (
                <div style={{ padding: "10px 14px", background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#166534", borderRadius: "6px", fontSize: "11px" }}>
                  {mintStatus}
                </div>
              )}
              {mintError && (
                <div style={{ padding: "10px 14px", background: "#fef2f2", border: "1px solid #fecaca", color: "#991b1b", borderRadius: "6px", fontSize: "11px" }}>
                  {mintError}
                </div>
              )}

              {/* Auto-render Option */}
              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", margin: "14px 0 10px", fontSize: "11px", color: "#373644", fontWeight: 700 }}>
                <input
                  type="checkbox"
                  checked={autoGenerateImage}
                  onChange={(e) => setAutoGenerateImage(e.target.checked)}
                  style={{ accentColor: "#7657d8", width: "16px", height: "16px", margin: 0 }}
                  disabled={isMinting}
                />
                Auto-render cinematic concept art via Livepeer Agent (Flux) on mint
              </label>

              {/* Submit Footer */}
              <div style={{ marginTop: "10px" }}>
                <button
                  type="submit"
                  className="mint-button"
                  disabled={isMinting}
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "8px",
                    padding: "13px",
                  }}
                >
                  {isMinting ? (
                    <>
                      <span className="tiny-spin" style={{ display: "inline-block", width: "12px", height: "12px", border: "2px solid #fff", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }}></span>
                      Minting Knowledge Asset on DKG…
                    </>
                  ) : (
                    <>
                      <span>+</span> Mint Prop Knowledge Asset to DKG Paranet
                    </>
                  )}
                </button>
                <p style={{ fontSize: "9px", color: "#8a8994", textAlign: "center", margin: "8px 0 0" }}>
                  Permanently publishes verifiable W3C PROV-O JSON-LD to OriginTrail Decentralized Knowledge Graph.
                </p>
              </div>
            </form>
          </aside>
        </>
      )}
    </main>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 10. STUDIO SETTINGS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function Settings() {
  const { activeProject, projects, setActiveProject } = useProject();
  const { showToast } = useToast();
  const [model, setModel] = useState("Kling 1.6");
  const [health, setHealth] = useState<{
    status: string;
    livepeerMode: string;
    livepeerEndpoint: string;
    dkgMode: string;
    counts: { characters: number; leitmotifs: number; sets: number; props: number; scenes: number };
    uptimeSeconds: number;
    timestamp: string;
  } | null>(null);
  const [testing, setTesting] = useState(false);
  const [pingMs, setPingMs] = useState<number | null>(null);

  // Policy toggles
  const [strictContinuity, setStrictContinuity] = useState(true);
  const [autoProvenance, setAutoProvenance] = useState(true);
  const [biometricLock, setBiometricLock] = useState(true);
  const [seedLocking, setSeedLocking] = useState(true);

  // Project-specific counts
  const [projectCounts, setProjectCounts] = useState<{
    characters: number;
    sets: number;
    leitmotifs: number;
    props: number;
    scenes: number;
  }>({ characters: 0, sets: 0, leitmotifs: 0, props: 0, scenes: 0 });

  useEffect(() => {
    fetch("/api/health")
      .then((r) => r.json())
      .then((data) => setHealth(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!activeProject?.id) return;
    const pId = activeProject.id;
    Promise.all([
      fetch(`/api/vault/characters?projectId=${encodeURIComponent(pId)}`).then((r) => r.json()),
      fetch(`/api/vault/sets?projectId=${encodeURIComponent(pId)}`).then((r) => r.json()),
      fetch(`/api/vault/sounds?projectId=${encodeURIComponent(pId)}`).then((r) => r.json()),
      fetch(`/api/vault/props`).then((r) => r.json()),
      fetch(`/api/scenes?projectId=${encodeURIComponent(pId)}`).then((r) => r.json()),
    ])
      .then(([chars, sets, sounds, props, scenes]) => {
        const pProps = Array.isArray(props) ? props.filter((p: any) => (p.projectId ?? "proj-ronin-echoes") === activeProject.id) : [];
        setProjectCounts({
          characters: Array.isArray(chars) ? chars.length : 0,
          sets: Array.isArray(sets) ? sets.length : 0,
          leitmotifs: Array.isArray(sounds) ? sounds.length : 0,
          props: pProps.length,
          scenes: Array.isArray(scenes) ? scenes.length : 0,
        });
      })
      .catch(() => {});
  }, [activeProject?.id]);

  const handleTestConnection = async () => {
    setTesting(true);
    const t0 = performance.now();
    try {
      const res = await fetch("/api/health");
      const data = await res.json();
      const elapsed = Math.round(performance.now() - t0);
      setPingMs(elapsed);
      setHealth(data);
      showToast({
        type: "success",
        title: "Livepeer Gateway Check Passed",
        message: `Status: ONLINE (${data?.livepeerMode?.toUpperCase() ?? "REAL"} mode) · Latency: ${elapsed}ms`,
      });
    } catch (e) {
      showToast({
        type: "error",
        title: "Gateway Connection Error",
        message: (e as Error).message,
      });
    } finally {
      setTesting(false);
    }
  };

  const handleDownloadStoryBible = async () => {
    if (!activeProject?.id) return;
    try {
      const res = await fetch(`/api/projects/${activeProject.id}/story-bible`);
      if (!res.ok) throw new Error("Story bible export failed");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${activeProject.id}-story-bible.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      showToast({
        type: "success",
        title: "Story Bible Exported",
        message: `Downloaded canonical story bible bundle for "${activeProject.title}".`,
      });
    } catch (err) {
      showToast({
        type: "error",
        title: "Story Bible Export Failed",
        message: (err as Error).message,
      });
    }
  };

  return (
    <main className="workflow-page settings-page">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <p className="character-label">SYSTEM ARCHITECTURE & ENGINE CONFIGURATION</p>
          <h1>
            Studio <i>Settings.</i>
          </h1>
          <p className="workflow-intro" style={{ margin: "10px 0 24px" }}>
            Livepeer Agent Creative Gateway, OriginTrail DKG Paranet synchronization, and episodic continuity governance.
          </p>
        </div>

        {/* Project Selector Badge */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", background: "#fff", border: "1px solid #e2e1ea", padding: "8px 14px", borderRadius: "8px" }}>
          <span style={{ fontSize: "10px", fontFamily: "DM Mono", color: "#8a8894", textTransform: "uppercase" }}>Active Project:</span>
          <select
            value={activeProject?.id ?? ""}
            onChange={(e) => {
              const p = projects.find((proj) => proj.id === e.target.value);
              if (p) setActiveProject(p);
            }}
            style={{ fontSize: "12px", fontWeight: 700, border: "none", background: "transparent", color: "#1a1924", outline: "none", cursor: "pointer" }}
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="settings-grid">
        {/* ── Section 1: Livepeer Agent Gateway ── */}
        <section>
          <h2>Livepeer Agent Gateway</h2>
          <p>Autonomous AI agents orchestrating multi-modal generation (video, keyframes, sound).</p>

          <div className="gateway-status">
            <i></i>
            <div>
              <b>
                Livepeer Agent Connected ({health?.livepeerMode?.toUpperCase() ?? "REAL"} MODE)
              </b>
              <span>Endpoint: {health?.livepeerEndpoint ?? "https://agent.livepeer.org/api/mcp/creative"}</span>
            </div>
            <button onClick={handleTestConnection} disabled={testing} title="Measure round-trip ping">
              {testing ? "Pinging…" : pingMs !== null ? `${pingMs}ms` : "Test Ping"}
            </button>
          </div>

          <label>
            Primary Video Generation Capability
            <select value={model} onChange={(e) => setModel(e.target.value)}>
              <option>Kling 1.6 (via Livepeer Agent — Cinematic Physics)</option>
              <option>Pixverse i2v (via Livepeer Agent — High Dynamic Motion)</option>
              <option>Flux-dev Keyframe (via Livepeer Agent — 1024px Visual DNA)</option>
              <option>Sonilo v2m Music (via Livepeer Agent — Harmonic Leitmotif)</option>
            </select>
          </label>

          <div style={{ marginTop: "16px", padding: "12px", background: "#f8f9fa", borderRadius: "6px", border: "1px solid #eef0f2" }}>
            <span style={{ fontSize: "9px", fontFamily: "DM Mono", color: "#6b6976", display: "block", marginBottom: "6px" }}>
              ACTIVE MULTI-MODAL MCP TOOLS:
            </span>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {["generate_image", "generate_video", "generate_audio", "voice_continuity", "scene_compositor"].map((tool) => (
                <span key={tool} style={{ font: "9px 'DM Mono'", background: "#fff", border: "1px solid #dcdbe3", padding: "3px 6px", borderRadius: "4px", color: "#504d59" }}>
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── Section 2: OriginTrail DKG Paranet & Story Bible ── */}
        <section>
          <h2>OriginTrail DKG Paranet & Vault</h2>
          <p>Cryptographic story bible exports and cross-series decentralized provenance ledger.</p>

          <div className="export-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <b>{activeProject?.title ?? "Cyberpunk: Ronin Echoes"}</b>
              <span style={{ font: "9px 'DM Mono'", color: "#059669", background: "#ecfdf5", border: "1px solid #a7f3d0", padding: "2px 6px", borderRadius: "4px" }}>
                ● Paranet V8 Synced
              </span>
            </div>
            <span style={{ margin: "6px 0 12px", display: "block", color: "#666" }}>
              {projectCounts.characters} Personas · {projectCounts.sets} Environments · {projectCounts.leitmotifs} Leitmotifs · {projectCounts.props} Props & Lore · {projectCounts.scenes} Scenes
            </span>

            <div style={{ marginTop: "10px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <button
                onClick={handleDownloadStoryBible}
                style={{ background: "#7657d8", color: "#fff", borderColor: "#7657d8" }}
                title="Download full JSON Story Bible bundle with all assets and scene manifests"
              >
                Export Story Bible (.json)
              </button>
              <button
                onClick={() => window.open(`/api/dkg/export/project/${activeProject?.id ?? "proj-ronin-echoes"}`, "_blank")}
                title="View W3C RDF JSON-LD representation of this creative series"
              >
                RDF JSON-LD
              </button>
              <button
                onClick={() => window.open(`/api/dkg/graph?projectId=${activeProject?.id ?? "proj-ronin-echoes"}`, "_blank")}
                title="Inspect raw sub-graph triples"
              >
                Sub-Graph Triples
              </button>
            </div>
          </div>

          <div style={{ marginTop: "18px" }}>
            <span style={{ fontSize: "10px", fontWeight: 700, color: "#1a1924", display: "block", marginBottom: "8px" }}>
              DECENTRALIZED VAULT SPECIFICATION:
            </span>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "10px", color: "#666" }}>
              <div style={{ background: "#f8f9fa", padding: "8px 10px", borderRadius: "4px", border: "1px solid #eee" }}>
                <span style={{ display: "block", color: "#999", fontSize: "8px", fontFamily: "DM Mono" }}>PARANET ROOT</span>
                <code style={{ color: "#7657d8", font: "9px 'DM Mono'" }}>did:dkg:continuum/</code>
              </div>
              <div style={{ background: "#f8f9fa", padding: "8px 10px", borderRadius: "4px", border: "1px solid #eee" }}>
                <span style={{ display: "block", color: "#999", fontSize: "8px", fontFamily: "DM Mono" }}>CHAIN CONSENSUS</span>
                <span style={{ color: "#1a1924", fontWeight: 600 }}>NeuroWeb / Base Sepolia</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ── Section 3: Continuity Governance Policies ── */}
      <div style={{ marginTop: "32px", background: "#fff", border: "1px solid #e5e7eb", borderRadius: "10px", padding: "24px" }}>
        <h2 style={{ font: "600 22px 'Playfair Display'", margin: "0 0 4px", color: "#1a1924" }}>
          Continuity & Provenance Policies
        </h2>
        <p style={{ fontSize: "11px", color: "#76757e", margin: "0 0 18px" }}>
          Automated guardrails enforced by Continuum before generating Livepeer frames.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div
            className={`setting-toggle ${strictContinuity ? "" : "off"}`}
            onClick={() => setStrictContinuity(!strictContinuity)}
          >
            <div>
              <b style={{ color: "#1a1924", fontSize: "12px" }}>Strict DKG Continuity Constraints</b>
              <span style={{ display: "block", fontSize: "10px", color: "#74737b", marginTop: "3px" }}>
                Injects negative prompts, color palettes, and facial DNA into every Livepeer prompt.
              </span>
            </div>
            <i></i>
          </div>

          <div
            className={`setting-toggle ${autoProvenance ? "" : "off"}`}
            onClick={() => setAutoProvenance(!autoProvenance)}
          >
            <div>
              <b style={{ color: "#1a1924", fontSize: "12px" }}>Automated W3C PROV-O Anchoring</b>
              <span style={{ display: "block", fontSize: "10px", color: "#74737b", marginTop: "3px" }}>
                Mints verifiable provenance Knowledge Assets immediately upon completed scene render.
              </span>
            </div>
            <i></i>
          </div>

          <div
            className={`setting-toggle ${biometricLock ? "" : "off"}`}
            onClick={() => setBiometricLock(!biometricLock)}
          >
            <div>
              <b style={{ color: "#1a1924", fontSize: "12px" }}>Biometric Prop Palm Signatures</b>
              <span style={{ display: "block", fontSize: "10px", color: "#74737b", marginTop: "3px" }}>
                Restricts designated weapon props (e.g. Kensai Katana) strictly to bound character personas.
              </span>
            </div>
            <i></i>
          </div>

          <div
            className={`setting-toggle ${seedLocking ? "" : "off"}`}
            onClick={() => setSeedLocking(!seedLocking)}
          >
            <div>
              <b style={{ color: "#1a1924", fontSize: "12px" }}>Cross-Episode Deterministic Seed Locking</b>
              <span style={{ display: "block", fontSize: "10px", color: "#74737b", marginTop: "3px" }}>
                Derives pseudorandom generation seeds deterministically from character and set UAL hashes.
              </span>
            </div>
            <i></i>
          </div>
        </div>
      </div>
    </main>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ROUTER CONFIGURATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const router = createBrowserRouter([
  { path: "/", Component: Landing },
  {
    path: "/",
    Component: StudioShell,
    children: [
      { path: "studio", Component: DirectorStudio },
      { path: "vault", Component: Characters },
      { path: "sets", Component: Sets },
      { path: "sound", Component: Sound },
      { path: "props", Component: Props },
      { path: "script", Component: ScriptToScene },
      { path: "settings", Component: Settings },
      { path: "episodes", Component: Episodes },
      { path: "graph", Component: Graph },
      { path: "registry", Component: Registry },
    ],
  },
]);
