import { useEffect, useRef } from "react";

/**
 * 要素が画面に入ったら .is-visible を付与する。
 * immediate=true の場合は監視せず即時に可視化する(ハッシュジャンプの着地先など、
 * 出現アニメーション待ちにするとタイミング競合で非表示のままになり得る要素向け)。
 */
export function useReveal<T extends HTMLElement>(immediate = false) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (immediate) {
      el.classList.add("is-visible");
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [immediate]);

  return ref;
}
