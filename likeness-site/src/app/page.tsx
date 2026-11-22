import { Navbar } from "@/components/ui/Navbar";
import { Hero } from "@/components/sections/Hero";
import { CinematicReveal } from "@/components/sections/CinematicReveal";
import { InDevelopment } from "@/components/sections/InDevelopment";
import { Subjects } from "@/components/sections/Subjects";
import { IdentityLock } from "@/components/sections/IdentityLock";
import { Dossier } from "@/components/sections/Dossier";
import { Stills } from "@/components/sections/Stills";
import { VisualDNA } from "@/components/sections/VisualDNA";
import { SceneCards } from "@/components/sections/SceneCards";
import { Apartment } from "@/components/sections/Apartment";
import { Evidence } from "@/components/sections/Evidence";
import { Motion } from "@/components/sections/Motion";
import { RecoveredFootage } from "@/components/sections/RecoveredFootage";
import { ConceptFrames } from "@/components/sections/ConceptFrames";
import { Systems } from "@/components/sections/Systems";
import { Threads } from "@/components/sections/Threads";
import { Choice } from "@/components/sections/Choice";
import { FollowCTA } from "@/components/sections/FollowCTA";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="top">
        <Hero />
        <div id="reveal">
          <CinematicReveal />
        </div>
        <InDevelopment />
        <Subjects />
        <IdentityLock />
        <Dossier />
        <Stills />
        <VisualDNA />
        <SceneCards />
        <Apartment />
        <Evidence />
        <Motion />
        <RecoveredFootage />
        <ConceptFrames />
        <Systems />
        <Threads />
        <Choice />
      </main>
      <FollowCTA />
      <Footer />
    </>
  );
}
