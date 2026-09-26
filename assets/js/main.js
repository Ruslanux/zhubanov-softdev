(function () {
  "use strict";

  window.__zsReady = true;
  var root = document.documentElement;
  var body = document.body;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Тема: тёмная по умолчанию, выбор запоминается ---------- */
  var themeMeta = document.querySelector('meta[name="theme-color"]');
  function syncThemeColor() {
    if (themeMeta) themeMeta.setAttribute("content", root.getAttribute("data-theme") === "light" ? "#f5f7fb" : "#070b14");
  }
  syncThemeColor();
  document.querySelectorAll("[data-theme-toggle]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
      syncThemeColor();
    });
  });

  /* ---------- Шапка ---------- */
  var header = document.querySelector("[data-header]");
  function onScroll() {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Мобильное меню ---------- */
  var navToggle = document.querySelector("[data-nav-toggle]");
  var nav = document.querySelector("[data-nav]");
  function setNav(open) {
    body.classList.toggle("nav-open", open);
    if (!navToggle) return;
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? navToggle.dataset.labelClose : navToggle.dataset.labelOpen);
  }
  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      setNav(!body.classList.contains("nav-open"));
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setNav(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && body.classList.contains("nav-open")) {
        setNav(false);
        navToggle.focus();
      }
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 980 && body.classList.contains("nav-open")) setNav(false);
    });
  }

  /* ---------- Появление блоков и счётчики ---------- */
  var numberLocale = root.lang === "en" ? "en-US" : "ru-RU";
  function formatNumber(n) {
    return new Intl.NumberFormat(numberLocale).format(n);
  }
  function runCounter(el) {
    var target = parseFloat(el.dataset.count);
    if (!isFinite(target) || reduceMotion) return;
    var suffix = el.dataset.suffix || "";
    var duration = 1300;
    var start = null;
    function frame(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = formatNumber(Math.round(target * eased)) + suffix;
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  var revealEls = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));
  var counters = Array.prototype.slice.call(document.querySelectorAll("[data-count]"));

  if ("IntersectionObserver" in window && !reduceMotion) {
    revealEls.forEach(function (el) {
      var siblings = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
      el.style.transitionDelay = (siblings % 4) * 70 + "ms";
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        el.classList.add("is-visible");
        if (el.hasAttribute("data-count")) runCounter(el);
        io.unobserve(el);
        // После появления задержка мешает ховеру — снимаем её.
        setTimeout(function () { el.style.transitionDelay = ""; }, 1000);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
    counters.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Переход по якорю после загрузки шрифтов ----------
     Браузер прокручивает к #якорю до подгрузки веб-шрифтов; после их загрузки
     высота блоков выше меняется, и цель уезжает под шапку. Доводим ещё раз. */
  if (window.location.hash.length > 1) {
    var anchorTarget = document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
    if (anchorTarget) {
      var fontsReady = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
      fontsReady.then(function () {
        anchorTarget.scrollIntoView({ block: "start", behavior: "instant" });
      });
    }
  }

  /* ---------- Оглавление страницы услуг ---------- */
  var tocLinks = Array.prototype.slice.call(document.querySelectorAll("[data-toc] a"));
  if (tocLinks.length && "IntersectionObserver" in window) {
    var byId = {};
    tocLinks.forEach(function (a) { byId[a.getAttribute("href").slice(1)] = a; });
    var tocIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        tocLinks.forEach(function (a) { a.classList.remove("is-active"); });
        var link = byId[entry.target.id];
        if (link) link.classList.add("is-active");
      });
    }, { rootMargin: "-30% 0px -60% 0px" });
    Object.keys(byId).forEach(function (id) {
      var section = document.getElementById(id);
      if (section) tocIo.observe(section);
    });
  }

  /* ---------- Фильтр проектов ---------- */
  var projectsRoot = document.querySelector("[data-projects]");
  if (projectsRoot) {
    var chips = Array.prototype.slice.call(projectsRoot.querySelectorAll("[data-filter]"));
    var search = projectsRoot.querySelector("[data-search]");
    var cards = Array.prototype.slice.call(projectsRoot.querySelectorAll("[data-card]"));
    var meta = projectsRoot.querySelector("[data-results]");
    var empty = projectsRoot.querySelector("[data-empty]");
    var validFilters = chips.map(function (c) { return c.dataset.filter; });
    var state = { industry: "all", q: "" };

    var fromHash = decodeURIComponent(window.location.hash.slice(1));
    if (validFilters.indexOf(fromHash) !== -1) state.industry = fromHash;

    function apply() {
      var q = state.q.trim().toLowerCase();
      var shown = 0;
      cards.forEach(function (card) {
        var inds = (card.dataset.industries || "").split(" ");
        var okIndustry = state.industry === "all" || inds.indexOf(state.industry) !== -1;
        var okQuery = !q || (card.dataset.text || "").indexOf(q) !== -1;
        var visible = okIndustry && okQuery;
        card.hidden = !visible;
        if (visible) {
          shown++;
          card.classList.add("is-visible");
        }
      });
      chips.forEach(function (c) {
        c.setAttribute("aria-pressed", String(c.dataset.filter === state.industry));
      });
      if (meta) meta.textContent = meta.dataset.template.replace("{n}", shown).replace("{total}", cards.length);
      if (empty) empty.hidden = shown !== 0;
    }

    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        state.industry = chip.dataset.filter;
        var url = state.industry === "all"
          ? window.location.pathname + window.location.search
          : "#" + state.industry;
        history.replaceState(null, "", url);
        apply();
      });
    });
    if (search) {
      search.addEventListener("input", function () {
        state.q = search.value;
        apply();
      });
    }
    window.addEventListener("hashchange", function () {
      var h = decodeURIComponent(window.location.hash.slice(1));
      state.industry = validFilters.indexOf(h) !== -1 ? h : "all";
      apply();
    });
    apply();
  }

  /* ---------- Копирование контактов ---------- */
  document.querySelectorAll("[data-copy]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var value = btn.dataset.copy;
      function done() {
        btn.classList.add("is-done");
        var prev = btn.getAttribute("aria-label");
        btn.setAttribute("aria-label", btn.dataset.copied || prev);
        setTimeout(function () {
          btn.classList.remove("is-done");
          btn.setAttribute("aria-label", prev);
        }, 1600);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(value).then(done, function () {});
      }
    });
  });

  /* ---------- Бриф: endpoint (Formspree и т. п.) или письмо ---------- */
  var form = document.querySelector("[data-brief-form]");
  if (form) {
    var status = form.querySelector("[data-form-status]");
    function setStatus(text, kind) {
      status.textContent = text;
      status.className = "form-status " + (kind || "");
    }
    function composeText() {
      var lines = [];
      var groups = {};
      Array.prototype.forEach.call(form.elements, function (el) {
        if (!el.name || el.type === "submit" || el.name === "_gotcha") return;
        var label = el.dataset.label || el.name;
        if (el.type === "checkbox" || el.type === "radio") {
          if (!el.checked) return;
          (groups[label] = groups[label] || []).push(el.value);
          return;
        }
        if (el.value.trim()) lines.push(label + ": " + el.value.trim());
      });
      Object.keys(groups).forEach(function (label) {
        lines.push(label + ": " + groups[label].join(", "));
      });
      return lines.join("\n");
    }
    function openMail() {
      var subject = form.dataset.subject || "Brief";
      var nameField = form.querySelector('[name="name"]');
      if (nameField && nameField.value.trim()) subject += " — " + nameField.value.trim();
      window.location.href = "mailto:" + form.dataset.email +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(composeText());
      setStatus(form.dataset.msgMail, "ok");
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var trap = form.querySelector('[name="_gotcha"]');
      if (trap && trap.value) return;
      var endpoint = form.dataset.endpoint;
      if (!endpoint) {
        openMail();
        return;
      }
      var button = form.querySelector('[type="submit"]');
      button.disabled = true;
      var data = new FormData(form);
      data.append("brief", composeText());
      fetch(endpoint, { method: "POST", body: data, headers: { Accept: "application/json" } })
        .then(function (res) {
          if (!res.ok) throw new Error(String(res.status));
          form.reset();
          setStatus(form.dataset.msgOk, "ok");
        })
        .catch(function () {
          setStatus(form.dataset.msgErr, "err");
          openMail();
        })
        .then(function () { button.disabled = false; });
    });
  }
})();
