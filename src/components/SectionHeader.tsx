import { useReveal } from "../hooks/useReveal";

interface SectionHeaderProps {
  index: string;
  en: string;
  ja: string;
  /** 短く読むモード向けの要約 */
  quickSummary?: string;
}

export function SectionHeader({ index, en, ja, quickSummary }: SectionHeaderProps) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className="reveal mb-12 md:mb-16">
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2 border-b border-(--line) pb-4">
        <span className="spec-label">{index}</span>
        <h2 className="text-2xl font-bold md:text-3xl">{ja}</h2>
        <span className="en hidden text-xs text-(--gray-4) uppercase sm:inline">{en}</span>
      </div>
      {quickSummary && (
        <p className="text-anywhere mt-4 max-w-3xl border-l-2 border-(--ink) pl-4 text-sm leading-relaxed text-(--ink-soft)">
          <span className="spec-label mr-2 align-baseline">3s</span>
          {quickSummary}
        </p>
      )}
    </div>
  );
}
