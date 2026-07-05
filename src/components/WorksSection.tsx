import { useState } from "react";
import { SectionHeader } from "./SectionHeader";
import { WorkCard } from "./WorkCard";
import { WorkDetail } from "./WorkDetail";
import { works } from "../data/works";
import type { Work } from "../types";

export function WorksSection() {
  const [openWork, setOpenWork] = useState<Work | null>(null);

  // 代表作(featured=trueの先頭1件)はグリッドの上に横型カードで表示し、グリッドからは除外する
  const featuredWork = works.find((work) => work.featured);
  const restWorks = featuredWork ? works.filter((work) => work.id !== featuredWork.id) : works;

  return (
    <section id="works" className="border-y border-(--line) bg-(--gray-1)">
      <div className="container-site" style={{ paddingBlock: "var(--section-gap)" }}>
        <SectionHeader
          index="02"
          en="Works / Case Studies"
          ja="作品"
          quickSummary="まずVOXEL ROW / YONもく。ほかの作品も、迷ったところや試したところから読めるようにしています。"
        />

        {featuredWork && (
          <div className="mb-6">
            <WorkCard work={featuredWork} onOpen={setOpenWork} featured order={0} />
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {restWorks.map((work, i) => (
            <WorkCard key={work.id} work={work} onOpen={setOpenWork} order={i + 1} />
          ))}
        </div>
      </div>

      {openWork && <WorkDetail work={openWork} onClose={() => setOpenWork(null)} />}
    </section>
  );
}
