# Contributing to GOOSE OS

Thanks for helping with GOOSE OS. This is an experimental prototype; small, focused
contributions are the most useful.

## Ground rules

1. **Inspect before modifying.** Understand the current phase and existing code before changing it.
2. **Prototype first.** Major architectural changes need a working prototype and review.
3. **No fabrication.** Only claim that a feature works after it is tested.
4. **AI assists, never controls.** Any AI-driven action that could change system state must run behind explicit user approval and permission scopes.
5. **Secrets never in git.** No API keys, tokens, or `.env` files with real values.
6. **Offline first.** Desktop features must work with no network and no AI provider.
7. **Accessibility + performance** are review criteria, not afterthoughts.

## Development workflow

```bash
pnpm install
pnpm typecheck     # TypeScript across all workspaces
pnpm lint          # ESLint (flat config at repo root)
pnpm test          # vitest across all workspaces
pnpm dev           # bridge + shell
```

Use the workspace filters when working on a single package:

```bash
pnpm --filter @goose/shell typecheck
pnpm --filter @goose/shell test
```

## Commits

Prefer small, meaningful commits. Conventional-style messages are used:

```
feat: add GOOSE launcher prototype
fix: resolve launcher keyboard navigation
docs: add architecture documentation
chore: upgrade tailwindcss
```

Never rewrite published history and do not force-push. Rebase only on your own
unmerged branch.

## Code style

- TypeScript, strict mode (`tsconfig.base.json`). Type-only imports use `import type`.
- No JavaScript implementation of a shell; the terminal is an interface, not an emulator.
- Components follow the existing `packages/ui` patterns and design tokens; no ad-hoc colors.
- No new dependencies without justification and review (performance budget matters).

## Testing expectations

- Pure logic (reducers, helpers, parsers) gets unit tests.
- UI primitives get component tests where behaviour is meaningful.
- Before claiming a feature done: `typecheck`, `lint`, relevant tests, a defensive
  read of failure paths, and documentation updates.

## Licenses

All GOOSE OS code is MIT. Third-party components keep their own licenses. Do not add
proprietary code or assets without explicit documented permission.