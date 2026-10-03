/* Klik Media landing: behavior. Plain JavaScript, no build step.
   Content lives in assets/js/data.js, scene templates in assets/js/scenes.js. */
(function () {
  'use strict';

  var KM = window.KM;
  var icon = KM.icon;
  var pad = KM.pad;

  var CABINET_URL = 'https://lk.klikmedia.ru';
  var BLOG_URL = 'https://klikmedia.ru/blog';
  var PRIVACY_URL = './assets/docs/webpolicy.pdf';
  var COOKIE_KEY = 'user_cookie_consent';
  var MOBILE_MAX = 1179;

  /* ---------- small helpers ---------- */

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  function reducedMotion() {
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }

  function parse(html) {
    var t = document.createElement('template');
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  }

  // Patch an existing element so it looks like the new one. Elements stay in place,
  // so focus and CSS transitions keep working (like the Vue patch).
  function syncAttrs(a, b) {
    Array.prototype.slice.call(a.attributes).forEach(function (at) {
      if (!b.hasAttribute(at.name)) a.removeAttribute(at.name);
    });
    Array.prototype.slice.call(b.attributes).forEach(function (at) {
      if (a.getAttribute(at.name) !== at.value) a.setAttribute(at.name, at.value);
    });
  }

  function morph(from, to) {
    syncAttrs(from, to);
    var fc = Array.prototype.slice.call(from.childNodes);
    var tc = Array.prototype.slice.call(to.childNodes);
    tc.forEach(function (node, i) {
      var cur = fc[i];
      if (!cur) {
        from.appendChild(node.cloneNode(true));
      } else if (cur.nodeType !== node.nodeType || (node.nodeType === 1 && cur.tagName !== node.tagName)) {
        from.replaceChild(node.cloneNode(true), cur);
      } else if (node.nodeType === 3) {
        if (cur.textContent !== node.textContent) cur.textContent = node.textContent;
      } else if (node.nodeType === 1) {
        morph(cur, node);
      }
    });
    for (var i = fc.length - 1; i >= tc.length; i--) from.removeChild(fc[i]);
  }

  // Vue <Transition mode="out-in"> without Vue: old element leaves, content changes, new one enters.
  function swap(find, name, leaveMs, enterMs, mutate) {
    var el = find();
    if (!el || reducedMotion()) {
      mutate();
      return;
    }
    clearTimeout(el._swapLeave);
    clearTimeout(el._swapEnter);
    el.classList.remove(name + '-enter-active', name + '-enter-from');
    el.classList.add(name + '-leave-active', name + '-leave-to');
    el._swapLeave = setTimeout(function () {
      mutate();
      var next = find();
      if (!next) return;
      next.classList.remove(name + '-leave-active', name + '-leave-to');
      next.classList.add(name + '-enter-active', name + '-enter-from');
      void next.offsetWidth;
      next.classList.remove(name + '-enter-from');
      next._swapEnter = setTimeout(function () {
        next.classList.remove(name + '-enter-active');
      }, enterMs);
    }, leaveMs);
  }

  /* ---------- fixed size scenes that scale to the container (FitStage) ---------- */

  var fitObserver = null;

  function updateFit(fitEl) {
    var inner = fitEl.firstElementChild;
    var w = parseFloat(fitEl.getAttribute('data-fit-w'));
    var h = parseFloat(fitEl.getAttribute('data-fit-h'));
    var min = parseFloat(fitEl.getAttribute('data-fit-min')) || 0.4;
    var width = fitEl.clientWidth;
    // A hidden (display: none) scene has no width. ResizeObserver measures it again when it appears.
    if (!width || !inner) return;
    var scale = Math.min(1, Math.max(min, width / w));
    fitEl.style.height = h * scale + 'px';
    inner.style.transform = scale < 1 ? 'scale(' + scale + ')' : '';
    $$('[data-fit-compact]', fitEl).forEach(function (el) {
      el.classList.toggle('is-compact', scale < parseFloat(el.getAttribute('data-fit-compact')));
    });
    $$('[data-fit-font]', fitEl).forEach(function (el) {
      el.style.fontSize = parseFloat(el.getAttribute('data-fit-font')) / scale + 'px';
    });
  }

  function initFits(root) {
    $$('.km-fit', root || document).forEach(function (fitEl) {
      if (!fitEl._fitSeen) {
        fitEl._fitSeen = true;
        if (fitObserver) fitObserver.observe(fitEl);
      }
      updateFit(fitEl);
    });
  }

  if ('ResizeObserver' in window) {
    fitObserver = new ResizeObserver(function (entries) {
      entries.forEach(function (entry) { updateFit(entry.target); });
    });
  }

  /* ---------- shared state of the roles ---------- */

  var state = {
    currentRole: null,   // role picked on the page; null until the visitor picks one
    formRole: 'advertiser',
    formRoleTouched: false,
    step: 1,
    format: 'banner',
    stage: 1,            // "how it works" stage
    pinned: false,
    channel: 'tg',
    sent: false
  };

  function role() { return state.currentRole || 'advertiser'; }
  function isRole(v) { return v === 'advertiser' || v === 'publisher'; }

  function scrollToSection(id, instant) {
    var el = document.getElementById(id);
    if (!el) return false;
    el.scrollIntoView({ behavior: instant || reducedMotion() ? 'auto' : 'smooth', block: 'start' });
    if (window.location.hash !== '#' + id) {
      try { history.replaceState(history.state, '', '#' + id); } catch (e) { /* file:// or sandbox */ }
    }
    return true;
  }

  function setRole(next) {
    if (!isRole(next)) return;
    var before = role();
    var formBefore = state.formRole;
    state.currentRole = next;
    if (!state.formRoleTouched) state.formRole = next;
    renderGateway();
    if (role() !== before) {
      state.step = 1;
      renderJourney(true);
      renderControl(true);
    }
    if (state.formRole !== formBefore) renderFormRole();
  }

  function setFormRole(next) {
    if (!isRole(next)) return;
    state.formRoleTouched = true;
    if (state.formRole === next) return;
    state.formRole = next;
    renderFormRole();
  }

  function showRole(next) {
    setRole(next);
    scrollToSection('journey');
  }

  function goToLeadForm(next) {
    setRole(next);
    if (isRole(next)) {
      state.formRole = next;
      renderFormRole();
    }
    if (!scrollToSection('contact')) return;
    var btn = $('[data-lead-role="' + state.formRole + '"]');
    if (btn) btn.focus({ preventScroll: true });
  }

  /* ---------- Role gateway ---------- */

  function renderGateway() {
    $$('[data-role-card]').forEach(function (card) {
      var on = state.currentRole === card.getAttribute('data-role-card');
      card.classList.toggle('is-on', on);
      var btn = $('.km-gate-card__go', card);
      if (btn) btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }

  /* ---------- Role journey ---------- */

  function journeyStepsHtml() {
    var steps = KM.JOURNEY[role()];
    return '<div class="km-jr__steps" role="group" aria-label="Шаги пути">' + steps.map(function (s, i) {
      return '<button type="button" class="km-jr-step' + (i + 1 < state.step ? ' is-done' : '') + '" data-step="' + (i + 1) +
        '" aria-pressed="' + (i + 1 === state.step ? 'true' : 'false') + '" aria-controls="journey-stage">' +
        '<span class="km-jr-step__bar" aria-hidden="true"></span>' +
        '<span class="km-jr-step__label"><span class="km-mono km-jr-step__n">' + pad(i + 1) + '</span><span class="km-jr-step__t">' + s.t + '</span></span></button>';
    }).join('') + '</div>';
  }

  function journeyTextHtml() {
    var s = KM.JOURNEY[role()][state.step - 1];
    return '<div class="km-jr__text"><span class="km-mono km-jr__count">Шаг ' + pad(state.step) + ' из 04</span>' +
      '<h3>' + s.t + '</h3><p>' + s.d + '</p>' +
      '<div class="km-jr__chips">' + s.chips.map(function (c) { return '<span class="km-tag km-tag--line">' + c + '</span>'; }).join('') + '</div></div>';
  }

  function journeyNavHtml() {
    var cta;
    if (state.step < 4) {
      cta = '<button type="button" class="km-btn km-btn--secondary km-btn--sm" data-journey-next>Далее' + icon('arrow', 16) + '</button>';
    } else if (role() === 'advertiser') {
      cta = '<a href="' + CABINET_URL + '" class="km-btn km-btn--primary km-btn--sm">Войти в кабинет' + icon('arrow', 16) + '</a>';
    } else {
      cta = '<a href="#contact" class="km-btn km-btn--primary km-btn--sm">Монетизировать трафик' + icon('arrow', 16) + '</a>';
    }
    return '<div class="km-jr__nav"><button type="button" class="km-btn km-btn--ghost" data-journey-prev' + (state.step === 1 ? ' disabled' : '') + '>' +
      icon('arrow-left', 16) + 'Назад</button>' + cta + '</div>';
  }

  function journeyNarrowHtml() {
    var r = role();
    var steps = KM.JOURNEY[r];
    var items = steps.map(function (s, i) {
      var on = i + 1 === state.step;
      return '<li class="km-jr-tl__item' + (on ? ' is-on' : '') + (i + 1 < state.step ? ' is-done' : '') + '">' +
        '<div class="km-jr-tl__rail" aria-hidden="true"><span class="km-mono km-jr-tl__n">' + pad(i + 1) + '</span><span class="km-jr-tl__line"></span></div>' +
        '<div class="km-jr-tl__body">' +
        '<button type="button" class="km-jr-tl__btn" data-step="' + (i + 1) + '" aria-expanded="' + (on ? 'true' : 'false') + '" aria-controls="journey-m-' + (i + 1) + '">' +
        '<span class="km-sr-only">Шаг ' + pad(i + 1) + ': </span><span class="km-jr-tl__t">' + s.t + '</span>' +
        '<span class="km-jr-tl__d">' + (s.dShort || s.d) + '</span></button>' +
        (on ? '<div id="journey-m-' + (i + 1) + '" class="km-jr-tl__open"><div class="km-jr__chips">' +
          (s.chipsShort || s.chips).map(function (c) { return '<span class="km-tag km-tag--line">' + c + '</span>'; }).join('') +
          '</div>' + KM.journeyCard(r, state.step) + '</div>' : '') +
        '</div></li>';
    }).join('');
    var cta = r === 'advertiser'
      ? '<a href="' + CABINET_URL + '" class="km-btn km-btn--primary km-btn--block">Войти в кабинет</a>'
      : '<a href="#contact" class="km-btn km-btn--primary km-btn--block">Монетизировать трафик</a>';
    return '<div class="km-jr__narrow"><ol class="km-jr-tl">' + items + '</ol>' + cta + '</div>';
  }

  function renderJourney(initialOrRoleChange) {
    var root = $('[data-journey]');
    if (!root) return;

    if (!root.firstElementChild) {
      root.innerHTML =
        '<div class="km-jr__head"><div class="km-jr__title"><span class="km-eyebrow">Ваш путь</span>' +
        '<h2 id="journey-title" class="km-h2">' + KM.ROLE_TITLES[role()] + '</h2></div>' +
        '<a href="#roles" class="km-jr__change">' + icon('swap', 15) + 'Сменить роль</a></div>' +
        '<div class="km-jr__wide">' + journeyStepsHtml() +
        '<div id="journey-stage" class="km-jr__stage" aria-live="polite">' + journeyTextHtml() + journeyNavHtml() +
        '<div class="km-jr__scene" aria-hidden="true">' + KM.fit('', 800, 460, KM.journeyScene(role(), state.step)) + '</div></div></div>' +
        journeyNarrowHtml();
      initFits(root);
      return;
    }

    var r = role();
    var step = state.step;
    $('#journey-title').textContent = KM.ROLE_TITLES[r];
    morph($('.km-jr__steps', root), parse(journeyStepsHtml()));
    morph($('.km-jr__nav', root), parse(journeyNavHtml()));
    morph($('.km-jr__narrow', root), parse(journeyNarrowHtml()));

    var stage = $('.km-jr__stage', root);
    var inner = $('.km-jr__scene .km-fit__in', root);
    swap(function () { return $('.km-jr__text', stage); }, 'km-jr-fade', 220, 220, function () {
      var el = $('.km-jr__text', stage);
      if (el) el.replaceWith(parse(journeyTextHtml()));
    });
    swap(function () { return $('.km-js', inner); }, 'km-jr-fade', 220, 220, function () {
      inner.innerHTML = KM.journeyScene(r, step);
    });
  }

  function pickStep(n) {
    if (n === state.step || n < 1 || n > 4) return;
    state.step = n;
    renderJourney();
  }

  /* ---------- Formats ---------- */

  function formatDetailHtml() {
    var f = KM.FORMATS[state.format];
    return '<div class="km-fmt__detail-in"><div class="km-fmt__tags"><span class="km-tag km-tag--brand">' + f.env + '</span>' +
      '<span class="km-tag"><span class="km-fmt__pay-full">' + KM.PAY_MODEL[f.unit] + '</span><span class="km-fmt__pay-short">' + KM.PAY_MODEL_SHORT[f.unit] + '</span></span></div>' +
      '<h3>' + f.label + '</h3><p class="km-fmt__desc">' + f.desc + '</p>' +
      '<dl class="km-fmt__facts"><div><dt class="km-lbl">Где</dt><dd>' + f.where + '</dd></div>' +
      '<div><dt class="km-lbl">Подключение</dt><dd>' + f.integ + '</dd></div></dl>' +
      '<p class="km-fmt__fact">' + f.fact + '</p></div>';
  }

  function renderFormats() {
    var root = $('[data-formats]');
    if (!root) return;
    root.innerHTML =
      '<div class="km-fmt__head"><div class="km-fmt__title"><span class="km-eyebrow">Форматы</span>' +
      '<h2 id="formats-title" class="km-h2">Шесть рекламных форматов</h2></div>' +
      '<p class="km-lead">Формат выбирает владелец площадки при подключении — реклама показывается только в нём.</p></div>' +
      '<div class="km-fmt__rail" role="group" aria-label="Выбор формата">' + KM.FORMAT_KEYS.map(function (key) {
        var f = KM.FORMATS[key];
        return '<button type="button" class="km-fmt-btn" data-format="' + key + '" aria-pressed="' + (state.format === key ? 'true' : 'false') + '" aria-controls="format-detail">' +
          '<span class="km-fmt-btn__top"><i aria-hidden="true"></i><b class="km-fmt-btn__full">' + f.label + '</b><b class="km-fmt-btn__short">' + f.short + '</b></span>' +
          '<span class="km-fmt-btn__env km-fmt-btn__full">' + f.envShort + '</span>' +
          '<span class="km-fmt-btn__env km-fmt-btn__short">' + f.envMini + '</span></button>';
      }).join('') + '</div>' +
      '<div class="km-fmt__body"><div class="km-fmt__stage">' + KM.formatStage(state.format) + '</div>' +
      '<div id="format-detail" class="km-fmt__detail" aria-live="polite">' + formatDetailHtml() + '</div></div>';
    initFits(root);
  }

  function selectFormat(key) {
    if (key === state.format || !KM.FORMATS[key]) return;
    state.format = key;
    $$('[data-format]').forEach(function (btn) {
      btn.setAttribute('aria-pressed', btn.getAttribute('data-format') === key ? 'true' : 'false');
    });
    var fs = $('.km-fs', $('[data-formats]'));
    if (fs) fs.innerHTML = KM.formatScene(key);
    var detail = $('#format-detail');
    swap(function () { return $('.km-fmt__detail-in', detail); }, 'km-fmt-fade', 200, 250, function () {
      detail.innerHTML = formatDetailHtml();
    });
  }

  /* ---------- How it works ---------- */

  var howTimer = null;
  var howInView = false;

  function howListHtml() {
    return '<ol class="km-how__list" aria-label="Этапы">' + KM.HOW_STAGES.map(function (s, i) {
      return '<li><button type="button" class="km-how-btn' + (i + 1 < state.stage ? ' is-done' : '') + '" data-how-stage="' + (i + 1) + '" aria-pressed="' + (state.stage === i + 1 ? 'true' : 'false') + '">' +
        '<span class="km-mono km-how-btn__n">' + pad(i + 1) + '</span>' +
        '<span class="km-how-btn__text"><b>' + s.t + '</b><span>' + s.d + '</span></span></button></li>';
    }).join('') + '</ol>';
  }

  function howSegsHtml() {
    return '<div class="km-how__segs" role="group" aria-label="Этапы">' + KM.HOW_STAGES.map(function (s, i) {
      return '<button type="button" class="km-how-seg' + (i + 1 < state.stage ? ' is-done' : '') + '" data-how-stage="' + (i + 1) + '" aria-pressed="' + (state.stage === i + 1 ? 'true' : 'false') + '" aria-controls="how-detail">' +
        '<span class="km-mono km-how-btn__n">' + pad(i + 1) + '</span>' + s.short + '</button>';
    }).join('') + '</div>';
  }

  function howDetailHtml() {
    var s = KM.HOW_STAGES[state.stage - 1];
    return '<div id="how-detail" class="km-how__detail" aria-live="polite"><h3>' + s.t + '</h3><p>' + s.d + '</p></div>';
  }

  function renderHow() {
    var root = $('[data-how]');
    if (!root) return;
    root.innerHTML =
      '<div class="km-how__head"><div class="km-how__title"><span class="km-eyebrow">Как работает</span>' +
      '<h2 id="how-title" class="km-h2">Как Клик&nbsp;Медиа выбирает рекламное объявление</h2></div>' +
      '<p class="km-lead">Весь путь занимает доли секунды. Внутри работает собственная Ad Exchange-инфраструктура' +
      '<span class="km-how__lead-tail">: она соединяет кампании рекламодателей, внешний спрос и площадки</span>.</p></div>' +
      '<div class="km-how__body"><div class="km-how__side">' + howListHtml() +
      '<p class="km-how__hint">Выберите этап, чтобы рассмотреть его на схеме.</p></div>' + howSegsHtml() +
      '<div class="km-how__visual">' + KM.fit('km-how__scene', 840, 600, KM.howScene(state.stage)) + KM.howFlow(state.stage) + '</div>' +
      howDetailHtml() + '</div>';
    initFits(root);
  }

  // The scene is patched in place, so the CSS transitions between the stages play.
  function updateHow() {
    var root = $('[data-how]');
    if (!root) return;
    morph($('.km-how__list', root), parse(howListHtml()));
    morph($('.km-how__segs', root), parse(howSegsHtml()));
    morph($('.km-hw', root), parse(KM.howScene(state.stage)));
    morph($('.km-hf', root), parse(KM.howFlow(state.stage)));
    morph($('.km-how__detail', root), parse(howDetailHtml()));
  }

  function howStop() {
    if (howTimer !== null) {
      clearTimeout(howTimer);
      howTimer = null;
    }
  }

  // While the section is visible the scheme goes through the stages by itself.
  // The first click on a stage keeps the chosen one and stops this for good.
  function howSchedule() {
    howStop();
    if (state.pinned || reducedMotion() || !howInView || document.visibilityState === 'hidden') return;
    howTimer = setTimeout(function () {
      howTimer = null;
      state.stage = state.stage >= 4 ? 1 : state.stage + 1;
      updateHow();
      howSchedule();
    }, KM.HOW_STAGE_MS[state.stage - 1]);
  }

  function pickHowStage(n) {
    state.pinned = true;
    howStop();
    state.stage = n;
    updateHow();
  }

  function initHow() {
    renderHow();
    if (reducedMotion()) {
      state.stage = 4;
      updateHow();
    }
    var target = $('.km-how__in');
    if ('IntersectionObserver' in window && target) {
      new IntersectionObserver(function (entries) {
        howInView = entries.some(function (e) { return e.isIntersecting; });
        howSchedule();
      }, { threshold: 0.3 }).observe(target);
    } else {
      howInView = true;
      howSchedule();
    }
    document.addEventListener('visibilitychange', howSchedule);
  }

  /* ---------- Control ---------- */

  function renderControl(roleChange) {
    var root = $('[data-control]');
    if (!root) return;
    if (!root.firstElementChild) {
      root.innerHTML =
        '<div class="km-ctl__head"><div class="km-ctl__title"><span class="km-eyebrow">Контроль</span>' +
        '<h2 id="control-title" class="km-h2">Всё под контролем</h2></div>' +
        '<p class="km-lead" data-control-lead aria-live="polite">' + KM.CONTROL_LEAD[role()] + '</p></div>' +
        KM.controlComposition(role());
      initFits(root);
      return;
    }
    $('[data-control-lead]', root).textContent = KM.CONTROL_LEAD[role()];
    swap(function () { return $('.km-cp', root); }, 'km-ctl-in', 150, 450, function () {
      var old = $('.km-cp', root);
      var next = parse(KM.controlComposition(role()));
      if (old) old.replaceWith(next);
      initFits(next);
    });
  }

  /* ---------- Lead form (front-end demo: nothing is sent) ---------- */

  var METRIKA_ID = 113366123;
  var FIELDS = ['name', 'contact', 'project', 'message', 'consent'];

  function field(name) { return document.getElementById('lead-' + name); }

  function setError(name, message) {
    var input = field(name);
    if (!input) return;
    var box = input.closest('.km-field');
    var old = document.getElementById('lead-' + name + '-error');
    if (old) old.remove();
    if (message) {
      var p = document.createElement('p');
      p.id = 'lead-' + name + '-error';
      p.className = 'km-field__error';
      p.innerHTML = icon('alert', 15) + KM.esc(message);
      box.appendChild(p);
      input.setAttribute('aria-invalid', 'true');
      input.setAttribute('aria-describedby', p.id);
    } else {
      input.setAttribute('aria-invalid', 'false');
      input.removeAttribute('aria-describedby');
    }
  }

  function validate() {
    var errors = {};
    var name = field('name').value.trim();
    var contact = field('contact').value.trim();
    var project = field('project').value.trim();
    var message = field('message').value.trim();
    if (!name) errors.name = KM.FORM_MESSAGES.name;
    else if (name.length > 255) errors.name = 'Имя не должно превышать 255 символов';
    if (!contact) errors.contact = KM.FORM_MESSAGES.contact;
    else if (contact.length > 255) errors.contact = 'Контакт не должен превышать 255 символов';
    if (!project) errors.project = KM.FORM_MESSAGES.project;
    else if (project.length > 255) errors.project = 'Название проекта не должно превышать 255 символов';
    if (!message) errors.message = KM.FORM_MESSAGES.message;
    else if (message.length > 2000) errors.message = 'Сообщение не должно превышать 2000 символов';
    if (!field('consent').checked) errors.consent = KM.FORM_MESSAGES.consent;
    return errors;
  }

  function renderFormRole() {
    $$('[data-lead-role]').forEach(function (btn) {
      btn.setAttribute('aria-pressed', btn.getAttribute('data-lead-role') === state.formRole ? 'true' : 'false');
    });
    var lead = $('[data-contact-lead]');
    if (lead) lead.textContent = KM.LEAD_TEXT[state.formRole];
    var copy = KM.ROLE_COPY[state.formRole];
    var label = $('[data-project-label]');
    if (label) label.textContent = copy.projectLabel;
    var msg = field('message');
    if (msg) msg.placeholder = copy.messagePlaceholder;
  }

  function renderChannel() {
    var ch = KM.CHANNELS[state.channel];
    $$('[data-channel]').forEach(function (btn) {
      btn.setAttribute('aria-pressed', btn.getAttribute('data-channel') === state.channel ? 'true' : 'false');
    });
    var input = field('contact');
    input.type = ch.type;
    input.setAttribute('inputmode', ch.inputmode);
    input.setAttribute('autocomplete', ch.autocomplete);
    input.placeholder = ch.placeholder;
    input.setAttribute('aria-label', 'Контакт · ' + ch.label);
  }

  function showDone(done) {
    var form = $('#lead-form');
    var card = $('#lead-card');
    var box = $('.km-lf__done', card);
    state.sent = done;
    if (done) {
      if (!box) {
        box = parse('<div class="km-lf__done" role="status"><span class="km-lf__done-ic">' + icon('check', 30, 2.6) + '</span>' +
          '<h3 tabindex="-1">Заявка отправлена</h3>' +
          '<button type="button" class="km-btn km-btn--secondary km-btn--sm" data-lead-again>Отправить ещё одну</button></div>');
        card.appendChild(box);
      }
      form.hidden = true;
      box.hidden = false;
      $('h3', box).focus();
    } else {
      if (box) box.hidden = true;
      form.hidden = false;
      field('name').focus();
    }
  }

  function initForm() {
    var form = $('#lead-form');
    if (!form) return;

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var errors = validate();
      FIELDS.forEach(function (name) { setError(name, errors[name]); });
      var first = FIELDS.filter(function (name) { return errors[name]; })[0];
      if (first) {
        field(first).focus();
        return;
      }
      form.reset();
      renderChannel();
      renderFormRole();
      showDone(true);
      if (typeof window.ym === 'function') window.ym(METRIKA_ID, 'reachGoal', 'lead_form_success');
    });

    form.addEventListener('input', function (event) {
      var id = event.target.id || '';
      if (id.indexOf('lead-') === 0) setError(id.slice(5), null);
    });

    renderChannel();
    renderFormRole();
  }

  /* ---------- Mobile menu (modal) ---------- */

  var menu = { el: null, locked: false, lockedY: 0, returnFocus: null };

  function menuHtml() {
    var links = [
      ['#advertiser', 'Рекламодателям'],
      ['#publisher', 'Площадкам'],
      ['#formats', 'Форматы'],
      ['#how', 'Как работает']
    ].map(function (l) {
      return '<a href="' + l[0] + '" class="km-mnav__link">' + l[1] + icon('chevron') + '</a>';
    }).join('') + '<a href="' + BLOG_URL + '" class="km-mnav__link">Блог' + icon('chevron') + '</a>';
    return '<div class="km km-mnav"><div id="km-mobile-nav" class="km-mnav__panel" role="dialog" aria-modal="true" aria-labelledby="km-mobile-nav-title">' +
      '<div class="km-mnav__top"><span id="km-mobile-nav-title" class="km-mnav__title"><img src="./assets/icons/logo.svg" alt="" width="26" height="25">Меню</span>' +
      '<button type="button" class="km-mnav__close" aria-label="Закрыть меню">' + icon('close', 20) + '</button></div>' +
      '<nav class="km-mnav__links" aria-label="Мобильная навигация">' + links + '</nav>' +
      '<div class="km-mnav__actions"><a href="' + CABINET_URL + '" class="km-btn km-btn--primary km-btn--block">Войти в кабинет</a>' +
      '<a href="#contact" class="km-btn km-btn--secondary km-btn--block">Монетизировать трафик</a></div></div></div>';
  }

  // overflow:hidden is not reliable in mobile Safari: fix the body at the current scroll position.
  function lockScroll() {
    if (menu.locked) return;
    menu.locked = true;
    menu.lockedY = window.scrollY;
    var s = document.body.style;
    s.position = 'fixed';
    s.top = '-' + menu.lockedY + 'px';
    s.left = '0';
    s.right = '0';
    s.width = '100%';
  }

  function unlockScroll() {
    if (!menu.locked) return;
    menu.locked = false;
    var s = document.body.style;
    s.position = '';
    s.top = '';
    s.left = '';
    s.right = '';
    s.width = '';
    window.scrollTo({ top: menu.lockedY, left: 0, behavior: 'instant' });
  }

  function openMenu(burger) {
    if (menu.el) return;
    menu.returnFocus = burger;
    var el = parse(menuHtml());
    menu.el = el;
    document.body.appendChild(el);
    burger.setAttribute('aria-expanded', 'true');
    lockScroll();
    if (!reducedMotion()) {
      el.classList.add('km-modal-enter-from', 'km-modal-enter-active');
      void el.offsetWidth;
      el.classList.remove('km-modal-enter-from');
      setTimeout(function () { el.classList.remove('km-modal-enter-active'); }, 250);
    }
    $('.km-mnav__close', el).focus();
  }

  function closeMenu(restoreFocus) {
    var el = menu.el;
    if (!el) return;
    menu.el = null;
    unlockScroll();
    var burger = $('.km-header__burger');
    if (burger) burger.setAttribute('aria-expanded', 'false');
    if (reducedMotion()) {
      el.remove();
    } else {
      el.classList.add('km-modal-leave-active', 'km-modal-leave-to');
      setTimeout(function () { el.remove(); }, 250);
    }
    if (restoreFocus !== false && menu.returnFocus) menu.returnFocus.focus();
  }

  document.addEventListener('keydown', function (event) {
    if (!menu.el) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      closeMenu();
      return;
    }
    if (event.key !== 'Tab') return;
    var items = $$('a[href], button:not([disabled])', menu.el).filter(function (el) { return el.offsetParent !== null; });
    if (!items.length) return;
    var first = items[0];
    var last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  window.addEventListener('resize', function () {
    if (menu.el && window.innerWidth > MOBILE_MAX) closeMenu();
  });

  /* ---------- Cookie notice ---------- */

  function initCookie() {
    var visible = true;
    try { visible = !localStorage.getItem(COOKIE_KEY); } catch (e) { visible = false; }
    if (!visible) return;

    var el = parse('<div class="km km-cookie" role="region" aria-label="Согласие на использование cookie">' +
      '<p>Мы используем cookie для работы сайта и аналитики. Подробнее — в <a href="' + PRIVACY_URL + '" target="_blank" rel="noopener">политике конфиденциальности</a>.</p>' +
      '<div class="km-cookie__actions"><button type="button" class="km-btn km-btn--secondary km-btn--sm" data-cookie="rejected">Отклонить</button>' +
      '<button type="button" class="km-btn km-btn--primary km-btn--sm" data-cookie="accepted">Принять</button></div></div>');
    document.body.appendChild(el);
    if (!reducedMotion()) {
      el.classList.add('km-cookie-enter-from', 'km-cookie-enter-active');
      void el.offsetWidth;
      el.classList.remove('km-cookie-enter-from');
      setTimeout(function () { el.classList.remove('km-cookie-enter-active'); }, 250);
    }
    el.addEventListener('click', function (event) {
      var btn = event.target.closest('[data-cookie]');
      if (!btn) return;
      try { localStorage.setItem(COOKIE_KEY, btn.getAttribute('data-cookie')); } catch (e) { /* private mode */ }
      if (reducedMotion()) {
        el.remove();
      } else {
        el.classList.add('km-cookie-leave-active', 'km-cookie-leave-to');
        setTimeout(function () { el.remove(); }, 250);
      }
    });
  }

  /* ---------- clicks ---------- */

  document.addEventListener('click', function (event) {
    var target = event.target;

    var burger = target.closest('.km-header__burger');
    if (burger) {
      openMenu(burger);
      return;
    }
    if (menu.el) {
      if (target === menu.el || target.closest('.km-mnav__close')) {
        closeMenu();
        return;
      }
    }

    var link = target.closest('a[href^="#"]');
    if (link) {
      var id = link.getAttribute('href').slice(1);
      var known = ['advertiser', 'publisher', 'formats', 'how', 'roles', 'top', 'contact', 'journey'];
      if (known.indexOf(id) !== -1) {
        event.preventDefault();
        var fromMenu = !!link.closest('.km-mnav');
        if (fromMenu) closeMenu(false);
        var go = function () {
          if (isRole(id)) showRole(id);
          else if (id === 'contact') goToLeadForm('publisher');
          else scrollToSection(id);
        };
        // Close the menu and release the scroll lock first, then scroll.
        if (fromMenu) Promise.resolve().then(go);
        else go();
        return;
      }
    }

    var pick = target.closest('[data-pick-role]');
    if (pick) {
      setRole(pick.getAttribute('data-pick-role'));
      scrollToSection('journey');
      return;
    }

    var stepBtn = target.closest('[data-step]');
    if (stepBtn) {
      pickStep(parseInt(stepBtn.getAttribute('data-step'), 10));
      return;
    }
    if (target.closest('[data-journey-prev]')) {
      pickStep(state.step - 1);
      return;
    }
    if (target.closest('[data-journey-next]')) {
      pickStep(state.step + 1);
      return;
    }

    var fmtBtn = target.closest('.km-fmt-btn');
    if (fmtBtn) {
      selectFormat(fmtBtn.getAttribute('data-format'));
      return;
    }

    var howBtn = target.closest('[data-how-stage]');
    if (howBtn) {
      pickHowStage(parseInt(howBtn.getAttribute('data-how-stage'), 10));
      return;
    }

    var leadRole = target.closest('[data-lead-role]');
    if (leadRole) {
      setFormRole(leadRole.getAttribute('data-lead-role'));
      return;
    }

    var channel = target.closest('[data-channel]');
    if (channel) {
      state.channel = channel.getAttribute('data-channel');
      renderChannel();
      return;
    }

    if (target.closest('[data-lead-again]')) {
      showDone(false);
    }
  });

  // Arrow keys switch the format, like in a list of tabs.
  document.addEventListener('keydown', function (event) {
    var btn = event.target.closest && event.target.closest('.km-fmt-btn');
    if (!btn) return;
    var delta = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[event.key];
    if (!delta) return;
    event.preventDefault();
    var keys = KM.FORMAT_KEYS;
    var index = keys.indexOf(btn.getAttribute('data-format'));
    var next = (index + delta + keys.length) % keys.length;
    selectFormat(keys[next]);
    var nextBtn = btn.parentElement.children[next];
    if (nextBtn) nextBtn.focus();
  });

  /* ---------- start ---------- */

  function init() {
    renderJourney();
    renderFormats();
    initHow();
    renderControl();
    initForm();
    renderGateway();
    initFits(document);
    initCookie();

    var year = document.getElementById('current-year');
    if (year) year.textContent = new Date().getFullYear();

    // Role links from other pages end with "#advertiser" or "#publisher":
    // pick the role and show its path. Any other hash scrolls after the sections are built.
    var hash = window.location.hash.slice(1);
    var anchor = hash ? document.getElementById(isRole(hash) ? 'journey' : hash) : null;
    if (isRole(hash)) {
      setRole(hash);
      try { history.replaceState(history.state, '', '#journey'); } catch (e) { /* file:// or sandbox */ }
    }
    if (anchor) {
      var jump = function () { anchor.scrollIntoView({ behavior: 'auto', block: 'start' }); };
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { requestAnimationFrame(jump); });
      else requestAnimationFrame(jump);
    }
  }

  // The same links typed into an open page change only the hash.
  window.addEventListener('hashchange', function () {
    var hash = window.location.hash.slice(1);
    if (!isRole(hash)) return;
    showRole(hash);
    try { history.replaceState(history.state, '', '#journey'); } catch (e) { /* file:// or sandbox */ }
  });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
