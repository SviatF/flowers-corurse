"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const flowerHero = "https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=1400&q=90";
const flowerPink = "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=1200&q=90";
const flowerDark = "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1200&q=90";
const flowerYellow = "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1200&q=90";

const programs = [
  { no: "01", title: "Флорист від нуля", desc: "Професійна база, композиція, колір і практика.", price: "199 €" },
  { no: "02", title: "Флористичний бізнес", desc: "Запуск, упаковка, ціноутворення, продажі та система.", price: "799 €" },
  { no: "03", title: "VIP наставництво", desc: "Персональний супровід до сильного бренду та продажів.", price: "2999 €" },
];

const quotes = [
  ["Я нарешті зрозуміла, як формувати ціну без страху.", "Марія", "випускниця"],
  ["Курс дав не просто техніку, а систему мислення флориста.", "Олена", "флорист"],
  ["Після навчання я відкрила свою студію й перестала працювати хаотично.", "Ірина", "власниця студії"],
  ["Найцінніше — розбір реальних ситуацій, а не суха теорія.", "Софія", "випускниця"],
  ["Тепер я знаю, що продавати, кому і як це красиво показати.", "Анна", "флорист"],
  ["Візуал, бізнес і продажі нарешті склались в одну картину.", "Катерина", "власниця бренду"],
];

function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div className={className} initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

function FlowerImage({ src, className = "", alt = "" }: { src: string; className?: string; alt?: string }) {
  return <img className={className} src={src} alt={alt} loading="lazy" />;
}

export default function Home() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 210]);
  const heroRotate = useTransform(scrollYProgress, [0, 1], [-7, 18]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -120]);

  return (
    <main>
      <section ref={heroRef} className="hero" id="top">
        <header className="nav shell">
          <a className="wordmark" href="#top">FLORAL SCHOOL</a>
          <nav>
            <a href="#programs">Навчання</a>
            <a href="#stories">Історії</a>
            <a className="menu" href="#contact">MENU</a>
          </nav>
        </header>

        <div className="hero-stage shell">
          <motion.div className="hero-copy" style={{ y: copyY }}>
            <h1>
              Допомагаю флористам
              <span>заробляти більше</span>
              і отримувати свої квіти.
            </h1>
          </motion.div>

          <motion.div className="hero-visual" style={{ y: heroY, rotate: heroRotate }}>
            <div className="hero-image-mask">
              <FlowerImage src={flowerHero} alt="Квіти" />
            </div>
          </motion.div>

          <div className="hero-chip chip-one">FLORAL</div>
          <div className="hero-chip chip-two">EDUCATION</div>
          <div className="hero-chip chip-three">BUSINESS</div>
        </div>
      </section>

      <section className="belief">
        <div className="shell belief-grid">
          <Reveal className="belief-title">
            <h2>Бути флористом — одна з найкрасивіших професій у світі.</h2>
          </Reveal>
          <Reveal className="belief-side">
            <p className="lead">Чому тоді так багато талановитих флористів працюють багато, а заробляють мало?</p>
            <p>Вас навчили збирати композиції. Але майже ніхто не вчить продавати свою експертизу, рахувати маржу, будувати бренд і системно залучати клієнтів.</p>
            <p>Тут ми поєднуємо craft, смак, позиціонування та бізнес. Щоб робота з квітами змінювала не тільки простір клієнта — а й ваше власне життя.</p>
          </Reveal>
        </div>
        <motion.div className="belief-flower" initial={{ rotate: -15, y: 90 }} whileInView={{ rotate: 8, y: 0 }} viewport={{ once: false }} transition={{ duration: 1.2 }}>
          <FlowerImage src={flowerPink} />
        </motion.div>
      </section>

      <section className="brands">
        <div className="shell brand-intro">Я працювала з флористами, студіями й брендами, які хочуть рости системно.</div>
        <div className="brand-marquee">
          <div>
            <span>FLORAL STUDIO</span><span>WEDDINGS</span><span>EVENTS</span><span>RETAIL</span><span>EDUCATION</span><span>FLORAL STUDIO</span><span>WEDDINGS</span><span>EVENTS</span><span>RETAIL</span><span>EDUCATION</span>
          </div>
        </div>
      </section>

      <section className="hits" id="programs">
        <div className="hits-heading shell">
          <div className="hits-big">greatest</div>
          <div className="hits-big italic">hits</div>
          <div className="hits-meta"><span>3 programs</span><span>2026</span><span>and growing</span></div>
          <p>Три формати навчання для різних етапів: від першої професійної бази до побудови власного квіткового бізнесу.</p>
        </div>

        <div className="program-list">
          {programs.map((program, i) => (
            <motion.a href="#contact" className="program-row" key={program.no} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.7 }}>
              <div className="program-no">{program.no}</div>
              <div className="program-title">{program.title}</div>
              <div className="program-desc">{program.desc}</div>
              <div className="program-price">{program.price}</div>
              <div className="program-arrow">↗</div>
            </motion.a>
          ))}
        </div>
      </section>

      <section className="topics">
        <div className="shell topics-head"><span>ALL TOPICS</span><p>Усе, що потрібно, щоб творчість стала професією, а професія — бізнесом.</p></div>
        <div className="topic-grid">
          {[
            ["01", "Композиція & смак", "Колір, форма, сезонність і професійна база."],
            ["02", "Флористичний бізнес", "Ціна, маржа, закупівлі, команда та процеси."],
            ["03", "Продажі & бренд", "Позиціонування, контент, клієнти й повторні покупки."],
            ["04", "Особистий розвиток", "Впевненість, стиль і сильне професійне імʼя."],
          ].map(([n, title, text]) => (
            <article className="topic-card" key={n}>
              <span>{n}</span><h3>{title}</h3><p>{text}</p><b>↗</b>
            </article>
          ))}
        </div>
      </section>

      <section className="testimonials" id="stories">
        <div className="shell testimonials-grid">
          {quotes.map(([quote, name, role], i) => (
            <motion.blockquote key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.8, delay: (i % 3) * 0.05 }}>
              <p>{quote}</p><footer><strong>{name}</strong><span>{role}</span></footer>
            </motion.blockquote>
          ))}
        </div>
      </section>

      <section className="feature">
        <div className="feature-media"><FlowerImage src={flowerDark} alt="Преміальна флористика" /></div>
        <div className="feature-overlay">
          <div className="feature-kicker">featured</div>
          <div className="feature-word word-a">make</div>
          <div className="feature-word word-b">more</div>
          <div className="feature-word word-c">money</div>
          <p>Створи флористичний бізнес, який фінансує життя, яке ти хочеш жити.</p>
          <a href="#contact">Почати свій шлях ↗</a>
        </div>
      </section>

      <section className="guide">
        <div className="guide-copy shell">
          <span>FREE GUIDE</span>
          <h2>Ціноутворення у флористиці може здаватися складним. Але не повинно.</h2>
          <a href="#contact">Отримати гайд ↗</a>
        </div>
        <div className="guide-flower"><FlowerImage src={flowerYellow} /></div>
      </section>

      <section className="reading shell">
        <div className="reading-head"><h2>Що ще допоможе вам рости</h2><span>Рекомендовані матеріали</span></div>
        <div className="reading-list">
          {["Як рахувати собівартість композиції", "Як продавати дорожче без знижок", "Як створити флористичний бренд, який запамʼятовують"].map((item, i) => (
            <a href="#contact" key={item}><span>0{i + 1}</span><h3>{item}</h3><b>↗</b></a>
          ))}
        </div>
      </section>

      <footer className="footer" id="contact">
        <div className="shell footer-grid">
          <div className="footer-title">Helping florists get their flowers.</div>
          <div className="footer-socials">
            <a href="#">Instagram <span>12.8K followers</span></a>
            <a href="#">Telegram <span>5.4K readers</span></a>
            <a href="#">YouTube <span>2.1K subscribers</span></a>
          </div>
          <div className="footer-bottom"><span>© 2026 Floral School</span><a href="#top">Back to top ↑</a></div>
        </div>
      </footer>
    </main>
  );
}
