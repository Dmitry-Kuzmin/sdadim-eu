/**
 * Статья: Ошибки подсчёта расходов на права Испании, калькулятор
 * SEO: "стоимость водительских прав испания 2026", "tasa dgt 2", "матрикула автошкола"
 */

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, Receipt, Coins, ShieldCheck, Euro } from "lucide-react";
import {
  ArticleAccordion,
  ArticleCallout,
  ArticleCardGrid,
  ArticleDivider,
  ArticleImage,
  ArticleBanner,
} from "@/components/ui/article";
import { cn } from "@/lib/utils";

// ─── SEO ──────────────────────────────────────────────────────────────────────

function useSEO() {
  useEffect(() => {
    const prev = document.title;
    document.title = "Сколько стоит получить права в Испании? (Калькулятор 2026) | Sdadim";

    const setMeta = (sel: string, attr: string, val: string) => {
      let el = document.querySelector(sel) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, sel.match(/\[(?:name|property)="(.+?)"\]/)?.[1] ?? "");
        document.head.appendChild(el);
      }
      el.setAttribute("content", val);
    };

    setMeta('meta[name="description"]', "name",
      "Полный разбор цен на получение водительских прав в Испании в 2026 году. Пошлина DGT 94.05€, автошколы, скрытые платежи (Tramitación) и интерактивный калькулятор."
    );
    setMeta('meta[property="og:title"]', "property", "Цены на водительские права в Испании 2026 + Калькулятор");
    setMeta('meta[property="og:image"]', "property", "https://sdadim.eu/assets/blog/tseny-na-prava.jpg");
    setMeta('meta[property="og:url"]', "property", "https://sdadim.eu/blog/tseny-na-prava");
    setMeta('meta[property="og:type"]', "property", "article");

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = "https://sdadim.eu/blog/tseny-na-prava";

    return () => { document.title = prev; };
  }, []);
}

// ─── Calculator Component ──────────────────────────────────────────────────

function CostsCalculator() {
  const [practicalClasses, setPracticalClasses] = useState(20);
  const [theoryAttempts, setTheoryAttempts] = useState(1);
  const [practicalAttempts, setPracticalAttempts] = useState(1);

  // Constants 2026
  const TASA_DGT = 94.05; // Tasa 2.1
  const CLASSIC_MATRICULA = 150;
  const SDADIM_COURSE = 199;
  const CLASSIC_THEORY = 250;
  const COST_PER_CLASS = 33;
  const EXAM_CAR_RENT = 45;
  const TRAMITACION = 35; // Autoescuela fee to book exam

  // Calculate logic
  // One Tasa 94.05€ covers 3 attempts total (e.g. 1 theory pass + 2 practical attempts, or 2 theory + 1 practical).
  const totalAttempts = theoryAttempts + practicalAttempts;
  const extraTasasCount = Math.floor((totalAttempts - 1) / 3);
  const totalTasaCost = (1 + extraTasasCount) * TASA_DGT;

  // Each exam attempt has a Tramitación fee from autoescuela
  const totalTramitacion = (theoryAttempts + practicalAttempts) * TRAMITACION;
  
  // Each practical exam requires car rental
  const totalCarRent = practicalAttempts * EXAM_CAR_RENT;

  // Sdadim gives 3 free classes out of the needed classes if they buy course
  const sdadimClassesToPay = Math.max(0, practicalClasses - 3);

  // Totals
  const sdadimTotal = SDADIM_COURSE 
    + totalTasaCost 
    + totalCarRent 
    + (totalTramitacion) 
    + (sdadimClassesToPay * COST_PER_CLASS);

  const classicTotal = CLASSIC_MATRICULA
    + CLASSIC_THEORY 
    + totalTasaCost 
    + totalCarRent 
    + (totalTramitacion) 
    + (practicalClasses * COST_PER_CLASS);

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 md:p-8 my-10 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-blue-500" />
      
      <div className="text-center mb-8">
        <h3 className="text-2xl font-black text-white flex items-center justify-center gap-2">
          <Euro className="w-6 h-6 text-emerald-400" /> Интерактивный Калькулятор 2026
        </h3>
        <p className="text-sm text-zinc-400 mt-2">Посчитайте свои реальные расходы с учетом пересдач и пошлин</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* Контролы */}
        <div className="space-y-6">
          
          <div className="space-y-4 bg-black/20 p-5 rounded-xl border border-white/5">
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-semibold text-zinc-300">Уроки практики (по 45 мин)</label>
                <span className="text-sm font-bold text-emerald-400">{practicalClasses} уроков</span>
              </div>
              <input 
                type="range" min="10" max="60" value={practicalClasses} 
                onChange={(e) => setPracticalClasses(Number(e.target.value))}
                className="w-full accent-emerald-500 h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
              />
              <p className="text-xs text-zinc-500 mt-2">Среднему водителю с нуля требуется 30-40 занятий.</p>
            </div>

            <div className="pt-4 border-t border-zinc-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-zinc-300">Попытки Теории</p>
                  <p className="text-xs text-zinc-500">Экзамен DGT</p>
                </div>
                <div className="flex gap-2">
                  {[1,2,3,4].map(num => (
                    <button key={num} onClick={() => setTheoryAttempts(num)} 
                      className={cn("w-10 h-10 rounded-lg text-sm font-bold transition-all", theoryAttempts === num ? "bg-amber-500 text-black" : "bg-zinc-800 text-white hover:bg-zinc-700")}>
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-zinc-300">Попытки Практики</p>
                  <p className="text-xs text-zinc-500">Город / Автодром</p>
                </div>
                <div className="flex gap-2">
                  {[1,2,3,4].map(num => (
                    <button key={num} onClick={() => setPracticalAttempts(num)} 
                      className={cn("w-10 h-10 rounded-lg text-sm font-bold transition-all", practicalAttempts === num ? "bg-amber-500 text-black" : "bg-zinc-800 text-white hover:bg-zinc-700")}>
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {extraTasasCount > 0 && (
              <div className="text-xs text-red-400 bg-red-400/10 p-3 rounded-lg border border-red-400/20">
                ⚠️ Вы исчерпали лимит из 3 попыток на пошлину. Придется оплатить Tasa 2.1 заново (+94.05€).
              </div>
            )}
          </div>
        </div>

        {/* Результат */}
        <div className="space-y-4">
          {/* Sdadim Box */}
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5 relative">
            <div className="absolute top-3 right-3 text-[10px] font-bold tracking-widest uppercase bg-emerald-500 text-black px-2 py-0.5 rounded-full">Выбор Sdadim</div>
            <p className="text-sm text-zinc-400 mb-1">Обучение с нами</p>
            <p className="text-4xl font-black text-white">{sdadimTotal.toFixed(2)} €</p>
            
            <div className="mt-4 space-y-2 text-xs text-zinc-400">
              <div className="flex justify-between"><span>Курс (Sdadim)</span> <span>199.00 €</span></div>
              <div className="flex justify-between text-emerald-400"><span>Матрикула</span> <span>0.00 € (Нет)</span></div>
              <div className="flex justify-between text-emerald-400"><span>Практика ({practicalClasses} уроков)</span> <span>{sdadimClassesToPay * COST_PER_CLASS} € (-3 беспл.)</span></div>
              <div className="flex justify-between"><span>Услуги автошколы (Записи)</span> <span>{totalTramitacion} €</span></div>
              <div className="flex justify-between"><span>Аренда авто (Экзамены)</span> <span>{totalCarRent} €</span></div>
              <div className="flex justify-between text-yellow-400 font-bold border-t border-zinc-800 pt-2"><span>Tasa DGT 2.1</span> <span>{totalTasaCost.toFixed(2)} €</span></div>
            </div>
          </div>

          {/* Classic Box */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <p className="text-sm text-zinc-500 mb-1">Обычная автошкола (В среднем)</p>
            <p className="text-3xl font-black text-zinc-300">{classicTotal.toFixed(2)} €</p>
            
            <div className="mt-4 space-y-2 text-xs text-zinc-500">
              <div className="flex justify-between"><span>Теоретический блок</span> <span>250.00 €</span></div>
              <div className="flex justify-between text-red-400"><span>Матрикула (Зачисление)</span> <span>150.00 €</span></div>
              <div className="flex justify-between"><span>Практика ({practicalClasses} уроков)</span> <span>{practicalClasses * COST_PER_CLASS} €</span></div>
              <div className="flex justify-between"><span>Остальные сборы и DGT</span> <span>{(totalTramitacion + totalCarRent + totalTasaCost).toFixed(2)} €</span></div>
            </div>
          </div>
          
          <div className="text-sm font-bold text-center text-emerald-400 pt-2">
            Ваша экономия: {(classicTotal - sdadimTotal).toFixed(2)} €
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN ────────────────────────────────────────────────────────────

export default function ArticleCosts() {
  useSEO();

  return (
    <div className="min-h-screen bg-[#050B14]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14">

          <main className="lg:col-span-8">
            <Link to="/blog" className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-white transition-colors mb-8">
              <ArrowLeft className="w-4 h-4" /> Все статьи
            </Link>

            <div className="mb-8">
              <span className="inline-block text-[10px] uppercase tracking-widest font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full mb-4">
                Финансы
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight mb-5">
                Сколько реально стоят водительские права в Испании в 2026 году?
              </h1>
              <p className="text-lg text-zinc-400 leading-relaxed mb-5">
                Получение водительских прав в Испании предполагает несколько статей расходов, некоторые из которых можно избежать (привет, матрикула!), а другие зависят от вашей подготовки и дотошности автошколы. Разбираем всё до копейки.
              </p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-600">
                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> 5 апреля 2025</span>
                <span className="flex items-center gap-1.5"><Receipt className="w-3.5 h-3.5" /> Актуально на 2026 год</span>
              </div>
            </div>

            <ArticleImage
              src="/assets/blog/tseny-na-prava.jpg"
              alt="Стоимость получения прав в Испании, калькулятор и деньги"
              caption="Официальная пошлина DGT на 2026 год составляет 94.05€. Всё остальное — ценообразование автошкол."
              fullWidth
            />

            <h2 className="text-2xl font-black text-white mt-12 mb-4 pb-3 border-b border-white/8">
              Из чего состоят базовые траты?
            </h2>
            <p className="text-[15px] text-zinc-300 leading-[1.85] mb-4">
              Вам нужно понимать, что в Испании нет системы "заплатил один раз за всё и забыл". У вас будут постоянные мини-траты при каждом шаге. Пройдемся по списку от самых скрытых до самых очевидных.
            </p>

            <ArticleCardGrid cols={2} cards={[
              {
                icon: "📝",
                title: "Матрикула (Matrícula)",
                description: "Своеобразная плата за регистрацию. Она не покрывает обучение, а просто 'открывает доступ'.",
                badge: "От 80€ до 220€",
              },
              {
                icon: "🚦",
                title: "Tramitación (Запись)",
                description: "Сбор автошколы за то, что они передают ваши документы в DGT для сдачи экзамена.",
                badge: "Около 35€ за КАЖДЫЙ экзамен",
              },
              {
                icon: "🚘",
                title: "Аренда Экзаменационного Авто",
                description: "На практическом экзамене вы платите автошколе за использование их машины с педалями.",
                badge: "В среднем 45€",
              },
              {
                icon: "⚖️",
                title: "Tasa DGT (Tasa 2.1)",
                description: "Официальный сбор государства. Дает право на 3 попытки сдачи (в сумме за теорию и практику).",
                badge: "Строго 94.05 €",
              },
            ]} />

            <ArticleCallout type="warning" title="Как работает Tasa DGT">
              Сумма 94.05€ дает вам <strong>3 Convocatorias</strong> (попытки). Если вы сдали теорию с 1-го раза, то у вас останется 2 попытки на практику. Если вы завалили теорию 2 раза и сдали с 3-го, у вас не останется попыток, и для практики вам придется заплатить 94.05€ заново!
            </ArticleCallout>

            {/* Внедрим калькулятор прямо сюда */}
            <CostsCalculator />

            <ArticleDivider label="Можно ли сэкономить?" />

            <h2 className="text-2xl font-black text-white mt-8 mb-4 pb-3 border-b border-white/8">
              Как не переплатить "посредникам"?
            </h2>
            <p className="text-[15px] text-zinc-300 leading-[1.85] mb-4">
              Самый большой вычет из вашего кошелька — это бесконечные пошлины за пересдачу (Renovación de Papeles) и матрикула в классических автошколах. Если вы выбрали испанскую автошколу, готовьтесь платить за каждый чих.
            </p>

            <ArticleAccordion
              title="За что мы в Sdadim НЕ берем деньги"
              items={[
                {
                  question: "Есть ли у вас Матрикула?",
                  answer: "Нет. Вы покупаете теоретический курс, и он уже включает в себя доступ ко всему материалу навсегда. Никаких скрытых 'регистрационных сборов'.",
                },
                {
                  question: "Сколько стоят практические уроки?",
                  answer: "При покупке нашего курса вы получаете 3 урока бесплатно. Остальные вы оплачиваете строго за откатанное время без переплат.",
                },
              ]}
            />
            
            <div className="mt-12 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-8 mb-10">
              <div className="flex items-center gap-3 mb-4">
                <ShieldCheck className="w-8 h-8 text-emerald-400" />
                <h3 className="text-2xl font-black text-white">Резюме 2026 года</h3>
              </div>
              <p className="text-zinc-300 mb-0">
                Минималистичный бюджет на получение прав при сдаче с первого раза (с 20 уроками практики): <br/><strong className="text-white text-xl">около 800 - 1000 €</strong>. 
                <br /><br />
                Средний бюджет (2 пересдачи теории, 40 уроков практики, 2 пересдачи вождения): <br/><strong className="text-red-400 text-xl">около 2000 - 2500 €</strong>.
              </p>
              <br />
              <p className="text-emerald-400 font-bold">Именно поэтому качественная подготовка онлайн до начала практики — лучший способ сэкономить 1500€.</p>
            </div>

          </main>

          <aside className="hidden lg:block lg:col-span-4">
            <div className="sticky top-24 space-y-5">
              
              <div className="rounded-xl border border-white/8 bg-white/[0.03] p-5">
                <div className="flex justify-between items-center mb-3">
                  <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Факт DGT</p>
                  <Coins className="w-4 h-4 text-amber-400" />
                </div>
                <p className="text-sm text-zinc-300 mb-0">
                  <strong className="text-white">94.05 €</strong> — это точная сумма Tasa 2.1 (Permisos de Conducción) на текущий год, установленная Министерством Внутренних Дел Испании.
                </p>
              </div>

              {/* Banner */}
              <ArticleBanner variant="compact" basePrice={199} />

            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}
