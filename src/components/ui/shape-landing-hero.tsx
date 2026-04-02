import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

function ElegantShape({
    className,
    delay = 0,
    width = 400,
    height = 100,
    rotate = 0,
    gradient = "from-white/[0.08]",
}: {
    className?: string;
    delay?: number;
    width?: number;
    height?: number;
    rotate?: number;
    gradient?: string;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: -80, rotate: rotate - 10 }}
            animate={{ opacity: 1, y: 0, rotate: rotate }}
            transition={{
                duration: 2,
                delay,
                ease: [0.23, 0.86, 0.39, 0.96],
                opacity: { duration: 1 },
            }}
            className={cn("absolute", className)}
            style={{ willChange: "transform" }}
        >
            <div
                style={{
                    width,
                    height,
                    animation: `heroFloat ${10 + delay * 2}s ease-in-out infinite`,
                    willChange: "transform",
                }}
                className="relative"
            >
                <div
                    className={cn(
                        "absolute inset-0 rounded-full",
                        "bg-gradient-to-r to-transparent",
                        gradient,
                        "border border-white/[0.12]",
                        "shadow-[0_4px_24px_0_rgba(255,255,255,0.06)]"
                    )}
                />
            </div>
        </motion.div>
    );
}

export function HeroGeometric({
    badge,
    title1 = "Водительские права в Испании",
    title2 = "Сдаём DGT с первой попытки",
    description = "Готовим к теоретическому экзамену на русском языке. Объясняем логику ПДД, разбираем 16 000 вопросов, берём на себя Cita, Tasa и психотест.",
    children,
}: {
    badge?: React.ReactNode;
    title1?: string;
    title2?: string;
    description?: string;
    children?: React.ReactNode;
}) {
    const fadeUp = (i: number) => ({
        hidden: { opacity: 0, y: 24 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                delay: 0.4 + i * 0.15,
                ease: [0.25, 0.4, 0.25, 1],
            },
        },
    });

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#060a14]">
            {/* Ambient gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/[0.07] via-transparent to-cyan-500/[0.05] pointer-events-none" />

            {/* Elegant floating shapes — GPU-composited, no backdrop-blur */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Большие фигуры — видны всегда */}
                <ElegantShape
                    delay={0.2}
                    width={550}
                    height={120}
                    rotate={12}
                    gradient="from-blue-500/[0.18]"
                    className="left-[-8%] top-[18%]"
                />
                <ElegantShape
                    delay={0.4}
                    width={440}
                    height={100}
                    rotate={-14}
                    gradient="from-cyan-500/[0.14]"
                    className="right-[-4%] top-[72%]"
                />
                {/* Мелкие фигуры — только на планшетах и десктопах */}
                <ElegantShape
                    delay={0.3}
                    width={280}
                    height={70}
                    rotate={-8}
                    gradient="from-violet-500/[0.13]"
                    className="hidden md:block left-[8%] bottom-[8%]"
                />
                <ElegantShape
                    delay={0.5}
                    width={170}
                    height={48}
                    rotate={18}
                    gradient="from-amber-500/[0.13]"
                    className="hidden md:block right-[18%] top-[12%]"
                />
                <ElegantShape
                    delay={0.6}
                    width={130}
                    height={36}
                    rotate={-22}
                    gradient="from-blue-400/[0.12]"
                    className="hidden lg:block left-[22%] top-[8%]"
                />
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-4 md:px-6 py-24">
                <div className="max-w-3xl mx-auto text-center">

                    {/* Badge */}
                    {badge && (
                        <motion.div
                            variants={fadeUp(0)}
                            initial="hidden"
                            animate="visible"
                            className="mb-10 flex justify-center"
                        >
                            {badge}
                        </motion.div>
                    )}

                    {/* Heading */}
                    <motion.div
                        variants={fadeUp(1)}
                        initial="hidden"
                        animate="visible"
                    >
                        <h1 className="text-[2.4rem] sm:text-5xl md:text-6xl font-black mb-6 tracking-tight leading-[1.08]">
                            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/75">
                                {title1}
                            </span>
                            <br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-300">
                                {title2}
                            </span>
                        </h1>
                    </motion.div>

                    {/* Description */}
                    <motion.div
                        variants={fadeUp(2)}
                        initial="hidden"
                        animate="visible"
                    >
                        <p className="text-sm sm:text-base text-zinc-500 mb-10 leading-relaxed font-normal max-w-xl mx-auto">
                            {description}
                        </p>
                    </motion.div>

                    {/* CTA slot */}
                    <motion.div
                        variants={fadeUp(3)}
                        initial="hidden"
                        animate="visible"
                        className="w-full"
                    >
                        {children}
                    </motion.div>
                </div>
            </div>

            {/* Bottom fade */}
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#060a14] to-transparent pointer-events-none" />
        </div>
    );
}
