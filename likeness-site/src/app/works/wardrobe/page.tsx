import type { Metadata } from "next";
import { WorkDetail } from "@/components/companion/WorkDetail";
import { socialCard } from "@/lib/base";

const title = "Wardrobe // Selected Works — OVS";
const description = "Production archive and selected imagery for Wardrobe in the LIKENESS universe.";

export const metadata: Metadata = {
  title, description,
  ...socialCard("home", title, description),
};

export default function WorkPage() {
  return <main><WorkDetail workId="WORK_OVS_FASHION" /></main>;
}
