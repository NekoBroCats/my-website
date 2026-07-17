import { useState } from "react";
import type { PointerEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { SectionHeader } from "./SectionHeader";
import { WorkCard } from "./WorkCard";
import type { LaunchRect } from "./WorkCard";
import { WorkDetail } from "./WorkDetail";
import { works } from "../data/works";
import type { Work } from "../types";

export function WorksSection() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [launchOrigin, setLaunchOrigin] = useState<LaunchRect | null>(null);
  const [focusedWorkId, setFocusedWorkId] = useState<string | null>(null);
  const selectedWork = works.find((work) => work.id === searchParams.get("work")) ?? null;

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
    setLaunchOrigin(origin);
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      next.set("work", work.id);
      return next;
    });
  };

  const closeDetail = () => {
    setLaunchOrigin(null);
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current);
        next.delete("work");
        return next;
      },
      { replace: true },
    );
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

      {selectedWork && (
        <WorkDetail
          work={selectedWork}
          launchRect={launchOrigin}
          onClose={closeDetail}
        />
      )}
    </section>
  );
}
