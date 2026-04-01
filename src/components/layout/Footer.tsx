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
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 font-black text-base text-white mb-2">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-[10px] font-black text-white">
                С
              </div>
              Сдадим
            </Link>
            <p className="text-xs text-zinc-600 max-w-xs">
              Онлайн-курс подготовки к теоретическому экзамену DGT в Испании.
            </p>
          </div>

          {/* Legal links */}
          <div className="flex flex-wrap gap-4">
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
        </div>

        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-zinc-600">
            © {new Date().getFullYear()} Sdadim.eu · Испания, Таррагона
          </p>
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
