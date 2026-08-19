"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const offers = [
  {
    number: "01",
    title: "Флорист від нуля до результату",
    price: "199 €",
    text: "Для тих, хто хоче освоїти професію флориста та отримати міцну базу знань.",
    tone: "soft",
  },
  {
    number: "02",
    title: "Флористичний бізнес від А до Я",
    price: "799 €",
    text: "Покроковий курс про запуск, упаковку та розвиток власного квіткового бізнесу.",
    tone: "acid",
  },
  {
    number: "03",
    title: "VIP-наставництво",
    price: "2999 €",
    text: "3 місяці індивідуального супроводу: від концепції та закупівель до перших продажів і клієнтів.",
    tone: "dark",
  },
];

function Flower({ className = "" }: { className?: string }) {
  return (
    <div className={`flower ${className}`} aria-hidden="true">
      <span className="petal p1" />
      <span className="petal p2" />
      <span className="petal p3" />
      <span className="petal p4" />
      <span className="petal p5" />
      <span className="flower-core" />
    </div>
  );
}

function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 70 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const flowerY = useTransform(scrollYProgress, [0, 1], [0, 260]);
  const flowerRotate = useTransform(scrollYProgress, [0, 1], [-12, 45]);
  const flowerScale = useTransform(scrollYProgress, [0, 1], [1, 1.34]);
  const headlineY = useTransform(scrollYProgress, [0, 1], [0, -110]);

  return (
    <main>
      <section ref={heroRef} className="hero section-grid">
        <header className="nav shell">
          <a className="brand" href="#top" aria-label="Florist home">
            FLORIST<span>•</span>
          </a>
          <nav>
            <a href="#programs">Програми</a>
            <a href="#about">Про навчання</a>
            <a className="menu-pill" href="#contact">Записатись</a>
          </nav>
        </header>

        <div id="top" className="hero-inner shell">
          <motion.div className="hero-copy" style={{ y: headlineY }}>
            <p className="eyebrow">Навчання · Бізнес · Наставництво</p>
            <h1>
              Створи кар’єру,
              <br />
              що <em>розквітає.</em>
            </h1>
            <div className="hero-bottom">
              <p>
                Не просто навчитись збирати букети. Побудувати навички, стиль і бізнес,
                які працюють у реальному світі.
              </p>
              <a className="round-link" href="#programs" aria-label="Переглянути програми">
                ↓
              </a>
            </div>
          </motion.div>

          <motion.div
            className="hero-flower-wrap"
            style={{ y: flowerY, rotate: flowerRotate, scale: flowerScale }}
          >
            <Flower className="hero-flower" />
          </motion.div>
        </div>

        <div className="hero-ticker" aria-hidden="true">
          <div>
            <span>FLORAL EDUCATION</span><span>BUILD YOUR CRAFT</span><span>BUILD YOUR BUSINESS</span>
            <span>FLORAL EDUCATION</span><span>BUILD YOUR CRAFT</span><span>BUILD YOUR BUSINESS</span>
          </div>
        </div>
      </section>

      <section id="about" className="manifesto section-grid">
        <div className="shell manifesto-grid">
          <Reveal className="manifesto-kicker">
            <span>01</span>
            <p>Професія, у якій смак перетворюється на цінність.</p>
          </Reveal>

          <Reveal className="manifesto-copy">
            <h2>
              Флористика — це не тільки про <i>красиві квіти.</i>
            </h2>
            <p>
              Це композиція, відчуття кольору, робота з клієнтом, закупівлі, ціноутворення,
              продажі й уміння перетворити творчість на систему.
            </p>
          </Reveal>
        </div>

        <motion.div
          className="floating-flower one"
          initial={{ rotate: -25, y: 80 }}
          whileInView={{ rotate: 18, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <Flower />
        </motion.div>
      </section>

      <section className="statement">
        <div className="statement-line left">ВІД СМАКУ</div>
        <div className="statement-line right">ДО СИСТЕМИ</div>
        <div className="statement-line left italic">ВІД БУКЕТА</div>
        <div className="statement-line right">ДО БРЕНДУ</div>
      </section>

      <section id="programs" className="programs">
        <div className="shell section-head">
          <span>02 / Програми</span>
          <p>Обери рівень, на якому ти зараз — і наступний, до якого хочеш дійти.</p>
        </div>

        <div className="program-list">
          {offers.map((offer, index) => (
            <motion.article
              key={offer.number}
              className={`program-card ${offer.tone}`}
              initial={{ opacity: 0, y: 90 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.8, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="program-number">{offer.number}</div>
              <div className="program-main">
                <h3>{offer.title}</h3>
                <p>{offer.text}</p>
              </div>
              <div className="program-price">{offer.price}</div>
              <div className="program-arrow">↗</div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="story section-grid">
        <div className="shell story-grid">
          <Reveal className="story-title">
            <span>03 / Як це працює</span>
            <h2>Менше теорії. Більше рішень, які можна застосувати завтра.</h2>
          </Reveal>

          <div className="steps">
            {[
              ["01", "База", "Композиція, колір, форми, сезонність і робота з квіткою."],
              ["02", "Практика", "Завдання, розбори й системне відточування власної подачі."],
              ["03", "Монетизація", "Ціна, клієнт, позиціонування, продаж і бізнес-процеси."],
            ].map(([n, title, text]) => (
              <Reveal key={n} className="step">
                <span>{n}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </Reveal>
            ))}
          </div>
        </div>

        <motion.div
          className="floating-flower two"
          whileInView={{ rotate: 360 }}
          viewport={{ once: false, amount: 0.1 }}
          transition={{ duration: 18, ease: "linear", repeat: Infinity }}
        >
          <Flower />
        </motion.div>
      </section>

      <section className="quote-band">
        <div className="quote-track">
          <span>КВІТИ — ЦЕ МОВА</span><i>✳</i><span>БІЗНЕС — ЦЕ СИСТЕМА</span><i>✳</i>
          <span>КВІТИ — ЦЕ МОВА</span><i>✳</i><span>БІЗНЕС — ЦЕ СИСТЕМА</span><i>✳</i>
        </div>
      </section>

      <section id="contact" className="cta section-grid">
        <div className="shell cta-inner">
          <Reveal>
            <p className="eyebrow">Готова почати?</p>
            <h2>
              Твоя нова професія
              <br />
              може початися <em>сьогодні.</em>
            </h2>
          </Reveal>

          <Reveal className="cta-actions">
            <a className="primary-btn" href="mailto:hello@florist.education">Обрати програму ↗</a>
            <p>Напиши нам — допоможемо зрозуміти, який формат підійде саме тобі.</p>
          </Reveal>

          <div className="cta-flower">
            <Flower />
          </div>
        </div>
      </section>

      <footer className="footer shell">
        <div className="brand">FLORIST<span>•</span></div>
        <p>© 2026 Floral Education</p>
        <a href="#top">На початок ↑</a>
      </footer>
    </main>
  );
}
