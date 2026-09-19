/**
 * Shared shell layout constants. Keeping these in one place lets the dock,
 * workspace view and workspace bar stay aligned without magic numbers.
 */

/** Width (px) of the vertical application dock on the left edge. */
export const DOCK_WIDTH = 88;

/** Height (px) of the top system panel. */
export const TOP_BAR_HEIGHT = 48;

/** Readable names for each workspace, shown in the top panel. */
export const WORKSPACE_NAMES = ['Desktop', 'Development', 'Media', 'Overview'] as const;

/** Absolute height reserved for the floating workspace bar at the bottom. */
export const WORKSPACE_BAR_HEIGHT = 64;

export function workspaceName(index: number): string {
  return WORKSPACE_NAMES[index] ?? `Workspace ${index + 1}`;
}