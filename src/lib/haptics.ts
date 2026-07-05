/** モバイル端末で軽い触覚フィードバックを返す(未対応環境では何もしない)
 * ユーザー指示によりOSのprefers-reduced-motion設定に関わらず常に振動させる */
export function haptic(pattern: number | number[] = 8): void {
  if (typeof navigator === "undefined" || !("vibrate" in navigator)) return;
  navigator.vibrate(pattern);
}
