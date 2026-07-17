import { SkillMap } from "../components/SkillMap";
import { CareerTimeline } from "../components/CareerTimeline";
import { CareerFit } from "../components/CareerFit";
import { usePageTitle } from "../hooks/usePageTitle";

/** スキルと活かし方ページ。 */
export function CareerPage() {
  usePageTitle("経歴・スキル | 山根瑛之輔 Portfolio");

  return (
    <div className="pt-14">
      <CareerTimeline />
      <SkillMap />
      <CareerFit />
    </div>
  );
}
