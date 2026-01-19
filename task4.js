const LOAD_TRIGGER_OFFSET_PX = 58;

const BASE_URL = "https://rickandmortyapi.com/api/character";
const DETAILS_URL = "https://rickandmortyapi.com/api/character/{id}";

let scrollTimer = -1;
let currentPage = 1;

let totalPages = Infinity;
let isLoading = false;

const preloader = document.getElementById("preloader");
const overlayContainer = document.getElementById("overlayLoader");

const errorContainer = document.getElementById("errorContainer");
const errorText = document.getElementById("errorText");

const modal = document.getElementById("modal");
const modalBody = document.getElementById("modalBody");
const modalTemplate = document.getElementById("modalTemplate");

const characterList = document.getElementById("characterList");
const template = document.getElementById("characterTemplate");

const upButton = document.querySelector(".upButton");

function showOverlayLoader() {
  if (!overlayContainer) {
    return;
  }

  overlayContainer.style.display = "flex";
}

function hideOverlayLoader() {
  if (overlayContainer) {
    overlayContainer.style.display = "none";
  }
}

async function loadPage(page, { loadMore } = {}) {
  if (isLoading) {
    return;
  }

  let hadError = false;
  isLoading = true;

  if (loadMore) {
    showOverlayLoader();
  } else {
    preloader.style.display = "flex";
  }

  if (errorContainer) {
    errorContainer.style.display = "none";
  }

  if (!loadMore) {
    characterList.innerHTML = "";
  }

  try {
    const response = await fetch(`${BASE_URL}?page=${page}`);

    if (!response.ok) {
      throw new Error("Failed to load characters. Please try again.");
    }

    const data = await response.json();

    data.results.forEach((c) => {
      const card = template.content.cloneNode(true);
      const article = card.querySelector("[data-character-id]");

      if (article) {
        article.dataset.characterId = c.id;
      }

      const imgEl = card.querySelector('[data-role="image"]');
      const nameEl = card.querySelector('[data-role="nameValue"]');
      const statusEl = card.querySelector('[data-role="statusValue"]');

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

    totalPages = data.info?.pages ?? totalPages;
    currentPage = page;
  } catch (error) {
    hadError = true;

    const msg =
      errorText?.textContent || error.message || "Failed to load characters.";

    if (errorText && errorContainer) {
      errorText.textContent = msg;

      errorContainer.style.display = "flex";
    }
  } finally {
    if (!loadMore) {
      preloader.style.display = "none";
    }

    hideOverlayLoader();

    isLoading = false;

    if (errorContainer) {
      errorContainer.style.display = hadError ? "flex" : "none";
    }
  }
}

async function getCharacter(id) {
  try {
    const response = await fetch(DETAILS_URL.replace("{id}", id));

    if (!response.ok) {
      throw new Error("Failed to load character details. Please try again.");
    }

    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(
      error?.message || "Failed to load character details. Please try again.",
    );
  }
}

function topFunction() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera

  setTimeout(() => upButton.classList.remove("visible"), 200);
}

document.addEventListener("click", async (event) => {
  const target = event.target;
  const article = target.closest("[data-character-id]");

  if (article && characterList.contains(article)) {
    event.stopPropagation();

    try {
      const character = await getCharacter(article.dataset.characterId);

      const modalCard = modalTemplate.content.cloneNode(true);

      const modalImage = modalCard.querySelector('[data-role="image"]');
      const modalNameValue = modalCard.querySelector('[data-role="nameValue"]');

      const modalStatusValue = modalCard.querySelector(
        '[data-role="statusValue"]',
      );

      if (modalImage) {
        modalImage.src = character.image;
        modalImage.alt = character.name;
      }

      if (modalNameValue) {
        modalNameValue.textContent = character.name;
      }

      if (modalStatusValue) {
        modalStatusValue.textContent = `${character.status}`;
      }

      modalBody.innerHTML = "";
      modalBody.appendChild(modalCard);

      modal.showModal();
    } catch (error) {
      alert("Failed to load character details. Please try again.");
    }

    return;
  }

  if (target === modal || target.closest("#closeModal")) {
    modal.close();

    return;
  }

  if (target.closest("header h1.title")) {
    topFunction();

    return;
  }

  if (target.closest(".upButton")) {
    topFunction();
  }
});

window.addEventListener("scroll", () => {
  if (window.scrollY) {
    clearTimeout(scrollTimer);

    upButton.classList.remove("visible");

    scrollTimer = setTimeout(() => {
      upButton.classList.add("visible");
    }, 250);
  }

  const isShouldLoadMore =
    window.innerHeight + window.scrollY >=
    document.body.offsetHeight - LOAD_TRIGGER_OFFSET_PX;

  if (isShouldLoadMore && !isLoading && currentPage < totalPages) {
    loadPage(currentPage + 1, { loadMore: true });
  }
});

loadPage(currentPage);
topFunction();
