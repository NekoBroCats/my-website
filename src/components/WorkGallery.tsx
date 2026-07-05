import { useState } from "react";
import { assetUrl } from "../lib/assetUrl";

interface WorkGalleryProps {
  images: { src: string; alt: string }[];
}

/**
 * 作品詳細用の画像ギャラリー。
 * メイン表示+サムネイル切替の「プロダクトギャラリー」型。ネストモーダルにせず
 * 既存の詳細モーダル内で完結させ、フォーカス管理を単純に保つ。
 */
export function WorkGallery({ images }: WorkGalleryProps) {
  const [active, setActive] = useState(0);
  if (images.length === 0) return null;
  const current = images[active];

  return (
    <div>
      <div className="flex justify-center border border-(--line) bg-(--gray-1)">
        <img
          key={current.src}
          src={assetUrl(current.src)}
          alt={current.alt}
          loading="lazy"
          decoding="async"
          className="max-h-[68svh] w-auto max-w-full"
        />
      </div>
      {images.length > 1 && (
        <div
          role="tablist"
          aria-label="ギャラリー画像を選択"
          className="mt-3 flex gap-2 overflow-x-auto pb-1"
        >
          {images.map((img, i) => (
            <button
              key={img.src}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={`画像 ${i + 1}/${images.length}: ${img.alt}`}
              onClick={() => setActive(i)}
              className={`h-14 w-20 shrink-0 overflow-hidden border transition-colors ${
                i === active
                  ? "border-(--ink)"
                  : "border-(--line) opacity-60 hover:opacity-100"
              }`}
            >
              <img
                src={assetUrl(img.src)}
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
