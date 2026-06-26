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
    <div>
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
            <div className="pdf-pg flex flex-col justify-center items-center">
              {publication.file_url ? (
                <iframe 
                  src={`${publication.file_url}#toolbar=0`} 
                  className="w-full h-full absolute inset-0 mix-blend-multiply"
                  title={publication.title}
                ></iframe>
              ) : (
                <div className="text-zinc-400">PDF Document Placeholder</div>
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
            <p className="text-[9.5px] font-bold tracking-[0.18em] uppercase text-[#2F115D] mb-[9px]">Introduction</p>
            <h2 className="eb-ct">{publication.title}</h2>
            <div className="eb-body">
              <div dangerouslySetInnerHTML={{ __html: publication.abstract?.replace(/&nbsp;/g, ' ') || '<p>Content preview not available.</p>' }} />
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
                     <p className="mb-4">This is a simulated left page in the natural book viewer. In a full implementation, the actual PDF or HTML text content would flow into this column.</p>
                     <h3 className="font-bold mb-2 text-lg text-zinc-800">{publication.title}</h3>
                     <div dangerouslySetInnerHTML={{ __html: publication.abstract?.substring(0, 500) || '' }} />
                   </div>
                </div>
                
                {/* Right Page */}
                <div className="book-page">
                   <div className="text-[10px] font-bold text-zinc-400 mb-4 text-right">{page + 1}</div>
                   <div className="eb-body text-sm flex-1">
                     <p className="mb-4">This is the simulated right page. Reading flow continues here seamlessly.</p>
                     <div dangerouslySetInnerHTML={{ __html: publication.abstract?.substring(500) || '' }} />
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
