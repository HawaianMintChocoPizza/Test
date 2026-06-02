"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, 
  Home, 
  Compass, 
  Bookmark, 
  History, 
  Settings as SettingsIcon, 
  HelpCircle, 
  LogOut, 
  RefreshCw, 
  Bell, 
  Play, 
  Share2, 
  Check, 
  ExternalLink, 
  Star, 
  X, 
  Info, 
  Calendar, 
  Trophy, 
  Clock, 
  Flame, 
  User,
  SlidersHorizontal,
  ChevronRight,
  Loader2
} from "lucide-react";
import { contents, Content } from "./data/contents";
import { calculateRecommendations, RecommendationResult, UserEvaluation, CustomPreference } from "./utils/recommendation";

type SidebarTab = "home" | "explore" | "saved" | "history" | "settings";
type ActiveCategory = "movie" | "series" | "anime" | "documentary";

export default function WatchPickPage() {
  // --- Core States ---
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'netflix' | 'watchpick'>('netflix');
  const [viewingLogin, setViewingLogin] = useState<boolean>(false); // New state to control showing login screen
  const [currentTab, setCurrentTab] = useState<SidebarTab>("home");
  const [activeCategory, setActiveCategory] = useState<ActiveCategory>("movie");
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // --- Netflix Home API States ---
  const [netflixBanner, setNetflixBanner] = useState<Content | null>(null);
  const [netflixTrending, setNetflixTrending] = useState<Content[]>([]);
  const [netflixTop10, setNetflixTop10] = useState<Content[]>([]);
  const [netflixWatching, setNetflixWatching] = useState<Content[]>([]);
  
  // --- Sidebar Search ---
  const [sidebarSearchQuery, setSidebarSearchQuery] = useState<string>("");
  const [showSidebarSuggestions, setShowSidebarSuggestions] = useState<boolean>(false);

  // --- OTT Account Connections ---
  const [connectedPlatforms, setConnectedPlatforms] = useState<string[]>(["Netflix", "TVING"]);

  // --- Movie Detail View ---
  const [activeMovie, setActiveMovie] = useState<Content | null>(null);

  // --- User Ratings & Wishlist ---
  const [likedContentIds, setLikedContentIds] = useState<string[]>([]);
  const [dislikedContentIds, setDislikedContentIds] = useState<string[]>([]);
  const [savedContentIds, setSavedContentIds] = useState<string[]>([]);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [reviews, setReviews] = useState<Record<string, string>>({});
  
  // --- Dynamic Rating & Review State in Detail Page ---
  const [detailRating, setDetailRating] = useState<number>(0);
  const [detailReview, setDetailReview] = useState<string>("");

  // --- Curation Filters for Explore Tab ---
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [runtimePreference, setRuntimePreference] = useState<string>("all");

  // --- Selected Tags and Custom Preferences for Algorithm Extra Points ---
  const [selectedTags, setSelectedTags] = useState<Record<string, string[]>>({});
  const [customPreferences, setCustomPreferences] = useState<CustomPreference[]>([]);

  // --- KOBIS API States ---
  const [dynamicContents, setDynamicContents] = useState<Content[]>(contents);
  const [kobisSidebarResults, setKobisSidebarResults] = useState<Content[]>([]);
  const [kobisExploreResults, setKobisExploreResults] = useState<Content[]>([]);
  const [loadingKobisSidebar, setLoadingKobisSidebar] = useState<boolean>(false);
  const [loadingKobisExplore, setLoadingKobisExplore] = useState<boolean>(false);
  const [loadingMovieDetail, setLoadingMovieDetail] = useState<boolean>(false);

  // --- Custom Preference Input States ---
  const [newPrefType, setNewPrefType] = useState<'genre' | 'actor'>('genre');
  const [newPrefValue, setNewPrefValue] = useState<string>("SF/판타지");
  const [newPrefReason, setNewPrefReason] = useState<string>("");

  // --- Recalculating state ---
  const [recalculating, setRecalculating] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // --- Sync with localStorage on load ---
  useEffect(() => {
    try {
      const storedAuth = localStorage.getItem("wp_isLoggedIn");
      const storedSaved = localStorage.getItem("wp_savedContentIds");
      const storedRatings = localStorage.getItem("wp_ratings");
      const storedReviews = localStorage.getItem("wp_reviews");
      const storedPlatforms = localStorage.getItem("wp_connectedPlatforms");
      const storedTags = localStorage.getItem("wp_selectedTags");
      const storedCustomPrefs = localStorage.getItem("wp_customPreferences");
      const storedDynamicContents = localStorage.getItem("wp_dynamicContents");

      if (storedAuth === "true") setIsLoggedIn(true);
      if (storedSaved) setSavedContentIds(JSON.parse(storedSaved));
      if (storedRatings) setRatings(JSON.parse(storedRatings));
      if (storedReviews) setReviews(JSON.parse(storedReviews));
      if (storedPlatforms) setConnectedPlatforms(JSON.parse(storedPlatforms));
      if (storedTags) setSelectedTags(JSON.parse(storedTags));
      if (storedCustomPrefs) setCustomPreferences(JSON.parse(storedCustomPrefs));
      if (storedDynamicContents) {
        setDynamicContents([...contents, ...JSON.parse(storedDynamicContents)]);
      }
    } catch (e) {
      console.error("Failed to load local storage state:", e);
    }
  }, []);

  // --- Netflix Clone Data Loading Effect ---
  useEffect(() => {
    const fetchNetflixHomeData = async () => {
      // 1. 배너: 오징어 게임 (기본)
      try {
        const squidGameLocal = contents.find(c => c.id === "drama-squidgame");
        if (squidGameLocal) {
          const res = await fetch(`/api/kobis?action=detail&title=${encodeURIComponent(squidGameLocal.title)}&type=drama&releaseYear=2021`);
          if (res.ok) {
            const data = await res.json();
            const tmdbPlot = data?.tmdb?.plotText;
            const tmdbPoster = data?.tmdb?.posterUrl;
            const tmdbBackdrop = data?.tmdb?.backdropUrl;
            const tmdbCredits = data?.tmdb?.credits;
            setNetflixBanner({
              ...squidGameLocal,
              summary: tmdbPlot || squidGameLocal.summary,
              thumbnail: tmdbPoster || squidGameLocal.thumbnail,
              backdropUrl: tmdbBackdrop || "https://image.tmdb.org/t/p/original/yQGaui0bQ5Ai3KIFBB45nTeIqad.jpg",
              crew: tmdbCredits || squidGameLocal.crew
            });
          } else {
            setNetflixBanner(squidGameLocal);
          }
        }
      } catch (e) {
        console.error("Failed to load Netflix banner:", e);
        setNetflixBanner(contents.find(c => c.id === "drama-squidgame") || null);
      }

      // 2. 지금 뜨는 콘텐츠: TMDb 인기 콘텐츠 혹은 로컬 인기 콘텐츠 5종
      try {
        const trendingList = ["기생충", "서울의 봄", "헤어질 결심", "극한직업", "범죄도시 4"];
        const loadedTrending = await Promise.all(
          trendingList.map(async (title) => {
            const localMovie = contents.find(c => c.title === title);
            if (!localMovie) return null;
            try {
              const res = await fetch(`/api/kobis?action=detail&title=${encodeURIComponent(title)}&type=movie&releaseYear=${localMovie.releaseYear}`);
              if (res.ok) {
                const data = await res.json();
                return {
                  ...localMovie,
                  summary: data?.tmdb?.plotText || localMovie.summary,
                  thumbnail: data?.tmdb?.posterUrl || localMovie.thumbnail,
                  backdropUrl: data?.tmdb?.backdropUrl || localMovie.backdropUrl,
                  crew: data?.tmdb?.credits || localMovie.crew
                };
              }
            } catch (err) {
              console.error(`Failed to enrich trending ${title}:`, err);
            }
            return localMovie;
          })
        );
        setNetflixTrending(loadedTrending.filter((x): x is Content => x !== null));
      } catch (e) {
        console.error("Failed to load Netflix trending list:", e);
      }

      // 3. 오늘 한국의 TOP 10 콘텐츠: 로컬 TOP 3작품 ("파묘", "무빙", "기생충")을 실시간 맵핑
      try {
        const top10Titles = [
          { title: "파묘", type: "movie", year: 2024 },
          { title: "무빙", type: "drama", year: 2023 },
          { title: "기생충", type: "movie", year: 2019 }
        ];
        const loadedTop10 = await Promise.all(
          top10Titles.map(async (item) => {
            const localMovie = contents.find(c => c.title === item.title);
            if (!localMovie) return null;
            try {
              const res = await fetch(`/api/kobis?action=detail&title=${encodeURIComponent(item.title)}&type=${item.type}&releaseYear=${item.year}`);
              if (res.ok) {
                const data = await res.json();
                return {
                  ...localMovie,
                  summary: data?.tmdb?.plotText || localMovie.summary,
                  thumbnail: data?.tmdb?.posterUrl || localMovie.thumbnail,
                  backdropUrl: data?.tmdb?.backdropUrl || localMovie.backdropUrl,
                  crew: data?.tmdb?.credits || localMovie.crew
                };
              }
            } catch (err) {
              console.error(`Failed to enrich top10 ${item.title}:`, err);
            }
            return localMovie;
          })
        );
        setNetflixTop10(loadedTop10.filter((x): x is Content => x !== null));
      } catch (e) {
        console.error("Failed to load Netflix TOP 10:", e);
      }

      // 4. 시청 중인 콘텐츠: "무빙"과 "파묘"를 진행 바와 함께 노출
      try {
        const watchingList = ["무빙", "파묘"];
        const loadedWatching = await Promise.all(
          watchingList.map(async (title) => {
            const localMovie = contents.find(c => c.title === title);
            if (!localMovie) return null;
            try {
              const res = await fetch(`/api/kobis?action=detail&title=${encodeURIComponent(title)}&type=${localMovie.type}&releaseYear=${localMovie.releaseYear}`);
              if (res.ok) {
                const data = await res.json();
                return {
                  ...localMovie,
                  summary: data?.tmdb?.plotText || localMovie.summary,
                  thumbnail: data?.tmdb?.posterUrl || localMovie.thumbnail,
                  backdropUrl: data?.tmdb?.backdropUrl || localMovie.backdropUrl,
                  crew: data?.tmdb?.credits || localMovie.crew
                };
              }
            } catch (err) {
              console.error(`Failed to enrich watching ${title}:`, err);
            }
            return localMovie;
          })
        );
        setNetflixWatching(loadedWatching.filter((x): x is Content => x !== null));
      } catch (e) {
        console.error("Failed to load Netflix watching list:", e);
      }
    };

    fetchNetflixHomeData();
  }, []);

  // --- Sync KOBIS dynamic contents to localStorage ---
  useEffect(() => {
    try {
      const kobisOnly = dynamicContents.filter(c => c.id.startsWith("kobis-"));
      localStorage.setItem("wp_dynamicContents", JSON.stringify(kobisOnly));
    } catch (e) {
      console.error("Failed to save dynamic contents to local storage:", e);
    }
  }, [dynamicContents]);

  // --- Trigger dynamic toast ---
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // --- Save platforms change ---
  const togglePlatform = (p: string) => {
    let next;
    if (connectedPlatforms.includes(p)) {
      next = connectedPlatforms.filter(item => item !== p);
      triggerToast(`연동 해제: ${p}`);
    } else {
      next = [...connectedPlatforms, p];
      triggerToast(`연동 완료: ${p}`);
    }
    setConnectedPlatforms(next);
    localStorage.setItem("wp_connectedPlatforms", JSON.stringify(next));
  };

  // --- KOBIS Detail Fetch & Map Handler ---
  const handleOpenKobisDetail = async (movieCd: string, basicInfo: Content) => {
    setLoadingMovieDetail(true);
    try {
      const url = movieCd 
        ? `/api/kobis?action=detail&movieCd=${movieCd}`
        : `/api/kobis?action=detail&title=${encodeURIComponent(basicInfo.title)}&type=${basicInfo.type}&releaseYear=${basicInfo.releaseYear}`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        const movieInfo = data?.movieInfoResult?.movieInfo;
        
        // TMDb 크레딧(배우진/제작진 실제 사진 및 배역) 맵핑 적용
        const tmdbCredits = data?.tmdb?.credits;
        
        if (movieInfo) {
          const genres = movieInfo.genres && movieInfo.genres.length > 0 
            ? movieInfo.genres.map((g: any) => g.genreNm) 
            : basicInfo.genres;
          const director = movieInfo.directors && movieInfo.directors.length > 0 
            ? movieInfo.directors[0].peopleNm 
            : basicInfo.director;
          const cast = movieInfo.actors ? movieInfo.actors.slice(0, 5).map((a: any) => a.peopleNm) : [];
          const runtime = movieInfo.showTm ? Number(movieInfo.showTm) : 120;
          const releaseYear = movieInfo.openDt && movieInfo.openDt.length >= 4 
            ? Number(movieInfo.openDt.substring(0, 4)) 
            : (movieInfo.prdtYear ? Number(movieInfo.prdtYear) : basicInfo.releaseYear);
          const ageRating = movieInfo.audits && movieInfo.audits.length > 0 
            ? movieInfo.audits[0].watchGradeNm 
            : "15세 관람가";
          const country = movieInfo.nations && movieInfo.nations.length > 0 
            ? movieInfo.nations[0].nationNm 
            : "대한민국";
          const distributor = movieInfo.companys && movieInfo.companys.length > 0 
            ? movieInfo.companys[0].companyNm 
            : "영화진흥위원회";
          
          let crew: { name: string; role: string; avatarUrl: string }[] = [];
          if (tmdbCredits && tmdbCredits.length > 0) {
            crew = tmdbCredits;
          } else {
            // 폴백: KOBIS 데이터 기반으로 Unsplash 아바타 적용
            if (director && director !== "알 수 없음") {
              crew.push({ 
                name: director, 
                role: "감독", 
                avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80" 
              });
            }
            cast.forEach((actorName: string) => {
              crew.push({
                name: actorName,
                role: `출연 배우`,
                avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80"
              });
            });
          }

          const tmdbDirector = tmdbCredits?.find((c: any) => c.role === "감독")?.name;
          const tmdbCast = tmdbCredits?.filter((c: any) => c.role !== "감독").map((c: any) => c.name) || [];

          const finalDirector = tmdbDirector || director;
          const finalCast = tmdbCast.length > 0 ? tmdbCast : cast;

          // TMDb API 데이터 연동 (포스터 URL 및 상세 줄거리)
          const tmdbPoster = data?.tmdb?.posterUrl;
          const tmdbBackdrop = data?.tmdb?.backdropUrl;
          const tmdbPlot = data?.tmdb?.plotText;

          const thumbnail = tmdbPoster || basicInfo.thumbnail;
          const summary = tmdbPlot || `${movieInfo.movieNm}(${movieInfo.movieNmEn || ''})은 ${country}에서 제작된 ${releaseYear}년도 작품입니다. 장르는 ${genres.join(', ')}이며, 러닝타임은 ${runtime}분입니다.`;

          const richContent: Content = {
            ...basicInfo,
            genres,
            director: finalDirector,
            cast: finalCast,
            runtime,
            releaseYear,
            ageRating,
            country,
            distributor,
            crew,
            summary,
            thumbnail,
            backdropUrl: tmdbBackdrop || basicInfo.backdropUrl,
            originalTitle: movieInfo.movieNmEn,
            tasteExplanation: "KOBIS & TMDb 실시간 연동 작품"
          };

          // Add/update dynamic contents list
          setDynamicContents(prev => {
            if (prev.some(c => c.id === richContent.id)) {
              return prev.map(c => c.id === richContent.id ? richContent : c);
            }
            return [...prev, richContent];
          });

          setActiveMovie(richContent);
        } else {
          // 로컬 영화 정보인 경우 (KOBIS 정보 없음, 오직 TMDb 정보만 있는 경우)
          const genres = basicInfo.genres;
          const director = basicInfo.director;
          const cast = basicInfo.cast;
          const runtime = basicInfo.runtime;
          const releaseYear = basicInfo.releaseYear;
          const ageRating = basicInfo.ageRating || "15세 관람가";
          const country = basicInfo.country || "대한민국";
          const distributor = basicInfo.distributor || "N/A";

          let crew: { name: string; role: string; avatarUrl: string }[] = [];
          if (tmdbCredits && tmdbCredits.length > 0) {
            crew = tmdbCredits;
          } else {
            // 폴백: 로컬 데이터 기반으로 Unsplash 아바타 적용
            if (director && director !== "알 수 없음") {
              crew.push({ 
                name: director, 
                role: "감독", 
                avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80" 
              });
            }
            cast.forEach((actorName: string) => {
              crew.push({
                name: actorName,
                role: `출연 배우`,
                avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80"
              });
            });
          }

          const tmdbDirector = tmdbCredits?.find((c: any) => c.role === "감독")?.name;
          const tmdbCast = tmdbCredits?.filter((c: any) => c.role !== "감독").map((c: any) => c.name) || [];

          const finalDirector = tmdbDirector || director;
          const finalCast = tmdbCast.length > 0 ? tmdbCast : cast;

          // TMDb API 데이터 연동 (포스터 URL 및 상세 줄거리)
          const tmdbPoster = data?.tmdb?.posterUrl;
          const tmdbBackdrop = data?.tmdb?.backdropUrl;
          const tmdbPlot = data?.tmdb?.plotText;

          const thumbnail = tmdbPoster || basicInfo.thumbnail;
          const summary = tmdbPlot || basicInfo.summary;

          const richContent: Content = {
            ...basicInfo,
            genres,
            director: finalDirector,
            cast: finalCast,
            runtime,
            releaseYear,
            ageRating,
            country,
            distributor,
            crew,
            summary,
            thumbnail,
            backdropUrl: tmdbBackdrop || basicInfo.backdropUrl,
            originalTitle: basicInfo.originalTitle || basicInfo.title,
            tasteExplanation: basicInfo.tasteExplanation || "TMDb 실시간 연동 작품"
          };

          // Add/update dynamic contents list
          setDynamicContents(prev => {
            if (prev.some(c => c.id === richContent.id)) {
              return prev.map(c => c.id === richContent.id ? richContent : c);
            }
            return [...prev, richContent];
          });

          setActiveMovie(richContent);
        }
      } else {
        setDynamicContents(prev => prev.some(c => c.id === basicInfo.id) ? prev : [...prev, basicInfo]);
        setActiveMovie(basicInfo);
      }
    } catch (e) {
      console.error("Failed to load KOBIS movie details:", e);
      setDynamicContents(prev => prev.some(c => c.id === basicInfo.id) ? prev : [...prev, basicInfo]);
      setActiveMovie(basicInfo);
    } finally {
      setLoadingMovieDetail(false);
    }
  };

  const openMovieDetail = async (movie: Content | null) => {
    if (!movie) return;
    if (movie.id.startsWith("kobis-")) {
      const movieCd = movie.id.replace("kobis-", "");
      await handleOpenKobisDetail(movieCd, movie);
    } else {
      await handleOpenKobisDetail("", movie);
    }
  };

  // --- Tag Toggle Handler ---
  const handleToggleTag = (movieId: string, tag: string) => {
    const movieTags = selectedTags[movieId] || [];
    let nextTags;
    if (movieTags.includes(tag)) {
      nextTags = movieTags.filter(t => t !== tag);
    } else {
      nextTags = [...movieTags, tag];
    }
    const nextSelectedTags = { ...selectedTags, [movieId]: nextTags };
    setSelectedTags(nextSelectedTags);
    localStorage.setItem("wp_selectedTags", JSON.stringify(nextSelectedTags));
  };

  // --- Custom Preference Handlers ---
  const handleAddCustomPreference = (pref: CustomPreference) => {
    const nextCustomPrefs = [...customPreferences, pref];
    setCustomPreferences(nextCustomPrefs);
    localStorage.setItem("wp_customPreferences", JSON.stringify(nextCustomPrefs));
    triggerToast(`선호 취향 추가됨: ${pref.value} (${pref.reason})`);
  };

  const handleRemoveCustomPreference = (index: number) => {
    const nextCustomPrefs = customPreferences.filter((_, idx) => idx !== index);
    setCustomPreferences(nextCustomPrefs);
    localStorage.setItem("wp_customPreferences", JSON.stringify(nextCustomPrefs));
    triggerToast("선호 취향이 삭제되었습니다.");
  };

  // --- Run Recalculate Simulation ---
  const handleRecalculate = () => {
    setRecalculating(true);
    setTimeout(() => {
      setRecalculating(false);
      triggerToast("취향 데이터를 바탕으로 추천 점수를 다시 계산했습니다.");
    }, 1000);
  };

  // --- Save Wishlist / Bookmark ---
  const toggleSave = (contentId: string) => {
    let nextSaved;
    if (savedContentIds.includes(contentId)) {
      nextSaved = savedContentIds.filter(id => id !== contentId);
      triggerToast("보관함에서 삭제되었습니다.");
    } else {
      nextSaved = [...savedContentIds, contentId];
      triggerToast("나중에 볼 보관함에 저장되었습니다.");
    }
    setSavedContentIds(nextSaved);
    localStorage.setItem("wp_savedContentIds", JSON.stringify(nextSaved));
  };

  // --- Save Star Rating (quick & detailed) ---
  const handleRateContent = (contentId: string, score: number) => {
    const nextRatings = { ...ratings, [contentId]: score };
    setRatings(nextRatings);
    localStorage.setItem("wp_ratings", JSON.stringify(nextRatings));
    
    // Add default review text if empty
    if (!reviews[contentId]) {
      const nextReviews = { ...reviews, [contentId]: `${score}점 평가를 남겼습니다.` };
      setReviews(nextReviews);
      localStorage.setItem("wp_reviews", JSON.stringify(nextReviews));
    }

    // Sync rating state in detailed page if active
    if (activeMovie && activeMovie.id === contentId) {
      setDetailRating(score);
    }

    triggerToast(`"${contents.find(c => c.id === contentId)?.title}" 작품에 ${score}점을 주셨습니다.`);
  };

  // --- Save Detailed Review ---
  const handleSaveReview = () => {
    if (!activeMovie) return;
    if (detailRating === 0) {
      triggerToast("평점을 먼저 남겨주세요.");
      return;
    }
    
    const nextRatings = { ...ratings, [activeMovie.id]: detailRating };
    const nextReviews = { ...reviews, [activeMovie.id]: detailReview };
    
    setRatings(nextRatings);
    setReviews(nextReviews);
    
    localStorage.setItem("wp_ratings", JSON.stringify(nextRatings));
    localStorage.setItem("wp_reviews", JSON.stringify(nextReviews));
    
    triggerToast(`"${activeMovie.title}" 평점과 감상평이 저장되었습니다.`);
  };

  // --- Dynamic state sync when opening movie details ---
  useEffect(() => {
    if (activeMovie) {
      setDetailRating(ratings[activeMovie.id] || 0);
      setDetailReview(reviews[activeMovie.id] || "");
    }
  }, [activeMovie, ratings, reviews]);

  // --- KOBIS Search Hooks ---
  useEffect(() => {
    if (!sidebarSearchQuery.trim()) {
      setKobisSidebarResults([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setLoadingKobisSidebar(true);
      try {
        const response = await fetch(`/api/kobis?action=search&query=${encodeURIComponent(sidebarSearchQuery)}`);
        if (response.ok) {
          const data = await response.json();
          const list = data?.movieListResult?.movieList || [];
          const mapped = list.map((item: any) => {
            const genres = item.genreAlt ? item.genreAlt.split(',').map((g: string) => g.trim()) : [item.repGenreNm || "기타"];
            const director = item.directors && item.directors.length > 0 ? item.directors[0].peopleNm : "알 수 없음";
            const thumbnail = item.tmdb?.posterUrl || "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80";
            const summary = item.tmdb?.plotText || "영화진흥위원회 KOBIS 데이터를 로딩 중입니다...";
            return {
              id: `kobis-${item.movieCd}`,
              title: item.movieNm,
              type: 'movie' as const,
              genres,
              director,
              cast: [],
              rating: 0,
              runtime: 120,
              releaseYear: item.prdtYear ? Number(item.prdtYear) : 2024,
              summary,
              thumbnail,
              moods: [],
              platforms: [],
              attributes: { story: 0, direction: 0, music: 0, acting: 0 },
              isIndependent: false
            };
          });
          setKobisSidebarResults(mapped);
        }
      } catch (e) {
        console.error("Failed to fetch KOBIS suggestions:", e);
      } finally {
        setLoadingKobisSidebar(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [sidebarSearchQuery]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setKobisExploreResults([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setLoadingKobisExplore(true);
      try {
        const response = await fetch(`/api/kobis?action=search&query=${encodeURIComponent(searchQuery)}`);
        if (response.ok) {
          const data = await response.json();
          const list = data?.movieListResult?.movieList || [];
          const mapped = list.map((item: any) => {
            const genres = item.genreAlt ? item.genreAlt.split(',').map((g: string) => g.trim()) : [item.repGenreNm || "기타"];
            const director = item.directors && item.directors.length > 0 ? item.directors[0].peopleNm : "알 수 없음";
            const thumbnail = item.tmdb?.posterUrl || "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80";
            const summary = item.tmdb?.plotText || "영화진흥위원회 KOBIS 데이터를 로딩 중입니다...";
            return {
              id: `kobis-${item.movieCd}`,
              title: item.movieNm,
              type: 'movie' as const,
              genres,
              director,
              cast: [],
              rating: 0,
              runtime: 120,
              releaseYear: item.prdtYear ? Number(item.prdtYear) : 2024,
              summary,
              thumbnail,
              moods: [],
              platforms: [],
              attributes: { story: 0, direction: 0, music: 0, acting: 0 },
              isIndependent: false
            };
          });
          setKobisExploreResults(mapped);
        }
      } catch (e) {
        console.error("Failed to fetch KOBIS explore results:", e);
      } finally {
        setLoadingKobisExplore(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  // --- Build mock user evaluations list to feed into recommendation calculator ---
  const userEvaluations: UserEvaluation[] = Object.keys(ratings).map(contentId => ({
    contentId,
    globalRating: ratings[contentId],
    attributeRatings: {
      story: ratings[contentId],
      direction: ratings[contentId],
      music: ratings[contentId],
      acting: ratings[contentId],
    },
    reviewText: reviews[contentId] || "",
    behaviorData: {
      watchCompletion: ratings[contentId] >= 3.0 ? "completed" : "interrupted",
      searchMethod: "direct_search"
    }
  }));

  // --- Recommendation Engine Results ---
  const recResults = calculateRecommendations(
    dynamicContents,
    connectedPlatforms,
    userEvaluations,
    false,
    runtimePreference,
    likedContentIds,
    dislikedContentIds,
    selectedTags,
    customPreferences
  );

  // --- Category Filters for Mockup 1 Tabs ---
  const filterByCategory = (item: RecommendationResult) => {
    const movie = item.content;
    if (activeCategory === "movie") {
      return movie.type === "movie" && !movie.genres.includes("애니메이션") && !movie.genres.includes("다큐멘터리") && movie.id !== "movie-exhuma";
    }
    if (activeCategory === "series") {
      return movie.type === "drama" && movie.id !== "drama-moving";
    }
    if (activeCategory === "anime") {
      return movie.genres.includes("애니메이션");
    }
    if (activeCategory === "documentary") {
      return movie.genres.includes("다큐멘터리");
    }
    return true;
  };

  const displayedRecommendations = recResults.filter(filterByCategory);

  // --- Explore Tab Filters ---
  const exploredContents = recResults.filter(item => {
    const movie = item.content;
    
    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = movie.title.toLowerCase().includes(q);
      const matchDirector = movie.director.toLowerCase().includes(q);
      const matchCast = movie.cast.some(actor => actor.toLowerCase().includes(q));
      if (!matchTitle && !matchDirector && !matchCast) return false;
    }

    // Moods filter
    if (selectedMoods.length > 0) {
      const matchMood = selectedMoods.every(mood => movie.moods.includes(mood));
      if (!matchMood) return false;
    }

    // Genres filter
    if (selectedGenres.length > 0) {
      const matchGenre = selectedGenres.every(genre => movie.genres.includes(genre));
      if (!matchGenre) return false;
    }

    return true;
  });

  // --- Explore Tab Search Results ---
  const displayedExploreResults = [
    ...exploredContents,
    ...kobisExploreResults
      .filter(kMovie => !exploredContents.some(item => item.content.id === kMovie.id))
      .map(kMovie => ({
        content: kMovie,
        score: 80, // Default base score for external movies
        matchedReasons: ["영화진흥위원회 KOBIS 검색 결과입니다."],
        rank: 0
      }))
  ];

  // --- Sidebar Search Query Filter ---
  const sidebarFilteredSuggestions = [
    ...dynamicContents.filter(movie =>
      movie.title.toLowerCase().includes(sidebarSearchQuery.toLowerCase())
    ),
    ...kobisSidebarResults.filter(kMovie => 
      !dynamicContents.some(c => c.id === kMovie.id)
    )
  ];

  // --- Clear Curation States (Settings) ---
  const handleClearAllData = () => {
    if (confirm("모든 평점과 보관함, 연동 기록을 초기화하시겠습니까?")) {
      setRatings({});
      setReviews({});
      setSavedContentIds([]);
      setConnectedPlatforms(["Netflix", "TVING"]);
      setSelectedTags({});
      setCustomPreferences([]);
      localStorage.removeItem("wp_ratings");
      localStorage.removeItem("wp_reviews");
      localStorage.removeItem("wp_savedContentIds");
      localStorage.removeItem("wp_connectedPlatforms");
      localStorage.removeItem("wp_selectedTags");
      localStorage.removeItem("wp_customPreferences");
      triggerToast("모든 데이터가 초기화되었습니다.");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("wp_isLoggedIn");
    triggerToast("로그아웃되었습니다.");
  };

  return (
    <div className="min-h-screen bg-[#08090d] text-white flex select-none relative overflow-x-hidden font-sans">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-[#161722]/95 text-white px-5 py-3.5 rounded-2xl shadow-[0_8px_32px_rgba(138,125,240,0.35)] flex items-center gap-3 border border-primary/30 animate-fadeIn">
          <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
            <Check className="w-3.5 h-3.5 text-white stroke-[3px]" />
          </div>
          <span className="text-xs font-bold tracking-tight">{toastMessage}</span>
        </div>
      )}

      {/* Recalculating Loader Backdrop */}
      {recalculating && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center gap-4 animate-fadeIn">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <span className="text-sm font-bold text-slate-300">취향 데이터를 기반으로 알고리즘 점수 분석 중...</span>
        </div>
      )}

      {/* KOBIS Detail Loader Backdrop */}
      {loadingMovieDetail && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center gap-4 animate-fadeIn">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <span className="text-sm font-bold text-slate-300">영화진흥위원회(KOBIS) 상세 정보 로딩 중...</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* LEFT SIDEBAR (MOCKUP 1 & 3 DESIGN)                        */}
      {/* ======================================================== */}
      {!viewingLogin && viewMode === 'watchpick' && (
        <aside className="sidebar-container hidden md:flex flex-col justify-between py-6 px-4">
          
          <div className="space-y-6">
            {/* Title / Logo */}
            <div className="px-2 cursor-pointer" onClick={() => { setCurrentTab("home"); setActiveMovie(null); }}>
              <h1 className="text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
                <span>취향저격</span>
              </h1>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">OTT 큐레이션</p>
            </div>

            {/* Sidebar Search Bar */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="본 영화나 드라마 검색..."
                value={sidebarSearchQuery}
                onFocus={() => setShowSidebarSuggestions(true)}
                onChange={(e) => {
                  setSidebarSearchQuery(e.target.value);
                  setShowSidebarSuggestions(true);
                }}
                className="w-full bg-[#151622] border border-white/5 focus:border-primary/45 rounded-xl py-2 pl-9 pr-7 text-[11px] font-semibold outline-none transition-all placeholder-slate-500"
              />
              {sidebarSearchQuery && (
                <button 
                  onClick={() => { setSidebarSearchQuery(""); setShowSidebarSuggestions(false); }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              )}

              {/* Sidebar Search Suggestions Dropdown */}
              {showSidebarSuggestions && sidebarSearchQuery && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-[#1c1d2d] border border-white/10 rounded-xl shadow-2xl z-50 max-h-[180px] overflow-y-auto divide-y divide-white/5">
                  {loadingKobisSidebar && (
                    <div className="px-3 py-2 text-[10px] text-slate-500 text-center flex items-center justify-center gap-1.5">
                      <Loader2 className="w-3.5 h-3.5 text-primary animate-spin" />
                      <span>KOBIS API 검색 중...</span>
                    </div>
                  )}
                  {sidebarFilteredSuggestions.map(movie => (
                    <div 
                      key={movie.id}
                      onClick={() => {
                        if (movie.id.startsWith("kobis-")) {
                          const movieCd = movie.id.replace("kobis-", "");
                          handleOpenKobisDetail(movieCd, movie);
                        } else {
                          setActiveMovie(movie);
                        }
                        setSidebarSearchQuery("");
                        setShowSidebarSuggestions(false);
                      }}
                      className="px-3 py-2 text-[11px] font-medium hover:bg-primary/10 cursor-pointer flex justify-between items-center transition-colors"
                    >
                      <span className="text-slate-200 truncate pr-2">{movie.title}</span>
                      <span className="text-[9px] text-slate-500 shrink-0">
                        {movie.id.startsWith("kobis-") ? `KOBIS • ${movie.releaseYear}` : movie.releaseYear}
                      </span>
                    </div>
                  ))}
                  {!loadingKobisSidebar && sidebarFilteredSuggestions.length === 0 && (
                    <div className="px-3 py-2 text-[10px] text-slate-500 text-center">검색 결과가 없습니다.</div>
                  )}
                </div>
              )}
            </div>

            {/* Navigation Menu */}
            <nav className="space-y-1">
              <button 
                onClick={() => { setCurrentTab("home"); setActiveMovie(null); }} 
                className={`sidebar-nav-link w-full text-left ${currentTab === "home" && !activeMovie ? "active" : ""}`}
              >
                <Home className="w-4 h-4" />
                <span>홈</span>
              </button>
              <button 
                onClick={() => { setCurrentTab("explore"); setActiveMovie(null); }} 
                className={`sidebar-nav-link w-full text-left ${currentTab === "explore" && !activeMovie ? "active" : ""}`}
              >
                <Compass className="w-4 h-4" />
                <span>탐색</span>
              </button>
              <button 
                onClick={() => { setCurrentTab("saved"); setActiveMovie(null); }} 
                className={`sidebar-nav-link w-full text-left ${currentTab === "saved" && !activeMovie ? "active" : ""}`}
              >
                <Bookmark className="w-4 h-4" />
                <span>보관함</span>
              </button>
              <button 
                onClick={() => { setCurrentTab("history"); setActiveMovie(null); }} 
                className={`sidebar-nav-link w-full text-left ${currentTab === "history" && !activeMovie ? "active" : ""}`}
              >
                <History className="w-4 h-4" />
                <span>최근 본 영상</span>
              </button>
              <button 
                onClick={() => { setCurrentTab("settings"); setActiveMovie(null); }} 
                className={`sidebar-nav-link w-full text-left ${currentTab === "settings" && !activeMovie ? "active" : ""}`}
              >
                <SettingsIcon className="w-4 h-4" />
                <span>설정</span>
              </button>
            </nav>

            {/* Recently Watched List */}
            <div className="space-y-2 pt-2 border-t border-white/5">
              <span className="text-[9px] font-black text-slate-500 tracking-wider block uppercase">최근 시청한 콘텐츠</span>
              <div className="space-y-3">
                {[
                  { id: "movie-exhuma", title: "파묘", poster: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&h=120&q=80" },
                  { id: "drama-moving", title: "무빙", poster: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=120&h=120&q=80" }
                ].map((item) => {
                  const itemRating = ratings[item.id] || 0;
                  return (
                    <div key={item.id} className="flex gap-2.5 items-center">
                      <div className="w-7 h-10 bg-slate-900 rounded overflow-hidden shrink-0 border border-white/5">
                        <img src={item.poster} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span 
                          onClick={() => openMovieDetail(contents.find(c => c.id === item.id) || null)}
                          className="text-xs font-bold text-slate-200 block truncate hover:text-primary transition-colors cursor-pointer"
                        >
                          {item.title}
                        </span>
                        
                        {/* Interactive star rater */}
                        <div className="flex items-center gap-0.5 mt-0.5">
                          {[1, 2, 3, 4, 5].map((starVal) => (
                            <button
                              key={starVal}
                              onClick={() => handleRateContent(item.id, starVal)}
                              className="focus:outline-none"
                            >
                              <Star 
                                className={`w-3 h-3 ${starVal <= itemRating ? "text-yellow-500 fill-yellow-500" : "text-slate-600"}`} 
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Connection Status Indicator */}
            <div className="conn-status-box space-y-2">
              <div className="flex justify-between items-center text-[9px] font-black text-slate-500 tracking-wider">
                <span>연동 상태</span>
                <RefreshCw 
                  className="w-2.5 h-2.5 hover:text-white cursor-pointer transition-colors"
                  onClick={() => triggerToast("계정 연동 동기화 업데이트 중...")}
                />
              </div>
              <div className="space-y-1.5 text-[11px] font-semibold">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">넷플릭스</span>
                  {isLoggedIn ? (
                    <div className="flex items-center gap-1.5 text-xs text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      <span>연동 완료</span>
                    </div>
                  ) : (
                    <span className="text-slate-500 text-[10px]">로그인 필요</span>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">티빙</span>
                  {isLoggedIn ? (
                    connectedPlatforms.includes("TVING") ? (
                      <div className="flex items-center gap-1.5 text-xs text-slate-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        <span>연동 완료</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
                        <span>연동 중</span>
                      </div>
                    )
                  ) : (
                    <span className="text-slate-500 text-[10px]">로그인 필요</span>
                  )}
                </div>
              </div>
            </div>

          </div>

          <div className="space-y-3">
            {isLoggedIn && activeMovie && (
              <button 
                onClick={() => { setActiveMovie(null); setCurrentTab("home"); setIsLoggedIn(false); setViewingLogin(true); }}
                className="w-full bg-primary hover:bg-primary-hover active:scale-95 text-white font-extrabold text-xs py-2 rounded-xl transition-all text-center flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>OTT 계정 연결</span>
              </button>
            )}

            <div className="space-y-1 text-slate-500">
              <button onClick={() => triggerToast("도움말 및 서비스 지원 센터")} className="sidebar-nav-link w-full py-2 hover:bg-transparent">
                <HelpCircle className="w-4 h-4" />
                <span>도움말</span>
              </button>
              {isLoggedIn && (
                <button onClick={handleLogout} className="sidebar-nav-link w-full py-2 hover:bg-transparent hover:text-red-400">
                  <LogOut className="w-4 h-4" />
                  <span>로그아웃</span>
                </button>
              )}
            </div>
          </div>

        </aside>
      )}

      {/* ======================================================== */}
      {/* MAIN VIEW CONTROLLER                                    */}
      {/* ======================================================== */}
      <div className={`flex-1 flex flex-col min-h-screen ${(!viewingLogin && viewMode === 'watchpick') ? "md:pl-[250px]" : ""}`}>
        
        {/* ======================================================== */}
        {/* LOGIN / ACCOUNT CONNECTION VIEW (MOCKUP 2 DESIGN)         */}
        {/* ======================================================== */}
        {viewingLogin && (
          <main className="flex-1 flex flex-col items-center justify-center py-16 px-4 relative">
            {/* Glow blobs */}
            <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-[850px] w-full text-center space-y-10 z-10">
              <div className="space-y-3 relative">
                {/* Back to dashboard button */}
                <button 
                  onClick={() => setViewingLogin(false)}
                  className="absolute left-0 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-white cursor-pointer transition-colors"
                >
                  ← 홈으로 가기
                </button>
                <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white">취향저격</h1>
                <p className="text-sm sm:text-base text-slate-400 font-bold tracking-wide">내 OTT 계정을 연결하고 인생작을 추천받으세요.</p>
              </div>

              {/* Central Connection Frame Card */}
              <div className="bg-[#12131b]/80 border border-white/10 rounded-3xl p-8 md:p-12 shadow-[0_12px_40px_rgba(0,0,0,0.8)] space-y-10">
                
                {/* Social Login Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-[480px] mx-auto">
                  <button 
                    onClick={() => triggerToast("Google 계정 로그인 연동 진행 중...")}
                    className="bg-white hover:bg-slate-100 text-black py-3 rounded-full text-xs font-black tracking-wide flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99]"
                  >
                    <span className="text-sm">🌐</span>
                    <span>구글로 시작하기</span>
                  </button>
                  <button 
                    onClick={() => triggerToast("카카오톡 로그인 연동 진행 중...")}
                    className="bg-[#ffe812] hover:bg-[#e6d010] text-black py-3 rounded-full text-xs font-black tracking-wide flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99]"
                  >
                    <span className="text-sm">💬</span>
                    <span>카카오로 시작하기</span>
                  </button>
                </div>

                <div className="relative flex py-1 items-center max-w-[600px] mx-auto">
                  <div className="flex-grow border-t border-white/5"></div>
                  <span className="flex-shrink mx-4 text-[10px] font-black text-slate-500 tracking-widest uppercase">OTT 계정 연동 현황</span>
                  <div className="flex-grow border-t border-white/5"></div>
                </div>

                {/* Connection Grid (6 Items) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-left">
                  
                  {/* Netflix: Connected by default */}
                  <div className="ott-connect-card">
                    <div className="flex justify-between items-start">
                      <div className="w-10 h-10 bg-black rounded-xl border border-white/10 flex items-center justify-center shadow-lg font-black text-[#e50914] text-lg select-none">N</div>
                      {connectedPlatforms.includes("Netflix") && (
                        <span className="badge-match text-[9px] px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Check className="w-2.5 h-2.5 text-primary stroke-[3px]" />
                          <span>연동됨</span>
                        </span>
                      )}
                    </div>
                    <div className="my-5">
                      <h4 className="text-sm font-bold text-white">Netflix</h4>
                      <p className="text-[10px] text-slate-500 font-semibold mt-1">시청 기록 동기화 완료</p>
                    </div>
                    <button 
                      onClick={() => togglePlatform("Netflix")}
                      className={`w-full py-2 rounded-lg text-xs font-extrabold cursor-pointer transition-all ${
                        connectedPlatforms.includes("Netflix") 
                          ? "bg-transparent text-slate-400 border border-white/10 hover:border-red-500/20 hover:text-red-400"
                          : "bg-white/5 text-slate-200 border border-white/10 hover:bg-white/10"
                      }`}
                    >
                      {connectedPlatforms.includes("Netflix") ? "연동 해제" : "계정 연동하기"}
                    </button>
                  </div>

                  {/* TVING: Connected by default */}
                  <div className="ott-connect-card">
                    <div className="flex justify-between items-start">
                      <div className="w-10 h-10 bg-black rounded-xl border border-white/10 flex items-center justify-center shadow-lg font-black text-[#ff0558] text-sm select-none italic">TVING</div>
                      {connectedPlatforms.includes("TVING") && (
                        <span className="badge-match text-[9px] px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Check className="w-2.5 h-2.5 text-primary stroke-[3px]" />
                          <span>연동됨</span>
                        </span>
                      )}
                    </div>
                    <div className="my-5">
                      <h4 className="text-sm font-bold text-white">TVING</h4>
                      <p className="text-[10px] text-slate-500 font-semibold mt-1">시청 기록 동기화 완료</p>
                    </div>
                    <button 
                      onClick={() => togglePlatform("TVING")}
                      className={`w-full py-2 rounded-lg text-xs font-extrabold cursor-pointer transition-all ${
                        connectedPlatforms.includes("TVING") 
                          ? "bg-transparent text-slate-400 border border-white/10 hover:border-red-500/20 hover:text-red-400"
                          : "bg-white/5 text-slate-200 border border-white/10 hover:bg-white/10"
                      }`}
                    >
                      {connectedPlatforms.includes("TVING") ? "연동 해제" : "계정 연동하기"}
                    </button>
                  </div>

                  {/* Wavve */}
                  <div className="ott-connect-card">
                    <div className="flex justify-between items-start">
                      <div className="w-10 h-10 bg-[#0030ff] rounded-xl flex items-center justify-center shadow-lg font-black text-white text-xs select-none">Wavve</div>
                      {connectedPlatforms.includes("Wavve") && (
                        <span className="badge-match text-[9px] px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Check className="w-2.5 h-2.5 text-primary stroke-[3px]" />
                          <span>연동됨</span>
                        </span>
                      )}
                    </div>
                    <div className="my-5">
                      <h4 className="text-sm font-bold text-white">Wavve</h4>
                      <p className="text-[10px] text-slate-500 font-semibold mt-1">웨이브 오리지널 추천</p>
                    </div>
                    <button 
                      onClick={() => togglePlatform("Wavve")}
                      className={`w-full py-2 rounded-lg text-xs font-extrabold cursor-pointer transition-all ${
                        connectedPlatforms.includes("Wavve") 
                          ? "bg-transparent text-slate-400 border border-white/10 hover:border-red-500/20 hover:text-red-400"
                          : "bg-white/5 text-slate-200 border border-white/10 hover:bg-white/10"
                      }`}
                    >
                      {connectedPlatforms.includes("Wavve") ? "연동 해제" : "계정 연동하기"}
                    </button>
                  </div>

                  {/* Disney+ */}
                  <div className="ott-connect-card">
                    <div className="flex justify-between items-start">
                      <div className="w-10 h-10 bg-[#001d4a] border border-[#f5c518]/20 rounded-xl flex items-center justify-center shadow-lg font-bold text-[#f5c518] text-sm select-none">★</div>
                      {connectedPlatforms.includes("Disney+") && (
                        <span className="badge-match text-[9px] px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Check className="w-2.5 h-2.5 text-primary stroke-[3px]" />
                          <span>연동됨</span>
                        </span>
                      )}
                    </div>
                    <div className="my-5">
                      <h4 className="text-sm font-bold text-white">Disney+</h4>
                      <p className="text-[10px] text-slate-500 font-semibold mt-1">마블/디즈니 통합 추천</p>
                    </div>
                    <button 
                      onClick={() => togglePlatform("Disney+")}
                      className={`w-full py-2 rounded-lg text-xs font-extrabold cursor-pointer transition-all ${
                        connectedPlatforms.includes("Disney+") 
                          ? "bg-transparent text-slate-400 border border-white/10 hover:border-red-500/20 hover:text-red-400"
                          : "bg-white/5 text-slate-200 border border-white/10 hover:bg-white/10"
                      }`}
                    >
                      {connectedPlatforms.includes("Disney+") ? "연동 해제" : "계정 연동하기"}
                    </button>
                  </div>

                  {/* Watcha */}
                  <div className="ott-connect-card">
                    <div className="flex justify-between items-start">
                      <div className="w-10 h-10 bg-[#ff0558] rounded-xl flex items-center justify-center shadow-lg font-black text-white text-xs select-none">W</div>
                      {connectedPlatforms.includes("Watcha") && (
                        <span className="badge-match text-[9px] px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Check className="w-2.5 h-2.5 text-primary stroke-[3px]" />
                          <span>연동됨</span>
                        </span>
                      )}
                    </div>
                    <div className="my-5">
                      <h4 className="text-sm font-bold text-white">Watcha</h4>
                      <p className="text-[10px] text-slate-500 font-semibold mt-1">영화 취향 깊게 분석</p>
                    </div>
                    <button 
                      onClick={() => togglePlatform("Watcha")}
                      className={`w-full py-2 rounded-lg text-xs font-extrabold cursor-pointer transition-all ${
                        connectedPlatforms.includes("Watcha") 
                          ? "bg-transparent text-slate-400 border border-white/10 hover:border-red-500/20 hover:text-red-400"
                          : "bg-white/5 text-slate-200 border border-white/10 hover:bg-white/10"
                      }`}
                    >
                      {connectedPlatforms.includes("Watcha") ? "연동 해제" : "계정 연동하기"}
                    </button>
                  </div>

                  {/* Coupang Play */}
                  <div className="ott-connect-card">
                    <div className="flex justify-between items-start">
                      <div className="w-10 h-10 bg-[#00adef] rounded-xl flex items-center justify-center shadow-lg font-black text-white text-xs select-none">▶</div>
                      {connectedPlatforms.includes("Coupang Play") && (
                        <span className="badge-match text-[9px] px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Check className="w-2.5 h-2.5 text-primary stroke-[3px]" />
                          <span>연동됨</span>
                        </span>
                      )}
                    </div>
                    <div className="my-5">
                      <h4 className="text-sm font-bold text-white">Coupang Play</h4>
                      <p className="text-[10px] text-slate-500 font-semibold mt-1">스포츠/쿠팡 독점 추천</p>
                    </div>
                    <button 
                      onClick={() => togglePlatform("Coupang Play")}
                      className={`w-full py-2 rounded-lg text-xs font-extrabold cursor-pointer transition-all ${
                        connectedPlatforms.includes("Coupang Play") 
                          ? "bg-transparent text-slate-400 border border-white/10 hover:border-red-500/20 hover:text-red-400"
                          : "bg-white/5 text-slate-200 border border-white/10 hover:bg-white/10"
                      }`}
                    >
                      {connectedPlatforms.includes("Coupang Play") ? "연동 해제" : "계정 연동하기"}
                    </button>
                  </div>

                </div>

                <div className="pt-6">
                  <button
                    onClick={() => { setIsLoggedIn(true); setViewingLogin(false); triggerToast("연동이 활성화되었습니다! 오늘의 맞춤 결과를 확인하세요."); }}
                    className="px-10 py-4 rounded-full bg-primary hover:bg-primary-hover hover:shadow-[0_0_24px_rgba(138,125,240,0.45)] active:scale-[0.98] text-white font-extrabold text-sm transition-all cursor-pointer inline-flex items-center gap-2"
                  >
                    <span>추천 결과 확인하기</span>
                  </button>
                </div>

                <p className="text-slate-500 text-[11px] font-semibold">연동된 계정이 많을수록 추천 정확도가 올라갑니다.</p>

              </div>

              {/* Footer Links */}
              <div className="flex justify-center gap-6 text-[12px] text-slate-500 font-bold border-t border-white/5 pt-8">
                <button onClick={() => triggerToast("서비스 이용약관")} className="hover:text-slate-300 transition-colors">서비스 이용약관</button>
                <span className="w-px h-3.5 bg-white/10" />
                <button onClick={() => triggerToast("개인정보 처리방침")} className="hover:text-slate-300 transition-colors">개인정보 처리방침</button>
                <span className="w-px h-3.5 bg-white/10" />
                <button onClick={() => triggerToast("고객센터")} className="hover:text-slate-300 transition-colors">고객센터</button>
              </div>

            </div>
          </main>
        )}

        {/* ======================================================== */}
        {/* LOGGED IN / DEFAULT DASHBOARD VIEWS                       */}
        {/* ======================================================== */}
        {!viewingLogin && !activeMovie && viewMode === 'watchpick' && (
          <div className="flex-1 flex flex-col animate-fadeIn">
            
            {/* Top horizontal nav (tabs & profile indicator) */}
            <header className="h-[70px] border-b border-white/5 px-6 md:px-12 flex items-center justify-between sticky top-0 bg-[#141414]/90 backdrop-blur-md z-20">
              
              {/* Category tabs */}
              <div className="flex items-center gap-6 sm:gap-10 text-sm font-bold text-slate-400">
                <button
                  onClick={() => setViewMode('netflix')}
                  className="pb-1 text-primary hover:text-red-400 font-extrabold cursor-pointer border-b-2 border-transparent mr-4 flex items-center gap-1.5 shrink-0"
                >
                  <span>←</span> <span>넷플릭스 홈</span>
                </button>
                {[
                  { key: "movie", label: "영화" },
                  { key: "series", label: "시리즈" },
                  { key: "anime", label: "애니메이션" },
                  { key: "documentary", label: "다큐멘터리" }
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => { setActiveCategory(tab.key as ActiveCategory); setCurrentTab("home"); }}
                    className={`pb-1 transition-colors cursor-pointer border-b-2 hover:text-white ${
                      activeCategory === tab.key && currentTab === "home" 
                        ? "text-white border-primary" 
                        : "border-transparent"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Right Profile Info / Login Button */}
              <div className="flex items-center gap-4">
                
                {isLoggedIn ? (
                  // Logged in state headers
                  <div className="flex items-center gap-4 animate-fadeIn">
                    <button className="p-2 rounded-xl bg-white/3 hover:bg-white/5 border border-white/5 text-slate-400 hover:text-white transition-all cursor-pointer relative">
                      <Bell className="w-4 h-4" />
                      <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-primary rounded-full" />
                    </button>
                    <button 
                      onClick={() => triggerToast("사용자 설정 페이지")}
                      className="p-2 rounded-xl bg-white/3 hover:bg-white/5 border border-white/5 text-slate-400 hover:text-white transition-all cursor-pointer"
                    >
                      <SettingsIcon className="w-4 h-4" />
                    </button>
                    
                    <div className="flex items-center gap-2.5 border-l border-white/10 pl-4">
                      <div className="text-right">
                        <span className="text-xs font-bold text-white block leading-tight">김철수 님</span>
                        <span className="text-[9px] font-extrabold text-[#aba1ff] uppercase tracking-wider block">Premium</span>
                      </div>
                      <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/20 overflow-hidden flex items-center justify-center shadow-lg font-bold text-sm text-primary">
                        CS
                      </div>
                    </div>
                  </div>
                ) : (
                  // Logged out state Login Trigger
                  <button
                    onClick={() => setViewingLogin(true)}
                    className="bg-primary hover:bg-primary-hover active:scale-95 text-white font-extrabold text-xs px-5 py-2.5 rounded-full transition-all shadow-md shadow-primary/10 cursor-pointer"
                  >
                    로그인 / 계정 연동
                  </button>
                )}

              </div>

            </header>

            {/* TAB VIEW 1: HOME (RECOMMENDATION GRID) */}
            {currentTab === "home" && (
              <main className="flex-1 px-6 md:px-12 py-10 space-y-8">
                
                {/* Heading & Recalculate button */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-4">
                  <div>
                    <h2 className="text-2xl font-black tracking-tight text-white leading-tight">내 평점 기반 맞춤 추천</h2>
                    <p className="text-xs text-slate-400 font-bold mt-1.5">
                      {isLoggedIn 
                        ? "김철수 님의 취향을 정밀 분석한 오늘의 리스트입니다." 
                        : "로그인하시면 취향 데이터를 정밀 분석한 맞춤 추천 결과를 제공합니다."}
                    </p>
                  </div>

                  <button
                    onClick={handleRecalculate}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/15 hover:border-primary/50 text-xs font-black text-slate-200 transition-all cursor-pointer hover:bg-primary/5 active:scale-95 shrink-0"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>취향 다시 계산하기</span>
                  </button>
                </div>

                {/* Recommendations Grid */}
                {displayedRecommendations.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {displayedRecommendations.map((item) => {
                      const movie = item.content;
                      return (
                        <div key={movie.id} className="movie-grid-card">
                          
                          {/* Image Box */}
                          <div className="relative aspect-[16/10] w-full bg-slate-900 overflow-hidden cursor-pointer" onClick={() => openMovieDetail(movie)}>
                            <img src={movie.thumbnail} alt={movie.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            
                            {/* Lightning match percentage */}
                            <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-primary/20 backdrop-blur-md border border-primary/35 text-[10px] font-black tracking-wider text-[#aba1ff] flex items-center gap-0.5 shadow-md">
                              <span>⚡</span>
                              <span>{item.score}%</span>
                            </div>
                          </div>

                          {/* Movie content */}
                          <div className="p-4 flex-1 flex flex-col justify-between gap-4">
                            <div className="space-y-1.5">
                              <h3 
                                onClick={() => openMovieDetail(movie)}
                                className="text-sm font-bold text-white hover:text-primary cursor-pointer transition-colors leading-snug truncate"
                              >
                                {movie.title}
                              </h3>
                              <p className="text-[11px] text-slate-400 font-medium leading-relaxed italic">
                                “{item.matchedReasons && item.matchedReasons.length > 0 ? item.matchedReasons[0] : movie.tasteExplanation}”
                              </p>
                            </div>

                            {/* Card Footer row */}
                            <div className="flex justify-between items-center text-[10px] font-bold border-t border-white/5 pt-3 mt-1 text-slate-400 select-none">
                              
                              {/* Left footer tag */}
                              {movie.cardFooterTag ? (
                                <div className="flex items-center gap-1 text-slate-300">
                                  {movie.cardFooterTag.iconType === "flame" && <Flame className="w-3.5 h-3.5 text-red-500 fill-red-500" />}
                                  {movie.cardFooterTag.iconType === "calendar" && <Calendar className="w-3.5 h-3.5 text-primary" />}
                                  {movie.cardFooterTag.iconType === "trophy" && <Trophy className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />}
                                  {movie.cardFooterTag.iconType === "clock" && <Clock className="w-3.5 h-3.5 text-slate-400" />}
                                  <span className="truncate max-w-[100px]">{movie.cardFooterTag.text}</span>
                                </div>
                              ) : (
                                <span className="text-slate-500">정보 없음</span>
                              )}

                              {/* Right details button */}
                              <button 
                                onClick={() => openMovieDetail(movie)}
                                className="text-[#aba1ff] hover:text-white transition-colors cursor-pointer inline-flex items-center gap-0.5 shrink-0"
                              >
                                <span>상세보기</span>
                                <ChevronRight className="w-3 h-3" />
                              </button>

                            </div>

                          </div>

                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-20 text-center border border-dashed border-white/5 bg-[#151622]/20 rounded-2xl">
                    <span className="text-xs text-slate-500 font-bold block">이 탭의 추천 항목이 존재하지 않습니다. 다른 장르 탭을 눌러보세요.</span>
                  </div>
                )}

              </main>
            )}

            {/* TAB VIEW 2: EXPLORE (SEARCH & DETAILED RULES FILTERS) */}
            {currentTab === "explore" && (
              <main className="flex-1 px-6 md:px-12 py-10 space-y-6">
                
                <div className="border-b border-white/5 pb-4 space-y-1">
                  <h2 className="text-2xl font-black tracking-tight text-white leading-tight">작품 상세 탐색</h2>
                  <p className="text-xs text-slate-400 font-bold mt-1">다양한 필터와 장르, 검색을 통해 나만의 최적 매칭작을 찾아냅니다.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Left filter options card */}
                  <div className="bg-[#151622] border border-white/5 rounded-2xl p-5 space-y-5 h-fit shadow-xl">
                    <div className="flex items-center gap-2 border-b border-white/5 pb-2.5">
                      <SlidersHorizontal className="w-4 h-4 text-primary" />
                      <span className="text-xs font-black tracking-wider uppercase text-slate-300">정밀 필터 조건</span>
                    </div>

                    {/* Search bar */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-500 tracking-wider block uppercase">직접 검색</label>
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="제목, 감독, 배우 이름..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full bg-black/60 border border-white/10 rounded-xl py-2.5 pl-9 pr-4 text-xs font-semibold outline-none text-white focus:border-primary/40 transition-all placeholder-slate-600"
                        />
                      </div>
                    </div>

                    {/* Mood Selector */}
                    <div className="space-y-2 pt-2 border-t border-white/5">
                      <label className="text-[10px] font-black text-slate-500 tracking-wider block uppercase">오늘 기분에 맞는 분위기</label>
                      <div className="flex flex-wrap gap-1.5">
                        {["가볍게", "몰입감 있는", "감동적인", "긴장감 있는", "웃긴", "생각할 거리 있는"].map(mood => {
                          const isSelected = selectedMoods.includes(mood);
                          return (
                            <button
                              key={mood}
                              onClick={() => {
                                const next = isSelected 
                                  ? selectedMoods.filter(m => m !== mood) 
                                  : [...selectedMoods, mood];
                                setSelectedMoods(next);
                              }}
                              className={`px-3 py-1.5 rounded-full border text-[10px] font-bold transition-all cursor-pointer ${
                                isSelected 
                                  ? "bg-primary/20 border-primary text-[#aba1ff]" 
                                  : "bg-[#1f2030] border-white/5 text-slate-400 hover:text-slate-200"
                              }`}
                            >
                              {mood}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Genre Selector */}
                    <div className="space-y-2 pt-2 border-t border-white/5">
                      <label className="text-[10px] font-black text-slate-500 tracking-wider block uppercase">선호 장르</label>
                      <div className="flex flex-wrap gap-1.5">
                        {["SF/판타지", "스릴러", "로맨스", "코미디", "드라마", "다큐멘터리", "액션", "역사", "미스터리", "공포"].map(genre => {
                          const isSelected = selectedGenres.includes(genre);
                          return (
                            <button
                              key={genre}
                              onClick={() => {
                                const next = isSelected 
                                  ? selectedGenres.filter(g => g !== genre) 
                                  : [...selectedGenres, genre];
                                setSelectedGenres(next);
                              }}
                              className={`px-3 py-1.5 rounded-full border text-[10px] font-bold transition-all cursor-pointer ${
                                isSelected 
                                  ? "bg-primary/20 border-primary text-[#aba1ff]" 
                                  : "bg-[#1f2030] border-white/5 text-slate-400 hover:text-slate-200"
                              }`}
                            >
                              {genre}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Runtime Preference Selector */}
                    <div className="space-y-2 pt-2 border-t border-white/5">
                      <label className="text-[10px] font-black text-slate-500 tracking-wider block uppercase">러닝타임</label>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          { key: "all", label: "전체" },
                          { key: "short", label: "60분 이하" },
                          { key: "medium", label: "61분 ~ 130분" },
                          { key: "long", label: "131분 이상" }
                        ].map(opt => {
                          const isSelected = runtimePreference === opt.key;
                          return (
                            <button
                              key={opt.key}
                              onClick={() => setRuntimePreference(opt.key)}
                              className={`px-3 py-1.5 rounded-full border text-[10px] font-bold transition-all cursor-pointer ${
                                isSelected 
                                  ? "bg-primary/20 border-primary text-[#aba1ff]" 
                                  : "bg-[#1f2030] border-white/5 text-slate-400 hover:text-slate-200"
                              }`}
                            >
                              {opt.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Reset Button */}
                    <button
                      onClick={() => { setSearchQuery(""); setSelectedMoods([]); setSelectedGenres([]); setRuntimePreference("all"); }}
                      className="w-full bg-white/5 hover:bg-white/10 text-slate-300 font-extrabold text-[11px] py-2.5 rounded-xl transition-all cursor-pointer text-center"
                    >
                      필터 조건 초기화
                    </button>

                  </div>

                  {/* Right search results grid */}
                  <div className="lg:col-span-2 space-y-4">
                    <span className="text-[11px] font-black text-slate-500 tracking-wider block uppercase">
                      탐색 결과 ({displayedExploreResults.length}개 발견)
                    </span>
                    
                    {loadingKobisExplore && (
                      <div className="py-3 bg-primary/10 border border-primary/20 rounded-xl text-center text-xs font-bold text-slate-300 flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 text-primary animate-spin" />
                        <span>KOBIS OpenAPI 실시간 검색 중...</span>
                      </div>
                    )}

                    {displayedExploreResults.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {displayedExploreResults.map(item => {
                          const movie = item.content;
                          const isKobis = movie.id.startsWith("kobis-");
                          return (
                            <div 
                              key={movie.id}
                              onClick={() => openMovieDetail(movie)}
                              className="bg-[#151622] hover:bg-[#1a1b2a] border border-white/5 hover:border-primary/20 rounded-2xl p-4 flex gap-4 transition-all cursor-pointer group"
                            >
                              <div className="w-16 h-24 bg-slate-900 rounded overflow-hidden shrink-0 border border-white/5 shadow-md">
                                <img src={movie.thumbnail} alt={movie.title} className="w-full h-full object-cover" />
                              </div>
                              <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                                <div>
                                  <div className="flex justify-between items-start gap-2">
                                    <h4 className="text-xs sm:text-sm font-bold text-slate-200 group-hover:text-primary transition-colors truncate">
                                      {movie.title}
                                    </h4>
                                    <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded tracking-wider shrink-0 ${
                                      isKobis ? "bg-emerald-500/20 text-emerald-400" : "bg-primary/10 text-primary"
                                    }`}>
                                      {isKobis ? "KOBIS" : `${item.score}%`}
                                    </span>
                                  </div>
                                  <p className="text-[10px] text-slate-400 mt-1">
                                    {movie.releaseYear} • {movie.genres.join(", ")} • {isKobis ? "상세 정보 제공" : `${movie.runtime}분`}
                                  </p>
                                </div>
                                <span className="text-[10px] text-slate-500 truncate mt-1">
                                  감독: {movie.director} {movie.cast && movie.cast.length > 0 && `• 출연: ${movie.cast.slice(0, 2).join(", ")}`}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="py-20 text-center border border-dashed border-white/5 bg-[#151622]/20 rounded-2xl">
                        <span className="text-xs text-slate-500 font-bold block">조건에 일치하는 결과물이 존재하지 않습니다.</span>
                      </div>
                    )}

                  </div>

                </div>

              </main>
            )}

            {/* TAB VIEW 3: SAVED (LIBRARY) */}
            {currentTab === "saved" && (
              <main className="flex-1 px-6 md:px-12 py-10 space-y-6">
                
                <div className="border-b border-white/5 pb-4 space-y-1">
                  <h2 className="text-2xl font-black tracking-tight text-white leading-tight">나중에 볼 보관함</h2>
                  <p className="text-xs text-slate-400 font-bold mt-1">내가 보관해 둔 나만의 영화 위시리스트를 한곳에서 보관합니다.</p>
                </div>

                {savedContentIds.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {contents
                      .filter(c => savedContentIds.includes(c.id))
                      .map(movie => {
                        const scoreItem = recResults.find(r => r.content.id === movie.id);
                        return (
                          <div key={movie.id} className="movie-grid-card">
                            <div className="relative aspect-[16/10] w-full bg-slate-900 overflow-hidden cursor-pointer" onClick={() => openMovieDetail(movie)}>
                              <img src={movie.thumbnail} alt={movie.title} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                              
                              {/* Remove button */}
                              <button 
                                onClick={(e) => { e.stopPropagation(); toggleSave(movie.id); }}
                                className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-black/60 text-slate-400 hover:text-white cursor-pointer hover:bg-red-500/20 hover:text-red-400 transition-colors"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                              <div>
                                <h3 onClick={() => openMovieDetail(movie)} className="text-sm font-bold text-white hover:text-primary cursor-pointer transition-colors leading-snug truncate">{movie.title}</h3>
                                <p className="text-[10px] text-slate-400 mt-1 font-semibold">{movie.genres.join(", ")} • {movie.runtime}분</p>
                              </div>

                              <div className="flex justify-between items-center text-[10px] font-bold border-t border-white/5 pt-2">
                                <span className="text-[#aba1ff]">⚡ 매칭율 {scoreItem?.score || 80}%</span>
                                <button onClick={() => openMovieDetail(movie)} className="text-slate-400 hover:text-white transition-colors cursor-pointer">자세히 보기 &gt;</button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                ) : (
                  <div className="py-28 text-center border border-dashed border-white/5 bg-[#151622]/20 rounded-3xl flex flex-col items-center justify-center gap-3">
                    <span className="text-2xl">📁</span>
                    <div>
                      <span className="text-xs text-slate-400 font-bold block">아직 보관함에 저장해둔 콘텐츠가 없습니다.</span>
                      <button onClick={() => setCurrentTab("home")} className="text-primary hover:underline text-[11px] font-bold mt-2 cursor-pointer">맞춤 추천작 탐색하러 가기</button>
                    </div>
                  </div>
                )}

              </main>
            )}

            {/* TAB VIEW 4: HISTORY */}
            {currentTab === "history" && (
              <main className="flex-1 px-6 md:px-12 py-10 space-y-6">
                
                <div className="border-b border-white/5 pb-4 space-y-1">
                  <h2 className="text-2xl font-black tracking-tight text-white leading-tight">내 최근 평가 기록</h2>
                  <p className="text-xs text-slate-400 font-bold mt-1">감상 완료 후 내가 직접 매긴 평점과 소중한 한줄평 리뷰 모음입니다.</p>
                </div>

                {Object.keys(ratings).length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {contents
                      .filter(c => ratings[c.id] !== undefined)
                      .map(movie => (
                        <div key={movie.id} className="bg-[#151622] border border-white/5 rounded-2xl p-5 flex gap-4 relative">
                          <div className="w-16 h-24 bg-slate-900 rounded overflow-hidden shrink-0 border border-white/5">
                            <img src={movie.thumbnail} alt={movie.title} className="w-full h-full object-cover" />
                          </div>
                          
                          <div className="flex-1 min-w-0 flex flex-col justify-between">
                            <div>
                              <div className="flex justify-between items-start gap-2">
                                <h4 onClick={() => openMovieDetail(movie)} className="text-sm font-bold text-white hover:text-primary cursor-pointer transition-colors truncate">{movie.title}</h4>
                                
                                <div className="flex items-center gap-0.5 text-yellow-500">
                                  <Star className="w-3.5 h-3.5 fill-current" />
                                  <span className="text-xs font-black">{ratings[movie.id]}</span>
                                </div>
                              </div>
                              <p className="text-[10px] text-slate-500 font-semibold mt-0.5">{movie.releaseYear} • {movie.genres.join(", ")}</p>
                              
                              {reviews[movie.id] && (
                                <p className="text-xs text-slate-300 mt-2 font-medium italic border-l-2 border-primary/40 pl-2 leading-relaxed line-clamp-2">
                                  “{reviews[movie.id]}”
                                </p>
                              )}
                            </div>

                            <div className="flex justify-end pt-2">
                              <button 
                                onClick={() => setActiveMovie(movie)}
                                className="text-[10px] font-extrabold text-[#aba1ff] hover:text-white transition-colors cursor-pointer"
                              >
                                한줄평 및 별점 수정하기
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="py-28 text-center border border-dashed border-white/5 bg-[#151622]/20 rounded-3xl flex flex-col items-center justify-center gap-3">
                    <span className="text-2xl">✍️</span>
                    <div>
                      <span className="text-xs text-slate-400 font-bold block">아직 별점을 등록하거나 한줄평을 남긴 기록이 없습니다.</span>
                      <p className="text-[10px] text-slate-500 mt-1">상세 페이지의 &apos;내 평점 남기기&apos; 카드를 작성하시면 기록이 채워집니다.</p>
                      <button onClick={() => setCurrentTab("home")} className="text-primary hover:underline text-[11px] font-bold mt-2.5 cursor-pointer">별점 매기러 가기</button>
                    </div>
                  </div>
                )}

              </main>
            )}

            {/* TAB VIEW 5: SETTINGS */}
            {currentTab === "settings" && (
              <main className="flex-1 px-6 md:px-12 py-10 space-y-6 max-w-[600px] w-full">
                
                <div className="border-b border-white/5 pb-4 space-y-1">
                  <h2 className="text-2xl font-black tracking-tight text-white leading-tight">서비스 설정</h2>
                  <p className="text-xs text-slate-400 font-bold mt-1">저장된 로컬 데이터 및 취향 추천 설정 관리를 수행합니다.</p>
                </div>

                <div className="bg-[#151622] border border-white/5 rounded-2xl p-6 space-y-6 shadow-xl">
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-bold text-white">데이터 보존 정책</h3>
                    <p className="text-xs text-slate-400 font-semibold leading-relaxed">
                      본 사이트는 순수 프론트엔드 HTML/CSS/JS 및 localStorage 기술을 활용해 작동합니다. 계정 데이터를 서버에 전송하지 않으며 모든 별점 및 감상평 기록은 개인 브라우저에만 고유하게 보관됩니다.
                    </p>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-white/5">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-xs font-bold text-slate-200 block">평점 및 한줄평 보관 데이터</span>
                        <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">현재 {Object.keys(ratings).length}개 작품 평가됨</span>
                      </div>
                      <button 
                        onClick={handleClearAllData}
                        className="bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-500/20 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer"
                      >
                        취향 데이터 초기화
                      </button>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <div>
                        <span className="text-xs font-bold text-slate-200 block">구독 중인 다중 OTT 계정 연동 수</span>
                        <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">{connectedPlatforms.join(", ")} ({connectedPlatforms.length}개 연동 완료)</span>
                      </div>
                      <button 
                        onClick={() => { setIsLoggedIn(false); setViewingLogin(true); triggerToast("연동 계정 변경 로그인 화면으로 이동"); }}
                        className="bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer"
                      >
                        계정 연동 재조정
                      </button>
                    </div>
                  </div>

                </div>

                {/* 선호 장르 및 배우 관리 (가산점 부여) */}
                <div className="bg-[#151622] border border-white/5 rounded-2xl p-6 space-y-6 shadow-xl">
                  <div className="space-y-2 border-b border-white/5 pb-3">
                    <h3 className="text-sm font-bold text-white">선호 장르 및 배우 관리 (추천 가산점 부여)</h3>
                    <p className="text-[11px] text-slate-400 font-semibold">
                      좋아하는 장르나 배우를 등록하고 이유를 작성하면 관련 작품 추천 시 높은 가산점이 부여됩니다.
                    </p>
                  </div>

                  {/* Add Preference Form */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      {/* Type Select */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-500 tracking-wider block uppercase">구분</label>
                        <select 
                          value={newPrefType}
                          onChange={(e) => {
                            const val = e.target.value as 'genre' | 'actor';
                            setNewPrefType(val);
                            setNewPrefValue(val === 'genre' ? 'SF/판타지' : Array.from(new Set(contents.flatMap(c => c.cast))).sort()[0]);
                          }}
                          className="w-full bg-[#1c1d2d] border border-white/10 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-primary/45 text-white cursor-pointer"
                        >
                          <option value="genre">장르</option>
                          <option value="actor">배우</option>
                        </select>
                      </div>

                      {/* Value Select */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-500 tracking-wider block uppercase">선택</label>
                        {newPrefType === 'genre' ? (
                          <select
                            value={newPrefValue}
                            onChange={(e) => setNewPrefValue(e.target.value)}
                            className="w-full bg-[#1c1d2d] border border-white/10 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-primary/45 text-white cursor-pointer"
                          >
                            {["SF/판타지", "스릴러", "로맨스", "코미디", "드라마", "다큐멘터리", "액션", "역사", "미스터리", "공포"].map(g => (
                              <option key={g} value={g}>{g}</option>
                            ))}
                          </select>
                        ) : (
                          <select
                            value={newPrefValue}
                            onChange={(e) => setNewPrefValue(e.target.value)}
                            className="w-full bg-[#1c1d2d] border border-white/10 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-primary/45 text-white cursor-pointer"
                          >
                            {Array.from(new Set(contents.flatMap(c => c.cast))).sort().map(a => (
                              <option key={a} value={a}>{a}</option>
                            ))}
                          </select>
                        )}
                      </div>
                    </div>

                    {/* Reason input */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-500 tracking-wider block uppercase">좋아하는 이유</label>
                      <input
                        type="text"
                        placeholder="예: 깊은 몰입감을 주어서, 믿고 보는 연기력 등"
                        value={newPrefReason}
                        onChange={(e) => setNewPrefReason(e.target.value.slice(0, 100))}
                        className="w-full bg-[#1c1d2d] border border-white/10 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-primary/45 text-white"
                      />
                    </div>

                    <button
                      onClick={() => {
                        if (!newPrefReason.trim()) {
                          triggerToast("좋아하는 이유를 작성해주세요.");
                          return;
                        }
                        handleAddCustomPreference({
                          type: newPrefType,
                          value: newPrefValue,
                          reason: newPrefReason.trim()
                        });
                        setNewPrefReason("");
                      }}
                      className="w-full bg-primary hover:bg-primary-hover active:scale-95 text-white font-extrabold text-xs py-2.5 rounded-xl transition-all text-center cursor-pointer shadow-md"
                    >
                      선호 취향 추가하기
                    </button>
                  </div>

                  {/* Preferences List */}
                  <div className="space-y-3 pt-4 border-t border-white/5">
                    <span className="text-[10px] font-black text-slate-500 tracking-wider block uppercase">내가 등록한 선호 조건 ({customPreferences.length}개)</span>
                    
                    {customPreferences.length > 0 ? (
                      <div className="space-y-2">
                        {customPreferences.map((pref, idx) => (
                          <div 
                            key={idx}
                            className="bg-[#1c1d2d] border border-white/5 rounded-xl p-3 flex justify-between items-center gap-4 text-xs"
                          >
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className={`px-2 py-0.5 rounded text-[9px] font-black tracking-wider ${
                                  pref.type === 'genre' ? 'bg-primary/20 text-[#aba1ff]' : 'bg-emerald-500/20 text-emerald-400'
                                }`}>
                                  {pref.type === 'genre' ? '장르' : '배우'}
                                </span>
                                <span className="font-bold text-slate-200">{pref.value}</span>
                                <span className="text-[10px] text-primary font-bold">{pref.type === 'genre' ? '+10점' : '+7점'}</span>
                              </div>
                              <p className="text-[11px] text-slate-400 mt-1 truncate">
                                사유: &quot;{pref.reason}&quot;
                              </p>
                            </div>
                            
                            <button
                              onClick={() => handleRemoveCustomPreference(idx)}
                              className="text-slate-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 transition-all cursor-pointer shrink-0"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-6 text-center bg-black/20 border border-dashed border-white/5 rounded-xl">
                        <p className="text-[11px] text-slate-500 font-semibold">등록된 선호 취향 조건이 없습니다. 좋아하는 장르와 배우를 등록해보세요!</p>
                      </div>
                    )}
                  </div>
                </div>

              </main>
            )}

            {/* Recommendations Footer */}
            <footer className="h-[60px] border-t border-white/5 flex items-center justify-center text-[10px] text-slate-600 font-semibold mt-auto bg-[#141414]">
              © 2026 취향저격. All rights reserved.
            </footer>

          </div>
        )}

        {/* ======================================================== */}
        {/* NETFLIX CLONE HOME VIEW (MOCKUP 0 DESIGN)               */}
        {/* ======================================================== */}
        {!viewingLogin && !activeMovie && viewMode === 'netflix' && (
          <div className="flex-1 flex flex-col animate-fadeIn bg-[#141414] text-white">
            
            {/* Netflix Header */}
            <header className="h-[68px] px-6 md:px-12 flex items-center justify-between sticky top-0 bg-[#141414]/90 backdrop-blur-md z-30 transition-all duration-300">
              <div className="flex items-center gap-6 sm:gap-10">
                {/* Netflix Red Text Logo */}
                <h1 className="text-2xl font-black tracking-tighter text-[#E50914] cursor-pointer select-none" onClick={() => setViewMode('netflix')}>
                  NETFLIX
                </h1>
                
                {/* Menus */}
                <nav className="hidden lg:flex items-center gap-5 text-[12px] font-medium text-slate-300">
                  <button className="hover:text-slate-400 cursor-pointer text-white font-bold">홈</button>
                  <button className="hover:text-slate-400 cursor-pointer">시리즈</button>
                  <button className="hover:text-slate-400 cursor-pointer">영화</button>
                  <button className="hover:text-slate-400 cursor-pointer">NEW! 요즘 대세 콘텐츠</button>
                  <button className="hover:text-slate-400 cursor-pointer">내가 찜한 리스트</button>
                  
                  {/* Highlighted Recommendation Menu */}
                  <button 
                    onClick={() => { setViewMode('watchpick'); setCurrentTab('home'); }} 
                    className="text-[#E50914] font-black border border-[#E50914]/40 bg-[#E50914]/5 hover:bg-[#E50914]/15 px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 animate-pulse"
                  >
                    <span>✨</span>
                    <span>새로운 컨텐츠 추천받기</span>
                  </button>
                </nav>
              </div>

              {/* Header Right */}
              <div className="flex items-center gap-5">
                {/* Search, Kids, Bell, Profile Icon */}
                <button className="hover:text-slate-300 cursor-pointer">
                  <Search className="w-4 h-4 text-white" />
                </button>
                <span className="text-[12px] text-slate-300 cursor-pointer hover:underline hidden sm:inline">키즈</span>
                <button className="hover:text-slate-300 cursor-pointer relative">
                  <Bell className="w-4 h-4 text-white" />
                  <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-primary rounded-full" />
                </button>
                
                {/* Profile Box */}
                <div 
                  onClick={() => { setViewMode('watchpick'); setCurrentTab('settings'); }}
                  className="flex items-center gap-2 cursor-pointer group"
                  title="내 프로필/설정 이동"
                >
                  <div className="w-8 h-8 rounded bg-[#1c1c1c] border border-white/10 overflow-hidden flex items-center justify-center shadow-lg font-bold text-xs text-primary group-hover:border-primary transition-colors">
                    CS
                  </div>
                </div>
              </div>
            </header>

            {/* Mobile Recommendation Banner button */}
            <div className="lg:hidden px-6 py-2 bg-gradient-to-r from-red-950/40 to-transparent border-y border-white/5 flex justify-between items-center text-xs">
              <span className="font-bold text-slate-300">내 평점 AI 취향 분석을 받아보세요!</span>
              <button 
                onClick={() => { setViewMode('watchpick'); setCurrentTab('home'); }} 
                className="bg-primary px-3 py-1.5 rounded font-black text-white active:scale-95 transition-all cursor-pointer"
              >
                추천받기
              </button>
            </div>

            {/* Netflix Main Billboard Banner */}
            {netflixBanner && (
              <section className="relative w-full aspect-[16/9] md:h-[65vh] lg:h-[75vh] xl:h-[80vh] min-h-[400px] overflow-hidden select-none">
                {/* Billboard backdrop background */}
                <div className="absolute inset-0 bg-slate-950">
                  <img 
                    src={netflixBanner.backdropUrl || netflixBanner.thumbnail} 
                    alt={netflixBanner.title} 
                    className="w-full h-full object-cover object-center opacity-85 transition-opacity duration-700" 
                  />
                  {/* Backdrop shading overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/30 to-black/50" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#141414]/70 via-[#141414]/10 to-transparent" />
                </div>

                {/* Banner Content Panel */}
                <div className="absolute bottom-[10%] left-6 md:left-12 max-w-[600px] space-y-4 z-10 animate-slideUp">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-[#E50914] rounded-full animate-ping" />
                    <span className="text-[10px] md:text-xs font-black tracking-widest text-[#E50914] uppercase drop-shadow">
                      STREAMFLIX 오리지널
                    </span>
                  </div>
                  
                  <h2 className="text-4xl md:text-6xl font-black tracking-tight text-white drop-shadow-md">
                    {netflixBanner.title}
                  </h2>
                  
                  <p className="text-xs md:text-sm text-slate-200 leading-relaxed font-semibold drop-shadow-sm max-h-[100px] overflow-hidden line-clamp-3">
                    {netflixBanner.summary}
                  </p>

                  <div className="flex items-center gap-3 pt-2">
                    {/* Play & Info Buttons */}
                    <button 
                      onClick={() => triggerToast(`"${netflixBanner.title}" 감상을 시작합니다.`)}
                      className="bg-white hover:bg-slate-200 active:scale-98 text-black px-6 py-2.5 rounded font-black text-xs md:text-sm flex items-center gap-2 cursor-pointer shadow-md transition-all"
                    >
                      <Play className="w-4 h-4 fill-current text-black" />
                      <span>재생</span>
                    </button>
                    <button 
                      onClick={() => openMovieDetail(netflixBanner)}
                      className="bg-slate-500/40 hover:bg-slate-500/60 active:scale-98 text-white px-6 py-2.5 rounded font-bold text-xs md:text-sm flex items-center gap-2 cursor-pointer shadow-md border border-white/10 backdrop-blur-sm transition-all"
                    >
                      <Info className="w-4 h-4 text-white" />
                      <span>상세 정보</span>
                    </button>
                  </div>
                </div>
              </section>
            )}

            {/* Netflix Content Rows Container */}
            <div className="px-6 md:px-12 py-8 space-y-12 relative z-20 -mt-16 md:-mt-24 lg:-mt-32">
              
              {/* Row 1: 지금 뜨는 콘텐츠 */}
              <section className="space-y-3">
                <h3 className="text-sm md:text-lg font-black tracking-wide text-white">지금 뜨는 콘텐츠</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  {netflixTrending.map((movie) => (
                    <div 
                      key={movie.id} 
                      onClick={() => openMovieDetail(movie)}
                      className="group cursor-pointer relative aspect-[2/3] rounded-md overflow-hidden bg-slate-900 border border-white/5 hover:border-primary/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-md"
                    >
                      <img src={movie.thumbnail} alt={movie.title} className="w-full h-full object-cover group-hover:opacity-90 transition-opacity" />
                      {/* title display on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                        <span className="text-xs font-black text-white truncate">{movie.title}</span>
                        <span className="text-[9px] text-[#ff4d58] font-bold mt-1">⭐️ {movie.rating || 4.7}</span>
                      </div>
                    </div>
                  ))}
                  {netflixTrending.length === 0 && (
                    Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="aspect-[2/3] rounded-md bg-white/5 animate-pulse" />
                    ))
                  )}
                </div>
              </section>

              {/* Row 2: 오늘 한국의 TOP 10 콘텐츠 */}
              <section className="space-y-3">
                <h3 className="text-sm md:text-lg font-black tracking-wide text-white">오늘 한국의 TOP 10 콘텐츠</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {netflixTop10.slice(0, 3).map((movie, index) => (
                    <div 
                      key={movie.id}
                      onClick={() => openMovieDetail(movie)}
                      className="group cursor-pointer relative flex items-center h-[160px] md:h-[200px] bg-slate-950/20 border border-white/5 hover:border-primary/30 rounded-xl overflow-hidden p-4 gap-4 transition-all hover:bg-slate-950/40"
                    >
                      {/* Big rank number */}
                      <div className="text-6xl md:text-8xl font-black text-transparent select-none drop-shadow-[0_2px_4px_rgba(255,255,255,0.08)] leading-none shrink-0" style={{ WebkitTextStroke: "2px rgba(255,255,255,0.25)" }}>
                        {index + 1}
                      </div>

                      {/* Poster Image */}
                      <div className="h-full aspect-[2/3] bg-slate-900 rounded-lg overflow-hidden border border-white/10 group-hover:scale-102 transition-transform shadow-lg shrink-0">
                        <img src={movie.thumbnail} alt={movie.title} className="w-full h-full object-cover" />
                      </div>

                      {/* Content Description */}
                      <div className="min-w-0 flex-1 flex flex-col justify-center py-2 space-y-1">
                        <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-primary transition-colors truncate">
                          {movie.title}
                        </h4>
                        <p className="text-[10px] text-slate-400 font-semibold">
                          {movie.genres.slice(0, 2).join(", ")} • {movie.releaseYear}
                        </p>
                        <p className="text-[10px] text-slate-500 font-medium line-clamp-3 leading-relaxed mt-1">
                          {movie.summary}
                        </p>
                      </div>
                    </div>
                  ))}
                  {netflixTop10.length === 0 && (
                    Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="h-[200px] rounded-xl bg-white/5 animate-pulse" />
                    ))
                  )}
                </div>
              </section>

              {/* Row 3: 시청 중인 콘텐츠 */}
              <section className="space-y-3">
                <h3 className="text-sm md:text-lg font-black tracking-wide text-white">시청 중인 콘텐츠</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {netflixWatching.slice(0, 2).map((movie, index) => {
                    const progressVal = index === 0 ? 80 : 35; // Mock progress percentages (e.g. Moving 80%, Exhuma 35%)
                    const progressText = index === 0 ? "시즌 1: 4화" : "파트 2";
                    return (
                      <div 
                        key={movie.id}
                        className="group bg-slate-950/40 border border-white/5 rounded-xl overflow-hidden hover:border-white/15 transition-all shadow-md"
                      >
                        {/* Horizontal Poster container */}
                        <div 
                          onClick={() => openMovieDetail(movie)}
                          className="relative aspect-[16/10] w-full bg-slate-900 cursor-pointer overflow-hidden"
                        >
                          <img src={movie.backdropUrl || movie.thumbnail} alt={movie.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          <div className="absolute inset-0 bg-black/20" />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-10 h-10 rounded-full bg-white/95 flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                              <Play className="w-4 h-4 fill-current text-black ml-0.5" />
                            </div>
                          </div>
                        </div>

                        {/* Progress Bar & Info */}
                        <div className="p-4 space-y-2">
                          <div className="flex justify-between items-start gap-2">
                            <div>
                              <span 
                                onClick={() => openMovieDetail(movie)}
                                className="text-xs font-bold text-white hover:text-primary cursor-pointer truncate block"
                              >
                                {movie.title}
                              </span>
                              <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">{progressText}</span>
                            </div>
                            <button 
                              onClick={() => openMovieDetail(movie)}
                              className="p-1 rounded-full hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
                              title="상세 정보"
                            >
                              <Info className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Progress Line */}
                          <div className="space-y-1">
                            <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                              <div className="h-full bg-primary rounded-full" style={{ width: `${progressVal}%` }} />
                            </div>
                            <span className="text-[9px] text-slate-500 font-bold block text-right">{progressVal}% 완료</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {netflixWatching.length === 0 && (
                    Array.from({ length: 2 }).map((_, i) => (
                      <div key={i} className="aspect-[16/10] rounded-xl bg-white/5 animate-pulse" />
                    ))
                  )}
                </div>
              </section>

            </div>

            {/* Netflix Footer */}
            <footer className="bg-[#141414] text-slate-500 text-[11px] font-semibold pt-16 pb-10 border-t border-white/5">
              <div className="max-w-[1000px] mx-auto px-6 space-y-8">
                
                {/* Social icons */}
                <div className="flex items-center gap-6 text-slate-400 text-lg">
                  <button className="hover:text-white transition-colors">🌐</button>
                  <button className="hover:text-white transition-colors">💬</button>
                  <button className="hover:text-white transition-colors">📷</button>
                  <button className="hover:text-white transition-colors">🎥</button>
                </div>

                {/* Footer links grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-left leading-loose">
                  <div className="flex flex-col">
                    <button onClick={() => triggerToast("자막 및 음성")} className="hover:underline text-left cursor-pointer">자막 및 음성</button>
                    <button onClick={() => triggerToast("미디어 센터")} className="hover:underline text-left cursor-pointer">미디어 센터</button>
                    <button onClick={() => triggerToast("개인정보 처리방침")} className="hover:underline text-left cursor-pointer">개인정보 처리방침</button>
                    <button onClick={() => triggerToast("문의 하기")} className="hover:underline text-left cursor-pointer">문의 하기</button>
                  </div>
                  <div className="flex flex-col">
                    <button onClick={() => triggerToast("화면 해설")} className="hover:underline text-left cursor-pointer">화면 해설</button>
                    <button onClick={() => triggerToast("투자 정보(IR)")} className="hover:underline text-left cursor-pointer">투자 정보(IR)</button>
                    <button onClick={() => triggerToast("법적 고지")} className="hover:underline text-left cursor-pointer">법적 고지</button>
                    <button onClick={() => triggerToast("속도 테스트")} className="hover:underline text-left cursor-pointer">속도 테스트</button>
                  </div>
                  <div className="flex flex-col">
                    <button onClick={() => triggerToast("고객 센터")} className="hover:underline text-left cursor-pointer">고객 센터</button>
                    <button onClick={() => triggerToast("입사 정보")} className="hover:underline text-left cursor-pointer">입사 정보</button>
                    <button onClick={() => triggerToast("쿠키 설정")} className="hover:underline text-left cursor-pointer">쿠키 설정</button>
                    <button onClick={() => triggerToast("법적 고지")} className="hover:underline text-left cursor-pointer">법적 고지</button>
                  </div>
                  <div className="flex flex-col">
                    <button onClick={() => triggerToast("기프트카드")} className="hover:underline text-left cursor-pointer">기프트카드</button>
                    <button onClick={() => triggerToast("이용 약관")} className="hover:underline text-left cursor-pointer">이용 약관</button>
                    <button onClick={() => triggerToast("회사 정보")} className="hover:underline text-left cursor-pointer">회사 정보</button>
                  </div>
                </div>

                {/* Copyright info */}
                <div className="space-y-2 text-slate-600">
                  <p>넷플릭스서비시스코리아 유한회사 | 대표: 레지날드 숀 톰슨 | 이메일 주소: korea@netflix.com</p>
                  <p>주소: 서울특별시 종로구 우정국로 26, 템플턴스퀘어 10층 | 사업자등록번호: 165-87-00123</p>
                  <p>© 2026 Netflix Entertainment. All rights reserved.</p>
                </div>

              </div>
            </footer>

          </div>
        )}

        {/* ======================================================== */}
        {/* MOVIE DETAIL PAGE (MOCKUP 3 DESIGN)                       */}
        {/* ======================================================== */}
        {!viewingLogin && activeMovie && (
          <main className="flex-1 relative animate-fadeIn p-6 md:p-12 space-y-8 min-h-screen pb-20">
            {/* dynamic blur aura */}
            <div className="detail-bg-blur" />

            {/* Back button */}
            <div className="relative z-10">
              <button 
                onClick={() => setActiveMovie(null)}
                className="text-xs font-bold text-slate-400 hover:text-white cursor-pointer transition-colors flex items-center gap-1.5"
              >
                <span>← 뒤로 가기</span>
              </button>
            </div>

            {/* Header backdrop movie banner text layout */}
            <div className="relative z-10 pt-4 space-y-4">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded bg-primary/20 border border-primary/30 text-[9px] font-black tracking-wider text-[#aba1ff]">
                  TOP 10
                </span>
                <span className="text-xs font-bold text-slate-400">
                  {activeMovie.releaseYear} • {activeMovie.runtime}분 • {activeMovie.ageRating || "15세 관람가"}
                </span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight">{activeMovie.title}</h2>
            </div>

            {/* Columns structure */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
              
              {/* Left Column (8/12 width) */}
              <div className="lg:col-span-8 space-y-8">
                
                {/* Score and Review box */}
                <div className="bg-[#151622] border border-white/5 rounded-3xl p-6 md:p-8 space-y-5 shadow-xl">
                  <h3 className="text-base font-bold text-white">이 작품에 내 평점 남기기</h3>
                  
                  {/* Star selection */}
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((starVal) => (
                      <button
                        key={starVal}
                        onClick={() => {
                          if (!isLoggedIn) {
                            triggerToast("평가하려면 먼저 로그인해 주세요.");
                            setViewingLogin(true);
                            return;
                          }
                          setDetailRating(starVal);
                        }}
                        className="p-1 cursor-pointer transition-transform hover:scale-120 focus:outline-none"
                      >
                        <Star 
                          className={`w-8 h-8 ${
                            starVal <= detailRating 
                              ? "text-yellow-500 fill-yellow-500" 
                              : "text-slate-600 hover:text-yellow-500"
                          }`} 
                        />
                      </button>
                    ))}
                    {detailRating > 0 && (
                      <span className="text-sm font-black text-yellow-500 ml-2">{detailRating}점 선택됨</span>
                    )}
                  </div>

                  {/* Dynamic Preference Tags Selection Panel */}
                  {detailRating > 0 && (
                    <div className="space-y-2 pt-2 border-t border-white/5 animate-fadeIn">
                      <p className="text-[11px] font-bold text-slate-400">
                        {detailRating >= 4 
                          ? "이 작품의 어떤 점이 좋으셨나요? (선택 시 맞춤 추천 가산점 부여)" 
                          : "이 작품의 어떤 점이 아쉬우셨나요? (선택 시 맞춤 추천 감점 반영)"}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {/* Genres */}
                        {activeMovie.genres.map(genre => {
                          const isSelected = (selectedTags[activeMovie.id] || []).includes(genre);
                          return (
                            <button
                              key={`genre-${genre}`}
                              onClick={() => handleToggleTag(activeMovie.id, genre)}
                              className={`px-3 py-1.5 rounded-full border text-[10px] font-bold transition-all cursor-pointer ${
                                isSelected 
                                  ? "bg-primary/20 border-primary text-[#aba1ff]" 
                                  : "bg-[#1f2030]/50 border-white/5 text-slate-400 hover:text-slate-200"
                              }`}
                            >
                              장르: {genre}
                            </button>
                          );
                        })}

                        {/* Cast */}
                        {activeMovie.cast.map(actor => {
                          const isSelected = (selectedTags[activeMovie.id] || []).includes(actor);
                          return (
                            <button
                              key={`actor-${actor}`}
                              onClick={() => handleToggleTag(activeMovie.id, actor)}
                              className={`px-3 py-1.5 rounded-full border text-[10px] font-bold transition-all cursor-pointer ${
                                isSelected 
                                  ? "bg-primary/20 border-primary text-[#aba1ff]" 
                                  : "bg-[#1f2030]/50 border-white/5 text-slate-400 hover:text-slate-200"
                              }`}
                            >
                              배우: {actor}
                            </button>
                          );
                        })}

                        {/* Director */}
                        {(() => {
                          const isSelected = (selectedTags[activeMovie.id] || []).includes(activeMovie.director);
                          return (
                            <button
                              onClick={() => handleToggleTag(activeMovie.id, activeMovie.director)}
                              className={`px-3 py-1.5 rounded-full border text-[10px] font-bold transition-all cursor-pointer ${
                                isSelected 
                                  ? "bg-primary/20 border-primary text-[#aba1ff]" 
                                  : "bg-[#1f2030]/50 border-white/5 text-slate-400 hover:text-slate-200"
                              }`}
                            >
                              감독: {activeMovie.director}
                            </button>
                          );
                        })()}
                      </div>
                    </div>
                  )}

                  {/* Character input review text area */}
                  <div className="space-y-1.5">
                    <textarea
                      placeholder={isLoggedIn ? "작품에 대한 생각을 자유롭게 남겨주세요. (최대 200자)" : "로그인 후 생생한 감상평을 입력해 보세요!"}
                      value={detailReview}
                      disabled={!isLoggedIn}
                      onChange={(e) => setDetailReview(e.target.value.slice(0, 200))}
                      rows={4}
                      className="w-full bg-black/60 border border-white/10 rounded-2xl p-4 text-xs font-semibold outline-none text-white focus:border-primary/45 placeholder-slate-600 transition-all leading-relaxed disabled:opacity-50"
                    />
                    <div className="flex justify-end text-[10px] text-slate-500 font-extrabold">
                      {detailReview.length} / 200
                    </div>
                  </div>

                  {/* Share and save controls */}
                  <div className="flex justify-between items-center pt-2">
                    <button 
                      onClick={() => triggerToast("공유하기 주소가 복사되었습니다.")}
                      className="p-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-slate-400 hover:text-white transition-all cursor-pointer"
                      title="공유하기"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => {
                        if (!isLoggedIn) {
                          triggerToast("로그인이 필요한 서비스입니다.");
                          setViewingLogin(true);
                          return;
                        }
                        handleSaveReview();
                      }}
                      className="bg-primary hover:bg-primary-hover hover:shadow-[0_4px_15px_rgba(138,125,240,0.3)] px-6 py-3 rounded-2xl text-xs font-black text-white transition-all cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <Bookmark className="w-3.5 h-3.5 fill-current" />
                      <span>저장</span>
                    </button>
                  </div>

                </div>

                {/* Synopsis Section */}
                <div className="space-y-3">
                  <h3 className="text-sm font-black tracking-wider text-slate-500 uppercase">줄거리</h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-semibold">
                    {activeMovie.summary}
                  </p>
                </div>

                {/* Cast / Crew list */}
                {activeMovie.crew && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-black tracking-wider text-slate-500 uppercase">출연 / 제작</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {activeMovie.crew.map((member, idx) => (
                        <div key={idx} className="bg-[#151622] border border-white/5 p-3 rounded-2xl flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-900 border border-white/10 shrink-0">
                            <img src={member.avatarUrl} alt={member.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="min-w-0">
                            <span className="text-xs font-bold text-slate-200 block truncate">{member.name}</span>
                            <span className="text-[10px] text-slate-500 font-semibold block mt-0.5 truncate">{member.role}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {/* Right Column */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Taste analysis match box */}
                <div className="bg-primary/5 border border-primary/20 rounded-3xl p-6 space-y-4 shadow-xl">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">🎯</span>
                    <h3 className="text-xs font-black tracking-widest text-[#aba1ff] uppercase">취향 분석 결과</h3>
                  </div>

                  <div className="text-xs text-slate-200 leading-relaxed font-bold space-y-2">
                    {(() => {
                      const matchedItem = recResults.find(r => r.content.id === activeMovie.id);
                      if (matchedItem && matchedItem.matchedReasons.length > 0) {
                        return matchedItem.matchedReasons.map((reason, idx) => (
                          <div key={idx} className="flex items-start gap-1.5">
                            <span className="text-primary font-bold">✓</span>
                            <span className="text-slate-300 font-semibold text-[11px]">{reason}</span>
                          </div>
                        ));
                      }
                      return <div className="text-slate-400 font-semibold text-[11px]">이 작품은 평점 및 기본 정보 바탕으로 추천되었습니다.</div>;
                    })()}
                  </div>

                  <div className="space-y-1.5 pt-2">
                    <div className="flex justify-between text-[11px] font-black text-slate-400">
                      <span>일치도</span>
                      <span className="text-[#aba1ff]">{recResults.find(r => r.content.id === activeMovie.id)?.score || 90}%</span>
                    </div>
                    {/* progress bar */}
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all duration-500" 
                        style={{ width: `${recResults.find(r => r.content.id === activeMovie.id)?.score || 90}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Streaming Platforms Watch buttons */}
                <div className="space-y-3">
                  <h3 className="text-xs font-black tracking-widest text-slate-500 uppercase">시청 가능 OTT</h3>
                  <div className="space-y-2.5">
                    {activeMovie.platforms.includes("Netflix") && (
                      <button 
                        onClick={() => window.open("https://netflix.com", "_blank")}
                        className="w-full bg-[#e50914] hover:bg-[#b20710] py-3.5 rounded-2xl text-xs font-black tracking-wide flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99] shadow-md shadow-red-950/20 text-white"
                      >
                        <span>넷플릭스에서 바로보기</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {activeMovie.platforms.includes("TVING") && (
                      <button 
                        onClick={() => window.open("https://tving.com", "_blank")}
                        className="w-full bg-[#ff0558] hover:bg-[#d60447] py-3.5 rounded-2xl text-xs font-black tracking-wide flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99] shadow-md shadow-red-950/20 text-white"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>티빙에서 바로보기</span>
                      </button>
                    )}
                    {!activeMovie.platforms.includes("Netflix") && !activeMovie.platforms.includes("TVING") && (
                      <button 
                        onClick={() => triggerToast(`선택하신 ${activeMovie.platforms[0]} 채널 연동 페이지로 이동합니다.`)}
                        className="w-full bg-[#151622] border border-white/10 hover:border-white/20 py-3.5 rounded-2xl text-xs font-black tracking-wide flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99] text-slate-200"
                      >
                        <span>{activeMovie.platforms.join(", ")}에서 바로보기</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Additional Information list table */}
                <div className="bg-[#151622] border border-white/5 rounded-3xl p-5 space-y-4 shadow-xl text-xs font-semibold">
                  <h3 className="text-xs font-black tracking-widest text-slate-500 uppercase border-b border-white/5 pb-2">영화 정보</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-500">원제</span>
                      <span className="text-slate-300">{activeMovie.originalTitle || activeMovie.title}</span>
                    </div>
                    <div className="flex justify-between border-t border-white/3 pt-3">
                      <span className="text-slate-500">제작 국가</span>
                      <span className="text-slate-300">{activeMovie.country || "대한민국"}</span>
                    </div>
                    <div className="flex justify-between border-t border-white/3 pt-3">
                      <span className="text-slate-500">배급</span>
                      <span className="text-slate-300">{activeMovie.distributor || "N/A"}</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </main>
        )}

      </div>

    </div>
  );
}
