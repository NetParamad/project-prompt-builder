# 01: Tech logos via svgl

**What to build:** Vendor brand SVGs from svgl.app into `public/logos/`,
mapped from catalog option ids (`lib/data/logos.ts`, light + dark variants
where svgl provides them). OptionCard shows a 20px logo with lazy loading and
a letter-tile fallback (missing file or load error). No new runtime deps.

**Blocked by:** None (can start immediately).

**Status:** done

- [ ] lint + typecheck + tests + build green
