/** Parse the `Volume:` line from `pactl get-sink-volume`. Returns percent or null. */
export function parsePactlVolume(output: string): number | null {
  const match = output.match(/(\d+)\s*%/);
  if (!match || match[1] === undefined) return null;
  const value = Number(match[1]);
  if (!Number.isFinite(value)) return null;
  return Math.min(100, Math.max(0, value));
}

/** Parse the `Mute:` line from `pactl get-sink-mute`. True when muted. */
export function parsePactlMuted(output: string): boolean {
  return /mute:\s*(yes|1)/i.test(output) && !/mute:\s*no/i.test(output);
}