"use client";

import React, { useState, useMemo } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import "./explore.css";

interface Publication {
  id: string
  title: string
  abstract: string
  content_type: string
  doi: string | null
  views: number
  downloads: number
  created_at: string
  scholars: {
    id: string
    users: {
      raw_user_meta_data: { full_name?: string, name?: string }
    } | null
  } | null
  categories: {
    name: string
  } | null
  subcategory_ids: string[]
  cover_image?: string | null
  banner_image?: string | null
}

export default function ExploreClient({ 
  publications, 
  allCategories, 
  contentTypes 
}: { 
  publications: Publication[];
  allCategories: {id: string, name: string}[];
  contentTypes: {name: string, slug: string}[];
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<{
    subjects: string[]
    subcategories: string[]
    authors: string[]
    types: string[]
    yearRange: [number, number]
  }>({
    subjects: [],
    subcategories: [],
    authors: [],
    types: [],
    yearRange: [2000, new Date().getFullYear()],
  });

  const [isListView, setIsListView] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'views' | 'downloads'>('newest');

  const availableSubjects = useMemo(() => {
    const sorted = allCategories.map(c => c.name).sort();
    const otherIndex = sorted.findIndex(name => name.toLowerCase() === 'other' || name.toLowerCase() === 'others');
    if (otherIndex !== -1) {
      const otherItem = sorted.splice(otherIndex, 1)[0];
      sorted.push(otherItem);
    }
    return sorted;
  }, [allCategories]);

  const availableAuthors = useMemo(() => {
    return Array.from(new Set(publications.map(p => p.scholars?.users?.raw_user_meta_data?.full_name || p.scholars?.users?.raw_user_meta_data?.name))).filter(Boolean).sort() as string[];
  }, [publications]);

  const availableTypes = useMemo(() => {
    return contentTypes.map(ct => ({ value: ct.slug, label: ct.name }));
  }, [contentTypes]);

  // Client-side filtering
  const filteredPublications = useMemo(() => {
    return publications.filter(p => {
      const pubYear = new Date(p.created_at).getFullYear();
      const authorName = p.scholars?.users?.raw_user_meta_data?.full_name || p.scholars?.users?.raw_user_meta_data?.name || "Unknown Author";
      const categoryName = p.categories?.name || "General";

      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            p.abstract?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSubject = filters.subjects.length === 0 || filters.subjects.includes(categoryName);
      const matchesAuthor = filters.authors.length === 0 || filters.authors.includes(authorName);
      const matchesType = filters.types.length === 0 || filters.types.includes(p.content_type);
      const matchesYear = pubYear >= filters.yearRange[0] && pubYear <= filters.yearRange[1];

      return matchesSearch && matchesSubject && matchesAuthor && matchesType && matchesYear;
    }).sort((a, b) => {
      if (sortOrder === 'views') return (b.views || 0) - (a.views || 0);
      if (sortOrder === 'downloads') return (b.downloads || 0) - (a.downloads || 0);
      
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
  }, [publications, searchQuery, filters, sortOrder]);

  const toggleFilter = (type: keyof typeof filters, value: string) => {
    setFilters(prev => {
      const currentList = prev[type] as string[];
      if (currentList.includes(value)) {
        return { ...prev, [type]: currentList.filter(item => item !== value) };
      } else {
        return { ...prev, [type]: [...currentList, value] };
      }
    });
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    setFilters(prev => ({ ...prev, yearRange: [prev.yearRange[0], val] }));
  };

  return (
    <>
      <div className="explore-wrapper">
        <div className={`mob-overlay ${isSidebarOpen ? "open" : ""}`} onClick={() => setIsSidebarOpen(false)}></div>

        {/* ══ PAGE HEADER ══ */}
        <div className="page-header">
          <div className="page-header-inner">
            <div className="ph-top">
              <div>
                <nav className="ph-breadcrumb" aria-label="Breadcrumb">
                  <a href="/">Home</a>
                  <span className="ph-breadcrumb-sep">›</span>
                  <span>Explore Publications</span>
                </nav>
                <h1 className="ph-title">Explore All <em>Publications</em></h1>
              </div>

              <div className="ph-stats" aria-label="Repository statistics">
                <div className="ph-stat">
                  <div className="ph-stat-n">{publications.length}</div>
                  <div className="ph-stat-l">Publications</div>
                </div>
                <div className="ph-stat">
                  <div className="ph-stat-n">{allCategories.length}</div>
                  <div className="ph-stat-l">Subjects</div>
                </div>
                <div className="ph-stat">
                  <div className="ph-stat-n">{availableAuthors.length}</div>
                  <div className="ph-stat-l">Scholars</div>
                </div>
                <div className="ph-stat">
                  <div className="ph-stat-n">{contentTypes.length}</div>
                  <div className="ph-stat-l">Types</div>
                </div>
              </div>
            </div>

            {/* Search bar */}
            <div className="ph-search-wrap" id="searchWrap">
              <span className="ph-search-ico">
                <svg width="17" height="17" viewBox="0 0 18 18" fill="none">
                  <circle cx="7.5" cy="7.5" r="5.5" stroke="currentColor" strokeWidth="1.6" />
                  <line x1="11.6" y1="11.6" x2="16" y2="16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </span>
              <input
                id="searchInput"
                className="ph-search-input"
                type="text"
                placeholder="Search journals, papers, authors, subjects, DOI…"
                autoComplete="off"
                aria-label="Search publications"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="ph-search-actions">
                {searchQuery && (
                  <button className="ph-search-clear" onClick={() => setSearchQuery("")} aria-label="Clear search">Clear</button>
                )}
                <button className="ph-search-btn">Search</button>
              </div>
            </div>
          </div>
        </div>

        {/* ══ BODY ══ */}
        <div className="explore-layout">
          {/* ── SIDEBAR ── */}
          <aside className={`sidebar ${isSidebarOpen ? "open" : ""}`} aria-label="Filters">
            <div className="sidebar-mobile-head">
              <span className="sidebar-mobile-title">Filters</span>
              <button className="sidebar-close-btn" onClick={() => setIsSidebarOpen(false)} aria-label="Close filters">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Publication Type */}
            <div className="sb-block">
              <div className="sb-block-title">Publication Type</div>
              {availableTypes.map((type) => (
                <label key={type.value} className="filter-row">
                  <input 
                    type="checkbox" 
                    checked={filters.types.includes(type.value)}
                    onChange={() => toggleFilter('types', type.value)} 
                  />
                  <span className="fcheck"></span>
                  <span className="filter-label">{type.label}</span>
                </label>
              ))}
            </div>
            <div className="sb-hr"></div>

            {/* Subject Category */}
            <div className="sb-block">
              <div className="sb-block-title">Subject Category</div>
              {availableSubjects.map((subject) => (
                <label key={subject} className="filter-row">
                  <input 
                    type="checkbox" 
                    checked={filters.subjects.includes(subject)}
                    onChange={() => toggleFilter('subjects', subject)}
                  />
                  <span className="fcheck"></span>
                  <span className="filter-label">{subject}</span>
                </label>
              ))}
            </div>
            <div className="sb-hr"></div>

            {/* Scholars */}
            <div className="sb-block">
              <div className="sb-block-title">Scholar</div>
              {availableAuthors.slice(0, 5).map((author) => (
                <label key={author} className="filter-row">
                  <input 
                    type="checkbox" 
                    checked={filters.authors.includes(author)}
                    onChange={() => toggleFilter('authors', author)}
                  />
                  <span className="fcheck"></span>
                  <span className="filter-label">{author}</span>
                </label>
              ))}
            </div>
            <div className="sb-hr"></div>

            {/* Year Range */}
            <div className="sb-block">
              <div className="sb-block-title">Year Published</div>
              <div className="year-display">
                <span>{filters.yearRange[0]}</span>
                <span>Up to <strong>{filters.yearRange[1]}</strong></span>
              </div>
              <input 
                type="range" 
                className="year-range" 
                min="2000" 
                max={new Date().getFullYear()} 
                value={filters.yearRange[1]}
                onChange={handleYearChange}
                step="1" 
                aria-label="Maximum year" 
              />
            </div>
          </aside>

          {/* ── RESULTS ── */}
          <main className="results-panel">
            {/* Toolbar */}
            <div className="toolbar reveal in">
              <button className="toolbar-filter-btn" onClick={() => setIsSidebarOpen(true)} aria-label="Open filters">
                <svg width="14" height="14" viewBox="0 0 15 15" fill="none">
                  <path d="M1 3h13M3 7.5h9M6 12h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                Filters
                {(filters.subjects.length > 0 || filters.types.length > 0 || filters.authors.length > 0) && (
                  <span className="toolbar-badge">
                    {filters.subjects.length + filters.types.length + filters.authors.length}
                  </span>
                )}
              </button>

              <p className="toolbar-count">
                <strong>{filteredPublications.length}</strong> publications found
              </p>

              <div className="sort-wrap">
                <select 
                  className="sort-sel" 
                  aria-label="Sort results"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as any)}
                >
                  <option value="newest">Latest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="views">Most Viewed</option>
                  <option value="downloads">Most Downloaded</option>
                </select>
                <span className="sort-caret">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1 3l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </span>
              </div>

              <div className="view-toggle" role="group" aria-label="View mode">
                <button className={`vbtn ${!isListView ? 'on' : ''}`} onClick={() => setIsListView(false)} title="Grid view">
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                    <rect x="1" y="1" width="5.5" height="5.5" rx="1.2" stroke="currentColor" strokeWidth="1.3" />
                    <rect x="8.5" y="1" width="5.5" height="5.5" rx="1.2" stroke="currentColor" strokeWidth="1.3" />
                    <rect x="1" y="8.5" width="5.5" height="5.5" rx="1.2" stroke="currentColor" strokeWidth="1.3" />
                    <rect x="8.5" y="8.5" width="5.5" height="5.5" rx="1.2" stroke="currentColor" strokeWidth="1.3" />
                  </svg>
                </button>
                <button className={`vbtn ${isListView ? 'on' : ''}`} onClick={() => setIsListView(true)} title="List view">
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                    <line x1="1" y1="3.5" x2="14" y2="3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                    <line x1="1" y1="7.5" x2="14" y2="7.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                    <line x1="1" y1="11.5" x2="14" y2="11.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            </div>

            {filteredPublications.length === 0 ? (
              <div className="flex justify-center py-12 text-gray-500">No publications found matching your filters.</div>
            ) : (
              <div className={`pub-grid ${isListView ? "list-mode" : ""}`}>
                {filteredPublications.map(pub => {
                  const authorName = pub.scholars?.users?.raw_user_meta_data?.full_name || pub.scholars?.users?.raw_user_meta_data?.name || "Unknown Author";
                  const subjectName = pub.categories?.name || "General";
                  const coverImage = pub.cover_image || "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&h=360&fit=crop&auto=format&q=80";
                  
                  return (
                    <a key={pub.id} href={`/publications/${pub.id}`} className="pub-card reveal in">
                      <div className="pc-img">
                        <span className="pc-type-badge">{pub.content_type || 'Publication'}</span>
                        <button className="pc-bookmark" aria-label="Bookmark" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                          <svg width="12" height="12" viewBox="0 0 13 14" fill="none"><path d="M2 1h9a1 1 0 011 1v11l-5.5-3L2 13V2a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </button>
                        <img src={coverImage} alt="" loading="lazy" />
                      </div>
                      <div className="pc-body">
                        <p className="pc-subject">{subjectName}</p>
                        <h3 className="pc-title">{pub.title}</h3>
                        <div className="pc-author">
                          <div className="pc-avatar">
                            <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=56&h=56&fit=crop&crop=face&auto=format&q=80" alt="" />
                          </div>
                          <span className="pc-author-name">{authorName}</span>
                        </div>
                        <p className="pc-abstract-label">Abstract</p>
                        <p className="pc-desc">{pub.abstract?.replace(/<[^>]+>/g, '')?.replace(/&nbsp;/g, ' ') || "No abstract available."}</p>
                        <div className="pc-footer">
                          <span className="pc-read">Read Full Publication <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
                          <button className="pc-dl" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }} aria-label="Download PDF">
                            <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M6 1v7M3 6l3 3 3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /><path d="M1 10h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg> PDF
                          </button>
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
}
