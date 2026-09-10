import { NextResponse } from "next/server";
import JSZip from "jszip";
import { promises as fs } from "fs";
import path from "path";

// Folder & file yang TIDAK ikut di-download
const EXCLUDE_DIRS = new Set([
  "node_modules",
  ".next",
  ".git",
  ".vercel",
  ".turbo",
  ".aws-sam",
]);
const EXCLUDE_FILES = new Set([
  ".env",
  "tsconfig.tsbuildinfo",
  "next-env.d.ts",
  "next.config.ts.bak",
]);

async function listFiles(dir: string, base = ""): Promise<string[]> {
  const out: string[] = [];
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }
  for (const e of entries) {
    if (EXCLUDE_DIRS.has(e.name) || EXCLUDE_FILES.has(e.name)) continue;
    const full = path.join(dir, e.name);
    const rel = path.join(base, e.name);
    if (e.isDirectory()) {
      const sub = await listFiles(full, rel);
      out.push(...sub);
    } else {
      out.push(rel);
    }
  }
  return out;
}

// GET /api/source/zip - Download source code proyek sebagai ZIP (untuk deploy)
export async function GET() {
  try {
    const root = process.cwd();
    const files = await listFiles(root);

    const zip = new JSZip();
    for (const f of files) {
      try {
        const content = await fs.readFile(path.join(root, f));
        zip.file(f, content);
      } catch {
        // skip file yang gagal dibaca
      }
    }

    const buf = await zip.generateAsync({
      type: "nodebuffer",
      compression: "DEFLATE",
      compressionOptions: { level: 6 },
    });

    return new Response(new Uint8Array(buf), {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition":
          'attachment; filename="gudangpro-source.zip"',
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Gagal membuat arsip source code" },
      { status: 500 },
    );
  }
}
