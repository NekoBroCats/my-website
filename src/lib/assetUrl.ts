/** public/ 配下のアセットパスを、Viteのbase設定に追従したURLへ変換する */
export function assetUrl(path: string): string {
  return import.meta.env.BASE_URL + path.replace(/^\//, "");
}
