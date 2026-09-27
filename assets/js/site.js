/* Kept website. Smooth scroll with Lenis, motion with GSAP. Every animation degrades to a
   static page when a library fails to load or the visitor prefers reduced motion. */
(function () {
  const html = document.documentElement;
  html.classList.add("js");
  const params = new URLSearchParams(location.search);
  const draft = params.get("draft") === "b" ? "b" : "a";
  html.dataset.draft = draft;
  document.querySelectorAll(".drafts a").forEach((a) => a.classList.toggle("on", a.dataset.draft === draft));

  // App tiles: stylised marks in the brands' colours, stamped into every [data-app].
  const tiles = {
    instagram: '<svg viewBox="0 0 48 48"><rect width="48" height="48" fill="url(#igg)"/><rect x="12" y="12" width="24" height="24" rx="7.5" fill="none" stroke="#fff" stroke-width="3"/><circle cx="24" cy="24" r="6" fill="none" stroke="#fff" stroke-width="3"/><circle cx="31.4" cy="16.6" r="1.9" fill="#fff"/></svg>',
    facebook: '<svg viewBox="0 0 48 48"><rect width="48" height="48" fill="#1877f2"/><path d="M27 42V27h5l.8-6H27v-3.8c0-1.7.5-2.9 3-2.9h3V9.3c-.5-.1-2.3-.3-4.4-.3-4.4 0-7.4 2.7-7.4 7.6V21h-5v6h5v15z" fill="#fff"/></svg>',
    reddit: '<svg viewBox="0 0 48 48"><rect width="48" height="48" fill="#ff4500"/><ellipse cx="24" cy="27" rx="12.5" ry="9.5" fill="#fff"/><circle cx="13" cy="24" r="3" fill="#fff"/><circle cx="35" cy="24" r="3" fill="#fff"/><circle cx="19.5" cy="26.5" r="1.9" fill="#ff4500"/><circle cx="28.5" cy="26.5" r="1.9" fill="#ff4500"/><path d="M19.5 31.5c2.5 2 6.5 2 9 0" stroke="#ff4500" stroke-width="1.8" fill="none" stroke-linecap="round"/><path d="M24 17.5l2.5-7 6 1.8" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/><circle cx="33" cy="12" r="2.4" fill="#fff"/></svg>',
    youtube: '<svg viewBox="0 0 48 48"><rect width="48" height="48" fill="#ff0000"/><rect x="9" y="14.5" width="30" height="19" rx="6.5" fill="#fff"/><path d="M21 19.5v9l8.5-4.5z" fill="#ff0000"/></svg>',
    x: '<svg viewBox="0 0 48 48"><rect width="48" height="48" fill="#0f0f0f"/><path d="M13 12h6.4l6.1 8.6L33 12h3.4l-9.3 10.8L37 36h-6.4l-6.6-9.3L15.4 36H12l10-11.6z" fill="#fff"/></svg>',
    tiktok: '<svg viewBox="0 0 48 48"><rect width="48" height="48" fill="#0f0f0f"/><path d="M27 10h4.2c.4 3.3 2.4 5.6 5.8 6v4.3c-2.2 0-4.1-.7-5.8-1.9v9.9c0 5.1-3.6 8.7-8.6 8.7-4.8 0-8.4-3.5-8.4-8.3 0-5.3 4.6-9 9.8-8.2v4.4c-2.7-.6-5.4 1.2-5.4 3.9 0 2.3 1.7 4 3.9 4 2.4 0 4.5-1.7 4.5-4.6z" fill="#fff"/></svg>',
  };
  document.querySelectorAll("[data-app]").forEach((el) => { el.innerHTML = tiles[el.dataset.app] || ""; });

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasGsap = typeof window.gsap !== "undefined";
  if (!hasGsap) { html.classList.remove("js"); return; }
  gsap.registerPlugin(ScrollTrigger);
  const hasSplit = typeof window.SplitText !== "undefined";
  if (hasSplit) gsap.registerPlugin(SplitText);

  if (reduce) {
    gsap.set("[data-reveal], .m, .fillbar", { clearProps: "all" });
    html.classList.remove("js");
    setupScreens(false);
    return;
  }

  // Smooth scroll, kept in step with ScrollTrigger.
  let lenis = null;
  if (typeof window.Lenis !== "undefined") {
    lenis = new Lenis({ lerp: 0.09, smoothWheel: true, wheelMultiplier: 1 });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const target = document.querySelector(a.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(target, { offset: -72, duration: 1.4 });
      else target.scrollIntoView({ behavior: "smooth" });
    });
  });

  // Nav hides on the way down, returns on the way up.
  const nav = document.querySelector(".nav");
  ScrollTrigger.create({
    start: "top -80",
    onUpdate: (self) => nav.classList.toggle("hidden", self.direction === 1 && self.scroll() > 200),
  });

  // Headlines: each line rises from its own mask.
  function splitLines(el) {
    if (!hasSplit) return [el];
    const split = new SplitText(el, { type: "lines", linesClass: "split-line" });
    return split.lines.map((line) => {
      const mask = document.createElement("span");
      mask.className = "line-mask";
      line.parentNode.insertBefore(mask, line);
      const inner = document.createElement("div");
      mask.appendChild(inner);
      inner.appendChild(line);
      return inner;
    });
  }
  const ease = "power3.out";

  // Hero
  const hero = document.querySelector(draft === "b" ? ".hero-b" : ".hero-a");
  const intro = gsap.timeline({ defaults: { ease } });
  const heroTitle = hero.querySelector("h1");
  const heroLines = splitLines(heroTitle);
  gsap.set(heroTitle, { opacity: 1 });
  if (draft === "a") {
    intro
      .from(hero.querySelector(".eyebrow"), { y: 10, opacity: 0, duration: 0.6 }, 0.1)
      .from(heroLines, { yPercent: 110, duration: 1.1, stagger: 0.12, ease: "power4.out" }, 0.2)
      .fromTo(hero.querySelector(".amber-rule"), { "--rule": 0 }, { "--rule": 1, duration: 0.8, ease: "power2.inOut" }, 0.9)
      .from(hero.querySelector(".lede"), { y: 16, opacity: 0, duration: 0.8 }, 1.0)
      .from(hero.querySelectorAll(".btn"), { y: 14, opacity: 0, duration: 0.7, stagger: 0.08 }, 1.15)
      .from(hero.querySelector(".hero-phone-wrap"), { y: 60, opacity: 0, duration: 1.3, ease: "power4.out" }, 0.5)
      .from(hero.querySelector(".ghost-mark"), { scale: 0.9, opacity: 0, duration: 1.6, ease: "power2.out" }, 0.3);
  } else {
    const fill = hero.querySelector(".hero-mark .fill");
    intro
      .fromTo(hero.querySelector(".hero-mark"), { scale: 0.92, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.8 }, 0)
      .fromTo(fill, { scaleY: 0 }, { scaleY: 1, duration: 1.3, ease: "power2.inOut" }, 0.3)
      .to(hero.querySelector(".hero-mark"), { boxShadow: "0 0 70px 22px rgba(233,185,73,0.42)", duration: 0.9 }, 1.3)
      .from(heroLines, { yPercent: 110, duration: 1.0, stagger: 0.1, ease: "power4.out" }, 1.0)
      .from(hero.querySelector(".lede"), { y: 16, opacity: 0, duration: 0.8 }, 1.6)
      .from(hero.querySelectorAll(".btn"), { y: 14, opacity: 0, duration: 0.7, stagger: 0.08 }, 1.75)
      .from(hero.querySelector(".hero-phone-wrap"), { y: 80, opacity: 0, duration: 1.4, ease: "power4.out" }, 1.4);
    // Aurora drift
    document.querySelectorAll(".aurora i").forEach((blob, i) => {
      gsap.to(blob, { x: () => gsap.utils.random(-80, 80), y: () => gsap.utils.random(-60, 60), duration: 9 + i * 2, ease: "sine.inOut", repeat: -1, yoyo: true, repeatRefresh: true });
    });
  }

  // Phone tilt in the hero, following the pointer.
  const tilt = hero.querySelector(".tilt");
  if (tilt && window.matchMedia("(pointer: fine)").matches) {
    const qx = gsap.quickTo(tilt, "rotationY", { duration: 0.8, ease: "power3" });
    const qy = gsap.quickTo(tilt, "rotationX", { duration: 0.8, ease: "power3" });
    gsap.set(tilt, { transformPerspective: 1200 });
    hero.addEventListener("pointermove", (e) => {
      const r = hero.getBoundingClientRect();
      const dx = (e.clientX - r.left) / r.width - 0.5;
      const dy = (e.clientY - r.top) / r.height - 0.5;
      qx(dx * 10);
      qy(-dy * 8);
    });
    hero.addEventListener("pointerleave", () => { qx(0); qy(0); });
  }

  // Magnetic buttons
  if (window.matchMedia("(pointer: fine)").matches) {
    document.querySelectorAll(".btn").forEach((btn) => {
      const tx = gsap.quickTo(btn, "x", { duration: 0.5, ease: "power3" });
      const ty = gsap.quickTo(btn, "y", { duration: 0.5, ease: "power3" });
      btn.addEventListener("pointermove", (e) => {
        const r = btn.getBoundingClientRect();
        tx((e.clientX - (r.left + r.width / 2)) * 0.25);
        ty((e.clientY - (r.top + r.height / 2)) * 0.35);
      });
      btn.addEventListener("pointerleave", () => { tx(0); ty(0); });
    });
  }

  // The strip: one endless drift.
  const track = document.querySelector(".strip .track");
  if (track) {
    track.innerHTML += track.innerHTML;
    gsap.to(track, { xPercent: -50, duration: 40, ease: "none", repeat: -1 });
  }

  // Section headlines split and rise; other blocks fade up.
  document.querySelectorAll("[data-split]").forEach((el) => {
    const lines = splitLines(el);
    gsap.from(lines, { yPercent: 110, duration: 1.0, stagger: 0.1, ease: "power4.out", scrollTrigger: { trigger: el, start: "top 85%" } });
  });
  document.querySelectorAll("[data-reveal]").forEach((el) => {
    const delay = parseFloat(el.dataset.reveal) || 0;
    gsap.fromTo(el, { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, delay, ease, scrollTrigger: { trigger: el, start: "top 88%" } });
  });
  document.querySelectorAll("[data-stagger]").forEach((group) => {
    const items = group.children;
    gsap.fromTo(items, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, stagger: 0.1, ease, scrollTrigger: { trigger: group, start: "top 85%" } });
  });

  // Amber rules under headlines draw when they arrive.
  document.querySelectorAll("[data-split] .amber-rule, h2 .amber-rule").forEach((el) => {
    if (hero.contains(el)) return;
    gsap.fromTo(el, { "--rule": 0 }, { "--rule": 1, duration: 0.9, ease: "power2.inOut", scrollTrigger: { trigger: el, start: "top 85%" } });
  });

  // Draft B: the moments rail pins and slides sideways.
  if (draft === "b" && window.innerWidth > 980) {
    const outer = document.querySelector(".moments-rail-outer");
    const rail = document.querySelector(".moments-rail");
    const distance = () => rail.scrollWidth - outer.clientWidth;
    gsap.to(rail, { x: () => -distance(), ease: "none", scrollTrigger: { trigger: outer, pin: true, scrub: 1, start: "center center", end: () => "+=" + distance(), invalidateOnRefresh: true } });
  }

  // How it works: the sticky phone shows the step in view.
  setupScreens(true);
  function setupScreens(animate) {
    const phone = document.querySelector(".how-phone");
    if (!phone) return;
    const device = phone.querySelector(".device");
    const screens = phone.querySelectorAll(".screen");
    let current = null;
    function show(name) {
      if (name === current) return;
      current = name;
      screens.forEach((s) => {
        const on = s.dataset.screen === name;
        if (animate) {
          gsap.to(s, { opacity: on ? 1 : 0, y: on ? 0 : 12, duration: 0.5, ease, overwrite: true });
        } else {
          s.style.opacity = on ? 1 : 0;
        }
        s.classList.toggle("active", on);
      });
      device.classList.toggle("night", name === "strict");
    }
    const steps = document.querySelectorAll(".how .step");
    show(steps[0].dataset.screen);
    if (!animate) return;
    steps.forEach((step) => {
      ScrollTrigger.create({
        trigger: step,
        start: "top 55%",
        end: "bottom 45%",
        onEnter: () => show(step.dataset.screen),
        onEnterBack: () => show(step.dataset.screen),
      });
    });
  }

  // Places: the circle breathes, a ring leaves it.
  const ring = document.querySelector(".map .ring");
  if (ring) gsap.fromTo(ring, { scale: 1, opacity: 0.6 }, { scale: 1.7, opacity: 0, duration: 2.8, ease: "power1.out", repeat: -1 });
  const radius = document.querySelector(".map .radius");
  if (radius) gsap.to(radius, { scale: 1.04, duration: 2.8, ease: "sine.inOut", repeat: -1, yoyo: true });

  // Reports: marks rise, bars draw, numbers count.
  const marks = document.querySelectorAll(".rcard .m");
  if (marks.length) gsap.to(marks, { scaleY: 1, duration: 0.5, stagger: 0.04, ease, scrollTrigger: { trigger: ".marks", start: "top 85%" } });
  document.querySelectorAll(".fillbar").forEach((bar, i) => {
    gsap.to(bar, { scaleX: 1, duration: 1.1, delay: i * 0.15, ease: "power3.out", scrollTrigger: { trigger: bar, start: "top 90%" } });
  });
  document.querySelectorAll("[data-count]").forEach((el) => {
    const to = parseFloat(el.dataset.count);
    const obj = { v: 0 };
    el.textContent = "0";
    gsap.to(obj, { v: to, duration: 1.4, ease: "power2.out", snap: { v: 1 }, scrollTrigger: { trigger: el, start: "top 85%" }, onUpdate: () => { el.textContent = Math.round(obj.v); } });
  });

  // Strict band: the sealed card lands.
  const sealed = document.querySelector(".night .sealed");
  if (sealed) gsap.from(sealed, { y: 40, scale: 0.96, opacity: 0, duration: 1.0, ease: "power4.out", scrollTrigger: { trigger: sealed, start: "top 80%" } });

  ScrollTrigger.refresh();
})();
