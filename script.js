// Build a small "deck as code" table of contents and scroll behavior

function initTOC() {
  const tocEl = document.getElementById("toc");
  if (!tocEl) return;

  const sections = Array.from(
    document.querySelectorAll(".deck-section")
  );

  if (sections.length === 0) return;

  const label = document.createElement("div");
  label.className = "toc-label";
  label.textContent = "Structure";
  tocEl.appendChild(label);

  const list = document.createElement("ul");
  list.className = "toc-list";

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
      const allLinks = tocEl.querySelectorAll(".toc-link");
      allLinks.forEach((l) => l.classList.remove("active"));
      link.classList.add("active");
    });
  });

  tocEl.appendChild(list);
}

document.addEventListener("DOMContentLoaded", initTOC);


