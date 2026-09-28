import { EmailMessage } from "cloudflare:email";
import { parseBrief, buildMime } from "./brief.js";

const MAX_BODY = 64 * 1024;

// Ответ для отправки формы без JavaScript: браузер переходит на эту страницу.
const PAGE = {
  ru: { ok: "Спасибо! Бриф отправлен — мы ответим в течение одного рабочего дня.", err: "Не удалось отправить бриф. Вернитесь назад, проверьте поля или напишите нам на почту.", back: "Вернуться на сайт", path: "" },
  kk: { ok: "Рақмет! Бриф жіберілді — бір жұмыс күні ішінде жауап береміз.", err: "Брифті жіберу мүмкін болмады. Артқа оралып, өрістерді тексеріңіз немесе бізге поштаға жазыңыз.", back: "Сайтқа оралу", path: "/kk" },
  en: { ok: "Thank you! Your brief has been sent — we will reply within one business day.", err: "The brief could not be sent. Go back and check the fields, or email us directly.", back: "Back to the website", path: "/en" },
};

function page(lang, ok, origin, status) {
  const p = Object.hasOwn(PAGE, lang) ? PAGE[lang] : PAGE.ru;
  const home = origin ? `${origin}${p.path}/contact/` : "/";
  const html = `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>Zhubanov SoftDev</title><style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#070b14;color:#e6ebf5;font:18px/1.5 system-ui,sans-serif;padding:16px}main{max-width:32rem}a{color:#38bdf8}</style></head><body><main><p>${ok ? p.ok : p.err}</p><p><a href="${home}">${p.back}</a></p></main></body></html>`;
  return new Response(html, { status, headers: { "Content-Type": "text/html; charset=utf-8" } });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin") || "";
    const allowed = env.ALLOWED_ORIGINS.split(",").map((s) => s.trim());
    const okOrigin = allowed.includes(origin);
    const cors = okOrigin ? { "Access-Control-Allow-Origin": origin, Vary: "Origin" } : { Vary: "Origin" };
    const wantsJson = (request.headers.get("Accept") || "").includes("application/json");

    const reply = (status, payload, lang = "ru") =>
      wantsJson
        ? Response.json(payload, { status, headers: cors })
        : page(lang, payload.ok, okOrigin ? origin : "", status);

    if (url.pathname !== "/brief") return new Response("Not found", { status: 404 });
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: { ...cors, "Access-Control-Allow-Methods": "POST", "Access-Control-Allow-Headers": "Content-Type", "Access-Control-Max-Age": "86400" },
      });
    }
    if (request.method !== "POST") return new Response("Method not allowed", { status: 405, headers: { Allow: "POST" } });
    if (!okOrigin) return reply(403, { ok: false, error: "origin" });

    const type = request.headers.get("Content-Type") || "";
    if (!/^(multipart\/form-data|application\/x-www-form-urlencoded)/.test(type)) {
      return reply(415, { ok: false, error: "type" });
    }
    if (Number(request.headers.get("Content-Length") || 0) > MAX_BODY) return reply(413, { ok: false, error: "size" });

    if (env.LIMITER) {
      const { success } = await env.LIMITER.limit({ key: request.headers.get("CF-Connecting-IP") || "unknown" });
      if (!success) return reply(429, { ok: false, error: "rate" });
    }

    let form;
    try {
      form = await request.formData();
    } catch {
      return reply(400, { ok: false, error: "form" });
    }
    const { brief, error, spam } = parseBrief(form);
    const lang = Object.hasOwn(PAGE, form.get("lang")) ? form.get("lang") : "ru";
    // Бот заполнил скрытое поле: отвечаем «успешно», чтобы не подсказывать ему, но ничего не отправляем.
    if (spam) return reply(200, { ok: true });
    if (error) return reply(400, { ok: false, error }, lang);

    try {
      const raw = buildMime({ from: env.MAIL_FROM, to: env.MAIL_TO, brief });
      await env.MAILER.send(new EmailMessage(env.MAIL_FROM, env.MAIL_TO, raw));
    } catch (e) {
      // В журнал — только текст ошибки, без данных брифа.
      console.error("send failed:", e && e.message);
      return reply(502, { ok: false, error: "send" }, lang);
    }
    return reply(200, { ok: true }, lang);
  },
};
