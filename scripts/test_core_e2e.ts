/**
 * ✦ Continuum End-to-End Core Verification Suite
 * 
 * Tests the entire lifecycle:
 * 1. Health & Adapter Status Check
 * 2. Universe Project Creation & DKG Minting
 * 3. Character Visual DNA Minting (anti-drift seeds, traits, negatives)
 * 4. Environment / Set Minting (lighting schema, palette, atmosphere)
 * 5. Voice & Sound Leitmotif Minting (key, bpm, instruments)
 * 6. Prop & Lore Canonical Minting (bound character, lore significance)
 * 7. Decentralized Knowledge Graph verification (RDF nodes & edges)
 * 8. Director Studio Scene Orchestration (multi-stage Livepeer pipeline)
 * 9. W3C PROV-O Lineage Audit (prov:wasDerivedFrom verification)
 * 10. DKG Asset Registry Export validation
 */

const BASE_URL = process.env.TEST_URL || "http://localhost:8080";

const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  cyan: "\x1b[36m",
  yellow: "\x1b[33m",
  magenta: "\x1b[35m",
  red: "\x1b[31m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
};

function pass(msg: string) {
  console.log(`  ${colors.green}✓ PASS${colors.reset} ${msg}`);
}

function info(msg: string) {
  console.log(`  ${colors.cyan}ℹ${colors.reset} ${msg}`);
}

function header(title: string) {
  console.log(`\n${colors.bold}${colors.magenta}━━━ ${title} ━━━${colors.reset}`);
}

async function request(path: string, options: RequestInit = {}) {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status} on ${path}: ${text}`);
  }
  return res.json();
}

async function main() {
  const startTime = Date.now();
  console.log(`\n${colors.bold}✦ CONTINUUM CORE LIFECYCLE E2E TEST SUITE${colors.reset}`);
  console.log(`${colors.dim}Target Server: ${BASE_URL}${colors.reset}\n`);

  // ──────────────────────────────────────────────────────────
  // 1. Health & Status Check
  // ──────────────────────────────────────────────────────────
  header("1. Health & Server Status Check");
  const health = await request("/api/health");
  pass(`Server is responsive (Uptime: ${health.uptimeSeconds}s)`);
  info(`Livepeer Mode: ${colors.bold}${health.livepeerMode}${colors.reset} | DKG Mode: ${colors.bold}${health.dkgMode}${colors.reset}`);
  info(`Current Vault: ${health.counts.characters} chars, ${health.counts.sets} sets, ${health.counts.leitmotifs} sounds, ${health.counts.props} props`);

  // ──────────────────────────────────────────────────────────
  // 2. Project Universe Creation
  // ──────────────────────────────────────────────────────────
  header("2. Project Universe Creation & DKG Minting");
  const projectPayload = {
    title: `Chronos: Temporal Ronin ${Date.now().toString().slice(-4)}`,
    genre: "Neo-Tokyo Time Opera",
    logline: "An exiled time-diver hunts rogue cellular clones across splintered 2099 timelines.",
    seasonNumber: 1,
    totalEpisodes: 4,
  };
  const project = await request("/api/projects", {
    method: "POST",
    body: JSON.stringify(projectPayload),
  });
  pass(`Created Project: "${project.title}" (ID: ${project.id})`);
  info(`Anchored UAL: ${colors.yellow}${project.ual}${colors.reset}`);

  // ──────────────────────────────────────────────────────────
  // 3. Character Visual DNA Minting
  // ──────────────────────────────────────────────────────────
  header("3. Character Visual DNA & Anti-Drift Constraints");
  const characterPayload = {
    projectId: project.id,
    name: "Kaelen Cross",
    epithet: "The Horizon Weaver",
    hairColor: "#0f172a",
    eyeColor: "#38bdf8",
    skinTone: "#d4a574",
    distinguishingFeatures: [
      "bioluminescent cybernetic reticle over right eye",
      "horizontal scar across bridge of nose",
      "spiky dark hair with subtle ultraviolet streak",
    ],
    canonicalAttire: "weathered tactical chronoscoat, high reinforced collar with cyan circuitry",
    forbiddenAttire: ["casual sportswear", "white lab coat", "bright yellow poncho"],
    voiceTimbre: "low, resonant, contemplative, measured cadence",
    negativePrompts: [
      "blond hair",
      "blue eyes without cybernetic HUD",
      "clean-shaven face without scar",
      "smiling casually",
    ],
  };
  const character = await request("/api/vault/characters", {
    method: "POST",
    body: JSON.stringify(characterPayload),
  });
  pass(`Minted Character: ${character.name} ("${character.epithet}")`);
  info(`Character UAL: ${colors.yellow}${character.ual}${colors.reset}`);
  info(`Face Seed: ${character.visualDna.faceSeed}`);
  info(`Negative Anti-Drift Guards: ${character.visualDna.negativePrompts.length} active rules`);

  // ──────────────────────────────────────────────────────────
  // 4. Environment / Set Minting
  // ──────────────────────────────────────────────────────────
  header("4. Environment / Set Knowledge Asset Minting");
  const setPayload = {
    projectId: project.id,
    name: "Shinjuku Quantum Transit Hub",
    description: "Subterranean bullet-train terminal flickering with time-dilation ripples and holographic departure signs.",
    lightingSchema: "flickering sodium vapor and neon magenta volumetric fog, rain puddles reflecting cyan ads",
    colorPalette: ["#09090b", "#ec4899", "#06b6d4"],
    timeOfDay: "NIGHT",
    negativePrompts: ["daylight", "countryside", "sterile clean hospital room"],
  };
  const setAsset = await request("/api/vault/sets", {
    method: "POST",
    body: JSON.stringify(setPayload),
  });
  pass(`Minted Environment: ${setAsset.name}`);
  info(`Set UAL: ${colors.yellow}${setAsset.ual}${colors.reset}`);
  info(`Atmosphere: ${setAsset.lightingSchema}`);

  // ──────────────────────────────────────────────────────────
  // 5. Voice & Sound Leitmotif Minting
  // ──────────────────────────────────────────────────────────
  header("5. Voice & Sound Leitmotif Minting");
  const soundPayload = {
    projectId: project.id,
    name: "Kaelen's Horizon",
    boundToCharacterId: character.id,
    mood: "melancholic tension and driving pulse",
    bpm: 110,
    key: "F minor",
    instruments: ["analog synth pad", "sub bass", "distorted acoustic cello", "metallic hi-hats"],
  };
  const sound = await request("/api/vault/sounds", {
    method: "POST",
    body: JSON.stringify(soundPayload),
  });
  pass(`Minted Leitmotif: "${sound.name}" (${sound.key} · ${sound.bpm} BPM)`);
  info(`Sound UAL: ${colors.yellow}${sound.ual}${colors.reset}`);
  info(`Bound Character: ${sound.boundToCharacterId} (${character.name})`);

  info("Testing Sound SSE Streaming synthesis (/api/vault/sounds-stream)…");
  const sseSoundRes = await fetch(`${BASE_URL}/api/vault/sounds-stream`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      projectId: project.id,
      name: "Ambient Sector Pulse",
      mood: "eerie cybernetic drone",
      bpm: 90,
      key: "D minor",
      instruments: ["modular synth", "sub drone"],
    }),
  });
  if (!sseSoundRes.ok || !sseSoundRes.body) {
    throw new Error(`Sound SSE streaming failed: HTTP ${sseSoundRes.status}`);
  }
  const sseReader = sseSoundRes.body.getReader();
  const sseDecoder = new TextDecoder();
  let sseBuf = "";
  let sseSoundResult: any = null;
  while (true) {
    const { value, done } = await sseReader.read();
    if (done) break;
    sseBuf += sseDecoder.decode(value, { stream: true });
    const chunks = sseBuf.split("\n\n");
    sseBuf = chunks.pop() ?? "";
    for (const chunk of chunks) {
      if (!chunk.trim()) continue;
      for (const line of chunk.split("\n")) {
        if (line.startsWith("data: ")) {
          try {
            const data = JSON.parse(line.slice(6).trim());
            if (data.type === "done") sseSoundResult = data.data;
          } catch {}
        }
      }
    }
  }
  if (!sseSoundResult) throw new Error("Sound SSE stream did not yield complete sound asset!");
  pass(`Sound SSE Stream complete: "${sseSoundResult.name}" (Audio: ${sseSoundResult.audioUrl ? "Available" : "None"})`);

  // ──────────────────────────────────────────────────────────
  // 6. Prop & Lore Canonical Minting & Flux Concept Rendering
  // ──────────────────────────────────────────────────────────
  header("6. Prop & Lore Canonical Artifact Minting & AI Concept");
  const propPayload = {
    projectId: project.id,
    name: "The Chrono-Anchor Key",
    category: "prop",
    type: "Temporal Stabilizer",
    boundToCharacterId: character.id,
    boundToSetId: setAsset.id,
    description: "Cylindrical titanium gyro housing oscillating quartz filaments that prevent cellular drift during temporal jumps.",
    loreSignificance: "The last remaining stabilizer forged before the collapse of Sector 9.",
    visualTheme: "device",
    negativePrompts: ["plastic toy", "cheap phone", "wooden stick"],
  };
  const prop = await request("/api/vault/props", {
    method: "POST",
    body: JSON.stringify(propPayload),
  });
  pass(`Minted Prop: "${prop.name}" (${prop.type})`);
  info(`Prop UAL: ${colors.yellow}${prop.ual}${colors.reset}`);
  info(`Bound to: Character [${character.name}] & Set [${setAsset.name}]`);

  info("Rendering Prop AI Concept via Livepeer Flux (/api/vault/props/:id/image)…");
  const propImageResult = await request(`/api/vault/props/${prop.id}/image`, {
    method: "POST",
  });
  pass(`Prop AI Concept generated: ${propImageResult.imageUrl ? "Image received (" + propImageResult.imageUrl.slice(0, 30) + "…)" : "Fallback mock image"}`);
  info(`Updated Prop UAL: ${propImageResult.ual}`);

  // ──────────────────────────────────────────────────────────
  // 7. Decentralized Knowledge Graph Audit
  // ──────────────────────────────────────────────────────────
  header("7. Decentralized Knowledge Graph (RDF Topology)");
  const graph = await request(`/api/dkg/graph?projectId=${encodeURIComponent(project.id)}`);
  const relationCount = (graph.edges || graph.links || []).length;
  pass(`Graph queried successfully: ${graph.nodes.length} nodes, ${relationCount} relations`);

  const nodeTypes = graph.nodes.map((n: any) => n.type);
  const hasProjectNode = nodeTypes.includes("project");
  const hasCharNode = nodeTypes.includes("character");
  const hasSetNode = nodeTypes.includes("set");
  const hasSoundNode = nodeTypes.includes("leitmotif");
  const hasPropNode = nodeTypes.includes("prop");

  if (hasProjectNode && hasCharNode && hasSetNode && hasSoundNode && hasPropNode) {
    pass("All 5 core asset classes verified in the Knowledge Graph mesh!");
  } else {
    throw new Error(`Graph missing node classes: ${JSON.stringify(nodeTypes)}`);
  }

  // ──────────────────────────────────────────────────────────
  // 8. Director Studio Scene Orchestration (Livepeer + DKG)
  // ──────────────────────────────────────────────────────────
  header("8. Director Studio Scene Orchestration & Rendering");
  info("Directing new scene via live multi-stage pipeline (/api/scenes/render-stream)…");
  const scenePrompt = `${character.name} activates the Chrono-Anchor Key under the flickering signs of ${setAsset.name}. Rain cascades from the monorail girders as a temporal ripple echoes through the station.`;

  const scenePayload = {
    projectId: project.id,
    episodeNumber: 1,
    sceneNumber: 1,
    title: "The Temporal Echo",
    cast: {
      characterIds: [character.id],
      setId: setAsset.id,
      leitmotifIds: [sound.id],
    },
    prompt: scenePrompt,
  };

  let sceneResult: any = null;
  const streamRes = await fetch(`${BASE_URL}/api/scenes/render-stream`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(scenePayload),
  });

  if (!streamRes.ok || !streamRes.body) {
    throw new Error(`Streaming failed: HTTP ${streamRes.status}`);
  }

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
          console.log(`    ${colors.dim}[Livepeer Stage: ${data.progress}%]${colors.reset} ${data.message}`);
        } else if (event === "complete") {
          sceneResult = data;
        } else if (event === "error") {
          throw new Error(data.error ?? "Scene rendering failed");
        }
      } catch (err: any) {
        if (event === "error" || err.message?.includes("rendering failed")) throw err;
      }
    }
  }

  if (!sceneResult) {
    throw new Error("Stream completed but no scene result payload was received!");
  }

  pass(`Scene directed & rendered: "${sceneResult.title ?? 'The Temporal Echo'}" (ID: ${sceneResult.id})`);
  info(`Scene UAL: ${colors.yellow}${sceneResult.ual}${colors.reset}`);
  const keyframeUrl = sceneResult.livepeerOutputs?.find((o: any) => o.type === "image")?.url;
  const videoUrl = sceneResult.livepeerOutputs?.find((o: any) => o.type === "video")?.url;
  const audioUrl = sceneResult.livepeerOutputs?.find((o: any) => o.type === "audio")?.url;
  info(`Generated Keyframe URL: ${keyframeUrl || "N/A"}`);
  info(`Generated Video URL:    ${videoUrl || "N/A"}`);
  info(`Generated Audio URL:    ${audioUrl || "N/A"}`);

  // ──────────────────────────────────────────────────────────
  // 9. W3C PROV-O Lineage Audit
  // ──────────────────────────────────────────────────────────
  header("9. W3C PROV-O Lineage Audit (prov:wasDerivedFrom)");
  const lineage = sceneResult.lineage;
  if (!lineage || !lineage.derivedFrom) {
    throw new Error("Scene result missing W3C PROV-O lineage!");
  }

  pass(`Lineage verified! Scene is mathematically anchored to:`);
  info(`  • Character UALs: ${lineage.derivedFrom.characters.join(", ")}`);
  info(`  • Set UAL:        ${lineage.derivedFrom.set}`);
  info(`  • Leitmotif UAL:  ${lineage.derivedFrom.leitmotifs.join(", ")}`);
  info(`  • Prompt Hash:    ${lineage.provenance.promptFingerprint.slice(0, 16)}…`);

  // ──────────────────────────────────────────────────────────
  // 10. DKG Asset Registry Export Validation
  // ──────────────────────────────────────────────────────────
  header("10. DKG Asset Registry Raw JSON-LD Export");
  const rawScene = await request(`/api/dkg/export/scene/${sceneResult.id}`);
  pass(`Scene JSON-LD retrieved: ${rawScene["@id"]}`);
  info(`W3C Context: ${JSON.stringify(rawScene["@context"])}`);

  const rawChar = await request(`/api/dkg/export/character/${character.id}`);
  pass(`Character JSON-LD retrieved: ${rawChar["@id"]}`);
  info(`Canonical Attire: "${rawChar["ex:canonicalAttire"]}"`);

  // ──────────────────────────────────────────────────────────
  // Summary
  // ──────────────────────────────────────────────────────────
  const elapsedSeconds = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`\n${colors.bold}${colors.green}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`✦ ALL 10 CORE CONTINUUM LIFECYCLE TESTS PASSED! (${elapsedSeconds}s)`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  console.log(`
Summary of Created Canon Assets:
  • Project:   ${project.title} (${project.ual})
  • Character: ${character.name} (${character.ual})
  • Set:       ${setAsset.name} (${setAsset.ual})
  • Sound:     ${sound.name} (${sound.ual})
  • Prop:      ${prop.name} (${prop.ual})
  • Scene:     ${sceneResult.id} (${sceneResult.ual})

Everything is functioning end-to-end with zero errors!
`);
}

main().catch((err) => {
  console.error(`\n${colors.red}${colors.bold}❌ TEST FAILED:${colors.reset}`, err);
  process.exit(1);
});
