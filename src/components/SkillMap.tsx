import { SectionHeader } from "./SectionHeader";
import { skillCategories } from "../data/skills";
import { works } from "../data/works";
import { SKILL_LEVEL_LABELS } from "../types";
import { useReveal } from "../hooks/useReveal";
import { haptic } from "../lib/haptics";

/** スキルをクリックすると、それを使った作品カードへスクロールする */
function jumpToWork(workId: string) {
  haptic(8);
  const el = document.getElementById(`work-${workId}`);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.classList.add("is-visible");
  }
}

export function SkillMap() {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section id="skills" className="container-site" style={{ paddingBlock: "var(--section-gap)" }}>
      <SectionHeader
        index="03"
        en="Skills / Tools"
        ja="スキル"
        quickSummary="企画・デザイン・実装・リサーチを横断。スキル名をクリックすると、それを使った作品に飛べます。"
      />

      <div ref={ref} className="reveal grid gap-px overflow-hidden border border-(--line) bg-(--line) md:grid-cols-2">
        {skillCategories.map((cat) => (
          <div key={cat.id} className="bg-(--paper) p-5 md:p-6">
            <div className="mb-2 flex items-baseline gap-3">
              <h3 className="text-lg font-bold">{cat.title}</h3>
              <span className="en text-xs text-(--gray-4) uppercase">{cat.titleEn}</span>
            </div>
            <p className="mb-4 text-xs leading-relaxed text-(--gray-5)">{cat.description}</p>
            <ul className="space-y-1.5">
              {cat.skills.map((skill) => {
                const related = skill.relatedWorkIds
                  .map((id) => works.find((w) => w.id === id))
                  .filter((w) => w !== undefined);
                const clickable = related.length > 0;
                return (
                  <li key={skill.name} className="flex items-center justify-between gap-3 text-sm">
                    {clickable ? (
                      <button
                        type="button"
                        onClick={() => jumpToWork(related[0].id)}
                        title={`関連作品: ${related.map((w) => w.title).join(" / ")}`}
                        className="group flex items-center gap-1.5 text-left underline decoration-(--gray-3) underline-offset-4 transition-colors hover:decoration-(--ink)"
                      >
                        {skill.name}
                        <span
                          aria-hidden="true"
                          className="text-xs text-(--gray-4) transition-transform group-hover:translate-x-0.5"
                        >
                          ↗
                        </span>
                      </button>
                    ) : (
                      <span>{skill.name}</span>
                    )}
                    <span className="en shrink-0 rounded-full border border-(--line) px-2.5 py-0.5 text-[0.675rem] text-(--gray-5)">
                      {SKILL_LEVEL_LABELS[skill.level]}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs text-(--gray-4)">
        熟練度は星ではなく「実務でどう使えるか」で表記しています。↗ の付いたスキルは、クリックで関連作品へ移動します。
      </p>
    </section>
  );
}
