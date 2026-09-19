# Security

Security is a core design requirement of GOOSE OS, not a post-launch concern.

## Reporting vulnerabilities

If you find a security issue, **do not open a public issue**. Email the maintainers
(contact details to be published with the first release) or open a GitHub security
advisory against this repository. Please include:

- Affected component and version
- A minimal reproduction
- Impact and any suggested mitigation

## Security principles

- **Least privilege.** Components only ever get the permissions they need.
- **Explicit consent.** Destructive or privileged actions require user approval.
- **No silent uploads.** GOOSE OS never transmits user files or code without permission.
- **No hidden telemetry.**
- **Secrets stay out of the frontend.** API keys belong in secure backend configuration,
  never in client code, localStorage, or git history.
- **AI is sandboxed.** AI-generated commands are suggestions; execution requires
  confirmation and respects allowlists/permission scopes. AI never receives root.
- **Reversible operations.** Wherever practical, actions can be undone.
- **Audit logging** for privileged actions.

## Current prototype (0.1.0) notes

- The `@goose/system-service` bridge binds to `127.0.0.1`, serves read-only host
  information, and enables CORS only for the local Vite origins. It never executes
  shell commands beyond a read-only `pactl` status call.
- The web shell runs fully client-side and persists only non-sensitive preferences
  (`packages/config`). It degrades to bundled demo data when the bridge is down.
- The legacy ISO contains 2011-era components and **must not be booted or trusted**;
  it is preserved only as an archival artifact.

## Secure development checklist

Before merging a change:

1. No secrets committed (check `.env*`, logs, fixtures).
2. No new way for the bridge to write to the filesystem or execute commands without consent.
3. No telemetry or data collection added without an explicit, documented purpose.
4. Permission prompts cover *what, where, and what risk* for any state-changing action.
5. Degraded/offline paths still leave the desktop functional.