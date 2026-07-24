"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export interface Scholar {
  id: string;
  name: string;
  initials: string;
  professional_role: string;
  country: string;
  country_code: string;
  flag_emoji: string;
  domain: string;
  description: string;
  is_honorary: boolean;
  is_verified: boolean;
  is_featured: boolean;
  total_views?: number;
  total_downloads?: number;
  avatar_url?: string;
  banner_url?: string;
  gallery_images?: string[];
  gallery_videos?: string[];
}

export interface ScholarVideo {
  id: string;
  scholar_id: string;
  title: string;
  metadata: string;
  video_url: string;
  is_main_video: boolean;
}

export interface ScholarPublication {
  id: string;
  scholar_id: string;
  title: string;
  metadata: string;
  tag: string;
  url: string;
}

interface Props {
  scholar?: Scholar;
  videos?: ScholarVideo[];
  publications?: ScholarPublication[];
  allScholars?: Scholar[];
  isOwner?: boolean;
}

export default function GSPDistinguishedScholars({ scholar, videos = [], publications = [], allScholars = [], isOwner = false }: Props) {
  const [activeTab, setActiveTab] = useState('All');

  const uniqueTags = Array.from(new Set(publications.map(p => p.tag))).sort();
  const filterTabs = ['All', ...uniqueTags];

  const filteredPublications = activeTab === 'All' ? publications : publications.filter(p => p.tag === activeTab);
  if (!scholar) return null;

  return (
    <div className="font-['Space_Grotesk'] text-[#0A0A0A] bg-[#F8F7FC] min-h-screen pb-24">
      {/* Hero Header */}
      <div className="bg-white border-b border-[#ECEAF4] pt-16 pb-12 px-6 md:px-12 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center">
          
          <div className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-[3px] border-white shadow-lg mb-6 relative bg-[#F8F7FC]">
            {scholar.avatar_url ? (
               <Image src={scholar.avatar_url} alt={scholar.name} fill className="object-cover" />
            ) : (
               <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-[#2F115D]">{scholar.initials}</div>
            )}
            <div className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-white border-2 border-[#ECEAF4] flex items-center justify-center text-sm shadow-sm">
              {scholar.flag_emoji}
            </div>
          </div>

          <h1 className="font-['Cormorant_Garamond'] text-4xl md:text-5xl font-bold tracking-tight mb-2 text-[#0A0A0A]">
            {scholar.name}
          </h1>
          <p className="text-lg text-[#2F115D] font-medium mb-6">
            {scholar.professional_role}
          </p>

          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {scholar.is_verified && (
              <span className="px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M10 3L4.5 8.5 2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Verified Scholar
              </span>
            )}
            {scholar.is_honorary && (
              <span className="px-3 py-1 bg-[#2F115D] text-white rounded-full text-[10px] font-bold uppercase tracking-widest">
                Honorary
              </span>
            )}
            <span className="px-3 py-1 bg-white border border-[#ECEAF4] text-gray-600 rounded-full text-[10px] font-bold uppercase tracking-widest">
              {scholar.domain}
            </span>
          </div>

          <div className="flex gap-4">
            <button className="h-10 px-6 bg-[#2F115D] text-white rounded-lg text-xs font-bold tracking-widest uppercase hover:bg-[#1f0b3d] hover:shadow-[0_4px_14px_rgba(47,17,93,0.3)] transition-all">
              Connect
            </button>
            {isOwner && (
              <Link href="/dashboard/settings" className="h-10 px-6 bg-white border border-[#ECEAF4] text-[#0A0A0A] rounded-lg text-xs font-bold tracking-widest uppercase hover:border-[#2F115D] hover:text-[#2F115D] transition-all flex items-center justify-center">
                Edit Profile
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-[1000px] mx-auto px-6 md:px-12 py-12 flex flex-col gap-12">
        
        {/* About Section */}
        <div className="bg-white p-8 md:p-10 rounded-2xl border border-[#ECEAF4] shadow-sm">
          <div className="text-[9.5px] font-bold tracking-[0.18em] uppercase text-gray-400 flex items-center gap-2 mb-6 pb-2 border-b border-[#ECEAF4]">
            <span className="w-[18px] h-[2px] bg-[#2F115D] rounded-[1px] block"></span>
            About Scholar
          </div>
          <p className="text-gray-600 font-light leading-relaxed whitespace-pre-wrap">
            {scholar.description}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-2xl border border-[#ECEAF4] text-center flex flex-col items-center justify-center shadow-sm">
            <div className="font-['Cormorant_Garamond'] text-4xl font-bold text-[#2F115D] mb-1">
              {(scholar.total_views || 0).toLocaleString()}
            </div>
            <div className="text-[10px] font-bold tracking-[0.1em] uppercase text-gray-400">Profile Views</div>
          </div>
          <div className="bg-white p-8 rounded-2xl border border-[#ECEAF4] text-center flex flex-col items-center justify-center shadow-sm">
            <div className="font-['Cormorant_Garamond'] text-4xl font-bold text-[#2F115D] mb-1">
              {publications.length}
            </div>
            <div className="text-[10px] font-bold tracking-[0.1em] uppercase text-gray-400">Publications</div>
          </div>
          <div className="bg-white p-8 rounded-2xl border border-[#ECEAF4] text-center flex flex-col items-center justify-center shadow-sm">
            <div className="font-['Cormorant_Garamond'] text-4xl font-bold text-[#2F115D] mb-1">
              {(scholar.total_downloads || 0).toLocaleString()}
            </div>
            <div className="text-[10px] font-bold tracking-[0.1em] uppercase text-gray-400">Downloads</div>
          </div>
        </div>

        {/* Scholar Reviews (Peer Reviews) Section Placeholder */}
        <div className="bg-white p-8 md:p-10 rounded-2xl border border-[#ECEAF4] shadow-sm">
          <div className="text-[9.5px] font-bold tracking-[0.18em] uppercase text-gray-400 flex items-center gap-2 mb-6 pb-2 border-b border-[#ECEAF4]">
            <span className="w-[18px] h-[2px] bg-[#2F115D] rounded-[1px] block"></span>
            Peer Reviews & Recommendations
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Mock Review 1 */}
            <div className="p-6 bg-[#F8F7FC] rounded-xl border border-[#ECEAF4]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-white rounded-full overflow-hidden border border-[#ECEAF4]">
                  <Image src="/placeholder-user.jpg" alt="Reviewer" width={40} height={40} className="object-cover" />
                </div>
                <div>
                  <h4 className="font-['Cormorant_Garamond'] font-bold text-gray-900 leading-tight">Dr. Alistair Vance</h4>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">Stanford University</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 font-light italic leading-relaxed">
                &quot;An exceptional contributor to the field of macroeconomics. The frameworks presented in recent publications are highly rigorous and practically applicable.&quot;
              </p>
            </div>
            {/* Mock Review 2 */}
            <div className="p-6 bg-[#F8F7FC] rounded-xl border border-[#ECEAF4]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-white rounded-full overflow-hidden border border-[#ECEAF4]">
                  <Image src="/placeholder-user.jpg" alt="Reviewer" width={40} height={40} className="object-cover" />
                </div>
                <div>
                  <h4 className="font-['Cormorant_Garamond'] font-bold text-gray-900 leading-tight">Prof. Evelyn Reyes</h4>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">Oxford Research Inst.</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 font-light italic leading-relaxed">
                &quot;The depth of knowledge and interdisciplinary approach is truly commendable. Always a pleasure collaborating on public policy papers.&quot;
              </p>
            </div>
          </div>
        </div>

        {/* Publications List */}
        {publications.length > 0 && (
          <div className="bg-white p-8 md:p-10 rounded-2xl border border-[#ECEAF4] shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-2 border-b border-[#ECEAF4]">
              <div className="text-[9.5px] font-bold tracking-[0.18em] uppercase text-gray-400 flex items-center gap-2">
                <span className="w-[18px] h-[2px] bg-[#2F115D] rounded-[1px] block"></span>
                Published Works
              </div>
              <div className="flex gap-2 flex-wrap">
                {filterTabs.map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-colors ${activeTab === tab ? 'bg-[#2F115D] text-white border-[#2F115D]' : 'bg-white text-gray-600 border-[#ECEAF4] hover:border-gray-300'}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-6">
              {filteredPublications.map((pub, i) => (
                <Link key={i} href={pub.url || `/publications/${pub.id}`} className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-[#F8F7FC] rounded-xl border border-[#ECEAF4] hover:border-[#2F115D] transition-colors">
                  <div className="flex-1">
                    <h3 className="font-['Cormorant_Garamond'] text-xl font-bold text-[#0A0A0A] mb-2 group-hover:text-[#2F115D] transition-colors leading-tight">
                      {pub.title}
                    </h3>
                    <div 
                      className="text-sm text-gray-500 font-light line-clamp-2"
                      dangerouslySetInnerHTML={{ __html: pub.metadata }}
                    />
                  </div>
                  <div className="flex-shrink-0">
                    <span className="px-3 py-1 bg-white border border-[#ECEAF4] text-[#2F115D] rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm">
                      {pub.tag}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Media Gallery */}
        {videos.length > 0 && (
          <div className="bg-white p-8 md:p-10 rounded-2xl border border-[#ECEAF4] shadow-sm">
            <div className="text-[9.5px] font-bold tracking-[0.18em] uppercase text-gray-400 flex items-center gap-2 mb-6 pb-2 border-b border-[#ECEAF4]">
              <span className="w-[18px] h-[2px] bg-[#2F115D] rounded-[1px] block"></span>
              Featured Media
            </div>
            <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-inner relative group">
              {videos[0].video_url.includes('youtube.com') || videos[0].video_url.includes('youtu.be') || videos[0].video_url.includes('vimeo.com') ? (
                <iframe 
                  src={videos[0].video_url} 
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                />
              ) : (
                <video 
                  src={videos[0].video_url} 
                  controls 
                  className="w-full h-full object-contain"
                />
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
