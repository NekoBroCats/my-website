import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Contact } from "./Contact";
import { ScrollToTop } from "./ScrollToTop";

/** 全ページ共通のレイアウト: Header + ページ本体 + Contact(共通フッター) */
export function Layout() {
  return (
    <>
      <ScrollToTop />
      <Header />
      <main id="main">
        <Outlet />
      </main>
      <Contact />
    </>
  );
}
