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
        quickSummary="盤面を回す。同じ色が違って見える。そういう小さいズレから作り始めます。"
      />

      <div ref={ref} className="reveal grid gap-10 lg:grid-cols-[1fr_2fr]">
        <div>
          <div className="mb-8 flex min-w-0 items-center gap-4">
            <img
              src={assetUrl("/assets/profile/yamane-portrait.jpg")}
              alt={`${profile.name}のポートレート`}
              className="size-20 shrink-0 border border-(--line-strong) object-cover grayscale md:size-24"
              loading="lazy"
              decoding="async"
            />
            <div className="min-w-0">
              <p className="font-bold">{profile.name}</p>
              <p className="en text-anywhere text-xs tracking-wider text-(--gray-4) uppercase">
                {profile.titleJa}
              </p>
            </div>
          </div>
          <p className="serif text-[2rem] leading-snug font-semibold md:text-4xl">
            <span className="block whitespace-nowrap">白か黒かで</span>
            <span className="block whitespace-nowrap">終わらないところ。</span>
          </p>
          <ul className="mt-8 grid grid-cols-2 border-y border-(--line) text-sm md:grid-cols-4" aria-label="制作プロセスのキーワード">
            {profile.statement.keywords.map((kw, i) => (
              <li
                key={kw}
                className="flex min-h-12 items-center gap-2 border-(--line) py-2 pr-3 text-(--gray-5) odd:border-r md:border-r md:last:border-r-0"
              >
                <span
                  className="inline-block size-2.5 shrink-0"
                  style={{
                    background: `rgb(${30 + i * 38},${30 + i * 38},${30 + i * 38})`,
                  }}
                  aria-hidden="true"
                />
                {kw}
              </li>
            ))}
          </ul>
        </div>

        <div className="min-w-0 max-w-2xl space-y-6 text-[0.95rem] leading-loose text-(--ink-soft)">
          {(mode === "quick"
            ? [profile.statement.paragraphs[2]]
            : profile.statement.paragraphs
          ).map((p, i) => (
            <p key={i} className="text-anywhere">{p}</p>
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
