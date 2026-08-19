import "./hero.css";
import "./courses.css";
import HeroParallax from "./HeroParallax";

export const dynamic = "force-dynamic";

const programs = [
  {
    index: "01",
    label: "START",
    title: "ФЛОРИСТ ВІД НУЛЯ ДО РЕЗУЛЬТАТУ",
    price: "199 €",
    statement: "Навчись створювати. Навчись бачити. Навчись продавати свою майстерність.",
    description:
      "Для тих, хто хоче освоїти професію флориста з нуля та отримати сильну базу: композиція, колір, форма, техніки роботи й професійне мислення.",
    cta: "ПОЧАТИ З НУЛЯ",
    featured: false,
  },
  {
    index: "02",
    label: "BUSINESS",
    title: "ФЛОРИСТИЧНИЙ БІЗНЕС ВІД А ДО Я",
    price: "799 €",
    statement: "Не просто роби букети. Побудуй бізнес навколо них.",
    description:
      "Покрокова система запуску й розвитку квіткового бізнесу: концепція, продукт, закупівлі, ціноутворення, продажі, клієнти та масштабування.",
    cta: "ПОБУДУВАТИ БІЗНЕС",
    featured: true,
  },
  {
    index: "03",
    label: "VIP / 3 MONTHS / 1:1",
    title: "VIP НАСТАВНИЦТВО",
    price: "2999 €",
    statement: "Не проходь шлях сам. Пройди його разом зі мною.",
    description:
      "Індивідуальний супровід, у якому ми разом запускаємо твій квітковий бізнес — від ідеї та позиціонування до закупівель, перших продажів і клієнтів.",
    cta: "ПОДАТИ ЗАЯВКУ",
    featured: false,
  },
];

const outcomes = [
  ["01", "МАЙСТЕРНІСТЬ", "Навчишся створювати роботи, за які готові платити."],
  ["02", "СТИЛЬ", "Сформуєш власний візуальний почерк замість копіювання інших."],
  ["03", "ГРОШІ", "Зрозумієш ціноутворення, продукт і продажі."],
  ["04", "БІЗНЕС", "Отримаєш систему, на якій можна будувати квітковий бренд."],
];

export default function Page() {
  return (
    <main className="course-site">
      <header className="pts-hero" aria-label="Hero">
        <nav className="site-nav" aria-label="Головна навігація">
          <a className="site-nav__brand" href="#top" aria-label="Floral Education — на початок">FLORAL EDUCATION</a>
          <div className="site-nav__links">
            <a href="#programs">ПРОГРАМИ</a>
            <a href="#result">РЕЗУЛЬТАТ</a>
            <a href="#vip">VIP</a>
          </div>
          <a className="site-nav__cta" href="#programs">ОБРАТИ ПРОГРАМУ ↗</a>
        </nav>

        <div className="pts-hero__stage" id="top">
          <img className="pts-hero__portrait" src="/site/images/95e2e4fcdce83e14.jpg" alt="" width="2000" height="1333" loading="eager" decoding="async" fetchPriority="high" />
          <div className="pts-hero__veil" aria-hidden="true" />
          <img className="pts-hero__pink" src="/site/images/25a19fcf83a07670.webp" alt="" aria-hidden="true" loading="eager" decoding="async" />
          <img className="pts-hero__magnolia" src="/site/images/3f61b04bf5f0c093.webp" alt="" aria-hidden="true" loading="eager" decoding="async" />
          <p className="pts-hero__eyebrow">FLORAL EDUCATION / 2026</p>
          <h1 className="pts-hero__title" aria-label="СТВОРЮЙ. РОСТИ. ЗАРОБЛЯЙ.">
            <span>СТВОРЮЙ.</span><span>РОСТИ.</span><span>ЗАРОБЛЯЙ.</span>
          </h1>
          <p className="pts-hero__subtitle">Перетвори любов до квітів на професію,<br />стиль і власний бізнес.</p>
          <a className="pts-hero__scroll" href="#manifesto">ОБРАТИ СВІЙ ШЛЯХ ↓</a>
        </div>
      </header>

      <section className="manifesto section-shell" id="manifesto">
        <div className="section-kicker">01 / MANIFESTO</div>
        <h2 className="display-title">КВІТИ — ЦЕ БІЛЬШЕ,<br />НІЖ КРАСИВО.</h2>
        <div className="manifesto__copy">
          <p className="manifesto__lead">Це професія. Це продукт. Це бізнес, який можна побудувати навколо власного стилю.</p>
          <p>Ми створили три рівні навчання — від першої професійної бази до запуску власного квіткового бізнесу.</p>
        </div>
        <img className="manifesto__flower" src="/site/images/3f61b04bf5f0c093.webp" alt="" aria-hidden="true" />
      </section>

      <section className="programs section-shell" id="programs">
        <div className="section-heading">
          <div className="section-kicker">02 / PROGRAMS</div>
          <h2 className="display-title">ОБЕРИ СВІЙ РІВЕНЬ</h2>
          <p>Від першого букета — до власного бренду.</p>
        </div>
        <div className="program-list">
          {programs.map((program) => (
            <article className={`program-card${program.featured ? " program-card--featured" : ""}`} key={program.index}>
              <div className="program-card__topline"><span>{program.index}</span><span>{program.label}</span></div>
              <div className="program-card__main"><h3>{program.title}</h3><div className="program-card__price">{program.price}</div></div>
              <p className="program-card__statement">{program.statement}</p>
              <div className="program-card__bottom"><p>{program.description}</p><a href="#final-cta">{program.cta} →</a></div>
            </article>
          ))}
        </div>
      </section>

      <section className="floral-statement">
        <img className="floral-statement__pink" src="/site/images/25a19fcf83a07670.webp" alt="" aria-hidden="true" />
        <img className="floral-statement__white" src="/site/images/3f61b04bf5f0c093.webp" alt="" aria-hidden="true" />
        <div className="floral-statement__content section-shell">
          <div className="section-kicker">03 / FROM PASSION TO PROFIT</div>
          <h2>ВІД ЛЮБОВІ<br />ДО КВІТІВ —<br />ДО ДОХОДУ.</h2>
          <p>Красиві роботи привертають увагу. Система перетворює їх на бізнес.</p>
        </div>
      </section>

      <section className="outcomes section-shell" id="result">
        <div className="outcomes__intro"><div className="section-kicker">04 / RESULT</div><h2 className="display-title">НЕ ПРОСТО ЗНАННЯ.<br />НОВИЙ РІВЕНЬ.</h2></div>
        <div className="outcome-grid">
          {outcomes.map(([index, title, text]) => <article className="outcome-item" key={index}><span>{index}</span><h3>{title}</h3><p>{text}</p></article>)}
        </div>
      </section>

      <section className="money section-shell">
        <div className="section-kicker">05 / MONEY</div>
        <h2 className="display-title">ТАЛАНТ — ЦЕ ПОЧАТОК.<br />СИСТЕМА — ЦЕ ГРОШІ.</h2>
        <div className="money__copy"><p>Багато флористів вміють створювати красиві роботи, але не знають, як перетворити майстерність на стабільний дохід.</p><p className="money__accent">Тут ми поєднуємо флористику, продукт, маркетинг і бізнес-мислення.</p></div>
      </section>

      <section className="audience section-shell">
        <div className="section-kicker">06 / FOR YOU</div>
        <h2 className="display-title">ТИ В ПОТРІБНОМУ МІСЦІ, ЯКЩО…</h2>
        <div className="audience__lines">
          <div><span>01</span> ХОЧЕШ СТАТИ ФЛОРИСТОМ.</div>
          <div><span>02</span> ВЖЕ ПРАЦЮЄШ, АЛЕ ХОЧЕШ РОСТИ.</div>
          <div><span>03</span> МРІЄШ ПРО ВЛАСНИЙ КВІТКОВИЙ БРЕНД.</div>
          <div><span>04</span> ХОЧЕШ, ЩОБ ТВОРЧІСТЬ ПОЧАЛА ПРИНОСИТИ ГРОШІ.</div>
        </div>
      </section>

      <section className="vip" id="vip">
        <img className="vip__flower" src="/site/images/3f61b04bf5f0c093.webp" alt="" aria-hidden="true" />
        <div className="vip__inner section-shell">
          <div className="section-kicker">VIP / 3 MONTHS / PERSONAL</div>
          <h2>ТВІЙ БІЗНЕС.<br />НАШ СПІЛЬНИЙ ЗАПУСК.</h2>
          <p className="vip__lead">Три місяці ми працюємо разом над реальним бізнесом, а не навчальним кейсом.</p>
          <div className="vip__roadmap">КОНЦЕПЦІЯ <span>→</span> ПОЗИЦІОНУВАННЯ <span>→</span> ПРОДУКТ <span>→</span> ЗАКУПІВЛІ <span>→</span> ЦІНА <span>→</span> ПРОДАЖІ <span>→</span> ПЕРШІ КЛІЄНТИ</div>
          <div className="vip__footer"><div className="vip__price">2999 €</div><a href="#final-cta">ХОЧУ НАСТАВНИЦТВО →</a><small>Кількість місць обмежена через індивідуальний формат роботи.</small></div>
        </div>
      </section>

      <section className="final-cta section-shell" id="final-cta">
        <img className="final-cta__flower" src="/site/images/25a19fcf83a07670.webp" alt="" aria-hidden="true" />
        <div className="section-kicker">READY?</div>
        <h2>КВІТИ МОЖУТЬ<br />СТАТИ ТВОЄЮ<br />ПРОФЕСІЄЮ.</h2>
        <p>А професія — бізнесом.</p>
        <div className="final-cta__actions">
          <a className="button-primary" href="#programs">ОБРАТИ ПРОГРАМУ →</a>
          <a className="button-secondary" href="#programs">ПОРІВНЯТИ ПРОГРАМИ →</a>
        </div>
      </section>

      <footer className="site-footer section-shell">
        <div>FLORAL EDUCATION</div><div>СТВОРЮЙ. РОСТИ. ЗАРОБЛЯЙ.</div><a href="#top">НАВЕРХ ↑</a>
      </footer>

      <HeroParallax />
    </main>
  );
}
