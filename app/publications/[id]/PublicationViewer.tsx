"use client";

import React, { useState, useEffect, useRef } from 'react';

interface PublicationViewerProps {
  publication: any;
  isVideo: boolean;
}

export default function PublicationViewer({ publication, isVideo }: PublicationViewerProps) {
  const [activeTab, setActiveTab] = useState<'pdf' | 'ebook' | 'book'>('pdf');
  const [isLoading, setIsLoading] = useState(true);
  const [docxContent, setDocxContent] = useState<string | null>(null);
  const [isDocxLoading, setIsDocxLoading] = useState(false);
  const [docxError, setDocxError] = useState<string | null>(null);

  // Text-to-Speech State
  const [isReading, setIsReading] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [bookPages, setBookPages] = useState<string[]>([]);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<1 | -1>(1);

  useEffect(() => {
    const updateVoices = () => {
      if (typeof window === 'undefined' || !window.speechSynthesis) return;
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      if (availableVoices.length > 0 && !selectedVoice) {
        // Prefer a natural English voice if available
        const preferred = availableVoices.find(v => v.lang.includes('en-') && (v.name.includes('Natural') || v.name.includes('Google'))) || availableVoices[0];
        setSelectedVoice(preferred.voiceURI);
      }
    };

    if (typeof window !== 'undefined' && window.speechSynthesis) {
      updateVoices();
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
    
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    }
  }, [selectedVoice]);

  useEffect(() => {
    const fetchAndParse = async () => {
      if (!publication?.file_url) return;
      
      const fileUrl = publication.file_url;
      const isDocx = fileUrl.toLowerCase().endsWith('.docx') || fileUrl.toLowerCase().endsWith('.doc');
      const isPdf = fileUrl.toLowerCase().endsWith('.pdf');
      
      if (!isDocx && !isPdf) return;
      
      setIsDocxLoading(true);
      setDocxError(null);
      
      try {
        if (isDocx) {
          // Use our robust Node.js backend parser for DOCX to avoid browser bundling issues
          const docxResponse = await fetch(`/api/parse-docx?url=${encodeURIComponent(fileUrl)}`);
          if (!docxResponse.ok) throw new Error("Backend DOCX parsing failed.");
          const docxData = await docxResponse.json();
          if (docxData.error) throw new Error(docxData.error);
          setDocxContent(docxData.html);
        } else if (isPdf) {
          // Use client-side PDF.js for PDF extraction
          const response = await fetch(`/api/pdf-proxy?url=${encodeURIComponent(fileUrl)}`);
          if (!response.ok) throw new Error("Failed to fetch document file.");
          const arrayBuffer = await response.arrayBuffer();

          const pdfjsLib = await import('pdfjs-dist');
          // For iOS compatibility, try using min.js if possible, or fallback to min.mjs if necessary.
          // PDF.js 4+ requires mjs, but if it causes issues on some devices, limiting the parse count helps most with memory crashes.
          pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
          
          const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
          let fullText = "";
          const maxPages = Math.min(pdf.numPages, 50); // Limit to 50 pages to prevent memory crash on mobile devices
          for (let i = 1; i <= maxPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            const pageText = content.items.map((item: any) => item.str).join(" ");
            fullText += `<p class="mb-4">${pageText}</p>`;
          }
          if (pdf.numPages > 50) {
             fullText += `<p class="text-center italic text-zinc-500 my-8">... End of preview. Please download the full PDF to read the remaining ${pdf.numPages - 50} pages.</p>`;
          }
          setDocxContent(fullText);
        }
      } catch (err: any) {
        console.error("Extraction error:", err);
        setDocxError(err.message || "Failed to parse document content.");
      } finally {
        setIsDocxLoading(false);
      }
    };

    fetchAndParse();
  }, [publication?.file_url]);

  const isReadingRef = useRef(false);

  const toggleReading = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    if (isReading) {
      // Turn off reading
      window.speechSynthesis.cancel();
      setIsReading(false);
      isReadingRef.current = false;
    } else {
      // Turn on reading
      setIsReading(true);
      isReadingRef.current = true;
      startReadingCurrentPage();
    }
  };

  const handleAutoNext = () => {
    if (!isReadingRef.current) return;
    
    if (activeTab === 'book') {
      if (page + 1 < totalPages) {
         handlePageNav(2);
      } else {
         toggleReading(); // End of book
      }
    } else {
      if (page < totalPages) {
         handlePageNav(1);
      } else {
         toggleReading(); // End of book
      }
    }
  };

  const startReadingCurrentPage = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    
    let textHTML = "";
    if (activeTab === 'book') {
      textHTML = (bookPages[page - 1] || "") + " " + (bookPages[page] || "");
    } else {
      textHTML = getSimulatedContent(page);
    }
    
    const cleanText = textHTML.replace(/<[^>]+>/g, ' ').trim();
    if (!cleanText) {
       // If page is empty, just skip to next
       handleAutoNext();
       return;
    }
    
    const utterance = new SpeechSynthesisUtterance(cleanText);
    const voice = voices.find(v => v.voiceURI === selectedVoice);
    if (voice) utterance.voice = voice;
    
    utterance.onboundary = (event) => {
      if (event.name !== 'word') return;
      const percent = event.charIndex / cleanText.length;
      const containers = document.querySelectorAll('.eb-body, .bk-content');
      containers.forEach(container => {
        const targetScroll = (container.scrollHeight - container.clientHeight) * percent;
        container.scrollTo({ top: targetScroll + 100, behavior: 'smooth' });
      });
    };

    utterance.onend = () => {
      if (isReadingRef.current) {
        handleAutoNext();
      }
    };
    
    window.speechSynthesis.speak(utterance);
  };

  // Automatically start reading the new page if we flipped while reading
  useEffect(() => {
    if (isReadingRef.current) {
      startReadingCurrentPage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, activeTab]);

  // State declarations moved to top

  // Split DOCX HTML into pages for the book view
  useEffect(() => {
    if (!docxContent) return;
    
    // Fallback simple character chunking for HTML
    const chunkHtml = (html: string, maxChars = 800) => {
      const chunks = [];
      let currentChunk = "";
      
      // Simple regex to split by paragraphs or headings to avoid breaking tags
      const blocks = html.match(/<(p|h[1-6]|ul|ol|table|div)[^>]*>[\s\S]*?<\/\1>/gi);
      
      if (blocks && blocks.length > 0) {
        for (const block of blocks) {
          if (currentChunk.length + block.length > maxChars && currentChunk.length > 0) {
            chunks.push(currentChunk);
            currentChunk = block;
          } else {
            currentChunk += block;
          }
        }
        if (currentChunk) chunks.push(currentChunk);
      } else {
        // If no blocks, just chunk the text directly
        let idx = 0;
        while (idx < html.length) {
          chunks.push(html.substring(idx, idx + maxChars));
          idx += maxChars;
        }
      }
      return chunks.length > 0 ? chunks : [html];
    };

    const pages = chunkHtml(docxContent);
    // Ensure we have an even number of pages for the book spread
    if (pages.length % 2 !== 0) {
      pages.push("<div class='text-center py-20 text-zinc-300'>[Blank Page]</div>");
    }
    
    setBookPages(pages);
    setTotalPages(pages.length);
  }, [docxContent]);

  const playPageTurnSound = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      
      // Create a "swish/paper" sound using a noise buffer
      const bufferSize = ctx.sampleRate * 0.2; // 0.2 seconds
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1000, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.15);
      
      gain.gain.setValueAtTime(0.5, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      
      noise.start(ctx.currentTime);
    } catch (e) {
      console.log("Audio not supported or blocked");
    }
  };

  const handleZoom = (dir: number) => {
    // Placeholder zoom logic
    console.log("Zoom", dir);
  };

  const handlePageNav = (dir: number) => {
    if (activeTab === 'book') {
      if (isFlipping) return;
      
      const newPage = Math.max(1, Math.min(totalPages, page + dir));
      if (newPage !== page) {
        playPageTurnSound();
        setFlipDirection(dir > 0 ? 1 : -1);
        setIsFlipping(true);
        setTimeout(() => {
          setPage(newPage);
          setIsFlipping(false);
        }, 500); // Wait for CSS animation to finish
      }
    } else {
      setPage(prev => Math.max(1, Math.min(totalPages, prev + dir)));
    }
  };

  const getSimulatedContent = (pageNum: number) => {
    if (docxError) {
      return `<div class="text-center py-20 px-8">
        <h3 class="text-xl font-bold text-red-600 mb-2">Error parsing document</h3>
        <p class="text-zinc-500 max-w-md mx-auto leading-relaxed">${docxError}</p>
      </div>`;
    }
    // Return the parsed HTML for both PDF and DOCX
    if (docxContent) {
      return docxContent;
    }
    return `<div class="text-center py-20 text-zinc-500"><p>No content available.</p></div>`;
  };

  const isValidFileUrl = publication.file_url && (
    publication.file_url.toLowerCase().endsWith('.pdf') || 
    publication.file_url.toLowerCase().endsWith('.docx') || 
    publication.file_url.toLowerCase().endsWith('.doc') || 
    publication.file_url.includes('supabase.co') ||
    publication.file_url.startsWith('blob:') ||
    publication.file_url.startsWith('http') && !publication.file_url.includes(typeof window !== 'undefined' ? window.location.hostname : '')
  );

  if (isVideo) {
    return (
      <div className="viewer-shell bg-black flex items-center justify-center aspect-video w-full max-h-[75vh] relative rounded-lg overflow-hidden group">
        <video 
          src={publication.file_url} 
          className="w-full h-full object-contain"
          controls
          controlsList="nodownload"
          autoPlay={false}
          title={publication.title}
        >
          Your browser does not support the video tag.
        </video>
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
          <div className="pdf-vp relative h-full">
            <div className="pdf-pg flex flex-col justify-center items-center w-full relative">
              {isValidFileUrl ? (
                <iframe 
                  src={
                    publication.file_url.toLowerCase().endsWith('.docx') || publication.file_url.toLowerCase().endsWith('.doc')
                      ? `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(publication.file_url)}`
                      : `/api/pdf-proxy?url=${encodeURIComponent(publication.file_url)}#toolbar=1&navpanes=0`
                  }
                  className="w-full h-full absolute inset-0 mix-blend-multiply border-0"
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
            <span className="eb-lbl hidden sm:inline">Progress {Math.round((page / totalPages) * 100)}%</span>
            
            <div className="ml-auto flex items-center space-x-2 border-l border-zinc-200 pl-3">
              <button 
                className={`ptbtn shrink-0 px-3 py-1 flex items-center space-x-1.5 rounded-full font-bold transition-colors ${isReading ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                onClick={toggleReading}
                title={isReading ? "Stop Audio" : "Read Aloud"}
              >
                {isReading ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>
                ) : (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                )}
                <span className="text-2.5 uppercase tracking-wider whitespace-nowrap">{isReading ? 'Turn Off' : 'Turn On'}</span>
              </button>
              <select 
                className="text-2.5 bg-transparent border-none outline-none text-zinc-500 font-medium max-w-20 truncate cursor-pointer hidden sm:block"
                value={selectedVoice}
                onChange={(e) => setSelectedVoice(e.target.value)}
                title="Select Voice"
              >
                {voices.filter(v => v.lang.includes('en')).map(v => (
                  <option key={v.voiceURI} value={v.voiceURI}>{v.name.replace('Microsoft ', '').replace('Google ', '')}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="eb-vp">
            <p className="text-2.375 font-bold tracking-[0.18em] uppercase text-violet mb-2.25">
              Publication Text
            </p>
            {page === 1 && <h2 className="eb-ct">{publication.title}</h2>}
            <div className="eb-body">
              {isDocxLoading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                </div>
              ) : (
                <div dangerouslySetInnerHTML={{ __html: getSimulatedContent(page) }} />
              )}
            </div>
          </div>
        </div>

        {/* ── Page Turn View (Natural Book) ── */}
        <div className={`viewer-panel ${activeTab === 'book' ? 'on' : ''}`}>
          <div className="pdf-bar">
             <button className="ptbtn" onClick={() => handlePageNav(-2)}><svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M8 2L4 6l4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
             <button className="ptbtn" onClick={() => handlePageNav(2)}><svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
             <span className="pdf-pi">Pages <span>{page}-{Math.min(page+1, totalPages)}</span> of {totalPages}</span>
             <span className="pdf-sp"></span>

             <div className="ml-auto flex items-center space-x-2">
              <button 
                className={`ptbtn px-3 py-1 flex items-center space-x-1.5 rounded-full font-bold transition-colors ${isReading ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                onClick={toggleReading}
                title={isReading ? "Stop Audio" : "Read Aloud"}
              >
                {isReading ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>
                ) : (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                )}
                <span className="text-2.5 uppercase tracking-wider">{isReading ? 'Turn Off' : 'Turn On'}</span>
              </button>
              <select 
                className="text-2.5 bg-transparent border-none outline-none text-zinc-500 font-medium max-w-20 truncate cursor-pointer hidden sm:block"
                value={selectedVoice}
                onChange={(e) => setSelectedVoice(e.target.value)}
                title="Select Voice"
              >
                {voices.filter(v => v.lang.includes('en')).map(v => (
                  <option key={v.voiceURI} value={v.voiceURI}>{v.name.replace('Microsoft ', '').replace('Google ', '')}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="book-view-wrapper">
             {isDocxLoading ? (
               <div className="flex justify-center items-center py-20 w-full h-full">
                 <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
               </div>
             ) : bookPages.length > 0 ? (
               <div className="book-container relative mx-auto my-auto flex w-full max-w-225 h-full max-h-150 perspective-500 shadow-2xl rounded-sm">
                 {/* Left Page (Previous Page) - Hidden on mobile */}
                 <div className="hidden md:flex w-1/2 h-full bg-[#fdfcfaf0] border border-gray-200 border-r-0 shadow-[inset_-20px_0_20px_-20px_rgba(0,0,0,0.15)] flex-col p-6 md:p-12 overflow-hidden relative rounded-l-sm" style={{ transformOrigin: "right center" }}>
                    <div className="text-2.5 font-bold text-zinc-400 mb-6">{page}</div>
                    <div className="eb-body text-sm md:text-base flex-1 overflow-auto">
                       <div dangerouslySetInnerHTML={{ __html: bookPages[page - 1] || "" }} />
                    </div>
                 </div>

                 {/* Right Page (Current/Next Page) - Full width on mobile */}
                 <div className="w-full md:w-1/2 h-full bg-[#fdfcfaf0] border border-gray-200 md:border-l-0 shadow-[inset_20px_0_20px_-20px_rgba(0,0,0,0.15)] flex flex-col p-6 md:p-12 overflow-hidden relative rounded-r-sm" style={{ transformOrigin: "left center" }}>
                    <div className="text-2.5 font-bold text-zinc-400 mb-6 text-right md:text-left">{page + 1}</div>
                    <div className="eb-body text-sm md:text-base flex-1 overflow-auto">
                       <div dangerouslySetInnerHTML={{ __html: bookPages[page] || "" }} />
                    </div>
                 </div>
                 
                 {/* Animated Flipping Page Overlay - Only visible on desktop/md+ since mobile doesn't need 3D flip for single page */}
                 {isFlipping && (
                   <div 
                     className="hidden md:flex absolute top-0 h-full w-1/2 bg-[#fcfcfc] border border-gray-300 shadow-2xl flex-col p-6 md:p-12 overflow-hidden transition-transform duration-500 ease-in-out z-10"
                     style={{
                       left: flipDirection === 1 ? '50%' : '0',
                       transformOrigin: flipDirection === 1 ? 'left center' : 'right center',
                       animation: flipDirection === 1 ? 'flipNext 0.5s forwards' : 'flipPrev 0.5s forwards'
                     }}
                   >
                     <div className={`text-2.5 font-bold text-zinc-400 mb-6 ${flipDirection === 1 ? 'text-left' : 'text-right'}`}>
                       {flipDirection === 1 ? page + 1 : page}
                     </div>
                     <div className="eb-body text-sm md:text-base flex-1 overflow-hidden">
                        <div dangerouslySetInnerHTML={{ __html: flipDirection === 1 ? (bookPages[page] || "") : (bookPages[page - 1] || "") }} />
                     </div>
                   </div>
                 )}
                 
                 {/* Spine shadow - Only visible on desktop */}
                 <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-10 -ml-5 bg-linear-to-r from-transparent via-black/10 to-transparent pointer-events-none z-20"></div>
               </div>
              ) : null}
          </div>
        </div>

      </div>
    </div>
  );
}
