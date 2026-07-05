import { SectionHeader } from "./SectionHeader";
import { career } from "../data/career";
import { profile } from "../data/profile";
import { useReveal } from "../hooks/useReveal";

export function CareerFit() {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section id="fit" className="container-site" style={{ paddingBlock: "var(--section-gap)" }}>
      <SectionHeader
        index="05"
        en="Career Fit / What I Can Do"
        ja="仕事での活かし方"
        quickSummary="企画と実装の間に立ち、抽象的なテーマを試作可能な形へ翻訳する役割で価値を出します。"
      />

      <div ref={ref} className="reveal space-y-10">
        {/* Hiring Summary: 採用担当者向けの結論 */}
        <div className="border-2 border-(--ink) p-6 md:p-8">
          <p className="spec-label mb-3">Hiring Summary</p>
          <p className="max-w-3xl text-base leading-loose font-medium md:text-lg">
            {career.hiringSummary}
          </p>
          <div className="mt-5 flex flex-wrap gap-4">
            <a
              href={`mailto:${profile.email}`}
              className="border border-(--ink) bg-(--ink) px-5 py-2.5 text-sm text-(--paper) transition-colors hover:bg-transparent hover:text-(--ink)"
            >
              連絡する
            </a>
            <a
              href="#works"
              className="border border-(--ink) px-5 py-2.5 text-sm transition-colors hover:bg-(--ink) hover:text-(--paper)"
            >
              作品で確認する
            </a>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          {/* 向いている領域 */}
          <div>
            <h3 className="mb-4 flex items-baseline gap-3 text-lg font-bold">
              向いている領域
              <span className="spec-label">Fields</span>
            </h3>
            <ul className="flex flex-wrap gap-2">
              {career.fields.map((field) => (
                <li
                  key={field}
                  className="border border-(--line-strong) px-3 py-1.5 text-sm"
                >
                  {field}
                </li>
              ))}
            </ul>
          </div>

          {/* 果たせる役割 */}
          <div>
            <h3 className="mb-4 flex items-baseline gap-3 text-lg font-bold">
              果たせる役割
              <span className="spec-label">Roles</span>
            </h3>
            <ul className="grid gap-px overflow-hidden border border-(--line) bg-(--line) sm:grid-cols-2">
              {career.roles.map((role, i) => (
                <li key={role.title} className="bg-(--paper) p-4">
                  <p className="spec-label mb-1.5">{String(i + 1).padStart(2, "0")}</p>
                  <p className="text-sm font-bold leading-relaxed">{role.title}</p>
                  <p className="mt-1.5 text-xs leading-relaxed text-(--gray-5)">{role.detail}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
