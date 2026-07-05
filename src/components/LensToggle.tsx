import { useViewMode } from "../context/ViewModeContext";
import type { ViewMode } from "../types";

/**
 * Quick Scan(採用担当者向け・短時間) / Deep Dive(現場・面接官向け・深掘り) の切替。
 * サイト全体の情報量がこのトグルで変わる。
 */
export function LensToggle() {
  const { mode, setMode } = useViewMode();

  const options: { value: ViewMode; label: string; hint: string }[] = [
    { value: "quick", label: "Quick Scan", hint: "3分で概要" },
    { value: "deep", label: "Deep Dive", hint: "深く読む" },
  ];

  return (
    <div
      role="radiogroup"
      aria-label="閲覧モード切替"
      className="flex items-center rounded-full border border-(--line-strong) bg-(--paper) p-0.5 text-xs"
    >
      {options.map((opt) => {
        const active = mode === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => setMode(opt.value)}
            className={`en rounded-full px-3 py-1.5 tracking-wider transition-colors ${
              active
                ? "bg-(--ink) text-(--paper)"
                : "text-(--gray-5) hover:text-(--ink)"
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
