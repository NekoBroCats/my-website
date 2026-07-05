// ユーザー指示によりOSのprefers-reduced-motion設定は無視し、常にアニメーションを有効化する。
// (呼び出し側のAPI互換のためフック自体は残すが、返り値は常にfalse固定)
export function useReducedMotion(): boolean {
  return false;
}
