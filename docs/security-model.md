# Security model

GOOSE OS treats security as a first-class design constraint. This document records how
the model applies now (Phase 1) and how it will evolve.

## Guiding principles

- Least privilege everywhere.
- Explicit user consent before any state-changing action.
- AI-generated actions are **suggestions**, never silent execution.
- No hidden telemetry, no silent data uploads.
- Secrets are stored securely (backend only), never in the client or git.
- Privileged actions are reversible where practical and always audited.

## Threats considered

| Threat | Mitigation |
| --- | --- |
| Malicious/compromised host bridge | Bridge binds 127.0.0.1, read-only, minimal surface, CORS-restricted. |
| AI exfiltrating project files | Providers operate on whitelisted content; uploads require permission; offline fallback keeps working. |
| Unapproved destructive commands | Commands are shown verbatim (command, cwd, files, risk, privileges) and require explicit confirmation; allowlists + permission scopes. |
| Secret leakage via settings/logs | `@goose/config` refuses secrets in localStorage; `.env*` git-ignored; no logging of secrets. |
| Privacy by hidden telemetry | None collected; any future instrumentation must be opt-in and documented. |
| Legacy ISO booting | Documented as untrusted (2011 components); kept only as an archive artifact. |

## Permission model (planned, driven by §9.4)

1. **Ask** — show exact command, target, files affected, risk, privileges required.
2. **Confirm** — require explicit user approval for sudo, package installs, deletes,
   disk ops, permission changes, network config, service changes, `git push`,
   destructive scripts.
3. **Allow/deny lists** — scoped permissions per app/provider.
4. **Audit log** — record privileged actions locally.

## Phase 1 guarantees

- The web shell is fully client-side; nothing leaves the machine except requests to
  the localhost bridge.
- The bridge exposes GET-only endpoints and cannot modify system state.
- No keys, tokens, or personal data are stored or transmitted.

## Reviewing a change

Every PR touching security boundaries must be reviewed against these controls and the
[secure development checklist](../SECURITY.md).