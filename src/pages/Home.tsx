import { useState } from "react";
import { motion } from "framer-motion";
import { submitCourseLead } from "@/lib/supabase";
import {
  CheckCircle2, Send, BookOpen, Users, FileText,
  MessageCircle, Star, Clock, Award, ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Data ─────────────────────────────────────────────────────────────────────

const STAGES = [
  {
    step: "01",
    title: "Регистрация",
    desc: "Бронируете место и получаете доступ к материалам до старта потока.",
  },
  {
    step: "02",
    title: "Живые уроки",
    desc: "16 эфиров по 2 часа. Разбираем теорию, знаки и типичные ошибки.",
  },
  {
    step: "03",
    title: "Документы",
    desc: "Пошаговый чеклист. Помогаем собрать всё правильно с первого раза.",
  },
  {
    step: "04",
    title: "Запись на экзамен",
    desc: "Помогаем выбрать дату и подготовиться к офису DGT.",
  },
  {
    step: "05",
    title: "Права в руках",
    desc: "Вы сдаёте теорию и получаете временные права уже в тот же день.",
  },
];

const PLANS = [
  {
    name: "Теория",
    price: 199,
    features: ["16 живых эфиров", "Платформа Skilyapp 3 мес", "Записи 30 дней", "Telegram-чат"],
    highlight: false,
    param: "buy_basic",
  },
  {
    name: "С сопровождением",
    price: 259,
    badge: "Хит потока",
    features: ["16 живых эфиров", "Платформа 6 мес", "Записи 6 мес", "Закрытый чат с куратором", "Испанский для водителей", "Помощь с документами"],
    highlight: true,
    param: "buy_pro",
  },
  {
    name: "VIP",
    price: 349,
    badge: "Под ключ",
    features: ["16 живых эфиров", "Платформа 12 мес (Unlimited)", "Записи навсегда", "Личная поддержка 24/7", "Испанский для водителей", "Разбор твоих документов", "Полное ведение до прав"],
    highlight: false,
    accent: "violet",
    param: "buy_vip",
  },
];

const REVIEWS = [
  { name: "Анна К.", text: "Сдала с первого раза! Очень доступно объясняют, даже знаки запомнила легко.", stars: 5 },
  { name: "Михаил Р.", text: "Взял тариф с сопровождением — помогли со всеми документами. Отдельное спасибо за терпение.", stars: 5 },
  { name: "Елена Д.", text: "До курса три раза пробовала сама — провалилась. Здесь разобрались за два месяца.", stars: 5 },
];

const FAQ = [
  {
    q: "Когда следующий поток?",
    a: "Старт: 5 мая. Набор открыт — осталось несколько мест.",
  },
  {
    q: "Я совсем не говорю по-испански — справлюсь?",
    a: "Да. В тарифе «С сопровождением» и VIP есть мини-курс испанского для водителей. Специфическую лексику разбираем на уроках.",
  },
  {
    q: "Что если не сдам с первого раза?",
    a: "Мы поддерживаем до результата. VIP-ученики получают сопровождение до получения прав без доплат.",
  },
  {
    q: "Как проходят занятия?",
    a: "Живые эфиры в Zoom, 2 раза в неделю по 2 часа. Все записи остаются у вас.",
  },
  {
    q: "Можно оплатить частями?",
    a: "Оплата разовая при бронировании. Напишите нам в Telegram — обсудим индивидуально.",
  },
];

// ─── LeadForm ─────────────────────────────────────────────────────────────────

function LeadForm() {
  const [form, setForm] = useState({ name: "", phone: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      await submitCourseLead({ name: form.name, phone: form.phone });
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="text-center py-8">
        <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-3" />
        <p className="text-white font-bold text-lg">Заявка принята!</p>
        <p className="text-zinc-400 text-sm mt-1">Мы свяжемся с вами в течение 24 часов.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        type="text"
        placeholder="Ваше имя"
        value={form.name}
        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        required
        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors text-sm"
      />
      <input
        type="tel"
        placeholder="Телефон или Telegram"
        value={form.phone}
        onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
        required
        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors text-sm"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2"
      >
        {status === "loading" ? (
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            <Send className="w-4 h-4" />
            Оставить заявку
          </>
        )}
      </button>
      {status === "error" && (
        <p className="text-red-400 text-xs text-center">Ошибка. Напишите нам в Telegram.</p>
      )}
    </form>
  );
}

// ─── FaqItem ──────────────────────────────────────────────────────────────────

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-white/8 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left text-sm font-semibold text-white hover:bg-white/3 transition-colors"
      >
        {q}
        <ChevronDown className={cn("w-4 h-4 text-zinc-400 shrink-0 transition-transform duration-300", open && "rotate-180")} />
      </button>
      {open && (
        <div className="px-6 pb-4 text-sm text-zinc-400 leading-relaxed border-t border-white/5">
          <p className="pt-3">{a}</p>
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <main className="pt-16">

      {/* Hero */}
      <section className="min-h-[90vh] flex flex-col items-center justify-center text-center px-4 py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/5 via-transparent to-transparent pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-medium mb-8">
            🎓 Поток 52 · Старт 5 мая · Осталось 4 места
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white mb-6 tracking-tight leading-[1.05]">
            Сдаём теорию DGT.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              Вместе и с первого раза.
            </span>
          </h1>
          <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Живой онлайн-курс для тех, кто хочет получить водительские права в Испании
            без бюрократических ловушек и лишних нервов.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://t.me/skilyapp_bot?start=course"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-base transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              Занять место в Telegram
            </a>
            <a
              href="#pricing"
              className="px-8 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-base transition-colors"
            >
              Посмотреть тарифы
            </a>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="relative z-10 mt-20 grid grid-cols-3 gap-6 max-w-lg mx-auto w-full">
          {[
            { value: "9/10", label: "сдают с первого раза" },
            { value: "16 000+", label: "вопросов в базе" },
            { value: "2 мес", label: "длительность курса" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-2xl font-black text-white">{s.value}</div>
              <div className="text-xs text-zinc-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Stages */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-white text-center mb-4">Как это работает</h2>
          <p className="text-zinc-400 text-center mb-14">5 шагов от записи до прав в руках</p>
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/50 via-blue-500/20 to-transparent hidden sm:block" />
            <div className="flex flex-col gap-8">
              {STAGES.map((s) => (
                <div key={s.step} className="flex gap-6 items-start">
                  <div className="w-12 h-12 rounded-full border border-blue-500/40 bg-blue-500/10 flex items-center justify-center text-blue-400 font-black text-xs shrink-0">
                    {s.step}
                  </div>
                  <div className="pt-2">
                    <h3 className="font-bold text-white mb-1">{s.title}</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What's included */}
      <section className="py-24 px-4 bg-white/[0.02]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-white text-center mb-4">Что входит в курс</h2>
          <p className="text-zinc-400 text-center mb-14">Всё необходимое для уверенной сдачи</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { icon: BookOpen, title: "16 живых эфиров", desc: "2 раза в неделю по 2 часа. Разбираем теорию и практику." },
              { icon: Users, title: "Закрытый чат", desc: "Общение с куратором и другими учениками. Вы не одни." },
              { icon: Clock, title: "Записи занятий", desc: "Можно пересматривать в любое время. Не пропустите ничего." },
              { icon: FileText, title: "Помощь с документами", desc: "Пошаговый чеклист + разбор вашего конкретного случая." },
              { icon: Award, title: "Платформа Skilyapp", desc: "3000+ вопросов, симуляция экзамена, ИИ-обучение в подарок." },
              { icon: Star, title: "Испанский для водителей", desc: "Мини-курс: знаки, термины, общение с инспектором." },
            ].map((item) => (
              <div key={item.title} className="p-5 rounded-2xl bg-white/[0.03] border border-white/8 hover:border-white/15 transition-colors">
                <item.icon className="w-5 h-5 text-blue-400 mb-3" />
                <h3 className="font-bold text-white text-sm mb-1">{item.title}</h3>
                <p className="text-zinc-500 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-white text-center mb-4">Тарифы</h2>
          <p className="text-zinc-400 text-center mb-14">Полная оплата при бронировании</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={cn(
                  "relative flex flex-col rounded-3xl border p-6",
                  plan.highlight
                    ? "border-blue-500/40 bg-blue-500/5 ring-1 ring-blue-500/20"
                    : plan.accent === "violet"
                    ? "border-violet-500/30 bg-violet-500/5"
                    : "border-white/8 bg-white/[0.02]"
                )}
              >
                {plan.badge && (
                  <span className={cn(
                    "absolute -top-3 left-6 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                    plan.highlight ? "bg-blue-500 text-white" : "bg-violet-500 text-white"
                  )}>
                    {plan.badge}
                  </span>
                )}
                <h3 className="text-lg font-black text-white mb-1 mt-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-5">
                  <span className="text-4xl font-black text-white">€{plan.price}</span>
                  <span className="text-zinc-500 text-sm">разово</span>
                </div>
                <ul className="flex flex-col gap-2.5 mb-6 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-zinc-300">
                      <CheckCircle2 className={cn("w-4 h-4 shrink-0 mt-0.5", plan.highlight ? "text-blue-400" : plan.accent === "violet" ? "text-violet-400" : "text-zinc-400")} />
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href={`https://t.me/skilyapp_bot?start=${plan.param}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "w-full py-3.5 rounded-2xl text-center font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98]",
                    plan.highlight
                      ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/25"
                      : plan.accent === "violet"
                      ? "bg-gradient-to-r from-violet-500 to-purple-500 text-white"
                      : "bg-white/8 border border-white/10 text-white hover:bg-white/12"
                  )}
                >
                  Занять место →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-24 px-4 bg-white/[0.02]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-white text-center mb-14">Отзывы учеников</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {REVIEWS.map((r) => (
              <div key={r.name} className="p-5 rounded-2xl bg-white/[0.03] border border-white/8">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: r.stars }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-zinc-300 text-sm leading-relaxed mb-3">"{r.text}"</p>
                <p className="text-zinc-600 text-xs font-semibold">{r.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-white text-center mb-14">Частые вопросы</h2>
          <div className="flex flex-col gap-3">
            {FAQ.map((item) => (
              <FaqItem key={item.q} q={item.q} a={item.a} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Form */}
      <section className="py-24 px-4">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-3xl font-black text-white mb-3">Запишитесь сейчас</h2>
          <p className="text-zinc-400 text-sm mb-8">Нет Telegram? Оставьте заявку — мы свяжемся с вами.</p>
          <div className="p-6 rounded-3xl border border-white/8 bg-white/[0.02]">
            <LeadForm />
          </div>
        </div>
      </section>

    </main>
  );
}
