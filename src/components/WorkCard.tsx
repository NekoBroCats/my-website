import { useEffect, useRef, useState } from "react";
import type { CSSProperties, FocusEvent, MouseEvent, PointerEvent } from "react";
import type { Work } from "../types";
import { WorkMedia } from "./WorkMedia";
import { useViewMode } from "../context/ViewModeContext";
import { useReveal } from "../hooks/useReveal";
import { haptic } from "../lib/haptics";
import { hashTargetId } from "../lib/hashTarget";

export interface LaunchRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

interface WorkCardProps {
  work: Work;
  onOpen: (work: Work, origin: LaunchRect | null) => void;
  /** 一覧の先頭で大きく見せる代表作カード(横型レイアウト) */
  featured?: boolean;
  /** グリッド内の入場順。スクロール時にわずかなstaggerを付ける */
  order?: number;
  isActive?: boolean;
  isDimmed?: boolean;
  onFocusChange?: (workId: string | null) => void;
}

export function WorkCard({
  work,
  onOpen,
  featured = false,
  order = 0,
  isActive = false,
  isDimmed = false,
  onFocusChange,
}: WorkCardProps) {
  const { mode } = useViewMode();
  // ハッシュジャンプ(/works#work-{id})の着地先カードは、reveal待ちにせず最初から表示する。
  // マウント時に一度だけ判定し、後のハッシュ変化で表示が消えないよう固定する
  const [isHashTarget] = useState(() => hashTargetId(window.location.hash) === `work-${work.id}`);
  const [isWorksPage] = useState(() => window.location.pathname.endsWith("/works"));
  const shouldRevealImmediately = isHashTarget || isWorksPage;
  const ref = useReveal<HTMLElement>(shouldRevealImmediately);
  const launchTimerRef = useRef<number | null>(null);
  const [isLaunching, setIsLaunching] = useState(false);
  const revealClass = shouldRevealImmediately ? "reveal is-visible" : "reveal";
  const revealStyle = {
    "--reveal-index": Math.min(order, 8),
    "--spot-x": "50%",
    "--spot-y": "45%",
    "--tilt-x": "0deg",
    "--tilt-y": "0deg",
  } as CSSProperties;

  const motionStateClass = `${isActive ? "is-active" : ""} ${isDimmed ? "is-dimmed" : ""} ${
    isLaunching ? "is-launching" : ""
  }`;

  useEffect(() => {
    return () => {
      if (launchTimerRef.current !== null) {
        window.clearTimeout(launchTimerRef.current);
      }
    };
  }, []);

  const openWork = (e: MouseEvent<HTMLButtonElement>) => {
    haptic(8);
    onFocusChange?.(work.id);
    setIsLaunching(true);
    const card = e.currentTarget.closest<HTMLElement>(".work-card");
    const rect = card?.getBoundingClientRect();
    const origin = rect
      ? {
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height,
        }
      : null;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    launchTimerRef.current = window.setTimeout(
      () => {
        onOpen(work, origin);
        setIsLaunching(false);
      },
      prefersReducedMotion ? 0 : 150,
    );
  };

  const focusCard = () => onFocusChange?.(work.id);
  const clearCard = () => onFocusChange?.(null);

  const moveCard = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType === "touch") return;
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    el.style.setProperty("--spot-x", `${(x * 100).toFixed(1)}%`);
    el.style.setProperty("--spot-y", `${(y * 100).toFixed(1)}%`);
    el.style.setProperty("--tilt-x", `${((x - 0.5) * 5).toFixed(2)}deg`);
    el.style.setProperty("--tilt-y", `${((0.5 - y) * 4).toFixed(2)}deg`);
  };

  const leaveCard = (e: PointerEvent<HTMLElement>) => {
    e.currentTarget.style.setProperty("--spot-x", "50%");
    e.currentTarget.style.setProperty("--spot-y", "45%");
    e.currentTarget.style.setProperty("--tilt-x", "0deg");
    e.currentTarget.style.setProperty("--tilt-y", "0deg");
    clearCard();
  };

  const blurCard = (e: FocusEvent<HTMLElement>) => {
    if (e.currentTarget.contains(e.relatedTarget as Node | null)) return;
    clearCard();
  };

  const toolsList = (
    <ul className="mt-4 flex min-w-0 flex-wrap gap-1.5" aria-label="使用技術・素材">
      {work.tools.map((tool) => (
        <li
          key={tool}
          className="text-anywhere min-w-0 rounded-full border border-(--line) px-2.5 py-0.5 text-[0.675rem] text-(--gray-5)"
        >
          {tool}
        </li>
      ))}
    </ul>
  );

  const deepInfo = mode === "deep" && (
    <dl className="mt-4 min-w-0 space-y-3 text-xs leading-relaxed text-(--ink-soft)">
      <div>
        <dt className="spec-label mb-1.5">気になっていたこと</dt>
        <dd className="text-anywhere">{work.problem}</dd>
      </div>
      <div>
        <dt className="spec-label mb-1.5">言い直した問い</dt>
        <dd className="serif text-anywhere text-[0.8rem]">{work.reframing}</dd>
      </div>
      <div>
        <dt className="spec-label mb-1.5">やったこと</dt>
        <dd className="text-anywhere">{work.processShort}</dd>
      </div>
    </dl>
  );

  if (featured) {
    return (
      <article
        ref={ref}
        id={`work-${work.id}`}
        style={revealStyle}
        onPointerEnter={focusCard}
        onPointerMove={moveCard}
        onPointerLeave={leaveCard}
        onFocus={focusCard}
        onBlur={blurCard}
        className={`${revealClass} ${motionStateClass} work-card group scroll-mt-24 border border-(--line-strong) bg-(--paper) transition-[box-shadow,transform,border-color,opacity,filter] duration-300 focus-within:border-(--ink) md:flex`}
      >
        {/* ビジュアル(実写画像。未配置の作品はSVGビジュアルで成立) */}
        <div className="work-visual aspect-5/3 md:aspect-auto md:w-1/2 md:border-b-0 md:border-r md:border-(--line)">
          <WorkMedia work={work} variant="card" priority />
        </div>

        <div className="flex min-w-0 grow flex-col p-5 md:w-1/2 md:p-8">
          <p className="spec-label mb-2">Featured Work</p>
          <p className="spec-label mb-1.5">{work.category}</p>
          <h3 className="text-anywhere text-2xl font-bold tracking-wide">
            {work.title}
            {work.titleEn && (
              <span className="en mt-1 block text-xs font-normal text-(--gray-4) sm:ml-2 sm:inline">
                {work.titleEn}
              </span>
            )}
          </h3>
          <p className="text-anywhere mt-1 text-sm font-medium text-(--ink-soft)">{work.oneLiner}</p>

          {/* 面談などで先に見てほしいところ */}
          <div className="mt-4 border-l-2 border-(--ink) bg-(--gray-1) p-3">
            <p className="spec-label mb-1.5">見てほしいところ</p>
            <p className="text-anywhere text-xs leading-relaxed text-(--ink-soft)">{work.recruiterSummary}</p>
          </div>

          {deepInfo}
          {toolsList}

          <div className="mt-auto pt-5">
            <button
              type="button"
              aria-label={`${work.title}のケーススタディを読む`}
              onClick={openWork}
              aria-busy={isLaunching}
              disabled={isLaunching}
              className="case-study-cta btn btn-solid w-full md:w-auto"
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
      onPointerEnter={focusCard}
      onPointerMove={moveCard}
      onPointerLeave={leaveCard}
      onFocus={focusCard}
      onBlur={blurCard}
      className={`${revealClass} ${motionStateClass} work-card group flex scroll-mt-24 flex-col border border-(--line) bg-(--paper) transition-[box-shadow,transform,border-color,opacity,filter] duration-300 hover:border-(--line-strong) focus-within:border-(--ink)`}
    >
      {/* ビジュアル(実写画像。未配置の作品はSVGビジュアルで成立) */}
      <div className="work-visual aspect-5/3">
        <WorkMedia work={work} variant="card" />
      </div>

      <div className="flex min-w-0 grow flex-col p-5 md:p-6">
        <p className="spec-label mb-1.5">{work.category}</p>
        <h3 className="text-anywhere text-xl font-bold tracking-wide">
          {work.title}
          {work.titleEn && (
            <span className="en mt-1 block text-xs font-normal text-(--gray-4) sm:ml-2 sm:inline">
              {work.titleEn}
            </span>
          )}
        </h3>
        <p className="text-anywhere mt-1 text-sm font-medium text-(--ink-soft)">{work.oneLiner}</p>

        {/* 面談などで先に見てほしいところ */}
        <div className="mt-4 border-l-2 border-(--ink) bg-(--gray-1) p-3">
          <p className="spec-label mb-1.5">見てほしいところ</p>
          <p className="text-anywhere text-xs leading-relaxed text-(--ink-soft)">{work.recruiterSummary}</p>
        </div>

        {deepInfo}
        {toolsList}

        <div className="mt-auto pt-5">
          <button
            type="button"
            aria-label={`${work.title}のケーススタディを読む`}
            onClick={openWork}
            aria-busy={isLaunching}
            disabled={isLaunching}
            className="case-study-cta btn btn-ghost w-full"
          >
            ケーススタディを読む →
          </button>
        </div>
      </div>
    </article>
  );
}
