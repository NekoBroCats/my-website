import { VoxelField } from "./VoxelField";
import { profile } from "../data/profile";
import { useViewMode } from "../context/ViewModeContext";

const heroWords = ["Binary", "Gray", "Perspective", "Play", "Prototype"];

export function Hero() {
  const { mode } = useViewMode();

  return (
    <section id="top" className="relative flex min-h-svh flex-col justify-end overflow-hidden">
      {/* 背景: カーソルに反応するボクセルフィールド(文字の可読性を優先し10%減光) */}
      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 opacity-90">
          <VoxelField />
        </div>
        {/* テキスト可読性のためのグラデーション */}
        <div className="absolute inset-0 bg-gradient-to-t from-(--paper) via-(--paper)/70 to-(--paper)/30" />
      </div>

      <div className="container-site relative pt-28 pb-16 md:pb-20">
        <p className="spec-label mb-4">Portfolio — Perception as Interface</p>
        <h1 className="mb-2 text-4xl leading-tight font-bold tracking-wide md:text-6xl">
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

        {/* Binary → Gray のキーワード列: 端は白黒、中央はグレーに寄る */}
        <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2" aria-label="キーワード">
          {heroWords.map((word, i) => {
            const t = Math.abs(i - (heroWords.length - 1) / 2) / ((heroWords.length - 1) / 2);
            const shade = Math.round(140 - t * 118); // 中央=グレー、端=黒に近い
            return (
              <li
                key={word}
                className="spec-label"
                style={{ color: `rgb(${shade},${shade},${shade})` }}
              >
                {word}
              </li>
            );
          })}
        </ul>

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
          <a href="#works" className="btn btn-solid">
            作品を見る
          </a>
          <a
            href="#fit"
            className="text-sm text-(--gray-5) underline underline-offset-4 transition-colors hover:text-(--ink)"
          >
            採用ご担当者の方へ
          </a>
        </div>
      </div>
    </section>
  );
}
