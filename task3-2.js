let scrollTimer = -1;
let currentPage = 1;

const baseUrl = "https://rickandmortyapi.com/api/character";

const loader = document.getElementById("loader");
const errorContainer = document.getElementById("errorContainer");
const errorText = document.getElementById("errorText");

const container = document.getElementById("characters");
const characterList = document.getElementById("characterList");

const template = document.getElementById("characterTemplate");

const goHome = document.querySelector("header h1.title");

const currentSpan = document.querySelector(".current");
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");

const upButton = document.querySelector(".upButton");

async function loadPage(page) {
  let hadError = false;

  container.style.display = "none";
  loader.style.display = "flex";

  if (errorContainer) {
    errorContainer.style.display = "none";
  }

  prevBtn.disabled = true;
  nextBtn.disabled = true;

  try {
    const response = await fetch(`${baseUrl}?page=${page}`);

    if (!response.ok) {
      throw new Error("Failed to load characters. Please try again.");
    }

    const data = await response.json();

    characterList.innerHTML = "";

    data.results.forEach((c) => {
      const card = template.content.cloneNode(true);

      const imgEl = card.querySelector("#image");
      const nameEl = card.querySelector("#nameValue");
      const statusEl = card.querySelector("#statusValue");

      if (imgEl) {
        imgEl.src = c.image;
        imgEl.alt = c.name;
      }

      if (nameEl) {
        nameEl.textContent = c.name;
      }

      if (statusEl) {
        statusEl.textContent = c.status;
      }

      characterList.appendChild(card);
    });

    currentPage = page;

    currentSpan.textContent = `Page ${page} of ${data.info.pages}`;

    prevBtn.disabled = page === 1;
    nextBtn.disabled = page === data.info.pages;
  } catch (error) {
    hadError = true;

    loader.style.display = "none";

    const msg =
      errorText?.textContent || error.message || "Failed to load characters.";

    if (errorText && errorContainer) {
      errorText.textContent = msg;

      errorContainer.style.display = "flex";
    }
  } finally {
    loader.style.display = "none";
    container.style.display = "block";

    if (errorContainer) {
      errorContainer.style.display = hadError ? "flex" : "none";
    }
  }
}

function topFunction() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera

  setTimeout(() => upButton.classList.remove("visible"), 200);
}

window.addEventListener("scroll", () => {
  if (window.scrollY) {
    clearTimeout(scrollTimer);

    upButton.classList.remove("visible");

    scrollTimer = setTimeout(() => {
      upButton.classList.add("visible");
    }, 250);
  }
});

goHome.addEventListener("click", () => {
  if (currentPage === 1) {
    return;
  }

  loadPage(1);
  topFunction();
});

upButton.addEventListener("click", topFunction);

prevBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    loadPage(currentPage - 1);

    topFunction();
  }
});

nextBtn.addEventListener("click", () => {
  loadPage(currentPage + 1);

  topFunction();
});

loadPage(currentPage);
topFunction();
