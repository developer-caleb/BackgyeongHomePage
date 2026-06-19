const grid = document.querySelector("#galleryGrid");
const loader = document.querySelector("#galleryLoading");
const tabs = Array.from(document.querySelectorAll(".gallery-tab"));

if (grid && loader) {
  const items = Array.from(grid.querySelectorAll("a"));
  const batchSize = 12;
  let activeCategory = "curtain";
  let filteredItems = [];
  let visibleCount = 0;
  let isLoading = false;

  const getTitle = (item) =>
    (item.getAttribute("aria-label") || "")
      .replace(/\s*블로그에서 보기\s*$/, "")
      .replace(/\[[^\]]*백경(?:커튼|원단)[^\]]*\]/g, "")
      .replace(/양산백경(?:커튼|원단)|백경(?:커튼|원단)/g, "")
      .trim();

  const getCategory = (item) => {
    const title = getTitle(item);

    if (/블라인드|롤스크린|롤\s*스크린/i.test(title)) {
      return "blind";
    }

    if (/커튼|커텐|쉬폰|암막|시스루|바란스|자수커튼/i.test(title)) {
      return "curtain";
    }

    return "etc";
  };

  items.forEach((item) => {
    const image = item.querySelector("img");
    item.dataset.category = getCategory(item);

    if (image) {
      image.loading = "lazy";
      image.decoding = "async";
    }
  });

  const setLoader = (visible) => {
    loader.classList.toggle("is-visible", visible);
  };

  const updateTabCounts = () => {
    const counts = items.reduce(
      (acc, item) => {
        acc[item.dataset.category] += 1;
        return acc;
      },
      { curtain: 0, blind: 0, etc: 0 }
    );

    tabs.forEach((tab) => {
      const label = tab.textContent.replace(/\s*\(\d+\)\s*$/, "").trim();
      tab.textContent = `${label} (${counts[tab.dataset.category]})`;
    });
  };

  const showNextBatch = () => {
    if (isLoading || visibleCount >= filteredItems.length) return;

    isLoading = true;
    setLoader(true);

    window.setTimeout(() => {
      const nextItems = filteredItems.slice(visibleCount, visibleCount + batchSize);

      nextItems.forEach((item) => item.classList.add("is-visible"));
      visibleCount += nextItems.length;
      isLoading = false;
      setLoader(visibleCount < filteredItems.length);
    }, visibleCount === 0 ? 0 : 420);
  };

  const setCategory = (category, shouldScroll = false) => {
    activeCategory = category;
    visibleCount = 0;
    isLoading = false;
    filteredItems = items.filter((item) => item.dataset.category === activeCategory);

    items.forEach((item) => item.classList.remove("is-visible"));
    tabs.forEach((tab) => {
      tab.classList.toggle("is-active", tab.dataset.category === activeCategory);
      tab.setAttribute("aria-pressed", String(tab.dataset.category === activeCategory));
    });

    setLoader(false);
    showNextBatch();

    if (shouldScroll) {
      window.scrollTo({ top: grid.offsetTop - 120, behavior: "smooth" });
    }
  };

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        showNextBatch();
      }
    },
    {
      rootMargin: "160px 0px",
    }
  );

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => setCategory(tab.dataset.category, true));
  });

  updateTabCounts();
  setCategory(activeCategory);
  observer.observe(loader);
}
