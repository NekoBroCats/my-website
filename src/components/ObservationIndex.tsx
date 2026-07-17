import { useState } from "react";
import { Link } from "react-router-dom";
import { profile } from "../data/profile";
import { useReveal } from "../hooks/useReveal";
import { assetUrl } from "../lib/assetUrl";

export function ObservationIndex() {
  const observations = profile.observations;
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useReveal<HTMLElement>();
  const noteRef = useReveal<HTMLDivElement>();

  const activeObservation = observations[Math.min(activeIndex, observations.length - 1)];
  const observerNote = profile.observerNote;
  const now = profile.now;

  return (
    <section
      ref={sectionRef}
      id="observation-index"
      aria-labelledby="observation-index-title"
      className="container-site reveal"
      style={{ paddingBlock: "var(--section-gap)" }}
    >
      <div className="mb-10 max-w-3xl">
        <p className="spec-label mb-3">Observation Index</p>
        <h2
          id="observation-index-title"
          className="serif text-anywhere text-3xl leading-tight font-semibold md:text-5xl"
        >
          私が、手を止めたところ。
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-(--ink-soft) md:text-base">
          作品の始まりは、大きなテーマより「今のは何だったんだろう」という小さな引っかかりです。
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-start">
        <div className="hidden lg:block">
          <div className="lg:sticky lg:top-24">
            <div className="relative aspect-[4/3] overflow-hidden border border-(--line-strong) bg-(--gray-1)">
              {observations.map((item, index) => {
                const isActive = index === activeIndex;
                return (
                  <img
                    key={item.id}
                    src={assetUrl(item.image)}
                    alt={item.imageAlt}
                    loading="lazy"
                    decoding="async"
                    aria-hidden={!isActive}
                    className={`absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-500 ease-[var(--ease)] ${
                      isActive ? "opacity-100 scale-100" : "pointer-events-none opacity-0 scale-[1.04]"
                    }`}
                  />
                );
              })}
            </div>

            <div className="mt-4 border-l-2 border-(--ink) pl-4">
              <p className="spec-label mb-2">Selected Work</p>
              <p className="text-anywhere text-lg font-semibold leading-snug">{activeObservation.workTitle}</p>
              <p className="text-anywhere mt-2 text-sm leading-relaxed text-(--ink-soft)">
                {activeObservation.shift}
              </p>
            </div>
          </div>
        </div>

        <div className="min-w-0 border-l border-(--line)">
          <ol className="divide-y divide-(--line)">
            {observations.map((item, index) => {
              const isActive = index === activeIndex;
              return (
                <li key={item.id} className="min-w-0">
                  <Link
                    to={`/works?work=${encodeURIComponent(item.workId)}`}
                    onPointerEnter={() => setActiveIndex(index)}
                    onFocus={() => setActiveIndex(index)}
                    className={`group block min-w-0 px-5 py-6 text-left transition-colors duration-300 md:px-6 lg:px-7 ${
                      isActive ? "bg-(--gray-1)" : "hover:bg-(--gray-1)/60"
                    }`}
                  >
                    <div className="flex min-w-0 items-start gap-4">
                      <span className="spec-label shrink-0 pt-1" aria-hidden="true">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="spec-label mb-2">Work / {item.workTitle}</p>
                        <p className="text-anywhere text-[1.15rem] font-semibold leading-snug md:text-[1.35rem]">
                          {item.trigger}
                        </p>
                        <p className="serif text-anywhere mt-2 text-[1.3rem] leading-[1.15] font-semibold md:text-[1.65rem]">
                          {item.shift}
                        </p>
                        <p className="text-anywhere mt-3 text-sm leading-relaxed text-(--ink-soft) md:text-[0.95rem]">
                          {item.note}
                        </p>
                        <span className="mt-4 inline-flex items-center gap-2 text-xs font-medium underline decoration-(--gray-3) underline-offset-4">
                          作品を見る
                          <span
                            aria-hidden="true"
                            className="transition-transform duration-300 group-hover:translate-x-1 group-focus-visible:translate-x-1"
                          >
                            →
                          </span>
                        </span>
                      </div>
                    </div>

                    <div className="mt-5 overflow-hidden border border-(--line) bg-(--gray-1) lg:hidden">
                      <div className="relative aspect-[4/3]">
                        <img
                          src={assetUrl(item.image)}
                          alt={item.imageAlt}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      {observerNote && (
        <div
          ref={noteRef}
          className="reveal mt-10 border-y border-(--line) bg-(--gray-1) px-5 py-6 md:px-6 md:py-7"
        >
          <p className="spec-label mb-3">Observer Note</p>
          <p className="serif text-anywhere max-w-4xl text-2xl leading-snug font-semibold md:text-3xl">
            {observerNote.lead}
          </p>
          <p className="text-anywhere mt-4 max-w-4xl text-sm leading-relaxed text-(--ink-soft) md:text-base">
            {observerNote.body}
          </p>
        </div>
      )}

      {now && (
        <div className="mt-8 border-t border-(--line) pt-6 md:flex md:items-start md:justify-between md:gap-8">
          <div className="min-w-0 max-w-3xl">
            <p className="spec-label mb-2">{now.label}</p>
            <p className="text-anywhere text-lg font-semibold leading-snug md:text-xl">{now.role}</p>
            <p className="text-anywhere mt-3 text-sm leading-relaxed text-(--ink-soft) md:text-base">
              {now.body}
            </p>
          </div>

          <Link
            to="/career"
            className="mt-5 inline-flex w-fit items-center gap-2 border border-(--ink) bg-(--paper) px-4 py-2 text-sm font-semibold text-(--ink) transition-colors duration-300 hover:bg-(--ink) hover:text-(--paper) md:mt-0"
          >
            経歴を見る →
          </Link>
        </div>
      )}
    </section>
  );
}
