import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { hashTargetId } from "../lib/hashTarget";

/**
 * ルート遷移時に先頭へスクロールする。
 * location.hash がある場合は該当idへスクロールする(要素の出現まで数フレーム再試行する)。
 * 着地先カードの可視化自体は WorkCard 側が render 時に保証するため、ここでの
 * classList.add は旧idハッシュや作品カード以外の着地先への保険。
 */
export function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    const id = hashTargetId(location.hash);
    if (id) {
      // 遷移直後は要素が未描画の可能性があるため、見つかるまで再試行する(上限あり)
      let raf = 0;
      let tries = 0;
      const attempt = () => {
        const el = document.getElementById(id);
        if (el) {
          el.classList.add("is-visible");
          el.scrollIntoView({ block: "center" });
        } else if (tries < 30) {
          tries += 1;
          raf = requestAnimationFrame(attempt);
        }
      };
      raf = requestAnimationFrame(attempt);
      return () => cancelAnimationFrame(raf);
    }
    window.scrollTo(0, 0);
  }, [location.pathname, location.hash]);

  return null;
}
