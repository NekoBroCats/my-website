import { SectionHeader } from "./SectionHeader";
import { profile } from "../data/profile";
import { useViewMode } from "../context/ViewModeContext";
import { useReveal } from "../hooks/useReveal";
import { assetUrl } from "../lib/assetUrl";

export function About() {
  const { mode } = useViewMode();
  const ref = useReveal<HTMLDivElement>();

  return (
    <section id="about" className="container-site" style={{ paddingBlock: "var(--section-gap)" }}>
      <SectionHeader
        index="01"
        en="About / Statement"
        ja="考えていること"
        quickSummary="白黒で割り切れないところ、見方を少し変えたら急に崩れるところを、作品の入口にしています。"
      />

      <div ref={ref} className="reveal grid gap-10 lg:grid-cols-[1fr_2fr]">
        <div>
          <div className="mb-8 flex items-center gap-4">
            <img
              src={assetUrl("/assets/profile/yamane-portrait.jpg")}
              alt={`${profile.name}のポートレート`}
              className="size-20 shrink-0 border border-(--line-strong) object-cover grayscale md:size-24"
              loading="lazy"
              decoding="async"
            />
            <div>
              <p className="font-bold">{profile.name}</p>
              <p className="en text-xs tracking-wider text-(--gray-4) uppercase">{profile.title}</p>
            </div>
          </div>
          <p className="serif text-3xl leading-snug font-semibold md:text-4xl">
            {profile.statement.lead}
          </p>
          <ul className="mt-8 flex flex-wrap gap-2" aria-label="制作プロセスのキーワード">
            {profile.statement.keywords.map((kw, i) => (
              <li key={kw} className="flex items-center gap-2 text-sm text-(--gray-5)">
                <span
                  className="inline-block size-2.5"
                  style={{
                    background: `rgb(${30 + i * 38},${30 + i * 38},${30 + i * 38})`,
                  }}
                  aria-hidden="true"
                />
                {kw}
                {i < profile.statement.keywords.length - 1 && (
                  <span aria-hidden="true" className="text-(--gray-3)">
                    →
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="max-w-2xl space-y-6 text-[0.95rem] leading-loose text-(--ink-soft)">
          {(mode === "quick"
            ? [profile.statement.paragraphs[2]]
            : profile.statement.paragraphs
          ).map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          {mode === "quick" && (
            <p className="text-xs text-(--gray-4)">
              ※ 「ちゃんと読む」に切り替えると、もう少し回り道して話します。
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
