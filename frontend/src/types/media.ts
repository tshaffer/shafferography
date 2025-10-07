// frontend/src/types/media.ts
export type DerivativeInfo = {
  id: string;
  label: string;
  width: number;
  height: number;
  mimeType: string;
};

export type MediaManifest = {
  mediaItemId: string;
  original: { width: number; height: number; mimeType: string };
  derivatives: DerivativeInfo[];
  preferredDerivativeId: string | null;
};

// Which variant is the user viewing right now?
export type ViewVariant =
  | { kind: "original" }
  | { kind: "preferred" }
  | { kind: "derivative"; derivativeId: string };
