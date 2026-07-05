import { Link } from "react-router-dom";
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
        quickSummary="まだふわっとした話を、紙、模型、Unityのどれかで一回試せるところまで持っていきます。"
      />

      <div ref={ref} className="reveal space-y-10">
        {/* 面談前に先に読める短いまとめ */}
        <div className="border border-(--line-strong) bg-(--gray-1) p-6 md:p-8">
          <p className="spec-label mb-3">Short Note</p>
          <p className="max-w-3xl text-base leading-loose font-medium md:text-lg">
            {career.hiringSummary}
          </p>
          <div className="mt-5 flex flex-wrap gap-4">
            <a href={`mailto:${profile.email}`} className="btn btn-solid">
              連絡する
            </a>
            <Link to="/works" className="btn btn-ghost">
              作品で確認する
            </Link>
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
                  className="border border-(--line-strong) bg-(--paper) px-3 py-1.5 text-sm"
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
                <li key={role.title} className="bg-(--paper) p-4 transition-colors hover:bg-(--gray-1)">
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
