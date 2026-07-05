import { useState } from "react";
import { SectionHeader } from "./SectionHeader";
import { WorkCard } from "./WorkCard";
import { WorkDetail } from "./WorkDetail";
import { works } from "../data/works";
import type { Work } from "../types";

export function WorksSection() {
  const [openWork, setOpenWork] = useState<Work | null>(null);

  return (
    <section id="works" className="border-y border-(--line) bg-(--gray-1)">
      <div className="container-site" style={{ paddingBlock: "var(--section-gap)" }}>
        <SectionHeader
          index="02"
          en="Works / Case Studies"
          ja="作品"
          quickSummary="各作品は「何を証明しているか」で読めます。カード内の Recruiter Lens が能力証明の要約です。"
        />

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {works.map((work) => (
            <WorkCard key={work.id} work={work} onOpen={setOpenWork} />
          ))}
        </div>
      </div>

      {openWork && <WorkDetail work={openWork} onClose={() => setOpenWork(null)} />}
    </section>
  );
}
