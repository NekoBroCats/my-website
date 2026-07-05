/** モバイル端末で軽い触覚フィードバックを返す(未対応環境・reduced-motion時は何もしない) */
export function haptic(pattern: number | number[] = 8): void {
  if (typeof navigator === "undefined" || !("vibrate" in navigator)) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  navigator.vibrate(pattern);
}
