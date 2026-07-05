import { useEffect, useRef, useState } from "react";
import { SectionHeader } from "./SectionHeader";
import { processSteps } from "../data/process";
import type { ProcessStep } from "../types";
import { haptic } from "../lib/haptics";

/** 全ステップの中で最大のセル数。これに満たないステップは末尾セルを複製してパディングする */
const MAX_GLYPH_CELLS = Math.max(...processSteps.map((s) => s.glyph.length));

/**
 * グリフ配列を MAX_GLYPH_CELLS 件に揃える。
 * 不足分は最後のセルと同座標・opacity 0 のダミーとして埋め、
 * rect要素をインデックスでkeyし続けられるようにする(=モーフの土台)。
 */
function padGlyph(step: ProcessStep) {
  const last = step.glyph[step.glyph.length - 1];
  const padded = [...step.glyph];
  while (padded.length < MAX_GLYPH_CELLS) {
    padded.push({ x: last.x, y: last.y, tone: last.tone });
  }
  return padded.map((g, i) => ({ ...g, visible: i < step.glyph.length }));
}

/** 3x3グリッドのボクセルグリフ。ステップごとに配置が変形する */
function GlyphSvg({ step, active }: { step: ProcessStep; active: boolean }) {
  const size = 84;
  const cell = size / 3;
  const cells = padGlyph(step);
  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className="glyph-morph h-16 w-16 md:h-20 md:w-20"
      aria-hidden="true"
    >
      {/* 下地グリッド */}
      {Array.from({ length: 9 }, (_, i) => {
        const gx = (i % 3) * cell;
        const gy = Math.floor(i / 3) * cell;
        return (
          <rect
            key={i}
            x={gx + 1}
            y={gy + 1}
            width={cell - 2}
            height={cell - 2}
            fill="none"
            stroke="var(--line)"
            strokeWidth="1"
          />
        );
      })}
      {cells.map((g, i) => (
        <rect
          key={i}
          className="cell"
          x={g.x * cell + 4}
          y={g.y * cell + 4}
          width={cell - 8}
          height={cell - 8}
          fill={
            g.tone === "black"
              ? "var(--ink)"
              : g.tone === "gray"
                ? "var(--gray-4)"
                : "var(--paper)"
          }
          stroke="var(--ink)"
          strokeWidth={g.tone === "white" ? 1.25 : 0}
          opacity={active && g.visible ? 1 : 0}
        />
      ))}
    </svg>
  );
}

/**
 * 制作プロセスのタイムライン。
 * スクロールに応じて現在のステップがハイライトされ、グリフ(ボクセル配置)が変形していく。
 */
export function ProcessTimeline() {
  const [activeIndex, setActiveIndex] = useState(0);
  const stepRefs = useRef<(HTMLLIElement | null)[]>([]);
  // 初回マウント時は鳴らさず、スクロールでの変化時のみ触覚を鳴らすための前回値
  const prevIndexRef = useRef<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = stepRefs.current.indexOf(entry.target as HTMLLIElement);
            if (idx >= 0) setActiveIndex(idx);
          }
        }
      },
      { rootMargin: "-40% 0px -50% 0px" },
    );
    for (const el of stepRefs.current) {
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  // activeIndexの変化時のみ、タッチ端末(pointer: coarse)で軽い触覚を鳴らす
  useEffect(() => {
    if (prevIndexRef.current !== null && prevIndexRef.current !== activeIndex) {
      if (window.matchMedia("(pointer: coarse)").matches) haptic(6);
    }
    prevIndexRef.current = activeIndex;
  }, [activeIndex]);

  return (
    <section id="process" className="border-y border-(--line) bg-(--gray-1)">
      <div className="container-site" style={{ paddingBlock: "var(--section-gap)" }}>
        <SectionHeader
          index="04"
          en="Process / Thinking"
          ja="プロセス"
          quickSummary="観察 → 問い直し → 試作 → テスト → 調整 → 翻訳。どの作品もこの反復で作られています。"
        />

        <div className="grid gap-10 lg:grid-cols-[auto_1fr] lg:gap-16">
          {/* 現在のステップの大きなグリフ表示(デスクトップ) */}
          <div className="sticky top-24 hidden h-fit lg:block" aria-hidden="true">
            <div className="caption-box flex flex-col items-center gap-3 px-10 py-8">
              <GlyphSvg step={processSteps[activeIndex]} active />
              <p key={`n-${activeIndex}`} className="spec-label reveal is-visible">
                {String(activeIndex + 1).padStart(2, "0")} / {String(processSteps.length).padStart(2, "0")}
              </p>
              <p key={`t-${activeIndex}`} className="reveal is-visible text-lg font-bold">
                {processSteps[activeIndex].en}
              </p>
            </div>
          </div>

          <ol className="relative space-y-10 md:space-y-14">
            {/* 縦のライン */}
            <div
              aria-hidden="true"
              className="absolute top-2 bottom-2 left-[9px] w-px bg-(--line-strong)"
            />
            {processSteps.map((step, i) => {
              const active = i === activeIndex;
              return (
                <li
                  key={step.id}
                  ref={(el) => {
                    stepRefs.current[i] = el;
                  }}
                  className="relative pl-10"
                >
                  <span
                    aria-hidden="true"
                    className="absolute top-2 left-0 size-[19px] rounded-full border-2 transition-colors duration-300"
                    style={{
                      borderColor: "var(--ink)",
                      background: active ? "var(--ink)" : "var(--paper)",
                    }}
                  />
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    <div className="lg:hidden">
                      <GlyphSvg step={step} active={active} />
                    </div>
                    <div>
                      <h3 className="flex items-baseline gap-3">
                        <span className="en text-lg font-semibold tracking-wider md:text-xl">
                          {step.en}
                        </span>
                        <span className="text-sm text-(--gray-5)">{step.ja}</span>
                      </h3>
                    </div>
                  </div>
                  <p className="mt-2 max-w-xl text-sm leading-loose text-(--ink-soft)">
                    {step.description}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
