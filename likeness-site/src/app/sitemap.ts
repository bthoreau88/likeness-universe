import type { MetadataRoute } from "next";
import { SITE_ORIGIN, BASE_PATH } from "@/lib/base";

// All live routes. Absolute URLs (origin + base path) as sitemaps require.
const ROUTES = [
  "",
  "/works",
  "/works/the-game",
  "/works/tape-03",
  "/works/wardrobe",
  "/works/score",
  "/characters/thoreau",
  "/characters/drya",
  "/characters/the-other",
  "/universe",
  "/studio",
  "/characters",
  "/street",
  "/wardrobe",
  "/score",
  "/journey",
  "/room-testifies",
  "/room-14",
  "/tapes",
  "/motel",
  "/evidence",
  "/devlog",
  "/press",
  "/prompts",
  "/alt",
];

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = `${SITE_ORIGIN}${BASE_PATH}`;
  return ROUTES.map((r) => ({
    url: `${base}${r}/`,
    changeFrequency: "monthly",
    priority: r === "" ? 1 : 0.7,
  }));
}
