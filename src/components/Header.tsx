import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { LensToggle } from "./LensToggle";
import { profile } from "../data/profile";
import { haptic } from "../lib/haptics";

const navItems = [
  { to: "/about", label: "About" },
  { to: "/works", label: "Works" },
  { to: "/career", label: "Career" },
];

/** activeなリンクはink色+下線、非activeはgray-5 */
function navLinkClass({ isActive }: { isActive: boolean }) {
  return `en nav-link tracking-wider transition-colors ${
    isActive
      ? "text-(--ink) underline underline-offset-4"
      : "text-(--gray-5) hover:text-(--ink)"
  }`;
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  // メニューが開いている間はbodyスクロールをロックし、Escで閉じる
  useEffect(() => {
    if (!menuOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const closeMenu = () => {
    haptic(8);
    setMenuOpen(false);
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-(--line) bg-(--paper)/85 backdrop-blur-sm">
        <div className="container-site flex h-14 items-center justify-between gap-4">
          <Link
            to="/"
            className="flex items-baseline gap-2 text-sm font-bold tracking-wide"
          >
            {profile.name}
            <span className="en hidden text-[0.625rem] font-normal text-(--gray-4) uppercase lg:inline">
              {profile.title}
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <nav aria-label="メインナビゲーション" className="hidden md:block">
              <ul className="flex gap-5 text-xs">
                {navItems.map((item) => (
                  <li key={item.to}>
                    <NavLink to={item.to} className={navLinkClass}>
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="hidden md:block">
              <LensToggle />
            </div>

            {/* モバイル: ハンバーガーボタン */}
            <button
              type="button"
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              aria-label={menuOpen ? "メニューを閉じる" : "メニューを開く"}
              onClick={() => {
                haptic(8);
                setMenuOpen((v) => !v);
              }}
              className="flex size-9 flex-col items-center justify-center gap-1.5 md:hidden"
            >
              <span
                aria-hidden="true"
                className={`block h-px w-5 bg-(--ink) transition-transform duration-300 ${
                  menuOpen ? "translate-y-[3.5px] rotate-45" : ""
                }`}
              />
              <span
                aria-hidden="true"
                className={`block h-px w-5 bg-(--ink) transition-transform duration-300 ${
                  menuOpen ? "-translate-y-[3.5px] -rotate-45" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* モバイル: 全画面オーバーレイメニュー
          headerはbackdrop-filterを持ち containing block を作るため、
          fixedオーバーレイはheaderの外(兄弟要素)に置いてビューポート基準で全画面化する */}
      {menuOpen && (
        <div id="mobile-navigation" className="fixed inset-0 top-14 z-40 flex flex-col bg-(--paper) md:hidden">
          <nav aria-label="モバイルナビゲーション" className="flex flex-1 flex-col justify-center px-8">
            <ul className="space-y-6">
              {navItems.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    onClick={closeMenu}
                    className={({ isActive }) =>
                      `en nav-link block text-3xl font-bold tracking-wide transition-colors ${
                        isActive ? "text-(--ink) underline underline-offset-4" : "text-(--gray-5)"
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
            <div className="mt-12">
              <LensToggle />
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
