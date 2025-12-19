// Build a small "deck as code" table of contents and scroll behavior

function initTOC() {
  const pageRoot = document.getElementById("page-root");
  if (!pageRoot) return;

  const tocEl = document.getElementById("toc");
  if (!tocEl) return;

  const sections = Array.from(document.querySelectorAll(".deck-section"));

  if (sections.length === 0) return;

  const label = document.createElement("div");
  label.className = "toc-label";
  label.textContent = "Structure";
  tocEl.appendChild(label);

  const list = document.createElement("ul");
  list.className = "toc-list";

  const tocLinks = [];

  sections.forEach((section, index) => {
    const titleEl = section.querySelector(".section-title");
    const codeEl = section.querySelector(".section-code");

    const li = document.createElement("li");
    li.className = "toc-item";

    const link = document.createElement("button");
    link.type = "button";
    link.className = "toc-link";
    link.dataset.targetId = section.dataset.sectionId || "";

    const codeSpan = document.createElement("span");
    codeSpan.className = "toc-link-code";
    codeSpan.textContent = codeEl ? codeEl.textContent : `[${String(index + 1).padStart(2, "0")}]`;

    const labelSpan = document.createElement("span");
    labelSpan.className = "toc-link-label";
    labelSpan.textContent = titleEl ? titleEl.textContent : `Section ${index + 1}`;

    link.appendChild(codeSpan);
    link.appendChild(labelSpan);
    li.appendChild(link);
    tocLinks.push(link);
    list.appendChild(li);

    link.addEventListener("click", (event) => {
      event.preventDefault();

      // Scroll to the exact section position
      const targetY = section.offsetTop - 24; // small offset from top
      window.scrollTo({
        top: targetY,
        behavior: "smooth",
      });

      // Explicitly manage active state on click
      tocLinks.forEach((l) => l.classList.remove("active"));
      link.classList.add("active");

      // Update URL hash so sections are easily shareable
      const id = section.dataset.sectionId;
      if (id) {
        history.replaceState(null, "", `#${id}`);
      }
    });
  });

  tocEl.appendChild(list);

  // Highlight current section while scrolling (top-most visible wins)
  const setActiveByScroll = () => {
    const scrollY = window.scrollY || window.pageYOffset;
    const offset = 40;
    let currentId = sections[0]?.dataset.sectionId;

    sections.forEach((section) => {
      if (section.offsetTop - offset <= scrollY) {
        currentId = section.dataset.sectionId;
      }
    });

    if (!currentId) return;

    tocLinks.forEach((link) => {
      const match = link.dataset.targetId === currentId;
      link.classList.toggle("active", match);
    });
  };

  window.addEventListener("scroll", setActiveByScroll, { passive: true });
  // Set initial state
  setActiveByScroll();
}

function initPasswordGate() {
  const PASSWORD = "darkmatterm@gic";
  const gate = document.getElementById("password-gate");
  const pageRoot = document.getElementById("page-root");
  const form = document.getElementById("password-form");
  const input = document.getElementById("password-input");
  const errorEl = document.getElementById("password-error");

  if (!pageRoot) {
    initTOC();
    return;
  }

  if (!gate || !form || !input) {
    pageRoot.hidden = false;
    initTOC();
    return;
  }

  const unlock = () => {
    if (gate) {
      gate.style.display = "none";
    }
    pageRoot.hidden = false;
    sessionStorage.setItem("cof:unlocked", "1");
    initTOC();
  };

  const alreadyUnlocked = sessionStorage.getItem("cof:unlocked") === "1";
  if (alreadyUnlocked) {
    unlock();
    return;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const value = input.value || "";
    if (value === PASSWORD) {
      if (errorEl) errorEl.textContent = "";
      unlock();
    } else if (errorEl) {
      errorEl.textContent = "Incorrect password. Please try again.";
    }
  });

  // Focus input on load
  input.focus();
}

document.addEventListener("DOMContentLoaded", initPasswordGate);


