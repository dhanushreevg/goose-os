import type { IconName } from '@goose/ui';

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