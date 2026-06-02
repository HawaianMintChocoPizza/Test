export interface Content {
  id: string;
  title: string;
  type: 'movie' | 'drama';
  genres: string[];
  director: string;
  cast: string[];
  rating: number; // e.g. 4.8, 3.5
  runtime: number; // in minutes
  releaseYear: number;
  summary: string;
  thumbnail: string;
  moods: string[];
  platforms: string[];
  attributes: {
    story: number;
    direction: number;
    music: number;
    acting: number;
  };
  isIndependent: boolean;
  
  // Design Mockup Rich Metadata
  originalTitle?: string;
  country?: string;
  distributor?: string;
  ageRating?: string;
  crew?: { name: string; role: string; avatarUrl: string }[];
  cardFooterTag?: { text: string; iconType?: string };
  baseScore?: number;
  tasteExplanation?: string;
  backdropUrl?: string;
}

export const contents: Content[] = [
  {
    id: "movie-parasite",
    title: "기생충",
    type: "movie",
    genres: ["드라마", "스릴러"],
    director: "봉준호",
    cast: ["송강호", "이선균", "조여정", "최우식"],
    rating: 4.9,
    runtime: 132,
    releaseYear: 2019,
    summary: "전원 백수로 살 길 막막하지만 금슬은 좋은 기택(송강호) 가족. 장남 기우(최우식)에게 명문대생 친구가 연결시켜 준 고액 과외 자리는 모처럼 싹튼 고정 수입의 희망이다. 온 가족의 도움과 기대 속에 박사장(이선균) 집으로 향하는 기우. 글로벌 IT기업의 CEO인 박사장 저택에 도착한 기우는 젊고 아름다운 사모님 연교(조여정)를 만나게 된다. 그러나 이렇게 시작된 두 가족의 만남 뒤로, 걷잡을 수 없는 사건이 기다리고 있었으니...",
    thumbnail: "https://image.tmdb.org/t/p/w500/jjHccoFjbqlfr4VGLVLT7yek0Xn.jpg",
    moods: ["몰입감 있는", "생각할 거리 있는", "긴장감 있는"],
    platforms: ["Netflix", "TVING"],
    attributes: { story: 4.9, direction: 5.0, music: 4.5, acting: 4.9 },
    isIndependent: false,
    originalTitle: "Parasite",
    country: "대한민국",
    distributor: "CJ ENM",
    ageRating: "15세 관람가",
    baseScore: 98,
    tasteExplanation: "'상류사회' 평점 기반",
    cardFooterTag: { text: "인기급상승", iconType: "flame" },
    crew: [
      { name: "봉준호", role: "감독", avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80" },
      { name: "송강호", role: "기택 역", avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80" },
      { name: "이선균", role: "박사장 역", avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80" },
      { name: "조여정", role: "연교 역", avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80" }
    ]
  },
  {
    id: "drama-squidgame",
    title: "오징어 게임",
    type: "drama",
    genres: ["스릴러", "액션", "드라마"],
    director: "황동혁",
    cast: ["이정재", "박해수", "오영수", "위하준"],
    rating: 4.8,
    runtime: 60,
    releaseYear: 2021,
    summary: "456억 원의 상금이 걸린 의문의 서바이벌에 참가한 사람들이 최후의 승자가 되기 위해 목숨을 걸고 극한의 게임에 도전하는 이야기를 담은 넷플릭스 오리지널 시리즈.",
    thumbnail: "https://image.tmdb.org/t/p/w500/yQGaui0bQ5Ai3KIFBB45nTeIqad.jpg",
    moods: ["긴장감 있는", "몰입감 있는"],
    platforms: ["Netflix"],
    attributes: { story: 4.7, direction: 4.8, music: 4.6, acting: 4.8 },
    isIndependent: false,
    originalTitle: "Squid Game",
    country: "대한민국",
    distributor: "Netflix",
    ageRating: "청소년 관람불가",
    baseScore: 95,
    tasteExplanation: "'도박의 늪' 시청 기반",
    cardFooterTag: { text: "시즌 2 공개 예정", iconType: "calendar" },
    crew: [
      { name: "황동혁", role: "감독", avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&h=120&q=80" },
      { name: "이정재", role: "성기훈 역", avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=120&h=120&q=80" },
      { name: "박해수", role: "조상우 역", avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&h=120&q=80" },
      { name: "위하준", role: "황준호 역", avatarUrl: "https://images.unsplash.com/photo-1500048993953-d23a436266cf?auto=format&fit=crop&w=120&h=120&q=80" }
    ]
  },
  {
    id: "movie-1212",
    title: "서울의 봄",
    type: "movie",
    genres: ["드라마", "역사"],
    director: "김성수",
    cast: ["황정민", "정우성", "이성민", "박해준"],
    rating: 4.8,
    runtime: 141,
    releaseYear: 2023,
    summary: "1979년 12월 12일, 수도 서울에서 일어난 신군부 세력의 반란을 막기 위해 목숨을 건 일촉즉발의 9시간을 그린 실화 기반 영화.",
    thumbnail: "https://image.tmdb.org/t/p/w500/ukVVnY9ovwl78WE5KndcpA6SnAm.jpg",
    moods: ["긴장감 있는", "몰입감 있는", "생각할 거리 있는"],
    platforms: ["Netflix", "TVING", "Wavve"],
    attributes: { story: 4.9, direction: 4.9, music: 4.4, acting: 5.0 },
    isIndependent: false,
    originalTitle: "12.12: The Day",
    country: "대한민국",
    distributor: "플러스엠 엔터테인먼트",
    ageRating: "12세 관람가",
    baseScore: 92,
    tasteExplanation: "'남산의 부장들' 평점 기반",
    cardFooterTag: { text: "천만 관객 돌파", iconType: "trophy" },
    crew: [
      { name: "김성수", role: "감독", avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80" },
      { name: "황정민", role: "전두광 역", avatarUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=120&h=120&q=80" },
      { name: "정우성", role: "이태신 역", avatarUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=120&h=120&q=80" },
      { name: "이성민", role: "정상호 역", avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&h=120&q=80" }
    ]
  },
  {
    id: "movie-decisiontoleave",
    title: "헤어질 결심",
    type: "movie",
    genres: ["로맨스", "드라마", "미스터리"],
    director: "Park Chan-wook",
    cast: ["탕웨이", "박해일", "이정현", "고경표"],
    rating: 4.7,
    runtime: 138,
    releaseYear: 2022,
    summary: "산 정상에서 추락한 한 남자의 변사 사건을 수사하게 된 형사 해준이 사망자의 아내 서래를 만나고 의심과 관심을 동시에 느끼며 시작되는 멜로 스릴러.",
    thumbnail: "https://image.tmdb.org/t/p/w500/rXEJ28XDQsogIGqwVEgwM2oDdpl.jpg",
    moods: ["몰입감 있는", "생각할 거리 있는", "감동적인"],
    platforms: ["Netflix", "TVING", "Wavve", "Watcha"],
    attributes: { story: 4.8, direction: 4.9, music: 4.7, acting: 4.8 },
    isIndependent: false,
    originalTitle: "Decision to Leave",
    country: "대한민국",
    distributor: "CJ ENM",
    ageRating: "15세 관람가",
    baseScore: 89,
    tasteExplanation: "'박찬욱 컬렉션' 기반",
    cardFooterTag: { text: "러닝타임 138분", iconType: "clock" },
    crew: [
      { name: "박찬욱", role: "감독", avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&h=120&q=80" },
      { name: "탕웨이", role: "송서래 역", avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80" },
      { name: "박해일", role: "장해준 역", avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80" },
      { name: "이정현", role: "안정안 역", avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80" }
    ]
  },
  {
    id: "movie-extremejob",
    title: "극한직업",
    type: "movie",
    genres: ["코미디", "액션"],
    director: "이병헌",
    cast: ["류승룡", "이하늬", "진선규", "이동휘", "공명"],
    rating: 4.6,
    runtime: 111,
    releaseYear: 2019,
    summary: "해체 위기의 마약반 5인방이 범죄조직 소탕을 위해 위장창업한 '마약치킨'이 맛집으로 입소문을 타면서 벌어지는 코믹 수사극.",
    thumbnail: "https://image.tmdb.org/t/p/w500/lzzb384pgYyr0GQvu3K2ZW62CEE.jpg",
    moods: ["가볍게", "웃긴"],
    platforms: ["Netflix", "TVING", "Watcha"],
    attributes: { story: 4.0, direction: 4.2, music: 3.7, acting: 4.7 },
    isIndependent: false,
    originalTitle: "Extreme Job",
    country: "대한민국",
    distributor: "CJ ENM",
    ageRating: "15세 관람가",
    baseScore: 87,
    tasteExplanation: "'코미디 페어' 기반",
    cardFooterTag: { text: "#코미디 #범죄" },
    crew: [
      { name: "이병헌", role: "감독", avatarUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=120&h=120&q=80" },
      { name: "류승룡", role: "고상기 역", avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=120&h=120&q=80" },
      { name: "이하늬", role: "장연수 역", avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80" },
      { name: "진선규", role: "마봉팔 역", avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80" }
    ]
  },
  {
    id: "movie-roundup4",
    title: "범죄도시 4",
    type: "movie",
    genres: ["액션", "범죄"],
    director: "허명행",
    cast: ["마동석", "김무열", "박지환", "이동휘"],
    rating: 4.5,
    runtime: 109,
    releaseYear: 2024,
    summary: "괴물형사 마석도가 대규모 온라인 불법 도박 조직을 움직이는 특수부대 용병 출신의 빌런 백창기와 IT 업계 천재 CEO 장동철에 맞서 펼치는 범죄 소탕 작전.",
    thumbnail: "https://image.tmdb.org/t/p/w500/jucHQwnRSma1O9V2bM007e4eSd7.jpg",
    moods: ["가볍게", "긴장감 있는"],
    platforms: ["Disney+", "Wavve"],
    attributes: { story: 3.6, direction: 4.4, music: 4.0, acting: 4.4 },
    isIndependent: false,
    originalTitle: "The Roundup: Punishment",
    country: "대한민국",
    distributor: "에이비오엔터테인먼트",
    ageRating: "15세 관람가",
    baseScore: 85,
    tasteExplanation: "'액션 매니아' 기반",
    cardFooterTag: { text: "#액션 #마동석" },
    crew: [
      { name: "허명행", role: "감독", avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&h=120&q=80" },
      { name: "마동석", role: "마석도 역", avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80" },
      { name: "김무열", role: "백창기 역", avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&h=120&q=80" },
      { name: "박지환", role: "장이수 역", avatarUrl: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=120&h=120&q=80" }
    ]
  },
  {
    id: "movie-thewailing",
    title: "곡성",
    type: "movie",
    genres: ["미스터리", "스릴러", "공포"],
    director: "나홍진",
    cast: ["곽도원", "황정민", "쿠니무라 준", "천우희"],
    rating: 4.6,
    runtime: 156,
    releaseYear: 2016,
    summary: "외지인이 나타난 후 시작된 의문의 사건들과 기이한 소문 속에서 미스터리하게 얽히는 사람들의 이야기를 그린 오컬트 스릴러 영화.",
    thumbnail: "https://image.tmdb.org/t/p/w500/k9AKtgRErXjz14lFHL2IJVCgwOT.jpg",
    moods: ["긴장감 있는", "몰입감 있는", "생각할 거리 있는"],
    platforms: ["Netflix", "Watcha"],
    attributes: { story: 4.8, direction: 4.9, music: 4.6, acting: 4.9 },
    isIndependent: true,
    originalTitle: "The Wailing",
    country: "대한민국",
    distributor: "이십세기폭스코리아",
    ageRating: "15세 관람가",
    baseScore: 82,
    tasteExplanation: "'미스터리 스릴러' 기반",
    cardFooterTag: { text: "#미스터리 #공포" },
    crew: [
      { name: "나홍진", role: "감독", avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80" },
      { name: "곽도원", role: "전종구 역", avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80" },
      { name: "황정민", role: "일광 역", avatarUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=120&h=120&q=80" },
      { name: "천우희", role: "무명 역", avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80" }
    ]
  },
  {
    id: "movie-spacesweepers",
    title: "승리호",
    type: "movie",
    genres: ["SF/판타지", "액션"],
    director: "조성희",
    cast: ["송중기", "김태리", "진선규", "유해진"],
    rating: 4.4,
    runtime: 136,
    releaseYear: 2021,
    summary: "2092년, 우주쓰레기 청소선 승리호의 선원들이 대량살상무기로 알려진 인간형 로봇 도로시를 발견한 후 위험한 거래에 뛰어드는 이야기.",
    thumbnail: "https://image.tmdb.org/t/p/w500/vOefWMYqC1S3aiCTD5MD8HeXl0Y.jpg",
    moods: ["몰입감 있는", "가볍게"],
    platforms: ["Netflix"],
    attributes: { story: 3.9, direction: 4.6, music: 4.3, acting: 4.4 },
    isIndependent: false,
    originalTitle: "Space Sweepers",
    country: "대한민국",
    distributor: "Netflix",
    ageRating: "12세 관람가",
    baseScore: 79,
    tasteExplanation: "'SF 대서사시' 기반",
    cardFooterTag: { text: "#SF #우주" },
    crew: [
      { name: "조성희", role: "감독", avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&h=120&q=80" },
      { name: "송중기", role: "김태호 역", avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&h=120&q=80" },
      { name: "김태리", role: "장선장 역", avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80" },
      { name: "유해진", role: "업동이 역", avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80" }
    ]
  },
  
  // Sidebar Recently Watched Movie items
  {
    id: "movie-exhuma",
    title: "파묘",
    type: "movie",
    genres: ["미스터리", "스릴러", "공포"],
    director: "장재현",
    cast: ["최민식", "김고은", "유해진", "이도현"],
    rating: 4.7,
    runtime: 134,
    releaseYear: 2024,
    summary: "거액의 돈을 받고 수상한 묘를 이장한 풍수사와 장의사, 무속인들에게 벌어지는 기이한 사건을 담은 오컬트 미스터리 영화.",
    thumbnail: "https://image.tmdb.org/t/p/w500/tw0i3kkmOTjDjGFZTLHKhoeXVvA.jpg",
    moods: ["긴장감 있는", "몰입감 있는"],
    platforms: ["Netflix", "TVING"],
    attributes: { story: 4.6, direction: 4.8, music: 4.5, acting: 4.9 },
    isIndependent: false,
    originalTitle: "Exhuma",
    country: "대한민국",
    distributor: "쇼박스",
    ageRating: "15세 관람가",
    baseScore: 88,
    tasteExplanation: "'검은 사제들' 시청 기반",
    crew: [
      { name: "장재현", role: "감독", avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80" },
      { name: "최민식", role: "김상덕 역", avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80" },
      { name: "김고은", role: "이화림 역", avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80" },
      { name: "유해진", role: "고영근 역", avatarUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=120&h=120&q=80" }
    ]
  },
  {
    id: "drama-moving",
    title: "무빙",
    type: "drama",
    genres: ["액션", "SF/판타지", "드라마"],
    director: "박인제",
    cast: ["류승룡", "한효주", "조인성", "차태현", "류승범"],
    rating: 4.8,
    runtime: 45,
    releaseYear: 2023,
    summary: "초능력을 숨긴 채 현재를 살아가는 아이들과, 과거의 아픈 비밀을 숨긴 채 살아온 부모들이 시대와 세대를 넘어 닥치는 거대한 위험에 함께 맞서는 초능력 액션 히어로물.",
    thumbnail: "https://image.tmdb.org/t/p/w500/pUZxbnF2i4gHf55tjuKIURDi8vR.jpg",
    moods: ["몰입감 있는", "감동적인"],
    platforms: ["Disney+"],
    attributes: { story: 4.8, direction: 4.7, music: 4.5, acting: 4.8 },
    isIndependent: false,
    originalTitle: "Moving",
    country: "대한민국",
    distributor: "Disney+",
    ageRating: "18세 관람가",
    baseScore: 91,
    tasteExplanation: "'웹툰 원작' 기반",
    crew: [
      { name: "박인제", role: "감독", avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&h=120&q=80" },
      { name: "류승룡", role: "장주원 역", avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=120&h=120&q=80" },
      { name: "한효주", role: "이미현 역", avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80" },
      { name: "조인성", role: "김두식 역", avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&h=120&q=80" }
    ]
  }
];
