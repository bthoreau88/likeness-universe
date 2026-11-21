import type { Metadata } from "next";
import { PromptLibrary } from "@/components/prompts/PromptLibrary";

// FD-003 (OVS-LKN-COORD-G01): the prompt library is an internal OVS production
// resource. It is removed from public navigation and the sitemap and marked
// noindex. NOTE: this is not access control — on a static GitHub Pages export
// the route and its data stay reachable by direct URL. See the G01 audit.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "Master Visual Prompt Library // OVS — TAPE 03",
  description:
    "52 paste-ready shot orders in the OVS six-part skeleton — key art, characters, environments, object macros, tape footage, reality-shift, UI, marketing. Built for Midjourney, Flux, Seedance.",
};

export default function PromptsPage() {
  return (
    <main className="grain min-h-screen">
      <PromptLibrary />
    </main>
  );
}
