import { useState } from "react";
import type { CSSProperties } from "react";
import type { Work } from "../types";
import { WorkMedia } from "./WorkMedia";
import { useViewMode } from "../context/ViewModeContext";
import { useReveal } from "../hooks/useReveal";
import { haptic } from "../lib/haptics";
import { hashTargetId } from "../lib/hashTarget";

interface WorkCardProps {
  work: Work;
  onOpen: (work: Work) => void;
  /** 一覧の先頭で大きく見せる代表作カード(横型レイアウト) */
  featured?: boolean;
  /** グリッド内の入場順。スクロール時にわずかなstaggerを付ける */
  order?: number;
}

export function WorkCard({ work, onOpen, featured = false, order = 0 }: WorkCardProps) {
  const { mode } = useViewMode();
  // ハッシュジャンプ(/works#work-{id})の着地先カードは、reveal待ちにせず最初から表示する。
  // マウント時に一度だけ判定し、後のハッシュ変化で表示が消えないよう固定する
  const [isHashTarget] = useState(() => hashTargetId(window.location.hash) === `work-${work.id}`);
  const ref = useReveal<HTMLElement>(isHashTarget);
  const revealClass = isHashTarget ? "reveal is-visible" : "reveal";
  const revealStyle = { "--reveal-index": Math.min(order, 8) } as CSSProperties;

  const openWork = () => {
    haptic(8);
    onOpen(work);
  };

  const toolsList = (
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
  );

  const deepInfo = mode === "deep" && (
    <dl className="mt-4 space-y-3 text-xs leading-relaxed text-(--ink-soft)">
      <div>
        <dt className="spec-label mb-1.5">気になっていたこと</dt>
        <dd>{work.problem}</dd>
      </div>
      <div>
        <dt className="spec-label mb-1.5">言い直した問い</dt>
        <dd className="serif text-[0.8rem]">{work.reframing}</dd>
      </div>
      <div>
        <dt className="spec-label mb-1.5">やったこと</dt>
        <dd>{work.processShort}</dd>
      </div>
    </dl>
  );

  if (featured) {
    return (
      <article
        ref={ref}
        id={`work-${work.id}`}
        style={revealStyle}
        className={`${revealClass} work-card group scroll-mt-24 border border-(--line-strong) bg-(--paper) transition-[box-shadow,transform,border-color] duration-300 hover:-translate-y-0.5 hover:shadow-[0_2px_24px_rgba(17,17,19,0.08)] focus-within:border-(--ink) md:flex`}
      >
        {/* ビジュアル(実写画像。未配置の作品はSVGビジュアルで成立) */}
        <div className="work-visual aspect-5/3 md:aspect-auto md:w-1/2 md:border-b-0 md:border-r md:border-(--line)">
          <WorkMedia work={work} variant="card" />
        </div>

        <div className="flex grow flex-col p-5 md:w-1/2 md:p-8">
          <p className="spec-label mb-2">Featured Work</p>
          <p className="spec-label mb-1.5">{work.category}</p>
          <h3 className="text-2xl font-bold tracking-wide">
            {work.title}
            {work.titleEn && (
              <span className="en ml-2 text-xs font-normal text-(--gray-4)">{work.titleEn}</span>
            )}
          </h3>
          <p className="mt-1 text-sm font-medium text-(--ink-soft)">{work.oneLiner}</p>

          {/* 面談などで先に見てほしいところ */}
          <div className="mt-4 border-l-2 border-(--ink) bg-(--gray-1) p-3">
            <p className="spec-label mb-1.5">見てほしいところ</p>
            <p className="text-xs leading-relaxed text-(--ink-soft)">{work.recruiterSummary}</p>
          </div>

          {deepInfo}
          {toolsList}

          <div className="mt-auto pt-5">
            <button
              type="button"
              aria-label={`${work.title}のケーススタディを読む`}
              onClick={openWork}
              className="btn btn-solid w-full md:w-auto"
            >
              ケーススタディを読む →
            </button>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      ref={ref}
      id={`work-${work.id}`}
      style={revealStyle}
      className={`${revealClass} work-card group flex scroll-mt-24 flex-col border border-(--line) bg-(--paper) transition-[box-shadow,transform,border-color] duration-300 hover:-translate-y-0.5 hover:border-(--line-strong) hover:shadow-[0_2px_24px_rgba(17,17,19,0.08)] focus-within:border-(--ink)`}
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

        {/* 面談などで先に見てほしいところ */}
        <div className="mt-4 border-l-2 border-(--ink) bg-(--gray-1) p-3">
          <p className="spec-label mb-1.5">見てほしいところ</p>
          <p className="text-xs leading-relaxed text-(--ink-soft)">{work.recruiterSummary}</p>
        </div>

        {deepInfo}
        {toolsList}

        <div className="mt-auto pt-5">
          <button
            type="button"
            aria-label={`${work.title}のケーススタディを読む`}
            onClick={openWork}
            className="btn btn-ghost w-full"
          >
            ケーススタディを読む →
          </button>
        </div>
      </div>
    </article>
  );
}
