import { LensToggle } from "./LensToggle";
import { profile } from "../data/profile";

const navItems = [
  { href: "#about", label: "About" },
  { href: "#works", label: "Works" },
  { href: "#skills", label: "Skills" },
  { href: "#process", label: "Process" },
  { href: "#fit", label: "Career Fit" },
  { href: "#contact", label: "Contact" },
];

export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-(--line) bg-(--paper)/85 backdrop-blur-sm">
      <div className="container-site flex h-14 items-center justify-between gap-4">
        <a
          href="#top"
          className="flex items-baseline gap-2 text-sm font-bold tracking-wide"
        >
          {profile.name}
          <span className="en hidden text-[0.625rem] font-normal text-(--gray-4) uppercase lg:inline">
            {profile.title}
          </span>
        </a>
        <div className="flex items-center gap-4">
          <nav aria-label="メインナビゲーション" className="hidden md:block">
            <ul className="flex gap-5 text-xs">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="en tracking-wider text-(--gray-5) transition-colors hover:text-(--ink)"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <LensToggle />
        </div>
      </div>
    </header>
  );
}
