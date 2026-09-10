import { RealLivepeerAdapter } from "../server/adapters/livepeer.js";

const lp = new RealLivepeerAdapter("https://agent.livepeer.org/api/mcp/creative");
console.log("Connecting to Livepeer MCP creative endpoint...");

try {
  console.log("Testing create_media with action animate...");
  const animRes = await (lp as any).callTool("create_media", {
    action: "animate",
    prompt: "Subtle rain and wind movement, anime cyberpunk style, cinematic pan",
    source_url: "https://agent.livepeer.org/a/aHR0cHM6Ly92M2IuZmFsLm1lZGlhL2ZpbGVzL2IvMGFhOWQwNTEvMUJXajE3bWpGVUlCeFpvV1hpQ2psLmpwZw.cea05ab3f02cd40d/1BWj17mjFUIBxZoWXiCjl.jpg",
    duration: 5,
  });
  console.log("Animate Tool Result:", JSON.stringify(animRes?.structuredContent, null, 2));
} catch (e: any) {
  console.error("Livepeer Error:", e.message);
}
