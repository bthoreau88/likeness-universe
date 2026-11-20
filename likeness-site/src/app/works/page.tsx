import type { Metadata } from "next";
import { WorksIndex } from "@/components/companion/WorksIndex";
import { FollowCTA } from "@/components/sections/FollowCTA";
import { socialCard } from "@/lib/base";

const title = "Selected Works // LIKENESS Universe — OVS";
const description = "The work behind LIKENESS: the game, Tape 03, wardrobe and score. An editorial archive from Omnia Vanitas Studios.";

export const metadata: Metadata = {
  title, description,
  ...socialCard("home", title, description),
};

export default function WorksPage() {
  return (
    <main>
      <WorksIndex />
      <FollowCTA variant="compact" />
    </main>
  );
}
