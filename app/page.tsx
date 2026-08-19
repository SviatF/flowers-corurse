"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const programs = [
  {
    no: "01",
    title: "Флорист від нуля до результату",
    description:
      "Для тих, хто хоче освоїти професію флориста та отримати міцну базу знань.",
    price: "199 €",
  },
  {
    no: "02",
    title: "Флористичний бізнес від А до Я",
    description:
      "Покроковий курс про запуск і розвиток власного квіткового бізнесу.",
    price: "799 €",
  },
  {
    no: "03",
    title: "VIP-наставництво · 3 місяці",
    description:
      "Індивідуальний супровід: від концепції та закупівель до перших продажів і клієнтів.",
    price: "2999 €",
  },
];

const topics = [
  {
    no: "01",
    title: "Професійна флористика",
    text: "Композиція, колір, форми, сезонність, догляд за квіткою та впевнена робота руками.",
  },
  {
    no: "02",
    title: "Бізнес-система",
    text: "Закупівлі, собівартість, ціноутворення, асортимент, процеси та фінансова логіка.",
  },
  {
    no: "03",
    title: "Продажі & бренд",
    text: "Позиціонування, контент, упаковка, комунікація з клієнтом і системні продажі.",
  },
  {
    no: "04",
    title: "Власний стиль",
    text: "Почерк, смак, впевненість у своїй ціні та професійне ім’я, яке запам’ятовують.",
  },
];

const skills = [
  "КОМПОЗИЦІЯ",
  "КОЛІР",
  "ФОРМА",
  "СЕЗОННІСТЬ",
  "СОБІВАРТІСТЬ",
  "БРЕНД",
  "ПРОДАЖІ",
  "КОМПОЗИЦІЯ",
  "КОЛІР",
  "ФОРМА",
  "СЕЗОННІСТЬ",
  "СОБІВАРТІСТЬ",
  "БРЕНД",
  "ПРОДАЖІ",
];

const reveal = {
  initial: { opacity: 0, y: 60 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.8, ease: [0.2, 0.8, 0.2, 1] as const },
};

export default function HomePage() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const flowerY = useTransform(scrollYProgress, [0, 1], [0, 240]);
  const flowerScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.78], [1, 0.15]);

  return (
    <main>
      <section ref={heroRef} className="local-hero" id="top">
        <header className="local-nav shell">
          <a className="local-brand" href="#top">FLORAL EDUCATION</a>
          <nav>
            <a href="#programs">Програми</a>
            <a href="#learning">Навчання</a>
            <a className="local-nav-cta" href="#contact">Обрати формат</a>
          </nav>
        </header>

        <div className="local-hero-stage">
          <motion.div
            className="local-hero-flowers"
            style={{ y: flowerY, scale: flowerScale }}
            aria-hidden="true"
          >
            <img src="/assets/hero-current.webp" alt="" />
          </motion.div>

          <motion.h1
            className="local-hero-title"
            style={{ y: titleY, opacity: titleOpacity }}
          >
            <span>ГРОШІ</span>
            <span>НА КВІТАХ</span>
          </motion.h1>

          <motion.p
            className="local-hero-subtitle"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.8 }}
          >
            Перетвори любов до квітів<br />
            на професію, стиль і бізнес.
          </motion.p>

          <div className="local-hero-scroll">SCROLL ↓</div>
        </div>
      </section>

      <section className="local-intro">
        <div className="shell">
          <motion.p className="local-intro-kicker" {...reveal}>ФЛОРИСТИКА МОЖЕ СТАТИ</motion.p>
          <motion.h2 {...reveal}>
            Не просто творчістю,
            <br />
            а справою твого життя.
          </motion.h2>
          <motion.div className="local-intro-grid" {...reveal}>
            <p className="lead">
              Красивого букета недостатньо. Потрібно розуміти композицію,
              колір, сезонність, закупівлі, собівартість і продажі.
            </p>
            <p>
              Ми будуємо систему від професійної бази та власного почерку до
              продукту, бренду, клієнтів і бізнес-процесів. Ти не просто дивишся
              уроки — ти розумієш, що робити далі.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="local-marquee" aria-label="Ключові навички">
        <div className="local-marquee-track">
          {skills.map((skill, index) => (
            <span key={`${skill}-${index}`}>{skill} ✦</span>
          ))}
        </div>
      </section>

      <section className="local-programs" id="programs">
        <div className="shell local-programs-head">
          <motion.div {...reveal}>
            <span className="local-label">ТРИ РІВНІ</span>
            <div className="local-programs-big">ТВОЯ</div>
            <div className="local-programs-big local-programs-big-offset">ТОЧКА СТАРТУ</div>
          </motion.div>
          <motion.p {...reveal}>
            Обери формат під свою ситуацію зараз. Кожна програма веде до
            конкретного наступного рівня — від першої композиції до власного
            квіткового бізнесу.
          </motion.p>
        </div>

        <div className="local-program-list">
          {programs.map((program) => (
            <motion.a
              href="#contact"
              className="local-program-row"
              key={program.no}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.6 }}
            >
              <span className="local-program-no">{program.no}</span>
              <strong>{program.title}</strong>
              <p>{program.description}</p>
              <b>{program.price}</b>
              <span className="local-program-arrow">↗</span>
            </motion.a>
          ))}
        </div>
      </section>

      <section className="local-learning" id="learning">
        <div className="shell local-learning-head">
          <span className="local-label">ЩО ТИ ОТРИМАЄШ</span>
          <p>
            Не набір випадкових уроків, а систему навичок, які працюють разом.
          </p>
        </div>
        <div className="local-topic-grid">
          {topics.map((topic, index) => (
            <motion.article
              className="local-topic-card"
              key={topic.no}
              initial={{ opacity: 0, y: 45 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.65, delay: index * 0.06 }}
            >
              <span>{topic.no}</span>
              <b>↗</b>
              <h3>{topic.title}</h3>
              <p>{topic.text}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="local-vip">
        <motion.div
          className="local-vip-media"
          initial={{ scale: 1.08 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 1.2 }}
        >
          <img src="/assets/florist-hero.webp" alt="Квіти та флористика" />
        </motion.div>
        <div className="local-vip-overlay">
          <span className="local-label">VIP НАСТАВНИЦТВО · 3 МІСЯЦІ</span>
          <div className="local-vip-word">ЗАПУСТИ</div>
          <div className="local-vip-word local-vip-word-offset">СВІЙ</div>
          <div className="local-vip-word">БІЗНЕС</div>
          <p>
            Працюємо разом над концепцією, закупівлями, цінами, упаковкою,
            продажами та першими клієнтами.
          </p>
          <a href="#contact">Дізнатись про VIP →</a>
        </div>
      </section>

      <section className="local-cta" id="contact">
        <div className="shell">
          <motion.span className="local-label" {...reveal}>ГОТОВА ДО НАСТУПНОГО РІВНЯ?</motion.span>
          <motion.h2 {...reveal}>Обери програму, яка відповідає твоїй точці зараз.</motion.h2>
          <motion.div className="local-cta-actions" {...reveal}>
            <a href="#programs">Переглянути програми →</a>
            <span>Від 199 €</span>
          </motion.div>
        </div>
      </section>

      <footer className="local-footer">
        <div className="shell local-footer-grid">
          <div className="local-footer-title">КВІТИ МОЖУТЬ СТАТИ ТВОЄЮ ПРОФЕСІЄЮ.</div>
          <div className="local-footer-links">
            <a href="#programs"><span>01</span>Програми</a>
            <a href="#learning"><span>02</span>Що ти отримаєш</a>
            <a href="#contact"><span>03</span>Обрати формат</a>
          </div>
          <div className="local-footer-bottom">
            <span>© 2026 Floral Education</span>
            <a href="#top">Нагору ↑</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
