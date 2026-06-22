import manifest from "./portraits.json";
import type { Speaker } from "./types";

const portraits = manifest as Record<string, string>;

/**
 * Resolve a speaker's local portrait path (e.g. "/portraits/4333.png").
 * Falls back to the live CDN portrait_url, then null.
 */
export function portraitSrc(speaker: Pick<Speaker, "speaker_page_id" | "portrait_url">): string | null {
  if (speaker.speaker_page_id != null) {
    const local = portraits[String(speaker.speaker_page_id)];
    if (local) return local;
  }
  return speaker.portrait_url ?? null;
}
