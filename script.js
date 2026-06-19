const revealTargets = document.querySelectorAll(
  [
    ".intro > *",
    ".section-heading",
    ".service-card",
    ".gallery-link",
    ".point-item",
    ".contact > *",
  ].join(",")
);

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const openHeroCurtain = () => {
  document.body.classList.add("curtain-opened");
};

if (prefersReducedMotion) {
  openHeroCurtain();
} else {
  const openHeroCurtainOnKey = (event) => {
    const scrollKeys = ["ArrowDown", "PageDown", " ", "End"];

    if (scrollKeys.includes(event.key)) {
      openHeroCurtain();
      window.removeEventListener("keydown", openHeroCurtainOnKey);
    }
  };

  window.addEventListener("wheel", openHeroCurtain, { once: true, passive: true });
  window.addEventListener("touchstart", openHeroCurtain, { once: true, passive: true });
  window.addEventListener("keydown", openHeroCurtainOnKey);
}

if (prefersReducedMotion || !("IntersectionObserver" in window)) {
  revealTargets.forEach((target) => target.classList.add("is-visible"));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -8% 0px",
    }
  );

  revealTargets.forEach((target, index) => {
    target.classList.add("reveal");
    target.style.setProperty("--reveal-delay", `${Math.min(index % 5, 4) * 90}ms`);
    observer.observe(target);
  });
}
