# Zhubanov SoftDev — сайт компании

Сайт ИП Жубанов Р. Ж.: разработка ПО на заказ и прикладной ИИ.
Три языка (қазақша, русский, English), тёмная тема по умолчанию, Jekyll 4 + GitHub Pages.

## Структура

| Путь | Что там |
| --- | --- |
| `index.html`, `services/`, `industries/`, `projects/`, `about/`, `contact/` | русская версия (корень сайта) |
| `kk/…`, `en/…` | казахская и английская версии — те же страницы |
| `_data/<язык>/ui.yml` | все тексты интерфейса и страниц: меню, hero, «О компании», форма, подвал |
| `_data/<язык>/services.yml` | 8 услуг |
| `_data/<язык>/industries.yml` | 14 отраслей (`id` одинаковые во всех языках) |
| `_data/<язык>/process.yml`, `principles.yml`, `faq.yml` | этапы работы, принципы, частые вопросы |
| `_data/stack.yml` | технологии (не переводятся) |
| `_projects/<язык>/<slug>.md` | кейсы: по файлу на язык, имя файла = адрес страницы |
| `_layouts/`, `_includes/` | шаблоны; `_includes/icon.html` — набор SVG-иконок |
| `assets/css/main.scss`, `assets/js/main.js` | стили (цвета — переменные в начале файла) и скрипты |
| `assets/img/` | логотип, favicon, картинка для соцсетей `og.png` |

Страницы в `kk/`, `en/` и корне — это заглушки из нескольких строк (`layout`, `title`,
`description`); весь текст берётся из `_data/<язык>/`.

## Контакты и форма

Правятся в `_config.yml`, блок `contact`: email, телефон, WhatsApp, Telegram, GitHub.
Пустое значение — блок на сайте не показывается. `legal.iin` — ИИН для подвала.

Форма брифа отправляется на обработчик `forms.endpoint` — Cloudflare Worker из папки
[`worker/`](worker/README.md), который пересылает бриф письмом на почту. Если `forms.endpoint`
пустой, форма по-старому открывает почтовый клиент посетителя с готовым письмом.

## Сертификаты

Раздел «Сертификаты» (страница на трёх языках, блок в «О компании», ссылка в подвале, schema.org)
появляется автоматически, когда в `_data/certificates.yml` есть запись с `published: true`.
Порядок и образец записи — в комментарии в начале этого файла. Статус «Действует» / «Срок истёк»
вычисляется по дате окончания при каждой сборке сайта.

## Как добавить проект

Создайте три файла с одинаковым именем, например `new-crm.md`:
`_projects/ru/new-crm.md`, `_projects/kk/new-crm.md`, `_projects/en/new-crm.md`.
Проще всего скопировать существующий кейс и поправить поля:

```yaml
title: …            # заголовок
client: …           # обезличенное описание заказчика
description: …      # короткое описание (карточка и SEO)
industries: [fintech, govtech]   # id из industries.yml, первый — основной
status: ready       # live | ready | pilot | concept
order: 20           # порядок в списке
featured: false     # true — показывать на главной (первые 6)
stack: [Ruby on Rails, PostgreSQL]
metrics:            # 2–3 цифры; value всегда в кавычках
  - { value: "99 %", label: … }
challenge: …
solution: [ …, … ]
results: [ …, … ]
deliverables: [ … ]  # необязательно
```

Отрасли, счётчики и фильтры пересчитываются сами.

## Локальный запуск

```bash
bundle install
bundle exec jekyll serve      # http://127.0.0.1:4000/
```

## Публикация на GitHub Pages (бесплатно)

1. Создайте репозиторий `zhubanov-softdev` и отправьте в него код:

   ```bash
   git init -b main && git add -A && git commit -m "Сайт Zhubanov SoftDev"
   gh repo create zhubanov-softdev --public --source=. --push
   ```

2. Опубликуйте сборку в ветку `gh-pages`:

   ```bash
   script/deploy.sh
   ```

3. В репозитории: **Settings → Pages → Source: Deploy from a branch → `gh-pages` / root**.
   Сайт открывается по адресу **https://zhubanov-softdev.dev** (старый адрес
   `ruslanux.github.io/zhubanov-softdev/` перенаправляет на него).

Повторная публикация после правок — снова `script/deploy.sh`.

Если GitHub Actions на аккаунте доступны, можно обойтись без скрипта: включите
push-триггер в `.github/workflows/pages.yml` и выберите **Source: GitHub Actions**.

### Домен zhubanov-softdev.dev

Домен куплен в Cloudflare Registrar, DNS — в Cloudflare. Все записи в режиме **DNS only**
(серое облако): через прокси Cloudflare GitHub не выпустит HTTPS-сертификат, а зона `.dev`
открывается только по HTTPS.

| Type | Name | Content |
| --- | --- | --- |
| A | `@` | `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` |
| AAAA | `@` | `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153` |
| CNAME | `www` | `ruslanux.github.io` |
| TXT | `_github-pages-challenge-Ruslanux` | код подтверждения из GitHub → Settings → Pages |

В репозитории — файл `CNAME` с `zhubanov-softdev.dev`, в `_config.yml` — `url` домена и пустой
`baseurl`. В настройках Pages включено **Enforce HTTPS**.
