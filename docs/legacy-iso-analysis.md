# Legacy ISO analysis

Artifact: **`demo-goose.iso`** (~664 MiB, Git-LFS-tracked).

## Verified metadata

- Format: ISO 9660 CD-ROM filesystem, bootable (`file` output: `'CDROM' (bootable)`).
- LFS OID: `e51abd0ad1c5afbed3d2e955d55b8be203bfb5a2720aff50c5f3f9b7da553a32`,
  size 696,258,560 bytes.
- Previously identified as: **Chrome OS Linux 1.4.797**, 32-bit i686, based on
  openSUSE 11.4, built with the KIWI build system, live-boot style (2011 era).

## Assessment

This ISO is a **legacy experimental artifact**. It is not and never was:
- a modern GOOSE OS build,
- a maintained or secure distribution (built 2011; modern CVE exposure would be severe),
- suitable as the foundation for GOOSE OS 0.1+.

The GOOSE OS project should be built on a **modern, maintained Linux distribution**
(e.g. Ubuntu LTS, Debian, or Fedora), with modern packaging, Wayland, and security
updates — see [roadmap.md](roadmap.md), Phase 7.

## Repository handling

- The file remains tracked by Git LFS. It is **not** deleted or rebuilt.
- New images (when built) go to a new location, never overwriting this artifact.
- Redistribution of this ISO is not claimed; its contents belong to their original
  upstream components.