const KEY = "3fd2be6f0c70a2a598f084ddfb75487c";
const API_URL = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${KEY}&page=1`;
const TOP_RATED_URL = `https://api.themoviedb.org/3/movie/top_rated?api_key=${KEY}&page=1`;
const MOVIE_DETAILS_URL = `https://api.themoviedb.org/3/movie/`;
const IMG_PATH = "https://image.tmdb.org/t/p/w1280";
const SEARCH_API = `https://api.themoviedb.org/3/search/movie?api_key=${KEY}&query=`;

// DOM Elements
const main = document.getElementById("main");
const moviesContainer = document.getElementById("movies-container");
const loadingSkeleton = document.getElementById("loading-skeleton");
const form = document.getElementById("form");
const search = document.getElementById("search");
const clearSearchBtn = document.getElementById("clear-search");
const sectionTitle = document.getElementById("section-title");
const emptyState = document.getElementById("empty-state");
const showPopularBtn = document.getElementById("show-popular");
const trendingBtn = document.getElementById("trending-btn");
const topRatedBtn = document.getElementById("top-rated-btn");
const gridViewBtn = document.getElementById("grid-view");
const listViewBtn = document.getElementById("list-view");
const scrollToTopBtn = document.getElementById("scroll-to-top");
const currentYear = document.getElementById("current-year");
const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toast-message");

// Modal Elements
const modal = document.getElementById("quick-view-modal");
const modalOverlay = modal.querySelector(".modal-overlay");
const modalClose = modal.querySelector(".modal-close");
const modalLoading = document.getElementById("modal-loading");
const modalContent = document.getElementById("modal-content");
const modalError = document.getElementById("modal-error");
const modalRetryBtn = modalError.querySelector(".modal-retry-btn");
const modalPoster = document.getElementById("modal-poster");
const modalRatingCircle = document.getElementById("modal-rating-circle");
const modalRatingValue = document.getElementById("modal-rating-value");
const modalVoteCount = document.getElementById("modal-vote-count");
const modalTitle = document.getElementById("modal-title");
const modalReleaseDate = document.getElementById("modal-release-date");
const modalLanguage = document.getElementById("modal-language");
const modalRuntime = document.getElementById("modal-runtime");
const modalGenres = document.getElementById("modal-genres");
const modalOverview = document.getElementById("modal-overview");
const modalTmdbLink = document.getElementById("modal-tmdb-link");

// State
let currentView = "grid";
let currentEndpoint = API_URL;
let currentMovieId = null;

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  currentYear.textContent = new Date().getFullYear();
  getMovies(API_URL, "Popular Movies");
  setupEventListeners();
});

// Setup all event listeners
function setupEventListeners() {
  // Search form
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const searchTerm = search.value.trim();
    
    if (searchTerm && searchTerm !== "") {
      getMovies(SEARCH_API + searchTerm, `Search: "${searchTerm}"`);
    } else {
      showToast("Please enter a search term");
    }
  });
  
  // Clear search button
  clearSearchBtn.addEventListener("click", () => {
    search.value = "";
    clearSearchBtn.style.opacity = "0";
    getMovies(API_URL, "Popular Movies");
  });
  
  // Search input events
  search.addEventListener("input", () => {
    clearSearchBtn.style.opacity = search.value ? "1" : "0";
  });
  
  // Trending button
  trendingBtn.addEventListener("click", () => {
    trendingBtn.classList.add("active");
    topRatedBtn.classList.remove("active");
    getMovies(API_URL, "Popular Movies");
    currentEndpoint = API_URL;
  });
  
  // Top rated button
  topRatedBtn.addEventListener("click", () => {
    topRatedBtn.classList.add("active");
    trendingBtn.classList.remove("active");
    getMovies(TOP_RATED_URL, "Top Rated Movies");
    currentEndpoint = TOP_RATED_URL;
  });
  
  // Grid view button
  gridViewBtn.addEventListener("click", () => {
    gridViewBtn.classList.add("active");
    listViewBtn.classList.remove("active");
    moviesContainer.classList.remove("list-view");
    currentView = "grid";
  });
  
  // List view button
  listViewBtn.addEventListener("click", () => {
    listViewBtn.classList.add("active");
    gridViewBtn.classList.remove("active");
    moviesContainer.classList.add("list-view");
    currentView = "list";
  });
  
  // Show popular button
  showPopularBtn.addEventListener("click", () => {
    search.value = "";
    clearSearchBtn.style.opacity = "0";
    getMovies(API_URL, "Popular Movies");
  });
  
  // Scroll to top button
  scrollToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
  
  // Show scroll to top button when scrolling
  window.addEventListener("scroll", () => {
    if (window.scrollY > 500) {
      scrollToTopBtn.style.opacity = "1";
      scrollToTopBtn.style.visibility = "visible";
    } else {
      scrollToTopBtn.style.opacity = "0";
      scrollToTopBtn.style.visibility = "hidden";
    }
  });
  
  // Modal event listeners
  modalClose.addEventListener("click", closeModal);
  modalOverlay.addEventListener("click", closeModal);
  modalRetryBtn.addEventListener("click", () => {
    if (currentMovieId) {
      openModal(currentMovieId);
    }
  });
  
  // ESC key to close modal
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) {
      closeModal();
    }
    
    // Keyboard shortcuts for search
    if ((e.ctrlKey || e.metaKey) && e.key === "k") {
      e.preventDefault();
      search.focus();
    }
    
    if (e.key === "Escape" && document.activeElement === search) {
      search.value = "";
      getMovies(API_URL, "Popular Movies");
    }
  });
}

// Show toast notification
function showToast(message) {
  toastMessage.textContent = message;
  toast.classList.remove("hidden");
  toast.classList.add("show");
  
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => {
      toast.classList.add("hidden");
    }, 300);
  }, 3000);
}

// Generate skeleton loading cards
function showSkeletonLoader(count = 8) {
  loadingSkeleton.innerHTML = "";
  
  for (let i = 0; i < count; i++) {
    const skeletonCard = document.createElement("div");
    skeletonCard.className = "skeleton-card";
    skeletonCard.innerHTML = `
      <div class="skeleton-poster"></div>
      <div class="skeleton-content">
        <div class="skeleton-title"></div>
        <div class="skeleton-text short"></div>
        <div class="skeleton-text"></div>
        <div class="skeleton-text"></div>
      </div>
    `;
    loadingSkeleton.appendChild(skeletonCard);
  }
  
  loadingSkeleton.classList.remove("hidden");
  moviesContainer.classList.add("hidden");
  emptyState.classList.add("hidden");
}

// Get rating color class
const getClassByRate = (vote) => {
  if (vote >= 7.5) return "green";
  else if (vote >= 7) return "orange";
  else return "red";
};

// Format date
function formatDate(dateString) {
  if (!dateString) return "N/A";
  
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

// Format vote count
function formatVoteCount(voteCount) {
  if (voteCount >= 1000000) {
    return (voteCount / 1000000).toFixed(1) + 'M';
  } else if (voteCount >= 1000) {
    return (voteCount / 1000).toFixed(1) + 'K';
  }
  return voteCount;
}

// Format runtime
function formatRuntime(minutes) {
  if (!minutes) return "N/A";
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (hours === 0) {
    return `${remainingMinutes}m`;
  }
  return `${hours}h ${remainingMinutes}m`;
}

// Get language name from code
function getLanguageName(code) {
  const languages = {
    'en': 'English',
    'es': 'Spanish',
    'fr': 'French',
    'de': 'German',
    'it': 'Italian',
    'ja': 'Japanese',
    'ko': 'Korean',
    'zh': 'Chinese',
    'ru': 'Russian',
    'hi': 'Hindi'
  };
  return languages[code] || code.toUpperCase();
}

// Show movies
function showMovies(movies) {
  loadingSkeleton.classList.add("hidden");
  moviesContainer.classList.remove("hidden");
  
  if (movies.length === 0) {
    emptyState.classList.remove("hidden");
    moviesContainer.classList.add("hidden");
    return;
  }
  
  moviesContainer.innerHTML = "";
  
  movies.forEach((movie) => {
    const { title, poster_path, vote_average, overview, release_date, vote_count, id } = movie;
    
    const movieElement = document.createElement("div");
    movieElement.className = "movie";
    movieElement.innerHTML = `
      <div class="movie-poster">
        <img
          src="${poster_path ? IMG_PATH + poster_path : 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1450'}"
          alt="${title}"
          loading="lazy"
        />
        <div class="poster-overlay">
          <button class="quick-view" onclick="openModal('${id}')">
            <i class="fas fa-eye"></i> Quick View
          </button>
        </div>
      </div>
      <div class="movie-info">
        <div class="movie-header">
          <h3 class="movie-title">${title}</h3>
          <div class="rating ${getClassByRate(vote_average)}">
            ${vote_average.toFixed(1)}
          </div>
        </div>
        
        <div class="movie-meta">
          <div class="meta-item">
            <i class="fas fa-calendar"></i>
            <span>${formatDate(release_date)}</span>
          </div>
          <div class="meta-item">
            <i class="fas fa-star"></i>
            <span>${formatVoteCount(vote_count)} votes</span>
          </div>
        </div>
        
        <p class="movie-overview">${overview || "No overview available."}</p>
      </div>
    `;
    
    moviesContainer.appendChild(movieElement);
  });
}

// Get movies from API
async function getMovies(url, title = "Movies") {
  try {
    sectionTitle.textContent = title;
    showSkeletonLoader();
    
    const res = await fetch(url);
    
    if (!res.ok) {
      throw new Error(`API Error: ${res.status}`);
    }
    
    const data = await res.json();
    showMovies(data.results);
    
    if (url.includes("search/movie") && data.results.length > 0) {
      showToast(`Found ${data.results.length} movie${data.results.length > 1 ? 's' : ''}`);
    }
    
  } catch (error) {
    console.error("Error fetching movies:", error);
    showToast("Failed to load movies. Please try again.");
    
    loadingSkeleton.classList.add("hidden");
    emptyState.classList.remove("hidden");
  }
}

// Get movie details by ID
async function getMovieDetails(movieId) {
  try {
    const url = `${MOVIE_DETAILS_URL}${movieId}?api_key=${KEY}&append_to_response=credits`;
    const res = await fetch(url);
    
    if (!res.ok) {
      throw new Error(`API Error: ${res.status}`);
    }
    
    return await res.json();
  } catch (error) {
    console.error("Error fetching movie details:", error);
    throw error;
  }
}

// Open modal with movie details
async function openModal(movieId) {
  currentMovieId = movieId;
  
  // Show modal
  modal.classList.remove("hidden");
  document.body.classList.add("modal-open");
  
  // Reset modal state
  modalLoading.classList.remove("hidden");
  modalContent.classList.add("hidden");
  modalError.classList.add("hidden");
  
  try {
    const movie = await getMovieDetails(movieId);
    
    // Update modal content
    modalPoster.src = movie.poster_path 
      ? IMG_PATH + movie.poster_path 
      : 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1450';
    modalPoster.alt = movie.title;
    
    // Update rating
    const ratingClass = getClassByRate(movie.vote_average);
    modalRatingCircle.className = `rating-circle ${ratingClass}`;
    modalRatingValue.textContent = movie.vote_average.toFixed(1);
    modalVoteCount.textContent = formatVoteCount(movie.vote_count);
    
    // Update details
    modalTitle.textContent = movie.title;
    modalReleaseDate.textContent = formatDate(movie.release_date);
    modalLanguage.textContent = getLanguageName(movie.original_language);
    modalRuntime.textContent = formatRuntime(movie.runtime);
    
    // Update genres
    modalGenres.innerHTML = "";
    movie.genres.slice(0, 3).forEach(genre => {
      const genreElement = document.createElement("span");
      genreElement.className = "modal-genre";
      genreElement.textContent = genre.name;
      modalGenres.appendChild(genreElement);
    });
    
    // Update overview
    modalOverview.textContent = movie.overview || "No overview available.";
    
    // Update TMDb link
    modalTmdbLink.href = `https://www.themoviedb.org/movie/${movie.id}`;
    
    // Switch to content view
    modalLoading.classList.add("hidden");
    modalContent.classList.remove("hidden");
    
  } catch (error) {
    console.error("Error loading modal:", error);
    modalLoading.classList.add("hidden");
    modalError.classList.remove("hidden");
  }
}

// Close modal
function closeModal() {
  modal.classList.add("hidden");
  document.body.classList.remove("modal-open");
  
  // Reset modal state for next open
  setTimeout(() => {
    modalLoading.classList.remove("hidden");
    modalContent.classList.add("hidden");
    modalError.classList.add("hidden");
  }, 300);
}

// Make openModal globally accessible
window.openModal = openModal;