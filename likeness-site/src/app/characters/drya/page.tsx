import type { Metadata } from "next";
import { CharacterDetail } from "@/components/companion/CharacterDetail";
import { socialCard } from "@/lib/base";

const title = "DRYA // Character Dossier — LIKENESS";
const description = "Character identity, production status and source-authority notes for DRYA in LIKENESS : THE GAME.";

export const metadata: Metadata = {
  title, description,
  ...socialCard("characters", title, description),
};

export default function CharacterPage() {
  return <main><CharacterDetail slug="drya" /></main>;
}
