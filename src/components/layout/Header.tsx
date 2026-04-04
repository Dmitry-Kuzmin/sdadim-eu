import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Курс" },
  { href: "/blog", label: "Блог" },
  { href: "/legal/terms", label: "Документы" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#050B14]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
          <img src="/favicon-s.svg" alt="Sdadim" className="w-8 h-8 rounded-[22%] shadow-lg shadow-blue-500/20" />
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-white/90 leading-none">Sdadim</span>
            <span className="text-[9px] text-zinc-400 font-bold tracking-[0.1em] leading-tight uppercase mt-0.5">by Skilyapp</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              className={({ isActive }) =>
                cn(
                  "text-sm font-medium transition-colors",
                  isActive ? "text-white" : "text-zinc-400 hover:text-white"
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
          <a
            href="https://t.me/skilyapp_bot?start=course"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors"
          >
            Занять место →
          </a>
        </nav>

        {/* Mobile burger */}
        <button
          className="md:hidden p-2 text-zinc-400 hover:text-white transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Меню"
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/5 bg-[#050B14] px-4 py-4 flex flex-col gap-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="text-sm font-medium text-zinc-300 hover:text-white transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <a
            href="https://t.me/skilyapp_bot?start=course"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-3 rounded-xl bg-blue-600 text-white text-sm font-semibold text-center"
            onClick={() => setMenuOpen(false)}
          >
            Занять место →
          </a>
        </div>
      )}
    </header>
  );
}
