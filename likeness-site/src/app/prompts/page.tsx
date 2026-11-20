import type { Metadata } from "next";
import { PromptLibrary } from "@/components/prompts/PromptLibrary";

export const metadata: Metadata = {
  title: "Master Visual Prompt Library // OVS — TAPE 03",
  description:
    "52 paste-ready shot orders in the OVS six-part skeleton — key art, characters, environments, object macros, tape footage, reality-shift, UI, marketing. Built for Midjourney, Flux, Seedance.",
  // Internal OVS production library (FD-003): kept, but not linked or indexed.
  robots: { index: false, follow: false },
};

export default function PromptsPage() {
  return (
    <main className="grain min-h-screen">
      <PromptLibrary />
    </main>
  );
}
