export const GOOGLE_TAKEOUT_PHOTO_TAKEN_SOURCE = 'google-takeout-photoTakenTime';

export type CanonSidecar = {
  original?: {
    filename?: unknown;
  };
  people?: unknown;
  takenAtIso?: unknown;
  takenAtSource?: unknown;
};

export function parseSidecarPeople(sidecar: CanonSidecar | null): string[] {
  if (!Array.isArray(sidecar?.people)) return [];
  return sidecar.people.filter((p): p is string => typeof p === 'string');
}

export function parseSidecarTakenAtIso(sidecar: CanonSidecar | null): string | undefined {
  const takenAtIso = sidecar?.takenAtIso;
  if (typeof takenAtIso !== 'string' || takenAtIso.trim() === '') return undefined;
  const parsed = new Date(takenAtIso);
  if (Number.isNaN(parsed.getTime())) return undefined;
  return parsed.toISOString();
}
