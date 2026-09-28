import { test } from "node:test";
import assert from "node:assert/strict";
import { parseBrief, briefText, buildMime } from "../src/brief.js";

const valid = () => {
  const f = new FormData();
  f.set("name", "Айгерим");
  f.set("company", "ТОО «Тест»");
  f.set("email", "client@example.kz");
  f.set("phone", "+7 700 000 0000");
  f.set("industry", "Здравоохранение");
  f.set("timeline", "Как можно скорее");
  f.append("services[]", "Разработка ПО");
  f.append("services[]", "Развёртывание и поддержка");
  f.set("message", "Нужна система записи.\r\nВторая строка.");
  f.set("consent", "Согласие на обработку ПД дано");
  f.set("lang", "kk");
  f.set("_gotcha", "");
  return f;
};

test("валидный бриф разбирается целиком", () => {
  const { brief, error } = parseBrief(valid());
  assert.equal(error, undefined);
  assert.equal(brief.name, "Айгерим");
  assert.deepEqual(brief.services, ["Разработка ПО", "Развёртывание и поддержка"]);
  assert.equal(brief.message, "Нужна система записи.\nВторая строка.");
  assert.equal(brief.lang, "kk");
});

test("обязательные поля и согласие", () => {
  for (const key of ["name", "email", "message", "consent"]) {
    const f = valid();
    f.delete(key);
    assert.equal(parseBrief(f).error, key, key);
  }
});

test("некорректный email и лишняя длина отклоняются", () => {
  for (const bad of ["no-at", "a@b", "a b@c.kz", "x@y.kz\r\nBcc: evil@z.com", "<x@y.kz>"]) {
    const f = valid();
    f.set("email", bad);
    assert.equal(parseBrief(f).error, "email", bad);
  }
  const f = valid();
  f.set("message", "x".repeat(5001));
  assert.equal(parseBrief(f).error, "message");
});

test("заполненная ловушка — спам", () => {
  const f = valid();
  f.set("_gotcha", "http://spam");
  assert.deepEqual(parseBrief(f), { spam: true });
});

test("неизвестный язык → ru", () => {
  const f = valid();
  f.set("lang", "__proto__");
  assert.equal(parseBrief(f).brief.lang, "ru");
});

test("переводы строк в имени не попадают в заголовки письма", () => {
  const f = valid();
  f.set("name", "Имя\r\nBcc: evil@example.com");
  const { brief } = parseBrief(f);
  const mime = buildMime({ from: "brief@zhubanov-softdev.dev", to: "me@example.com", brief, id: "t" });
  const headers = mime.split("\r\n\r\n")[0];
  assert.doesNotMatch(headers, /^Bcc:/m);
  for (const line of headers.split("\r\n")) assert.ok(line.length <= 78, line);
});

test("письмо: заголовки и тело декодируются обратно", () => {
  const { brief } = parseBrief(valid());
  const now = new Date("2026-09-29T05:30:00Z");
  const mime = buildMime({ from: "brief@zhubanov-softdev.dev", to: "me@example.com", brief, now, id: "abc" });
  const [head, body] = mime.split("\r\n\r\n");
  assert.match(head, /^Reply-To: <client@example\.kz>$/m);
  assert.match(head, /^Message-ID: <abc@zhubanov-softdev\.dev>$/m);
  assert.match(head, /^Date: Tue, 29 Sep 2026 05:30:00 \+0000$/m);
  const subject = head.match(/^Subject: ([\s\S]*?)\r\n(?=\S)/m)[1]
    .split(/\r\n /)
    .map((w) => Buffer.from(w.match(/^=\?UTF-8\?B\?(.*)\?=$/)[1], "base64").toString("utf8"))
    .join("");
  assert.equal(subject, "Бриф с сайта: Айгерим (ТОО «Тест»)");
  const text = Buffer.from(body.replace(/\r\n/g, ""), "base64").toString("utf8");
  assert.equal(text, briefText(brief, now));
  assert.match(text, /Услуги: Разработка ПО, Развёртывание и поддержка/);
  assert.match(text, /Получено: 29\.09\.2026, 10:30 \(Уральск, UTC\+5\)/);
});
