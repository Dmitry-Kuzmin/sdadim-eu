import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

const LEGAL_LINKS = [
  { href: "/legal/terms", label: "Оферта" },
  { href: "/legal/privacy", label: "Конфиденциальность" },
  { href: "/legal/cookies", label: "Cookies" },
  { href: "/legal/refund", label: "Возврат" },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#050B14]/60 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col gap-5">
        <div className="flex justify-center sm:justify-end">
          <a
            href="https://www.nrtv.studio"
            target="_blank"
            rel="noreferrer"
            aria-label="Перейти на nrtv.studio"
            className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs text-zinc-200 shadow-[0_12px_30px_rgba(15,23,42,0.22)] backdrop-blur-sm transition-colors hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
          >
            <img
              src="/nrtv-logo.png"
              alt="NRTV"
              className="h-6 w-6 rounded-md object-cover"
            />
            <span>Сайт запущен студией NRTV</span>
            <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.05] px-2 py-1 text-[11px] font-medium text-zinc-100">
              nrtv.studio
              <ArrowUpRight className="h-3.5 w-3.5" />
            </span>
          </a>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
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
      </div>
    </footer>
  );
}
