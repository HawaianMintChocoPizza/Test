/**
 * 취향저격 - Application Logic
 * OTT Content Recommendation Engine & UI Interactions
 */

// ==========================================================================
// 1. MOVIE DATABASE
// ==========================================================================
const MOVIE_DATABASE = [
  {
    id: "m1",
    title: "악마는 프라다를 입는다",
    year: 2006,
    poster: "https://media.themoviedb.org/t/p/w600_and_h900_face/lxjGbkRnY9d2j8cxIHxX57NNvRH.jpg",
    rating: 7.4,
    ott: ["Disney+"],
    genre: ["드라마", "코미디"],
    cast: ["Meryl Streep", "Anne Hathaway", "Emily Blunt", "Stanley Tucci", "Simon Baker", "Adrian Grenier"],
    director: "David Frankel",
    matchRate: 74
  },
  {
    id: "m2",
    title: "어벤져스",
    year: 2012,
    poster: "https://media.themoviedb.org/t/p/w300_and_h450_face/krgjV3rJtBcEpQehODKXNCt6uFL.jpg",
    rating: 8.0,
    ott: ["Disney+"],
    genre: ["SF", "액션", "모험"],
    cast: ["Robert Downey Jr.", "Chris Evans", "Mark Ruffalo", "Chris Hemsworth", "Scarlett Johansson", "Jeremy Renner"],
    director: "Joss Whedon",
    matchRate: 80
  },
  {
    id: "m3",
    title: "브레이킹 배드",
    year: 2008,
    poster: "https://media.themoviedb.org/t/p/w300_and_h450_face/ztkUQFLlC19CCMYHW9o1zWhJRNq.jpg",
    rating: 8.9,
    ott: ["Netflix"],
    genre: ["드라마", "범죄"],
    cast: ["Bryan Cranston", "Aaron Paul", "Anna Gunn", "RJ Mitte", "Dean Norris", "Betsy Brandt"],
    director: "Vince Gilligan",
    matchRate: 89
  },
  {
    id: "m4",
    title: "프리즌 브레이크",
    year: 2005,
    poster: "https://media.themoviedb.org/t/p/w300_and_h450_face/5E1BhkCgjLBlqx557Z5yzcN0i88.jpg",
    rating: 8.1,
    ott: ["Disney+"],
    genre: ["액션", "모험", "범죄", "드라마"],
    cast: ["Wentworth Miller", "Dominic Purcell", "Robert Knepper", "Amaury Nolasco", "Wade Williams", "Sarah Wayne Callies"],
    director: "Paul T. Scheuring",
    matchRate: 81
  },
  {
    id: "m5",
    title: "하우스",
    year: 2004,
    poster: "https://media.themoviedb.org/t/p/w300_and_h450_face/3Cz7ySOQJmqiuTdrc6CY0r65yDI.jpg",
    rating: 8.6,
    ott: ["Netflix"],
    genre: ["드라마", "미스터리"],
    cast: ["Hugh Laurie", "Robert Sean Leonard", "Omar Epps", "Jesse Spencer", "Lisa Edelstein", "Jennifer Morrison"],
    director: "David Shore",
    matchRate: 86
  },
  {
    id: "m6",
    title: "케이팝 데몬 헌터스",
    year: 2025,
    poster: "https://media.themoviedb.org/t/p/w300_and_h450_face/5fqcLmrgVDicMuGLOa9PKErFP72.jpg",
    rating: 8.0,
    ott: ["Netflix"],
    genre: ["판타지", "음악", "코미디", "애니메이션"],
    cast: ["Arden Cho", "May Hong", "Yoo Jung", "Ahn Hyo-seop", "Kim Yunjin", "Ken Jeong"],
    director: "Maggie Kang",
    matchRate: 80
  },
  {
    id: "m7",
    title: "스파이더맨: 홈커밍",
    year: 2017,
    poster: "https://media.themoviedb.org/t/p/w300_and_h450_face/hjki9weYYVABvkpZbX5jBOmKXXv.jpg",
    rating: 7.3,
    ott: ["Netflix"],
    genre: ["액션", "모험", "SF"],
    cast: ["Tom Holland", "Michael Keaton", "Robert Downey Jr.", "Marisa Tomei", "Jon Favreau", "Zendaya"],
    director: "Jon Watts",
    matchRate: 73
  },
  {
    id: "m8",
    title: "존 윅 4",
    year: 2023,
    poster: "https://media.themoviedb.org/t/p/w300_and_h450_face/h3LsdSBzhRnBebz4BTpAhh63PD3.jpg",
    rating: 7.7,
    ott: ["Netflix"],
    genre: ["액션", "스릴러", "범죄"],
    cast: ["Keanu Reeves", "Donnie Yen", "Bill Skarsgård", "Ian McShane", "Laurence Fishburne", "Lance Reddick"],
    director: "Chad Stahelski",
    matchRate: 77
  },
  {
    id: "m9",
    title: "인사이드 아웃 2",
    year: 2024,
    poster: "https://media.themoviedb.org/t/p/w300_and_h450_face/x2BHx02jMbvpKjMvbf8XxJkYwHJ.jpg",
    rating: 7.5,
    ott: ["Disney+"],
    genre: ["애니메이션", "모험", "코미디", "가족"],
    cast: ["Amy Poehler", "Maya Hawke", "Kensington Tallman", "Liza Lapira", "Tony Hale", "Lewis Black"],
    director: "Kelsey Mann",
    matchRate: 75
  },
  {
    id: "m10",
    title: "탑건: 매버릭",
    year: 2022,
    poster: "https://media.themoviedb.org/t/p/w300_and_h450_face/jeqXUwNilvNqNXqAHsdwm5pEfae.jpg",
    rating: 8.2,
    ott: ["웨이브"],
    genre: ["액션", "드라마"],
    cast: ["Tom Cruise", "Miles Teller", "Jennifer Connelly", "Bashir Salahuddin", "Jon Hamm", "Charles Parnell"],
    director: "Joseph Kosinski",
    matchRate: 82
  }
];

// ==========================================================================
// 2. PREFERENCE SCORING TABLES (FROM PRD)
// ==========================================================================
const SCORING_TABLE = {
  genre: {
    "5.0": { preferred: 10, disliked: -15 },
    "4.5": { preferred: 9, disliked: -13 },
    "4.0": { preferred: 8, disliked: -11 },
    "3.5": { preferred: 4, disliked: -5 },
    "3.0": { preferred: 0, disliked: 0 },
    "2.5": { preferred: -5, disliked: -8 },
    "2.0": { preferred: -8, disliked: -11 },
    "1.5": { preferred: -11, disliked: -13 },
    "1.0": { preferred: -15, disliked: -18 }
  },
  actor: {
    "5.0": { preferred: 7, disliked: -10 },
    "4.5": { preferred: 6, disliked: -9 },
    "4.0": { preferred: 5, disliked: -8 },
    "3.5": { preferred: 3, disliked: -4 },
    "3.0": { preferred: 0, disliked: 0 },
    "2.5": { preferred: -3, disliked: -5 },
    "2.0": { preferred: -5, disliked: -7 },
    "1.5": { preferred: -7, disliked: -9 },
    "1.0": { preferred: -10, disliked: -12 }
  },
  director: {
    "5.0": { preferred: 5, disliked: -7 },
    "4.5": { preferred: 4, disliked: -6 },
    "4.0": { preferred: 3, disliked: -5 },
    "3.5": { preferred: 2, disliked: -3 },
    "3.0": { preferred: 0, disliked: 0 },
    "2.5": { preferred: -2, disliked: -3 },
    "2.0": { preferred: -3, disliked: -5 },
    "1.5": { preferred: -5, disliked: -6 },
    "1.0": { preferred: -7, disliked: -8 }
  }
};

// ==========================================================================
// 3. APPLICATION STATE
// ==========================================================================
const state = {
  isLoggedIn: false,
  currentUser: null,
  currentScreen: "main",
  selectedEvalMovies: [],
  ratings: {},        // { movieId: number }
  selectedTags: {}    // { movieId: Set<string> }
};

// ==========================================================================
// 4. UI ELEMENT CACHE
// ==========================================================================
const el = {
  logoLink: document.getElementById("logoLink"),
  navAiPicks: document.getElementById("navAiPicks"),
  navItems: document.querySelectorAll(".nav-item"),
  userHeaderArea: document.getElementById("userHeaderArea"),
  headerLoginBtn: document.getElementById("headerLoginBtn"),

  screens: {
    main: document.getElementById("screen-main"),
    login: document.getElementById("screen-login"),
    evaluation: document.getElementById("screen-evaluation"),
    recommendation: document.getElementById("screen-recommendation")
  },

  heroStartBtn: document.getElementById("heroStartBtn"),

  // Login Form
  loginForm: document.getElementById("loginForm"),
  loginId: document.getElementById("loginId"),
  loginPw: document.getElementById("loginPw"),
  submitLoginBtn: document.getElementById("submitLoginBtn"),
  joinBtn: document.getElementById("joinBtn"),

  // Signup Form
  loginCard: document.getElementById("loginCard"),
  signupCard: document.getElementById("signupCard"),
  signupForm: document.getElementById("signupForm"),
  signupId: document.getElementById("signupId"),
  signupEmail: document.getElementById("signupEmail"),
  signupPw: document.getElementById("signupPw"),
  signupConfirmPw: document.getElementById("signupConfirmPw"),
  submitSignupBtn: document.getElementById("submitSignupBtn"),
  backToLoginBtn: document.getElementById("backToLoginBtn"),

  // OTT Link Buttons
  ottNetflixBtn: document.getElementById("ottNetflixBtn"),
  ottDisneyBtn: document.getElementById("ottDisneyBtn"),
  ottWatchaBtn: document.getElementById("ottWatchaBtn"),

  // Evaluation Page
  evaluationGrid: document.getElementById("evaluationGrid"),
  viewRecommendationsBtn: document.getElementById("viewRecommendationsBtn"),

  // Recommendation Page
  recommendationGrid: document.getElementById("recommendationGrid"),
  reEvaluateBtn: document.getElementById("reEvaluateBtn"),
  goMainBtn: document.getElementById("goMainBtn"),

  // Toast
  toast: document.getElementById("toast")
};

// ==========================================================================
// 5. ROUTING & SCREEN TRANSITIONS
// ==========================================================================
function showScreen(screenId) {
  // Hide all screens
  Object.keys(el.screens).forEach(key => {
    el.screens[key].classList.remove("active");
  });

  // Show target screen
  el.screens[screenId].classList.add("active");
  state.currentScreen = screenId;

  // Update header nav active states
  el.navItems.forEach(item => {
    item.classList.remove("active");
    if (item.getAttribute("data-target") === screenId) {
      item.classList.add("active");
    }
  });

  // Scroll to top
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Check auth before navigation
function navigateToEvaluation() {
  if (state.isLoggedIn) {
    initEvaluationScreen();
    showScreen("evaluation");
  } else {
    showToast("취향 분석을 이용하시려면 먼저 로그인해주세요.");
    showScreen("login");
  }
}

// Navigation Event Listeners
el.logoLink.addEventListener("click", (e) => {
  e.preventDefault();
  showScreen("main");
});

el.navItems.forEach(item => {
  item.addEventListener("click", (e) => {
    e.preventDefault();
    if (item.classList.contains("disabled")) return;
    const target = item.getAttribute("data-target");
    if (target === "evaluation") {
      navigateToEvaluation();
    } else {
      showScreen(target);
    }
  });
});

el.heroStartBtn.addEventListener("click", () => {
  navigateToEvaluation();
});

el.headerLoginBtn.addEventListener("click", () => {
  showScreen("login");
});

// ==========================================================================
// 6. USER AUTHENTICATION & OTT LINKING
// ==========================================================================
function performLogin(username) {
  state.isLoggedIn = true;
  state.currentUser = username;

  // Update Header UI
  el.userHeaderArea.innerHTML = `
    <div class="user-profile-menu">
      <div class="profile-avatar">${username.charAt(0).toUpperCase()}</div>
      <span>${username} 님</span>
      <button class="btn-logout" id="headerLogoutBtn">로그아웃</button>
    </div>
  `;

  // Re-bind logout listener
  document.getElementById("headerLogoutBtn").addEventListener("click", performLogout);

  // Activate AI Picks nav link
  el.navAiPicks.classList.remove("disabled");
}

function performLogout() {
  state.isLoggedIn = false;
  state.currentUser = null;
  state.ratings = {};
  state.selectedTags = {};

  // Reset Header UI
  el.userHeaderArea.innerHTML = `
    <button class="btn btn-login-nav" id="headerLoginBtn">로그인</button>
  `;

  // Re-bind login listener
  document.getElementById("headerLoginBtn").addEventListener("click", () => {
    showScreen("login");
  });

  // Disable AI Picks nav link
  el.navAiPicks.classList.add("disabled");

  showToast("로그아웃되었습니다.");
  showScreen("main");
}

// Local user store
const getRegisteredUsers = () => {
  try {
    const data = localStorage.getItem("registeredUsers");
    return data ? JSON.parse(data) : {
      admin: { password: "password", email: "admin@cinema.ai" }
    };
  } catch (e) {
    return { admin: { password: "password", email: "admin@cinema.ai" } };
  }
};

const saveRegisteredUsers = (users) => {
  localStorage.setItem("registeredUsers", JSON.stringify(users));
};

// Standard Login Form Submit
el.loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const id = el.loginId.value.trim();
  const pw = el.loginPw.value.trim();

  if (id && pw) {
    const users = getRegisteredUsers();
    const user = users[id];

    if (user && user.password === pw) {
      performLogin(id);
      showToast(`${id}님, 로그인을 환영합니다!`);

      // Auto redirect to main screen
      showScreen("main");

      // Clear form inputs
      el.loginId.value = "";
      el.loginPw.value = "";
    } else {
      showToast("아이디 또는 비밀번호가 올바르지 않습니다.");
    }
  }
});

// 회원가입 Button click (Switch to Signup form)
el.joinBtn.addEventListener("click", () => {
  el.loginCard.style.display = "none";
  el.signupCard.style.display = "block";
});

// 로그인으로 돌아가기 Button click (Switch back)
el.backToLoginBtn.addEventListener("click", () => {
  el.signupCard.style.display = "none";
  el.loginCard.style.display = "block";
});

// Signup Form Submit
el.signupForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const id = el.signupId.value.trim();
  const email = el.signupEmail.value.trim();
  const pw = el.signupPw.value.trim();
  const confirmPw = el.signupConfirmPw.value.trim();

  if (!id || !email || !pw || !confirmPw) {
    showToast("모든 필드를 입력해 주세요.");
    return;
  }

  if (pw.length < 4) {
    showToast("비밀번호는 최소 4자 이상이어야 합니다.");
    return;
  }

  if (pw !== confirmPw) {
    showToast("비밀번호가 일치하지 않습니다.");
    return;
  }

  const users = getRegisteredUsers();
  if (users[id]) {
    showToast("이미 존재하는 아이디입니다.");
    return;
  }

  // Register user
  users[id] = { password: pw, email: email };
  saveRegisteredUsers(users);

  showToast("회원가입이 완료되었습니다! 로그인해 주세요.");

  // Pre-fill login ID and reset signup inputs
  el.loginId.value = id;
  el.signupId.value = "";
  el.signupEmail.value = "";
  el.signupPw.value = "";
  el.signupConfirmPw.value = "";

  // Switch to Login screen card
  el.signupCard.style.display = "none";
  el.loginCard.style.display = "block";
});

// OTT account linking (simulated)
function linkOTTAccount(platformName, color) {
  const simulatedUser = `${platformName}_User`;
  performLogin(simulatedUser);
  showToast(`${platformName} 계정이 연동되었습니다. 환영합니다!`);

  // Auto redirect to main screen
  showScreen("main");
}

el.ottNetflixBtn.addEventListener("click", () => linkOTTAccount("Netflix", "#E50914"));
el.ottDisneyBtn.addEventListener("click", () => linkOTTAccount("Disney+", "#113CCF"));
el.ottWatchaBtn.addEventListener("click", () => linkOTTAccount("Watcha", "#FF0558"));

// ==========================================================================
// 7. INITIAL PREFERENCE COLLECTION (EVALUATION)
// ==========================================================================
function initEvaluationScreen() {
  state.ratings = {};
  state.selectedTags = {};
  el.viewRecommendationsBtn.disabled = true;

  // PRD Requirement: Select 3 random movies from the database
  // To make evaluation feel diverse but stable, we clone the database and shuffle it
  const dbCopy = [...MOVIE_DATABASE];

  // Shuffle array
  for (let i = dbCopy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [dbCopy[i], dbCopy[j]] = [dbCopy[j], dbCopy[i]];
  }

  // Take first 3 movies
  state.selectedEvalMovies = dbCopy.slice(0, 3);

  // Render cards
  renderEvaluationCards();
}

function renderEvaluationCards() {
  el.evaluationGrid.innerHTML = "";

  state.selectedEvalMovies.forEach(movie => {
    const cardEl = document.createElement("div");
    cardEl.className = "movie-eval-card";
    cardEl.id = `eval-card-${movie.id}`;

    // OTT platform lower case class
    const ottClass = movie.ott[0].toLowerCase().replace("+", "");

    cardEl.innerHTML = `
      <div class="poster-wrapper">
        <img src="${movie.poster}" alt="${movie.title}" class="poster-img">
        <div class="poster-overlay"></div>
        <span class="ott-badge ${ottClass}">${movie.ott[0]}</span>
        <span class="match-badge">
          <span class="match-icon">★</span>
          ${movie.matchRate}% Match
        </span>
      </div>
      
      <div class="movie-info-body">
        <h3 class="movie-title">${movie.title}</h3>
        
        <div class="movie-details">
          <div class="detail-row">
            <span class="detail-label">개봉</span>
            <span class="detail-value">${movie.year}년</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">평점</span>
            <span class="detail-value">★ ${movie.rating.toFixed(1)}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">장르</span>
            <span class="detail-value">${movie.genre.join(", ")}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">출연</span>
            <span class="detail-value">${movie.cast.join(", ")}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">감독</span>
            <span class="detail-value">${movie.director}</span>
          </div>
        </div>
        
        <!-- Rating Component -->
        <div class="rating-wrapper">
          <div class="rating-title">작품 평점</div>
          <div class="star-rating" data-movie-id="${movie.id}">
            ${renderStarsHTML()}
          </div>
          <div class="rating-value-display" id="rating-val-${movie.id}">평점 선택 전</div>
        </div>
      </div>
      
      <!-- Preference tags selection panel (Initially hidden) -->
      <div class="preference-selection-panel" id="pref-panel-${movie.id}">
        <div class="preference-prompt" id="pref-prompt-${movie.id}">이 작품이 좋거나 아쉬운 이유가 있나요?</div>
        <div class="preference-tags" id="pref-tags-${movie.id}">
          <!-- Pills will be rendered here based on rating -->
        </div>
      </div>
    `;

    el.evaluationGrid.appendChild(cardEl);

    // Bind rating events for this card
    bindRatingEvents(movie);
  });
}

function renderStarsHTML() {
  let starsHTML = "";
  for (let i = 1; i <= 5; i++) {
    starsHTML += `
      <div class="star-container" data-star-index="${i}">
        <svg class="star-svg" viewBox="0 0 24 24">
          <path class="star-bg" d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.4 8.168L12 18.896l-7.334 3.857 1.4-8.168L.132 9.21l8.2-1.192z" />
        </svg>
        <div class="star-fill-wrapper" id="star-fill-wrapper-${i}">
          <svg class="star-svg" viewBox="0 0 24 24">
            <path class="star-fg" d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.4 8.168L12 18.896l-7.334 3.857 1.4-8.168L.132 9.21l8.2-1.192z" />
          </svg>
        </div>
        <div class="star-half left" data-val="${i - 0.5}"></div>
        <div class="star-half right" data-val="${i}"></div>
      </div>
    `;
  }
  return starsHTML;
}

// ==========================================================================
// 8. RATING AND PREFERENCE SELECTION INTERACTION
// ==========================================================================
function bindRatingEvents(movie) {
  const cardEl = document.getElementById(`eval-card-${movie.id}`);
  const starRatingEl = cardEl.querySelector(".star-rating");
  const valueDisplayEl = document.getElementById(`rating-val-${movie.id}`);
  const starContainers = starRatingEl.querySelectorAll(".star-container");

  let tempRating = 0;

  function updateStarFills(val) {
    starContainers.forEach((star, idx) => {
      const starNum = idx + 1;
      const fillWrapper = star.querySelector(".star-fill-wrapper");

      if (starNum <= val) {
        fillWrapper.style.width = "100%";
      } else if (starNum - 0.5 === val) {
        fillWrapper.style.width = "50%";
      } else {
        fillWrapper.style.width = "0%";
      }
    });
  }

  starRatingEl.addEventListener("mousemove", (e) => {
    if (!e.target.classList.contains("star-half")) return;

    const hoverVal = parseFloat(e.target.getAttribute("data-val"));
    tempRating = hoverVal;
    updateStarFills(hoverVal);
    valueDisplayEl.textContent = `${hoverVal.toFixed(1)} / 5.0`;
  });

  starRatingEl.addEventListener("mouseleave", () => {
    const activeRating = state.ratings[movie.id] || 0;
    updateStarFills(activeRating);
    if (activeRating > 0) {
      valueDisplayEl.textContent = `${activeRating.toFixed(1)} / 5.0`;
    } else {
      valueDisplayEl.textContent = "평점 선택 전";
    }
  });

  starRatingEl.addEventListener("click", (e) => {
    if (!e.target.classList.contains("star-half")) return;

    const clickedVal = parseFloat(e.target.getAttribute("data-val"));
    const oldRating = state.ratings[movie.id];

    state.ratings[movie.id] = clickedVal;
    updateStarFills(clickedVal);
    valueDisplayEl.textContent = `${clickedVal.toFixed(1)} / 5.0`;

    // Check if category changed (preferred: rating >= 4.0, disliked: rating < 4.0)
    const wasPreferred = oldRating !== undefined && oldRating >= 4.0;
    const isPreferred = clickedVal >= 4.0;

    // If category changed or first time rating, rebuild and slide open the preference panel
    if (oldRating === undefined || wasPreferred !== isPreferred) {
      state.selectedTags[movie.id] = new Set(); // Reset tags
      renderPreferencePanel(movie, isPreferred);
    }

    // Verify if all 3 movies are rated to enable next button
    checkEvaluationCompleteness();
  });
}

function renderPreferencePanel(movie, isPreferred) {
  const panelEl = document.getElementById(`pref-panel-${movie.id}`);
  const promptEl = document.getElementById(`pref-prompt-${movie.id}`);
  const tagsEl = document.getElementById(`pref-tags-${movie.id}`);

  // Set appropriate prompt text
  if (isPreferred) {
    promptEl.textContent = "이 작품을 선호하는 이유는 무엇인가요?";
  } else {
    promptEl.textContent = "이 작품을 선호하지 않는 이유는 무엇인가요?";
  }

  // Compile unique values for this movie's tags
  // Genres + Cast members + Director
  const tagItems = [];

  // Genres
  movie.genre.forEach(g => tagItems.push({ label: `장르: ${g}`, value: g, type: "genre" }));

  // Cast (first 2 to keep it neat)
  movie.cast.forEach(c => tagItems.push({ label: `배우: ${c}`, value: c, type: "actor" }));

  // Director
  tagItems.push({ label: `감독: ${movie.director}`, value: movie.director, type: "director" });

  // Render tags
  tagsEl.innerHTML = "";
  tagItems.forEach(item => {
    const btn = document.createElement("button");
    btn.className = "tag-btn";
    btn.textContent = item.label;
    btn.setAttribute("data-tag-value", item.value);

    btn.addEventListener("click", () => {
      const currentTags = state.selectedTags[movie.id];
      if (currentTags.has(item.value)) {
        currentTags.delete(item.value);
        btn.classList.remove("selected");
      } else {
        currentTags.add(item.value);
        btn.classList.add("selected");
      }
    });

    tagsEl.appendChild(btn);
  });

  // Slide open the panel by adding active class
  panelEl.classList.add("active");
}

function checkEvaluationCompleteness() {
  const ratedCount = Object.keys(state.ratings).length;
  // Enable the button only when all 3 movies are rated
  if (ratedCount === 3) {
    el.viewRecommendationsBtn.removeAttribute("disabled");
  } else {
    el.viewRecommendationsBtn.setAttribute("disabled", "true");
  }
}

// Bind recommendations click
el.viewRecommendationsBtn.addEventListener("click", () => {
  generateRecommendations();
  showScreen("recommendation");
});

// ==========================================================================
// 9. RECOMMENDATION ENGINE & REASON GENERATOR
// ==========================================================================
function generateRecommendations() {
  // 1. Calculate cumulative preference scores from user inputs
  const genreScores = {};
  const actorScores = {};
  const directorScores = {};

  state.selectedEvalMovies.forEach(movie => {
    const rating = state.ratings[movie.id];
    if (rating === undefined) return;

    const isPreferred = rating >= 4.0;
    const selected = state.selectedTags[movie.id] || new Set();

    // For each selected tag, determine its type and look up scoring rules
    selected.forEach(tagValue => {
      let tagType = "";
      if (movie.genre.includes(tagValue)) {
        tagType = "genre";
      } else if (movie.cast.includes(tagValue)) {
        tagType = "actor";
      } else if (movie.director === tagValue) {
        tagType = "director";
      }

      if (!tagType) return;

      // Lookup score
      const ratingKey = rating.toFixed(1);
      const scoreLookup = SCORING_TABLE[tagType][ratingKey];
      const score = scoreLookup ? (isPreferred ? scoreLookup.preferred : scoreLookup.disliked) : 0;

      // Accumulate
      if (tagType === "genre") {
        genreScores[tagValue] = (genreScores[tagValue] || 0) + score;
      } else if (tagType === "actor") {
        actorScores[tagValue] = (actorScores[tagValue] || 0) + score;
      } else if (tagType === "director") {
        directorScores[tagValue] = (directorScores[tagValue] || 0) + score;
      }
    });
  });

  // 2. Score all remaining database movies
  const evaluatedIds = state.selectedEvalMovies.map(m => m.id);
  const candidates = MOVIE_DATABASE.filter(movie => !evaluatedIds.includes(movie.id));

  const scoredCandidates = candidates.map(movie => {
    let genreSum = 0;
    let actorSum = 0;
    let directorSum = 0;
    const reasons = [];

    // Genres sum
    movie.genre.forEach(g => {
      const score = genreScores[g] || 0;
      genreSum += score;
      if (score > 0) {
        reasons.push({
          text: `선호 장르 ${g} 포함`,
          score: score
        });
      } else if (score < 0) {
        reasons.push({
          text: `비선호 장르 ${g} 포함`,
          score: score
        });
      }
    });

    // Cast members sum
    movie.cast.forEach(a => {
      const score = actorScores[a] || 0;
      actorSum += score;
      if (score > 0) {
        reasons.push({
          text: `선호 배우 ${a} 출연`,
          score: score
        });
      } else if (score < 0) {
        reasons.push({
          text: `비선호 배우 ${a} 출연`,
          score: score
        });
      }
    });

    // Director sum
    const dScore = directorScores[movie.director] || 0;
    directorSum += dScore;
    if (dScore > 0) {
      reasons.push({
        text: `선호 감독 ${movie.director} 작품`,
        score: dScore
      });
    } else if (dScore < 0) {
      reasons.push({
        text: `비선호 감독 ${movie.director} 작품`,
        score: dScore
      });
    }

    const totalScore = genreSum + actorSum + directorSum;

    return {
      movie: movie,
      totalScore: totalScore,
      reasons: reasons
    };
  });

  // 3. Sort all candidates
  // - First by totalScore descending
  // - Break ties by the movie's TMDB rating descending
  scoredCandidates.sort((a, b) => {
    if (b.totalScore !== a.totalScore) {
      return b.totalScore - a.totalScore;
    }
    return b.movie.rating - a.movie.rating;
  });

  // 4. Select top 3 recommendations (we don't filter c.totalScore > 0 so we always have a full 3 recommendations, no fake fallback data)
  const finalRecommendations = scoredCandidates.slice(0, 3);

  // Render recommendations screen
  renderRecommendations(finalRecommendations);
}

function renderRecommendations(recs) {
  el.recommendationGrid.innerHTML = "";

  recs.forEach(rec => {
    const movie = rec.movie;
    const ottClass = movie.ott[0].toLowerCase().replace("+", "");

    // Map OTT logos for footer in the card
    const ottLogosHTML = movie.ott.map(platform => {
      const cls = platform.toLowerCase().replace("+", "");
      return `<span class="ott-logo-icon ${cls}">${platform}</span>`;
    }).join("");

    // Map recommendation reasons
    const reasonsHTML = rec.reasons.map(reason => {
      const scoreStr = reason.score > 0 ? `+${reason.score}` : `${reason.score}`;
      const icon = reason.score > 0 ? "✓" : "✕";
      const iconClass = reason.score > 0 ? "reason-check" : "reason-cross";
      return `
        <li class="recommend-reason-item">
          <span class="${iconClass}">${icon}</span>
          <span>${reason.text}</span>
          <span class="reason-score">(${scoreStr})</span>
        </li>
      `;
    }).join("");

    const cardEl = document.createElement("div");
    cardEl.className = "recommend-card";

    cardEl.innerHTML = `
      <div class="poster-wrapper">
        <img src="${movie.poster}" alt="${movie.title}" class="poster-img">
        <div class="poster-overlay"></div>
        <div class="recommend-score-badge">
          ★ 추천 점수 ${rec.totalScore}점
        </div>
      </div>
      
      <div class="recommend-card-body">
        <h3 class="movie-title">${movie.title}</h3>
        
        <div class="movie-details">
          <div class="detail-row">
            <span class="detail-label">개봉</span>
            <span class="detail-value">${movie.year}년</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">평점</span>
            <span class="detail-value">★ ${movie.rating.toFixed(1)}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">장르</span>
            <span class="detail-value">${movie.genre.join(", ")}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">출연</span>
            <span class="detail-value">${movie.cast.join(", ")}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">감독</span>
            <span class="detail-value">${movie.director}</span>
          </div>
        </div>
        
        <div class="recommend-reasons-title">추천 이유</div>
        <ul class="recommend-reasons-list">
          ${reasonsHTML || '<li class="recommend-reason-item text-muted"><span class="reason-check">✓</span> <span>선호/비선호 선택 없음 (기본 추천)</span> <span class="reason-score">(0)</span></li>'}
        </ul>
        
        <div class="ott-platforms-wrapper">
          <div class="ott-platforms-label">시청 가능 OTT</div>
          <div class="ott-logos">
            ${ottLogosHTML}
          </div>
        </div>
      </div>
    `;

    el.recommendationGrid.appendChild(cardEl);
  });
}

// Re-evaluate button (Screen 4 -> Screen 3)
el.reEvaluateBtn.addEventListener("click", () => {
  initEvaluationScreen();
  showScreen("evaluation");
});

// Go Main button (Screen 4 -> Screen 1)
el.goMainBtn.addEventListener("click", () => {
  showScreen("main");
});

// ==========================================================================
// 10. TOAST NOTIFICATION UTILITY
// ==========================================================================
let toastTimeout;
function showToast(message) {
  clearTimeout(toastTimeout);
  el.toast.textContent = message;
  el.toast.classList.add("show");

  toastTimeout = setTimeout(() => {
    el.toast.classList.remove("show");
  }, 3000);
}

// Initialize Application by showing main screen
showScreen("main");
