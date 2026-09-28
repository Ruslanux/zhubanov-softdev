// Разбор и проверка брифа, сборка письма. Без зависимостей от рантайма Cloudflare —
// тестируется обычным `node --test`.

export const LIMITS = {
  name: 120,
  company: 160,
  email: 200,
  phone: 40,
  industry: 120,
  timeline: 80,
  service: 80,
  message: 5000,
  consent: 400,
};

const LANGS = ["ru", "kk", "en"];
const EMAIL_RE = /^[^\s@<>()",;:\\[\]]+@[^\s@<>()",;:\\[\]]+\.[^\s@<>()",;:\\[\]]{2,}$/;

const clean = (v) => (typeof v === "string" ? v.replace(/\r\n?/g, "\n").trim() : "");
const oneLine = (v) => clean(v).replace(/[\u0000-\u001f\u007f]+/g, " ");

// Возвращает { brief } или { error: "код поля" }. Пустая ловушка для ботов — { spam: true }.
export function parseBrief(form) {
  if (clean(form.get("_gotcha"))) return { spam: true };

  const brief = {
    name: oneLine(form.get("name")),
    company: oneLine(form.get("company")),
    email: oneLine(form.get("email")),
    phone: oneLine(form.get("phone")),
    industry: oneLine(form.get("industry")),
    timeline: oneLine(form.get("timeline")),
    services: form.getAll("services[]").map(oneLine).filter(Boolean),
    message: clean(form.get("message")).replace(/[\u0000-\u0008\u000b-\u001f\u007f]+/g, ""),
    consent: oneLine(form.get("consent")),
    lang: LANGS.includes(form.get("lang")) ? form.get("lang") : "ru",
  };

  for (const key of ["name", "email", "message", "consent"]) {
    if (!brief[key]) return { error: key };
  }
  if (!EMAIL_RE.test(brief.email)) return { error: "email" };
  for (const key of ["name", "company", "email", "phone", "industry", "timeline", "message", "consent"]) {
    if (brief[key].length > LIMITS[key]) return { error: key };
  }
  if (brief.services.length > 20 || brief.services.some((s) => s.length > LIMITS.service)) {
    return { error: "services" };
  }
  return { brief };
}

export function briefText(b, now = new Date()) {
  const local = new Intl.DateTimeFormat("ru-RU", {
    timeZone: "Asia/Oral",
    dateStyle: "short",
    timeStyle: "short",
  }).format(now);
  const rows = [
    ["Имя", b.name],
    ["Компания", b.company],
    ["Email", b.email],
    ["Телефон", b.phone],
    ["Отрасль", b.industry],
    ["Сроки", b.timeline],
    ["Услуги", b.services.join(", ")],
    ["Язык страницы", b.lang],
  ].filter(([, v]) => v);

  return [
    "Новый бриф с сайта Zhubanov SoftDev.",
    "",
    ...rows.map(([k, v]) => `${k}: ${v}`),
    "",
    "Задача:",
    b.message,
    "",
    "—",
    `Согласие на обработку персональных данных: «${b.consent}»`,
    `Получено: ${local} (Уральск, UTC+5) / ${now.toISOString()}`,
    "Ответ на это письмо уйдёт отправителю брифа.",
  ].join("\n");
}

function utf8Base64(text) {
  const bytes = new TextEncoder().encode(text);
  let bin = "";
  for (let i = 0; i < bytes.length; i += 0x8000) {
    bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
  }
  return btoa(bin);
}

// RFC 2047: заголовок в UTF-8; части короткие, чтобы строки письма укладывались в 78 символов.
function encodeHeader(text) {
  if (/^[\x20-\x7e]*$/.test(text)) return text;
  const words = [];
  let chunk = "";
  for (const ch of text) {
    if (utf8Base64(chunk + ch).length > 44) {
      words.push(chunk);
      chunk = "";
    }
    chunk += ch;
  }
  if (chunk) words.push(chunk);
  return words.map((w) => `=?UTF-8?B?${utf8Base64(w)}?=`).join("\r\n ");
}

export function buildMime({ from, to, brief, now = new Date(), id = crypto.randomUUID() }) {
  const domain = from.split("@")[1];
  const subject = `Бриф с сайта: ${brief.name}${brief.company ? ` (${brief.company})` : ""}`;
  const body = utf8Base64(briefText(brief, now)).replace(/.{76}/g, "$&\r\n");
  return [
    `From: ${encodeHeader("Zhubanov SoftDev — бриф")}\r\n <${from}>`,
    `To: <${to}>`,
    `Reply-To: <${brief.email}>`,
    `Subject: ${encodeHeader(subject)}`,
    `Date: ${now.toUTCString().replace("GMT", "+0000")}`,
    `Message-ID: <${id}@${domain}>`,
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=utf-8",
    "Content-Transfer-Encoding: base64",
    "",
    body,
  ].join("\r\n");
}
