import { useState } from "react";
import type { PointerEvent } from "react";
import { SectionHeader } from "./SectionHeader";
import { WorkCard } from "./WorkCard";
import type { LaunchRect } from "./WorkCard";
import { WorkDetail } from "./WorkDetail";
import { works } from "../data/works";
import type { Work } from "../types";

interface DetailLaunch {
  work: Work;
  origin: LaunchRect | null;
}

export function WorksSection() {
  const [openWork, setOpenWork] = useState<DetailLaunch | null>(null);
  const [focusedWorkId, setFocusedWorkId] = useState<string | null>(null);

  // 代表作(featured=trueの先頭1件)はグリッドの上に横型カードで表示し、グリッドからは除外する
  const featuredWork = works.find((work) => work.featured);
  const restWorks = featuredWork ? works.filter((work) => work.id !== featuredWork.id) : works;

  const moveStage = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "touch") return;
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--stage-x", `${(e.clientX - rect.left).toFixed(1)}px`);
    e.currentTarget.style.setProperty("--stage-y", `${(e.clientY - rect.top).toFixed(1)}px`);
  };

  const leaveStage = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "touch") return;
    setFocusedWorkId(null);
  };

  const openDetail = (work: Work, origin: LaunchRect | null) => {
    setOpenWork({ work, origin });
  };

  return (
    <section id="works" className="border-y border-(--line) bg-(--gray-1)">
      <div
        className={`works-stage container-site ${focusedWorkId ? "is-focusing" : ""}`}
        onPointerMove={moveStage}
        onPointerLeave={leaveStage}
        style={{ paddingBlock: "var(--section-gap)" }}
      >
        <SectionHeader
          index="02"
          en="Works / Case Studies"
          ja="作品"
          quickSummary="まずVOXEL ROW。ほかも、迷ったところから読めます。"
        />

        {featuredWork && (
          <div className="mb-6">
            <WorkCard
              work={featuredWork}
              onOpen={openDetail}
              featured
              order={0}
              isActive={focusedWorkId === featuredWork.id}
              isDimmed={focusedWorkId !== null && focusedWorkId !== featuredWork.id}
              onFocusChange={setFocusedWorkId}
            />
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {restWorks.map((work, i) => (
            <WorkCard
              key={work.id}
              work={work}
              onOpen={openDetail}
              order={i + 1}
              isActive={focusedWorkId === work.id}
              isDimmed={focusedWorkId !== null && focusedWorkId !== work.id}
              onFocusChange={setFocusedWorkId}
            />
          ))}
        </div>
      </div>

      {openWork && (
        <WorkDetail
          work={openWork.work}
          launchRect={openWork.origin}
          onClose={() => setOpenWork(null)}
        />
      )}
    </section>
  );
}
