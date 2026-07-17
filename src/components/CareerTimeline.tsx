import { SectionHeader } from "./SectionHeader";
import { career } from "../data/career";
import { useReveal } from "../hooks/useReveal";

export function CareerTimeline() {
  const introRef = useReveal<HTMLDivElement>();
  const timelineRef = useReveal<HTMLDivElement>();

  return (
    <section id="career-timeline" className="container-site" style={{ paddingBlock: "var(--section-gap)" }}>
      <SectionHeader
        index="03"
        en="Career Timeline"
        ja="経歴"
        quickSummary="大学で作り始め、展示に出しました。研究と仕事では、人が作る場を支える側にも回りました。そのたび、自分の作り方も少しずつ変わっています。"
      />

      <div ref={introRef} className="reveal mb-10 grid gap-6 border border-(--line-strong) bg-(--paper) p-5 md:grid-cols-[1fr_13rem] md:p-7">
        <div className="max-w-3xl space-y-4 text-sm leading-loose text-(--ink-soft) md:text-base">
          {career.timelineIntro.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <div className="border-t border-(--line) pt-4 md:border-l md:border-t-0 md:pl-5 md:pt-0">
          <p className="spec-label mb-2">Main Thread</p>
          <p className="text-sm font-bold leading-relaxed">
            Design
            <br />
            XR / VR
            <br />
            Research
            <br />
            Education
          </p>
        </div>
      </div>

      <div ref={timelineRef} className="reveal">
        <p className="mb-4 border-l-2 border-(--ink) pl-4 text-xs leading-relaxed text-(--gray-5)">
          {career.timelineGuide}
        </p>
        <ol className="border-y border-(--line-strong)">
          {career.timeline.map((block) => (
            <li key={`${block.year}-${block.title}`} className="grid gap-0 border-b border-(--line) last:border-b-0 md:grid-cols-[12rem_1fr]">
              <div className="bg-(--gray-1) px-4 py-5 md:border-r md:border-(--line) md:px-5 md:py-6">
                <p className="en text-xl font-bold tracking-normal md:text-2xl">{block.year}</p>
                {"tags" in block && block.tags && (
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {block.tags.map((tag) => (
                      <li key={tag} className="border border-(--line-strong) bg-(--paper) px-2 py-1 text-[0.675rem] font-bold leading-none">
                        {tag}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <article className="bg-(--paper) p-4 md:p-6">
                <div className="mb-5 max-w-3xl">
                  <h3 className="text-anywhere text-xl font-bold leading-relaxed md:text-2xl">{block.title}</h3>
                </div>

                <ol className="grid gap-px overflow-hidden border border-(--line) bg-(--line)">
                  {block.entries.map((entry) => (
                    <li key={`${block.year}-${entry.date}-${entry.title}`} className="grid gap-3 bg-(--paper) p-4 md:grid-cols-[7.5rem_1fr] md:p-5">
                      <p className="spec-label pt-0.5">{entry.date}</p>
                      <div className="min-w-0">
                        <h4 className="text-anywhere text-sm font-bold leading-relaxed md:text-base">{entry.title}</h4>
                        <div className="mt-2 space-y-2 text-xs leading-loose text-(--gray-5) md:text-sm">
                          {entry.body.map((paragraph) => (
                            <p key={paragraph}>{paragraph}</p>
                          ))}
                        </div>
                      </div>
                    </li>
                  ))}
                </ol>
              </article>
            </li>
          ))}
        </ol>

        <div className="mt-8 border border-(--line-strong) bg-(--gray-1) p-5 md:p-7">
          <div className="mb-5 flex flex-wrap items-baseline gap-x-4 gap-y-2">
            <h3 className="text-xl font-bold">{career.current.title}</h3>
            <span className="spec-label">Current Focus</span>
          </div>

          <ul className="mb-5 flex flex-wrap gap-2">
            {career.current.focus.map((item) => (
              <li key={item} className="border border-(--line-strong) bg-(--paper) px-3 py-1.5 text-xs md:text-sm">
                {item}
              </li>
            ))}
          </ul>

          <div className="max-w-3xl space-y-3 text-sm leading-loose text-(--ink-soft)">
            {career.current.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
