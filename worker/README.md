# Приём брифов с сайта

Форма на `/contact/` → `POST https://api.zhubanov-softdev.dev/brief` → этот Cloudflare Worker →
письмо на `zhubanov1090@gmail.com` через Cloudflare Email Routing. «Ответить» в письме пишет клиенту
(заголовок `Reply-To`). Бриф нигде не хранится: Worker только пересылает его.

Бесплатно: Workers Free — 100 000 запросов в сутки, Email Routing — без платы.

## Файлы

| Файл | Что внутри |
| --- | --- |
| `wrangler.toml` | имя, домен `api.zhubanov-softdev.dev`, адреса, привязки отправки почты и лимита |
| `src/index.js` | HTTP: проверка Origin, типа и размера запроса, лимит, ответы JSON или HTML |
| `src/brief.js` | разбор и проверка полей, текст и MIME письма (без зависимостей от Cloudflare) |
| `test/brief.test.js` | тесты `node --test` |

## Защита

- принимаются только запросы с `Origin` из `ALLOWED_ORIGINS`;
- только `multipart/form-data` или `application/x-www-form-urlencoded`, не больше 64 КБ;
- не больше 5 брифов в минуту с одного IP (счётчик Cloudflare, IP не сохраняется);
- скрытое поле-ловушка `_gotcha`: бот получает «успешно», письмо не отправляется;
- обязательные поля (имя, email, задача, согласие), проверка email и длины полей;
- переводы строк вырезаются из полей, попадающих в заголовки письма;
- отправка возможна только на адрес из `destination_address`;
- в журнал пишется только текст ошибки, без данных брифа; постоянные логи (`observability`) выключены.

## Первое развёртывание

1. **Email Routing.** Cloudflare → `zhubanov-softdev.dev` → Email → Email Routing → включить
   (Cloudflare сам добавит записи MX и SPF). В «Destination addresses» добавить
   `zhubanov1090@gmail.com` и подтвердить по ссылке из письма.
2. **Вход:** `npx wrangler login` (откроется браузер).
3. **Выкладка:** в этой папке `npm install`, затем `npm run deploy`. Wrangler создаст Worker `zs-brief`
   и домен `api.zhubanov-softdev.dev` с сертификатом.
4. **Сайт:** в `_config.yml` указать `forms.endpoint: "https://api.zhubanov-softdev.dev/brief"`,
   закоммитить и выполнить `script/deploy.sh`.

Проверка после выкладки: отправить бриф на сайте — письмо «Бриф с сайта: …» придёт в течение минуты.
Живой журнал ошибок: `npx wrangler tail`.

## Локальная проверка

```sh
npm test                 # тесты разбора и сборки письма
npm run dev              # Worker на http://localhost:8787, разрешён Origin http://127.0.0.1:4000
```

В `wrangler dev` отправка почты не настоящая: письмо сохраняется в `.wrangler/tmp/email/…/*.eml`,
путь печатается в консоли. Сайт для проверки собирается с дополнительным конфигом, где
`forms.endpoint: "http://localhost:8787/brief"` и `url: "http://127.0.0.1:4000"`.

## Изменения

- **Другой адрес получателя:** `MAIL_TO` и `destination_address` в `wrangler.toml`, адрес подтвердить
  в Email Routing, затем `npm run deploy`.
- **Ещё один домен сайта:** добавить его в `ALLOWED_ORIGINS` через запятую.
- **Поля формы:** `_layouts/contact.html` на сайте и `parseBrief` / `briefText` в `src/brief.js`.
