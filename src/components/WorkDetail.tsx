import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import type { LensKey, Work } from "../types";
import { LENS_LABELS } from "../types";
import { WorkMedia } from "./WorkMedia";
import { WorkGallery } from "./WorkGallery";
import { GravityBoard } from "./GravityBoard";
import { IllusionDemo } from "./IllusionDemo";
import { haptic } from "../lib/haptics";
import { useBodyScrollLock } from "../hooks/useBodyScrollLock";
import type { LaunchRect } from "./WorkCard";

interface WorkDetailProps {
  work: Work;
  launchRect?: LaunchRect | null;
  onClose: () => void;
}

const lensKeys: LensKey[] = ["thought", "tech", "recruiter"];
const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

function getFocusableElements(root: HTMLElement) {
  return Array.from(root.querySelectorAll<HTMLElement>(focusableSelector)).filter((el) => {
    if (el.hasAttribute("disabled") || el.getAttribute("aria-hidden") === "true") return false;
    const style = window.getComputedStyle(el);
    return style.display !== "none" && style.visibility !== "hidden";
  });
}

/**
 * 作品詳細モーダル。
 * 本人が制作を振り返る文章として読めるよう、見出しも説明調に寄せすぎない。
 */
export function WorkDetail({ work, launchRect = null, onClose }: WorkDetailProps) {
  const [lens, setLens] = useState<LensKey>("thought");
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  useBodyScrollLock(true);

  // フォーカス移動・Escで閉じる
  useEffect(() => {
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        haptic(6);
        onClose();
      }
      if (e.key === "Tab" && panelRef.current) {
        const focusables = getFocusableElements(panelRef.current);
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement;
        if (!active || !panelRef.current.contains(active)) {
          e.preventDefault();
          first.focus();
        } else if (e.shiftKey && active === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    const onFocusIn = (e: FocusEvent) => {
      if (!panelRef.current) return;
      if (e.target instanceof Node && panelRef.current.contains(e.target)) return;
      const first = getFocusableElements(panelRef.current)[0];
      (first ?? panelRef.current).focus();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("focusin", onFocusIn);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("focusin", onFocusIn);
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
      en: "06 Build / Implementation",
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

  const launchStyle = launchRect
    ? ({
        "--detail-origin-x": `${launchRect.left + launchRect.width / 2 - window.innerWidth / 2}px`,
        "--detail-origin-y": `${launchRect.top + launchRect.height / 2 - window.innerHeight / 2}px`,
        "--detail-origin-scale": Math.max(
          0.58,
          Math.min(0.92, launchRect.width / Math.min(window.innerWidth * 0.9, 896)),
        ).toFixed(3),
      } as CSSProperties)
    : undefined;

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
          tabIndex={-1}
          style={launchStyle}
          className={`modal-enter ${
            launchRect ? "modal-enter-from-card" : ""
          } max-h-[92svh] w-full max-w-4xl overflow-y-auto border border-(--line-strong) bg-(--paper) md:max-h-[86svh]`}
        >
          {/* ヘッダー */}
          <div className="sticky top-0 z-10 border-b border-(--line) bg-(--paper)/95 backdrop-blur-sm">
            <div className="grid gap-4 p-5 pb-3 md:grid-cols-[1fr_auto] md:items-start md:p-6 md:pb-3">
              <div className="min-w-0">
                <p className="spec-label mb-1.5">{work.category}</p>
                <h3 id="work-detail-title" className="text-anywhere text-2xl font-bold tracking-wide">
                  {work.title}
                  {work.titleEn && (
                    <span className="en mt-1 block text-sm font-normal text-(--gray-4) sm:ml-2 sm:inline-block">
                      {work.titleEn}
                    </span>
                  )}
                </h3>
                <p id="work-detail-summary" className="text-anywhere mt-1 text-sm text-(--ink-soft)">
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
                className="btn btn-ghost h-9 shrink-0 justify-self-start px-3 py-1.5 md:justify-self-end"
              >
                閉じる
              </button>
            </div>

            {/* Perspective switch: 同じ作品を3つの視点で読み替える */}
            <div className="px-5 pb-3 md:px-6" role="group" aria-label="作品を読む視点">
              <div className="inline-flex max-w-full flex-wrap border border-(--line-strong) text-xs">
                {lensKeys.map((key) => (
                  <button
                    key={key}
                    type="button"
                    aria-pressed={lens === key}
                    onClick={() => {
                      haptic(6);
                      setLens(key);
                    }}
                    className={`min-h-8 shrink-0 px-3.5 py-1.5 transition-colors ${
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

          <div className="modal-body p-5 md:p-6">
            {/* 基本情報(役割・期間・形態)。未入力の項目は表示しない */}
            {work.meta && (work.meta.role || work.meta.period || work.meta.format) && (
              <div className="mb-8 flex flex-wrap gap-x-8 gap-y-2 border-y border-(--line) py-3">
                {work.meta.role && (
                  <div>
                    <p className="spec-label">Role</p>
                    <p className="text-sm text-(--ink-soft)">{work.meta.role}</p>
                  </div>
                )}
                {work.meta.period && (
                  <div>
                    <p className="spec-label">Period</p>
                    <p className="text-sm text-(--ink-soft)">{work.meta.period}</p>
                  </div>
                )}
                {work.meta.format && (
                  <div>
                    <p className="spec-label">Format</p>
                    <p className="text-sm text-(--ink-soft)">{work.meta.format}</p>
                  </div>
                )}
              </div>
            )}

            {/* 視点別の読み解き */}
            <div className="mb-8 max-w-3xl border-l-2 border-(--ink) bg-(--gray-1) p-4 md:p-5" aria-live="polite">
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
                <section key={section.en} className="grid gap-3 border-t border-(--line) pt-5 md:grid-cols-[8rem_1fr] md:gap-6">
                  <h4 className="flex flex-col gap-1">
                    <span className="spec-label">{section.en}</span>
                    <span className="text-base font-bold">{section.label}</span>
                  </h4>
                  <div className="max-w-3xl text-sm leading-loose text-(--ink-soft)">{section.body}</div>
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
