/* נראית – PWA. Vanilla JS, hash routing, no build step. */
(function () {
  'use strict';

  const main = document.getElementById('main');

  /* ---------- Icons ---------- */
  const ico = {
    back: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22285C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg>',
    phone: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/></svg>',
    heart: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFF8F2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z"/></svg>',
    play: (s, c) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="${c}" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z"/></svg>`,
    chev: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22285C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>',
    check: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FFF8F2" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
    download: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12M7 10l5 5 5-5M5 21h14"/></svg>',
    brain: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#B44A30" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 5a3 3 0 0 0-5.8-1A3 3 0 0 0 4 9a3 3 0 0 0 0 6 3 3 0 0 0 3 4 3 3 0 0 0 5 1V5z"/><path d="M12 5a3 3 0 0 1 5.8-1A3 3 0 0 1 20 9a3 3 0 0 1 0 6 3 3 0 0 1-3 4 3 3 0 0 1-5 1"/></svg>',
    dna: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5B6B3A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 3c0 6 10 6 10 12s-10 6-10 6"/><path d="M17 3c0 6-10 6-10 12s10 6 10 6"/><path d="M8 7h8M8 17h8"/></svg>',
    home: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#22285C" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 10.5L12 4l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/><path d="M9 21v-6h6v6"/></svg>'
  };

  const topbar = (title) => `
    <div class="topbar">
      <a class="icon-btn" href="#/" aria-label="חזרה לדף הבית">${ico.back}</a>
      <h1 class="h1">${title}</h1>
    </div>`;

  const sources = (items) => `
    <section class="sources">
      <h3>מקורות</h3>
      <ol dir="ltr">${items.map((s) => `<li>${s}</li>`).join('')}</ol>
    </section>`;

  /* ---------- State ---------- */
  const state = {
    videoSel: 0,
    quiz: { step: -1, answers: [] },
    mythOpen: 0,
    tips: loadTips()
  };

  function todayKey() { return 'nirait-tips-' + new Date().toISOString().slice(0, 10); }
  function loadTips() {
    try { const v = JSON.parse(localStorage.getItem(todayKey())); if (Array.isArray(v)) return v; } catch (e) {}
    return [false, false, false, false, false, false, false];
  }
  function saveTips() { try { localStorage.setItem(todayKey(), JSON.stringify(state.tips)); } catch (e) {} }

  /* ---------- Data ---------- */
  const VIDEOS = [
    { title: 'מהו דיכאון אחרי לידה?', tag: 'היכרות ראשונה', desc: 'הסבר עדין על דיכאון אחרי לידה, כמה הוא שכיח ובמה הוא שונה מ״בייבי בלוז״.', src: '' },
    { title: 'בייבי בלוז או משהו יותר?', tag: 'לזהות את הסימנים', desc: 'איך להבחין בין תנודות רגילות לבין תחושות שזקוקות לטיפול.', src: '' },
    { title: 'אמהות משתפות', tag: 'את לא לבד', desc: 'סיפורים אמיתיים של אמהות שהרגישו רע אחרי הלידה, פנו לעזרה והחלימו.', src: '' },
    { title: 'לדבר עם בן או בת הזוג', tag: 'למשפחה', desc: 'איך לפתוח את השיחה ומה יכולים הקרובים לעשות כדי לעזור.', src: '' },
    { title: 'נשימה מרגיעה, יחד', tag: 'תרגול מודרך', desc: 'תרגיל נשימה קצר לרגעים שמרגישים כבדים.', src: '' }
  ];

  const PHQ_LEAD = 'באיזו תדירות הטריד אותך:';
  const PHQ_OPTS = ['בכלל לא', 'מספר ימים', 'יותר ממחצית הימים', 'כמעט כל יום'];
  const PHQ = [
    'חוסר עניין או הנאה בעשיית דברים',
    'הרגשת דכדוך, דיכאון או חוסר תקווה',
    'קושי להירדם או לישון ברצף, או שינה מרובה מדי',
    'הרגשת עייפות או מעט אנרגיה',
    'תיאבון ירוד או אכילת יתר',
    'הרגשה רעה לגבי עצמך: שאת כישלון, או שאכזבת את עצמך או את משפחתך',
    'קושי להתרכז בדברים, כמו קריאה או צפייה בטלוויזיה',
    'תנועה או דיבור איטיים עד שאחרים יכלו להבחין בכך, או להפך: חוסר שקט ואי־מנוחה, כך שזזת הרבה יותר מהרגיל',
    'מחשבות שעדיף היה שתמותי, או מחשבות לפגוע בעצמך בדרך כלשהי'
  ].map((text) => ({ lead: PHQ_LEAD, text, opts: PHQ_OPTS, scored: true }));
  PHQ.push({ lead: 'שאלה אחרונה (לא נכללת בציון):', text: 'אם חווית אחד מהקשיים האלה, עד כמה הם הקשו עלייך לעבוד, לטפל בענייני הבית או להסתדר עם אנשים אחרים?', opts: ['בכלל לא קשה', 'קשה במידה מסוימת', 'קשה מאוד', 'קשה ביותר'], scored: false });

  const MYTHS = [
    { myth: 'אמא טובה אמורה להיות מאושרת כל הזמן.', truth: 'דיכאון הוא מצב רפואי, לא מדד לאהבה או למסוגלות. הרבה אמהות מסורות ואוהבות חוות אותו.' },
    { myth: 'זה סתם ״בייבי בלוז״, זה יעבור לבד.', truth: 'בייבי בלוז חולף בדרך כלל תוך כשבועיים. דיכאון אחרי לידה נמשך יותר זמן, כבד יותר, ומשתפר עם טיפול.' },
    { myth: 'אם אספר, יחשבו שאני לא מסוגלת לטפל בתינוק.', truth: 'פנייה לעזרה היא הורות אחראית. אנשי המקצוע רוצים לתמוך בך ובמשפחה שלך.' },
    { myth: 'זה באשמתי, אני צריכה פשוט להתאושש.', truth: 'דיכאון אחרי לידה נובע משילוב של גורמים ביולוגיים, היסטוריה אישית ונסיבות חיים. זו לא בחירה ולא חולשה.' },
    { myth: 'רק נשים שילדו יכולות לחוות את זה.', truth: 'גם בני ובנות זוג והורים מאמצים יכולים לחוות דיכאון אחרי הגעת תינוק.' }
  ];

  const TIPS = [
    { title: 'לנוח כשאפשר', body: 'לחלק האכלות לילה או להתחלף, כדי לקבל רצף שינה ארוך אחד.' },
    { title: 'להגיד כן לעזרה', body: 'רשימה קצרה של משימות שאנשים יכולים לעשות כשהם מציעים: ארוחה, כביסה, טיול עם התינוק.' },
    { title: 'לאכול משהו מזין', body: 'ארוחות קטנות ושתייה לאורך היום שומרות על אנרגיה יציבה יותר.' },
    { title: 'לצאת החוצה', body: 'כמה דקות של אור יום ואוויר צח יכולות לשפר את מצב הרוח.' },
    { title: 'לזוז בעדינות', body: 'הליכה קצרה או מתיחות נחשבות. בקצב של הגוף שלך.' },
    { title: 'להישאר בקשר', body: 'לשלוח הודעה לחברה, או לספר למישהו קרוב איך את באמת מרגישה.' },
    { title: 'להוריד את הרף', body: 'הבית יכול לחכות. מספיק טוב זה טוב מספיק.' }
  ];

  /* ---------- Views ---------- */
  const TILES = [
    ['video', 'video.jpg', 'סרטונים', ''],
    ['assessment', 'assess.jpg', 'הערכה ראשונית', ''],
    ['help', 'help.jpg', 'סיוע', ''],
    ['information', 'info.jpg', 'מידע וניפוץ סטיגמות', 'font-size:16px'],
    ['treatment', 'treat.jpg', 'טיפול', ''],
    ['resources', 'res.jpg', 'משאבים', ''],
    ['symptoms', 'symptoms.jpg', 'סימפטומים', '', 'object-position:center 22%'],
    ['causes', 'causes.jpg', 'גורמים', '', 'object-position:center 40%']
  ];

  const views = {
    home: {
      title: 'נראית',
      render: () => `
        <div class="home-top">
          <a class="pill talk" href="#/help">${ico.phone} לדבר עם מישהו</a>
          <button class="pill install" data-action="install" hidden>${ico.download} התקנה</button>
        </div>
        <div class="brand">
          <img src="images/logo.png" alt="לוגו נראית: קו מתאר של אישה בהריון מחבקת תינוק, ומעליה ענן" width="117" height="204">
          <h1>נראית</h1>
          <p class="tag">ליווי רגשי בהריון ואחרי לידה</p>
          <p class="intro">דיכאון אחרי לידה הוא שכיח, ואפשר לטפל בו. כאן תוכלי לבדוק איך את מרגישה, להבין מה עובר עלייך ולמצוא תמיכה. לבקש עזרה זה סימן של כוח.</p>
        </div>
        <nav class="tiles" aria-label="תפריט ראשי">
          ${TILES.map(([r, img, label, ls, pos]) => `
            <a class="tile" href="#/${r}">
              <img src="images/${img}" alt="" style="${pos || ''}">
              <span style="${ls}">${label}</span>
            </a>`).join('')}
        </nav>
        <a class="crisis-strip" href="#/help">
          <span class="dot-icon">${ico.heart}</span>
          <span style="font-size:15px;line-height:1.5">מחשבות לפגוע בעצמך או בתינוק? <strong style="color:#22285C">התקשרי עכשיו לער״ן 1201, או במצב חירום למד״א 101.</strong> מגיעה לך תמיכה.</span>
        </a>`
    },

    video: {
      title: 'סרטונים',
      render: () => {
        const v = VIDEOS[state.videoSel];
        return `
        ${topbar('סרטונים')}
        <div class="stack" style="gap:14px">
          <div class="player">
            <img src="images/video.jpg" alt="">
            <button class="play" data-action="play" aria-label="הפעלת הסרטון">${ico.play(26, '#B44A30')}</button>
            <div class="bar"></div>
          </div>
          <div class="stack" style="gap:4px;padding:0 4px">
            <p style="margin:0;font-size:13px;font-weight:700;color:#5B6B3A">מתנגן עכשיו · ${state.videoSel + 1} מתוך ${VIDEOS.length}</p>
            <h2 class="h3" style="line-height:1.3">${v.title}</h2>
            <p class="p" style="font-size:15px">${v.desc}</p>
          </div>
        </div>
        <div class="stack">
          <h3 class="label">כל הסרטונים</h3>
          ${VIDEOS.map((x, i) => `
            <button class="vrow" data-action="video" data-i="${i}" aria-pressed="${i === state.videoSel}">
              <span class="badge">${ico.play(14, 'currentColor')}</span>
              <span style="display:flex;flex-direction:column;gap:2px">
                <span class="tt">${x.title}</span><span class="tg">${x.tag}</span>
              </span>
            </button>`).join('')}
        </div>`;
      }
    },

    assessment: {
      title: 'הערכה ראשונית',
      render: () => {
        const { step, answers } = state.quiz;
        const n = PHQ.length;
        if (step < 0) return `
          ${topbar('הערכה ראשונית')}
          <div class="stack" style="gap:16px;flex:1">
            <img class="hero-img" src="images/assess.jpg" alt="" style="height:150px">
            <h2 class="h2" style="font-size:26px">איך הרגשת לאחרונה?</h2>
            <p class="p">השאלון מבוסס על <strong style="color:#22285C">PHQ-9</strong>, שאלון סינון אמריקאי מתוקף לאיתור דיכאון, שפותח בארה״ב ומומלץ לשימוש בהריון ואחרי לידה על ידי איגוד המיילדים והגינקולוגים האמריקאי (ACOG). חשבי על <strong style="color:#22285C">השבועיים האחרונים</strong>.</p>
            <div class="sage-box" style="gap:8px;font-size:15px;line-height:1.5">
              <span>· 10 שאלות, כ־3 דקות</span>
              <span>· התשובות נשמרות רק במכשיר שלך</span>
              <span>· זהו סינון ראשוני, לא אבחנה</span>
            </div>
            <button class="btn btn-primary push" data-action="quiz-start" style="font-size:17px;min-height:56px">בואי נתחיל</button>
            <p class="small" style="font-size:12px;text-align:center">Kroenke, Spitzer &amp; Williams, J Gen Intern Med 2001 · ACOG Clinical Practice Guideline No. 4, 2023</p>
          </div>`;

        if (step < n) {
          const q = PHQ[step];
          const chosen = answers[step];
          const pct = Math.round(((step + 1) / n) * 100);
          return `
          ${topbar('הערכה ראשונית')}
          <div class="stack" style="gap:14px;flex:1">
            <div class="stack" style="gap:8px">
              <div style="display:flex;justify-content:space-between;font-size:14px;font-weight:700;color:#5B6B3A"><span>שאלה ${step + 1} מתוך ${n}</span><span>בשבועיים האחרונים</span></div>
              <div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="${n}" aria-valuenow="${step + 1}"><div style="width:${pct}%"></div></div>
            </div>
            <p class="small" style="font-size:14px">${q.lead}</p>
            <h2 class="h2" style="font-size:22px;line-height:1.35" id="qtext">${q.text}</h2>
            <div class="stack" role="radiogroup" aria-labelledby="qtext">
              ${q.opts.map((o, i) => `
                <button class="opt" role="radio" aria-checked="${chosen === i}" data-action="quiz-pick" data-i="${i}">
                  <span class="radio"></span><span>${o}</span>
                </button>`).join('')}
            </div>
            <div class="row push" style="gap:10px">
              <button class="btn btn-ghost grow" data-action="quiz-back" style="min-height:52px">הקודם</button>
              <button class="btn btn-primary" data-action="quiz-next" style="flex:1.4;min-height:52px" ${chosen === undefined ? 'disabled' : ''}>${step === n - 1 ? 'לתוצאה' : 'הבא'}</button>
            </div>
          </div>`;
        }

        const score = answers.reduce((s, a, i) => s + (a === undefined || !PHQ[i].scored ? 0 : a), 0);
        const urgent = (answers[8] || 0) > 0;
        const band = score >= 20 ? { t: 'תסמינים חמורים', b: 'התשובות שלך מצביעות על תסמיני דיכאון חמורים. זה לא באשמתך, ויש טיפול שעוזר. חשוב לפנות עוד היום לרופאת המשפחה או לגורם בריאות הנפש בקופה.' }
          : score >= 15 ? { t: 'תסמינים בינוניים־חמורים', b: 'התשובות שלך מצביעות על תסמיני דיכאון משמעותיים. דיכאון אחרי לידה שכיח ומטופל היטב. מומלץ לקבוע פגישה עם רופאת המשפחה או גורם בריאות הנפש בימים הקרובים.' }
          : score >= 10 ? { t: 'תסמינים בינוניים', b: 'ציון 10 ומעלה מצביע על סבירות לדיכאון. כדאי לשתף את רופאת המשפחה או האחות בטיפת חלב, ולשקול יחד טיפול.' }
          : score >= 5 ? { t: 'תסמינים קלים', b: 'יש כמה תסמינים קלים. כדאי לשים לב לעצמך, לשתף מישהו קרוב, ולמלא את השאלון שוב בעוד שבועיים.' }
          : { t: 'מעט תסמינים או ללא', b: 'כרגע התשובות שלך מצביעות על מעט תסמיני דיכאון. רגשות יכולים להשתנות בחודשים שאחרי הלידה, אז אפשר לחזור לכאן בכל פעם שמשהו מרגיש לא בסדר.' };
        return `
          ${topbar('הערכה ראשונית')}
          <div class="stack" style="gap:14px;flex:1">
            <div class="score">
              <span style="font-size:14px;font-weight:700;color:#8A3A24">הציון שלך</span>
              <span class="n" dir="ltr">${score}<span style="font-size:22px;color:#8A3A24"> / 27</span></span>
              <span style="font-size:18px;font-weight:700;margin-top:6px">${band.t}</span>
            </div>
            <p class="p" style="font-size:15px;line-height:1.6">${band.b}</p>
            ${urgent ? `
            <a class="navy-box" href="#/help" style="padding:14px 18px;color:#FFF8F2">
              <strong style="font-size:16px">ציינת מחשבות על פגיעה בעצמך.</strong>
              <span style="font-size:15px;line-height:1.5">חשוב לפנות לעזרה עכשיו: ער״ן 1201 (24/7), או במצב חירום מד״א 101. לחצי כאן לכל דרכי הסיוע.</span>
            </a>` : ''}
            <p class="small">שאלון זה אינו מאבחן דיכאון. שתפי את התוצאה עם רופאת המשפחה, האחות בטיפת חלב או אנשי בריאות הנפש בקופה.</p>
            <div class="stack push" style="gap:8px">
              <a class="btn btn-primary" href="#/help" style="font-size:17px;min-height:56px">למציאת תמיכה</a>
              <button class="btn btn-text" data-action="quiz-restart">למלא שוב</button>
            </div>
          </div>`;
      }
    },

    help: {
      title: 'סיוע',
      render: () => `
        ${topbar('סיוע')}
        <div class="hero-card">
          <img src="images/help.jpg" alt="">
          <p style="margin:0;padding:4px 20px 20px;font-family:var(--serif);font-size:21px;line-height:1.4;text-align:center">את לא צריכה לשאת את זה לבד. לפנות לעזרה זה צעד אמיץ ראשון.</p>
        </div>
        <div class="navy-box" style="gap:12px">
          <span style="font-size:14px;font-weight:700;color:#F6C1A8">במצב חירום או סכנה מיידית</span>
          <div class="grid2">
            <a href="tel:101" style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;min-height:64px;border-radius:16px;background:#B44A30;color:#FFF8F2">
              <span dir="ltr" style="font-size:24px;font-weight:700;line-height:1">101</span><span style="font-size:14px">מד״א</span></a>
            <a href="tel:100" style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;min-height:64px;border-radius:16px;background:#343B78;color:#FFF8F2">
              <span dir="ltr" style="font-size:24px;font-weight:700;line-height:1">100</span><span style="font-size:14px">משטרה</span></a>
          </div>
        </div>
        <div class="stack">
          <h2 class="label">לדבר עם מישהו עכשיו</h2>
          <div class="card">
            <div><strong class="t">ער״ן – עזרה ראשונה נפשית</strong><div class="d">אנונימי, 24/7. יש בער״ן גם מענה ייעודי להורים אחרי לידה, ושירות בשפות נוספות.</div></div>
            <div class="row">
              <a class="pill grow" href="tel:1201" style="background:#B44A30;color:#FFF8F2">חיוג 1201</a>
              <a class="pill grow" href="https://wa.me/972528451201" target="_blank" rel="noopener" style="background:#FEEDE4;color:#8A3A24">וואטסאפ</a>
              <a class="pill" href="https://www.eran.org.il" target="_blank" rel="noopener" style="background:#FEEDE4;color:#8A3A24">צ׳אט</a>
            </div>
          </div>
          <div class="card">
            <div><strong class="t">סה״ר – סיוע והקשבה ברשת</strong><div class="d">תמיכה רגשית אנונימית בצ׳אט, למי שקל לה יותר לכתוב מאשר לדבר.</div></div>
            <a class="pill" href="https://sahar.org.il" target="_blank" rel="noopener" style="background:#5B6B3A;color:#FFF8F2">לצ׳אט באתר סה״ר</a>
          </div>
          <div class="card">
            <div><strong class="t">נט״ל – קו סיוע לטראומה</strong><div class="d">למי שילדה או מגדלת תינוק בצל מלחמה, אובדן או אירוע טראומטי.</div></div>
            <a class="pill" href="tel:1800363363" style="background:#EEF1E4;color:#3E4A22"><span dir="ltr">1-800-363-363</span></a>
          </div>
        </div>
        <div class="stack">
          <h2 class="label">דרכים נוספות לקבל עזרה</h2>
          <div class="list">
            <div><span class="bullet"></span><span><strong>האחות בטיפת חלב.</strong> בטיפת חלב מבצעים סינון לדיכאון אחרי לידה, והאחות יכולה להפנות אותך להמשך טיפול.</span></div>
            <div><span class="bullet"></span><span><strong>רופאת המשפחה או הגינקולוגית.</strong> ספרי איך את מרגישה והביאי את תוצאת ההערכה הראשונית.</span></div>
            <div><span class="bullet"></span><span><strong>מרפאות בריאות הנפש של קופת החולים.</strong> טיפול נפשי ניתן במסגרת סל הבריאות; בחלק מבתי החולים יש מרפאות ייעודיות לבריאות נפש האישה בהריון ואחרי לידה.</span></div>
            <div><span class="bullet"></span><span><strong>קבוצות תמיכה</strong> של אמהות, פנים אל פנים או ברשת, עם נשים שעברו את זה.</span></div>
          </div>
        </div>`
    },

    information: {
      title: 'מידע וניפוץ סטיגמות',
      render: () => `
        ${topbar('מידע וניפוץ סטיגמות')}
        <img class="hero-img" src="images/info.jpg" alt="" style="height:130px">
        <section class="stack">
          <h2 class="h2">איך החברה רואה דיכאון אחרי לידה</h2>
          <p class="p">דיכאון בתקופת ההריון ואחרי הלידה הוא מהסיבוכים השכיחים ביותר: כ־12% מהנשים חוות אותו<sup>1</sup>. ועדיין, מחקרים מראים שהציבור מתקשה לזהות את הסימנים, ושעמדות מסטיגמטיות כלפי אמהות עם קושי נפשי נפוצות<sup>2</sup>.</p>
          <p class="p">הדימוי של ״האמא המאושרת״ גורם לנשים רבות להרגיש שמשהו לא בסדר דווקא בהן. בישראל, טיפות החלב מבצעות סינון לדיכאון אחרי לידה באופן שגרתי<sup>3</sup>, וזה צעד חשוב בהכרה בתופעה. מחקר ישראלי מצא שבתקופת מלחמה שיעור הדיכאון אחרי לידה הוכפל<sup>4</sup>: זה לא חולשה אישית, אלא תגובה למציאות קשה.</p>
        </section>
        <section class="stack" style="gap:12px">
          <h2 class="h2">למה נשים לא פונות לעזרה?</h2>
          <p class="p">סקירות מחקר מצביעות על כמה חסמים חוזרים<sup>2,5,6</sup>:</p>
          <div class="stack" style="gap:8px">
            ${[
              ['בושה ופחד משיפוט.', 'החשש להיתפס כ״אמא רעה״ גורם לנשים להסתיר את מה שהן מרגישות.'],
              ['חוסר ידע.', 'נשים רבות לא מזהות שמה שהן חוות הוא תסמינים של מצב רפואי שאפשר לטפל בו.'],
              ['תגובות מבטלות.', 'בני משפחה ואפילו אנשי מקצוע לפעמים ממעטים בקושי: ״זה יעבור״, ״כולן עייפות״.'],
              ['חסמים מעשיים.', 'חוסר זמן, עלות, זמינות מטפלים, ומי ישמור על התינוק בזמן הפגישה.']
            ].map(([b, t], i) => `<div class="feature" style="padding:14px 16px;gap:12px;border-radius:18px"><span class="num soft">${i + 1}</span><span style="font-size:15px;line-height:1.55"><strong style="font-size:15px">${b}</strong> ${t}</span></div>`).join('')}
          </div>
        </section>
        <section class="peach-box stack" style="border-radius:24px">
          <h2 class="h2" style="font-size:24px">״זה רק ההורמונים״</h2>
          <p class="p" style="font-size:15px;color:#3A2A30">השינויים ההורמונליים אחרי לידה אמיתיים, ומחקר הראה שחלק מהנשים רגישות במיוחד לירידה החדה באסטרוגן ובפרוגסטרון<sup>7</sup>. אבל המשפט ״זה רק ההורמונים״ משמש לא פעם כתירוץ:</p>
          <div class="stack" style="gap:8px;font-size:15px;line-height:1.55;color:#3A2A30">
            <span><strong>· כדי לבטל את הסבל:</strong> אם ״זה רק הורמונים״, לכאורה צריך רק לחכות. כך נשים מחכות חודשים בלי טיפול.</span>
            <span><strong>· כדי להתעלם משאר הגורמים:</strong> דיכאון אחרי לידה נובע משילוב של גורמים: היסטוריה אישית, חוסר שינה, לחץ ותמיכה חלשה<sup>8,9</sup>.</span>
            <span><strong>· כדי להקטין את הרגשות של נשים:</strong> ייחוס כל רגש של אישה ל״הורמונים״ מעביר מסר שהקושי שלה פחות אמיתי.</span>
          </div>
          <p style="margin:0;font-size:15px;font-weight:700;line-height:1.55;color:#22285C">הורמונים הם חלק מהתמונה, לא סיבה לוותר על טיפול.</p>
        </section>
        <section class="stack">
          <h2 class="h2">מיתוס או אמת?</h2>
          <p class="small" style="font-size:15px">לחצי על כל אמונה כדי לגלות מה נכון.</p>
          ${MYTHS.map((m, i) => `
            <button class="myth" data-action="myth" data-i="${i}" aria-expanded="${state.mythOpen === i}">
              <span class="head"><span class="tagm">מיתוס</span><span class="q">${m.myth}</span><span class="chev">${ico.chev}</span></span>
              <span class="ans"><span class="tagt">אמת</span><span>${m.truth}</span></span>
            </button>`).join('')}
        </section>
        <a class="btn btn-primary" href="#/help">מוכנה לפנות? למציאת תמיכה</a>
        ${sources([
          'Woody CA et al. Prevalence of perinatal depression: systematic review &amp; meta-regression. J Affect Disord. 2017;219:86-92.',
          'Daehn D et al. Perinatal mental health literacy: a systematic review. BMC Pregnancy Childbirth. 2022;22:574.',
          'Lubotzky-Gete S et al. Postpartum depression and infant development: a nationwide study (Israel). J Affect Disord. 2021;285:136-143.',
          'Klapper-Goldstein H et al. Delivery during a war and risk of postpartum depression. Arch Gynecol Obstet. 2024;310:2863-2871.',
          'Dennis CL, Chung-Lee L. PPD help-seeking barriers: a qualitative systematic review. Birth. 2006;33:323-331.',
          'Jones A. Help seeking in the perinatal period: barriers and facilitators. Soc Work Public Health. 2019;34:596-605.',
          'Bloch M et al. Effects of gonadal steroids in women with a history of PPD. Am J Psychiatry. 2000;157:924-930.',
          'Stewart DE, Vigod SN. Postpartum depression: pathophysiology, treatment, and emerging therapeutics. Annu Rev Med. 2019;70:183-196.',
          'Robertson E et al. Antenatal risk factors for postpartum depression. Gen Hosp Psychiatry. 2004;26:289-295.'
        ])}`
    },

    symptoms: {
      title: 'סימפטומים',
      render: () => `
        ${topbar('סימפטומים')}
        <img class="hero-img" src="images/symptoms.jpg" alt="איור של אישה עייפה מחזיקה ספל, ולידה ענן אפור קטן" style="height:240px;object-position:center 20%;border-radius:26px">
        <div class="stack">
          <h2 class="h2">מהו דיכאון אחרי לידה?</h2>
          <p class="p">דיכאון אחרי לידה הוא דיכאון קליני שמופיע בהריון או בשנה שאחרי הלידה. הוא משפיע על הרגשות, המחשבות והתפקוד היומיומי. הוא שכיח, כ־12% מהנשים בתקופה זו<sup>1</sup>, והוא יכול לקרות לכל אחת<sup>2,3</sup>.</p>
        </div>
        <div class="grid2">
          <div class="card" style="gap:8px;padding:16px"><span style="font-size:14px;font-weight:700;color:#4E5C2F">״בייבי בלוז״</span><span style="font-size:15px;line-height:1.5;color:#3A3550">מצבי רוח משתנים, בכי ודאגה שמתחילים ימים ספורים אחרי הלידה וחולפים תוך כשבועיים. נפוץ מאוד ואינו מחלה.</span></div>
          <div class="card" style="gap:8px;padding:16px;background:#FDD6C2;border-color:#FDD6C2"><span style="font-size:14px;font-weight:700;color:#8A3A24">דיכאון אחרי לידה</span><span style="font-size:15px;line-height:1.5;color:#3A3550">תחושות חזקות יותר, שנמשכות יותר משבועיים ומקשות לעבור את היום.</span></div>
        </div>
        <div class="stack" style="gap:14px">
          <h2 class="h3">סימנים שכדאי לשים לב אליהם</h2>
          ${[
            ['רגשות', 'p', ['עצב או ריקנות רוב היום', 'חרדה או התקפי פאניקה', 'עצבנות או כעס', 'בכי תכוף', 'אובדן הנאה']],
            ['גוף', 's', ['תשישות וחוסר אנרגיה', 'קשיי שינה, גם כשהתינוק ישן', 'שינויים בתיאבון']],
            ['מחשבות', 'l', ['״אני אמא רעה״', 'קושי להתרכז ולהחליט', 'קושי להרגיש קשר לתינוק', 'התרחקות מאנשים', 'אשמה וחוסר ערך']]
          ].map(([h, c, xs]) => `<div class="stack" style="gap:8px"><span style="font-size:14px;font-weight:700;color:#5E5870">${h}</span><div class="chips">${xs.map((x) => `<span class="chip ${c}">${x}</span>`).join('')}</div></div>`).join('')}
        </div>
        <div class="navy-box">
          <strong style="font-size:17px">פני לעזרה מיד אם…</strong>
          <span style="font-size:15px;line-height:1.6;color:#E4E2EE">יש לך מחשבות לפגוע בעצמך או בתינוק, את רואה או שומעת דברים שאחרים לא, או מרגישה שאינך מסוגלת לטפל בעצמך.</span>
          <a class="pill light" href="#/help">לעזרה עכשיו</a>
        </div>
        <a class="btn btn-outline" href="#/assessment">למילוי ההערכה הראשונית</a>
        ${sources([
          'Woody CA et al. J Affect Disord. 2017;219:86-92.',
          'ACOG Clinical Practice Guideline No. 4: Screening and diagnosis of mental health conditions during pregnancy and postpartum. Obstet Gynecol. 2023;141:1232-1261.',
          'O’Hara MW, McCabe JE. Postpartum depression: current status and future directions. Annu Rev Clin Psychol. 2013;9:379-407.'
        ])}`
    },

    causes: {
      title: 'גורמים',
      render: () => `
        ${topbar('גורמים')}
        <img class="hero-img" src="images/causes.jpg" alt="שלושה חלקי פאזל: מוח, DNA ומולקולה" style="height:220px;border-radius:26px">
        <div class="stack">
          <h2 class="h2">הרבה חלקים, אף פעם לא סיבה אחת</h2>
          <p class="p">אין סיבה אחת לדיכאון אחרי לידה. המחקר מראה שבדרך כלל כמה גורמים מצטרפים יחד, כמו חלקי פאזל<sup>1</sup>.</p>
        </div>
        <div class="stack">
          <div class="feature"><span class="ic" style="background:#FEEDE4">${ico.brain}</span><div><strong>גוף והורמונים</strong><p>אחרי הלידה רמות האסטרוגן והפרוגסטרון צונחות. אצל חלק מהנשים, בעיקר אלה שחוו דיכאון אחרי לידה בעבר, המוח רגיש במיוחד לשינוי הזה<sup>2</sup>. גם שינויים בבלוטת התריס, ההחלמה הגופנית וחוסר השינה משפיעים<sup>1</sup>.</p></div></div>
          <div class="feature"><span class="ic" style="background:#EEF1E4">${ico.dna}</span><div><strong>היסטוריה אישית ותורשה</strong><p>דיכאון או חרדה בעבר או במהלך ההריון, וגם היסטוריה משפחתית, הם מגורמי הסיכון החזקים ביותר<sup>3</sup>.</p></div></div>
          <div class="feature"><span class="ic" style="background:#F1EEF6">${ico.home}</span><div><strong>נסיבות חיים ותמיכה</strong><p>אירועי חיים מלחיצים, תמיכה חברתית חלשה וקשיים בזוגיות מעלים את הסיכון<sup>3</sup>. גם מצב ביטחוני: מחקר ישראלי מצא שלידה בזמן מלחמה הכפילה את הסיכון לדיכאון אחרי לידה<sup>4</sup>.</p></div></div>
        </div>
        <div class="peach-box" style="text-align:center"><p style="margin:0;font-family:var(--serif);font-size:21px;line-height:1.45">זה לא משהו שעשית,<br>וזה לא באשמתך.</p></div>
        <a class="btn btn-primary" href="#/treatment">איך מטפלים בזה?</a>
        ${sources([
          'Stewart DE, Vigod SN. Annu Rev Med. 2019;70:183-196.',
          'Bloch M et al. Am J Psychiatry. 2000;157:924-930.',
          'Robertson E et al. Antenatal risk factors for postpartum depression: a synthesis of recent literature. Gen Hosp Psychiatry. 2004;26:289-295.',
          'Klapper-Goldstein H et al. Arch Gynecol Obstet. 2024;310:2863-2871.'
        ])}`
    },

    treatment: {
      title: 'טיפול',
      render: () => `
        ${topbar('טיפול')}
        <div class="hero-card">
          <img src="images/treat.jpg" alt="" style="height:160px">
          <div class="stack" style="padding:6px 20px 20px;gap:6px;text-align:center">
            <h2 class="h2">את יכולה להרגיש שוב כמו עצמך</h2>
            <p class="p" style="font-size:15px;color:#4A3540">לדיכאון אחרי לידה יש טיפולים יעילים ומבוססי מחקר. ככל שמתחילים מוקדם יותר, ההחלמה מהירה יותר<sup>1</sup>.</p>
          </div>
        </div>
        <div class="stack">
          ${[
            ['טיפול בשיחות', 'פגישות עם מטפלת, פנים אל פנים או מרחוק. טיפול קוגניטיבי־התנהגותי (CBT) וטיפול בינאישי (IPT) נמצאו יעילים<sup>1,2</sup>, ורוב הנשים מעדיפות טיפול מסוג זה<sup>3</sup>.'],
            ['טיפול תרופתי', 'תרופות נוגדות דיכאון (כמו SSRI) יעילות ובטוחות לנשים רבות, כולל אפשרויות שמתאימות להנקה<sup>1</sup>. בשנים האחרונות אושרו גם תרופות חדשות שפותחו במיוחד לדיכאון אחרי לידה<sup>4</sup>. הרופאה תעזור לך לבחור.'],
            ['קבוצות תמיכה', 'שיתוף עם אמהות אחרות שמבינות מקל על הבדידות והבושה, ומשלים את הטיפול המקצועי.'],
            ['טיפול עצמי יומיומי', 'מנוחה, תזונה, תנועה עדינה ועזרה בבית תומכים בהחלמה, לצד הטיפול ולא במקומו.']
          ].map(([t, d], i) => `
            <div class="card" style="gap:6px;padding:18px">
              <span style="display:flex;align-items:center;gap:10px"><span class="num sage">${i + 1}</span><strong class="t">${t}</strong></span>
              <span style="font-size:15px;line-height:1.6;color:#4A4560">${d}</span>
              ${i === 3 ? '<a href="#/resources" style="align-self:flex-start;display:flex;align-items:center;min-height:44px;font-size:15px;font-weight:700;color:#8A3A24">לטיפים לטיפול עצמי ←</a>' : ''}
            </div>`).join('')}
        </div>
        <div class="sage-box"><strong style="font-size:16px">בישראל</strong><span style="font-size:15px;line-height:1.55">טיפול נפשי ניתן דרך קופות החולים. אפשר להתחיל מרופאת המשפחה או מהאחות בטיפת חלב, שיפנו אותך להמשך.</span></div>
        <p class="small" style="padding:0 4px">המידע כאן כללי. התאמת הטיפול נעשית תמיד עם איש או אשת מקצוע.</p>
        <a class="btn btn-primary" href="#/help">צעד ראשון: למציאת תמיכה</a>
        ${sources([
          'Stewart DE, Vigod SN. Postpartum depression: pathophysiology, treatment, and emerging therapeutics. Annu Rev Med. 2019;70:183-196.',
          'US Preventive Services Task Force (Curry SJ et al.). Interventions to prevent perinatal depression. JAMA. 2019;321:580-587.',
          'Dennis CL, Chung-Lee L. Birth. 2006;33:323-331.',
          'Deligiannidis KM et al. Zuranolone for the treatment of postpartum depression. Am J Psychiatry. 2023;180:668-675.'
        ])}`
    },

    resources: {
      title: 'משאבים',
      render: () => `
        ${topbar('משאבים')}
        <div class="stack">
          <img class="hero-img" src="images/res.jpg" alt="" style="height:130px">
          <h2 class="h2" style="margin-top:6px">צעדים קטנים להיום</h2>
          <p class="p">רעיונות עדינים שיכולים להקל קצת על הימים. בחרי אחד או שניים, אין צורך בכולם.</p>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;padding:0 4px">
          <span style="font-size:15px;font-weight:700;color:#5E5870">היום</span>
          <span style="font-size:15px;font-weight:700;color:#4E5C2F">${state.tips.filter(Boolean).length} מתוך ${TIPS.length}</span>
        </div>
        <div class="stack" style="gap:8px">
          ${TIPS.map((t, i) => `
            <button class="check" role="checkbox" aria-checked="${!!state.tips[i]}" data-action="tip" data-i="${i}">
              <span class="box">${ico.check}</span>
              <span><span class="tt">${t.title}</span><span class="bd">${t.body}</span></span>
            </button>`).join('')}
        </div>
        <p class="small" style="padding:0 4px">הצעדים האלה משלימים טיפול מקצועי ואינם מחליפים אותו.</p>
        <a class="btn btn-outline" href="#/help">הטיפים לא מספיקים? לקבלת תמיכה</a>`
    }
  };

  /* ---------- Router ---------- */
  function currentRoute() {
    const r = (location.hash || '#/').replace(/^#\/?/, '').split('?')[0];
    return views[r] ? r : 'home';
  }

  function render(opts) {
    const route = currentRoute();
    const v = views[route];
    main.innerHTML = `<div class="view" data-route="${route}">${v.render()}</div>`;
    document.title = route === 'home' ? 'נראית – ליווי רגשי בהריון ואחרי לידה' : `${v.title} · נראית`;
    syncInstallButton();
    if (opts && opts.navigated) {
      window.scrollTo(0, 0);
      const h = main.querySelector('h1');
      if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
    }
  }

  window.addEventListener('hashchange', () => {
    if (currentRoute() === 'assessment' && state.quiz.step >= PHQ.length) {
      // keep result if coming back
    }
    render({ navigated: true });
  });

  /* ---------- Actions ---------- */
  main.addEventListener('click', (e) => {
    const el = e.target.closest('[data-action]');
    if (!el) return;
    const i = Number(el.dataset.i);
    const q = state.quiz;
    switch (el.dataset.action) {
      case 'video': state.videoSel = i; render(); break;
      case 'play': toast('הסרטונים יתווספו בקרוב'); break;
      case 'quiz-start': state.quiz = { step: 0, answers: [] }; render({ navigated: true }); break;
      case 'quiz-pick': q.answers[q.step] = i; render(); focusSel('.opt[aria-checked="true"]'); break;
      case 'quiz-next': if (q.answers[q.step] !== undefined) { q.step++; render({ navigated: true }); } break;
      case 'quiz-back': q.step--; render({ navigated: true }); break;
      case 'quiz-restart': state.quiz = { step: -1, answers: [] }; render({ navigated: true }); break;
      case 'myth': state.mythOpen = state.mythOpen === i ? -1 : i; render(); focusSel(`.myth[data-i="${i}"]`); break;
      case 'tip': state.tips[i] = !state.tips[i]; saveTips(); render(); focusSel(`.check[data-i="${i}"]`); break;
      case 'install': promptInstall(); break;
    }
  });

  function focusSel(sel) { const el = main.querySelector(sel); if (el) el.focus({ preventScroll: true }); }

  let toastTimer;
  function toast(msg) {
    let t = document.querySelector('.toast');
    if (!t) { t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); document.body.appendChild(t); }
    t.textContent = msg;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.remove(), 2500);
  }

  /* ---------- PWA: install + service worker ---------- */
  let deferredPrompt = null;
  window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); deferredPrompt = e; syncInstallButton(); });
  window.addEventListener('appinstalled', () => { deferredPrompt = null; syncInstallButton(); toast('האפליקציה הותקנה'); });
  function syncInstallButton() {
    const b = main.querySelector('[data-action="install"]');
    if (b) b.hidden = !deferredPrompt;
  }
  async function promptInstall() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
    syncInstallButton();
  }

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').catch((err) => console.warn('SW registration failed', err));
    });
  }

  render();
})();
