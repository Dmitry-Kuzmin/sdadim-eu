import { Link } from "react-router-dom";

const LEGAL_LINKS = [
  { href: "/legal/terms", label: "Оферта" },
  { href: "/legal/privacy", label: "Конфиденциальность" },
  { href: "/legal/cookies", label: "Cookies" },
  { href: "/legal/refund", label: "Возврат" },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#050B14]/60 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity shrink-0">
          <img src="/favicon-s.svg" alt="Sdadim" className="w-7 h-7 rounded-[22%] shadow-lg shadow-blue-500/20" />
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-white/90 leading-none">Sdadim</span>
            <span className="text-[9px] text-zinc-400 font-bold tracking-[0.1em] leading-tight uppercase mt-0.5">by Skilyapp</span>
          </div>
        </Link>

        {/* Legal links */}
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          {LEGAL_LINKS.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Copyright + email */}
        <div className="flex items-center gap-4 shrink-0">
          <p className="text-xs text-zinc-600">© {new Date().getFullYear()} Sdadim.eu</p>
          <a
            href="mailto:support@skilyapp.com"
            className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
          >
            support@skilyapp.com
          </a>
        </div>
      </div>
    </footer>
  );
}
