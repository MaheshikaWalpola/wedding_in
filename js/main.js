/* Maheshika & Moksha — Tirupati. One page, no framework. */

document.addEventListener("DOMContentLoaded", () => {
  setupPinGate();
  setupNav();
  setupReveals();
  setupCountdown();
  setupLangTabs();
  drawToran(document.getElementById("toran"));
  drawToran(document.getElementById("toran2"));
});

/* ---------- PIN gate ----------
   Wedding-grade privacy: a four-digit code from the invitation,
   remembered on the device. The hash is SHA-256 of the code. */

const PIN_HASH = "712dca40936b39ce670dc803736fe3735cf99311030a928de039a36f77926230"; // code 1312
const PIN_KEY = "mnm-in-key";

function setupPinGate() {
  let unlocked = false;
  try {
    unlocked = localStorage.getItem(PIN_KEY) === "1";
  } catch (e) {
    return; // storage unavailable — never lock a guest out
  }
  if (unlocked || !window.crypto || !crypto.subtle) return;

  const gate = document.createElement("div");
  gate.className = "pin-gate";
  gate.innerHTML =
    '<div class="pin-box">' +
    '<div class="pin-mono">M &amp; M</div>' +
    '<p class="pin-title">A Private Celebration</p>' +
    '<p class="pin-sub">enter the code from your invitation</p>' +
    '<input class="pin-input" inputmode="numeric" pattern="[0-9]*" maxlength="4" aria-label="4 digit code" autofocus>' +
    '<p class="pin-err" aria-live="polite"></p>' +
    "</div>";
  document.body.appendChild(gate);
  document.body.classList.add("no-scroll");

  const input = gate.querySelector(".pin-input");
  const err = gate.querySelector(".pin-err");

  async function sha256(text) {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
    return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  input.addEventListener("input", async () => {
    err.textContent = "";
    const v = input.value.replace(/\D/g, "");
    input.value = v;
    if (v.length !== 4) return;
    if ((await sha256(v)) === PIN_HASH) {
      try { localStorage.setItem(PIN_KEY, "1"); } catch (e) {}
      gate.classList.add("open");
      document.body.classList.remove("no-scroll");
      setTimeout(() => gate.remove(), 600);
    } else {
      input.value = "";
      gate.querySelector(".pin-box").classList.add("shake");
      err.textContent = "That's not it — try the code on your invitation";
      setTimeout(() => gate.querySelector(".pin-box").classList.remove("shake"), 500);
    }
  });
  setTimeout(() => input.focus(), 100);
}

/* ---------- Nav: glass header, smooth scroll with offset,
   active-section highlight, mobile menu ---------- */

function setupNav() {
  const nav = document.getElementById("nav");
  const links = document.getElementById("links");
  const burger = document.getElementById("burger");
  const anchors = [...links.querySelectorAll("a[href^='#']")];
  const navH = () => nav.getBoundingClientRect().height;

  const onScroll = () => nav.classList.toggle("solid", window.scrollY > 24);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // every in-page link (nav, hero button, brand) scrolls with the header offset
  document.querySelectorAll("a[href^='#']").forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href").slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      closeMenu();
      const top = id === "home" ? 0 : target.getBoundingClientRect().top + window.scrollY - navH() + 1;
      window.scrollTo({ top, behavior: "smooth" });
      history.replaceState(null, "", "#" + id);
    });
  });

  // highlight the section currently in view
  const sections = anchors.map((a) => document.getElementById(a.getAttribute("href").slice(1))).filter(Boolean);
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        anchors.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + en.target.id));
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );
  sections.forEach((s) => spy.observe(s));

  function closeMenu() {
    links.classList.remove("open");
    nav.classList.remove("menu-open");
    burger.setAttribute("aria-expanded", "false");
    document.body.classList.remove("no-scroll");
  }
  burger.addEventListener("click", () => {
    const open = !links.classList.contains("open");
    links.classList.toggle("open", open);
    nav.classList.toggle("menu-open", open);
    burger.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("no-scroll", open);
  });
}

/* ---------- Scroll reveals ---------- */

function setupReveals() {
  const els = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) { els.forEach((el) => el.classList.add("in")); return; }
  const io = new IntersectionObserver(
    (entries) => entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } }),
    { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
  );
  els.forEach((el, i) => { el.style.transitionDelay = `${(i % 4) * 80}ms`; io.observe(el); });
}

/* ---------- Countdown to the reception ---------- */

function setupCountdown() {
  const box = document.getElementById("countdown");
  if (!box) return;
  const target = new Date("2026-12-13T17:00:00+05:30"); // reception, 5 PM IST, Sunday 13 December
  const f = (sel) => box.querySelector(`[data-cd="${sel}"]`);
  const pad = (n) => String(n).padStart(2, "0");
  function tick() {
    const diff = target - Date.now();
    if (diff <= 0) {
      box.innerHTML = '<div style="flex:1"><b style="font-size:1.4rem">It\'s today!</b><span>see you at S.R. Convention Hall</span></div>';
      return;
    }
    const s = Math.floor(diff / 1000);
    f("d").textContent = Math.floor(s / 86400);
    f("h").textContent = pad(Math.floor((s % 86400) / 3600));
    f("m").textContent = pad(Math.floor((s % 3600) / 60));
    f("s").textContent = pad(s % 60);
    setTimeout(tick, 1000 - (Date.now() % 1000));
  }
  tick();
}

/* ---------- Invitation: English / Telugu ---------- */

function setupLangTabs() {
  const tabs = document.querySelectorAll(".lang-tabs button");
  const panes = document.querySelectorAll(".lang-pane");
  tabs.forEach((t) =>
    t.addEventListener("click", () => {
      const lang = t.dataset.lang;
      tabs.forEach((b) => { const on = b === t; b.classList.toggle("on", on); b.setAttribute("aria-selected", String(on)); });
      panes.forEach((p) => { p.hidden = p.dataset.pane !== lang; });
    })
  );
}

/* ---------- Toran: a marigold-and-mango-leaf garland hung across
   the top of the hero and the closing section. Drawn to the current
   width so the sag looks right on every screen. ---------- */

function drawToran(svg) {
  if (!svg) return;
  const NS = "http://www.w3.org/2000/svg";
  function render() {
    const W = Math.max(320, svg.clientWidth || window.innerWidth);
    const H = 96;
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    svg.innerHTML = "";

    // the string: a gentle sag from edge to edge
    const sag = Math.min(26, W * 0.03);
    const string = document.createElementNS(NS, "path");
    string.setAttribute("d", `M0 6 Q ${W / 2} ${6 + sag * 2} ${W} 6`);
    string.setAttribute("fill", "none");
    string.setAttribute("stroke", "#b8892e");
    string.setAttribute("stroke-width", "1.2");
    svg.appendChild(string);

    const step = 58;
    const n = Math.ceil(W / step) + 1;
    for (let i = 0; i < n; i++) {
      const x = i * step + (step / 2) * ((Math.floor(W / step) % 2) ? 0 : 1) - step / 2;
      const t = x / W;
      const y = 6 + 4 * sag * t * (1 - t); // point on the quadratic string
      // outer group positions, inner group sways — the CSS animation's
      // transform would otherwise override the positioning transform
      const pos = document.createElementNS(NS, "g");
      pos.setAttribute("transform", `translate(${x.toFixed(1)} ${y.toFixed(1)})`);
      const g = document.createElementNS(NS, "g");
      g.setAttribute("class", "swing");
      g.style.animationDelay = `${(i % 7) * -0.7}s`;
      pos.appendChild(g);

      // hanging thread
      const thread = document.createElementNS(NS, "line");
      thread.setAttribute("x1", 0); thread.setAttribute("y1", 0); thread.setAttribute("x2", 0); thread.setAttribute("y2", 30);
      thread.setAttribute("stroke", "#b8892e"); thread.setAttribute("stroke-width", "0.9");
      g.appendChild(thread);

      // two mango leaves either side
      const l1 = document.createElementNS(NS, "use");
      l1.setAttribute("href", "#leaf"); l1.setAttribute("x", -22); l1.setAttribute("y", 10); l1.setAttribute("width", 24); l1.setAttribute("height", 24);
      l1.setAttribute("transform", "rotate(35 -10 22)");
      const l2 = document.createElementNS(NS, "use");
      l2.setAttribute("href", "#leaf"); l2.setAttribute("x", -2); l2.setAttribute("y", 10); l2.setAttribute("width", 24); l2.setAttribute("height", 24);
      l2.setAttribute("transform", "rotate(145 10 22) scale(1 -1) translate(0 -44)");
      g.appendChild(l1); g.appendChild(l2);

      // the marigold, alternating sizes
      const big = i % 2 === 0;
      const size = big ? 30 : 24;
      const m = document.createElementNS(NS, "use");
      m.setAttribute("href", "#marigold");
      m.setAttribute("x", -size / 2); m.setAttribute("y", 30 + (big ? 0 : 3));
      m.setAttribute("width", size); m.setAttribute("height", size);
      g.appendChild(m);

      svg.appendChild(pos);
    }
  }
  render();
  let raf;
  window.addEventListener("resize", () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(render); });
}
