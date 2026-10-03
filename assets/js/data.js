/* Content of the landing page. Copied from the Vue data files (resources/js/Data/landing). */
(function () {
  'use strict';

  var KM = (window.KM = window.KM || {});

  KM.ROLE_TITLES = {
    advertiser: 'Путь рекламодателя',
    publisher: 'Путь владельца площадки'
  };

  KM.LEAD_ROLES = {
    advertiser: 'Рекламодатель',
    publisher: 'Владелец площадки'
  };

  // d — text of the step on desktop, dShort — on phone; chips / chipsShort — the same.
  KM.JOURNEY = {
    advertiser: [
      {
        t: 'Создайте кампанию',
        d: 'Добавьте до пяти креативов и ссылку, на которую попадёт пользователь.',
        chips: ['до 5 креативов', 'URL перехода']
      },
      {
        t: 'Настройте рекламу',
        d: 'Выберите формат и задайте таргетинг, ставку, дневной и общий бюджет, расписание.',
        dShort: 'Формат, таргетинг, ставка, дневной и общий бюджет, расписание.',
        chips: ['Формат', 'Таргетинг', 'Ставка', 'Бюджеты', 'Расписание'],
        chipsShort: ['Таргетинг', 'Ставка', 'Бюджеты']
      },
      {
        t: 'Отправьте кампанию на проверку',
        d: 'После одобрения кампания начинает участвовать в подходящих аукционах.',
        dShort: 'После одобрения кампания участвует в подходящих аукционах.',
        chips: ['На проверке', 'Одобрена', 'Активна']
      },
      {
        t: 'Следите за результатом',
        d: 'Статистика, клики и конверсии через postback помогают оптимизировать кампанию.',
        chips: ['Статистика', 'Конверсии', 'Postback'],
        chipsShort: ['Статистика', 'Postback']
      }
    ],
    publisher: [
      {
        t: 'Выберите формат',
        d: 'Pop, Push, InPage, Banner, InApp Banner или Video — под ваш сайт или приложение.',
        dShort: 'Pop, Push, InPage, Banner, InApp Banner или Video.',
        chips: ['6 форматов', 'Сайты', 'Приложения'],
        chipsShort: ['Сайты', 'Приложения']
      },
      {
        t: 'Подключите интеграцию',
        d: 'Кабинет выдаёт код, feed или endpoint — в зависимости от формата.',
        chips: ['Код', 'Feed', 'Endpoint']
      },
      {
        t: 'Начните монетизацию',
        d: 'Площадка отправляет рекламные запросы, а Клик Медиа подбирает доступный спрос. Потоки создаются автоматически.',
        dShort: 'Площадка отправляет рекламные запросы, Клик Медиа подбирает доступный спрос.',
        chips: ['Кампании рекламодателей', 'Внешний спрос'],
        chipsShort: ['Потоки — автоматически']
      },
      {
        t: 'Следите за доходом',
        d: 'Запросы, показы, клики и доход видны в статистике, а заработанный баланс можно запросить к выплате.',
        dShort: 'Запросы, показы, клики и доход — в статистике. Заработанное можно запросить к выплате.',
        chips: ['Статистика', 'Выплаты']
      }
    ]
  };

  KM.FORMAT_KEYS = ['pop', 'push', 'inpage', 'banner', 'inapp', 'video'];

  // envShort — caption in the rail on desktop, envMini and short — on phone.
  KM.FORMATS = {
    pop: {
      key: 'pop', label: 'Pop', short: 'Pop', env: 'Сайты', envShort: 'сайты', envMini: 'сайты', unit: 'CPC',
      desc: 'Рекламная страница открывается в новом окне после действия пользователя на сайте.',
      where: 'Новое окно браузера',
      integ: 'Код Pop на страницах сайта',
      fact: 'Отдельного рекламного слота на странице нет — показ происходит после клика.'
    },
    push: {
      key: 'push', label: 'Push', short: 'Push', env: 'Сайты', envShort: 'подписчики сайтов', envMini: 'подписчики', unit: 'CPC',
      desc: 'Уведомление приходит подписчикам сайта — в браузере на компьютере или смартфоне.',
      where: 'Уведомления браузера',
      integ: 'Подписка на уведомления на сайте',
      fact: 'Получают только пользователи, которые подписались на уведомления сайта.'
    },
    inpage: {
      key: 'inpage', label: 'InPage', short: 'InPage', env: 'Сайты', envShort: 'сайты', envMini: 'сайты', unit: 'CPC',
      desc: 'Рекламное уведомление внутри открытой страницы. Подписка не нужна.',
      where: 'Поверх контента страницы',
      integ: 'Код InPage на страницах сайта',
      fact: 'Выглядит как уведомление, но существует только внутри страницы.'
    },
    banner: {
      key: 'banner', label: 'Banner', short: 'Banner', env: 'Сайты', envShort: 'слоты сайтов', envMini: 'слоты сайтов', unit: 'CPM',
      desc: 'Баннер в рекламном слоте сайта — в размере, который выбрал владелец площадки.',
      where: 'Рекламный слот на странице',
      integ: 'Слот с кодом Banner',
      fact: 'Размер слота задаётся при подключении, креатив подбирается под него.'
    },
    inapp: {
      key: 'inapp', label: 'InApp Banner', short: 'InApp', env: 'Приложения', envShort: 'приложения', envMini: 'приложения', unit: 'CPM',
      desc: 'Баннер внутри интерфейса мобильного приложения.',
      where: 'Экран приложения',
      integ: 'Интеграция в приложение',
      fact: 'Отдельный формат для мобильных приложений, а не для сайтов.'
    },
    video: {
      key: 'video', label: 'Video', short: 'Video', env: 'Сайты', envShort: 'видеоплееры', envMini: 'плееры', unit: 'CPM',
      desc: 'Рекламный ролик в видеоплеере площадки.',
      where: 'Видеоплеер площадки',
      integ: 'Подключение плеера',
      fact: 'Креатив — видеоролик, место показа — плеер на сайте.'
    }
  };

  KM.PAY_MODEL = {
    CPC: 'CPC · оплата за клик',
    CPM: 'CPM · оплата за 1000 показов'
  };
  KM.PAY_MODEL_SHORT = {
    CPC: 'CPC · оплата за клик',
    CPM: 'CPM · за 1000 показов'
  };

  KM.HOW_STAGES = [
    { short: 'Запрос', t: 'Площадка отправляет рекламный запрос', d: 'Формат уже известен: его задаёт интеграция площадки.' },
    { short: 'Предложения', t: 'Система находит подходящие предложения', d: 'Кампании рекламодателей Клик Медиа и доступный внешний спрос.' },
    { short: 'Сравнение', t: 'Предложения сравниваются', d: 'Учитываются условия кампании и запроса: таргетинг, бюджет, ставка.' },
    { short: 'Объявление', t: 'Площадка получает рекламное объявление', d: 'Выбранный результат возвращается в запрошенном формате.' }
  ];

  // How long one stage stays on screen in the quiet autoplay, ms.
  KM.HOW_STAGE_MS = [2000, 2200, 2600, 4400];

  KM.HOW_CANDIDATES = [
    { name: 'Магазин техники', ext: false, ok: false, reason: 'Достигнут дневной бюджет', reasonShort: 'бюджет достигнут', x: 262 },
    { name: 'Велошкола «Круг»', ext: false, ok: true, win: true, reason: 'Подходит', reasonShort: 'подходит', x: 410 },
    { name: 'Доставка еды', ext: false, ok: false, reason: 'Не подходит таргетинг', reasonShort: 'не тот таргетинг', x: 558 },
    { name: 'Партнёрский спрос', ext: true, ok: true, reason: 'Подходит', reasonShort: 'подходит', x: 706 }
  ];

  // Look of an offer on stage 1–4: appears on 02, marks from 03, result on 04.
  KM.candidateView = function (c, stage) {
    var visible = stage >= 2;
    var dim = stage >= 3 && !c.ok;
    var isWin = stage >= 4 && !!c.win;
    var opacity = !visible ? 0.18 : dim ? 0.5 : stage >= 4 && !c.win ? 0.62 : 1;
    return { visible: visible, isWin: isWin, opacity: opacity, marked: stage >= 3 };
  };

  KM.CONTROL_LEAD = {
    advertiser: 'Кампания, конверсии и статистика связаны в одном кабинете.',
    publisher: 'Трафик, проверка качества и выплаты — в одном кабинете.'
  };

  KM.CONTROL_PARTS = {
    advertiser: [
      { t: 'Кампания', d: 'Формат, таргетинг, бюджеты и статус — в карточке кампании.' },
      { t: 'Конверсии', d: 'Click ID и postback связывают конверсию с рекламной кампанией.' },
      { t: 'Статистика', d: 'Результаты по кампаниям, креативам и площадкам.' }
    ],
    publisher: [
      { t: 'Трафик', d: 'Запросы, показы, клики и доход по вашим размещениям.' },
      { t: 'Качество', d: 'Проверяем рекламный трафик до учёта события.' },
      { t: 'Выплаты', d: 'Заработанный баланс можно запросить к выплате из кабинета.' }
    ]
  };

  KM.CONTROL_LINKS = {
    advertiser: ['клики', 'конверсии'],
    publisher: ['события', 'доход']
  };

  KM.TRACKING_CHAIN = [
    { t: 'Клик', m: 'по объявлению' },
    { t: 'Click ID', m: 'km_7f3a19', mono: true },
    { t: 'Конверсия', m: 'на сайте' },
    { t: 'Postback', m: 'в Клик Медиа', mono: true }
  ];

  KM.STAT_SLICES = [
    { k: 'Кампания', v: 'Весенняя распродажа', w: 82 },
    { k: 'Креатив', v: '№2 · 300×250', w: 62 },
    { k: 'Площадка', v: 'сайт-партнёра.рф', w: 44 }
  ];

  KM.QUALITY_CHECKS = ['Источник', 'Повтор события', 'Браузер и устройство'];

  KM.TRAFFIC_METRICS = [
    { k: 'Запросы', points: '0,26 17,20 34,23 51,14 68,17 85,9 102,12 120,6' },
    { k: 'Показы', points: '0,28 17,23 34,25 51,18 68,20 85,13 102,16 120,10' },
    { k: 'Клики', points: '0,27 17,25 34,21 51,24 68,17 85,19 102,14 120,15' },
    { k: 'Доход', points: '0,27 17,22 34,24 51,16 68,18 85,11 102,13 120,7', main: true }
  ];

  // Messages of the form checks. Same texts as the Laravel ContactFormRequest.
  KM.FORM_MESSAGES = {
    name: 'Имя обязательно',
    contact: 'Укажите контакт: Telegram, email или телефон',
    project: 'Название проекта обязательно',
    message: 'Описание задачи обязательно',
    consent: 'Нужно согласие на обработку персональных данных'
  };

  KM.ROLE_COPY = {
    advertiser: { projectLabel: 'Сайт или продукт', messagePlaceholder: 'Коротко о кампании' },
    publisher: { projectLabel: 'Сайт или приложение', messagePlaceholder: 'Коротко о площадке и трафике' }
  };

  KM.LEAD_TEXT = {
    advertiser: 'Нужна помощь с первой кампанией? Оставьте заявку — поможем с настройкой и запуском.',
    publisher: 'Хотите подключить площадку? Оставьте заявку — поможем выбрать формат и установить интеграцию.'
  };

  KM.CHANNELS = {
    tg: { label: 'Telegram', type: 'text', placeholder: '@username', autocomplete: 'off', inputmode: 'text' },
    email: { label: 'Email', type: 'email', placeholder: 'name@company.ru', autocomplete: 'email', inputmode: 'email' },
    phone: { label: 'Телефон', type: 'tel', placeholder: '+7 (___) ___-__-__', autocomplete: 'tel', inputmode: 'tel' }
  };
})();
