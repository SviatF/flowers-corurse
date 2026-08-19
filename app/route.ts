import type { NextRequest } from "next/server";

const SOURCE_URL = "https://danmall.com/?ref=lapaninja";
const SOURCE_ORIGIN = "https://danmall.com/";

function injectBase(html: string) {
  if (html.includes("<base ")) return html;
  return html.replace(/<head([^>]*)>/i, `<head$1><base href="${SOURCE_ORIGIN}">`);
}

function replaceAll(html: string, from: string, to: string) {
  return html.split(from).join(to);
}

function applyFloralCopy(html: string) {
  const replacements: Array<[string, string]> = [
    // Navigation
    ["Learn", "Навчання"],
    ["Portfolio", "Програми"],
    ["Join 60K+ Readers", "Обрати програму"],

    // HERO — core positioning
    ["I help designers make more money", "Навчаю флористиці як професії"],
    ["and get their flowers.", "і допомагаю перетворити її на дохід."],

    // MANIFESTO — why this school exists
    ["Being a designer", "Бути флористом"],
    ["is one of the best jobs", "— це більше, ніж робота"],
    ["in the world", "з красивими квітами"],
    [
      "Why aren’t more designers living like it? You didn’t become a designer to be bored, broke, or burned out.",
      "Але красивих букетів недостатньо, щоб побудувати професію. Без системи навіть талановитий флорист може працювати багато, заробляти мало й не розуміти, як рости далі."
    ],
    [
      "You spent years mastering your craft; you can make anything functional and beautiful. But nobody taught you how to price it, sell it, lead with it, or build a life around it.",
      "Флористу потрібен не лише смак. Потрібно розуміти композицію, колір, сезонність і техніку — а ще собівартість, ціноутворення, закупівлі, роботу з клієнтом, продажі та позиціонування."
    ],
    [
      "Somewhere along the way, the industry convinced you that loving the work should be enough. That asking for more money is greedy. That leading a team means you’re not a “real” designer anymore. That wanting a life outside of work is a lack of passion.",
      "Саме тому тут немає поділу на «творчість» і «бізнес». Ми вчимо створювати сильний продукт, бачити його цінність, правильно його оцінювати й будувати навколо нього систему, яка приносить гроші."
    ],
    [
      "Nonsense. The best designers don’t just make great work. They change the lives of the people who interact with the things they make—and that should change your life too. You can do the work you love and build the life you want.",
      "Наша мета — щоб ви не просто навчилися збирати букети. Щоб у вас з’явилися професійні навички, власний стиль, впевненість у ціні та зрозумілий шлях від першого замовлення до стабільного квіткового бізнесу."
    ],
    [
      "I’m living proof. Over my 28-year career, I’ve worked for web design companies & digital ad agencies; ran my own agency SuperFriendly for a decade and then sold it; started 5 companies; wrote 3 books; built a renowned personal brand; and made more money than I’d ever imagined. I’ve also supported my wife’s passions; attended every one of my kids’ theater performances and field hockey games; cooked dinner a few times a week; and did a 3-continent, 1-month trip with my family. All while working 40–50 hours a week.",
      "Тому навчання побудоване як шлях. Спочатку — фундамент флористики й сильна практика. Далі — упаковка, ціни, клієнти й бізнес-процеси. А для тих, хто хоче пройти цей шлях швидше, є персональне VIP-наставництво з супроводом до запуску."
    ],
    [
      "You don’t have to choose between a successful, lucrative career and a fulfilling personal and family life. If that sounds like the kind of life and career you’d like to have, this website is my attempt to share all my “secrets” with you. Thanks for being here, and here’s to you being able to design your life on purpose.",
      "Неважливо, ви лише дивитеся у бік флористики чи вже приймаєте замовлення. Оберіть точку входу, яка відповідає вашому рівню зараз, і будуйте наступний етап системно — без хаосу, випадкових порад і років проб та помилок."
    ],

    // EXPERIENCE / POSITIONING TRANSITION
    [
      "I’ve spent the last 27 years working for and with some of the most well-known brands in the world",
      "Один шлях: від першої впевненої композиції — до професії, клієнтів і власного квіткового бізнесу"
    ],

    // PROGRAMS INTRO
    ["greatest", "твій"],
    ["hits", "рівень"],
    ["posts written", "програми"],
    ["Since 2005", "3 формати"],
    ["and counting", "1 система"],
    [
      "I've written hundreds of articles over the years",
      "Не потрібно купувати десятки розрізнених курсів"
    ],
    [
      "but these three essays seem to resonate with readers the most.",
      "Тут є три чіткі програми під три різні задачі."
    ],
    [
      "If you're new here, start with these pieces to get a good sense of how I think about design, collaboration, and creative work.",
      "Починаєте з нуля — будуємо професійну базу. Уже працюєте флористом — вибудовуємо бізнес. Хочете персональний маршрут і швидший запуск — працюємо один на один."
    ],
    [
      "but these five essays seem to resonate with readers the most. If you're new here, start with these pieces to get a good sense of how I think about design, collaboration, and creative work.",
      "Починаєте з нуля — будуємо професійну базу. Уже працюєте флористом — вибудовуємо бізнес. Хочете персональний маршрут і швидший запуск — працюємо один на один."
    ],

    // THREE CORE PRODUCTS
    ["Papa Bear Pricing", "Флорист від нуля до результату"],
    [
      "A pricing framework that actually advocates for your client.",
      "Освойте професійну базу, навчіться бачити композицію й створювати роботи, за які не соромно брати гроші. · 199 €"
    ],
    ["Say, Do, Say", "Флористичний бізнес від А до Я"],
    [
      "The 3-step framework I use on every project.",
      "Перетворіть навичку на систему: продукт, закупівлі, ціни, бренд, клієнти, продажі та процеси. · 799 €"
    ],
    ["Stealing Your Way to Original Designs", "VIP-наставництво · 3 місяці"],
    [
      "There’s nothing new under the sun.",
      "Персональна робота над вашим запуском: стратегія, асортимент, ціни, упаковка, продажі та рішення під вашу ситуацію. · 2999 €"
    ],

    // CURRICULUM / VALUE PILLARS
    ["All Topics", "На чому будуємо результат"],
    ["The Business of Design", "Сильна флористична база"],
    [
      "Get paid well and build something that lasts.",
      "Композиція, колористика, форма, пропорції, сезонність, техніки та впевнена робота з квіткою."
    ],
    ["Design Leadership", "Гроші та бізнес-модель"],
    [
      "Lead people, shape culture, and make better decisions.",
      "Собівартість, ціноутворення, закупівлі, асортимент, маржа й процеси, які не з’їдають ваш прибуток."
    ],
    ["Process & Craft", "Клієнти та продажі"],
    [
      "Where great taste meets professional practice.",
      "Позиціонування, контент, комунікація, продаж без демпінгу та система повторних замовлень."
    ],
    ["Personal", "Власний стиль і бренд"],
    [
      "Life outside the work.",
      "Не копіювати інших, а сформувати впізнавану подачу, сильне портфоліо й професійне ім’я."
    ],

    // SOCIAL PROOF WALL -> OUTCOMES / TRANSFORMATION WALL
    [
      "Dan is an educator, mentor, and most importantly, a friend. He is a leader who helps others realize their superpowers and deliver their best work, all while showing how to enjoy the ride. The things I’ve learned from him will forever be key parts of my DNA as a designer.",
      "Ви перестаєте збирати композиції навмання й починаєте розуміти, чому кожне рішення у букеті працює."
    ],
    [
      "Dan is exceedingly generous with his time, advice, resources, and knowledge. He’s the best mentor I have ever had.",
      "Ви отримуєте систему замість хаотичних уроків і випадкових порад з Instagram."
    ],
    [
      "As a new leader, Dan helped me find and create clarity for our team, not by giving me all the answers, but by helping me grow and find the confidence to chart our path forward together.",
      "Ви вчитеся самостійно приймати професійні рішення — у композиції, закупівлях, цінах і роботі з клієнтами."
    ],
    [
      "Working with Dan has been truly career-changing. His influence still shapes how I tackle project possibilities and solutions.",
      "Ви будуєте навичку, яка залишається з вами й росте разом із вашою практикою."
    ],
    [
      "I was worried that I wouldn’t be able to learn anymore at work. Working with Dan changed that.",
      "Навіть якщо ви вже працюєте флористом, ви бачите слабкі місця й отримуєте зрозумілий план росту."
    ],
    [
      "Dan is a phenomenon. He is equal parts analytical and intuitive, collaborative and focused, tenacious and calm. He’s one of the finest people I’ve had the opportunity to work with.",
      "Творчість перестає бути хаотичною: смак підкріплюється технікою, а інтуїція — професійною системою."
    ],
    [
      "Dan’s attention to detail and lusciously rich arsenal of knowledge in both design and code make him an amazing collaborator and leader. He is a great teacher, mentor, friend, and a genuinely exceptional human being.",
      "Ви вчитеся бачити деталі, які відрізняють просто красивий букет від роботи професійного рівня."
    ],
    [
      "Dan has one of the best minds for design in our industry, but he takes it so much further in his unparalleled grace and his seamless collaboration.",
      "Ви розумієте не тільки що робити, а й як пояснити клієнту цінність своєї роботи."
    ],
    [
      "Dan has an unparalleled ability to articulate his ideas and nurture yours. He’s bursting with integrity, and it comes across in everything he touches.",
      "Ваш стиль стає впізнаваним, а портфоліо — цілісним і сильним."
    ],
    [
      "Dan’s wisdom echoes for miles. The only thing that rivals his passion for creating amazing work is his ridiculously large sneaker collection.",
      "Ви перестаєте боятися називати ціну, бо знаєте свою собівартість, маржу й цінність продукту."
    ],
    [
      "Dan has vision and is able to see the potential in anything he touches. He never stops thinking about what can be done better, which leads to fresh, smart, and original work.",
      "Кожна нова робота стає не випадковістю, а наступним кроком у формуванні вашого професійного почерку."
    ],
    [
      "Dan is a powerful leader who honors everyone’s input.",
      "Ви будуєте процеси, у яких творчість не конфліктує з термінами, бюджетом і прибутком."
    ],
    [
      "Dan is a very special blend of leader, teacher, and experience. He’s contagious.",
      "Ви бачите флористику одночасно очима майстра, продавця й власника бізнесу."
    ],
    [
      "If I closed my eyes and thought of five people I’d want to work with for the rest of my life, Dan would be one of the five. Doesn’t matter what the project is.",
      "Ви будуєте не одноразове хобі, а навичку й систему, на які можна спертися надовго."
    ],
    [
      "Dan isn’t just knowledgeable; he’s got this endearing presence. When he speaks, I’m compelled to listen.",
      "Складні теми розкладаються на конкретні кроки, які можна одразу перенести у свою роботу."
    ],
    [
      "Working with Dan early on in my career was a major turning point for me and helped change the way I think about teamwork and leadership.",
      "На старті ви закладаєте правильні принципи, щоб потім не перевчатися й не виправляти дорогі помилки."
    ],
    [
      "Dan was the biggest impact in my design career while I was at my last agency.",
      "Навчання змінює не лише техніку — воно змінює те, як ви дивитесь на професію й власну цінність."
    ],
    [
      "I still have so much more to learn, but I know I wouldn’t be where I am today without Dan. I’m a bit more of an unapologetic Dan Mall lifer™.",
      "Ви отримуєте фундамент, на якому можна далі рости роками — у стилі, складності робіт і доході."
    ],
    [
      "Dan’s ability to teach is both innovative and deeply personal.",
      "Навчання побудоване так, щоб знання переходили у практику, а практика — у впевненість."
    ],
    [
      "I’m grateful to have Dan as a mentor to call on. He answers the call and listens. He asks tough questions that point me back to my core values, and he shares the truth of his own struggles so that I don't feel alone.",
      "У VIP-форматі ми працюємо саме з вашою ситуацією: вашими цілями, продуктом, ринком, цінами та точками росту."
    ],
    [
      "I had such a valuable experience working with Dan Mall. He broke down topics into clear, actionable steps that were easily achievable. I left every session energized and confident.",
      "Замість абстрактної мотивації — конкретні дії, рішення й наступні кроки, які зрозуміло як виконати."
    ],

    // Replace testimonial identities with conceptual labels instead of fake reviews
    ["Julia Fernandez", "ПРОФЕСІЙНА БАЗА"],
    ["Senior Product Designer", "КОМПОЗИЦІЯ · ТЕХНІКА"],
    ["Meta", "РЕЗУЛЬТАТ"],
    ["Riley Sykes", "СИСТЕМА"],
    ["Lead Product Designer", "НАВЧАННЯ БЕЗ ХАОСУ"],
    ["The New York Times", "РЕЗУЛЬТАТ"],
    ["Mikaila Weaver", "ВПЕВНЕНІСТЬ"],
    ["Principal Designer", "РІШЕННЯ БЕЗ СУМНІВІВ"],
    ["Eventbrite", "РЕЗУЛЬТАТ"],
    ["Lauren Deal", "ПРАКТИКА"],
    ["Executive Producer", "НАВИЧКА НАДОВГО"],
    ["Instrument", "РЕЗУЛЬТАТ"],
    ["Norel Hassan", "ТОЧКА РОСТУ"],
    ["Product Design Director", "НАСТУПНИЙ РІВЕНЬ"],
    ["Michael Lebowitz", "СМАК + СИСТЕМА"],
    ["Founder & Executive Chairman", "ТВОРЧІСТЬ БЕЗ ХАОСУ"],
    ["Big Spaceship", "РЕЗУЛЬТАТ"],
    ["Benjamin Bojko", "ДЕТАЛІ"],
    ["Creative Tech Director", "ПРОФЕСІЙНИЙ РІВЕНЬ"],
    ["Mike Kenny", "ЦІННІСТЬ"],
    ["Director, Experience Design", "КОМУНІКАЦІЯ З КЛІЄНТОМ"],
    ["Justworks", "РЕЗУЛЬТАТ"],
    ["Victor Pineiro", "ВЛАСНИЙ СТИЛЬ"],
    ["Director of Digital Innovation & Creators", "ВПІЗНАВАНА ПОДАЧА"],
    ["HBO | Max", "РЕЗУЛЬТАТ"],
    ["Jay Quercia", "ЦІНА"],
    ["Art Director & Illustrator", "БЕЗ ДЕМПІНГУ"],
    ["Sabah Kosoy", "РОЗВИТОК"],
    ["Staff UX Program Manager, Bard", "СИЛЬНІША КОЖНА РОБОТА"],
    ["Google", "РЕЗУЛЬТАТ"],
    ["Rebecca Mitchell", "ПРОЦЕСИ"],
    ["Co-head Corporate Communications", "ТВОРЧІСТЬ + ПРИБУТОК"],
    ["Point72", "РЕЗУЛЬТАТ"],
    ["S. Jason Prohaska", "БІЗНЕС-Мислення"],
    ["Managing Director", "МАЙСТЕР + ПІДПРИЄМЕЦЬ"],
    ["Media.Monks", "РЕЗУЛЬТАТ"],
    ["Jamie Kosoy", "ФУНДАМЕНТ"],
    ["Engineering Manager", "НАВИЧКА НА РОКИ"],
    ["Stripe", "РЕЗУЛЬТАТ"],
    ["Eric Odom", "ЯСНІСТЬ"],
    ["Co-founder", "СКЛАДНЕ → ПРОСТО"],
    ["Art Dept. Club", "РЕЗУЛЬТАТ"],
    ["Carlos Andujar", "ПРАВИЛЬНИЙ СТАРТ"],
    ["Product Designer", "БЕЗ ПЕРЕВЧАННЯ"],
    ["Shubh Singhi", "ПРОФЕСІЙНИЙ ЗСУВ"],
    ["CEO", "ІНШИЙ ПОГЛЯД НА СЕБЕ"],
    ["Distilled Strategy", "РЕЗУЛЬТАТ"],
    ["Zach McNair", "РІСТ"],
    ["Founder & ECD", "ФУНДАМЕНТ ДЛЯ МАСШТАБУ"],
    ["All Manner of US", "РЕЗУЛЬТАТ"],
    ["Kevin Deal", "ПРАКТИЧНЕ НАВЧАННЯ"],
    ["Front-end Developer", "ЗНАННЯ → ДІЯ"],
    ["Audrey Pray, Jr.", "VIP-ФОРМАТ"],
    ["Founder & CEO", "ВАША СИТУАЦІЯ · ВАШ ПЛАН"],
    ["A2 Collective", "ПЕРСОНАЛЬНА РОБОТА"],
    ["Robert Johnson", "КОНКРЕТНІ КРОКИ"],

    // FEATURED VIP OFFER
    ["featured", "VIP наставництво"],
    ["make", "побудуй"],
    ["more", "свій"],
    ["money", "бренд"],
    [
      "Design the agency that funds the life you want to live.",
      "3 місяці персональної роботи над вашим квітковим бізнесом — від концепції та продукту до продажів і системи."
    ],
    ["Start your quest", "Подати заявку на VIP"],

    // LEAD / ENTRY OFFER
    ["Pricing projects can feel tricky,", "Не знаєте, з якої програми почати?"],
    ["but it doesn’t have to.", "Визначимо вашу точку й наступний крок."],
    ["Read the Free Guide", "Обрати свій формат"],

    // CONTENT / EDUCATION BLOCK
    ["Books I’m Currently Reading", "Почніть із правильних питань"],
    ["All links are affiliate links.", "Три речі, які напряму впливають на ваш результат у флористиці."],
    [
      "MJ and Kobe’s personal trainer breaks down the mindset that separates good from great from unstoppable.",
      "Як створювати композиції, які виглядають професійно, а не просто «красиво»."
    ],
    [
      "A comedic memoir about growing up with an absent dad to breaking that cycle across eight phases of parenting his four kids.",
      "Як рахувати собівартість і ставити ціну так, щоб замовлення приносили прибуток."
    ],
    [
      "A comedian with a nun for a mom uses the Bible itself to dismantle every argument people use to justify hate in Jesus’s name.",
      "Як побудувати впізнаваний квітковий бренд, який обирають не лише через низьку ціну."
    ],

    // FOOTER / FINAL POSITIONING
    ["Helping designers get their flowers.", "Від любові до квітів — до професії, стилю й власного бізнесу."],
    ["/in/danmall", "НАВЧАННЯ"],
    ["45,601 followers", "Флористика від нуля"],
    ["15,979 connections", "199 €"],
    ["@danmall", "БІЗНЕС"],
    ["45,100 followers", "Флористичний бізнес від А до Я"],
    ["@danmallteaches", "VIP"],
    ["6,458 subscribers", "3 місяці наставництва"],
    ["79 videos", "2999 €"],
    ["6,296 followers", "Персональний супровід"],
    ["221 posts", "до системного запуску"],
    [
      "This site is typeset in",
      "Три програми. Один маршрут:"
    ],
    ["by Rajesh Rajput,", "від професійної бази,"],
    ["by Reset Type Studio,", "через сильний продукт і стиль,"],
    ["by Hannes von Döhren and Christoph Koeberlin,", "до клієнтів, продажів"],
    ["by Emyself Design, and", "і власного бізнесу."],
    ["by Rasmus Andersson.", "Оберіть свою точку входу."],
    [
      "This is version 6.0.18 of my personal website. Older versions:",
      "Навчання для тих, хто хоче не просто любити квіти, а впевнено працювати з ними професійно."
    ],
    ["Black lives matter.", "КРАСА. ПРОФЕСІЯ. БІЗНЕС."],
    ["© Dan Mall Teaches 2005–2026. All rights reserved.", "© 2026 Floral Education."],
    ["Made proudly in Philly. Thou shalt not steal—", "Створено для майбутніх і практикуючих флористів —"],
    ["but feel free to remix", "оберіть програму й почніть свій наступний рівень"],
    ["Privacy policy", "Політика конфіденційності"],
  ];

  for (const [from, to] of replacements) {
    html = replaceAll(html, from, to);
  }

  // Metadata
  html = html.replace(
    /<title>.*?<\/title>/i,
    "<title>Floral Education — професія флориста, бізнес і VIP-наставництво</title>"
  );

  html = html.replace(
    /<meta name="description" content="[^"]*"\s*\/?\s*>/i,
    '<meta name="description" content="Навчання флористиці як професії: сильна база, власний стиль, ціноутворення, продажі, квітковий бізнес і персональне VIP-наставництво." />'
  );

  return html;
}

export async function GET(_request: NextRequest) {
  const upstream = await fetch(SOURCE_URL, {
    cache: "no-store",
    headers: {
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150 Safari/537.36",
      accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    },
  });

  if (!upstream.ok) {
    return new Response(
      `<!doctype html><html><body style="font-family:system-ui;padding:32px"><h1>Reference snapshot unavailable</h1><p>Dan Mall returned ${upstream.status}.</p></body></html>`,
      {
        status: 502,
        headers: { "content-type": "text/html; charset=utf-8" },
      },
    );
  }

  let html = await upstream.text();
  html = injectBase(html);
  html = applyFloralCopy(html);

  html = html.replace(
    /<head([^>]*)>/i,
    `<head$1><!-- Dan Mall reference geometry + complete Floral Education sales copy. -->`,
  );

  return new Response(html, {
    status: 200,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store, max-age=0",
      "x-reference-source": "danmall.com",
      "x-project-copy": "floral-education-v2",
    },
  });
}
