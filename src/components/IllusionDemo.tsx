import { useState } from "react";
import { haptic } from "../lib/haptics";

/**
 * 錯視トランプを象徴するミニデモ。
 * 同じグレーの円が、重なるストライプの色によって違う明るさに見える。
 * ボタン(またはカードへのホバー/フォーカス)でストライプを外すと、同じ色だと分かる。
 */
export function IllusionDemo() {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="caption-box">
      <div className="mb-3 flex items-center justify-between gap-4">
        <p className="spec-label">Interactive — Munker-type Illusion</p>
        <button
          type="button"
          onClick={() => {
            haptic(8);
            setRevealed((v) => !v);
          }}
          aria-pressed={revealed}
          className="btn btn-ghost px-3 py-1.5 text-xs"
        >
          {revealed ? "ストライプを戻す" : "ストライプを外す"}
        </button>
      </div>

      <div
        className="grid grid-cols-2 gap-3"
        onPointerEnter={() => setRevealed(true)}
        onPointerLeave={() => setRevealed(false)}
      >
        {(["a", "b"] as const).map((variant) => (
          <div
            key={variant}
            className="relative aspect-4/5 overflow-hidden rounded-md border border-(--line-strong) bg-(--gray-1)"
            role="img"
            aria-label={`グレーの円の上に${variant === "a" ? "黒" : "白"}のストライプが重なったカード。実は両方の円は同じ色。`}
          >
            <div className="absolute inset-[18%] rounded-full" style={{ background: "#8d8d8a" }} />
            <div
              className={`absolute inset-0 transition-opacity duration-500 ${
                variant === "a" ? "illusion-stripes-a" : "illusion-stripes-b"
              } ${revealed ? "opacity-0" : "opacity-100"}`}
            />
          </div>
        ))}
      </div>

      <p className="mt-3 text-xs leading-relaxed text-(--gray-5)" aria-live="polite">
        {revealed
          ? "2つの円は同じ色です。ストライプを戻すと、たぶんまた違って見えます。"
          : "2つの円、どちらが明るく見えますか？"}
      </p>
    </div>
  );
}
