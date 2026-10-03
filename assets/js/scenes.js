/* HTML templates of the landing scenes. Ported one to one from the Vue components. */
(function () {
  'use strict';

  var KM = (window.KM = window.KM || {});

  var ICONS = {
    arrow: ['M5 12h14', 'M13 6l6 6-6 6'],
    'arrow-left': ['M19 12H5', 'M11 6l-6 6 6 6'],
    chevron: ['M9 6l6 6-6 6'],
    close: ['M6 6l12 12', 'M18 6 6 18'],
    menu: ['M4 7h16', 'M4 12h16', 'M4 17h16'],
    check: ['M5 12.5l4.5 4.5L19 7.5'],
    search: ['M20 20l-4-4'],
    lock: ['M8 11V8a4 4 0 0 1 8 0v3'],
    alert: ['M12 8v5', 'M12 16.5v.01'],
    swap: ['M7 16V4', 'M3 8l4-4 4 4', 'M17 8v12', 'M21 16l-4 4-4-4'],
    book: ['M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z', 'M4 19V5', 'M9 7h6'],
    copy: ['M9 9h10v10H9z', 'M5 15V5h10']
  };

  function esc(value) {
    return String(value).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function icon(name, size, strokeWidth) {
    size = size || 18;
    strokeWidth = strokeWidth || 2;
    var extra = '';
    if (name === 'search') extra = '<circle cx="11" cy="11" r="7"></circle>';
    if (name === 'lock') extra = '<rect x="5" y="11" width="14" height="9" rx="1.5"></rect>';
    if (name === 'alert') extra = '<circle cx="12" cy="12" r="9"></circle>';
    var paths = (ICONS[name] || []).map(function (d) { return '<path d="' + d + '"></path>'; }).join('');
    return '<svg class="km-ic" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" stroke-width="' + strokeWidth +
      '" aria-hidden="true" focusable="false">' + extra + paths + '</svg>';
  }

  var LOGO = './assets/icons/logo.svg';

  // Scene of a fixed size, scaled to the width of its container (FitStage.vue).
  function fit(cls, width, height, inner, opts) {
    opts = opts || {};
    return '<div class="km-fit ' + cls + '"' + (opts.attrs ? ' ' + opts.attrs : '') +
      ' data-fit-w="' + width + '" data-fit-h="' + height + '" data-fit-min="' + (opts.min || 0.4) +
      '" style="max-width: ' + width + 'px; height: ' + height + 'px;">' +
      '<div class="km-fit__in" style="width: ' + width + 'px; height: ' + height + 'px;">' + inner + '</div></div>';
  }

  var tick = function (size, sw, cls) {
    return '<span class="km-tick' + (cls ? ' ' + cls : '') + '">' + icon('check', size, sw) + '</span>';
  };
  var pad = function (n) { return String(n).padStart(2, '0'); };

  /* ---------- Journey: card for phone ---------- */

  var JC_BARS = [58, 66, 52, 70, 60, 48, 84];

  KM.journeyCard = function (role, step) {
    var body = '';
    if (role === 'advertiser' && step === 1) {
      body = '<div class="km-jc__card">' +
        '<span class="km-mono km-jc__muted">Кампании › Новая</span>' +
        '<div class="km-jc__box">Весенняя распродажа</div>' +
        '<div class="km-jc__box km-mono" style="font-size:13px">https://example.ru/sale</div>' +
        '<div class="km-jc__between"><span class="km-jc__flabel">Креативы</span><span class="km-mono km-jc__muted">3 из 5</span></div>' +
        '<div class="km-jc__creatives"><span class="is-on"></span><span></span><span></span><span class="is-empty"></span><span class="is-empty"></span></div>' +
        '</div>';
    } else if (role === 'advertiser' && step === 2) {
      body = '<div class="km-jc__card" style="padding:6px 16px;gap:0">' +
        '<div class="km-kv"><span>Формат</span><span>Banner · CPM</span></div>' +
        '<div class="km-kv"><span>Таргетинг</span><span>Россия · смартфоны</span></div>' +
        '<div class="km-kv"><span>Ставка</span><span>задаёте сами</span></div>' +
        '<div class="km-kv"><span>Дневной бюджет</span><span class="km-mono">5 000 ₽</span></div>' +
        '<div class="km-kv"><span>Общий бюджет</span><span class="km-mono">60 000 ₽</span></div>' +
        '<div class="km-kv"><span>Расписание</span><span>Будни, 9–21</span></div>' +
        '</div>';
    } else if (role === 'advertiser' && step === 3) {
      body = '<div class="km-jc__list">' +
        '<div class="km-jc__state">' + tick(11, 3, 'km-tick--soft') + 'На проверке</div>' +
        '<div class="km-jc__state">' + tick(11, 3, 'km-tick--soft') + 'Одобрена</div>' +
        '<div class="km-jc__state is-on"><span class="km-jc__live"><span class="km-dot"></span></span>' +
        '<span class="km-jc__col"><b>Активна</b><span>участвует в подходящих аукционах</span></span></div>' +
        '</div>';
    } else if (role === 'advertiser' && step === 4) {
      body = '<div class="km-jc__card" style="gap:12px">' +
        '<div class="km-jc__between"><b style="font-size:15px">Статистика</b><span class="km-tag km-tag--sm">пример</span></div>' +
        '<div class="km-jc__bars">' + JC_BARS.map(function (h, i) {
          return '<span' + (i === JC_BARS.length - 1 ? ' class="is-on"' : '') + ' style="height: ' + h + '%;"></span>';
        }).join('') + '</div>' +
        '<div class="km-jc__done">' + tick(11, 3) + 'Postback · конверсия учтена</div>' +
        '</div>';
    } else if (role === 'publisher' && step === 1) {
      body = '<div class="km-jc__fmts">' + ['Pop', 'Push', 'InPage', 'Banner', 'InApp', 'Video'].map(function (f) {
        return '<span' + (f === 'Banner' ? ' class="is-on"' : '') + '>' + (f === 'Banner' ? tick(10, 3) : '') + f + '</span>';
      }).join('') + '</div>';
    } else if (role === 'publisher' && step === 2) {
      body = '<div class="km-jc__code">' +
        '<div class="km-mono km-jc__code-bar"><i></i>Интеграция · Banner</div>' +
        '<div class="km-mono km-jc__code-body">' +
        '<span>&lt;div id=<q>"km-slot"</q>&gt;&lt;/div&gt;</span>' +
        '<span>&lt;script async src=<q>"…"</q>&gt;&lt;/script&gt;</span>' +
        '</div></div>';
    } else if (role === 'publisher' && step === 3) {
      body = '<div class="km-jc__card" style="gap:12px">' +
        '<div class="km-jc__chain"><span>Площадка</span><i class="km-mono">→</i><span class="is-core">Клик Медиа</span><i class="km-mono">→</i><span class="is-soft">Спрос</span></div>' +
        '<span class="km-jc__note">Кампании рекламодателей и внешний спрос. Потоки создаются автоматически.</span>' +
        '</div>';
    } else if (role === 'publisher' && step === 4) {
      body = '<div class="km-jc__card" style="gap:10px">' +
        [['Запросы', 100], ['Показы', 74], ['Клики', 28], ['Доход', 46]].map(function (m) {
          return '<div class="km-jc__meter' + (m[0] === 'Доход' ? ' is-main' : '') + '"><span>' + m[0] + '</span><i><b style="width: ' + m[1] + '%;"></b></i></div>';
        }).join('') +
        '<span class="km-mock-btn" style="margin-top:4px">Запросить выплату</span>' +
        '</div>';
    }
    return '<div class="km-jc" aria-hidden="true">' + body + '</div>';
  };

  /* ---------- Journey: scene 800x460 ---------- */

  var JS_BARS = [[58, 16], [66, 20], [52, 14], [70, 18], [60, 22], [48, 15], [84, 28]];
  var JS_DAYS = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];
  var METERS = [['Запросы', 100], ['Показы', 74], ['Клики', 28], ['Доход', 46]];

  KM.journeyScene = function (role, step) {
    var s = '<div class="km-js"><div class="km-slab km-m-floor km-js__floor"></div>';

    if (role === 'advertiser' && step === 1) {
      s += '<div class="km-slab km-m-paper km-d-l km-obj km-js__form" style="left:40px;top:40px;width:420px;height:360px">' +
        '<span class="km-mono km-js__crumb">Кампании › Новая</span>' +
        '<div class="km-js__field"><span>Название</span><div class="km-js__box">Весенняя распродажа</div></div>' +
        '<div class="km-js__field"><span>URL перехода</span><div class="km-js__box km-mono" style="font-size:14px">https://example.ru/sale</div></div>' +
        '<div class="km-js__between"><span class="km-js__flabel">Креативы</span><span class="km-mono km-js__muted">3 из 5</span></div>' +
        '<div class="km-js__creatives">' +
        '<div class="is-on"><i style="background:var(--km-navy)"></i><b class="km-sk km-sk--d"></b><b class="km-sk" style="width:70%"></b></div>' +
        '<div><i style="background:var(--km-brand)"></i><b class="km-sk km-sk--d"></b><b class="km-sk" style="width:60%"></b></div>' +
        '<div><i style="background:var(--km-winner)"></i><b class="km-sk km-sk--d"></b><b class="km-sk" style="width:80%"></b></div>' +
        '<div class="is-empty">+</div><div class="is-empty">+</div>' +
        '</div></div>' +
        '<div class="km-cshadow" style="left:470px;top:412px;width:270px;height:22px"></div>' +
        '<div class="km-slab km-m-paper km-d-m km-float km-obj km-js__ad" style="left:440px;top:190px;width:300px;height:170px">' +
        '<div class="km-js__row"><span class="km-ad-i" style="width:34px;height:34px;font-size:15px">К</span><span class="km-ad-b" style="font-size:13px">Велошкола «Круг»</span><span class="km-ad-tag" style="margin-left:auto">Реклама</span></div>' +
        '<div class="km-ad-t" style="font-size:24px">Первое занятие — бесплатно</div>' +
        '<div class="km-js__row" style="justify-content:space-between"><span class="km-ad-x" style="font-size:13px">Группы для взрослых</span><span class="km-ad-cta" style="height:30px;font-size:12.5px;padding:0 12px">Записаться</span></div>' +
        '</div>' +
        '<div class="km-callout km-callout--right" style="left:520px;top:50px;width:220px">до 5 креативов<br>в одной кампании</div>';
    } else if (role === 'advertiser' && step === 2) {
      s += '<div class="km-slab km-m-paper km-d-l km-obj km-js__card" style="left:60px;top:24px;width:400px;height:396px">' +
        '<div class="km-js__between"><span class="km-lbl">Кампания</span><span class="km-tag km-tag--sm">пример</span></div>' +
        '<span class="km-js__name">Весенняя распродажа</span>' +
        '<div class="km-js__kvs">' +
        '<div class="km-kv"><span>Формат</span><span>Banner · CPM</span></div>' +
        '<div class="km-kv"><span>Страны</span><span>Россия</span></div>' +
        '<div class="km-kv"><span>Устройства</span><span>Смартфоны</span></div>' +
        '<div class="km-kv"><span>Ставка</span><span>задаёте сами</span></div>' +
        '<div class="km-kv"><span>Дневной бюджет</span><span class="km-mono">5 000 ₽</span></div>' +
        '<div class="km-kv"><span>Общий бюджет</span><span class="km-mono">60 000 ₽</span></div>' +
        '<div class="km-kv"><span>Расписание</span><span>Будни, 09:00–21:00</span></div>' +
        '</div></div>' +
        '<div class="km-cshadow" style="left:520px;top:400px;width:230px;height:22px"></div>' +
        '<div class="km-slab km-m-paper km-d-m km-float km-obj km-js__stack" style="left:500px;top:170px;width:250px;height:176px">' +
        '<span class="km-lbl">Таргетинг</span>' +
        ['Россия', 'Смартфоны', 'Chrome, Яндекс Браузер'].map(function (c) {
          return '<span class="km-js__chip">' + tick(11, 3) + c + '</span>';
        }).join('') +
        '</div>';
    } else if (role === 'advertiser' && step === 3) {
      s += '<div class="km-slab km-m-paper km-d-l km-obj km-js__card" style="left:50px;top:90px;width:380px;height:260px;gap:10px">' +
        '<span class="km-lbl">Кампания</span>' +
        '<span class="km-js__name" style="margin-top:0;font-size:24px">Весенняя распродажа</span>' +
        '<span class="km-mono km-js__muted">Banner · Россия · Смартфоны</span>' +
        '<div class="km-js__thumbs">' +
        '<span><i style="background:var(--km-navy)"></i><b class="km-sk km-sk--d"></b></span>' +
        '<span><i style="background:var(--km-brand)"></i><b class="km-sk km-sk--d"></b></span>' +
        '<span><i style="background:var(--km-winner)"></i><b class="km-sk km-sk--d"></b></span>' +
        '</div>' +
        '<div class="km-js__status"><span>Статус</span><span class="km-tag km-tag--brand"><span class="km-dot"></span>Активна</span></div>' +
        '</div>' +
        '<svg class="km-js__svg" width="800" height="460" viewBox="0 0 800 460"><path class="km-flow-line" d="M530 126 L530 170 M530 226 L530 270"></path></svg>' +
        '<div class="km-slab km-m-paper km-d-s km-obj km-js__state" style="left:500px;top:70px"><span class="km-js__ok">' + icon('check', 13, 3) + '</span>На проверке</div>' +
        '<div class="km-slab km-m-paper km-d-s km-obj km-js__state" style="left:500px;top:170px"><span class="km-js__ok">' + icon('check', 13, 3) + '</span>Одобрена</div>' +
        '<div class="km-slab km-m-brand km-d-m km-obj km-js__state km-js__state--on" style="left:500px;top:270px;height:64px">' +
        '<span class="km-js__live"><span class="km-dot"></span></span>' +
        '<span class="km-js__col"><b>Активна</b><span>участвует в подходящих аукционах</span></span></div>';
    } else if (role === 'advertiser' && step === 4) {
      s += '<div class="km-slab km-m-paper km-d-l km-obj km-js__card" style="left:40px;top:40px;width:520px;height:360px;padding:22px 24px">' +
        '<div class="km-js__row" style="gap:12px"><span class="km-js__title">Статистика</span><span class="km-tag km-tag--sm">пример</span><span class="km-mono km-js__muted" style="margin-left:auto">7 дней · по дням</span></div>' +
        '<div class="km-js__legend"><span><i style="background:var(--km-brand-mist)"></i>Клики</span><span><i style="background:var(--km-brand)"></i>Конверсии</span></div>' +
        '<div class="km-js__bars">' + JS_BARS.map(function (b) {
          return '<div><span style="height: ' + b[0] + '%;"></span><span class="is-conv" style="height: ' + b[1] + '%;"></span></div>';
        }).join('') + '</div>' +
        '<div class="km-mono km-js__days">' + JS_DAYS.map(function (d) { return '<span>' + d + '</span>'; }).join('') + '</div>' +
        '</div>' +
        '<div class="km-cshadow" style="left:540px;top:410px;width:220px;height:22px"></div>' +
        '<div class="km-slab km-m-paper km-d-m km-float km-obj km-js__stack" style="left:520px;top:230px;width:250px;height:132px;gap:8px">' +
        '<span class="km-lbl">Postback</span>' +
        '<span class="km-mono" style="font-size:13.5px;color:var(--km-text-2)">click_id=km_7f3a19</span>' +
        '<span class="km-js__done">' + tick(11, 3) + 'Конверсия учтена</span>' +
        '</div>';
    } else if (role === 'publisher' && step === 1) {
      [
        { k: 'pop', t: 'Pop', e: 'сайты', x: 60, y: 50 },
        { k: 'push', t: 'Push', e: 'подписчики сайтов', x: 256, y: 50 },
        { k: 'inpage', t: 'InPage', e: 'сайты', x: 452, y: 50 },
        { k: 'banner', t: 'Banner', e: 'слоты сайтов', x: 60, y: 222 },
        { k: 'inapp', t: 'InApp Banner', e: 'приложения', x: 256, y: 222 },
        { k: 'video', t: 'Video', e: 'видеоплееры', x: 452, y: 222 }
      ].forEach(function (f) {
        s += '<div class="km-slab km-d-s km-obj km-js__fmt ' + (f.k === 'banner' ? 'km-m-tint is-on' : 'km-m-paper') + '" style="left: ' + f.x + 'px; top: ' + f.y + 'px;">' +
          (f.k === 'banner' ? '<span class="km-js__fmt-check">' + icon('check', 12, 3) + '</span>' : '') +
          '<span class="km-js__glyph is-' + f.k + '"><i></i><i></i></span>' +
          '<b>' + f.t + '</b><span>' + f.e + '</span></div>';
      });
      s += '<div class="km-callout km-callout--right" style="left:650px;top:236px;width:150px">формат задаётся при подключении</div>';
    } else if (role === 'publisher' && step === 2) {
      s += '<div class="km-slab km-m-ink km-d-l km-obj km-js__code" style="left:40px;top:60px;width:500px;height:290px">' +
        '<div class="km-mono km-js__code-bar"><i></i>Интеграция · Banner 300×250</div>' +
        '<div class="km-mono km-js__code-body">' +
        '<span class="is-c">&lt;!-- Клик Медиа · Banner 300×250 --&gt;</span>' +
        '<span>&lt;div <em>id</em>=<q>"km-slot"</q>&gt;&lt;/div&gt;</span>' +
        '<span>&lt;script <em>async</em> <em>src</em>=<q>"…"</q>&gt;&lt;/script&gt;</span>' +
        '</div>' +
        '<div class="km-js__code-foot"><span>' + icon('copy', 15) + 'Скопировать код</span></div>' +
        '</div>' +
        '<div class="km-cshadow" style="left:580px;top:400px;width:180px;height:22px"></div>' +
        '<div class="km-slab km-m-paper km-d-m km-float km-obj km-js__stack" style="left:570px;top:180px;width:200px;height:186px;gap:8px">' +
        '<span class="km-lbl">Тип интеграции</span>' +
        '<span class="km-tag km-tag--brand" style="align-self:flex-start">' + icon('check', 13, 3) + 'Код</span>' +
        '<span class="km-tag" style="align-self:flex-start">Feed</span>' +
        '<span class="km-tag" style="align-self:flex-start">Endpoint</span>' +
        '<span class="km-js__muted" style="margin-top:2px;font-size:13.5px">зависит от формата</span>' +
        '</div>';
    } else if (role === 'publisher' && step === 3) {
      s += '<div class="km-slab km-m-paper km-d-l km-obj" style="left:40px;top:50px;width:300px;height:350px">' +
        '<div class="km-bw-bar"><span class="km-bw-dot"></span><span class="km-bw-dot"></span><span class="km-bw-dot"></span><span class="km-url">сайт-партнёра.рф</span></div>' +
        '<div class="km-js__page">' +
        '<div class="km-sk km-sk--d" style="width:56%;height:12px"></div>' +
        '<div class="km-sk" style="width:94%"></div><div class="km-sk" style="width:80%"></div>' +
        '<div class="km-slot" style="height:150px;margin:6px 0;padding:8px;align-items:stretch">' +
        '<div class="km-js__slot-ad">' +
        '<div class="km-js__row"><span class="km-ad-i">К</span><span class="km-ad-b">Велошкола «Круг»</span><span class="km-ad-tag" style="margin-left:auto">Реклама</span></div>' +
        '<span class="km-ad-t" style="font-size:18px">Первое занятие — бесплатно</span>' +
        '<span class="km-ad-cta" style="align-self:flex-start">Записаться</span>' +
        '</div></div>' +
        '<div class="km-sk" style="width:88%"></div><div class="km-sk" style="width:64%"></div>' +
        '</div></div>' +
        '<svg class="km-js__svg" width="800" height="460" viewBox="0 0 800 460" style="z-index:2">' +
        '<path class="km-flow-line" d="M360 150 C 420 150, 440 170, 500 170"></path>' +
        '<path class="km-flow-line" d="M500 226 C 440 226, 420 250, 360 250"></path></svg>' +
        '<span class="km-mono km-js__arrow" style="left:372px;top:118px">рекламный запрос →</span>' +
        '<span class="km-mono km-js__arrow" style="left:368px;top:262px">← рекламное объявление</span>' +
        '<div class="km-cshadow" style="left:520px;top:396px;width:130px;height:22px"></div>' +
        '<div class="km-slab km-m-brand km-d-xl km-float km-obj km-js__core" style="left:500px;top:130px;width:130px;height:130px">' +
        '<span><img src="' + LOGO + '" alt="" width="40" height="39"></span></div>' +
        '<div class="km-js__sources">' +
        '<span class="km-tag km-tag--line"><span class="km-dot"></span>Кампании рекламодателей</span>' +
        '<span class="km-tag km-tag--line"><span class="km-dot" style="background:var(--km-navy)"></span>Внешний спрос</span>' +
        '</div>' +
        '<div class="km-callout km-callout--right" style="left:500px;top:30px;width:280px">потоки создаются автоматически</div>';
    } else if (role === 'publisher' && step === 4) {
      s += '<div class="km-slab km-m-paper km-d-l km-obj km-js__card" style="left:40px;top:40px;width:480px;height:350px;gap:18px">' +
        '<div class="km-js__row" style="gap:12px"><span class="km-js__title">Статистика площадки</span><span class="km-tag km-tag--sm">пример</span></div>' +
        METERS.map(function (m) {
          return '<div class="km-js__meter' + (m[0] === 'Доход' ? ' is-main' : '') + '"><span>' + m[0] + '</span><i><b style="width: ' + m[1] + '%;"></b></i></div>';
        }).join('') +
        '<span class="km-mono km-js__muted" style="margin-top:auto">по размещениям · странам · форматам</span>' +
        '</div>' +
        '<div class="km-cshadow" style="left:520px;top:410px;width:240px;height:22px"></div>' +
        '<div class="km-slab km-m-paper km-d-m km-float km-obj km-js__stack" style="left:500px;top:210px;width:270px;height:176px;gap:6px">' +
        '<span class="km-lbl">Выплаты</span>' +
        '<span style="margin-top:4px;font-size:17px;font-weight:700">Заработанный баланс</span>' +
        '<span class="km-js__muted" style="font-size:14px">можно запросить к выплате</span>' +
        '<span class="km-mock-btn" style="margin-top:auto">Запросить выплату</span>' +
        '</div>';
    }

    return s + '</div>';
  };

  /* ---------- Formats: scene 640x540 (children of .km-fs) ---------- */

  function bar(url) {
    return '<div class="km-bw-bar" style="height:30px"><span class="km-bw-dot"></span><span class="km-bw-dot"></span><span class="km-bw-dot"></span><span class="km-url">' + url + '</span></div>';
  }

  KM.formatScene = function (format) {
    var s = '<div class="km-slab km-m-floor km-fs__floor"></div>';

    if (format === 'banner') {
      s += '<div class="km-cshadow" style="left:120px;top:452px;width:400px;height:28px"></div>' +
        '<div class="km-slab km-m-paper km-d-l km-fs__obj" style="left:96px;top:128px;width:380px;height:350px">' + bar('сайт-партнёра.рф') +
        '<div class="km-fs__page">' +
        '<div class="km-sk km-sk--d" style="width:50%;height:13px"></div>' +
        '<div class="km-sk" style="width:96%"></div><div class="km-sk" style="width:82%"></div>' +
        '<div class="km-slot" style="height:190px;margin:8px 0"><span class="km-fs__detail">300×250</span></div>' +
        '<div class="km-sk" style="width:88%"></div><div class="km-sk" style="width:60%"></div>' +
        '</div></div>' +
        '<div class="km-slab km-m-paper km-d-m km-float km-fs__obj km-fs__card" style="left:100px;top:232px;width:332px;height:186px">' +
        '<div class="km-fs__row"><span class="km-ad-i" style="width:34px;height:34px;font-size:15px">К</span><span class="km-ad-b km-fs__brand">Велошкола «Круг»</span><span class="km-ad-tag km-fs__detail" style="margin-left:auto">Реклама</span></div>' +
        '<div class="km-ad-t km-fs__h" style="--h:26px;--hc:28px">Первое занятие — бесплатно</div>' +
        '<div class="km-fs__row" style="justify-content:space-between"><span class="km-ad-x km-fs__detail" style="font-size:13px">Группы для взрослых</span><span class="km-ad-cta km-fs__cta">Записаться</span></div>' +
        '</div>' +
        '<div class="km-callout km-callout--right km-fs__note" style="left:500px;top:300px;width:130px">слот задан площадкой при подключении</div>';
    } else if (format === 'inpage') {
      s += '<div class="km-cshadow" style="left:110px;top:452px;width:420px;height:28px"></div>' +
        '<div class="km-slab km-m-paper km-d-l km-fs__obj" style="left:80px;top:128px;width:400px;height:350px">' + bar('сайт-партнёра.рф/статья') +
        '<div class="km-fs__page">' +
        '<div class="km-sk km-sk--d" style="width:72%;height:13px"></div><div class="km-sk km-sk--d" style="width:40%;height:13px"></div>' +
        '<div class="km-sk" style="width:96%;margin-top:6px"></div><div class="km-sk" style="width:90%"></div><div class="km-sk" style="width:94%"></div><div class="km-sk" style="width:70%"></div>' +
        '<div class="km-sk" style="width:100%;height:96px;margin:6px 0;background:#EDF3F1"></div>' +
        '<div class="km-sk" style="width:92%"></div><div class="km-sk" style="width:84%"></div>' +
        '</div></div>' +
        '<div class="km-slab km-m-paper km-d-m km-float km-fs__obj km-fs__nc km-fs__nc--inpage">' +
        '<span class="km-ad-i km-fs__icon">М</span>' +
        '<div class="km-fs__col"><span class="km-ad-x km-fs__detail" style="font-size:11px">Маршрут · Реклама</span><span class="km-ad-t km-fs__h" style="--h:16px;--hc:22px">Туры выходного дня</span><span class="km-ad-x km-fs__sub">Подберём поездку на субботу</span></div>' +
        '<span class="km-fs__x km-fs__detail">×</span>' +
        '</div>' +
        '<div class="km-callout km-callout--right km-fs__note" style="left:500px;top:150px;width:130px">поверх контента, без подписки</div>';
    } else if (format === 'pop') {
      s += '<div class="km-cshadow" style="left:90px;top:432px;width:360px;height:26px"></div>' +
        '<div class="km-cshadow" style="left:200px;top:476px;width:350px;height:26px"></div>' +
        '<div class="km-slab km-m-paper km-d-l km-fs__obj" style="left:60px;top:150px;width:340px;height:308px">' + bar('сайт-партнёра.рф') +
        '<div class="km-fs__page">' +
        '<div class="km-sk km-sk--d" style="width:60%;height:13px"></div>' +
        '<div class="km-sk" style="width:94%"></div><div class="km-sk" style="width:84%"></div>' +
        '<div class="km-fs__row km-fs__detail" style="margin-top:8px"><span class="km-tag km-tag--brand">Ссылка на сайте</span><svg width="18" height="20" viewBox="0 0 16 18" fill="#17211F"><path d="M1 1 L1 14 L4.5 10.5 L7 16.5 L9.2 15.6 L6.8 9.8 L11.5 9.8 Z"></path></svg></div>' +
        '</div></div>' +
        '<div class="km-slab km-m-paper km-d-l km-float km-fs__obj" style="left:176px;top:196px;width:350px;height:304px">' + bar('новое окно · реклама') +
        '<div class="km-fs__col km-fs__pop">' +
        '<span class="km-ad-i km-fs__icon km-fs__icon--l">Л</span>' +
        '<span class="km-ad-b km-fs__detail" style="font-size:13px">Лингво Старт</span>' +
        '<span class="km-ad-t km-fs__h" style="--h:26px;--hc:30px">Английский по 15 минут в день</span>' +
        '<span class="km-ad-cta km-fs__cta" style="align-self:flex-start">Пробный урок</span>' +
        '</div></div>' +
        '<div class="km-callout km-callout--right km-fs__note" style="left:60px;top:70px;width:280px">открывается после действия пользователя</div>';
    } else if (format === 'push') {
      s += '<div class="km-cshadow" style="left:214px;top:452px;width:236px;height:28px"></div>' +
        '<div class="km-slab km-m-ink km-d-l km-fs__obj km-fs__phone" style="left:200px;top:70px;width:216px;height:408px">' +
        '<div class="km-fs__screen">' +
        '<span class="km-url km-fs__detail" style="margin:0;align-self:flex-start">сайт-партнёра.рф</span>' +
        '<div class="km-sk km-sk--d" style="width:76%;height:12px;margin-top:110px"></div>' +
        '<div class="km-sk" style="width:96%;background:#DCE6E3"></div><div class="km-sk" style="width:84%;background:#DCE6E3"></div>' +
        '<div class="km-sk" style="width:100%;height:80px;background:#E2EBE8"></div>' +
        '<div class="km-sk" style="width:90%;background:#DCE6E3"></div>' +
        '</div></div>' +
        '<div class="km-slab km-m-paper km-d-m km-float km-fs__obj km-fs__nc km-fs__nc--push">' +
        '<span class="km-ad-i km-fs__icon">Л</span>' +
        '<div class="km-fs__col"><span class="km-ad-x km-fs__detail" style="font-size:11px">Лавка у дома · сейчас</span><span class="km-ad-t km-fs__h" style="--h:16px;--hc:22px">−15% на первый заказ</span><span class="km-ad-x km-fs__sub">Соберём продукты к вечеру</span></div>' +
        '</div>' +
        '<div class="km-callout km-callout--right km-fs__note" style="left:450px;top:150px;width:130px">уведомление подписчику сайта</div>';
    } else if (format === 'inapp') {
      s += '<div class="km-cshadow" style="left:214px;top:452px;width:236px;height:28px"></div>' +
        '<div class="km-slab km-m-ink km-d-l km-fs__obj km-fs__phone" style="left:200px;top:70px;width:216px;height:408px">' +
        '<div class="km-fs__screen" style="padding:24px 16px;gap:6px">' +
        '<span class="km-fs__app km-fs__detail">Погода · Бишкек</span>' +
        '<span class="km-fs__temp">+18°</span>' +
        '<span class="km-fs__app km-fs__detail" style="font-weight:400">Ясно, ветер 3 м/с</span>' +
        '<div class="km-fs__grid"><div class="km-sk"></div><div class="km-sk"></div><div class="km-sk"></div><div class="km-sk"></div></div>' +
        '<div class="km-sk" style="width:90%;margin-top:12px;background:#DCE6E3"></div><div class="km-sk" style="width:70%;background:#DCE6E3"></div>' +
        '</div></div>' +
        '<div class="km-slab km-m-paper km-d-m km-float km-fs__obj km-fs__nc km-fs__nc--inapp">' +
        '<span class="km-ad-i km-fs__icon km-fs__icon--s">П</span>' +
        '<div class="km-fs__col"><span class="km-ad-x km-fs__detail" style="font-size:10px">Такси «Попутно» · Реклама</span><span class="km-ad-t km-fs__h" style="--h:14px;--hc:20px">Первая поездка −30%</span></div>' +
        '<span class="km-ad-cta km-fs__detail" style="margin-left:auto">Открыть</span>' +
        '</div>' +
        '<div class="km-callout km-callout--right km-fs__note" style="left:450px;top:372px;width:130px">баннер 320×50 в приложении</div>';
    } else if (format === 'video') {
      s += '<div class="km-cshadow" style="left:90px;top:452px;width:470px;height:28px"></div>' +
        '<div class="km-slab km-m-ink km-d-l km-fs__obj" style="left:60px;top:196px;width:460px;height:282px;--r:6px">' +
        '<div class="km-fs__player">' +
        '<div class="km-fs__row" style="justify-content:space-between"><span class="km-mono km-fs__vtag">Реклама · 0:15</span><span class="km-fs__vbrand km-fs__detail">Норд X</span></div>' +
        '<div class="km-fs__vtitle">Смартфон для ночной съёмки</div>' +
        '<div class="km-fs__vbar"><i></i></div>' +
        '</div></div>' +
        '<div class="km-slab km-m-paper km-d-s km-float km-fs__obj km-fs__skip km-fs__detail" style="left:380px;top:400px;width:170px;height:40px">Пропустить через 5</div>' +
        '<div class="km-callout km-fs__note km-fs__note--down" style="left:60px;top:116px;width:280px">рекламный ролик в плеере площадки</div>';
    }
    return s;
  };

  KM.formatStage = function (format) {
    return fit('km-fs-box', 640, 540, '<div class="km-fs" data-fit-compact="0.8">' + KM.formatScene(format) + '</div>', { attrs: 'aria-hidden="true"' });
  };

  /* ---------- How it works ---------- */

  function candidates(stage) {
    return KM.HOW_CANDIDATES.map(function (c) {
      var v = KM.candidateView(c, stage);
      return { c: c, v: v };
    });
  }

  function hp(stage, n) { return stage === n ? 'km-hp is-on' : 'km-hp'; }

  KM.howScene = function (stage) {
    var cls = function (base, flag, extra) { return base + (flag ? ' ' + extra : ''); };
    var s = '<div class="km-hw" aria-hidden="true">' +
      '<svg class="km-hw__svg" width="840" height="600" viewBox="0 0 840 600">' +
      '<path class="' + hp(stage, 1) + '" d="M228 190 C 262 190, 258 60, 290 60"></path>' +
      '<path class="' + hp(stage, 2) + '" d="M525 106 C 525 142, 328 132, 328 168"></path>' +
      '<path class="' + hp(stage, 2) + '" d="M525 106 C 525 142, 476 132, 476 168"></path>' +
      '<path class="' + hp(stage, 2) + '" d="M525 106 C 525 142, 624 132, 624 168"></path>' +
      '<path class="' + hp(stage, 2) + '" d="M525 106 C 525 142, 772 132, 772 168"></path>' +
      '<path class="' + hp(stage, 3) + '" d="M476 322 C 476 360, 500 352, 500 388"></path>' +
      '<path class="' + hp(stage, 3) + '" d="M772 322 C 772 360, 610 352, 610 388"></path>' +
      '<path class="' + hp(stage, 4) + '" d="M470 472 L470 504"></path>' +
      '<path class="' + hp(stage, 4) + '" d="M300 544 C 256 544, 262 336, 228 336"></path>' +
      '</svg>' +

      '<div class="km-slab km-m-paper km-d-l km-obj" style="left:0;top:160px;width:210px;height:300px">' +
      '<div class="km-bw-bar"><span class="km-bw-dot"></span><span class="km-bw-dot"></span><span class="km-bw-dot"></span><span class="km-url">сайт-партнёра.рф</span></div>' +
      '<div class="km-hw__page">' +
      '<div class="km-sk km-sk--d" style="width:60%;height:11px"></div>' +
      '<div class="km-sk" style="width:94%"></div><div class="km-sk" style="width:78%"></div>' +
      '<div class="km-slot km-hw__slot"><span>Banner 300×250</span>' +
      '<div class="' + cls('km-hw__fx km-hw__fill', stage >= 4, 'is-on') + '">' +
      '<div class="km-hw__row"><span class="km-ad-i" style="width:24px;height:24px;font-size:11px">К</span><span class="km-ad-tag" style="margin-left:auto">Реклама</span></div>' +
      '<span class="km-ad-t">Первое занятие — бесплатно</span>' +
      '<span class="km-ad-cta" style="align-self:flex-start;height:22px;font-size:11px">Записаться</span>' +
      '</div></div>' +
      '<div class="km-sk" style="width:90%"></div><div class="km-sk" style="width:66%"></div>' +
      '</div></div>' +
      '<span class="km-hw__cap" style="left:0;top:480px">Площадка</span>' +

      '<div class="' + cls('km-slab km-m-paper km-d-m km-obj km-hw__fx km-hw__req', stage === 1, 'is-focus') + '">' +
      '<span class="km-lbl">Рекламный запрос</span>' +
      '<div class="km-hw__row" style="gap:6px">' +
      '<span class="km-tag km-tag--brand">' + icon('lock', 13) + 'Banner 300×250</span>' +
      '<span class="km-tag">Россия</span><span class="km-tag">Смартфон</span><span class="km-tag">Chrome</span>' +
      '</div></div>';

    candidates(stage).forEach(function (o) {
      var c = o.c, v = o.v;
      s += '<div class="' + cls('km-slab km-m-paper km-d-s km-obj km-hw__fx km-hw__cand', v.isWin, 'is-win') + '" style="left: ' + c.x + 'px; opacity: ' + v.opacity + '; transform: ' + (v.visible ? 'none' : 'translateY(10px)') + ';">' +
        (v.isWin ? '<span class="km-tag km-tag--win km-hw__win">результат</span>' : '') +
        '<span class="km-tag km-tag--sm ' + (c.ext ? 'km-tag--navy' : 'km-tag--brand') + '" style="align-self:flex-start">' + (c.ext ? 'Внешний спрос' : 'Кампания') + '</span>' +
        '<b>' + c.name + '</b>' +
        '<span class="km-mono km-hw__fmt">Banner</span>' +
        '<span class="' + cls('km-hw__fx km-hw__mark', c.ok, 'is-ok') + '" style="opacity: ' + (v.marked ? 1 : 0) + ';"><span>' + (c.ok ? '✓' : '×') + '</span><span>' + c.reason + '</span></span>' +
        '</div>';
    });

    s += '<span class="km-mono km-hw__fx km-hw__candlbl" style="opacity: ' + (stage >= 2 ? 1 : 0) + ';">подходящие предложения</span>' +
      '<div class="' + cls('km-slab km-m-brand km-d-l km-obj km-hw__fx km-hw__core', stage === 3, 'is-focus') + '">' +
      '<span class="km-hw__logo"><img src="' + LOGO + '" alt="" width="32" height="31"></span>' +
      '<span class="km-hw__col"><b>Клик Медиа</b><span>сравнивает предложения</span></span></div>' +
      '<div class="' + cls('km-slab km-m-paper km-d-m km-float km-obj km-hw__fx km-hw__res', stage >= 4, 'is-on') + '">' +
      '<span class="km-ad-i" style="width:40px;height:40px;font-size:16px">К</span>' +
      '<div class="km-hw__col"><span class="km-hw__res-cap">Рекламное объявление · Banner</span><span class="km-ad-t" style="font-size:16px">Первое занятие — бесплатно</span></div>' +
      '</div></div>';
    return s;
  };

  KM.howFlow = function (stage) {
    var cls = function (base, flag, extra) { return base + (flag ? ' ' + extra : ''); };
    var link = function (n) { return '<svg class="km-hf__link" viewBox="0 0 20 30" preserveAspectRatio="none"><path class="' + hp(stage, n) + '" d="M10 2 V28"></path></svg>'; };
    var s = '<div class="km-hf km-how__flow" aria-hidden="true">' +
      '<div class="' + cls('km-slab km-m-paper km-d-s km-hf__fx km-hf__req', stage === 1, 'is-focus') + '">' +
      '<span class="km-lbl">Рекламный запрос</span>' +
      '<div class="km-hf__tags"><span class="km-tag km-tag--brand">' + icon('lock', 12) + 'Banner 300×250</span><span class="km-tag">Россия</span><span class="km-tag">Смартфон</span></div>' +
      '</div>' + link(2) + '<div class="km-hf__cands">';

    candidates(stage).forEach(function (o) {
      var c = o.c, v = o.v;
      s += '<div class="' + cls('km-slab km-m-paper km-d-s km-hf__fx km-hf__cand', v.isWin, 'is-win') + '" style="opacity: ' + v.opacity + ';">' +
        '<span class="km-hf__cand-top">' +
        '<span class="km-tag km-tag--sm ' + (c.ext ? 'km-tag--navy' : 'km-tag--brand') + '">' + (c.ext ? 'Внешний спрос' : 'Кампания') + '</span>' +
        (v.isWin ? '<span class="km-tag km-tag--sm km-tag--win">результат</span>' : '') +
        '</span>' +
        '<b>' + c.name + '</b>' +
        '<span class="' + cls('km-hf__fx km-hf__mark', c.ok, 'is-ok') + '" style="opacity: ' + (v.marked ? 1 : 0) + ';">' + (c.ok ? '✓' : '×') + ' ' + c.reasonShort + '</span>' +
        '</div>';
    });

    s += '</div>' + link(3) +
      '<div class="' + cls('km-slab km-m-brand km-d-s km-hf__fx km-hf__core', stage === 3, 'is-focus') + '">' +
      '<span class="km-hf__logo"><img src="' + LOGO + '" alt="" width="26" height="25"></span>' +
      '<span class="km-hf__col"><b>Клик Медиа</b><span>сравнивает предложения</span></span></div>' +
      link(4) +
      '<div class="' + cls('km-slab km-m-paper km-d-s km-float km-hf__fx km-hf__res', stage >= 4, 'is-on') + '">' +
      '<span class="km-ad-i" style="width:36px;height:36px;font-size:15px">К</span>' +
      '<span class="km-hf__col"><span class="km-hf__res-cap">Рекламное объявление → площадке</span><span class="km-ad-t">Первое занятие — бесплатно</span></span>' +
      '</div></div>';
    return s;
  };

  /* ---------- Control ---------- */

  KM.controlComposition = function (role) {
    var parts = KM.CONTROL_PARTS[role];
    var links = KM.CONTROL_LINKS[role];
    var isAdv = role === 'advertiser';
    var s = '<div class="km-cp km-ctl__comp is-' + role + '"><div class="km-cp__wide">';

    var scene = '<div class="km-cp__scene">' +
      '<div class="km-slab km-m-floor km-cp__floor"></div>' +
      '<div class="km-cshadow" style="left:130px;top:402px;width:320px;height:24px"></div>' +
      '<div class="km-cshadow" style="left:960px;top:350px;width:300px;height:24px"></div>';

    if (isAdv) {
      scene += '<svg class="km-cp__svg" width="1280" height="480" viewBox="0 0 1280 480">' +
        '<path class="km-flow-line" d="M448 212 C 500 212, 496 142, 545 142"></path>' +
        '<path class="km-flow-line" d="M568 166 L568 186 M568 234 L568 254 M568 302 L568 322"></path>' +
        '<path class="km-flow-line" d="M786 346 C 846 346, 846 250, 900 250"></path>' +
        '<circle cx="448" cy="212" r="4"></circle><circle cx="545" cy="142" r="4"></circle>' +
        '<circle cx="786" cy="346" r="4"></circle><circle cx="900" cy="250" r="4"></circle></svg>' +
        '<span class="km-link-lbl" style="left:462px;top:150px">' + links[0] + '</span>' +
        '<span class="km-link-lbl" style="left:806px;top:306px">' + links[1] + '</span>' +

        '<div class="km-slab km-m-paper km-d-l km-obj km-cp__panel km-cp__big" style="left:90px;top:120px;width:340px;height:300px">' +
        '<div class="km-cp__between"><span class="km-lbl">Кампания</span><span class="km-tag km-tag--brand" style="height:26px"><span class="km-dot"></span>Активна</span></div>' +
        '<span class="km-cp__name">Весенняя распродажа</span>' +
        '<div class="km-cp__kvs">' +
        '<div class="km-kv"><span>Формат</span><span>Banner</span></div>' +
        '<div class="km-kv"><span>Таргетинг</span><span>Россия · смартфоны</span></div>' +
        '<div class="km-kv"><span>Бюджеты</span><span>дневной и общий</span></div>' +
        '<div class="km-kv"><span>Креативы</span><span class="km-cp__creatives"><i style="background:var(--km-navy)"></i><i style="background:var(--km-brand)"></i><i style="background:var(--km-winner)"></i><span class="km-mono">3 из 5</span></span></div>' +
        '</div></div>';

      KM.TRACKING_CHAIN.forEach(function (c, i) {
        scene += '<div class="km-slab km-d-s km-obj km-cp__panel km-cp__chain ' + (i === 3 ? 'km-m-brand' : 'km-m-paper') + '" style="left: 545px; top: ' + (118 + i * 68) + 'px;">' +
          '<span class="km-mono km-cp__num">' + (i + 1) + '</span>' +
          '<span class="km-cp__chain-t' + (c.mono ? ' km-mono' : '') + '">' + c.t + '</span>' +
          '<span class="km-cp__chain-m' + (i === 1 ? ' km-mono' : '') + '">' + c.m + '</span></div>';
      });

      scene += '<div class="km-slab km-m-paper km-d-l km-obj km-cp__panel km-cp__big" style="left:900px;top:64px;width:330px;height:300px;gap:12px">' +
        '<div class="km-cp__between"><span class="km-lbl">Статистика</span><span class="km-mono km-cp__muted">срезы</span></div>' +
        KM.STAT_SLICES.map(function (st) {
          return '<div class="km-cp__slice"><span class="km-cp__muted">' + st.k + '</span><b>' + st.v + '</b><i><span style="width: ' + st.w + '%;"></span></i></div>';
        }).join('') +
        '<div class="km-cp__ok">' + tick(11, 3) + '+1 конверсия в отчёте кампании</div>' +
        '</div>';
    } else {
      scene += '<svg class="km-cp__svg" width="1280" height="480" viewBox="0 0 1280 480">' +
        '<path class="km-flow-line" d="M448 212 C 504 212, 506 134, 560 134"></path>' +
        '<path class="km-flow-line" d="M672 156 L672 182 M672 334 L672 356"></path>' +
        '<path class="km-flow-line" d="M780 380 C 846 380, 846 250, 900 250"></path>' +
        '<circle cx="448" cy="212" r="4"></circle><circle cx="560" cy="134" r="4"></circle>' +
        '<circle cx="780" cy="380" r="4"></circle><circle cx="900" cy="250" r="4"></circle></svg>' +
        '<span class="km-link-lbl" style="left:468px;top:146px">' + links[0] + '</span>' +
        '<span class="km-link-lbl" style="left:812px;top:318px">' + links[1] + '</span>' +

        '<div class="km-slab km-m-paper km-d-l km-obj km-cp__panel km-cp__big" style="left:90px;top:120px;width:340px;height:300px;gap:12px">' +
        '<div class="km-cp__between"><span class="km-lbl">Трафик</span><span class="km-mono km-cp__muted">сайт-партнёра.рф</span></div>' +
        '<div class="km-cp__metrics">' + KM.TRAFFIC_METRICS.map(function (m) {
          return '<div' + (m.main ? ' class="is-main"' : '') + '><span>' + m.k + '</span><svg width="120" height="34" viewBox="0 0 120 34"><polyline points="' + m.points + '"></polyline></svg></div>';
        }).join('') + '</div></div>' +

        '<div class="km-slab km-m-paper km-d-s km-obj km-cp__panel km-cp__event" style="left:560px;top:110px;width:226px;height:46px">' +
        '<span class="km-dot"></span><b>Событие</b><span class="km-mono km-cp__muted" style="margin-left:auto">клик · показ</span></div>' +
        '<div class="km-slab km-m-paper km-d-m km-obj km-cp__panel km-cp__checks" style="left:552px;top:182px;width:240px;height:152px">' +
        '<span class="km-lbl">Проверка до учёта</span>' +
        KM.QUALITY_CHECKS.map(function (q) { return '<span>' + tick(11, 3) + q + '</span>'; }).join('') +
        '</div>' +
        '<div class="km-slab km-m-brand km-d-s km-obj km-cp__panel km-cp__counted" style="left:572px;top:356px;width:208px;height:48px">' +
        icon('check', 16, 2.6) + 'Учтено в статистике</div>' +

        '<div class="km-slab km-m-paper km-d-l km-obj km-cp__panel km-cp__big" style="left:900px;top:104px;width:330px;height:260px">' +
        '<span class="km-lbl">Баланс</span>' +
        '<span class="km-cp__name">Заработанный баланс</span>' +
        '<div class="km-cp__sum"><span class="km-sk km-sk--d"></span><b>₽</b></div>' +
        '<div class="km-cp__pipe"><span class="km-tag km-tag--line">Доход</span><i>→</i><span class="km-tag km-tag--line">Баланс</span><i>→</i><span class="km-tag km-tag--brand">Заявка</span></div>' +
        '<span class="km-mock-btn" style="margin-top:auto;height:42px">Запросить выплату</span>' +
        '</div>';
    }
    scene += '</div>';

    s += fit('', 1280, 480, scene, { attrs: 'aria-hidden="true"' });
    s += '<div class="km-cp__caps">' + parts.map(function (p, i) {
      return '<div class="km-cp__cap"><h3><span class="km-mono">' + pad(i + 1) + '</span>' + p.t + '</h3><p>' + p.d + '</p></div>';
    }).join('') + '</div></div>';

    // vertical flow for narrow screens
    s += '<div class="km-cp__flow">';
    parts.forEach(function (p, i) {
      if (i > 0) {
        s += '<div class="km-cp__link" aria-hidden="true"><svg width="60" height="44" viewBox="0 0 60 44"><path class="km-flow-line" d="M28 2 V42"></path><circle cx="28" cy="4" r="3.5"></circle><circle cx="28" cy="40" r="3.5"></circle></svg>' +
          '<span class="km-cp__link-lbl">' + links[i - 1] + '</span></div>';
      }
      s += '<div class="km-slab km-m-paper km-d-s km-cp__card"><div class="km-cp__card-head">' +
        '<span class="km-mono km-cp__card-n">' + pad(i + 1) + '</span><h3>' + p.t + '</h3>' +
        (isAdv && i === 0 ? '<span class="km-tag km-tag--brand" style="margin-left:auto;height:26px"><span class="km-dot"></span>Активна</span>' : '') +
        '</div><p>' + p.d + '</p>';

      if (isAdv) {
        if (i === 0) {
          s += '<div aria-hidden="true"><div class="km-kv"><span>Формат</span><span>Banner</span></div>' +
            '<div class="km-kv"><span>Таргетинг</span><span>Россия · смартфоны</span></div>' +
            '<div class="km-kv"><span>Бюджеты</span><span>дневной и общий</span></div></div>';
        } else if (i === 1) {
          s += '<div class="km-cp__chips" aria-hidden="true">' + KM.TRACKING_CHAIN.map(function (c, j) {
            return (j > 0 ? '<i>→</i>' : '') + '<span class="km-tag ' + (j === 3 ? 'km-cp__chip-on' : 'km-tag--line') + (c.mono ? ' km-mono' : '') + '">' + c.t + '</span>';
          }).join('') + '</div>';
        } else {
          s += '<div class="km-cp__bars" aria-hidden="true">' + KM.STAT_SLICES.map(function (st) {
            return '<div><span>' + st.k + '</span><i><b style="width: ' + st.w + '%;"></b></i></div>';
          }).join('') + '<div class="km-cp__ok">' + tick(11, 3) + '+1 конверсия в отчёте</div></div>';
        }
      } else if (i === 0) {
        s += '<div class="km-cp__metrics km-cp__metrics--flow" aria-hidden="true">' + KM.TRAFFIC_METRICS.map(function (m) {
          return '<div' + (m.main ? ' class="is-main"' : '') + '><span>' + m.k + '</span><svg width="120" height="26" viewBox="0 0 120 34" preserveAspectRatio="none"><polyline points="' + m.points + '"></polyline></svg></div>';
        }).join('') + '</div>';
      } else if (i === 1) {
        s += '<div class="km-cp__checks km-cp__checks--flow">' + KM.QUALITY_CHECKS.map(function (q) {
          return '<span>' + tick(11, 3).replace('<span class="km-tick">', '<span class="km-tick" aria-hidden="true">') + q + '</span>';
        }).join('') + '<span class="km-cp__counted km-cp__counted--flow" aria-hidden="true">' + icon('check', 15, 2.6) + 'Учтено в статистике</span></div>';
      } else {
        s += '<div class="km-cp__payout" aria-hidden="true">' +
          '<div class="km-cp__pipe"><span class="km-tag km-tag--line">Доход</span><i>→</i><span class="km-tag km-tag--line">Баланс</span><i>→</i><span class="km-tag km-tag--brand">Заявка</span></div>' +
          '<span class="km-mock-btn" style="height:42px">Запросить выплату</span></div>';
      }
      s += '</div>';
    });
    s += '</div></div>';
    return s;
  };

  KM.icon = icon;
  KM.esc = esc;
  KM.fit = fit;
  KM.pad = pad;
  KM.tick = tick;
})();
