const API_KEY = "YOUR_TMDB_API_KEY";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_URL = "https://image.tmdb.org/t/p/w500";
const BACKDROP_URL = "https://image.tmdb.org/t/p/original";
const popularUrl = `${BASE_URL}/discover/movie?sort_by=popularity.desc&api_key=${API_KEY}`;
const topRatedUrl = `${BASE_URL}/movie/top_rated?api_key=${API_KEY}`;
const searchUrl = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=`;

/* Elements */
const form = document.getElementById("form");
const searchInput = document.getElementById("search");
const clearSearch = document.getElementById("clear-search");
const moviesContainer = document.getElementById("movies-container");
const loadingSkeleton = document.getElementById("loading-skeleton");
const emptyState = document.getElementById("empty-state");
const sectionTitle = document.getElementById("section-title");
const showPopular = document.getElementById("show-popular");
const trendingBtn = document.getElementById("trending-btn");
const topRatedBtn = document.getElementById("top-rated-btn");
const currentYear = document.getElementById("current-year");

/* Modal Elements */
const modal = document.getElementById("quick-view-modal");
const modalOverlay = document.querySelector(".modal-overlay");
const modalClose = document.querySelector(".modal-close");
const modalLoading = document.getElementById("modal-loading");
const modalContent = document.getElementById("modal-content");
const modalError = document.getElementById("modal-error");
const modalRetry = document.querySelector(".modal-retry-btn");
const modalPoster = document.getElementById("modal-poster");
const modalRating = document.getElementById("modal-rating-value");
const modalTitle = document.getElementById("modal-title");
const modalReleaseDate = document.getElementById("modal-release-date");
const modalLanguage = document.getElementById("modal-language");
const modalRuntime = document.getElementById("modal-runtime");
const modalGenres = document.getElementById("modal-genres");
const modalOverview = document.getElementById("modal-overview");
const modalTmdbLink = document.getElementById("modal-tmdb-link");
let currentMovieId = null;

/* Initialize */
document.addEventListener("DOMContentLoaded", () => {
  currentYear.textContent = new Date().getFullYear();
  loadMovies(popularUrl, "Popular Movies");
});

/* Search */
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const query = searchInput.value.trim();
  if (!query) {
    loadMovies(popularUrl, "Popular Movies");
    setActiveButton(trendingBtn);
    return;
  }

  setActiveButton(null);
  loadMovies(
    searchUrl + encodeURIComponent(query),
    `Search Results for "${query}"`,
  );
});

/* Clear Search */
clearSearch.addEventListener("click", () => {
  searchInput.value = "";
  setActiveButton(trendingBtn);
  loadMovies(popularUrl, "Popular Movies");
  searchInput.focus();
});

/* Navigation */
trendingBtn.addEventListener("click", () => {
  searchInput.value = "";
  setActiveButton(trendingBtn);
  loadMovies(popularUrl, "Popular Movies");
});

topRatedBtn.addEventListener("click", () => {
  searchInput.value = "";
  setActiveButton(topRatedBtn);
  loadMovies(topRatedUrl, "Top Rated Movies");
});

showPopular.addEventListener("click", () => {
  searchInput.value = "";
  setActiveButton(trendingBtn);
  loadMovies(popularUrl, "Popular Movies");
});

function setActiveButton(activeButton) {
  document.querySelectorAll(".nav-btn").forEach((button) => {
    button.classList.remove("active");
  });

  if (activeButton) {
    activeButton.classList.add("active");
  }
}

/* Fetch Movies */
async function loadMovies(url, title) {
  sectionTitle.textContent = title;
  showLoading();
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Unable to fetch movies");
    }
    const data = await response.json();
    displayMovies(data.results || []);
  } catch (error) {
    console.error("Movie fetch error:", error);
    showEmptyState();
  }
}

/* Loading State */
function showLoading() {
  loadingSkeleton.classList.remove("hidden");
  moviesContainer.classList.add("hidden");
  emptyState.classList.add("hidden");
}

function hideLoading() {
  loadingSkeleton.classList.add("hidden");
}

/* Display Movies */
function displayMovies(movies) {
  hideLoading();
  moviesContainer.innerHTML = "";

  if (!movies.length) {
    showEmptyState();
    return;
  }

  emptyState.classList.add("hidden");
  moviesContainer.classList.remove("hidden");
  movies.forEach((movie) => {
    const card = document.createElement("article");
    card.className = "movie";
    const poster = movie.poster_path
      ? IMAGE_URL + movie.poster_path
      : getFallbackPoster();
    const rating = Number(movie.vote_average || 0);
    card.innerHTML = `

            <div class="movie-poster">
                <img
                    src="${poster}"
                    alt="${escapeHTML(movie.title || "Movie")}"
                    loading="lazy"
                >
                <div class="poster-overlay">
                    <button
                        type="button"
                        class="quick-view"
                        data-id="${movie.id}"
                    >
                        View Details
                    </button>
                </div>
            </div>

            <div class="movie-info">
                <div class="movie-header">
                    <h3 class="movie-title">
                        ${escapeHTML(movie.title || "Untitled")}
                    </h3>

                    <span class="rating ${getRatingClass(rating)}">
                        ${rating.toFixed(1)}
                    </span>
                </div>


                <div class="movie-meta">
                    <span class="meta-item">
                        <i class="fa-regular fa-calendar"></i>
                        ${formatDate(movie.release_date)}
                    </span>

                    <span class="meta-item">
                        <i class="fa-solid fa-star"></i>
                        ${formatVotes(movie.vote_count)}
                    </span>
                </div>

                <p class="movie-overview">
                    ${escapeHTML(movie.overview || "No overview available.")}
                </p>
            </div>
        `;
    moviesContainer.appendChild(card);
  });
  attachMovieButtons();
}

/* Movie Buttons */
function attachMovieButtons() {
  document.querySelectorAll(".quick-view").forEach((button) => {
    button.addEventListener("click", () => {
      const movieId = button.dataset.id;
      openModal(movieId);
    });
  });
}

/* Movie Deatils Modal */
async function openModal(movieId) {
  currentMovieId = movieId;
  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
  modalLoading.classList.remove("hidden");
  modalContent.classList.add("hidden");
  modalError.classList.add("hidden");

  try {
    const response = await fetch(
      `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`,
    );
    if (!response.ok) {
      throw new Error("Unable to load movie details");
    }
    const movie = await response.json();
    updateModal(movie);
    modalLoading.classList.add("hidden");
    modalContent.classList.remove("hidden");
  } catch (error) {
    console.error("Movie details error:", error);
    modalLoading.classList.add("hidden");
    modalError.classList.remove("hidden");
  }
}

/* Updated Modal */
function updateModal(movie) {
  modalPoster.src = movie.poster_path
    ? IMAGE_URL + movie.poster_path
    : getFallbackPoster();
  modalPoster.alt = movie.title || "Movie poster";
  modalTitle.textContent = movie.title || "Untitled";
  modalRating.textContent = Number(movie.vote_average || 0).toFixed(1);
  modalReleaseDate.textContent = formatDate(movie.release_date);
  modalLanguage.textContent = getLanguage(movie.original_language);
  modalRuntime.textContent = formatRuntime(movie.runtime);
  modalOverview.textContent = movie.overview || "No overview available.";
  updateGenres(movie.genres || []);
  modalTmdbLink.href = `https://www.themoviedb.org/movie/${movie.id}`;
}

/* Genres */
function updateGenres(genres) {
  modalGenres.innerHTML = "";
  genres.slice(0, 4).forEach((genre) => {
    const tag = document.createElement("span");
    tag.className = "modal-genre";
    tag.textContent = genre.name;
    modalGenres.appendChild(tag);
  });
}

/* Close Modal */
function closeModal() {
  modal.classList.add("hidden");
  document.body.style.overflow = "";
}

modalClose.addEventListener("click", closeModal);
modalOverlay.addEventListener("click", closeModal);
modalRetry.addEventListener("click", () => {
  if (currentMovieId) {
    openModal(currentMovieId);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal();
  }
});

/* Empty State */
function showEmptyState() {
  hideLoading();
  moviesContainer.classList.add("hidden");
  emptyState.classList.remove("hidden");
}

/* Rating */
function getRatingClass(rating) {
  if (rating >= 7.5) {
    return "green";
  }

  if (rating >= 6) {
    return "orange";
  }

  return "red";
}

/* Date */
function formatDate(date) {
  if (!date) {
    return "N/A";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "N/A";
  }

  return parsedDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });
}

/* Votes */
function formatVotes(votes) {
  if (!votes) {
    return "0 votes";
  }

  if (votes >= 1000000) {
    return `${(votes / 1000000).toFixed(1)}M votes`;
  }

  if (votes >= 1000) {
    return `${(votes / 1000).toFixed(1)}K votes`;
  }

  return `${votes} votes`;
}

/* Runtime */
function formatRuntime(minutes) {
  if (!minutes) {
    return "N/A";
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) {
    return `${remainingMinutes}m`;
  }

  if (remainingMinutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${remainingMinutes}m`;
}

/* Language */
function getLanguage(code) {
  const languages = {
    en: "English",
    hi: "Hindi",
    es: "Spanish",
    fr: "French",
    de: "German",
    it: "Italian",
    ja: "Japanese",
    ko: "Korean",
    zh: "Chinese",
    ru: "Russian",
  };
  return languages[code] || (code ? code.toUpperCase() : "N/A");
}

/* Fallback Poster */
function getFallbackPoster() {
  return (
    "https://images.unsplash.com/" +
    "photo-1489599849927-2ee91cede3ba" +
    "?q=80&w=500"
  );
}

/* Html Safety */
function escapeHTML(value) {
  const div = document.createElement("div");
  div.textContent = value || "";
  return div.innerHTML;
}
