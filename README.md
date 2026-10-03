# KlikMedia static landing page

This folder contains a static copy of the KlikMedia landing page. It uses HTML, CSS, and JavaScript. It does not need Laravel, Vue, PHP, or a build step.

## Run it locally

Open `index.html` in a browser, or start any static file server in this folder. Keep the `assets` folder next to `index.html`.

## Files

- `index.html` — page markup (header, hero, role cards, contact form, footer).
- `script.js` — behavior: roles, journey steps, formats, "how it works" autoplay, form, mobile menu, cookie notice.
- `assets/js/data.js` — texts and data of the sections.
- `assets/js/scenes.js` — HTML templates of the 3D scenes (journey, formats, how it works, control).
- `assets/css/` — styles taken from the Laravel/Vue landing: `preflight.css` (Tailwind reset), `base.css`, `tokens.css`, `fonts.css`, `landing.css`, `site-components.css`. `site.css` has only small helpers.

## Publish with GitHub Pages

1. Push this repository to GitHub.
2. Open **Settings → Pages**.
3. Choose the `main` branch and the repository root folder.
4. Save the setting. GitHub Pages will show the published URL.

The page uses relative paths, so it also works when the repository name is part of the URL.

## Contact form

The form checks its fields in the browser. When they are valid, it shows **Заявка отправлена**. It does not send or save the form data. This is a front-end demo only.

## Yandex Metrika

No Metrika counter is installed. Add its script to `index.html` when you have the counter ID. Do not add the counter ID until it is ready to use.

## Source

The Laravel/Vue landing page (`resources/js/Components/Landing`, `Site`, and its CSS) is the content and design source. Markup, scene templates, texts, and styles are copied from it, so the static page looks and behaves the same.
