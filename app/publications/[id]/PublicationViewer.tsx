"use client";

import React, { useState } from 'react';

interface PublicationViewerProps {
  publication: any;
  isVideo: boolean;
}

export default function PublicationViewer({ publication, isVideo }: PublicationViewerProps) {
  const [activeTab, setActiveTab] = useState<'pdf' | 'ebook' | 'book'>('pdf');

  // Simple Page Navigation State
  const [page, setPage] = useState(1);
  const totalPages = 312; // Example static total pages, ideally from publication metadata

  const handleZoom = (dir: number) => {
    // Placeholder zoom logic
    console.log("Zoom", dir);
  };

  const handlePageNav = (dir: number) => {
    setPage(prev => Math.max(1, Math.min(totalPages, prev + dir)));
  };

  const getSimulatedContent = (pageNum: number) => {
    const abstractText = publication.abstract || "<p>No content available.</p>";
    const chunks = [
      abstractText,
      "<p>The methodology applied in this research involves a comprehensive analysis of the existing literature and empirical data gathered over the course of several months. We utilized both qualitative and quantitative approaches to ensure a robust framework.</p>",
      "<p>Results indicate a significant correlation between the variables tested. The statistical significance suggests that the initial hypothesis holds true under the specified conditions, pointing towards a new understanding of the core mechanisms.</p>",
      "<p>Discussion of these results suggests that further investigation is warranted. While the current data provides a strong foundation, edge cases and outliers must be examined in greater detail to formulate a universal theory.</p>",
      "<p>Conclusion: The findings provide a robust framework for future studies. By establishing this baseline, subsequent research can focus on refining the parameters and exploring the broader implications of these discoveries in real-world scenarios.</p>",
      "<p>References and citations used throughout this work demonstrate the extensive background research that informed our approach. Key foundational texts provided the necessary theoretical backing for our methodology.</p>"
    ];
    // Return a chunk based on the page number so it changes as the user turns pages
    return chunks[(pageNum - 1) % chunks.length];
  };

  const isValidFileUrl = publication.file_url && (
    publication.file_url.toLowerCase().endsWith('.pdf') || 
    publication.file_url.includes('supabase.co') ||
    publication.file_url.startsWith('blob:') ||
    publication.file_url.startsWith('http') && !publication.file_url.includes(typeof window !== 'undefined' ? window.location.hostname : '')
  );

  if (isVideo) {
    return (
      <div className="viewer-shell bg-black flex items-center justify-center h-[600px] md:h-[700px]">
        <iframe 
          src={publication.file_url} 
          className="w-full h-full border-0"
          allowFullScreen
          title={publication.title}
        ></iframe>
      </div>
    );
  }

  return (
    <div className="select-none" onContextMenu={(e) => e.preventDefault()}>
      <div className="viewer-tabs" role="tablist">
        <button 
          className={`vtab ${activeTab === 'pdf' ? 'on' : ''}`} 
          role="tab" 
          aria-selected={activeTab === 'pdf'} 
          onClick={() => setActiveTab('pdf')}
        >
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><rect x="2" y="1" width="10" height="12" rx="1.2" stroke="currentColor" strokeWidth="1.3"/><line x1="4" y1="4.5" x2="10" y2="4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><line x1="4" y1="7" x2="10" y2="7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
          PDF View
        </button>
        <button 
          className={`vtab ${activeTab === 'ebook' ? 'on' : ''}`} 
          role="tab" 
          aria-selected={activeTab === 'ebook'} 
          onClick={() => setActiveTab('ebook')}
        >
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><rect x="1" y="2" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><line x1="7" y1="2" x2="7" y2="12" stroke="currentColor" strokeWidth="1.2"/></svg>
          eBook View
        </button>
        <button 
          className={`vtab ${activeTab === 'book' ? 'on' : ''}`} 
          role="tab" 
          aria-selected={activeTab === 'book'} 
          onClick={() => setActiveTab('book')}
        >
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M2 12V2C2 1.44772 2.44772 1 3 1H7V13H3C2.44772 13 2 12.5523 2 12Z" stroke="currentColor" strokeWidth="1.3"/><path d="M12 12V2C12 1.44772 11.5523 1 11 1H7V13H11C11.5523 13 12 12.5523 12 12Z" stroke="currentColor" strokeWidth="1.3"/></svg>
          Page Turn
        </button>
      </div>

      <div className="viewer-shell">

        {/* ── PDF viewer ── */}
        <div className={`viewer-panel ${activeTab === 'pdf' ? 'on' : ''}`}>
          <div className="pdf-bar">
            <button className="ptbtn" onClick={() => handlePageNav(-1)}><svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M8 2L4 6l4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
            <button className="ptbtn" onClick={() => handlePageNav(1)}><svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
            <span className="pdf-pi">Page <span>{page}</span> of {totalPages}</span>
            <span className="pdf-sp"></span>
            <button className="ptbtn" onClick={() => handleZoom(-1)}><svg width="10" height="10" viewBox="0 0 12 12" fill="none"><line x1="3" y1="6" x2="9" y2="6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg></button>
            <span className="pdf-zl">100%</span>
            <button className="ptbtn" onClick={() => handleZoom(1)}><svg width="10" height="10" viewBox="0 0 12 12" fill="none"><line x1="6" y1="3" x2="6" y2="9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><line x1="3" y1="6" x2="9" y2="6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg></button>
          </div>
          <div className="pdf-vp relative">
            <div className="pdf-pg flex flex-col justify-center items-center min-h-[800px] w-full">
              {isValidFileUrl ? (
                <iframe 
                  src={`${publication.file_url}#toolbar=0`} 
                  className="w-full h-full absolute inset-0 mix-blend-multiply"
                  title={publication.title}
                ></iframe>
              ) : (
                <div className="flex flex-col items-center justify-center text-zinc-400 absolute inset-4 bg-zinc-50 border-2 border-dashed border-zinc-200 rounded-lg">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-4 opacity-50"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                  <p>Document not available for preview</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── eBook viewer ── */}
        <div className={`viewer-panel ${activeTab === 'ebook' ? 'on' : ''}`}>
          <div className="eb-bar">
            <button className="ptbtn" onClick={() => handlePageNav(-1)}><svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M8 2L4 6l4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
            <button className="ptbtn" onClick={() => handlePageNav(1)}><svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
            <div className="eb-prog"><div className="eb-fill" style={{ width: `${(page / totalPages) * 100}%` }}></div></div>
            <span className="eb-lbl">Progress {Math.round((page / totalPages) * 100)}%</span>
          </div>
          <div className="eb-vp">
            <p className="text-[9.5px] font-bold tracking-[0.18em] uppercase text-[#2F115D] mb-[9px]">
              {page === 1 ? 'Introduction' : `Section ${Math.ceil(page / 5)}`}
            </p>
            {page === 1 && <h2 className="eb-ct">{publication.title}</h2>}
            <div className="eb-body">
              <div dangerouslySetInnerHTML={{ __html: getSimulatedContent(page) }} />
            </div>
          </div>
        </div>

        {/* ── Page Turn View (Natural Book) ── */}
        <div className={`viewer-panel ${activeTab === 'book' ? 'on' : ''}`}>
          <div className="pdf-bar">
             <button className="ptbtn" onClick={() => handlePageNav(-2)}><svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M8 2L4 6l4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
             <button className="ptbtn" onClick={() => handlePageNav(2)}><svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
             <span className="pdf-pi">Pages <span>{page}-{page+1}</span> of {totalPages}</span>
             <span className="pdf-sp"></span>
          </div>
          <div className="book-view-wrapper">
             <div className="book-container">
                {/* Left Page */}
                <div className="book-page">
                   <div className="text-[10px] font-bold text-zinc-400 mb-4">{page}</div>
                   <div className="eb-body text-sm flex-1">
                     <p className="mb-4 italic text-xs text-gray-400">Simulated page {page}</p>
                     {page === 1 && <h3 className="font-bold mb-2 text-lg text-zinc-800">{publication.title}</h3>}
                     <div dangerouslySetInnerHTML={{ __html: getSimulatedContent(page) }} />
                   </div>
                </div>
                
                {/* Right Page */}
                <div className="book-page">
                   <div className="text-[10px] font-bold text-zinc-400 mb-4 text-right">{page + 1}</div>
                   <div className="eb-body text-sm flex-1">
                     <p className="mb-4 italic text-xs text-gray-400">Simulated page {page + 1}</p>
                     <div dangerouslySetInnerHTML={{ __html: getSimulatedContent(page + 1) }} />
                   </div>
                </div>

                <div className="book-spine"></div>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
