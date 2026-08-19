import "./hero.css";
import "./courses.css";
import HeroParallax from "./HeroParallax";
import heroImage from "./hero-image/part1";

export const dynamic = "force-dynamic";

const HERO_WOMAN_SRC = `data:image/webp;base64,${heroImage}`;

const programs = [
  {
    className: "course-scene course-scene--start",
    index: "01 / START",
    title: <>Флорист<br />від нуля до результату</>,
    price: "199 €",
    lead: "Професійна база для тих, хто хоче впевнено зайти у флористику.",
    points: ["Композиція", "Колір", "Форма", "Техніки", "Професійне мислення"],
    cta: "ПОЧАТИ НАВЧАННЯ",
    visual: "flower",
  },
  {
    className: "course-scene course-scene--business",
    index: "02 / BUSINESS",
    title: <>Флористичний бізнес<br />від А до Я</>,
    price: "799 €",
    lead: "Не просто створюй букети. Побудуй бізнес навколо них.",
    points: ["Концепція", "Продукт", "Закупівлі", "Ціноутворення", "Продажі", "Маркетинг", "Клієнти"],
    cta: "ПОБУДУВАТИ БІЗНЕС",
    visual: "bouquet",
  },
  {
    className: "course-scene course-scene--vip",
    index: "03 / PERSONAL",
    title: <>VIP-наставництво</>,
    price: "2999 €",
    lead: "3 місяці / 1:1 — індивідуальна робота над твоїм реальним бізнесом.",
    points: ["Позиціонування", "Продукт", "Закупівлі", "Ціна", "Запуск", "Перші клієнти"],
    cta: "ПОДАТИ ЗАЯВКУ",
    visual: "portrait",
  },
];

const outcomes = [
  ["01", "МАЙСТЕРНІСТЬ", "Створювати роботи, за які готові платити."],
  ["02", "СТИЛЬ", "Сформувати власний візуальний почерк."],
  ["03", "ПРОДАЖІ", "Розуміти продукт, ціну та клієнта."],
  ["04", "БІЗНЕС", "Побудувати систему, а не залежати від випадкових замовлень."],
];

const audience = [
  "Хочеш освоїти професію флориста.",
  "Вже працюєш, але відчуваєш, що стоїш на місці.",
  "Мрієш про власний квітковий бренд.",
  "Хочеш, щоб творчість стала джерелом доходу.",
];

function CourseVisual({ type }: { type: string }) {
  if (type === "flower") {
    return (
      <div className="course-visual course-visual--flower" aria-hidden="true">
        <div className="course-visual__wash" />
        <img src="/site/images/3f61b04bf5f0c093.webp" alt="" />
        <span>FLORAL FOUNDATION</span>
      </div>
    );
  }

  if (type === "bouquet") {
    return (
      <div className="course-visual course-visual--photo" aria-hidden="true">
        <img src={HERO_WOMAN_SRC} alt="" />
        <span>BUSINESS / PRODUCT / SALES</span>
      </div>
    );
  }

  return (
    <div className="course-visual course-visual--portrait" aria-hidden="true">
      <img src={HERO_WOMAN_SRC} alt="" />
      <div className="course-visual__line">1:1 / PERSONAL / 3 MONTHS</div>
    </div>
  );
}

export default function Page() {
  return (
    <main className="luxury-site">
      <header className="pts-hero" id="top" aria-label="Hero">
        <nav className="site-nav" aria-label="Головна навігація">
          <a className="site-nav__brand" href="#top">FLORAL EDUCATION</a>
          <div className="site-nav__links">
            <a href="#programs">ПРОГРАМИ</a>
            <a href="#results">РЕЗУЛЬТАТ</a>
            <a href="#vip">VIP</a>
          </div>
          <a className="site-nav__cta" href="#programs">ОБРАТИ ПРОГРАМУ ↗</a>
        </nav>

        <div className="pts-hero__stage">
          <img className="pts-hero__portrait" src={HERO_WOMAN_SRC} alt="" loading="eager" decoding="async" fetchPriority="high" />
          <div className="pts-hero__veil" aria-hidden="true" />
          <img className="pts-hero__pink" src="/site/images/25a19fcf83a07670.webp" alt="" aria-hidden="true" />
          <img className="pts-hero__magnolia" src="/site/images/3f61b04bf5f0c093.webp" alt="" aria-hidden="true" />

          <div className="hero-copy">
            <p className="pts-hero__eyebrow">FLORAL EDUCATION / 2026</p>
            <h1 className="pts-hero__title">
              <span>СТВОРЮЙ.</span>
              <span>РОСТИ.</span>
              <span>ЗАРОБЛЯЙ.</span>
            </h1>
            <p className="pts-hero__subtitle">Перетвори любов до квітів<br />на професію, стиль і власний бізнес.</p>
            <a className="pts-hero__scroll" href="#philosophy">ОБРАТИ СВІЙ ШЛЯХ ↓</a>
          </div>
        </div>
      </header>

      <section className="philosophy scene scene--ivory" id="philosophy">
        <div className="shell philosophy__grid">
          <div className="philosophy__copy motion">
            <div className="eyebrow eyebrow--dark">01 / PHILOSOPHY</div>
            <h2>Квіти —<br />це більше,<br />ніж красиво.</h2>
            <p className="serif-lead">Це ремесло, стиль, продукт і можливість побудувати бізнес навколо того, що ти любиш.</p>
            <p className="body-copy">Ми створили три рівні навчання — від професії флориста до запуску власного квіткового бренду.</p>
          </div>

          <figure className="editorial-photo motion">
            <div className="editorial-photo__frame">
              <img src={HERO_WOMAN_SRC} alt="Флористка з букетом білих троянд" />
            </div>
            <figcaption>
              <span>FROM CRAFT TO BRAND</span>
              <em>Від першого букета — до власного бренду.</em>
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="programs scene scene--charcoal" id="programs">
        <div className="shell programs__head motion">
          <div>
            <div className="eyebrow">02 / PROGRAMS</div>
            <h2>Обери свій шлях</h2>
          </div>
          <p className="serif-note">Три різні рівні.<br />Одна мета — твій результат.</p>
        </div>

        <div className="shell course-stack">
          {programs.map((program) => (
            <article className={`${program.className} motion`} key={program.index}>
              <div className="course-scene__copy">
                <div className="course-scene__meta">
                  <span>{program.index}</span>
                  <span>{program.price}</span>
                </div>
                <h3>{program.title}</h3>
                <p className="course-scene__lead">{program.lead}</p>
                <div className="course-points">
                  {program.points.map((item) => <span key={item}>{item}</span>)}
                </div>
                <a className="underlined-link" href="#final-cta">{program.cta} →</a>
              </div>
              <CourseVisual type={program.visual} />
            </article>
          ))}
        </div>
      </section>

      <section className="visual-break scene">
        <img className="visual-break__image" src={HERO_WOMAN_SRC} alt="Флористка та білі троянди" />
        <div className="visual-break__shade" />
        <div className="shell visual-break__content motion">
          <div className="eyebrow">03 / PASSION TO PROFIT</div>
          <p>Від любові<br />до квітів —</p>
          <em>до справи,<br />яка приносить дохід.</em>
        </div>
      </section>

      <section className="results scene scene--ivory" id="results">
        <div className="shell results__head motion">
          <div className="eyebrow eyebrow--dark">04 / WHAT YOU GET</div>
          <h2>Не просто знання.<br /><span>Нова система мислення.</span></h2>
        </div>
        <div className="shell result-grid">
          {outcomes.map(([index, title, text]) => (
            <article className="result-item motion" key={index}>
              <span className="result-item__index">{index}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="business scene scene--wine" id="business">
        <div className="shell business__grid">
          <div className="business__photo motion">
            <img src={HERO_WOMAN_SRC} alt="Букет білих троянд" />
            <div className="business__photo-label">CRAFT / PRODUCT / SALES</div>
          </div>
          <div className="business__copy motion">
            <div className="eyebrow">05 / BUSINESS MINDSET</div>
            <h2>Талант —<br />це початок.<br /><span>Система — це гроші.</span></h2>
            <p>Багато флористів створюють красиві роботи, але не розуміють, як перетворити майстерність на стабільний дохід.</p>
            <div className="formula">
              <span>ФЛОРИСТИКА</span><b>+</b><span>ПРОДУКТ</span><b>+</b><span>ЦІНА</span><b>+</b><span>МАРКЕТИНГ</span><b>+</b><span>ПРОДАЖІ</span>
            </div>
            <a className="underlined-link" href="#programs">ПОДИВИТИСЬ BUSINESS PROGRAM →</a>
          </div>
        </div>
      </section>

      <section className="audience scene scene--taupe">
        <div className="shell audience__grid">
          <div className="audience__intro motion">
            <div className="eyebrow eyebrow--dark">06 / FOR WHOM</div>
            <h2>Це навчання<br />для тебе, якщо…</h2>
            <p className="serif-lead">Не важливо, чи ти тільки починаєш, чи вже працюєш з квітами. Важливо — куди хочеш прийти.</p>
          </div>
          <div className="audience__rows">
            {audience.map((item, index) => (
              <div className="audience-row motion" key={item}>
                <span>0{index + 1}</span>
                <p>{item}</p>
                {index % 2 === 0 ? (
                  <div className="audience-row__floral" aria-hidden="true"><img src="/site/images/3f61b04bf5f0c093.webp" alt="" /></div>
                ) : (
                  <div className="audience-row__floral audience-row__floral--pink" aria-hidden="true"><img src="/site/images/25a19fcf83a07670.webp" alt="" /></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="vip scene scene--olive" id="vip">
        <div className="shell vip__grid">
          <div className="vip__portrait motion">
            <img src={HERO_WOMAN_SRC} alt="Персональна наставниця" />
            <span>PERSONAL / 1:1 / 3 MONTHS</span>
          </div>
          <div className="vip__copy motion">
            <div className="eyebrow">VIP / 3 MONTHS / PERSONAL</div>
            <h2>Твій бізнес.<br /><span>Наш спільний запуск.</span></h2>
            <p className="serif-lead serif-lead--light">Три місяці ми працюємо не над навчальним кейсом — а над твоїм реальним бізнесом.</p>
            <div className="vip-roadmap">
              {['КОНЦЕПЦІЯ','ПОЗИЦІОНУВАННЯ','ПРОДУКТ','ЗАКУПІВЛІ','ЦІНА','ПРОДАЖІ','ПЕРШІ КЛІЄНТИ'].map((item, index, arr) => (
                <span key={item}>{item}{index < arr.length - 1 ? <b>→</b> : null}</span>
              ))}
            </div>
            <div className="vip__footer">
              <strong>2999 €</strong>
              <a className="underlined-link" href="#final-cta">ХОЧУ НАСТАВНИЦТВО →</a>
              <small>Кількість місць обмежена через індивідуальний формат роботи.</small>
            </div>
          </div>
        </div>
      </section>

      <section className="final-cta scene scene--charcoal" id="final-cta">
        <img className="final-cta__flower final-cta__flower--left" src="/site/images/25a19fcf83a07670.webp" alt="" aria-hidden="true" />
        <img className="final-cta__flower final-cta__flower--right" src="/site/images/3f61b04bf5f0c093.webp" alt="" aria-hidden="true" />
        <div className="shell final-cta__inner motion">
          <div className="eyebrow">READY?</div>
          <h2>Квіти можуть стати<br />твоєю професією.</h2>
          <p className="serif-note">А професія — власним бізнесом.</p>
          <div className="final-actions">
            <a className="button button--ivory" href="#programs">ОБРАТИ ПРОГРАМУ →</a>
            <a className="button button--ghost" href="#programs">ПОТРІБНА ДОПОМОГА З ВИБОРОМ?</a>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="shell footer__inner">
          <span>FLORAL EDUCATION</span>
          <span>СТВОРЮЙ. РОСТИ. ЗАРОБЛЯЙ.</span>
          <a href="#top">НАВЕРХ ↑</a>
        </div>
      </footer>

      <HeroParallax />
    </main>
  );
}

