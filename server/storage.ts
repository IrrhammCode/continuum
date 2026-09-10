/* ─── Continuum — Local File Storage Utility ─── */

import fs from "node:fs/promises";
import path from "node:path";

const DATA_DIR = path.resolve("data");

export class FileStore {
  async writeJson(relativePath: string, data: unknown): Promise<string> {
    const fullPath = path.join(DATA_DIR, relativePath);
    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    await fs.writeFile(fullPath, JSON.stringify(data, null, 2), "utf-8");
    return fullPath;
  }

  async writeText(relativePath: string, content: string): Promise<string> {
    const fullPath = path.join(DATA_DIR, relativePath);
    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    await fs.writeFile(fullPath, content, "utf-8");
    return fullPath;
  }

  async readJson<T = unknown>(relativePath: string): Promise<T | null> {
    try {
      const fullPath = path.join(DATA_DIR, relativePath);
      const raw = await fs.readFile(fullPath, "utf-8");
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  async exists(relativePath: string): Promise<boolean> {
    try {
      await fs.access(path.join(DATA_DIR, relativePath));
      return true;
    } catch {
      return false;
    }
  }
}
