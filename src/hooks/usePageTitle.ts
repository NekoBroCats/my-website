import { useEffect } from "react";

/** ページごとにdocument.titleを設定する小さなフック */
export function usePageTitle(title: string) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}
