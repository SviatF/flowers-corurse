"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const FLOWER_A = "https://framerusercontent.com/images/nT1RIIaymTzAI6UESI2yEzrKinU.png?height=1377&width=2022";
const FLOWER_B = "https://framerusercontent.com/images/8sPkB8j9n1Ptg7bXTdHv4SS8tiY.png?height=4162&width=3244";
const TEXTURE = "https://framerusercontent.com/images/gftqxfc3tRP15LUZMd0IyxdCSVc.webp?height=992&width=2000";

const programs = [
  {
    no: "01",
    title: "Флорист від нуля до результату",
    subtitle: "Сильна база для старту у професії.",
    price: "199 €",
  },
  {
    no: "02",
    title: "Флористичний бізнес від А до Я",
    subtitle: "Запуск і розвиток власного квіткового бізнесу.",
    price: "799 €",
  },
  {
    no: "03",
    title: "VIP-наставництво",
    subtitle: "3 місяці персонального супроводу до запуску.",
    price: "2999 €",
  },
];

function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 55 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8%" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function Home() {
  const hero = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: hero, offset: ["start start", "end start"] });
  const heroFlowerY = useTransform(scrollYProgress, [0, 1], [0, 240]);
  const heroFlowerR = useTransform(scrollYProgress, [0, 1], [-7, 24]);
  const heroCopyY = useTransform(scrollYProgress, [0, 1], [0, -130]);

  return (
    <main>
      <section ref={hero} className="dm-hero" id="top">
        <header className="dm-nav page-pad">
          <a href="#top" className="wordmark">FLORIST</a>
          <div className="nav-right">
            <a href="#programs">ПРОГРАМИ</a>
            <a href="#learn">ПРО НАВЧАННЯ</a>
            <a href="#contact" className="menu">MENU</a>
          </div>
        </header>

        <motion.div className="hero-copy" style={{ y: heroCopyY }}>
          <p className="hero-small">НАВЧАННЯ ФЛОРИСТИЦІ · БІЗНЕС · НАСТАВНИЦТВО</p>
          <h1>
            Допомагаю флористам
            <span>створювати красу</span>
            <span className="indent">і будувати бізнес.</span>
          </h1>
        </motion.div>

        <motion.img
          src={FLOWER_A}
          alt=""
          className="asset hero-flower"
          style={{ y: heroFlowerY, rotate: heroFlowerR }}
        />
        <motion.img
          src={FLOWER_B}
          alt=""
          className="asset hero-flower-secondary"
          initial={{ rotate: 8, scale: 0.86 }}
          animate={{ rotate: [8, 13, 8], scale: [0.86, 0.9, 0.86] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="hero-foot page-pad">
          <span>SCROLL TO EXPLORE</span>
          <span>↓</span>
        </div>
      </section>

      <section className="dm-belief" id="learn">
        <div className="belief-title page-pad">
          <Reveal>
            <h2>
              Бути флористом
              <span>— одна з найкрасивіших</span>
              <span className="indent-lg">професій у світі.</span>
            </h2>
          </Reveal>
        </div>
        <motion.img
          src={FLOWER_B}
          alt=""
          className="asset belief-flower"
          whileInView={{ rotate: [-18, 5], y: [120, 0] }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        />

        <div className="belief-copy page-pad">
          <Reveal className="lead-copy">
            <p>Чому так мало флористів живуть так, як хочуть?</p>
          </Reveal>
          <div className="long-copy">
            <Reveal><p>Ти можеш роками вчитись збирати композиції, відчувати колір і бачити красу там, де інші її не помічають. Але цього недостатньо, якщо ніхто не показав, як перетворити навичку на професію, продукт і стабільний дохід.</p></Reveal>
            <Reveal><p>Саме тому навчання побудоване не навколо красивої теорії. Ми працюємо з ремеслом, власним стилем, клієнтом, закупівлями, ціноутворенням, продажами та бізнес-моделлю.</p></Reveal>
            <Reveal><p>Мета проста: щоб квіти залишались тим, що ти любиш, але водночас стали системою, на якій можна побудувати сильну карʼєру або власний бренд.</p></Reveal>
          </div>
        </div>
      </section>

      <section className="experience-band">
        <div className="experience-copy page-pad">
          <span>ВІД ПЕРШОЇ КОМПОЗИЦІЇ</span>
          <span>ДО ВЛАСНОГО КВІТКОВОГО БІЗНЕСУ</span>
        </div>
        <img src={TEXTURE} alt="" className="band-texture" />
      </section>

      <section className="dm-hits" id="programs">
        <div className="hits-heading page-pad">
          <div className="hits-kicker">ОБЕРИ СВІЙ РІВЕНЬ</div>
          <h2><span>three</span> programs</h2>
          <p>Від першого кроку у флористиці — до запуску власного бізнесу з персональним супроводом.</p>
        </div>

        <div className="program-list">
          {programs.map((p, i) => (
            <motion.a
              href="#contact"
              className="program-row page-pad"
              key={p.no}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="program-no">{p.no}</div>
              <div className="program-copy">
                <h3>{p.title}</h3>
                <p>{p.subtitle}</p>
              </div>
              <div className="program-price">{p.price}</div>
              <div className="program-arrow">↗</div>
            </motion.a>
          ))}
        </div>
      </section>

      <section className="dm-topics">
        <div className="topics-label page-pad">ЩО МИ БУДУЄМО РАЗОМ</div>
        <div className="topic-grid">
          {[
            ["01", "Техніка", "Композиція, форма, колір, сезонність."],
            ["02", "Стиль", "Власна впізнавана флористична мова."],
            ["03", "Продаж", "Ціна, упаковка, клієнт і комунікація."],
            ["04", "Бізнес", "Система, закупівлі, команда й масштаб."],
          ].map(([n, t, d]) => (
            <motion.div className="topic-card" key={n} whileHover={{ y: -10 }}>
              <span>{n}</span>
              <h3>{t}</h3>
              <p>{d}</p>
              <b>↗</b>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="dm-quote">
        <motion.img
          src={FLOWER_A}
          alt=""
          className="asset quote-flower"
          whileInView={{ rotate: [-30, 12], scale: [0.75, 1] }}
          transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
        />
        <div className="page-pad quote-inner">
          <p className="quote-kicker">ПІДХІД</p>
          <Reveal><blockquote>“Не просто навчитись збирати букети. Навчитись створювати цінність, за яку готові платити.”</blockquote></Reveal>
          <p className="quote-author">FLORAL EDUCATION / 2026</p>
        </div>
      </section>

      <section className="dm-cta" id="contact">
        <img src={FLOWER_B} alt="" className="asset cta-flower" />
        <div className="cta-copy page-pad">
          <p>ГОТОВА ПОЧАТИ?</p>
          <h2>Отримай<br/>свої <em>квіти.</em></h2>
          <a href="mailto:hello@florist.education" className="cta-link">ОБРАТИ ПРОГРАМУ ↗</a>
        </div>
      </section>

      <footer className="dm-footer page-pad">
        <div className="wordmark">FLORIST</div>
        <p>Навчання, що перетворює талант на професію.</p>
        <a href="#top">BACK TO TOP ↑</a>
      </footer>
    </main>
  );
}
