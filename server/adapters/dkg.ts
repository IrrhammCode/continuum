/* ─── Continuum — DKG Knowledge Engine Adapter ─── */

import crypto from "node:crypto";
import { FileStore } from "../storage.js";
import type {
  CharacterAsset,
  LeitmotifAsset,
  SetAsset,
  PropAsset,
  SceneResult,
  Project,
  GraphData,
  GraphNode,
  GraphEdge,
} from "../../shared/types.js";

const BASE_IRI = "https://continuum.studio/kg/";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// UAL Generator (deterministic hash-based identifiers)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function mintUal(type: string, id: string): string {
  const hash = crypto.createHash("sha256").update(`${type}:${id}`).digest("hex").slice(0, 16);
  return `did:dkg:continuum/${type}/${hash}`;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// JSON-LD Document Builders
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function characterToJsonLd(c: CharacterAsset) {
  return {
    "@context": {
      schema: "https://schema.org/",
      ex: BASE_IRI,
      prov: "http://www.w3.org/ns/prov#",
    },
    "@id": c.ual ?? mintUal("character", c.id),
    "@type": ["schema:Person", "ex:FictionalCharacter"],
    "schema:name": c.name,
    "ex:projectId": c.projectId ?? "proj-ronin-echoes",
    "ex:epithet": c.epithet,
    "ex:faceSeed": c.visualDna.faceSeed,
    "ex:hairColor": c.visualDna.hairColor,
    "ex:eyeColor": c.visualDna.eyeColor,
    "ex:skinTone": c.visualDna.skinTone,
    "ex:distinguishingFeatures": c.visualDna.distinguishingFeatures,
    "ex:canonicalAttire": c.visualDna.attire.canonical,
    "ex:attireColorPalette": c.visualDna.attire.colorPalette,
    "ex:forbiddenAttire": c.visualDna.attire.forbidden,
    "ex:negativePrompts": c.visualDna.negativePrompts,
    "ex:voiceTimbre": c.voiceProfile?.timbreDescription,
    "schema:image": c.avatarUrl ?? null,
    "prov:generatedAtTime": c.createdAt,
  };
}

function leitmotifToJsonLd(l: LeitmotifAsset) {
  return {
    "@context": {
      schema: "https://schema.org/",
      ex: BASE_IRI,
      prov: "http://www.w3.org/ns/prov#",
    },
    "@id": l.ual ?? mintUal("leitmotif", l.id),
    "@type": ["schema:MusicComposition", "ex:Leitmotif"],
    "schema:name": l.name,
    "ex:projectId": l.projectId ?? "proj-ronin-echoes",
    "ex:boundToCharacter": l.boundToCharacterId
      ? mintUal("character", l.boundToCharacterId)
      : null,
    "ex:mood": l.mood,
    "ex:bpm": l.bpm,
    "ex:musicalKey": l.key,
    "ex:instruments": l.instruments,
    "ex:audioUrl": l.audioUrl ?? null,
    "prov:generatedAtTime": l.createdAt,
  };
}

function setToJsonLd(s: SetAsset) {
  return {
    "@context": {
      schema: "https://schema.org/",
      ex: BASE_IRI,
      prov: "http://www.w3.org/ns/prov#",
    },
    "@id": s.ual ?? mintUal("set", s.id),
    "@type": ["schema:Place", "ex:CinematicSet"],
    "schema:name": s.name,
    "ex:projectId": s.projectId ?? "proj-ronin-echoes",
    "schema:description": s.description,
    "ex:colorPalette": s.colorPalette,
    "ex:lightingSchema": s.lightingSchema,
    "ex:timeOfDay": s.timeOfDay,
    "ex:negativePrompts": s.negativePrompts,
    "schema:image": s.imageUrl ?? null,
    "prov:generatedAtTime": s.createdAt,
  };
}

function propToJsonLd(p: PropAsset) {
  return {
    "@context": {
      schema: "https://schema.org/",
      ex: BASE_IRI,
      prov: "http://www.w3.org/ns/prov#",
    },
    "@id": p.ual ?? mintUal("prop", p.id),
    "@type": [p.category === "lore" ? "ex:WorldLoreRule" : "ex:CinematicProp", "schema:Thing"],
    "schema:name": p.name,
    "ex:category": p.category,
    "ex:classification": p.type,
    "ex:partOfProject": p.projectId ? mintUal("project", p.projectId) : null,
    "ex:boundToCharacter": p.boundToCharacterId
      ? mintUal("character", p.boundToCharacterId)
      : null,
    "ex:boundToSet": p.boundToSetId ? mintUal("set", p.boundToSetId) : null,
    "schema:description": p.description,
    "ex:loreSignificance": p.loreSignificance,
    "ex:negativePrompts": p.negativePrompts ?? [],
    "ex:visualTheme": p.visualTheme,
    "schema:image": p.imageUrl ?? null,
    "prov:generatedAtTime": p.createdAt,
  };
}

function projectToJsonLd(p: Project) {
  return {
    "@context": {
      schema: "https://schema.org/",
      ex: BASE_IRI,
      prov: "http://www.w3.org/ns/prov#",
    },
    "@id": p.ual ?? mintUal("project", p.id),
    "@type": ["schema:CreativeWorkSeries", "ex:CinematicProject"],
    "schema:name": p.title,
    "schema:genre": p.genre,
    "schema:description": p.logline,
    "schema:seasonNumber": p.seasonNumber,
    "schema:numberOfEpisodes": p.totalEpisodes,
    "prov:generatedAtTime": p.createdAt,
  };
}

function sceneToJsonLd(scene: SceneResult) {
  return {
    "@context": {
      schema: "https://schema.org/",
      ex: BASE_IRI,
      prov: "http://www.w3.org/ns/prov#",
    },
    "@id": scene.ual ?? mintUal("scene", scene.id),
    "@type": ["schema:VideoObject", "ex:RenderedScene"],
    "ex:projectId": scene.projectId ?? "proj-ronin-echoes",
    "schema:name": `Episode ${scene.request.episodeNumber} — Scene ${scene.request.sceneNumber}`,
    "ex:userPrompt": scene.request.prompt,
    "ex:composedPrompt": scene.composedPrompt,
    "ex:constraintsInjected": scene.dkgConstraints,
    "prov:wasDerivedFrom": [
      ...scene.lineage.derivedFrom.characters,
      ...scene.lineage.derivedFrom.leitmotifs,
      scene.lineage.derivedFrom.set,
    ],
    "ex:livepeerOutputs": scene.livepeerOutputs.map((o) => ({
      "@type": "ex:MediaOutput",
      "ex:mediaType": o.type,
      "ex:url": o.url,
      "ex:capability": o.capability,
      "ex:costUsd": o.costUsd,
    })),
    "ex:promptFingerprint": scene.lineage.provenance.promptFingerprint,
    "ex:complianceCertificate": scene.complianceCertificate ?? null,
    "prov:generatedAtTime": scene.createdAt,
  };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Turtle RDF Builder
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function buildTurtlePrefixes(): string {
  return [
    `@prefix schema: <https://schema.org/> .`,
    `@prefix ex: <${BASE_IRI}> .`,
    `@prefix prov: <http://www.w3.org/ns/prov#> .`,
    `@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .`,
    "",
  ].join("\n");
}

function sceneToTurtle(scene: SceneResult): string {
  const ual = scene.ual ?? mintUal("scene", scene.id);
  const lines = [buildTurtlePrefixes()];
  lines.push(`<${ual}> a schema:VideoObject, ex:RenderedScene ;`);
  lines.push(`  schema:name "Episode ${scene.request.episodeNumber} — Scene ${scene.request.sceneNumber}" ;`);
  lines.push(`  ex:userPrompt "${escapeTtl(scene.request.prompt)}" ;`);

  for (const charUal of scene.lineage.derivedFrom.characters) {
    lines.push(`  prov:wasDerivedFrom <${charUal}> ;`);
  }
  for (const leitUal of scene.lineage.derivedFrom.leitmotifs) {
    lines.push(`  prov:wasDerivedFrom <${leitUal}> ;`);
  }
  lines.push(`  prov:wasDerivedFrom <${scene.lineage.derivedFrom.set}> ;`);
  lines.push(`  prov:generatedAtTime "${scene.createdAt}"^^xsd:dateTime .`);
  return lines.join("\n");
}

function escapeTtl(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n");
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Graph Builder (for UI visualization)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function buildGraphData(
  projects: Project[],
  characters: CharacterAsset[],
  leitmotifs: LeitmotifAsset[],
  sets: SetAsset[],
  props: PropAsset[],
  scenes: SceneResult[],
  filterProjectId?: string
): GraphData {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];

  const filteredProjects = filterProjectId
    ? projects.filter((p) => p.id === filterProjectId)
    : projects;

  const filteredCharacters = filterProjectId
    ? characters.filter((c) => (c.projectId ?? "proj-ronin-echoes") === filterProjectId)
    : characters;

  const filteredSets = filterProjectId
    ? sets.filter((s) => (s.projectId ?? "proj-ronin-echoes") === filterProjectId)
    : sets;

  const filteredLeitmotifs = filterProjectId
    ? leitmotifs.filter((l) => (l.projectId ?? "proj-ronin-echoes") === filterProjectId)
    : leitmotifs;

  const filteredProps = filterProjectId
    ? props.filter((p) => (p.projectId ?? "proj-ronin-echoes") === filterProjectId)
    : props;

  const filteredScenes = filterProjectId
    ? scenes.filter((sc) => (sc.request.projectId ?? "proj-ronin-echoes") === filterProjectId)
    : scenes;

  // 1. Projects
  for (const p of filteredProjects) {
    const ual = p.ual ?? mintUal("project", p.id);
    nodes.push({
      id: ual,
      type: "project",
      label: p.title,
      projectId: p.id,
      data: {
        id: p.id,
        genre: p.genre,
        logline: p.logline,
        seasonNumber: p.seasonNumber,
        totalEpisodes: p.totalEpisodes,
        createdAt: p.createdAt,
      },
    });
  }

  // 2. Characters
  for (const c of filteredCharacters) {
    const ual = c.ual ?? mintUal("character", c.id);
    const projId = c.projectId ?? "proj-ronin-echoes";
    nodes.push({
      id: ual,
      type: "character",
      label: c.name,
      projectId: projId,
      data: {
        id: c.id,
        epithet: c.epithet,
        avatarUrl: c.avatarUrl,
        faceSeed: c.visualDna?.faceSeed,
        projectId: projId,
        distinguishingFeatures: c.visualDna?.distinguishingFeatures,
        attire: c.visualDna?.attire?.canonical,
      },
    });

    const proj = projects.find((p) => p.id === projId);
    if (proj) {
      const projUal = proj.ual ?? mintUal("project", proj.id);
      edges.push({
        source: projUal,
        target: ual,
        predicate: "ex:hasCharacter",
        label: "has character",
      });
    }
  }

  // 3. Props & Canon Lore
  for (const pr of filteredProps) {
    const assetType = pr.category === "lore" ? "lore" : "prop";
    const ual = pr.ual ?? mintUal(assetType, pr.id);
    const projId = pr.projectId ?? "proj-ronin-echoes";
    nodes.push({
      id: ual,
      type: "prop",
      label: pr.name,
      projectId: projId,
      data: {
        id: pr.id,
        category: pr.category,
        propType: pr.type,
        significance: pr.loreSignificance,
        projectId: projId,
        boundToCharacterId: pr.boundToCharacterId,
        visualTheme: pr.visualTheme,
        description: pr.description,
      },
    });

    const proj = projects.find((p) => p.id === projId);
    if (proj) {
      const projUal = proj.ual ?? mintUal("project", proj.id);
      edges.push({
        source: projUal,
        target: ual,
        predicate: pr.category === "lore" ? "ex:hasLoreRule" : "ex:hasProp",
        label: pr.category === "lore" ? "canon rule" : "features prop",
      });
    }

    if (pr.boundToCharacterId) {
      const boundChar = characters.find((c) => c.id === pr.boundToCharacterId);
      if (boundChar) {
        const charUal = boundChar.ual ?? mintUal("character", boundChar.id);
        edges.push({
          source: charUal,
          target: ual,
          predicate: "ex:wieldsProp",
          label: "possesses",
        });
      }
    }
  }

  // 4. Leitmotifs
  for (const l of filteredLeitmotifs) {
    const ual = l.ual ?? mintUal("leitmotif", l.id);
    const projId = l.projectId ?? "proj-ronin-echoes";
    nodes.push({
      id: ual,
      type: "leitmotif",
      label: l.name,
      projectId: projId,
      data: {
        id: l.id,
        mood: l.mood,
        bpm: l.bpm,
        key: l.key,
        audioUrl: l.audioUrl,
        instruments: l.instruments,
        projectId: projId,
      },
    });

    const proj = projects.find((p) => p.id === projId);
    if (proj) {
      const projUal = proj.ual ?? mintUal("project", proj.id);
      edges.push({
        source: projUal,
        target: ual,
        predicate: "ex:hasLeitmotif",
        label: "has motif",
      });
    }

    if (l.boundToCharacterId) {
      const boundChar = characters.find((c) => c.id === l.boundToCharacterId);
      if (boundChar) {
        const charUal = boundChar.ual ?? mintUal("character", boundChar.id);
        edges.push({
          source: charUal,
          target: ual,
          predicate: "ex:hasLeitmotif",
          label: "character motif",
        });
      }
    }
  }

  // 5. Sets & Environments
  for (const s of filteredSets) {
    const ual = s.ual ?? mintUal("set", s.id);
    const projId = s.projectId ?? "proj-ronin-echoes";
    nodes.push({
      id: ual,
      type: "set",
      label: s.name,
      projectId: projId,
      data: {
        id: s.id,
        timeOfDay: s.timeOfDay,
        lighting: s.lightingSchema,
        imageUrl: s.imageUrl,
        projectId: projId,
        colorPalette: s.colorPalette,
      },
    });

    const proj = projects.find((p) => p.id === projId);
    if (proj) {
      const projUal = proj.ual ?? mintUal("project", proj.id);
      edges.push({
        source: projUal,
        target: ual,
        predicate: "ex:hasEnvironment",
        label: "has environment",
      });
    }
  }

  // 6. Scenes
  for (const sc of filteredScenes) {
    const ual = sc.ual ?? mintUal("scene", sc.id);
    const projId = sc.request.projectId ?? "proj-ronin-echoes";
    nodes.push({
      id: ual,
      type: "scene",
      label: `Ep${sc.request.episodeNumber} Sc${sc.request.sceneNumber}`,
      projectId: projId,
      data: {
        id: sc.id,
        prompt: sc.request.prompt,
        outputs: sc.livepeerOutputs,
        projectId: projId,
        generatedAt: sc.lineage.provenance.generatedAt,
      },
    });

    const proj = projects.find((p) => p.id === projId);
    if (proj) {
      const projUal = proj.ual ?? mintUal("project", proj.id);
      edges.push({
        source: projUal,
        target: ual,
        predicate: "schema:hasPart",
        label: "renders scene",
      });
    }

    for (const cUal of sc.lineage.derivedFrom.characters) {
      edges.push({ source: cUal, target: ual, predicate: "prov:wasDerivedFrom", label: "features character" });
    }
    for (const lUal of sc.lineage.derivedFrom.leitmotifs) {
      edges.push({ source: lUal, target: ual, predicate: "prov:wasDerivedFrom", label: "scores motif" });
    }
    if (sc.lineage.derivedFrom.set) {
      edges.push({ source: sc.lineage.derivedFrom.set, target: ual, predicate: "prov:wasDerivedFrom", label: "staged in set" });
    }
  }

  // Filter edges so both endpoints exist in returned nodes
  const nodeIds = new Set(nodes.map((n) => n.id));
  const validEdges = edges.filter((e) => nodeIds.has(e.source) && nodeIds.has(e.target));

  return { nodes, edges: validEdges };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// DKG ADAPTER CLASS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export class DkgEngine {
  constructor(private readonly store: FileStore) {}

  /** Mint UALs for all vault assets and persist their JSON-LD to disk */
  async persistVault(
    characters: CharacterAsset[],
    leitmotifs: LeitmotifAsset[],
    sets: SetAsset[]
  ): Promise<void> {
    for (const c of characters) {
      c.ual = mintUal("character", c.id);
      await this.store.writeJson(`vault/characters/${c.id}.jsonld`, characterToJsonLd(c));
    }
    for (const l of leitmotifs) {
      l.ual = mintUal("leitmotif", l.id);
      await this.store.writeJson(`vault/leitmotifs/${l.id}.jsonld`, leitmotifToJsonLd(l));
    }
    for (const s of sets) {
      s.ual = mintUal("set", s.id);
      await this.store.writeJson(`vault/sets/${s.id}.jsonld`, setToJsonLd(s));
    }
  }

  /** Query character constraints (simulates SPARQL-like graph traversal) */
  queryCharacterConstraints(character: CharacterAsset): string[] {
    const traits: string[] = [];
    traits.push(character.visualDna.attire.canonical);
    traits.push(...character.visualDna.distinguishingFeatures);
    traits.push(`hair color: ${character.visualDna.hairColor}`);
    traits.push(`eye color: ${character.visualDna.eyeColor}`);
    return traits;
  }

  /** Query negative prompts for a character */
  queryNegativeConstraints(character: CharacterAsset): string[] {
    return [...character.visualDna.negativePrompts, ...character.visualDna.attire.forbidden];
  }

  /** Query set constraints */
  querySetConstraints(set: SetAsset): string[] {
    return [set.description, `lighting: ${set.lightingSchema}`, `time: ${set.timeOfDay}`];
  }

  /** Query set negative prompts */
  querySetNegatives(set: SetAsset): string[] {
    return set.negativePrompts;
  }

  /** Build music prompt from leitmotif KA */
  queryLeitmotifPrompt(leit: LeitmotifAsset): string {
    return `${leit.mood} instrumental, ${leit.bpm} BPM, key of ${leit.key}, instruments: ${leit.instruments.join(", ")}`;
  }

  /** Persist a completed scene as a Knowledge Asset */
  async mintSceneKa(scene: SceneResult): Promise<string> {
    scene.ual = mintUal("scene", scene.id);
    const jsonLd = sceneToJsonLd(scene);
    const turtle = sceneToTurtle(scene);

    await this.store.writeJson(`scenes/${scene.id}.jsonld`, jsonLd);
    await this.store.writeText(`scenes/${scene.id}.ttl`, turtle);

    return scene.ual;
  }

  /** Mint a single character Knowledge Asset */
  async mintCharacterKa(character: CharacterAsset): Promise<string> {
    character.ual = mintUal("character", character.id);
    await this.store.writeJson(`vault/characters/${character.id}.jsonld`, characterToJsonLd(character));
    return character.ual;
  }

  /** Mint a single set Knowledge Asset */
  async mintSetKa(set: SetAsset): Promise<string> {
    set.ual = mintUal("set", set.id);
    await this.store.writeJson(`vault/sets/${set.id}.jsonld`, setToJsonLd(set));
    return set.ual;
  }

  /** Mint a single leitmotif Knowledge Asset */
  async mintLeitmotifKa(leit: LeitmotifAsset): Promise<string> {
    leit.ual = mintUal("leitmotif", leit.id);
    await this.store.writeJson(`vault/leitmotifs/${leit.id}.jsonld`, leitmotifToJsonLd(leit));
    return leit.ual;
  }

  /** Mint a single project Knowledge Asset */
  async mintProjectKa(project: Project): Promise<string> {
    project.ual = mintUal("project", project.id);
    await this.store.writeJson(`projects/${project.id}.jsonld`, projectToJsonLd(project));
    return project.ual;
  }

  /** Mint a single prop / lore Knowledge Asset */
  async mintPropKa(prop: PropAsset): Promise<string> {
    const assetType = prop.category === "lore" ? "lore" : "prop";
    prop.ual = mintUal(assetType, prop.id);
    await this.store.writeJson(`vault/props/${prop.id}.jsonld`, propToJsonLd(prop));
    return prop.ual;
  }

  /** Export a KA as JSON-LD */
  async exportJsonLd(assetPath: string): Promise<unknown> {
    return this.store.readJson(assetPath);
  }
}

export {
  mintUal,
  characterToJsonLd,
  leitmotifToJsonLd,
  setToJsonLd,
  propToJsonLd,
  projectToJsonLd,
  sceneToJsonLd,
};

