import type { IconName } from '@goose/ui';

export function appIcon(appId: string): IconName {
  switch (appId) {
    case 'files':
      return 'folder';
    case 'terminal':
      return 'terminal';
    case 'settings':
      return 'settings';
    case 'ai-center':
      return 'sparkle';
    case 'developer-center':
      return 'code';
    case 'system':
      return 'goose';
    default:
      return 'grid';
  }
}