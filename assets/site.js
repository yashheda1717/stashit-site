/* Tekhnologia landing sites: smart Play links, scroll reveal, small UI. No tracking, no third parties. */
(function () {
  "use strict";
  var d = document, KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content"];

  /* ---- Smart CTA: carry UTM params into the Play Store install referrer ---- */
  var q = new URLSearchParams(location.search), u = {}, has = false;
  KEYS.forEach(function (k) { var v = q.get(k); if (v) { u[k] = v; has = true; } });
  try {
    if (has) sessionStorage.setItem("utm", JSON.stringify(u));
    else u = JSON.parse(sessionStorage.getItem("utm") || "{}") || {};
  } catch (e) {}
  var src = u.utm_source || "website", med = u.utm_medium || "landing", camp = u.utm_campaign || "organic";
  function enc(x) { return encodeURIComponent(x); }
  d.querySelectorAll("a[data-play]").forEach(function (a) {
    var content = u.utm_content || a.getAttribute("data-cta") || "";
    var ref = "utm_source=" + enc(src) + "&utm_medium=" + enc(med) + "&utm_campaign=" + enc(camp) + "&utm_content=" + enc(content);
    a.href = a.getAttribute("data-play") + "&referrer=" + enc(ref);
  });

  /* ---- Language choice (Stash-it!) ---- */
  d.querySelectorAll("[data-setlang]").forEach(function (a) {
    a.addEventListener("click", function (e) {
      try { localStorage.setItem("stashit-lang", a.getAttribute("data-setlang")); } catch (err) {}
      var href = a.getAttribute("href");
      if (location.search && href.indexOf("?") < 0) { e.preventDefault(); location.href = href + location.search; }
    });
  });

  /* ---- Header border on scroll ---- */
  var top = d.querySelector(".top");
  if (top) {
    var onS = function () { top.classList.toggle("scrolled", window.scrollY > 8); };
    onS(); window.addEventListener("scroll", onS, { passive: true });
  }

  /* ---- Scroll reveal (respects reduced motion; content is visible without JS) ---- */
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduce && "IntersectionObserver" in window) {
    var els = d.querySelectorAll("[data-reveal]"), vh = window.innerHeight;
    els.forEach(function (el) { if (el.getBoundingClientRect().top < vh * 0.95) el.classList.add("in"); });
    d.documentElement.classList.add("rv");
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -6% 0px" });
    els.forEach(function (el) { if (!el.classList.contains("in")) io.observe(el); });
  }

  /* ---- Searchable tools grid (Stash-it!) ---- */
  var box = d.getElementById("tool-q");
  if (box) {
    var tools = d.querySelectorAll(".tool"), empty = d.getElementById("tool-empty"), count = d.getElementById("tool-count");
    var norm = function (s) { return (s || "").toLowerCase().replace(/\s+/g, " ").trim(); };
    var run = function () {
      var v = norm(box.value), n = 0, words = v.split(" ").filter(Boolean);
      tools.forEach(function (t) {
        var hay = norm(t.textContent + " " + t.getAttribute("data-k"));
        var ok = words.every(function (w) { return hay.indexOf(w) > -1 || hay.indexOf(w.replace(/kb$/, " kb")) > -1; });
        t.hidden = !ok; if (ok) n++;
      });
      if (empty) empty.hidden = n !== 0;
      if (count) count.textContent = count.getAttribute(v ? "data-some" : "data-all").replace("{n}", n);
    };
    box.addEventListener("input", run);
    d.querySelectorAll("[data-q]").forEach(function (b) {
      b.addEventListener("click", function () { box.value = b.getAttribute("data-q"); run(); box.focus(); });
    });
  }
})();
