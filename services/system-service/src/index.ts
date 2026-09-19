import { createServer } from 'node:http';
import type { ServerResponse, IncomingMessage } from 'node:http';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import type { BridgeHealth } from '@goose/types';
import { collectHealth } from './collectors';
import { demoHealth } from './demo';

const require = createRequire(import.meta.url);
const pkg = require('../package.json') as { name: string; version: string };
export const VERSION = pkg.version;

const HOST = process.env.GOOSE_SERVICE_HOST ?? '127.0.0.1';
const PORT = Number(process.env.GOOSE_SERVICE_PORT ?? 4823);
const DEMO = process.env.GOOSE_SERVICE_DEMO === '1';

const ALLOWED_ORIGINS = new Set([
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:4173',
  'http://127.0.0.1:4173',
]);

function sendJson(res: ServerResponse, status: number, origin: string | null, payload: unknown) {
  if (origin !== null) res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.statusCode = status;
  res.end(JSON.stringify(payload));
}

/** Build the health payload once per request. Never throws. */
export async function buildHealth(): Promise<BridgeHealth> {
  if (DEMO) return demoHealth();
  try {
    const collected = await collectHealth(VERSION);
    return { ok: true, ...collected };
  } catch {
    return demoHealth();
  }
}

export function createGooseServer() {
  return createServer((req: IncomingMessage, res: ServerResponse) => {
    const method = req.method ?? 'GET';
    const url = new URL(req.url ?? '/', `http://${req.headers.host ?? HOST}`);
    const origin = req.headers.origin ?? null;
    const allowed = origin !== null && ALLOWED_ORIGINS.has(origin) ? origin : null;

    if (method === 'OPTIONS') {
      res.statusCode = 204;
      if (allowed !== null) res.setHeader('Access-Control-Allow-Origin', allowed);
      res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      res.end();
      return;
    }

    if (method !== 'GET') {
      sendJson(res, 405, allowed, { error: 'method not allowed' });
      return;
    }

    if (url.pathname === '/api/health') {
      void buildHealth().then((health) => sendJson(res, 200, allowed, health));
      return;
    }

    if (url.pathname === '/') {
      sendJson(res, 200, allowed, {
        name: pkg.name,
        version: VERSION,
        endpoints: [{ method: 'GET', path: '/api/health', description: 'live host snapshot' }],
      });
      return;
    }

    sendJson(res, 404, allowed, { error: 'not found' });
  });
}

export function startServer() {
  const server = createGooseServer();
  server.listen(PORT, HOST, () => {
    console.log(`[system-service] ${pkg.name}@${VERSION} listening on http://${HOST}:${PORT}`);
    if (DEMO) console.log('[system-service] demo mode: ALL data is bundled (GOOSE_SERVICE_DEMO=1)');
  });
  const shutdown = () => {
    server.close(() => process.exit(0));
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isMain) startServer();