import type { MetadataRoute } from "next";
import { SITE_ORIGIN, BASE_PATH } from "@/lib/base";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: `${BASE_PATH}/prompts/` },
    sitemap: `${SITE_ORIGIN}${BASE_PATH}/sitemap.xml`,
  };
}
