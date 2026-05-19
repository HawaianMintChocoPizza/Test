"use client";

import React, { useState } from "react";
import "./globals.css";

interface WikiResult {
  title: string;
  description?: string;
  extract: string;
  thumbnail?: {
    source: string;
  };
  content_urls: {
    desktop: {
      page: string;
    };
  };
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<WikiResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const searchPerson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setSearched(true);
    setResult(null);

    try {
      // 1. Search for the closest title
      const searchRes = await fetch(
        `https://ko.wikipedia.org/w/api.php?action=query&origin=*&format=json&list=search&srsearch=${encodeURIComponent(
          query
        )}`
      );
      const searchData = await searchRes.json();

      if (!searchData.query.search || searchData.query.search.length === 0) {
        setError("검색 결과가 없습니다. 다른 이름으로 검색해보세요.");
        setLoading(false);
        return;
      }

      const bestTitle = searchData.query.search[0].title;

      // 2. Fetch the summary for the title
      const summaryRes = await fetch(
        `https://ko.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
          bestTitle
        )}`
      );
      
      if (!summaryRes.ok) {
        throw new Error("요약 정보를 가져오는데 실패했습니다.");
      }

      const summaryData = await summaryRes.json();
      setResult(summaryData);
    } catch (err: any) {
      setError(err.message || "오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className={`search-wrapper ${searched ? "searched" : ""}`}>
        <div className="header-section">
          <h1>Person Explorer</h1>
          <p>궁금한 인물을 검색해보세요</p>
        </div>

        <form className="search-form" onSubmit={searchPerson}>
          <div className="input-group">
            <svg
              className="search-icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="예: 세종대왕, 스티브 잡스..."
              className="search-input"
            />
            <button type="submit" className="search-btn" disabled={loading}>
              {loading ? <span className="loader"></span> : "검색"}
            </button>
          </div>
        </form>
      </div>

      {error && (
        <div className="error-message glass-panel">
          <p>{error}</p>
        </div>
      )}

      {result && !loading && (
        <div className="result-card glass-panel">
          <div className="result-header">
            {result.thumbnail ? (
              <img
                src={result.thumbnail.source}
                alt={result.title}
                className="person-image"
              />
            ) : (
              <div className="person-image-placeholder">
                <span>{result.title.charAt(0)}</span>
              </div>
            )}
            <div className="person-titles">
              <h2>{result.title}</h2>
              {result.description && (
                <span className="person-description">{result.description}</span>
              )}
            </div>
          </div>
          
          <div className="person-details">
            <p className="person-extract">{result.extract}</p>
            <a
              href={result.content_urls.desktop.page}
              target="_blank"
              rel="noopener noreferrer"
              className="read-more-btn"
            >
              위키백과에서 자세히 보기
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
