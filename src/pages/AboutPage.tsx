import { About } from "../components/About";
import { ProcessTimeline } from "../components/ProcessTimeline";
import { usePageTitle } from "../hooks/usePageTitle";

const heroWords = ["Binary", "Gray", "Perspective", "Play", "Prototype"];

/** 考えていることとプロセス。旧HeroのbinaryWords列をここに移植する。 */
export function AboutPage() {
  usePageTitle("考えていることとプロセス | 山根瑛之輔 Portfolio");

  return (
    <div className="pt-14">
      {/* Binary → Gray のキーワード列: 端は白黒、中央はグレーに寄る */}
      <div className="container-site pt-10">
        <ul className="grid grid-cols-2 gap-x-5 gap-y-2 sm:flex sm:flex-wrap sm:gap-x-6" aria-label="キーワード">
          {heroWords.map((word, i) => {
            const t = Math.abs(i - (heroWords.length - 1) / 2) / ((heroWords.length - 1) / 2);
            const shade = Math.round(140 - t * 118); // 中央=グレー、端=黒に近い
            return (
              <li
                key={word}
                className="spec-label text-anywhere"
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
