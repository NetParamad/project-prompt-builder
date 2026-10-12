const FALLBACK_URL = "https://project-prompt-builder.vercel.app";

/** Canonical site URL for metadata, sitemap, and share links. */
export function getSiteUrl(): string {
  const raw = process.env["NEXT_PUBLIC_SITE_URL"]?.trim().replace(/\/+$/, "");
  if (!raw) return FALLBACK_URL;
  return /^https?:\/\//.test(raw) ? raw : `https://${raw}`;
}
