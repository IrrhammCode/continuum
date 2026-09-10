/* ─── Continuum — Express API Server ─── */

import express from "express";
import crypto from "node:crypto";
import path from "node:path";
import fs from "node:fs";
import { FileStore } from "./storage.js";
import { createLivepeerAdapter } from "./adapters/livepeer.js";
import {
  DkgEngine,
  buildGraphData,
  characterToJsonLd,
  leitmotifToJsonLd,
  setToJsonLd,
  propToJsonLd,
  projectToJsonLd,
  sceneToJsonLd,
} from "./adapters/dkg.js";
import { Director } from "./director.js";
import { CHARACTERS, LEITMOTIFS, SETS } from "../shared/seed.js";
import type { CharacterAsset, LeitmotifAsset, SetAsset, PropAsset, Project, SceneRequest, SceneResult } from "../shared/types.js";

const PORT = Number(process.env.PORT ?? 8080);

// ── Bootstrap ──
const store = new FileStore();
const livepeer = createLivepeerAdapter();
const dkg = new DkgEngine(store);

// Mutable state — deep clone seed data so UALs can be attached
const characters: CharacterAsset[] = structuredClone(CHARACTERS);
const leitmotifs: LeitmotifAsset[] = structuredClone(LEITMOTIFS);
const sets: SetAsset[] = structuredClone(SETS);
const projects: Project[] = [
  {
    id: "proj-ronin-echoes",
    title: "Cyberpunk: Ronin Echoes",
    genre: "Cyberpunk Noir",
    logline: "In the rain-drenched alleys of Neo-Tokyo, an ex-ronin and a rogue hacker uncover an encrypted signal in the city's memory grid.",
    seasonNumber: 1,
    totalEpisodes: 3,
    createdAt: "2026-09-10T04:00:00Z",
    ual: "did:dkg:continuum/project/ronin-echoes",
  },
  {
    id: "proj-solaris-drift",
    title: "Solaris: Drift Protocol",
    genre: "Hard Sci-Fi Space Opera",
    logline: "At the outer orbit of Kepler-452b, an automated derelict station broadcasts distress coordinates from a crew that vanished forty cycles ago.",
    seasonNumber: 1,
    totalEpisodes: 4,
    createdAt: "2026-09-10T04:00:00Z",
    ual: "did:dkg:continuum/project/solaris-drift",
  },
];
const props: PropAsset[] = [
  {
    id: "prop-ronin-transmitter",
    projectId: "proj-ronin-echoes",
    name: "The Broken Transmitter",
    category: "prop",
    type: "Communications Relic",
    boundToCharacterId: "yuki",
    description: "Handheld military transceiver with cracked glass casing, exposed emerald wiring, and a pulsing sub-carrier crystal.",
    loreSignificance: "Recovered by Yuki Tanabe after the 2088 blackout. Emits an encrypted handshake loop that matches Ren's old squad frequency.",
    negativePrompts: ["smartphone", "modern plastic", "clean glass", "touchscreen"],
    visualTheme: "transmitter",
    createdAt: "2026-09-10T04:00:00Z",
    ual: "did:dkg:continuum/prop/17a9e01f",
  },
  {
    id: "prop-ronin-blade",
    projectId: "proj-ronin-echoes",
    name: "Kensai Katana",
    category: "prop",
    type: "High-Frequency Weapon",
    boundToCharacterId: "ren",
    description: "Curved monomolecular blade forged with blackened tungsten alloy. Microscopic green circuit traces run down the spine, humming at high frequency.",
    loreSignificance: "Inherited heirloom from Ren's decommissioned security unit. The blade capacitor is locked to his biometric palm signature.",
    negativePrompts: ["fantasy sword", "golden ornamental handle", "curved scimitar", "medieval guard"],
    visualTheme: "blade",
    createdAt: "2026-09-10T04:00:00Z",
    ual: "did:dkg:continuum/prop/28b7f13c",
  },
  {
    id: "prop-ronin-cell",
    projectId: "proj-ronin-echoes",
    name: "Memory Cartridge / 09",
    category: "prop",
    type: "Forensic Data Capsule",
    description: "Cylindrical borosilicate glass vial housing quantum optical filaments. Glows faint violet when exposed to localized electromagnetic fields.",
    loreSignificance: "The central evidence driving Season 01. Contains raw neuro-traces salvaged from the rain district mainframe.",
    negativePrompts: ["usb stick", "floppy disk", "plastic thumb drive", "metal screw"],
    visualTheme: "cell",
    createdAt: "2026-09-10T04:00:00Z",
    ual: "did:dkg:continuum/prop/39c6e48b",
  },
  {
    id: "lore-ronin-blackout",
    projectId: "proj-ronin-echoes",
    name: "The 2088 Grid Blackout",
    category: "lore",
    type: "Historical Anomaly & Canon Law",
    description: "A synchronized EMP cascade that erased seventy petabytes of corporate citizenship ledgers across Sector 4.",
    loreSignificance: "The catalyst event of Ronin Echoes. Anyone who lost their records became stateless 'ghosts', forcing Ren into exile.",
    negativePrompts: [],
    visualTheme: "holocron",
    createdAt: "2026-09-10T04:00:00Z",
    ual: "did:dkg:continuum/lore/40d5a71e",
  },
  {
    id: "prop-solaris-visor",
    projectId: "proj-solaris-drift",
    name: "Aethelgard Telemetry Visor",
    category: "prop",
    type: "Diagnostic Cyberware",
    boundToCharacterId: "vance",
    description: "Curved gold-tinted polycarbonate visor equipped with dual LIDAR sensors and real-time biometric heads-up overlay.",
    loreSignificance: "Worn by Dr. Vance during deep-space EVAs. Its local buffer is the only device that preserved the original transmission timestamp.",
    negativePrompts: ["sunglasses", "aviators", "steampunk goggles"],
    visualTheme: "device",
    createdAt: "2026-09-10T04:00:00Z",
    ual: "did:dkg:continuum/prop/51e4b92a",
  },
  {
    id: "prop-solaris-beacon",
    projectId: "proj-solaris-drift",
    name: "Solaris Relay Beacon",
    category: "prop",
    type: "Deep-Space Transmitter",
    description: "Spherical satellite node with solar collector fins, broadcasting intermittent directional pulses on 1420 MHz.",
    loreSignificance: "The origin of the ghost distress signal. Telemetry indicates it has been broadcasting without fuel for forty orbital cycles.",
    negativePrompts: ["radio tower", "satellite dish on tripod"],
    visualTheme: "transmitter",
    createdAt: "2026-09-10T04:00:00Z",
    ual: "did:dkg:continuum/prop/62f3c03b",
  },
  {
    id: "lore-solaris-forty",
    projectId: "proj-solaris-drift",
    name: "The Forty-Cycle Paradox",
    category: "lore",
    type: "Temporal Law / Relativistic Anomaly",
    description: "A gravitational field distortion around Kepler-452b causing quantum signal echoes to arrive before they are emitted.",
    loreSignificance: "The philosophical core of Solaris Drift: Is Dr. Vance searching for survivors, or warning his past self?",
    negativePrompts: [],
    visualTheme: "holocron",
    createdAt: "2026-09-10T04:00:00Z",
    ual: "did:dkg:continuum/lore/73a2d14c",
  },
];
const scenes: SceneResult[] = [];

// Load persisted scenes from disk
try {
  const scenesDir = path.resolve("data/scenes");
  if (fs.existsSync(scenesDir)) {
    const files = fs.readdirSync(scenesDir).filter((f) => f.endsWith(".jsonld"));
    for (const f of files) {
      try {
        const raw = JSON.parse(fs.readFileSync(path.join(scenesDir, f), "utf-8"));
        const sceneId = f.replace(".jsonld", "");
        const rawOutputs = raw["ex:livepeerOutputs"] ?? [];
        const outputs = rawOutputs.map((o: any) => ({
          type: o["ex:mediaType"],
          url: o["ex:url"],
          capability: o["ex:capability"],
          costUsd: o["ex:costUsd"] ?? 0,
          elapsedMs: 5000,
        }));

        scenes.push({
          id: sceneId,
          projectId: raw["ex:projectId"] ?? "proj-ronin-echoes",
          ual: raw["@id"] ?? `did:dkg:continuum/scene/${sceneId}`,
          composedPrompt: raw["ex:composedPrompt"] ?? "",
          createdAt: raw["prov:generatedAtTime"] ?? new Date().toISOString(),
          request: {
            projectId: raw["ex:projectId"] ?? "proj-ronin-echoes",
            episodeNumber: 1,
            sceneNumber: scenes.length + 1,
            prompt: raw["ex:userPrompt"] ?? "Cinematic scene direction",
            cast: { characterIds: [], setId: "", leitmotifIds: [] },
          },
          dkgConstraints: {
            characterTraitsInjected: raw["ex:constraintsInjected"]?.["characterTraitsInjected"] ?? {},
            negativePromptsInjected: raw["ex:constraintsInjected"]?.["negativePromptsInjected"] ?? [],
            leitmotifsBound: raw["ex:constraintsInjected"]?.["leitmotifsBound"] ?? [],
            setConstraintsApplied: raw["ex:constraintsInjected"]?.["setConstraintsApplied"] ?? [],
          },
          livepeerOutputs: outputs,
          lineage: {
            derivedFrom: {
              characters: raw["prov:wasDerivedFrom"]?.filter((u: string) => u.includes("character")) ?? [],
              leitmotifs: raw["prov:wasDerivedFrom"]?.filter((u: string) => u.includes("leitmotif")) ?? [],
              set: raw["prov:wasDerivedFrom"]?.find((u: string) => u.includes("set")) ?? "",
            },
            provenance: {
              generatedAt: raw["prov:generatedAtTime"] ?? new Date().toISOString(),
              livepeerCapabilities: outputs.map((o: any) => o.capability),
              promptFingerprint: raw["ex:promptFingerprint"] ?? "",
            },
          },
        });
      } catch {}
    }
    console.log(`[Scenes] Loaded ${scenes.length} persisted scenes from disk`);
  }
} catch (err) {
  console.warn("[Scenes] Failed loading disk scenes:", (err as Error).message);
}

const director = new Director(livepeer, dkg, characters, leitmotifs, sets);

// Persist seed vault & projects to DKG on startup
await dkg.persistVault(characters, leitmotifs, sets);
for (const p of projects) {
  await dkg.mintProjectKa(p);
}
for (const prop of props) {
  await dkg.mintPropKa(prop);
}
console.log("[DKG] Vault, Projects & Props persisted — anchored with deterministic UALs");

// ── Express App ──
const app = express();
app.use(express.json());

// Serve Vite build in production
const clientDir = path.resolve("dist/client");
app.use(express.static(clientDir));

// ── System Health & Status ──
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    livepeerMode: process.env.LIVEPEER_MODE ?? "mock",
    livepeerEndpoint: process.env.LIVEPEER_ENDPOINT ?? "https://agent.livepeer.org/api/mcp/creative",
    dkgMode: process.env.DKG_MODE ?? "file",
    counts: {
      characters: characters.length,
      leitmotifs: leitmotifs.length,
      sets: sets.length,
      props: props.length,
      scenes: scenes.length,
    },
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

// ── Project Management Endpoints ──

app.get("/api/projects", (_req, res) => {
  res.json(projects);
});

app.post("/api/projects", async (req, res) => {
  try {
    const body = req.body;
    if (!body.title || !body.genre) {
      res.status(400).json({ error: "Missing required fields: title, genre" });
      return;
    }

    const id = `proj-${crypto.randomBytes(4).toString("hex")}`;
    const newProj: Project = {
      id,
      title: body.title,
      genre: body.genre,
      logline: body.logline ?? "A new cinematic episodic story.",
      seasonNumber: Number(body.seasonNumber) || 1,
      totalEpisodes: Number(body.totalEpisodes) || 3,
      createdAt: new Date().toISOString(),
    };

    const ual = await dkg.mintProjectKa(newProj);
    projects.push(newProj);

    console.log(`[DKG] Project minted: ${newProj.title} → ${ual}`);
    res.status(201).json(newProj);
  } catch (err) {
    console.error("[Projects] Mint error:", err);
    res.status(500).json({ error: (err as Error).message });
  }
});

app.get("/api/projects/:id/story-bible", (req, res) => {
  const { id } = req.params;
  const proj = projects.find((p) => p.id === id);
  if (!proj) {
    res.status(404).json({ error: "Project not found" });
    return;
  }
  const projChars = characters.filter((c) => (c.projectId ?? "proj-ronin-echoes") === id);
  const projSets = sets.filter((s) => (s.projectId ?? "proj-ronin-echoes") === id);
  const projSounds = leitmotifs.filter((l) => (l.projectId ?? "proj-ronin-echoes") === id);
  const projProps = props.filter((pr) => (pr.projectId ?? "proj-ronin-echoes") === id);
  const projScenes = scenes.filter((sc) => (sc.projectId ?? sc.request?.projectId ?? "proj-ronin-echoes") === id);

  res.setHeader("Content-Disposition", `attachment; filename="${id}-story-bible.json"`);
  res.json({
    project: proj,
    paranetUal: proj.ual ?? `did:dkg:continuum/project/${proj.id}`,
    exportedAt: new Date().toISOString(),
    bibleVersion: "1.0.0",
    summary: {
      charactersCount: projChars.length,
      setsCount: projSets.length,
      leitmotifsCount: projSounds.length,
      propsCount: projProps.length,
      scenesCount: projScenes.length,
    },
    characters: projChars,
    sets: projSets,
    leitmotifs: projSounds,
    props: projProps,
    scenes: projScenes,
  });
});

// ── Vault Read Endpoints ──

app.get("/api/vault", (_req, res) => {
  res.json({ characters, leitmotifs, sets, props });
});

app.get("/api/vault/characters", (req, res) => {
  const projectId = req.query.projectId as string | undefined;
  if (projectId) {
    res.json(characters.filter((c) => !c.projectId || c.projectId === projectId));
  } else {
    res.json(characters);
  }
});

app.get("/api/vault/sounds", (req, res) => {
  const projectId = req.query.projectId as string | undefined;
  if (projectId) {
    res.json(leitmotifs.filter((l) => !l.projectId || l.projectId === projectId));
  } else {
    res.json(leitmotifs);
  }
});

app.get("/api/vault/sets", (req, res) => {
  const projectId = req.query.projectId as string | undefined;
  if (projectId) {
    res.json(sets.filter((s) => !s.projectId || s.projectId === projectId));
  } else {
    res.json(sets);
  }
});

app.get("/api/vault/props", (req, res) => {
  const projectId = req.query.projectId as string | undefined;
  if (projectId) {
    res.json(props.filter((p) => !p.projectId || p.projectId === projectId));
  } else {
    res.json(props);
  }
});

// ── Vault Mutation Endpoints ──

app.post("/api/vault/characters", async (req, res) => {
  try {
    const body = req.body;
    if (!body.name || !body.epithet) {
      res.status(400).json({ error: "Missing required fields: name, epithet" });
      return;
    }

    const id = `char-${crypto.randomBytes(4).toString("hex")}`;
    const newChar: CharacterAsset = {
      id,
      projectId: body.projectId ?? "proj-ronin-echoes",
      name: body.name,
      epithet: body.epithet,
      visualDna: {
        faceSeed: body.faceSeed ?? `CNT-${body.name.replace(/\s/g, "-").toUpperCase()}-${crypto.randomBytes(2).toString("hex")}`,
        hairColor: body.hairColor ?? "#1a1a2e",
        eyeColor: body.eyeColor ?? "#00ff88",
        skinTone: body.skinTone ?? "#d4a574",
        distinguishingFeatures: body.distinguishingFeatures ?? [],
        attire: {
          canonical: body.canonicalAttire ?? "Default attire",
          colorPalette: body.colorPalette ?? ["#1a1a2e", "#00ff88"],
          forbidden: body.forbiddenAttire ?? [],
        },
        negativePrompts: body.negativePrompts ?? [],
      },
      voiceProfile: body.voiceTimbre ? { timbreDescription: body.voiceTimbre } : undefined,
      createdAt: new Date().toISOString(),
    };

    const ual = await dkg.mintCharacterKa(newChar);
    characters.push(newChar);

    console.log(`[DKG] Character minted: ${newChar.name} → ${ual}`);
    res.status(201).json(newChar);
  } catch (err) {
    console.error("[Vault] Character mint error:", err);
    res.status(500).json({ error: (err as Error).message });
  }
});

app.post("/api/vault/characters/:id/avatar", async (req, res) => {
  try {
    const char = characters.find((c) => c.id === req.params.id);
    if (!char) {
      res.status(404).json({ error: "Character not found" });
      return;
    }

    const visualTraits = dkg.queryCharacterConstraints(char).join(", ");
    const negativeTraits = dkg.queryNegativeConstraints(char).join(", ");
    const prompt = `Close-up cinematic character portrait of ${char.name}, "${char.epithet}". Visual traits: ${visualTraits}. Hair ${char.visualDna.hairColor}, glowing eyes ${char.visualDna.eyeColor}. Photorealistic, 8k resolution, dramatic neon rim lighting, cinematic depth of field. --no ${negativeTraits || "blurry, low quality"}`;

    console.log(`[Livepeer] Generating portrait for ${char.name}…`);
    const output = await livepeer.generate({
      action: "generate",
      prompt,
    });

    char.avatarUrl = output.url;
    await dkg.mintCharacterKa(char);

    console.log(`[Livepeer] Portrait generated for ${char.name}: ${output.url}`);
    res.json({ avatarUrl: output.url, character: char });
  } catch (err) {
    console.error("[Vault] Avatar generation error:", err);
    res.status(500).json({ error: (err as Error).message });
  }
});

app.post("/api/vault/sets", async (req, res) => {
  try {
    const body = req.body;
    if (!body.name) {
      res.status(400).json({ error: "Missing required field: name" });
      return;
    }

    const id = `set-${crypto.randomBytes(4).toString("hex")}`;
    const newSet: SetAsset = {
      id,
      projectId: body.projectId ?? "proj-ronin-echoes",
      name: body.name,
      description: body.description ?? "",
      colorPalette: body.colorPalette ?? ["#0A0A1A", "#7C3AED"],
      lightingSchema: body.lightingSchema ?? "Default lighting",
      timeOfDay: body.timeOfDay ?? "NIGHT",
      negativePrompts: body.negativePrompts ?? [],
      createdAt: new Date().toISOString(),
    };

    const ual = await dkg.mintSetKa(newSet);
    sets.push(newSet);

    console.log(`[DKG] Set minted: ${newSet.name} → ${ual}`);
    res.status(201).json(newSet);
  } catch (err) {
    console.error("[Vault] Set mint error:", err);
    res.status(500).json({ error: (err as Error).message });
  }
});

app.post("/api/vault/sets/:id/image", async (req, res) => {
  try {
    const s = sets.find((item) => item.id === req.params.id);
    if (!s) {
      res.status(404).json({ error: "Set not found" });
      return;
    }

    const setTraits = dkg.querySetConstraints(s).join(". ");
    const negativeTraits = dkg.querySetNegatives(s).join(", ");
    const prompt = `Wide-angle cinematic concept art of setting: ${s.name}. ${s.description}. Atmosphere and lighting: ${setTraits}. Ultra detailed, master shot, cinematic composition, Unreal Engine 5 render style. --no ${negativeTraits || "blurry, low quality"}`;

    console.log(`[Livepeer] Generating concept art for set: ${s.name}…`);
    const output = await livepeer.generate({
      action: "generate",
      prompt,
    });

    s.imageUrl = output.url;
    await dkg.mintSetKa(s);

    console.log(`[Livepeer] Concept art generated for set ${s.name}: ${output.url}`);
    res.json({ imageUrl: output.url, set: s });
  } catch (err) {
    console.error("[Vault] Set image generation error:", err);
    res.status(500).json({ error: (err as Error).message });
  }
});

app.post("/api/vault/sounds", async (req, res) => {
  try {
    const body = req.body;
    if (!body.name) {
      res.status(400).json({ error: "Missing required field: name" });
      return;
    }

    const id = `leit-${crypto.randomBytes(4).toString("hex")}`;
    const newLeit: LeitmotifAsset = {
      id,
      projectId: body.projectId ?? "proj-ronin-echoes",
      name: body.name,
      boundToCharacterId: body.boundToCharacterId,
      mood: body.mood ?? "intense",
      bpm: body.bpm ?? 120,
      key: body.key ?? "D minor",
      instruments: body.instruments ?? ["synth pad", "electric bass"],
      createdAt: new Date().toISOString(),
    };

    // Generate audio with Livepeer if in real mode
    try {
      const musicPrompt = dkg.queryLeitmotifPrompt(newLeit);
      console.log(`[Livepeer] Generating audio for leitmotif: "${newLeit.name}"…`);
      const audioOutput = await livepeer.generate({
        action: "music",
        prompt: musicPrompt,
        duration: body.duration ?? 10,
      });
      newLeit.audioUrl = audioOutput.url;
      console.log(`[Livepeer] Audio generated: ${audioOutput.url} ($${audioOutput.costUsd})`);
    } catch (err) {
      console.warn("[Livepeer] Audio generation skipped:", (err as Error).message);
    }

    const ual = await dkg.mintLeitmotifKa(newLeit);
    leitmotifs.push(newLeit);

    console.log(`[DKG] Leitmotif minted: ${newLeit.name} → ${ual}`);
    res.status(201).json(newLeit);
  } catch (err) {
    console.error("[Vault] Leitmotif mint error:", err);
    res.status(500).json({ error: (err as Error).message });
  }
});

app.post("/api/vault/props", async (req, res) => {
  try {
    const body = req.body;
    if (!body.name) {
      res.status(400).json({ error: "Missing required field: name" });
      return;
    }

    const id = `prop-${crypto.randomBytes(4).toString("hex")}`;
    const newProp: PropAsset = {
      id,
      projectId: body.projectId ?? "proj-ronin-echoes",
      name: body.name,
      category: body.category === "lore" ? "lore" : "prop",
      type: body.type ?? "Cinematic Prop",
      boundToCharacterId: body.boundToCharacterId || undefined,
      boundToSetId: body.boundToSetId || undefined,
      description: body.description ?? "",
      loreSignificance: body.loreSignificance ?? "",
      negativePrompts: Array.isArray(body.negativePrompts)
        ? body.negativePrompts
        : typeof body.negativePrompts === "string" && body.negativePrompts.trim()
        ? body.negativePrompts.split(",").map((s: string) => s.trim()).filter(Boolean)
        : [],
      visualTheme: body.visualTheme ?? "blade",
      createdAt: new Date().toISOString(),
    };

    const ual = await dkg.mintPropKa(newProp);
    props.push(newProp);

    console.log(`[DKG] Prop KA minted: "${newProp.name}" (${newProp.category}) → ${ual}`);
    res.status(201).json(newProp);
  } catch (err) {
    console.error("[Vault] Prop mint error:", err);
    res.status(500).json({ error: (err as Error).message });
  }
});

// ── Scene Rendering ──

app.post("/api/scenes/render", async (req, res) => {
  try {
    const body = req.body as SceneRequest;

    if (!body.prompt || !body.cast) {
      res.status(400).json({ error: "Missing prompt or cast" });
      return;
    }

    console.log(`[Director] Rendering scene: "${body.prompt}"`);

    const result = await director.directScene(body, (progress) => {
      console.log(`  [${progress.phase}] ${progress.message} (${progress.progress}%)`);
    });

    result.projectId = body.projectId ?? "proj-ronin-echoes";
    scenes.push(result);
    res.json(result);
  } catch (err) {
    console.error("[Director] Error:", err);
    res.status(500).json({ error: (err as Error).message });
  }
});

app.post("/api/scenes/render-stream", async (req, res) => {
  const body = req.body as SceneRequest;
  if (!body.prompt || !body.cast) {
    res.status(400).json({ error: "Missing prompt or cast" });
    return;
  }

  // Set up Server-Sent Events headers
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
  });

  const sendEvent = (event: string, data: unknown) => {
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  };

  try {
    console.log(`[Director:Stream] Rendering scene: "${body.prompt}"`);
    const result = await director.directScene(body, (progress) => {
      console.log(`  [Stream: ${progress.phase}] ${progress.message} (${progress.progress}%)`);
      sendEvent("progress", progress);
    });

    result.projectId = body.projectId ?? "proj-ronin-echoes";
    scenes.push(result);
    sendEvent("complete", result);
    res.end();
  } catch (err) {
    console.error("[Director:Stream] Error:", err);
    sendEvent("error", { error: (err as Error).message });
    res.end();
  }
});

app.get("/api/scenes", (req, res) => {
  const { projectId } = req.query;
  if (projectId) {
    res.json(scenes.filter((s) => (s.projectId ?? "proj-ronin-echoes") === projectId));
  } else {
    res.json(scenes);
  }
});

// ── DKG Graph & Export ──

app.get("/api/dkg/graph", (req, res) => {
  const { projectId } = req.query;
  const graph = buildGraphData(
    projects,
    characters,
    leitmotifs,
    sets,
    props,
    scenes,
    typeof projectId === "string" ? projectId : undefined
  );
  res.json(graph);
});

app.get("/api/dkg/export/:type/:id", async (req, res) => {
  const { type, id } = req.params;
  const filePath =
    type === "scene"
      ? `scenes/${id}.jsonld`
      : type === "project"
      ? `projects/${id}.jsonld`
      : type === "lore" || type === "prop"
      ? `vault/props/${id}.jsonld`
      : `vault/${type}s/${id}.jsonld`;

  const data = await store.readJson(filePath);
  if (data) {
    res.json(data);
    return;
  }

  // Dynamic fallback from active state
  if (type === "character") {
    const c = characters.find((x) => x.id === id);
    if (c) {
      res.json(characterToJsonLd(c));
      return;
    }
  } else if (type === "leitmotif" || type === "sound") {
    const l = leitmotifs.find((x) => x.id === id);
    if (l) {
      res.json(leitmotifToJsonLd(l));
      return;
    }
  } else if (type === "set") {
    const s = sets.find((x) => x.id === id);
    if (s) {
      res.json(setToJsonLd(s));
      return;
    }
  } else if (type === "prop" || type === "lore") {
    const p = props.find((x) => x.id === id);
    if (p) {
      res.json(propToJsonLd(p));
      return;
    }
  } else if (type === "project") {
    const proj = projects.find((x) => x.id === id);
    if (proj) {
      res.json(projectToJsonLd(proj));
      return;
    }
  } else if (type === "scene") {
    const sc = scenes.find((x) => x.id === id);
    if (sc) {
      res.json(sceneToJsonLd(sc));
      return;
    }
  }

  res.status(404).json({ error: "Knowledge Asset not found" });
});

// ── SPA Fallback (Express 5 requires named wildcard) ──
app.get("/{*path}", (_req, res) => {
  res.sendFile(path.join(clientDir, "index.html"));
});

// ── Start ──
app.listen(PORT, () => {
  console.log(`\n✦ Continuum Studio running → http://localhost:${PORT}\n`);
  console.log(`  Livepeer: ${process.env.LIVEPEER_MODE ?? "mock"} mode`);
  console.log(`  DKG:      ${process.env.DKG_MODE ?? "file"} mode`);
  console.log(`  Vault:    ${characters.length} characters, ${leitmotifs.length} leitmotifs, ${sets.length} sets\n`);
});
