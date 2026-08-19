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
    // Navigation / hero
    ["Learn", "Навчання"],
    ["Portfolio", "Програми"],
    ["Join 60K+ Readers", "Обрати курс"],
    ["I help designers make more money", "Я допомагаю флористам створювати красу"],
    ["and get their flowers.", "і будувати на цьому сильний бізнес."],

    // Manifesto
    ["Being a designer", "Бути флористом"],
    ["is one of the best jobs", "— одна з найкрасивіших професій"],
    ["in the world", "у світі"],
    [
      "Why aren’t more designers living like it? You didn’t become a designer to be bored, broke, or burned out.",
      "Чому тоді так багато талановитих флористів працюють багато, а заробляють мало? Творчість має приносити не тільки задоволення, а й результат."
    ],
    [
      "You spent years mastering your craft; you can make anything functional and beautiful. But nobody taught you how to price it, sell it, lead with it, or build a life around it.",
      "Можна навчитися збирати красиві композиції. Але професійний флорист також має розуміти колір, форму, закупівлі, собівартість, ціноутворення, продажі та роботу з клієнтом."
    ],
    [
      "Somewhere along the way, the industry convinced you that loving the work should be enough. That asking for more money is greedy. That leading a team means you’re not a “real” designer anymore. That wanting a life outside of work is a lack of passion.",
      "Саме тому навчання побудоване не лише навколо творчості. Ми поєднуємо сильну флористичну базу з практичними навичками, які допомагають перетворити улюблену справу на професію та бізнес."
    ],
    [
      "Nonsense. The best designers don’t just make great work. They change the lives of the people who interact with the things they make—and that should change your life too. You can do the work you love and build the life you want.",
      "Квіти — це мова. Але щоб ця мова стала справою життя, потрібна система: професійна техніка, власний стиль, правильна ціна, клієнти та впевненість у своїй роботі."
    ],
    [
      "I’m living proof. Over my 28-year career, I’ve worked for web design companies & digital ad agencies; ran my own agency SuperFriendly for a decade and then sold it; started 5 companies; wrote 3 books; built a renowned personal brand; and made more money than I’d ever imagined. I’ve also supported my wife’s passions; attended every one of my kids’ theater performances and field hockey games; cooked dinner a few times a week; and did a 3-continent, 1-month trip with my family.",
      "Тут ви можете почати з фундаменту професії, перейти до запуску власного квіткового бізнесу або працювати індивідуально у форматі VIP-наставництва — залежно від того, де ви зараз і куди хочете прийти."
    ],
    ["All while working 40–50 hours a week.", "Від першої композиції — до власного бренду."],
    [
      "You don’t have to choose between a successful, lucrative career and a fulfilling personal and family life. If that sounds like the kind of life and career you’d like to have, this website is my attempt to share all my “secrets” with you. Thanks for being here, and here’s to you being able to design your life on purpose.",
      "Оберіть формат, який відповідає вашій цілі. Навчання побудоване так, щоб знання можна було одразу переносити у практику — у композиції, роботу з клієнтами, продажі та розвиток власної справи."
    ],

    // Experience / transition
    [
      "I’ve spent the last 27 years working for and with some of the most well-known brands in the world",
      "Від професійної флористики до власного квіткового бізнесу — один системний шлях"
    ],

    // Greatest hits -> courses
    ["greatest", "обери"],
    ["hits", "формат"],
    ["posts written", "програми"],
    ["Since 2005", "3 рівні"],
    ["and counting", "для росту"],
    ["I've written hundreds of articles over the years", "Три формати навчання для різних етапів вашого розвитку"],
    ["but these three essays seem to resonate with readers the most.", "Від першої професійної бази до запуску власного квіткового бізнесу."],
    [
      "If you're new here, start with these pieces to get a good sense of how I think about design, collaboration, and creative work.",
      "Почніть з того рівня, який відповідає вашій точці зараз — і рухайтесь до результату, який хочете отримати."
    ],
    [
      "but these five essays seem to resonate with readers the most. If you're new here, start with these pieces to get a good sense of how I think about design, collaboration, and creative work.",
      "Кожна програма має свою задачу: професія, бізнес або персональний запуск із супроводом."
    ],

    // Program cards
    ["Papa Bear Pricing", "Флорист від нуля до результату"],
    ["A pricing framework that actually advocates for your client.", "Міцна професійна база для тих, хто хоче освоїти флористику. · 199 €"],
    ["Say, Do, Say", "Флористичний бізнес від А до Я"],
    ["The 3-step framework I use on every project.", "Покроковий запуск і розвиток власного квіткового бізнесу. · 799 €"],
    ["Stealing Your Way to Original Designs", "VIP-наставництво · 3 місяці"],
    ["There’s nothing new under the sun.", "Індивідуальний супровід від концепції й закупівель до перших продажів. · 2999 €"],

    // Topics
    ["All Topics", "Що всередині"],
    ["The Business of Design", "Професійна флористика"],
    ["Get paid well and build something that lasts.", "Композиція, колір, форма, сезонність і робота з квіткою."],
    ["Design Leadership", "Флористичний бізнес"],
    ["Lead people, shape culture, and make better decisions.", "Закупівлі, собівартість, ціноутворення, процеси та розвиток."],
    ["Process & Craft", "Продажі та бренд"],
    ["Where great taste meets professional practice.", "Позиціонування, контент, клієнти та системні продажі."],
    ["Personal", "Особистий стиль"],
    ["Life outside the work.", "Власний почерк, впевненість і професійне ім’я."],

    // Featured
    ["featured", "VIP формат"],
    ["make", "створи"],
    ["more", "власний"],
    ["money", "бізнес"],
    ["Design the agency that funds the life you want to live.", "Запусти квітковий бізнес разом із наставником — від концепції до перших клієнтів."],
    ["Start your quest", "Дізнатись про VIP"],

    // Guide
    ["Pricing projects can feel tricky,", "Почати у флористиці може здаватися складно,"],
    ["but it doesn’t have to.", "але з правильною системою — значно простіше."],
    ["Read the Free Guide", "Обрати програму"],

    // Reading block
    ["Books I’m Currently Reading", "Матеріали для вашого росту"],
    ["All links are affiliate links.", "Практичні теми, які допомагають розвиватись швидше."],
    [
      "MJ and Kobe’s personal trainer breaks down the mindset that separates good from great from unstoppable.",
      "Як правильно рахувати собівартість композиції та формувати ціну."
    ],
    [
      "A comedic memoir about growing up with an absent dad to breaking that cycle across eight phases of parenting his four kids.",
      "Як продавати дорожче без постійних знижок і демпінгу."
    ],
    [
      "A comedian with a nun for a mom uses the Bible itself to dismantle every argument people use to justify hate in Jesus’s name.",
      "Як створити флористичний бренд, який запам’ятовують і рекомендують."
    ],

    // Footer
    ["Helping designers get their flowers.", "Допомагаємо флористам створювати красу й будувати бізнес."],
    ["Made proudly in Philly.", "Створено для тих, хто хоче рости у флористиці."],
  ];

  for (const [from, to] of replacements) {
    html = replaceAll(html, from, to);
  }

  // Replace page metadata while keeping the reference document structure untouched.
  html = html.replace(/<title>.*?<\/title>/i, "<title>Floral Education — курси флористики та бізнесу</title>");
  html = html.replace(
    /<meta name="description" content="[^"]*"\s*\/?\s*>/i,
    '<meta name="description" content="Навчання флористиці: від професійної бази до запуску власного квіткового бізнесу та VIP-наставництва." />'
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
    `<head$1><!-- Dan Mall reference geometry + floral project copy, rendered through Next.js. -->`,
  );

  return new Response(html, {
    status: 200,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store, max-age=0",
      "x-reference-source": "danmall.com",
      "x-project-copy": "floral-education",
    },
  });
}
