import { lazy, Suspense, useEffect, useRef } from "react";
import type { CSSProperties, PointerEvent } from "react";
import { Link } from "react-router-dom";
import { VoxelField } from "../components/VoxelField";
import type { RollDir } from "../components/VoxelScene3D";
import { profile } from "../data/profile";
import { useViewMode } from "../context/ViewModeContext";
import { usePageTitle } from "../hooks/usePageTitle";

const VoxelScene3D = lazy(() => import("../components/VoxelScene3D"));

/**
 * 第一印象のページ。名前を覚えさせ、ボクセルフィールドで遊ばせ、Works/Careerへ送る。
 * 情報量はあえて絞り、仕掛け(転がしインタラクション)への導線だけを添える。
 */
export function HomePage() {
  usePageTitle("山根瑛之輔 Portfolio | 見え方とルールの試作");
  const { mode } = useViewMode();
  const rollRef = useRef<((dir: RollDir) => void) | null>(null);
  const heroFrameRef = useRef<number | null>(null);
  const heroPointerRef = useRef<{ element: HTMLElement; x: number; y: number } | null>(null);

  const moveHero = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType === "touch") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    heroPointerRef.current = { element: e.currentTarget, x, y };

    if (heroFrameRef.current !== null) return;
    heroFrameRef.current = requestAnimationFrame(() => {
      const next = heroPointerRef.current;
      heroFrameRef.current = null;
      if (!next) return;
      next.element.style.setProperty("--hero-far-x", `${(-18 * next.x).toFixed(2)}px`);
      next.element.style.setProperty("--hero-far-y", `${(-12 * next.y).toFixed(2)}px`);
      next.element.style.setProperty("--hero-near-x", `${(12 * next.x).toFixed(2)}px`);
      next.element.style.setProperty("--hero-near-y", `${(8 * next.y).toFixed(2)}px`);
      next.element.style.setProperty("--hero-copy-x", `${(-6 * next.x).toFixed(2)}px`);
      next.element.style.setProperty("--hero-copy-y", `${(-4 * next.y).toFixed(2)}px`);
    });
  };

  const resetHero = (e: PointerEvent<HTMLElement>) => {
    heroPointerRef.current = null;
    if (heroFrameRef.current !== null) {
      cancelAnimationFrame(heroFrameRef.current);
      heroFrameRef.current = null;
    }
    e.currentTarget.style.setProperty("--hero-far-x", "0px");
    e.currentTarget.style.setProperty("--hero-far-y", "0px");
    e.currentTarget.style.setProperty("--hero-near-x", "0px");
    e.currentTarget.style.setProperty("--hero-near-y", "0px");
    e.currentTarget.style.setProperty("--hero-copy-x", "0px");
    e.currentTarget.style.setProperty("--hero-copy-y", "0px");
  };

  useEffect(() => {
    return () => {
      if (heroFrameRef.current !== null) cancelAnimationFrame(heroFrameRef.current);
    };
  }, []);

  return (
    <section
      id="top"
      className="hero-scene relative flex min-h-svh flex-col justify-end overflow-hidden"
      onPointerMove={moveHero}
      onPointerLeave={resetHero}
      style={
        {
          "--hero-far-x": "0px",
          "--hero-far-y": "0px",
          "--hero-near-x": "0px",
          "--hero-near-y": "0px",
          "--hero-copy-x": "0px",
          "--hero-copy-y": "0px",
        } as CSSProperties
      }
    >
      {/* 背景: カーソル/クリックに反応するボクセルフィールド。読ませつつ、作品の気配は消しすぎない。 */}
      <div className="absolute inset-0" aria-hidden="true">
        <div className="hero-layer-near absolute inset-0 opacity-100">
          <Suspense fallback={<VoxelField />}>
            <VoxelScene3D rollRef={rollRef} />
          </Suspense>
        </div>
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,var(--paper)_0%,rgba(253,253,252,0.92)_26%,rgba(253,253,252,0.42)_52%,transparent_78%)]" />
        {/* テキスト可読性のためのグラデーション(canvasへのクリックを妨げないようpointer-events無効) */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-(--paper) via-(--paper)/60 to-(--paper)/10" />
      </div>

      <div className="hero-copy container-site relative pt-28 pb-16 md:pb-20">
        <p className="spec-label mb-4">Portfolio — Perception as Interface</p>
        <h1 className="mb-2 text-5xl leading-tight font-bold tracking-wide md:text-7xl">
          {profile.name}
        </h1>
        <p className="mb-8 text-sm text-(--ink-soft) md:text-base">
          {profile.titleJa}
          <span className="en ml-2 hidden text-xs text-(--gray-4) sm:inline md:text-sm">
            / {profile.title}
          </span>
        </p>
        <p className="serif max-w-2xl text-lg leading-loose md:text-xl">
          {profile.heroStatement[0]}
          <br />
          {profile.heroStatement[1]}
        </p>

        {/* 仕掛けの誘い: 転がしインタラクションへの導線 */}
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <span className="spec-label">ROLL</span>
          <button
            type="button"
            onClick={() => rollRef.current?.("left")}
            aria-label="左に転がす"
            className="btn btn-ghost h-10 w-10"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => rollRef.current?.("up")}
            aria-label="上に転がす"
            className="btn btn-ghost h-10 w-10"
          >
            ↑
          </button>
          <button
            type="button"
            onClick={() => rollRef.current?.("down")}
            aria-label="下に転がす"
            className="btn btn-ghost h-10 w-10"
          >
            ↓
          </button>
          <button
            type="button"
            onClick={() => rollRef.current?.("right")}
            aria-label="右に転がす"
            className="btn btn-ghost h-10 w-10"
          >
            →
          </button>
          <span className="hidden text-xs text-(--gray-4) sm:inline">背景をクリックしても転がります</span>
        </div>

        {/* 短く読むモード用の即読サマリー */}
        {mode === "quick" && (
          <dl className="caption-box mt-10 grid max-w-3xl overflow-hidden gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
            <div className="min-w-0">
              <dt className="spec-label mb-1.5">Who</dt>
              <dd className="text-anywhere leading-relaxed">{profile.quickScan.person}</dd>
            </div>
            <div className="min-w-0">
              <dt className="spec-label mb-1.5">Representative Works</dt>
              <dd className="text-anywhere leading-relaxed">{profile.quickScan.representative}</dd>
            </div>
            <div className="min-w-0">
              <dt className="spec-label mb-1.5">Tech</dt>
              <dd className="text-anywhere leading-relaxed">{profile.quickScan.tech}</dd>
            </div>
            <div className="min-w-0">
              <dt className="spec-label mb-1.5">Target Fields</dt>
              <dd className="text-anywhere leading-relaxed">{profile.quickScan.target}</dd>
            </div>
          </dl>
        )}

        <div className="mt-10 flex items-center gap-6">
          <Link to="/works" className="btn btn-solid">
            作品を見る
          </Link>
          <Link
            to="/career"
            className="text-sm text-(--gray-5) underline underline-offset-4 transition-colors hover:text-(--ink)"
          >
            仕事での活かし方 →
          </Link>
        </div>
      </div>
    </section>
  );
}
