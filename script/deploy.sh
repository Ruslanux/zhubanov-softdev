#!/usr/bin/env bash
# Собирает сайт локально и публикует его в ветку gh-pages.
#
# Settings -> Pages -> Source: "Deploy from a branch", ветка gh-pages, папка / (root).
# Когда на аккаунте работают GitHub Actions, можно вместо этого включить push-триггер
# в .github/workflows/pages.yml и выбрать Source: "GitHub Actions".
#
# Сайт на своём домене zhubanov-softdev.dev (файл CNAME), поэтому baseurl пустой.
set -euo pipefail

cd "$(dirname "$0")/.."

REPO_URL="$(git config --get remote.origin.url)"
BASEURL="${BASEURL-}"
BUILD_DIR="$(mktemp -d)"
trap 'rm -rf "$BUILD_DIR"' EXIT

echo "==> Сборка (baseurl: ${BASEURL:-/})"
JEKYLL_ENV=production bundle exec jekyll build --baseurl "$BASEURL" --destination "$BUILD_DIR/site"

# .nojekyll не даёт GitHub повторно прогонять Jekyll по уже собранным файлам.
touch "$BUILD_DIR/site/.nojekyll"
[ -f CNAME ] && cp CNAME "$BUILD_DIR/site/CNAME"

echo "==> Публикация в gh-pages"
AUTHOR_NAME="$(git config user.name || echo deploy)"
AUTHOR_EMAIL="$(git config user.email || echo deploy@local)"
cd "$BUILD_DIR/site"
git init -q -b gh-pages
git add -A
git -c user.name="$AUTHOR_NAME" -c user.email="$AUTHOR_EMAIL" \
    commit -q -m "Сборка сайта $(date -u '+%Y-%m-%d %H:%M UTC')"
git remote add origin "$REPO_URL"
git push -q -f origin gh-pages

echo "==> Готово. Обновление на сайте появится через минуту-другую."
