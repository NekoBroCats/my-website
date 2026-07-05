import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * ルート遷移時に先頭へスクロールする。
 * location.hash がある場合は該当idへスクロールする(要素の出現を待つ)。
 */
export function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const rawId = decodeURIComponent(location.hash.slice(1));
      const legacyIds: Record<string, string> = {
        "work-yonmoku": "work-voxel-row-yonmoku",
      };
      const id = legacyIds[rawId] ?? rawId;
      // ページ遷移直後は要素がまだ描画/revealされていない可能性があるため少し待つ
      const raf = requestAnimationFrame(() => {
        const el = document.getElementById(id);
        if (el) {
          el.classList.add("is-visible");
          el.scrollIntoView({ block: "center" });
        }
      });
      return () => cancelAnimationFrame(raf);
    }
    window.scrollTo(0, 0);
  }, [location.pathname, location.hash]);

  return null;
}
