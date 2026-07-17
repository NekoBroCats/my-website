import { Link } from "react-router-dom";
import { usePageTitle } from "../hooks/usePageTitle";

export function NotFoundPage() {
  usePageTitle("ページが見つかりません | 山根瑛之輔 Portfolio");

  return (
    <section className="container-site flex min-h-[70svh] items-center pt-24 pb-20">
      <div className="w-full border-y border-(--line-strong) py-10 md:grid md:grid-cols-[12rem_1fr] md:gap-10 md:py-14">
        <p className="en text-6xl leading-none font-bold tabular-nums md:text-8xl" aria-hidden="true">
          404
        </p>
        <div className="mt-8 max-w-xl md:mt-0">
          <p className="spec-label mb-3">Page not found</p>
          <h1 className="text-2xl leading-relaxed font-bold md:text-3xl">このページは見つかりませんでした。</h1>
          <p className="mt-4 text-sm leading-loose text-(--ink-soft)">
            URLが変わったか、ページが移動したようです。作品一覧かトップページへ戻れます。
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/works" className="btn btn-solid">
              作品を見る
            </Link>
            <Link to="/" className="btn btn-ghost">
              トップへ戻る
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
