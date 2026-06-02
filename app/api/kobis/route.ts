import { NextResponse } from 'next/server';

// TMDb API 키를 입력하세요. (TMDb 회원가입 후 설정 > API 메뉴에서 즉시 발급 가능)
const TMDB_API_KEY: string = '7d8ba6b42314e25c5f9e2e8122ef33f2'; 

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  const query = searchParams.get('query');
  const movieCd = searchParams.get('movieCd');
  const titleParam = searchParams.get('title');
  const typeParam = searchParams.get('type') || 'movie';
  const releaseYearParam = searchParams.get('releaseYear');
  
  const key = 'cbee15f70c226510a500cccd61295dd5';

  try {
    if (action === 'search') {
      if (!query) {
        return NextResponse.json({ error: 'Missing query parameter' }, { status: 400 });
      }
      const url = `http://www.kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieList.json?key=${key}&movieNm=${encodeURIComponent(query)}&itemPerPage=10`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`KOBIS API returned status ${response.status}`);
      }
      const data = await response.json();

      // 검색 영화 리스트에 대해 TMDb 포스터/줄거리 실시간 병렬 매핑
      const movieList = data?.movieListResult?.movieList || [];
      if (movieList.length > 0 && TMDB_API_KEY && TMDB_API_KEY !== 'YOUR_TMDB_API_KEY') {
        const enrichedMovieList = await Promise.all(
          movieList.map(async (movie: any) => {
            let posterUrl = "";
            let plotText = "";
            const title = movie.movieNm || "";
            const releaseYear = movie.prdtYear || "";
            
            try {
              // 1단계: 제작년도 포함 검색
              let tmdbUrl = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(title)}&language=ko-KR&primary_release_year=${releaseYear}`;
              let tmdbRes = await fetch(tmdbUrl);
              let tmdbData = await tmdbRes.json();
              
              // 결과가 없을 경우 연도 필터 해제 2단계 검색
              if (!tmdbData?.results || tmdbData.results.length === 0) {
                tmdbUrl = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(title)}&language=ko-KR`;
                tmdbRes = await fetch(tmdbUrl);
                tmdbData = await tmdbRes.json();
              }
              
              const result = tmdbData?.results?.[0];
              if (result) {
                if (result.poster_path) {
                  posterUrl = `https://image.tmdb.org/t/p/w500${result.poster_path}`;
                }
                if (result.overview) {
                  plotText = result.overview;
                }
              }
            } catch (err) {
              console.error(`TMDb search enrichment error for ${title}:`, err);
            }
            
            return {
              ...movie,
              tmdb: {
                posterUrl,
                plotText
              }
            };
          })
        );
        
        data.movieListResult.movieList = enrichedMovieList;
      }

      return NextResponse.json(data);
    } else if (action === 'detail') {
      let title = "";
      let releaseYear = "";
      let type = "movie"; // 'movie' | 'tv'
      let movieInfo: any = null;
      let data: any = {};

      if (movieCd) {
        const url = `http://www.kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieInfo.json?key=${key}&movieCd=${movieCd}`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`KOBIS API returned status ${response.status}`);
        }
        data = await response.json();
        movieInfo = data?.movieInfoResult?.movieInfo;
        
        if (movieInfo) {
          title = movieInfo.movieNm || "";
          releaseYear = movieInfo.openDt && movieInfo.openDt.length >= 4
            ? movieInfo.openDt.substring(0, 4)
            : (movieInfo.prdtYear || "");
          type = "movie";
        }
      } else {
        // 로컬 콘텐츠의 경우 (movieCd가 없고 titleParam이 전달됨)
        title = titleParam || "";
        releaseYear = releaseYearParam || "";
        type = typeParam === 'drama' ? 'tv' : 'movie';
      }

      if (!title) {
        return NextResponse.json({ error: 'Missing movieCd or title parameter' }, { status: 400 });
      }

      // TMDb 영화/TV 포스터 및 줄거리, 인물 정보 연동 추가 (폴백 지원)
      let posterUrl = "";
      let plotText = "";
      let credits: { name: string; role: string; avatarUrl: string }[] = [];

      if (TMDB_API_KEY && TMDB_API_KEY !== 'YOUR_TMDB_API_KEY') {
        try {
          let tmdbUrl = "";
          if (type === 'tv') {
            tmdbUrl = `https://api.themoviedb.org/3/search/tv?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(title)}&language=ko-KR${releaseYear ? `&first_air_date_year=${releaseYear}` : ''}`;
          } else {
            tmdbUrl = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(title)}&language=ko-KR${releaseYear ? `&primary_release_year=${releaseYear}` : ''}`;
          }

          let tmdbRes = await fetch(tmdbUrl);
          let tmdbData = await tmdbRes.json();

          // 만약 개봉일 오차 등으로 검색 결과가 없을 경우, 개봉연도 필터 없이 전체 조회
          if (!tmdbData?.results || tmdbData.results.length === 0) {
            if (type === 'tv') {
              tmdbUrl = `https://api.themoviedb.org/3/search/tv?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(title)}&language=ko-KR`;
            } else {
              tmdbUrl = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(title)}&language=ko-KR`;
            }
            tmdbRes = await fetch(tmdbUrl);
            tmdbData = await tmdbRes.json();
          }

          if (tmdbRes.ok) {
            const result = tmdbData?.results?.[0];
            if (result) {
              if (result.poster_path) {
                posterUrl = `https://image.tmdb.org/t/p/w500${result.poster_path}`;
              }
              if (result.overview) {
                plotText = result.overview;
              }

              // TMDb Credits API 추가 호출하여 실제 인물 사진과 배역명 맵핑
              try {
                const creditsUrl = `https://api.themoviedb.org/3/${type}/${result.id}/credits?api_key=${TMDB_API_KEY}&language=ko-KR`;
                const creditsRes = await fetch(creditsUrl);
                if (creditsRes.ok) {
                  const creditsData = await creditsRes.json();
                  
                  // 1. 감독(Director) 찾기
                  let directorItem = creditsData?.crew?.find((c: any) => c.job === 'Director');
                  if (!directorItem && type === 'tv') {
                    // TV의 경우 Creator/Director가 명확하지 않으므로 Executive Producer, Writer, Creator 등을 검색
                    directorItem = creditsData?.crew?.find((c: any) => 
                      c.job === 'Executive Producer' || c.job === 'Writer' || c.job === 'Producer' || c.job === 'Series Director'
                    );
                  }
                  
                  if (directorItem) {
                    credits.push({
                      name: directorItem.name,
                      role: "감독",
                      avatarUrl: directorItem.profile_path 
                        ? `https://image.tmdb.org/t/p/w185${directorItem.profile_path}` 
                        : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80"
                    });
                  }
                  
                  // 2. 출연 배우 상위 5명
                  const castList = creditsData?.cast?.slice(0, 5) || [];
                  castList.forEach((actor: any) => {
                    credits.push({
                      name: actor.name,
                      role: actor.character ? `${actor.character} 역` : "출연 배우",
                      avatarUrl: actor.profile_path 
                        ? `https://image.tmdb.org/t/p/w185${actor.profile_path}` 
                        : "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80"
                    });
                  });
                }
              } catch (creditsErr) {
                console.error("TMDb Credits fetch error:", creditsErr);
              }
            }
          }
        } catch (tmdbErr) {
          console.error("TMDb integration fetch error:", tmdbErr);
          // TMDb 연동 실패 시 에러를 억제하여 KOBIS 정보가 정상 노출되도록 함
        }
      }
      
      return NextResponse.json({
        ...data,
        tmdb: {
          posterUrl,
          plotText,
          credits
        }
      });
    } else {
      return NextResponse.json({ error: 'Invalid action parameter' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('KOBIS API proxy error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
