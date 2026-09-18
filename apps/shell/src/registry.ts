import type { AppDefinition } from '@goose/types';

export const APPS: AppDefinition[] = [
  {
    id: 'files',
    name: 'Files',
    description: 'Browse your home directory',
    pinned: true,
    defaultWorkspace: 0,
    tint: '#2563EB',
    kind: 'ready',
    defaultSize: { w: 720, h: 470 },
  },
  {
    id: 'terminal',
    name: 'Terminal',
    description: 'Shell with GOOSE assist',
    pinned: true,
    defaultWorkspace: 0,
    tint: '#16A34A',
    kind: 'ready',
    defaultSize: { w: 680, h: 410 },
  },
  {
    id: 'settings',
    name: 'Settings',
    description: 'Customise GOOSE OS',
    pinned: true,
    defaultWorkspace: 0,
    tint: '#C2410C',
    kind: 'ready',
    defaultSize: { w: 640, h: 500 },
  },
  {
    id: 'ai-center',
    name: 'AI Center',
    description: 'Gemini-powered assistance (preview)',
    pinned: true,
    defaultWorkspace: 0,
    tint: '#9333EA',
    kind: 'preview',
    defaultSize: { w: 720, h: 520 },
  },
  {
    id: 'developer-center',
    name: 'Developer Center',
    description: 'Projects, tools and templates (preview)',
    pinned: true,
    defaultWorkspace: 0,
    tint: '#2563EB',
    kind: 'preview',
    defaultSize: { w: 760, h: 540 },
  },
];

const FALLBACK_APP: AppDefinition = {
  id: 'unknown',
  name: 'App',
  description: '',
  pinned: false,
  defaultWorkspace: 0,
  tint: '#C2410C',
};

export function appById(id: string): AppDefinition {
  return APPS.find((app) => app.id === id) ?? FALLBACK_APP;
}