import { ViewModeProvider } from "./context/ViewModeContext";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { WorksSection } from "./components/WorksSection";
import { SkillMap } from "./components/SkillMap";
import { ProcessTimeline } from "./components/ProcessTimeline";
import { CareerFit } from "./components/CareerFit";
import { Contact } from "./components/Contact";

export default function App() {
  return (
    <ViewModeProvider>
      <a
        href="#about"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-100 focus:bg-(--ink) focus:px-4 focus:py-2 focus:text-(--paper)"
      >
        本文へスキップ
      </a>
      <Header />
      <main>
        <Hero />
        <About />
        <WorksSection />
        <SkillMap />
        <ProcessTimeline />
        <CareerFit />
      </main>
      <Contact />
    </ViewModeProvider>
  );
}
