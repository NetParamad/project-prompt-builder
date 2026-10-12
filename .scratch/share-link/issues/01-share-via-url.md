# 01: Share via URL

**What to build:** A `?c=` base64url JSON Share Link encoding the full Configuration. Opening it applies the config (winning over localStorage, persisted); invalid payloads fall back silently. A "Copy share link" button sits with the other output actions; the param stays in the address bar.

**Blocked by:** None (can start immediately).

**Status:** done

- [ ] Round-trip encode/decode preserves selections, requirements (incl. non-Latin text), mode, custom skills
- [ ] Unknown ids dropped, database capped at 2, bad mode defaults, garbage param ignored
- [ ] lint + typecheck + tests + build green
