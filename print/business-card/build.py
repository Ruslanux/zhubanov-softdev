#!/usr/bin/env python3
"""Сборка визитки Zhubanov SoftDev для типографии.

    python3 print/business-card/build.py

Результат в print/business-card/out/:
  vizitka_90x50_4+4_CMYK.pdf — файл для печати: 2 страницы (1 — лицо, 2 — оборот),
                               94×54 мм (вылеты по 2 мм), TrimBox 90×50, CMYK, текст в кривых,
                               QR-код чистым чёрным K100
  preview.png                — как визитка выглядит после резки (обе стороны)
  preview_guides.png         — с вылетами: красная линия — рез, зелёная — безопасная зона
  card.html                  — вёрстка с подставленными данными (для правок в браузере)
  ТЗ_для_типографии.txt      — требования к печати; отдаётся в типографию вместе с PDF

Конвейер: HTML → Chrome (RGB PDF, лист 96×56 с запасом, потому что Chrome округляет
формат) → Ghostscript: RGB→CMYK по ICC-профилю, текст в кривые, точная обрезка до 94×54,
TrimBox/BleedBox, QR поверх в DeviceCMYK 0/0/0/100.

Нужны: google-chrome, ghostscript (gs), poppler-utils (pdfinfo, pdftoppm),
python3-qrcode, Pillow.
"""
import html
import pathlib
import subprocess
import tempfile

import qrcode
from PIL import Image, ImageDraw, ImageFilter

HERE = pathlib.Path(__file__).resolve().parent
OUT = HERE / "out"

# Данные визитки — правятся здесь.
CARD = {
    "NAME": "Руслан Жубанов",
    "ROLE": "Основатель · Applied AI Engineer",
    "PHONE": "+7 777 419 7502",
    "EMAIL": "zhubanov1090@gmail.com",
    "TELEGRAM": "@Ruslanux",
    "SITE_TEXT": "zhubanov-softdev.dev",
    "CITY": "Уральск, Казахстан",
    "LEGAL": "ИП Жубанов Р. Ж.",
    "QR_CAPTION": "Сайт компании",
}
QR_URL = "https://zhubanov-softdev.dev/"

MM = 72 / 25.4                      # пунктов в миллиметре
BLEED, TRIM_W, TRIM_H = 2, 90, 50   # мм
PAGE_W, PAGE_H = TRIM_W + 2 * BLEED, TRIM_H + 2 * BLEED
SHEET_MARGIN = 1                    # запас листа Chrome вокруг .page, мм (см. card.template.html)
# Положение QR на обороте, мм от левого верхнего угла страницы 94×54 (совпадает с CSS .qr-box:
# right 7, top 7.2, ширина 22, внутренний отступ 1.6).
QR_LEFT, QR_TOP, QR_SIZE = PAGE_W - 7 - 22 + 1.6, 7.2 + 1.6, 22 - 2 * 1.6


def qr_matrix(data: str) -> list:
    qr = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_M, border=0)
    qr.add_data(data)
    qr.make(fit=True)
    return qr.get_matrix()


def qr_svg(matrix: list) -> str:
    """QR для превью в браузере (в печатный PDF QR рисует Ghostscript сразу в K100)."""
    n = len(matrix)
    parts = [f"M{x} {y}h1v1h-1z" for y, row in enumerate(matrix) for x, on in enumerate(row) if on]
    return (f'<svg viewBox="0 0 {n} {n}" shape-rendering="crispEdges" aria-hidden="true">'
            f'<path fill="#000000" d="{"".join(parts)}"/></svg>')


def qr_postscript(matrix: list) -> str:
    """Модули QR как прямоугольники в координатах страницы 94×54 (пт), по горизонтальным сериям."""
    n = len(matrix)
    s = QR_SIZE * MM / n
    x0, y_top = QR_LEFT * MM, (PAGE_H - QR_TOP) * MM
    rects = []
    for r, row in enumerate(matrix):
        c = 0
        while c < n:
            if row[c]:
                start = c
                while c < n and row[c]:
                    c += 1
                # +0.02 пт по высоте — без просветов между рядами в экранных просмотрщиках
                rects.append(f"{x0 + start * s:.3f} {y_top - (r + 1) * s:.3f} {(c - start) * s:.3f} {s + 0.02:.3f} rectfill")
            else:
                c += 1
    return "\n".join(rects)


def render_html(body_class: str, matrix: list, with_qr: bool) -> str:
    page = (HERE / "card.template.html").read_text(encoding="utf-8")
    for key, value in CARD.items():
        page = page.replace("{{" + key + "}}", html.escape(value))
    page = page.replace("{{QR_SVG}}", qr_svg(matrix) if with_qr else "")
    return page.replace("{{BODY_CLASS}}", body_class)


def chrome_pdf(html_path: pathlib.Path, pdf_path: pathlib.Path) -> None:
    subprocess.run([
        "google-chrome", "--headless=new", "--disable-gpu", "--no-sandbox",
        "--no-pdf-header-footer", "--virtual-time-budget=8000",
        f"--print-to-pdf={pdf_path}", html_path.as_uri(),
    ], check=True, capture_output=True)


def pdf_page_height(pdf: pathlib.Path) -> float:
    info = subprocess.run(["pdfinfo", str(pdf)], check=True, capture_output=True, text=True).stdout
    line = next(l for l in info.splitlines() if l.startswith("Page size:"))
    return float(line.split()[4])


def to_print_pdf(src: pathlib.Path, dst: pathlib.Path, matrix: list, workdir: pathlib.Path) -> None:
    """CMYK по ICC (с генерацией чёрного), текст в кривых, обрезка до 94×54, TrimBox, QR в K100."""
    w, h, b = PAGE_W * MM, PAGE_H * MM, BLEED * MM
    # Сдвиг листа Chrome так, чтобы .page легла ровно в 94×54 (начало координат PDF — снизу слева).
    dx = SHEET_MARGIN * MM
    dy = pdf_page_height(src) - (SHEET_MARGIN + PAGE_H) * MM
    setup = workdir / "setup.ps"
    # Счётчик страниц свой: PDF-интерпретатор перед каждой страницей заново вызывает
    # setpagedevice (системный count сбрасывается) и выполняет страницу внутри save/restore,
    # поэтому счётчик живёт в globaldict — restore глобальную память не откатывает.
    setup.write_text(f"""%!PS
globaldict /zsPage 0 put
<<
  /BeginPage {{
    pop
    [/TrimBox [{b:.3f} {b:.3f} {w - b:.3f} {h - b:.3f}] /BleedBox [0 0 {w:.3f} {h:.3f}] /PAGE pdfmark
    {-dx:.3f} {-dy:.3f} translate
  }}
  /EndPage {{
    % count reason -> bool; QR рисуем только на второй странице (оборот) при обычном showpage
    exch pop 0 eq dup {{
      globaldict /zsPage get 1 eq {{
        gsave initmatrix 0 0 0 1 setcmykcolor
{qr_postscript(matrix)}
        grestore
      }} if
      globaldict /zsPage globaldict /zsPage get 1 add put
    }} if
  }}
>> setpagedevice
""", encoding="utf-8")
    subprocess.run([
        "gs", "-q", "-dBATCH", "-dNOPAUSE", "-dSAFER",
        "-sDEVICE=pdfwrite", "-dCompatibilityLevel=1.6", "-dPDFSETTINGS=/prepress",
        "-dNoOutputFonts",
        "-sColorConversionStrategy=CMYK", "-dProcessColorModel=/DeviceCMYK",
        f"-dDEVICEWIDTHPOINTS={w:.3f}", f"-dDEVICEHEIGHTPOINTS={h:.3f}", "-dFIXEDMEDIA",
        f"-sOutputFile={dst}", str(setup), "-f", str(src),
    ], check=True)


def rasterize(pdf: pathlib.Path, prefix: pathlib.Path, dpi: int = 300) -> list:
    subprocess.run(["pdftoppm", "-r", str(dpi), "-png", str(pdf), str(prefix)], check=True)
    return sorted(prefix.parent.glob(prefix.name + "-*.png"))


def compose_preview(pages: list, dst: pathlib.Path, crop_mm: float, rounded: bool, dpi: int = 300) -> None:
    """Обе стороны рядом на светлом фоне; crop_mm — сколько срезать с каждого края."""
    px = dpi / 25.4
    cards = []
    for p in pages:
        im = Image.open(p).convert("RGB")
        c = round(crop_mm * px)
        im = im.crop((c, c, im.width - c, im.height - c))
        if rounded:
            mask = Image.new("L", im.size, 0)
            ImageDraw.Draw(mask).rounded_rectangle((0, 0, im.width - 1, im.height - 1), radius=round(1.2 * px), fill=255)
            im.putalpha(mask)
        cards.append(im)
    pad, gap = round(12 * px), round(10 * px)
    cw, ch = cards[0].size
    canvas = Image.new("RGB", (pad * 2 + cw * 2 + gap, pad * 2 + ch), "#e9edf3")
    for i, card in enumerate(cards):
        x, y = pad + i * (cw + gap), pad
        if rounded:
            shadow = Image.new("L", canvas.size, 0)
            ImageDraw.Draw(shadow).rounded_rectangle((x + 6, y + 18, x + cw + 6, y + ch + 18), radius=round(1.2 * px), fill=120)
            shadow = shadow.filter(ImageFilter.GaussianBlur(28))
            canvas.paste(Image.new("RGB", canvas.size, "#9aa5b8"), (0, 0), shadow)
            canvas.paste(card, (x, y), card)
        else:
            canvas.paste(card, (x, y))
    canvas.thumbnail((2400, 2400))
    canvas.save(dst, optimize=True)


PRINT_SPEC = """ВИЗИТКА Zhubanov SoftDev — техническое задание для типографии
==============================================================

Файл для печати:  vizitka_90x50_4+4_CMYK.pdf

Формат после резки   90 × 50 мм, горизонтальная
Размер страниц PDF   94 × 54 мм — вылеты по 2 мм с каждой стороны;
                     линия реза задана в файле (TrimBox 90 × 50), меток реза нет
Страницы             1 — лицевая сторона, 2 — оборотная
Красочность          4+4 (двусторонняя полноцветная), обе стороны в одной ориентации
Цвет                 CMYK; тексты переведены в кривые; прозрачностей нет;
                     максимальная сумма красок 291 %
Безопасная зона      все тексты и значимые элементы не ближе 5 мм от линии реза

Рекомендации
- Бумага: мелованная матовая или дизайнерская, 300–350 г/м².
- Отделка: матовая или soft-touch ламинация с двух сторон. Фон — тёмная плашка
  на всю площадь; без ламинации на ней остаются царапины и отпечатки, а на рубке
  возможна «белая кромка».
- Углы: прямые или скругление R 3 мм — по желанию заказчика.
- QR-код на обороте напечатан чистым чёрным (K100) на белой подложке и ведёт на
  {qr_url} — пожалуйста, проверьте сканирование на пробном оттиске.
- Тёмный фон: перед тиражом желательна цветопроба или пробный оттиск.

Контакт по макету: +7 777 419 7502, zhubanov1090@gmail.com
"""


def main() -> None:
    OUT.mkdir(exist_ok=True)
    matrix = qr_matrix(QR_URL)
    with tempfile.TemporaryDirectory() as tmp:
        tmp = pathlib.Path(tmp)
        (tmp / "print.html").write_text(render_html("", matrix, with_qr=False), encoding="utf-8")
        (tmp / "guides.html").write_text(render_html("guides", matrix, with_qr=True), encoding="utf-8")
        chrome_pdf(tmp / "print.html", tmp / "print-rgb.pdf")
        chrome_pdf(tmp / "guides.html", tmp / "guides-rgb.pdf")

        final_pdf = OUT / "vizitka_90x50_4+4_CMYK.pdf"
        to_print_pdf(tmp / "print-rgb.pdf", final_pdf, matrix, tmp)
        compose_preview(rasterize(final_pdf, tmp / "final"), OUT / "preview.png", crop_mm=BLEED, rounded=True)
        compose_preview(rasterize(tmp / "guides-rgb.pdf", tmp / "guides"), OUT / "preview_guides.png",
                        crop_mm=SHEET_MARGIN, rounded=False)
    (OUT / "card.html").write_text(render_html("", matrix, with_qr=True), encoding="utf-8")
    (OUT / "ТЗ_для_типографии.txt").write_text(PRINT_SPEC.format(qr_url=QR_URL), encoding="utf-8")
    print("готово:", *sorted(p.name for p in OUT.iterdir()))


if __name__ == "__main__":
    main()
