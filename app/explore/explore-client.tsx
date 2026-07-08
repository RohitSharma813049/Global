"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

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
  subcategory_ids?: string[]
  cover_image?: string | null
  banner_image?: string | null
}

export default function ExploreClient({ 
  publications, 
  allCategories, 
  contentTypes,
  initialCategory
}: { 
  publications: Publication[];
  allCategories: {id: string, name: string}[];
  contentTypes: {name: string, slug: string}[];
  initialCategory?: string;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  
  const [filters, setFilters] = useState<{
    subjects: string[]
    subcategories: string[]
    authors: string[]
    types: string[]
    yearRange: [number, number]
  }>(() => {
    const initialSubjects: string[] = [];
    const initialTypes: string[] = [];
    
    if (initialCategory) {
      // Check if it matches a content type (accounting for singular/plural mismatches like 'theses' vs 'thesis', 'articles' vs 'article')
      const matchedType = contentTypes.find(ct => 
        ct.slug === initialCategory || 
        ct.slug + 's' === initialCategory || 
        initialCategory.replace(/s$/, '') === ct.slug ||
        (ct.slug === 'thesis' && initialCategory === 'theses') ||
        (ct.slug === 'magazine' && initialCategory === 'magazines')
      );
      if (matchedType) {
        initialTypes.push(matchedType.slug);
      }
      // Check if it matches a subject category
      const slugify = (text: string) => text.toLowerCase().replace(/&/g, '&amp;').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const matchedSubject = allCategories.find(c => {
         const cleanName = c.name.toString().replace(/<[^>]*>?/gm, '').replace(/&amp;/g, '&');
         const slug = cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
         return slug === initialCategory;
      });
      if (matchedSubject) {
        // use the exact display name because the filter logic looks for exact name
        initialSubjects.push(matchedSubject.name);
      }
    }
    
    return {
      subjects: initialSubjects,
      subcategories: [],
      authors: [],
      types: initialTypes,
      yearRange: [2000, new Date().getFullYear()],
    };
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

      const matchesSubject = filters.subjects.length === 0 || filters.subjects.some(s => s.toLowerCase() === categoryName.toLowerCase());
      const matchesAuthor = filters.authors.length === 0 || filters.authors.some(a => a.toLowerCase() === authorName.toLowerCase());
      const matchesType = filters.types.length === 0 || filters.types.some(t => t.toLowerCase() === (p.content_type || "").toLowerCase());
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
                  <Link href="/">Home</Link>
                  <span className="ph-breadcrumb-sep">›</span>
                  <span>Explore Publications</span>
                </nav>
                <h1 className="ph-title">Explore All <em>Publications</em></h1>
              </div>

              <div className="ph-stats" aria-label="Repository statistics">
                <div className="ph-stat">
                  <div className="ph-stat-n">{publications.length}</div>
                  <div className="ph-stat-l">PUBLICATIONS</div>
                </div>
                <div className="ph-stat">
                  <div className="ph-stat-n">350+</div>
                  <div className="ph-stat-l">JOURNALS</div>
                </div>
                <div className="ph-stat">
                  <div className="ph-stat-n">25K+</div>
                  <div className="ph-stat-l">RESEARCHERS</div>
                </div>
                <div className="ph-stat">
                  <div className="ph-stat-n">80+</div>
                  <div className="ph-stat-l">COUNTRIES</div>
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

            {/* Active filters */}
            {(filters.subjects.length > 0 || filters.types.length > 0 || filters.authors.length > 0 || filters.yearRange[1] < new Date().getFullYear()) && (
              <>
                <div className="sb-block" id="activeBlock">
                  <div className="sb-block-title">
                    Active Filters
                    <button className="sb-clear-btn" id="clearAllBtn" onClick={() => setFilters({ subjects: [], subcategories: [], authors: [], types: [], yearRange: [2000, new Date().getFullYear()] })}>Clear all</button>
                  </div>
                  <div className="active-chip-row" id="activeChipRow">
                    {filters.types.map(t => (
                      <div key={`type-${t}`} className="active-chip">
                        {contentTypes.find(ct => ct.slug === t)?.name || t}
                        <span className="active-chip-x" onClick={() => toggleFilter('types', t)}>✕</span>
                      </div>
                    ))}
                    {filters.subjects.map(s => (
                      <div key={`subj-${s}`} className="active-chip">
                        {s}
                        <span className="active-chip-x" onClick={() => toggleFilter('subjects', s)}>✕</span>
                      </div>
                    ))}
                    {filters.authors.map(a => (
                      <div key={`auth-${a}`} className="active-chip">
                        {a}
                        <span className="active-chip-x" onClick={() => toggleFilter('authors', a)}>✕</span>
                      </div>
                    ))}
                    {filters.yearRange[1] < new Date().getFullYear() && (
                      <div className="active-chip">
                        Up to {filters.yearRange[1]}
                        <span className="active-chip-x" onClick={() => setFilters(prev => ({ ...prev, yearRange: [prev.yearRange[0], new Date().getFullYear()] }))}>✕</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="sb-hr" id="activeHr"></div>
              </>
            )}

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
              {availableSubjects.slice(0, 4).map((subject) => (
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
              {availableSubjects.length > 4 && (
                <details className="group cursor-pointer">
                  <summary className="show-more list-none" id="showMoreSubBtn">
                    Show {availableSubjects.length - 4} more
                    <svg className="group-open:rotate-180 transition-transform" width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </summary>
                  <div className="mt-2">
                    {availableSubjects.slice(4).map((subject) => (
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
                </details>
              )}
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
              {availableAuthors.length > 5 && (
                <details className="group cursor-pointer">
                  <summary className="show-more list-none mt-2">
                    Show {availableAuthors.length - 5} more
                    <svg className="group-open:rotate-180 transition-transform inline-block ml-1" width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </summary>
                  <div className="mt-2 space-y-2">
                    {availableAuthors.slice(5).map((author) => (
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
                </details>
              )}
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
                id="yearSlider"
                min="2000" 
                max={new Date().getFullYear()} 
                value={filters.yearRange[1]}
                onChange={handleYearChange}
                step="1" 
                aria-label="Maximum year" 
                style={{ background: `linear-gradient(to right, var(--violet) ${((filters.yearRange[1] - 2000) / (new Date().getFullYear() - 2000)) * 100}%, var(--rule) ${((filters.yearRange[1] - 2000) / (new Date().getFullYear() - 2000)) * 100}%)` }}
              />
            </div>
          </aside>

          {/* ── RESULTS ── */}
          <main className="results-panel">
            {/* Toolbar */}
            <div className="toolbar reveal in-view">
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

            {filteredPublications.length === 0 && (
              <div className="flex justify-center py-12 text-gray-500">No publications found matching your filters.</div>
            )}
            <div id="pubGrid" className={isListView ? "list-mode" : ""}>
              {filteredPublications.map(pub => (
                <Link href={`/publications/${pub.id}`} key={pub.id} className="pub-card reveal in-view">
                  <div className="pc-img">
                    <span className="pc-type-badge pbadge-type">{pub.content_type || 'PUBLICATION'}</span>
                    <button className="pc-bookmark" aria-label="Save publication" onClick={(e) => e.preventDefault()}>
                      <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M12.6667 14L8 10.6667L3.33333 14V3.33333C3.33333 2.97971 3.47381 2.64057 3.72386 2.39052C3.97391 2.14048 4.31304 2 4.66667 2H11.3333C11.687 2 12.0261 2.14048 12.2761 2.39052C12.5262 2.64057 12.6667 2.97971 12.6667 3.33333V14Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                    <img 
                      src={pub.cover_image || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=400&fit=crop"} 
                      alt={pub.title} 
                    />
                  </div>
                  <div className="pc-body">
                    <div className="pc-meta">
                      <span className="pc-subject">{pub.categories?.name || 'GENERAL'}</span>
                    </div>
                    <h3 className="pc-title">{pub.title}</h3>
                    <div className="pc-author">
                      <div className="pc-avatar">
                        <img 
                          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" 
                          alt={pub.scholars?.users?.raw_user_meta_data?.full_name || pub.scholars?.users?.raw_user_meta_data?.name || "Author"} 
                        />
                      </div>
                      <span className="pc-author-name">
                        {pub.scholars?.users?.raw_user_meta_data?.full_name || pub.scholars?.users?.raw_user_meta_data?.name || "Unknown Author"}
                      </span>
                    </div>
                    <div className="pc-desc">
                      <p>{pub.abstract}</p>
                    </div>
                    <div className="pc-footer">
                      <span className="pc-read">Read Full Publication →</span>
                      <div className="pc-dl">
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{marginRight: 4}}><path d="M14 10V12.6667C14 13.0203 13.8595 13.3594 13.6095 13.6095C13.3594 13.8595 13.0203 14 12.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V10M4.66667 6.66667L8 10M8 10L11.3333 6.66667M8 10V2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        <span className="pdf-pi">PDF</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
}
