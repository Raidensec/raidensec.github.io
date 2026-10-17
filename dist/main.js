(function () {
  "use strict";

  var body = document.body;
  var menuButton = document.querySelector(".menu-toggle");
  var mainNav = document.querySelector("#main-nav");
  var progressBar = document.querySelector("#progress-bar");
  var year = document.querySelector("#year");
  var projectFilters = Array.prototype.slice.call(document.querySelectorAll(".filter-button"));
  var projectCards = Array.prototype.slice.call(document.querySelectorAll(".project-card"));
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (year) year.textContent = String(new Date().getFullYear());

  if (menuButton && mainNav) {
    menuButton.addEventListener("click", function () {
      var open = menuButton.getAttribute("aria-expanded") !== "true";
      menuButton.setAttribute("aria-expanded", String(open));
      menuButton.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
      mainNav.classList.toggle("is-open", open);
    });

    Array.prototype.forEach.call(mainNav.querySelectorAll("a"), function (link) {
      link.addEventListener("click", function () {
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Open navigation");
        mainNav.classList.remove("is-open");
      });
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && mainNav.classList.contains("is-open")) {
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Open navigation");
        mainNav.classList.remove("is-open");
        menuButton.focus();
      }
    });
  }

  projectFilters.forEach(function (filterButton) {
    filterButton.addEventListener("click", function () {
      var selectedFilter = filterButton.getAttribute("data-filter");
      projectFilters.forEach(function (candidateFilter) {
        var isSelected = candidateFilter === filterButton;
        candidateFilter.classList.toggle("is-active", isSelected);
        candidateFilter.setAttribute("aria-pressed", String(isSelected));
      });

      projectCards.forEach(function (projectCard) {
        var shouldShow = selectedFilter === "all" || projectCard.getAttribute("data-category") === selectedFilter;
        projectCard.hidden = !shouldShow;
      });
    });
  });

  function updateProgress() {
    if (!progressBar) return;
    var scrollable = document.documentElement.scrollHeight - window.innerHeight;
    var percent = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    progressBar.style.width = Math.min(100, Math.max(0, percent)) + "%";
  }

  updateProgress();
  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);

  if (!reducedMotion && "IntersectionObserver" in window) {
    var revealTargets = Array.prototype.slice.call(document.querySelectorAll(
      ".proof-strip, .approach-section, .work-heading, .project-card, .credentials-section, .about-section, .contact-section"
    ));

    revealTargets.forEach(function (revealTarget) {
      revealTarget.setAttribute("data-reveal", "");
    });

    body.classList.add("motion-ready");
    var revealObserver = new IntersectionObserver(function (entries, currentObserver) {
      entries.forEach(function (revealEntry) {
        if (revealEntry.isIntersecting) {
          revealEntry.target.classList.add("is-visible");
          currentObserver.unobserve(revealEntry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -28px 0px" });

    revealTargets.forEach(function (revealTarget) {
      revealObserver.observe(revealTarget);
    });
  }
})();
