# Continuum ✦ Neuro-Symbolic AI Cinema Engine

> **Built for Atumera Hackathon — Livepeer × OriginTrail**  
> Direct a cinematic universe that *never forgets*. Anchoring character visual DNA, environments, and musical motifs into verifiable OriginTrail DKG Knowledge Assets (KAs) to eliminate parameter drift in AI video generation.

---

## The Problem: AI Parameter Amnesia
Standard generative video models suffer from severe parameter drift between frames and shots: facial features warp, costumes change, scars disappear, and musical themes disconnect.

## The Solution: Continuum
Continuum binds **OriginTrail Decentralized Knowledge Graph (DKG v8 Paranet)** with **Livepeer AI Agent Pipelines**:
- **OriginTrail DKG**: Stores immutable, deterministic JSON-LD Knowledge Assets containing character seeds, color palettes, physical landmarks, and strict negative anti-drift constraints under uniform UALs (`did:dkg:continuum/...`).
- **Livepeer AI Agent**: Queries DKG graph relations via semantic constraints, injects canonical DNA into multi-stage generation pipelines (text-to-image keyframes, image-to-video scene synthesis, and audio generation), and writes W3C PROV-O audit trails back to the graph.

---

## Key Features

### 1. Director Studio
- Natural language scene direction interface.
- Automatic or manual binding of canonical characters, sets, props, and leitmotifs.
- Live multi-stage pipeline status tracker (DKG SPARQL resolution → Prompt Enrichment → Livepeer Generation → W3C PROV-O Minting).
- Scene gallery with verifiable lineage and episode management.

### 2. Living Asset Vault
- **Characters**: Canonical visual DNA, cyberware, facial landmarks, attire rules, and anti-drift negative prompts.
- **Sets & Environments**: Lighting schemas, volumetric fog parameters, color hexes, and architectural constraints.
- **Voice & Sound**: Musical leitmotifs, tempo, key, synthwave instruments, and audio preview player.
- **Props & Lore**: Canonical artifacts, lore significance, and bound character cyberware.

### 3. DKG Knowledge Graph & Asset Registry
- Interactive RDF mesh network with animated edge data streams.
- Direct JSON-LD Knowledge Asset inspection.
- Filter by project universe (*Cyberpunk: Ronin Echoes*, *Solaris: Drift Protocol*).
- Real-time UAL copy and verification badges.

### 4. Visual Continuity Proof
- Live side-by-side comparison illustrating unanchored AI drift vs. DKG-locked canonical consistency across consecutive cinematic shots.

---

## Tech Stack
- **Frontend**: React 19, TypeScript, React Router, Vite, CSS Design System (Custom Dark Mode, Fluid Micro-Animations).
- **Backend**: Express, TypeScript (`tsx`), OriginTrail DKG Adapter, Livepeer Agent MCP Adapter, JSON-LD Graph Storage.
- **Standards**: W3C PROV-O, Schema.org, RDF/JSON-LD.

---

## Quick Start

### Prerequisites
- Node.js 20+
- npm

### Installation
```bash
# Clone the repository
git clone git@github.com:IrrhammCode/continuum.git
cd continuum

# Install dependencies
npm install
```

### Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Configure your environment variables:
```env
PORT=8080
LIVEPEER_MODE=mock # or livepeer
LIVEPEER_API_KEY=your_livepeer_key
DKG_MODE=file # or dkg-testnet
```

### Running Locally
```bash
# Start backend server
npm run dev:server

# Start Vite frontend (in separate terminal, or run unified build)
npm run dev

# Or build and run production bundle:
npm run build
npm start
```

Open [http://localhost:8080](http://localhost:8080) to enter Continuum Studio.

---

## License
MIT © 2026 Continuum Studio
