/** 旧サイト構成のハッシュidを現行idへ読み替える対応表 */
const LEGACY_IDS: Record<string, string> = {
  "work-yonmoku": "work-voxel-row-yonmoku",
};

/** location.hash からジャンプ着地対象のid(旧idの読み替え込み)を返す。ハッシュが無ければ null */
export function hashTargetId(hash: string): string | null {
  if (!hash) return null;
  const rawId = decodeURIComponent(hash.slice(1));
  return LEGACY_IDS[rawId] ?? rawId;
}
