import { useEffect, useRef, useState } from "react";
import type { LensKey, Work } from "../types";
import { LENS_LABELS } from "../types";
import { WorkMedia } from "./WorkMedia";
import { WorkGallery } from "./WorkGallery";
import { GravityBoard } from "./GravityBoard";
import { IllusionDemo } from "./IllusionDemo";
import { haptic } from "../lib/haptics";

interface WorkDetailProps {
  work: Work;
  onClose: () => void;
}

const lensKeys: LensKey[] = ["thought", "tech", "recruiter"];

/**
 * 作品詳細モーダル。
 * 作品詳細モーダル。
 * 本人が制作を振り返る文章として読めるよう、見出しも説明調に寄せすぎない。
 */
export function WorkDetail({ work, onClose }: WorkDetailProps) {
  const [lens, setLens] = useState<LensKey>("thought");
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // フォーカス移動・Escで閉じる・背景スクロールのロック
  useEffect(() => {
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        haptic(6);
        onClose();
      }
      if (e.key === "Tab" && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll<HTMLElement>(
          'button, a[href], [tabindex]:not([tabindex="-1"])',
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      previouslyFocused?.focus();
    };
  }, [onClose]);

  const sections: { label: string; en: string; body: React.ReactNode }[] = [
    { label: "何を作ったか", en: "01 Overview", body: <p>{work.detail.overview}</p> },
    { label: "気になっていたこと", en: "02 Problem", body: <p>{work.detail.problem}</p> },
    {
      label: "どう言い直したか",
      en: "03 Reframing",
      body: <p className="serif text-lg leading-loose">{work.detail.reframing}</p>,
    },
    { label: "作るときの芯", en: "04 Concept", body: <p>{work.detail.concept}</p> },
    {
      label: "やったこと",
      en: "05 Process",
      body: (
        <ol className="space-y-2">
          {work.detail.process.map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="en mt-0.5 shrink-0 text-xs text-(--gray-4)">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      ),
    },
    {
      label: "作り方",
      en: "06 Prototype / Implementation",
      body: <p>{work.detail.implementation}</p>,
    },
    { label: "やってみて分かったこと", en: "07 Outcome", body: <p>{work.detail.outcome}</p> },
    {
      label: "見てほしいところ",
      en: "08 What to notice",
      body: (
        <ul className="space-y-2">
          {work.proof.map((p) => (
            <li key={p} className="flex gap-3">
              <span aria-hidden="true" className="mt-2.5 inline-block size-1.5 shrink-0 bg-(--ink)" />
              <span className="font-medium text-(--ink)">{p}</span>
            </li>
          ))}
        </ul>
      ),
    },
    { label: "次にやるなら", en: "09 Next development", body: <p>{work.detail.next}</p> },
  ];

  return (
    <>
      <div className="modal-backdrop" onClick={onClose} aria-hidden="true" />
      <div className="modal-panel">
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="work-detail-title"
          aria-describedby="work-detail-summary"
          className="max-h-[92svh] w-full max-w-3xl overflow-y-auto border border-(--line-strong) bg-(--paper) md:max-h-[86svh]"
        >
          {/* ヘッダー */}
          <div className="sticky top-0 z-10 border-b border-(--line) bg-(--paper)/95 backdrop-blur-sm">
            <div className="flex items-start justify-between gap-4 p-5 pb-3 md:p-6 md:pb-3">
              <div>
                <p className="spec-label mb-1.5">{work.category}</p>
                <h3 id="work-detail-title" className="text-2xl font-bold tracking-wide">
                  {work.title}
                  {work.titleEn && (
                    <span className="en ml-2 text-sm font-normal text-(--gray-4)">
                      {work.titleEn}
                    </span>
                  )}
                </h3>
                <p id="work-detail-summary" className="mt-1 text-sm text-(--ink-soft)">
                  {work.oneLiner}
                </p>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={() => {
                  haptic(6);
                  onClose();
                }}
                aria-label="詳細を閉じる"
                className="btn btn-ghost shrink-0 px-3 py-1.5"
              >
                閉じる
              </button>
            </div>

            {/* Perspective switch: 同じ作品を3つの視点で読み替える */}
            <div className="px-5 pb-3 md:px-6" role="tablist" aria-label="作品を読む視点">
              <div className="inline-flex border border-(--line-strong) text-xs">
                {lensKeys.map((key) => (
                  <button
                    key={key}
                    type="button"
                    role="tab"
                    aria-selected={lens === key}
                    onClick={() => {
                      haptic(6);
                      setLens(key);
                    }}
                    className={`px-3.5 py-1.5 transition-colors ${
                      lens === key
                        ? "bg-(--ink) text-(--paper)"
                        : "text-(--gray-5) hover:text-(--ink)"
                    }`}
                  >
                    {LENS_LABELS[key]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="p-5 md:p-6">
            {/* 視点別の読み解き */}
            <div className="mb-8 border-l-2 border-(--ink) bg-(--gray-1) p-4" aria-live="polite">
              <p className="spec-label mb-1.5">{LENS_LABELS[lens]}</p>
              <p className="text-sm leading-relaxed text-(--ink-soft)">{work.lenses[lens]}</p>
            </div>

            {/* ビジュアル(複数画像がある作品はギャラリー、それ以外は単一メディア) */}
            <div className="mb-8">
              {work.gallery && work.gallery.length > 0 ? (
                <WorkGallery images={work.gallery} />
              ) : (
                <WorkMedia work={work} variant="detail" />
              )}
            </div>

            {/* 作品固有のインタラクティブデモ */}
            {work.id === "voxel-row-yonmoku" && (
              <div className="mb-8">
                <GravityBoard />
              </div>
            )}
            {work.id === "illusion-cards" && (
              <div className="mb-8">
                <IllusionDemo />
              </div>
            )}

            {/* 9段構造の本文 */}
            <div className="space-y-8">
              {sections.map((section) => (
                <section key={section.en}>
                  <h4 className="mb-2 flex items-baseline gap-3 border-b border-(--line) pb-2">
                    <span className="spec-label">{section.en}</span>
                    <span className="text-base font-bold">{section.label}</span>
                  </h4>
                  <div className="text-sm leading-loose text-(--ink-soft)">{section.body}</div>
                </section>
              ))}
            </div>

            {/* キーワード・ツール */}
            <div className="mt-10 border-t border-(--line) pt-6">
              <p className="spec-label mb-2">Keywords / Tools</p>
              <ul className="flex flex-wrap gap-1.5">
                {[...new Set([...work.keywords, ...work.tools])].map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-(--line) px-2.5 py-0.5 text-[0.675rem] text-(--gray-5)"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
