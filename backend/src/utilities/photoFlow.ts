// server/photosFlow.ts
import { promises as fs } from "fs";
import path from "path";
import { spawn } from "child_process";
import { BASE_PROJECT_ASSETS_PATH } from '../config';

export const dirs = {
  toPhotos: path.join(BASE_PROJECT_ASSETS_PATH, "ToPhotos"),
  fromPhotos: path.join(BASE_PROJECT_ASSETS_PATH, "FromPhotos"),
};

export async function ensureDirs() {
  await fs.mkdir(dirs.toPhotos, { recursive: true });
  await fs.mkdir(dirs.fromPhotos, { recursive: true });
}

export async function copyToStaging(originalAbsPath: string): Promise<{ stagedPath: string; stagedName: string; }> {
  await ensureDirs();
  const base = path.basename(originalAbsPath);
  const stagedName = `${Date.now()}-${base}`; // unique to avoid dup name collisions in Photos
  const stagedPath = path.join(dirs.toPhotos, stagedName);
  await fs.copyFile(originalAbsPath, stagedPath);
  return { stagedPath, stagedName };
}

/** Open the staged file in Photos (imports & reveals it). */
export async function openInPhotos(absPath: string): Promise<void> {
  // `open -a Photos {file}` imports and shows it.
  await new Promise<void>((resolve, reject) => {
    const child = spawn("open", ["-a", "Photos", absPath], {
      stdio: "ignore",
      detached: true,
    });
    child.on("error", reject);
    // We don't wait for Photos to close—just consider launch successful.
    child.unref();
    resolve();
  });
}

/** Run an AppleScript string via osascript and get stdout. */
export async function runAppleScript(source: string): Promise<string> {
  return await new Promise<string>((resolve, reject) => {
    const child = spawn("osascript", ["-e", source]);
    let out = "";
    let err = "";
    child.stdout.on("data", (d) => (out += d.toString()));
    child.stderr.on("data", (d) => (err += d.toString()));
    child.on("close", (code) => {
      if (code === 0) return resolve(out.trim());
      reject(new Error(err || `osascript exit code ${code}`));
    });
  });
}
