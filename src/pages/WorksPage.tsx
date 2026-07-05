import { WorksSection } from "../components/WorksSection";
import { usePageTitle } from "../hooks/usePageTitle";

/** 作品一覧ページ。カードへのハッシュジャンプ(/works#work-{id})はScrollToTopが処理する。 */
export function WorksPage() {
  usePageTitle("作品 | 山根瑛之輔 Portfolio");

  return (
    <div className="pt-14">
      <WorksSection />
    </div>
  );
}
