import { useRef } from "react";
import { useViewMode } from "../context/ViewModeContext";
import type { ViewMode } from "../types";
import { haptic } from "../lib/haptics";

/**
 * 短く読む / ちゃんと読む の切替。
 * サイト全体の情報量がこのトグルで変わる。
 */
export function LensToggle() {
  const { mode, setMode } = useViewMode();
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const options: { value: ViewMode; label: string; hint: string }[] = [
    { value: "quick", label: "さっと見る", hint: "短め" },
    { value: "deep", label: "ちゃんと読む", hint: "細かめ" },
  ];
  const activeIndex = options.findIndex((opt) => opt.value === mode);
  const selectMode = (value: ViewMode) => {
    if (mode !== value) haptic(8);
    setMode(value);
  };

  return (
    <div
      role="radiogroup"
      aria-label="閲覧モード切替"
      className="inline-flex max-w-full items-center border border-(--line-strong) bg-(--paper) p-1 text-xs"
      onKeyDown={(e) => {
        if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) return;
        e.preventDefault();
        const dir = e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 1;
        const next = (activeIndex + dir + options.length) % options.length;
        selectMode(options[next].value);
        buttonRefs.current[next]?.focus();
      }}
    >
      {options.map((opt, i) => {
        const active = mode === opt.value;
        return (
          <button
            key={opt.value}
            ref={(el) => {
              buttonRefs.current[i] = el;
            }}
            type="button"
            role="radio"
            aria-checked={active}
            tabIndex={active ? 0 : -1}
            onClick={() => selectMode(opt.value)}
            className={`en min-h-8 shrink-0 px-3 py-1.5 transition-colors duration-300 ${
              active
                ? "bg-(--ink) text-(--paper)"
                : "bg-transparent text-(--gray-5) hover:bg-(--gray-1) hover:text-(--ink)"
            }`}
          >
            {opt.label}
            <span className="ml-1.5 hidden font-sans text-[0.625rem] tracking-normal opacity-70 md:inline">
              {opt.hint}
            </span>
          </button>
        );
      })}
    </div>
  );
}
