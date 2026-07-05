import { About } from "../components/About";
import { ProcessTimeline } from "../components/ProcessTimeline";
import { usePageTitle } from "../hooks/usePageTitle";

const heroWords = ["Binary", "Gray", "Perspective", "Play", "Prototype"];

/** 思想とプロセス。旧HeroのbinaryWords列をここに移植する。 */
export function AboutPage() {
  usePageTitle("思想とプロセス | 山根瑛之輔 Portfolio");

  return (
    <div className="pt-14">
      {/* Binary → Gray のキーワード列: 端は白黒、中央はグレーに寄る */}
      <div className="container-site pt-10">
        <ul className="flex flex-wrap gap-x-6 gap-y-2" aria-label="キーワード">
          {heroWords.map((word, i) => {
            const t = Math.abs(i - (heroWords.length - 1) / 2) / ((heroWords.length - 1) / 2);
            const shade = Math.round(140 - t * 118); // 中央=グレー、端=黒に近い
            return (
              <li
                key={word}
                className="spec-label"
                style={{ color: `rgb(${shade},${shade},${shade})` }}
              >
                {word}
              </li>
            );
          })}
        </ul>
      </div>
      <About />
      <ProcessTimeline />
    </div>
  );
}
