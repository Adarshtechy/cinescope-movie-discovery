# 🎬 CineScope - Movie Discovery App

CineScope is a simple and responsive movie discovery web application built with **HTML, CSS, and Vanilla JavaScript**. It uses the **TMDb API** to fetch popular movies, top-rated movies, search results, ratings, and detailed movie information.

The project focuses on a clean user interface, simple navigation, and practical API integration without unnecessary frameworks or libraries.

## 📸 Preview

<img width="2133" height="3527" alt="screenshot_2026-08-25-22_26_31" src="https://github.com/user-attachments/assets/d2992e2d-429a-46ff-9ff5-a0babe440734" />

<img width="2133" height="1013" alt="screenshot_2026-08-25-22_27_31" src="https://github.com/user-attachments/assets/88254b86-0bed-4ce2-93b9-943dc841bef3" />

---

## ✨ Features

- 🔥 Browse popular movies
- ⭐ Explore top-rated movies
- 🔍 Search movies by title
- 🎬 View movie posters and basic information
- ⭐ Display movie ratings
- 📅 Show release dates
- 🗳️ Display vote counts
- 📖 View detailed movie information
- 🏷️ Display movie genres
- ⏱️ Show movie runtime
- 🌎 Display original language
- 🔗 Open movie details on TMDb
- ⏳ Loading skeleton while fetching data
- ⚠️ Error and empty states
- 📱 Fully responsive design
- 🌙 Clean dark-themed interface

---

## 🛠️ Technologies Used

### Frontend

- **HTML5** - Semantic page structure
- **CSS3** - Styling and responsive layout
- **JavaScript (ES6+)** - Application logic and DOM manipulation

### API

- **TMDb API** - Movie data and details

### Other

- **Font Awesome** - Icons
- **Google Fonts** - Inter font family

---

## 📂 Project Structure

```text
CineScope/
│
├── index.html
├── style.css
├── script.js
└── README.md
```

---

## ⚙️ How It Works

CineScope communicates with the TMDb API to retrieve movie information.

# Application Flow

```text
User
  │
  ├── Browse Popular Movies
  │
  ├── Browse Top Rated Movies
  │
  └── Search for a Movie
  │
  ▼
JavaScript
  │
  ▼
TMDb API
  │
  ▼
Movie Data
  │
  ▼
Dynamic Movie Cards
  │
  ▼
Movie Details Modal
```

## 🚀 Getting Started
1. Clone the Repository
   ```bash
   git clone https://github.com/Adarshtechy/cinescope-movie-discovery.git
   ```
2. Open the Project

Navigate to the project directory:
```bash
cd cinescope-movie-discovery
```

3. Add Your TMDb API Key

Open:
```bash
script.js
```

Find:
```bash
const API_KEY = "YOUR_TMDB_API_KEY";
```

Replace it with your TMDb API key:
```bash
const API_KEY = "your_api_key_here";
```

4. Run the Application
You can open index.html directly in your browser.

## 🔑 Getting a TMDb API Key

CineScope uses the TMDb API to retrieve movie information.

You can create an account and request an API key from:

TMDb{https://www.themoviedb.org/}

After obtaining your key, add it to script.js.
