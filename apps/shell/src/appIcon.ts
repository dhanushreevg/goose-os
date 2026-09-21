import type { IconName } from '@goose/ui';

export const GOOGLE_APP_IDS = [
  'gmail',
  'google-calendar',
  'google-chat',
  'google-docs',
  'google-drive',
  'google-forms',
  'google-keep',
  'google-maps',
  'google-meet',
  'google-photos',
  'google-sheets',
  'google-sites',
  'google-slides',
  'google-tasks',
  'google-voice',
] as const;

export type GoogleAppId = (typeof GOOGLE_APP_IDS)[number];

export function isGoogleApp(appId: string): appId is GoogleAppId {
  return (GOOGLE_APP_IDS as readonly string[]).includes(appId);
}

export function appIcon(appId: string): IconName {
  switch (appId) {
    case 'files':
      return 'folder';
    case 'editor':
      return 'docs';
    case 'search':
      return 'search';
    case 'browser':
      return 'globe';
    case 'app-center':
      return 'store';
    case 'settings':
      return 'settings';
    case 'system-monitor':
      return 'cpu';
    case 'music':
      return 'music';
    case 'ai-center':
      return 'sparkle';
    case 'trash':
      return 'trash';
    case 'terminal':
      return 'terminal';
    case 'developer-center':
      return 'code';
    case 'system':
      return 'goose';
    default:
      return 'grid';
  }
}