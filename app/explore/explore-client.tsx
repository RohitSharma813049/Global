"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import SaveButton from "@/components/save-button";

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
  totalCount,
  currentPage,
  initialSearch,
  initialCategories,
  initialTypes,
  initialAuthors,
  initialSort,
  allAuthors = [],
  typeCounts = {}
}: { 
  publications: Publication[];
  allCategories: {id: string, name: string}[];
  contentTypes: {name: string, slug: string}[];
  totalCount: number;
  currentPage: number;
  initialSearch?: string;
  initialCategories?: string[];
  initialTypes?: string[];
  initialAuthors?: string[];
  initialSort?: string;
  allAuthors?: string[];
  typeCounts?: Record<string, number>;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(initialSearch || "");
  const [scholarSearchQuery, setScholarSearchQuery] = useState("");
  
  const [filters, setFilters] = useState<{
    subjects: string[]
    subcategories: string[]
    authors: string[]
    types: string[]
    yearRange: [number, number]
  }>({
    subjects: initialCategories || [],
    subcategories: [],
    authors: initialAuthors || [],
    types: initialTypes || [],
    yearRange: [2000, new Date().getFullYear()],
  });

  const [isListView, setIsListView] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'views' | 'downloads'>((initialSort as any) || 'newest');
  
  const ITEMS_PER_PAGE = 12;

  // Debounced URL update
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams();
      if (searchQuery) params.set('q', searchQuery);
      if (filters.subjects.length > 0) {
        filters.subjects.forEach(c => params.append('category', c));
      }
      if (filters.types.length > 0) {
        filters.types.forEach(t => params.append('type', t));
      }
      if (filters.authors.length > 0) {
        filters.authors.forEach(a => params.append('author', a));
      }
      if (currentPage > 1) {
        params.set('page', currentPage.toString());
      }
      if (sortOrder && sortOrder !== 'newest') {
        params.set('sort', sortOrder);
      }
      
      const currentQuery = searchParams.toString();
      const newQuery = params.toString();
      
      // Prevent infinite loops by checking if the query actually changed
      if (currentQuery !== newQuery && (currentQuery || newQuery)) {
        router.push(`${pathname}?${newQuery}`);
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchQuery, filters, currentPage, sortOrder, pathname, router, searchParams]);

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
    return allAuthors;
  }, [allAuthors]);

  const filteredAuthors = useMemo(() => {
    if (!scholarSearchQuery) return availableAuthors;
    return availableAuthors.filter(a => a.toLowerCase().includes(scholarSearchQuery.toLowerCase()));
  }, [availableAuthors, scholarSearchQuery]);

  const availableTypes = useMemo(() => {
    return contentTypes.map(ct => ({ value: ct.name, label: ct.name }));
  }, [contentTypes]);

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

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const getCountForType = (type: string) => typeCounts[type] || 0;

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
                  <div className="ph-stat-n">{getCountForType('Article') || getCountForType('ARTICLE')}</div>
                  <div className="ph-stat-l">ARTICLES</div>
                </div>
                <div className="ph-stat">
                  <div className="ph-stat-n">{getCountForType('Thesis') || getCountForType('THESIS')}</div>
                  <div className="ph-stat-l">THESES</div>
                </div>
                <div className="ph-stat">
                  <div className="ph-stat-n">{getCountForType('Ebook') || getCountForType('EBOOK')}</div>
                  <div className="ph-stat-l">EBOOKS</div>
                </div>
                <div className="ph-stat">
                  <div className="ph-stat-n">{getCountForType('Magazine') || getCountForType('MAGAZINE')}</div>
                  <div className="ph-stat-l">MAGAZINES</div>
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
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                }}
              />
              <div className="ph-search-actions">
                {searchQuery && (
                  <button className="ph-search-clear" onClick={() => {
                    setSearchQuery("");
                  }} aria-label="Clear search">Clear</button>
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
              
              <div className="mb-3 relative">
                <input 
                  type="text" 
                  placeholder="Search scholars..." 
                  className="w-full text-sm py-1.5 px-3 pr-8 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  value={scholarSearchQuery}
                  onChange={(e) => setScholarSearchQuery(e.target.value)}
                />
                {scholarSearchQuery && (
                  <button 
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
                    onClick={() => setScholarSearchQuery("")}
                  >
                    ✕
                  </button>
                )}
              </div>

              <div className="max-h-60 overflow-y-auto custom-scrollbar pr-2 space-y-1">
                {filteredAuthors.length === 0 ? (
                  <div className="text-sm text-gray-500 italic py-2">No scholars found.</div>
                ) : (
                  filteredAuthors.map((author) => (
                    <label key={author} className="filter-row">
                      <input 
                        type="checkbox" 
                        checked={filters.authors.includes(author)}
                        onChange={() => toggleFilter('authors', author)}
                      />
                      <span className="fcheck"></span>
                      <span className="filter-label">{author}</span>
                    </label>
                  ))
                )}
              </div>
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
                <strong>{publications.length}</strong> publications found
              </p>

              <div className="sort-wrap">
                <select 
                  className="sort-sel w-full md:w-auto" 
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

            {publications.length === 0 && (
              <div className="flex justify-center py-12 text-gray-500">No publications found matching your filters.</div>
            )}
            <div id="pubGrid" className={isListView ? "list-mode" : ""}>
              {publications.map(pub => (
                <Link href={`/publications/${pub.id}`} key={pub.id} className="pub-card reveal in-view">
                  <div className="pc-img">
                    <span className="pc-type-badge pbadge-type">{pub.content_type || 'PUBLICATION'}</span>
                    <SaveButton 
                      variant="card" 
                      publication={{
                        id: pub.id,
                        title: pub.title,
                        type: pub.content_type,
                        author: (pub as any).author_name || (pub.scholars?.users?.raw_user_meta_data as any)?.name || (pub.scholars?.users?.raw_user_meta_data as any)?.full_name || 'Unknown Scholar',
                        url: `/publications/${pub.id}`,
                        cover_image: pub.cover_image || "/placeholder.svg",
                        abstract: pub.abstract,
                        author_avatar: (pub.scholars?.users?.raw_user_meta_data as any)?.avatar_url || (pub.scholars?.users?.raw_user_meta_data as any)?.picture || (pub.scholars?.users?.raw_user_meta_data as any)?.image || "/placeholder-user.jpg",
                        subject: pub.categories?.name || 'GENERAL'
                      }} 
                    />
                    <img 
                      src={pub.cover_image || "/placeholder.svg"} 
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
                          src={(pub.scholars?.users?.raw_user_meta_data as any)?.avatar_url || (pub.scholars?.users?.raw_user_meta_data as any)?.picture || (pub.scholars?.users?.raw_user_meta_data as any)?.image || "/placeholder-user.jpg"}
                          alt={(pub.scholars?.users?.raw_user_meta_data as any)?.full_name || (pub.scholars?.users?.raw_user_meta_data as any)?.name || "Author"} 
                        />
                      </div>
                      <span className="pc-author-name">
                        {(pub.scholars?.users?.raw_user_meta_data as any)?.full_name || (pub.scholars?.users?.raw_user_meta_data as any)?.name || "Unknown Author"}
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

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-12 mb-8">
                <button 
                  onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border rounded-md disabled:opacity-50 hover:bg-gray-50 transition-colors"
                >
                  Previous
                </button>
                <div className="text-sm text-gray-600 font-medium px-4">
                  Page {currentPage} of {totalPages}
                </div>
                <button 
                  onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border rounded-md disabled:opacity-50 hover:bg-gray-50 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
}
