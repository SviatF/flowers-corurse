import "./hero.css";
import "./courses.css";
import HeroParallax from "./HeroParallax";
import heroImage from "./hero-image/part1";

export const dynamic = "force-dynamic";

const HERO_WOMAN_SRC = `data:image/webp;base64,${heroImage}`;

const programs = [
  {
    index: "01",
    label: "START",
    title: "Флорист від нуля до результату",
    price: "199 €",
    lead: "Професійна база для тих, хто хоче впевнено зайти у флористику.",
    text: "Композиція, колір, форма, техніки роботи з квітами та мислення флориста — без хаосу й випадкових знань.",
    cta: "Почати навчання",
  },
  {
    index: "02",
    label: "BUSINESS",
    title: "Флористичний бізнес від А до Я",
    price: "799 €",
    lead: "Не просто робити красиві букети. Побудувати навколо них продукт і бізнес.",
    text: "Концепція, асортимент, закупівлі, ціноутворення, продажі, клієнти, маркетинг і система розвитку власного квіткового бренду.",
    cta: "Побудувати бізнес",
    featured: true,
  },
  {
    index: "03",
    label: "VIP / 3 MONTHS",
    title: "VIP-наставництво",
    price: "2999 €",
    lead: "Три місяці індивідуальної роботи над твоїм реальним запуском.",
    text: "Разом проходимо шлях від ідеї та позиціонування до закупівель, першого продукту, продажів і перших клієнтів.",
    cta: "Подати заявку",
  },
];

const outcomes = [
  ["01", "Майстерність", "Створювати роботи, за які готові платити."],
  ["02", "Стиль", "Сформувати власний візуальний почерк."],
  ["03", "Продажі", "Розуміти продукт, ціну й клієнта."],
  ["04", "Бізнес", "Побудувати систему, а не залежати від випадкових замовлень."],
];

export default function Page() {
  return (
    <main className="course-site">
      <header className="pts-hero" aria-label="Hero">
        <nav className="site-nav" aria-label="Головна навігація">
          <a className="site-nav__brand" href="#top">FLORAL EDUCATION</a>
          <div className="site-nav__links">
            <a href="#programs">ПРОГРАМИ</a>
            <a href="#approach">ПІДХІД</a>
            <a href="#vip">VIP</a>
          </div>
          <a className="site-nav__cta" href="#programs">ОБРАТИ ПРОГРАМУ ↗</a>
        </nav>

        <div className="pts-hero__stage" id="top">
          <img
            className="pts-hero__portrait"
            src={HERO_WOMAN_SRC}
            alt="Флористка з білими трояндами"
            width="1536"
            height="1024"
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
          <div className="pts-hero__veil" aria-hidden="true" />
          <img className="pts-hero__pink" src="/site/images/25a19fcf83a07670.webp" alt="" aria-hidden="true" />
          <img className="pts-hero__magnolia" src="/site/images/3f61b04bf5f0c093.webp" alt="" aria-hidden="true" />
          <p className="pts-hero__eyebrow">FLORAL EDUCATION / 2026</p>
          <h1 className="pts-hero__title" aria-label="СТВОРЮЙ. РОСТИ. ЗАРОБЛЯЙ.">
            <span>СТВОРЮЙ.</span>
            <span>РОСТИ.</span>
            <span>ЗАРОБЛЯЙ.</span>
          </h1>
          <p className="pts-hero__subtitle">Перетвори любов до квітів на професію,<br />стиль і власний бізнес.</p>
          <a className="pts-hero__scroll" href="#intro">ДІЗНАТИСЯ БІЛЬШЕ ↓</a>
        </div>
      </header>

      <section className="intro section-shell" id="intro">
        <div className="intro__copy">
          <div className="section-kicker">01 / ABOUT THE PATH</div>
          <h2>Від першого букета — до власного квіткового бренду.</h2>
          <p className="intro__lead">Флористика може залишитися красивим захопленням. А може стати професією, стилем і справою, яка приносить гроші.</p>
          <p className="intro__text">Тому навчання побудоване як три рівні: майстерність, бізнес-система та персональний запуск із наставником.</p>
          <a className="text-link" href="#programs">ОБРАТИ СВІЙ РІВЕНЬ →</a>
        </div>

        <figure className="intro__visual">
          <img src={HERO_WOMAN_SRC} alt="Флористка поруч із композицією з білих троянд" />
          <figcaption>
            <span>FLORAL EDUCATION</span>
            <span>CRAFT / STYLE / BUSINESS</span>
          </figcaption>
        </figure>
      </section>

      <section className="programs section-shell" id="programs">
        <div className="programs__header">
          <div>
            <div className="section-kicker">02 / PROGRAMS</div>
            <h2>Три рівні.<br />Один шлях уперед.</h2>
          </div>
          <p>Не потрібно купувати “все й одразу”. Обери точку, на якій ти зараз, і наступний логічний крок.</p>
        </div>

        <div className="program-grid">
          {programs.map((program) => (
            <article className={`program-card${program.featured ? " program-card--featured" : ""}`} key={program.index}>
              <div className="program-card__meta">
                <span>{program.index}</span>
                <span>{program.label}</span>
              </div>
              <div className="program-card__body">
                <h3>{program.title}</h3>
                <div className="program-card__price">{program.price}</div>
                <p className="program-card__lead">{program.lead}</p>
                <p className="program-card__text">{program.text}</p>
              </div>
              <a href="#final-cta">{program.cta} →</a>
            </article>
          ))}
        </div>
      </section>

      <section className="visual-break" aria-label="Floral visual">
        <div className="visual-break__copy section-shell">
          <div className="section-kicker">03 / THE SHIFT</div>
          <p className="visual-break__serif">Красиво — це старт.</p>
          <h2>Професійно — це коли ти розумієш, чому це працює.</h2>
          <p>Форма. Колір. Продукт. Ціна. Продаж. Клієнт. Система.</p>
        </div>
        <img className="visual-break__pink" src="/site/images/25a19fcf83a07670.webp" alt="" aria-hidden="true" />
        <img className="visual-break__white" src="/site/images/3f61b04bf5f0c093.webp" alt="" aria-hidden="true" />
      </section>

      <section className="approach section-shell" id="approach">
        <figure className="approach__visual">
          <img src={HERO_WOMAN_SRC} alt="Портрет флористки" />
          <div className="approach__badge">FROM FLOWERS<br />TO BUSINESS</div>
        </figure>

        <div className="approach__copy">
          <div className="section-kicker">04 / APPROACH</div>
          <h2>Не просто курс.<br />Послідовність рішень.</h2>
          <p>Спочатку ти вчишся бачити й створювати. Потім — упаковувати роботу в продукт. Далі — продавати, рахувати й масштабувати.</p>
          <ol className="approach__steps">
            <li><span>01</span><div><strong>Створювати</strong><small>Техніка, композиція, смак.</small></div></li>
            <li><span>02</span><div><strong>Позиціонувати</strong><small>Стиль, продукт, бренд.</small></div></li>
            <li><span>03</span><div><strong>Продавати</strong><small>Ціна, клієнт, комунікація.</small></div></li>
            <li><span>04</span><div><strong>Рости</strong><small>Процеси, система, масштаб.</small></div></li>
          </ol>
        </div>
      </section>

      <section className="outcomes section-shell">
        <div className="outcomes__header">
          <div className="section-kicker">05 / RESULT</div>
          <h2>Що зміниться після навчання</h2>
        </div>
        <div className="outcome-grid">
          {outcomes.map(([index, title, text]) => (
            <article className="outcome-item" key={index}>
              <span>{index}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="vip" id="vip">
        <div className="vip__visual">
          <img src={HERO_WOMAN_SRC} alt="Персональне наставництво з флористичного бізнесу" />
        </div>
        <div className="vip__content">
          <div className="section-kicker">VIP / 3 MONTHS / 1:1</div>
          <h2>Твій бізнес.<br />Наш спільний запуск.</h2>
          <p className="vip__lead">Для тих, хто не хоче ще пів року збирати пазл самостійно.</p>
          <p className="vip__text">Ми працюємо над твоєю реальною концепцією: позиціонування, продукт, закупівлі, ціна, продажі та перші клієнти. Три місяці — персонально.</p>
          <div className="vip__price-row">
            <div className="vip__price">2999 €</div>
            <a href="#final-cta">ХОЧУ НАСТАВНИЦТВО →</a>
          </div>
          <small>Кількість місць обмежена через індивідуальний формат роботи.</small>
        </div>
      </section>

      <section className="final-cta section-shell" id="final-cta">
        <div className="final-cta__copy">
          <div className="section-kicker">READY?</div>
          <h2>Обери точку старту.</h2>
          <p>199 € — професія. 799 € — бізнес-система. 2999 € — персональний запуск.</p>
          <div className="final-cta__actions">
            <a className="button-primary" href="#programs">ПОРІВНЯТИ ПРОГРАМИ →</a>
            <a className="button-secondary" href="#vip">ДІЗНАТИСЯ ПРО VIP →</a>
          </div>
        </div>
        <img className="final-cta__flower" src="/site/images/3f61b04bf5f0c093.webp" alt="" aria-hidden="true" />
      </section>

      <footer className="site-footer section-shell">
        <div>FLORAL EDUCATION</div>
        <div>СТВОРЮЙ. РОСТИ. ЗАРОБЛЯЙ.</div>
        <a href="#top">НАВЕРХ ↑</a>
      </footer>

      <HeroParallax />
    </main>
  );
}
