import type { Work } from "../types";
import { WorkMedia } from "./WorkMedia";
import { useViewMode } from "../context/ViewModeContext";
import { useReveal } from "../hooks/useReveal";

interface WorkCardProps {
  work: Work;
  onOpen: (work: Work) => void;
}

export function WorkCard({ work, onOpen }: WorkCardProps) {
  const { mode } = useViewMode();
  const ref = useReveal<HTMLElement>();

  return (
    <article
      ref={ref}
      id={`work-${work.id}`}
      className="reveal group flex scroll-mt-24 flex-col border border-(--line) bg-(--paper) transition-shadow hover:shadow-[0_2px_24px_rgba(17,17,19,0.08)]"
    >
      {/* ビジュアル(実写画像。未配置の作品はSVGビジュアルで成立) */}
      <div className="work-visual aspect-5/3">
        <WorkMedia work={work} variant="card" />
      </div>

      <div className="flex grow flex-col p-5 md:p-6">
        <p className="spec-label mb-1.5">{work.category}</p>
        <h3 className="text-xl font-bold tracking-wide">
          {work.title}
          {work.titleEn && (
            <span className="en ml-2 text-xs font-normal text-(--gray-4)">{work.titleEn}</span>
          )}
        </h3>
        <p className="mt-1 text-sm font-medium text-(--ink-soft)">{work.oneLiner}</p>

        {/* Recruiter Lens: この作品が何の能力証明かを一瞬で見せる */}
        <div className="mt-4 border-l-2 border-(--ink) bg-(--gray-1) p-3">
          <p className="spec-label mb-1.5">Recruiter Lens</p>
          <p className="text-xs leading-relaxed text-(--ink-soft)">{work.recruiterSummary}</p>
        </div>

        {mode === "deep" && (
          <dl className="mt-4 space-y-3 text-xs leading-relaxed text-(--ink-soft)">
            <div>
              <dt className="spec-label mb-1.5">問題意識</dt>
              <dd>{work.problem}</dd>
            </div>
            <div>
              <dt className="spec-label mb-1.5">再定義した問い</dt>
              <dd className="serif text-[0.8rem]">{work.reframing}</dd>
            </div>
            <div>
              <dt className="spec-label mb-1.5">制作プロセス</dt>
              <dd>{work.processShort}</dd>
            </div>
          </dl>
        )}

        <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="使用技術・素材">
          {work.tools.map((tool) => (
            <li
              key={tool}
              className="rounded-full border border-(--line) px-2.5 py-0.5 text-[0.675rem] text-(--gray-5)"
            >
              {tool}
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-5">
          <button
            type="button"
            onClick={() => onOpen(work)}
            className="w-full border border-(--ink) py-2.5 text-sm transition-colors group-hover:bg-(--ink) group-hover:text-(--paper) hover:bg-(--ink) hover:text-(--paper)"
          >
            ケーススタディを読む →
          </button>
        </div>
      </div>
    </article>
  );
}
