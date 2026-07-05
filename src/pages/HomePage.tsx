import { useCallback, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { VoxelField, type Gravity } from "../components/VoxelField";
import { profile } from "../data/profile";
import { useViewMode } from "../context/ViewModeContext";
import { usePageTitle } from "../hooks/usePageTitle";

const gravityArrows = ["↓", "←", "↑", "→"] as const;

/**
 * 第一印象のページ。名前を覚えさせ、ボクセルフィールドで遊ばせ、Works/Careerへ送る。
 * 情報量はあえて絞り、仕掛け(重力インタラクション)への導線だけを添える。
 */
export function HomePage() {
  usePageTitle("山根瑛之輔 Portfolio | Perception Designer / Prototype Creator");
  const { mode } = useViewMode();
  const rotateRef = useRef<(() => void) | null>(null);
  const [gravityDir, setGravityDir] = useState<Gravity>(null);

  const handleGravityChange = useCallback((dir: Gravity) => {
    setGravityDir(dir);
  }, []);

  const arrow = gravityDir === null ? "↓" : gravityArrows[gravityDir];

  return (
    <section id="top" className="relative flex min-h-svh flex-col justify-end overflow-hidden">
      {/* 背景: カーソル/クリックに反応するボクセルフィールド(文字の可読性を優先し10%減光) */}
      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 opacity-90">
          <VoxelField onGravityChange={handleGravityChange} rotateRef={rotateRef} />
        </div>
        {/* テキスト可読性のためのグラデーション(canvasへのクリックを妨げないようpointer-events無効) */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-(--paper) via-(--paper)/70 to-(--paper)/30" />
      </div>

      <div className="container-site relative pt-28 pb-16 md:pb-20">
        <p className="spec-label mb-4">Portfolio — Perception as Interface</p>
        <h1 className="mb-2 text-5xl leading-tight font-bold tracking-wide md:text-7xl">
          {profile.name}
        </h1>
        <p className="en mb-8 text-sm text-(--ink-soft) md:text-base">
          {profile.title}
        </p>
        <p className="serif max-w-2xl text-lg leading-loose md:text-xl">
          {profile.heroStatement[0]}
          <br />
          {profile.heroStatement[1]}
        </p>

        {/* 仕掛けの誘い: 重力インタラクションへの導線 */}
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => rotateRef.current?.()}
            className="btn btn-ghost text-xs"
          >
            重力を回す {arrow}
          </button>
          <span className="text-xs text-(--gray-4)">背景をクリックしても回ります</span>
        </div>

        {/* Quick Scan: 採用担当者向けの即読サマリー */}
        {mode === "quick" && (
          <dl className="caption-box mt-10 grid max-w-3xl gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="spec-label mb-1.5">Who</dt>
              <dd className="leading-relaxed">{profile.quickScan.person}</dd>
            </div>
            <div>
              <dt className="spec-label mb-1.5">Representative Works</dt>
              <dd className="leading-relaxed">{profile.quickScan.representative}</dd>
            </div>
            <div>
              <dt className="spec-label mb-1.5">Tech</dt>
              <dd className="leading-relaxed">{profile.quickScan.tech}</dd>
            </div>
            <div>
              <dt className="spec-label mb-1.5">Target Fields</dt>
              <dd className="leading-relaxed">{profile.quickScan.target}</dd>
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
