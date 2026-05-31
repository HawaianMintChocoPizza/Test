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

export function calculateRecommendations(
  contents: Content[],
  connectedPlatforms: string[], // e.g. ['Netflix', 'TVING']
  userEvaluations: UserEvaluation[],
  indieBoost: boolean,
  runtimePreference: string,
  likedContentIds: string[],
  dislikedContentIds: string[]
): RecommendationResult[] {
  
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

    // 4. Likes/Dislikes overrides
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
      matchedReasons: matchedReasons.slice(0, 3),
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
