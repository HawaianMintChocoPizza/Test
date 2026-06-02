import { Content } from "../data/contents";

export interface UserEvaluation {
  contentId: string;
  globalRating: number;
  attributeRatings: {
    story: number;
    direction: number;
    music: number;
    acting: number;
  };
  reviewText: string;
  behaviorData: {
    watchCompletion: 'completed' | 'interrupted';
    searchMethod: 'direct_search' | 'recommend_click';
  };
}

export interface RecommendationResult {
  content: Content;
  score: number;
  matchedReasons: string[];
  rank: number;
}

export function analyzeSentiment(text: string, globalRating: number): { score: number; label: 'positive' | 'negative' | 'neutral'; keywords: string[] } {
  const posKeywords = ["존잼", "꿀잼", "미친", "최고", "갓작", "명작", "추천", "좋다", "대박", "재밌", "감동", "훌륭", "사랑", "완벽", "인생작", "좋아", "재미있", "기대", "압도"];
  const negKeywords = ["노잼", "지루", "최악", "돈아깝", "아쉽", "비추", "별로", "싫", "실망", "어색", "유치", "엉성", "망했", "부족"];

  let score = 0;
  const foundKeywords: string[] = [];

  const textLower = text.toLowerCase();
  posKeywords.forEach(kw => {
    if (textLower.includes(kw)) {
      score += 1.5;
      if (!foundKeywords.includes(kw)) foundKeywords.push(kw);
    }
  });

  negKeywords.forEach(kw => {
    if (textLower.includes(kw)) {
      score -= 1.5;
      if (!foundKeywords.includes(kw)) foundKeywords.push(kw);
    }
  });

  if (globalRating >= 4.0) score += 2;
  if (globalRating <= 2.5) score -= 2;

  let label: 'positive' | 'negative' | 'neutral' = 'neutral';
  if (score > 1.0) label = 'positive';
  else if (score < -1.0) label = 'negative';

  return { score, label, keywords: foundKeywords.slice(0, 3) };
}

export interface CustomPreference {
  type: 'genre' | 'actor';
  value: string;
  reason: string;
}

const SCORING_TABLE: Record<string, Record<number, { preferred: number; disliked: number }>> = {
  genre: {
    5: { preferred: 10, disliked: -15 },
    4: { preferred: 8, disliked: -11 },
    3: { preferred: 0, disliked: 0 },
    2: { preferred: -5, disliked: -8 },
    1: { preferred: -10, disliked: -12 }
  },
  actor: {
    5: { preferred: 7, disliked: -10 },
    4: { preferred: 5, disliked: -8 },
    3: { preferred: 0, disliked: 0 },
    2: { preferred: -3, disliked: -5 },
    1: { preferred: -7, disliked: -9 }
  },
  director: {
    5: { preferred: 5, disliked: -7 },
    4: { preferred: 3, disliked: -5 },
    3: { preferred: 0, disliked: 0 },
    2: { preferred: -2, disliked: -3 },
    1: { preferred: -5, disliked: -6 }
  }
};

export function calculateRecommendations(
  contents: Content[],
  connectedPlatforms: string[], // e.g. ['Netflix', 'TVING']
  userEvaluations: UserEvaluation[],
  indieBoost: boolean,
  runtimePreference: string,
  likedContentIds: string[],
  dislikedContentIds: string[],
  selectedTags?: Record<string, string[]>,
  customPreferences?: CustomPreference[]
): RecommendationResult[] {
  
  // Compute tag-based feedback scores
  const genreScores: Record<string, number> = {};
  const actorScores: Record<string, number> = {};
  const directorScores: Record<string, number> = {};

  if (selectedTags) {
    userEvaluations.forEach(evaluation => {
      const rating = evaluation.globalRating;
      const isPreferred = rating >= 4.0;
      const tags = selectedTags[evaluation.contentId] || [];
      
      const evalContent = contents.find(c => c.id === evaluation.contentId);
      if (!evalContent) return;

      tags.forEach(tag => {
        let tagType: 'genre' | 'actor' | 'director' | null = null;
        if (evalContent.genres.includes(tag)) {
          tagType = 'genre';
        } else if (evalContent.cast.includes(tag)) {
          tagType = 'actor';
        } else if (evalContent.director === tag) {
          tagType = 'director';
        }

        if (!tagType) return;

        const table = SCORING_TABLE[tagType];
        const ratingKey = Math.min(5, Math.max(1, Math.round(rating)));
        const scoreLookup = table[ratingKey];
        if (scoreLookup) {
          const s = isPreferred ? scoreLookup.preferred : scoreLookup.disliked;
          if (tagType === 'genre') {
            genreScores[tag] = (genreScores[tag] || 0) + s;
          } else if (tagType === 'actor') {
            actorScores[tag] = (actorScores[tag] || 0) + s;
          } else if (tagType === 'director') {
            directorScores[tag] = (directorScores[tag] || 0) + s;
          }
        }
      });
    });
  }

  const results: RecommendationResult[] = contents.map(content => {
    let score = content.baseScore || 75;
    const matchedReasons: string[] = [];

    // 1. Base taste reason
    if (content.tasteExplanation) {
      matchedReasons.push(content.tasteExplanation);
    } else {
      matchedReasons.push("당신의 다차원 속성과 매치되는 영화입니다.");
    }

    // 2. Platforms Filter & Score adjustments
    if (connectedPlatforms.length > 0) {
      const matchingPlats = content.platforms.filter(p => connectedPlatforms.includes(p));
      if (matchingPlats.length > 0) {
        matchedReasons.push(`구독 중인 플랫폼(${matchingPlats.join(", ")})에서 시청 가능합니다.`);
      } else {
        // Penalty if not on connected platforms
        score -= 15;
      }
    }

    // 3. User Evaluation adjustments
    const userEval = userEvaluations.find(e => e.contentId === content.id);
    if (userEval) {
      // Dynamic score blend
      score = Math.round((score + (userEval.globalRating / 5.0) * 100) / 2);
      matchedReasons.push(`직접 평가한 별점(${userEval.globalRating}점)이 반영되었습니다.`);
    }

    // 4. Accumulate tag-based feedback scores
    let genreSum = 0;
    content.genres.forEach(g => {
      const s = genreScores[g] || 0;
      genreSum += s;
    });
    if (genreSum > 0) {
      matchedReasons.push(`선호 장르 피드백 반영 (+${genreSum}점)`);
    } else if (genreSum < 0) {
      matchedReasons.push(`비선호 장르 피드백 감점 (${genreSum}점)`);
    }

    let actorSum = 0;
    content.cast.forEach(a => {
      const s = actorScores[a] || 0;
      actorSum += s;
    });
    if (actorSum > 0) {
      matchedReasons.push(`선호 배우 피드백 반영 (+${actorSum}점)`);
    } else if (actorSum < 0) {
      matchedReasons.push(`비선호 배우 피드백 감점 (${actorSum}점)`);
    }

    const directorSum = directorScores[content.director] || 0;
    if (directorSum > 0) {
      matchedReasons.push(`선호 감독 피드백 반영 (+${directorSum}점)`);
    } else if (directorSum < 0) {
      matchedReasons.push(`비선호 감독 피드백 감점 (${directorSum}점)`);
    }

    // 5. Accumulate custom preference scores
    let customGenreScore = 0;
    let customActorScore = 0;
    if (customPreferences) {
      customPreferences.forEach(pref => {
        if (pref.type === 'genre' && content.genres.includes(pref.value)) {
          customGenreScore += 10;
          matchedReasons.push(`선호 장르 [${pref.value}] 가산점 (+10점): "${pref.reason}"`);
        } else if (pref.type === 'actor' && content.cast.includes(pref.value)) {
          customActorScore += 7;
          matchedReasons.push(`선호 배우 [${pref.value}] 가산점 (+7점): "${pref.reason}"`);
        }
      });
    }

    // Apply combined scores
    score += (genreSum + actorSum + directorSum + customGenreScore + customActorScore);

    // 6. Likes/Dislikes overrides
    if (likedContentIds.includes(content.id)) {
      score += 5;
    }
    if (dislikedContentIds.includes(content.id)) {
      score = 0;
    }

    // Ensure range 0 to 100
    const finalScore = Math.min(100, Math.max(0, score));

    return {
      content,
      score: finalScore,
      matchedReasons: matchedReasons.slice(0, 4), // Allow up to 4 reasons
      rank: 0
    };
  });

  // Filter by runtime preference
  let filteredResults = results;
  if (runtimePreference && runtimePreference !== "all") {
    filteredResults = results.filter(item => {
      const rt = item.content.runtime;
      if (runtimePreference === "short") return rt <= 60;
      if (runtimePreference === "medium") return rt > 60 && rt <= 130;
      if (runtimePreference === "long") return rt > 130;
      return true;
    });
  }

  // Sort by score desc, then rating desc
  filteredResults.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return b.content.rating - a.content.rating;
  });

  // Assign ranks
  return filteredResults.map((item, index) => ({
    ...item,
    rank: index + 1
  }));
}
