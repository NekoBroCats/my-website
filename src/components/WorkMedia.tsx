import { useState } from "react";
import type { Work } from "../types";
import { WorkVisualArt } from "./WorkVisualArt";
import { assetUrl } from "../lib/assetUrl";

interface WorkMediaProps {
  work: Work;
  variant: "card" | "detail";
}

/**
 * 作品のメディア表示。
 * 実写画像があれば表示し、未設定・読み込み失敗時は作品ごとのSVGビジュアルへフォールバックする。
 * - card: 5:3 のトリミング表示(object-cover)
 * - detail: 全体が見えるレターボックス表示(object-contain)。ポスター等の縦位置にも対応
 */
export function WorkMedia({ work, variant }: WorkMediaProps) {
  const [failed, setFailed] = useState(false);
  const src = variant === "detail" ? (work.imageDetail ?? work.image) : work.image;
  const alt = work.imageAlt ?? `${work.title} — ${work.oneLiner}`;

  if (variant === "card") {
    if (!src || failed) return <WorkVisualArt visual={work.visual} />;
    return (
      <>
        <WorkVisualArt visual={work.visual} />
        <img
          src={assetUrl(src)}
          alt={alt}
          loading="eager"
          decoding="async"
          className="media-reveal absolute inset-0 h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      </>
    );
  }

  // detail: 縦位置(ポスター等)でも全体が見えるレターボックス表示
  if (!src || failed) {
    return (
      <div className="work-visual aspect-5/3 border border-(--line)">
        <WorkVisualArt visual={work.visual} />
      </div>
    );
  }

  return (
    <div className="flex justify-center border border-(--line) bg-(--gray-1)">
      <img
        src={assetUrl(src)}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="max-h-[68svh] w-auto max-w-full"
        onError={() => setFailed(true)}
      />
    </div>
  );
}
