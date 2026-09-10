/* ─── Continuum — Livepeer Agent MCP Adapter ─── */

import crypto from "node:crypto";
import type { LivepeerOutput } from "../../shared/types.js";

export interface LivepeerGenerateInput {
  action: "generate" | "animate" | "music";
  prompt: string;
  sourceUrl?: string;
  duration?: number;
}

export interface LivepeerAdapter {
  generate(input: LivepeerGenerateInput): Promise<LivepeerOutput>;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MOCK ADAPTER — instant offline development
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export class MockLivepeerAdapter implements LivepeerAdapter {
  async generate(input: LivepeerGenerateInput): Promise<LivepeerOutput> {
    const hash = crypto.createHash("sha256").update(input.prompt).digest("hex").slice(0, 12);
    const type = input.action === "music" ? "audio" : input.action === "animate" ? "video" : "image";
    const capability = type === "image" ? "flux-dev" : type === "video" ? "kling" : "sonilo-v2m";

    // Simulate latency
    await new Promise((r) => setTimeout(r, 800));

    return {
      type,
      url: `https://example.invalid/mock/${type}/${hash}`,
      capability,
      costUsd: type === "image" ? 0.026 : type === "video" ? 0.15 : 0.05,
      elapsedMs: 800,
    };
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// REAL ADAPTER — calls Livepeer Agent MCP creative endpoint
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const POLL_INTERVAL_MS = 3000;
const POLL_TIMEOUT_MS = 120_000; // 2 minutes max wait

export class RealLivepeerAdapter implements LivepeerAdapter {
  private sessionId?: string;
  private initialized = false;

  constructor(
    private readonly endpoint: string,
    private readonly bearer?: string
  ) {}

  async generate(input: LivepeerGenerateInput): Promise<LivepeerOutput> {
    await this.ensureInitialized();

    const args: Record<string, unknown> = {
      action: input.action,
      prompt: input.prompt,
    };
    if (input.sourceUrl) args.source_url = input.sourceUrl;
    if (input.duration) args.duration = input.duration;

    const t0 = Date.now();
    const result = await this.callTool("create_media", args);
    const sc = result?.structuredContent ?? {};

    const type = input.action === "music" ? "audio" : input.action === "animate" ? "video" : "image";

    // ── Check if the response is already complete (synchronous) ──
    if (sc.url && sc.status !== "pending" && sc.status !== "rendering") {
      return {
        type,
        url: sc.url,
        capability: sc.capability ?? "unknown",
        costUsd: sc.cost_usd_estimated ?? 0,
        elapsedMs: sc.elapsed_ms ?? (Date.now() - t0),
      };
    }

    // ── Async job — poll get_create_media until done ──
    if (sc.job_id) {
      console.log(`[Livepeer] Async job ${sc.job_id} — polling (ETA: ${sc.eta_seconds ?? "?"}s)…`);
      const finalResult = await this.pollJob(sc.job_id, t0);
      return {
        type,
        url: finalResult.url ?? "",
        capability: finalResult.capability_used ?? finalResult.capability ?? sc.capability ?? "unknown",
        costUsd: finalResult.cost_usd_estimated ?? sc.cost_usd_estimated ?? 0,
        elapsedMs: finalResult.elapsed_ms ?? (Date.now() - t0),
      };
    }

    // ── Fallback — return whatever we got ──
    return {
      type,
      url: sc.url ?? "",
      capability: sc.capability ?? "unknown",
      costUsd: sc.cost_usd_estimated ?? 0,
      elapsedMs: Date.now() - t0,
    };
  }

  /** Poll get_create_media until status is terminal */
  private async pollJob(jobId: string, startTime: number): Promise<Record<string, any>> {
    const deadline = startTime + POLL_TIMEOUT_MS;

    while (Date.now() < deadline) {
      await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));

      try {
        const pollResult = await this.callTool("get_create_media", { job_id: jobId });
        const ps = pollResult?.structuredContent ?? {};

        if (ps.status === "done" || ps.status === "completed") {
          console.log(`[Livepeer] Job ${jobId} done in ${Date.now() - startTime}ms`);
          return ps;
        }

        if (ps.status === "failed" || ps.status === "error") {
          throw new Error(`Livepeer job ${jobId} failed: ${ps.error ?? "unknown error"}`);
        }

        // Still pending/rendering — continue polling
        console.log(`[Livepeer] Job ${jobId} status: ${ps.status ?? "unknown"}`);
      } catch (err) {
        console.warn(`[Livepeer] Poll error for ${jobId}:`, (err as Error).message);
      }
    }

    throw new Error(`Livepeer job ${jobId} timed out after ${POLL_TIMEOUT_MS / 1000}s`);
  }

  private async ensureInitialized(): Promise<void> {
    if (this.initialized) return;

    const body = {
      jsonrpc: "2.0",
      method: "initialize",
      params: {
        protocolVersion: "2025-03-26",
        clientInfo: { name: "continuum", version: "0.1.0" },
        capabilities: {},
      },
      id: "init-1",
    };

    const res = await this.mcpFetch(body);
    if (res?.result?.sessionId) {
      this.sessionId = res.result.sessionId;
    }
    this.initialized = true;
  }

  private async callTool(name: string, args: Record<string, unknown>): Promise<any> {
    const body = {
      jsonrpc: "2.0",
      method: "tools/call",
      params: { name, arguments: args },
      id: `tool-${Date.now()}`,
    };

    const res = await this.mcpFetch(body);

    if (res?.result?.isError) {
      const msg = res.result?.structuredContent?.error?.message ?? res.result?.content?.[0]?.text ?? "Livepeer tool error";
      throw new Error(`Livepeer ${name}: ${msg}`);
    }

    return res?.result;
  }

  private async mcpFetch(body: unknown): Promise<any> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json, text/event-stream",
    };
    if (this.bearer) headers["Authorization"] = `Bearer ${this.bearer}`;
    if (this.sessionId) headers["Mcp-Session-Id"] = this.sessionId;

    const response = await fetch(this.endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    const text = await response.text();

    // Handle SSE responses — take the last JSON line
    if (text.includes("data: ")) {
      const lines = text.split("\n").filter((l) => l.startsWith("data: "));
      const last = lines[lines.length - 1];
      if (last) return JSON.parse(last.replace("data: ", ""));
    }

    return JSON.parse(text);
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FACTORY
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function createLivepeerAdapter(): LivepeerAdapter {
  const mode = process.env.LIVEPEER_MODE ?? "mock";
  if (mode === "real") {
    const endpoint = process.env.LIVEPEER_ENDPOINT ?? "https://agent.livepeer.org/api/mcp/creative";
    const key = process.env.LIVEPEER_KEY;
    console.log(`[Livepeer] Real mode → ${endpoint}`);
    return new RealLivepeerAdapter(endpoint, key);
  }
  console.log("[Livepeer] Mock mode — no remote calls");
  return new MockLivepeerAdapter();
}
