import { profile } from "../data/profile";
import { useReveal } from "../hooks/useReveal";

export function Contact() {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section id="contact" className="border-t border-(--line) bg-(--ink) text-(--paper)">
      <div className="container-site" style={{ paddingBlock: "var(--section-gap)" }}>
        <div ref={ref} className="reveal">
          <SectionHeaderDark />
          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <p className="serif text-2xl leading-relaxed md:text-3xl">
                見方が変わる体験を、
                <br />
                一緒に作りませんか。
              </p>
              <p className="mt-4 max-w-md text-sm leading-loose text-(--gray-3)">
                ポートフォリオの詳細資料、実物プロトタイプのデモ、制作プロセスの説明など、面接・カジュアル面談の形式に合わせて対応できます。
              </p>
            </div>
            <div className="space-y-5">
              <div>
                <p className="spec-label mb-1.5">Name</p>
                <p className="text-lg">
                  {profile.name}
                  <span className="en ml-3 text-xs text-(--gray-4) uppercase">{profile.nameEn}</span>
                </p>
              </div>
              <div>
                <p className="spec-label mb-1.5">Email</p>
                <a
                  href={`mailto:${profile.email}`}
                  className="en text-base break-all underline decoration-(--gray-4) underline-offset-4 transition-colors hover:decoration-(--paper)"
                >
                  {profile.email}
                </a>
              </div>
              <div>
                <p className="spec-label mb-1.5">Links</p>
                <ul className="space-y-1 text-sm text-(--gray-3)">
                  {profile.links.map((link) =>
                    link.href ? (
                      <li key={link.label}>
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline underline-offset-4 hover:text-(--paper)"
                        >
                          {link.label}
                        </a>
                      </li>
                    ) : (
                      <li key={link.label}>
                        {link.label} <span className="text-(--gray-4)">— {link.note}</span>
                      </li>
                    ),
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <footer className="mt-16 flex flex-wrap items-center justify-between gap-3 border-t border-(--gray-5) pt-6 text-xs text-(--gray-4)">
          <p className="en tracking-wider">© {new Date().getFullYear()} {profile.nameEn} — Perception as Interface</p>
          <a href="#top" className="underline underline-offset-4 hover:text-(--paper)">
            ページの先頭へ ↑
          </a>
        </footer>
      </div>
    </section>
  );
}

/** Contactは暗背景のため、SectionHeaderを反転して使う */
function SectionHeaderDark() {
  return (
    <div className="mb-12 md:mb-16">
      <div className="flex items-baseline gap-4 border-b border-(--gray-5) pb-4">
        <span className="spec-label">06</span>
        <h2 className="text-2xl font-bold tracking-wide md:text-3xl">連絡先</h2>
        <span className="en hidden text-xs text-(--gray-4) uppercase sm:inline">Contact</span>
      </div>
    </div>
  );
}
