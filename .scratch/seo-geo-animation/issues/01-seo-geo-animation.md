# 01: SEO + GEO + subtle animations

**What to build:** Full Next.js metadata (OG/Twitter/canonical via `NEXT_PUBLIC_SITE_URL`), `sitemap.xml` + `robots.txt`, JSON-LD SoftwareApplication, one real `h1`, `public/llms.txt` for AI crawlers, and CSS-only subtle animations (card pop, check-in, pane fade) gated by `prefers-reduced-motion`. No new runtime deps.

**Blocked by:** None (can start immediately).

**Status:** done

- [ ] `?c=` untouched; lint + typecheck + tests + build green
- [ ] Animations disabled under reduced-motion
