import { SkillMap } from "../components/SkillMap";
import { CareerFit } from "../components/CareerFit";
import { usePageTitle } from "../hooks/usePageTitle";

/** スキルと活かし方ページ。 */
export function CareerPage() {
  usePageTitle("スキルと活かし方 | 山根瑛之輔 Portfolio");

  return (
    <div className="pt-14">
      <SkillMap />
      <CareerFit />
    </div>
  );
}
