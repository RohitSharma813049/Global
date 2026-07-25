"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

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

export interface ScholarReview {
  id: string;
  reviewer_name: string;
  reviewer_role: string;
  reviewer_avatar?: string;
  content: string;
}

interface Props {
  scholar?: Scholar;
  videos?: ScholarVideo[];
  publications?: ScholarPublication[];
  reviews?: ScholarReview[];
  allScholars?: Scholar[];
  isOwner?: boolean;
}

export default function GSPDistinguishedScholars({ scholar, videos = [], publications = [], reviews = [], allScholars = [], isOwner = false }: Props) {
  if (!scholar) return null;

  return (
    <div className="font-sans text-gray-900 bg-white min-h-screen pb-24">
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Header Info */}
        <div className="flex flex-col md:flex-row gap-8 mb-8 items-start">
          {/* Avatar */}
          <div className="relative w-[110px] h-[110px] flex-shrink-0 rounded-full bg-[#F0F7FF] flex items-center justify-center border border-[#CCE0FF]">
            <span className="text-[#0055FF] text-4xl font-serif">{scholar.initials}</span>
            {scholar.country_code && (
              <div className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm text-[10px] font-bold border border-gray-100">
                {scholar.country_code}
              </div>
            )}
          </div>
          
          {/* Details */}
          <div className="flex flex-col justify-center pt-1">
            <h1 className="text-[28px] font-serif text-black mb-1.5 leading-tight">
              {scholar.name}{scholar.is_honorary ? ', Hon. D.B.A.' : ''}
            </h1>
            <p className="text-[13px] text-black mb-3 font-medium">
              {scholar.professional_role}
            </p>
            
            {/* Badges */}
            <div className="flex gap-2 flex-wrap mb-4">
              {scholar.is_honorary && <span className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-[11px] font-medium">Honorary Doctorate</span>}
              {scholar.is_verified && <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-[11px] font-medium">Verified</span>}
              {scholar.is_featured && <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-[11px] font-medium">Featured Scholar</span>}
              {scholar.country_code && <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-[11px] font-medium">{scholar.country_code} {scholar.country}</span>}
              {scholar.domain && <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-[11px] font-medium">{scholar.domain}</span>}
            </div>
            
            {/* Buttons */}
            <div className="flex items-center gap-5 text-[13px] font-medium mt-1">
              <button className="px-4 py-1.5 bg-[#0A66C2] text-white rounded hover:bg-[#004182] transition-colors">+ Add to LinkedIn</button>
              {videos.length > 0 && (
                <button className="px-4 py-1.5 bg-[#512DA8] text-white rounded flex items-center gap-2 hover:bg-[#311B92] transition-colors">
                  <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg> Watch video
                </button>
              )}
              <button className="text-gray-700 hover:text-black transition-colors ml-1">Share profile</button>
              <button className="text-gray-700 hover:text-black transition-colors">Download bio</button>
            </div>
          </div>
        </div>

        {/* Bio */}
        <p className="text-[14px] leading-relaxed text-black mb-10 text-justify">
          {scholar.description}
        </p>

        {/* Honorary Alert */}
        {scholar.is_honorary && (
          <div className="bg-[#FAF4E5] border-l-[3px] border-[#C89B3C] p-5 mb-12 flex gap-4">
            <div className="text-[#C89B3C] text-lg mt-0.5 leading-none">★</div>
            <p className="text-[13px] text-black leading-relaxed">
              <strong>Honorary Doctorate — Professional Excellence Recognition.</strong> This profile recognises a distinguished professional awarded an honorary doctorate for exceptional real-world contribution to their field. This is an honorary award distinct from a research qualification, conferred in recognition of professional achievement and industry leadership.
            </p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 text-center border-b border-t border-[#F0F0F0] py-8 mb-12">
          <div>
            <div className="text-[26px] font-serif mb-1 text-black">{(scholar.total_views || 6240).toLocaleString()}</div>
            <div className="text-[11px] text-black">Profile views</div>
          </div>
          <div>
            <div className="text-[26px] font-serif mb-1 text-black">{publications.length || 3}</div>
            <div className="text-[11px] text-black">Publications</div>
          </div>
          <div>
            <div className="text-[26px] font-serif mb-1 text-black">{(scholar.total_downloads || 1890).toLocaleString()}</div>
            <div className="text-[11px] text-black">Downloads</div>
          </div>
          <div>
            <div className="text-[26px] font-serif mb-1 text-black">18</div>
            <div className="text-[11px] text-black">Countries reached</div>
          </div>
        </div>

        {/* Video Section & Playlist */}
        {videos.length > 0 && (
          <div className="mb-16">
            <h2 className="text-[17px] font-serif mb-6 text-black">Scholar video — experience & insights</h2>
            <div className="w-full aspect-[21/9] bg-[#0A0A14] flex items-center justify-center relative group rounded-sm overflow-hidden mb-2">
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
            {/* Playlist Row */}
            <div className="grid grid-cols-3 gap-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="aspect-video bg-[#1A1A24] rounded-sm relative flex flex-col justify-end p-3 hover:bg-[#2A2A35] cursor-pointer transition-colors">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
                      <div className="w-0 h-0 border-t-4 border-t-transparent border-l-6 border-l-white border-b-4 border-b-transparent ml-1"></div>
                    </div>
                  </div>
                  <div className="relative z-10 text-white text-[9px] flex justify-between items-end">
                    <span className="opacity-80">8:14 · Panel discussion</span>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center mt-6">
                    <span className="text-white text-[10px] opacity-90">Women in GCC Finance</span>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-gray-500 mt-3 leading-relaxed">
              Videos are reviewed and approved by the editorial team before publishing. Scholars may submit pre-recorded videos or participate in the GSP Interview Series.
            </p>
          </div>
        )}

        {/* Credential & location */}
        <div className="mb-16">
          <h2 className="text-[17px] font-serif mb-6 text-black">Credential & location</h2>
          <div className="flex flex-col gap-4 text-[13px] border-t border-[#F0F0F0] pt-4">
            <div className="flex justify-between">
              <span className="text-black">Honorary award</span>
              <span className="text-black text-right">Doctor of Business Administration (Hon. D.B.A.)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-black">Conferred by</span>
              <span className="text-black text-right">Global Scholar Publications · NextSkillEdge</span>
            </div>
            <div className="flex justify-between">
              <span className="text-black">Year conferred</span>
              <span className="text-black text-right">2024</span>
            </div>
            <div className="flex justify-between">
              <span className="text-black">Domain</span>
              <span className="text-black text-right">{scholar.domain || 'Investment & Finance · Sustainable Business · Women\'s Leadership'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-black">Country</span>
              <span className="text-black text-right">{scholar.country_code} {scholar.country}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-black">Profile verified</span>
              <span className="text-[#00796B] text-right">Verified by Global Scholar Publications editorial team</span>
            </div>
          </div>
        </div>

        {/* Key contributions & achievements */}
        <div className="mb-16">
          <h2 className="text-[17px] font-serif mb-6 text-black">Key contributions & achievements</h2>
          <div className="flex flex-col gap-6 border-t border-[#F0F0F0] pt-6">
            <div className="text-[13px] text-black">
              <p className="mb-1">Deployed AED 800M+ in responsible investment portfolios across GCC</p>
              <p className="text-gray-600">Investment management · Al-Rashidi Capital · 2015–present</p>
            </div>
            <div className="text-[13px] text-black">
              <p className="mb-1">Founder — GCC Women in Finance Forum (1,200+ members)</p>
              <p className="text-gray-600">Industry leadership · Cross-border network · UAE, KSA, Qatar · 2019–present</p>
            </div>
            <div className="text-[13px] text-black">
              <p className="mb-1">Advisory board — UAE Ministry of Economy Financial Inclusion Council</p>
              <p className="text-gray-600">Policy · Government advisory · 2020–2023</p>
            </div>
            <div className="text-[13px] text-black">
              <p className="mb-1">Forbes Middle East — Top 50 Most Powerful Businesswomen, 2021 & 2022</p>
              <p className="text-gray-600">Industry recognition · Regional prominence</p>
            </div>
          </div>
        </div>

        {/* Published works */}
        <div className="mb-24">
          <h2 className="text-[17px] font-serif mb-6 text-black">Published works on Global Scholar Publications</h2>
          <div className="flex flex-col gap-6 border-t border-[#F0F0F0] pt-6">
            {publications.length > 0 ? publications.map((pub, i) => (
              <div key={i} className="flex justify-between items-start gap-4 text-[13px]">
                <div>
                  <a href={`/publications/${pub.id}`} className="text-[#0A66C2] hover:underline mb-1 inline-block">
                    {pub.title}
                  </a>
                  <p className="text-black">
                    Global Scholar Publications · {new Date().getFullYear()} · DOI: 10.XXXX/gsp.2024.0{i+1}
                  </p>
                </div>
                <span className="px-3 py-1 bg-[#E8F5E9] text-[#1B5E20] rounded-full text-[10px] font-medium whitespace-nowrap">
                  {pub.tag}
                </span>
              </div>
            )) : (
              <div className="flex justify-between items-start gap-4 text-[13px]">
                <div>
                  <a href="#" className="text-[#0A66C2] hover:underline mb-1 inline-block">
                    Sustainable Finance Frameworks for Emerging Markets — A GCC Practitioner's View
                  </a>
                  <p className="text-black">Global Scholar Publications · 2024 · DOI: 10.XXXX/gsp.2024.018</p>
                </div>
                <span className="px-3 py-1 bg-[#E8F5E9] text-[#1B5E20] rounded-full text-[10px] font-medium">Article</span>
              </div>
            )}
          </div>
        </div>

        {/* DISTINGUISHED SCHOLARS - RECOMMENDED ROW */}
        <div className="mb-24">
          <div className="text-[11px] uppercase tracking-wider text-gray-500 mb-6">DISTINGUISHED SCHOLARS FROM AROUND THE WORLD</div>
          <h2 className="text-[22px] font-serif mb-2 text-black">Distinguished Scholars — 100 Leaders, 30+ Countries</h2>
          <p className="text-[13px] text-gray-800 mb-8">
            Honorary doctorate holders recognised for professional excellence across business, law, medicine, engineering, and public service worldwide.
          </p>

          <div className="flex flex-wrap gap-x-8 gap-y-4 text-[11px] font-medium mb-10 text-black">
            <span><span className="text-gray-400 text-[9px] mr-1">AE</span> UAE 14</span>
            <span><span className="text-gray-400 text-[9px] mr-1">US</span> USA 12</span>
            <span><span className="text-gray-400 text-[9px] mr-1">GB</span> UK 9</span>
            <span><span className="text-gray-400 text-[9px] mr-1">SA</span> KSA 8</span>
            <span><span className="text-gray-400 text-[9px] mr-1">IN</span> India 11</span>
            <span><span className="text-gray-400 text-[9px] mr-1">QA</span> Qatar 6</span>
            <span><span className="text-gray-400 text-[9px] mr-1">DE</span> Germany 5</span>
            <span><span className="text-gray-400 text-[9px] mr-1">SG</span> Singapore 4</span>
            <span><span className="text-gray-400 text-[9px] mr-1">AU</span> Australia 4</span>
            <span className="flex items-center gap-1"><span className="text-[14px]">🌍</span> +21 more</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8 text-center">
            {allScholars && allScholars.length > 0 ? allScholars.slice(0, 4).map((s, i) => {
              const colors = [
                { bg: 'bg-[#F0F7FF]', border: 'border-[#CCE0FF]', text: 'text-[#0055FF]' },
                { bg: 'bg-[#E8F5E9]', border: 'border-[#C8E6C9]', text: 'text-[#2E7D32]' },
                { bg: 'bg-[#F3E5F5]', border: 'border-[#E1BEE7]', text: 'text-[#6A1B9A]' },
                { bg: 'bg-[#FFF3E0]', border: 'border-[#FFE0B2]', text: 'text-[#E65100]' }
              ];
              const c = colors[i % colors.length];
              return (
                <div key={s.id} className="flex flex-col items-center">
                  <Link href={`/scholars/${s.id}`} className="flex flex-col items-center group">
                    <div className={`w-[72px] h-[72px] rounded-full ${c.bg} border ${c.border} ${c.text} flex items-center justify-center text-xl font-serif mb-4 relative transition-transform group-hover:scale-105`}>
                      {s.avatar_url ? (
                        <Image src={s.avatar_url} alt={s.name} fill className="rounded-full object-cover" />
                      ) : s.initials}
                    </div>
                    <h4 className="text-[13px] text-black font-medium group-hover:text-blue-600 transition-colors">{s.name}</h4>
                  </Link>
                  <p className="text-[11px] text-gray-600 mb-2 truncate max-w-[180px]" title={s.professional_role}>{s.professional_role}</p>
                  {s.country_code && (
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[9px] font-bold border border-blue-100 mb-2">
                      {s.country_code} {s.country.substring(0, 8)}
                    </span>
                  )}
                  {s.is_featured ? (
                    <p className="text-[10px] text-[#512DA8] flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#512DA8]"></span> Video available</p>
                  ) : (
                    <p className="text-[10px] text-gray-500 italic">No video yet</p>
                  )}
                </div>
              );
            }) : (
              <>
                <div className="flex flex-col items-center">
                  <div className="w-[72px] h-[72px] rounded-full bg-[#F0F7FF] border border-[#CCE0FF] text-[#0055FF] flex items-center justify-center text-xl font-serif mb-4 relative">
                    AR
                  </div>
                  <h4 className="text-[13px] text-black font-medium">Dr. Amira Al-Rashidi</h4>
                  <p className="text-[11px] text-gray-600 mb-2">MD, Al-Rashidi Capital</p>
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[9px] font-bold border border-blue-100 mb-2">AE UAE</span>
                  <p className="text-[10px] text-[#512DA8] flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#512DA8]"></span> Video available</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-[72px] h-[72px] rounded-full bg-[#E8F5E9] border border-[#C8E6C9] text-[#2E7D32] flex items-center justify-center text-xl font-serif mb-4 relative">
                    JM
                  </div>
                  <h4 className="text-[13px] text-black font-medium">Dr. James Mitchell</h4>
                  <p className="text-[11px] text-gray-600 mb-2">CEO, Mitchell Ventures</p>
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[9px] font-bold border border-blue-100 mb-2">US USA</span>
                  <p className="text-[10px] text-[#512DA8] flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#512DA8]"></span> Video available</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-[72px] h-[72px] rounded-full bg-[#F3E5F5] border border-[#E1BEE7] text-[#6A1B9A] flex items-center justify-center text-xl font-serif mb-4 relative">
                    SK
                  </div>
                  <h4 className="text-[13px] text-black font-medium">Prof. Sarah Klein</h4>
                  <p className="text-[11px] text-gray-600 mb-2">Founder, Klein Institute</p>
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[9px] font-bold border border-blue-100 mb-2">DE Germany</span>
                  <p className="text-[10px] text-gray-500 italic">No video yet</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-[72px] h-[72px] rounded-full bg-[#FFF3E0] border border-[#FFE0B2] text-[#E65100] flex items-center justify-center text-xl font-serif mb-4 relative">
                    FQ
                  </div>
                  <h4 className="text-[13px] text-black font-medium">Dr. Fahad Al-Qahtani</h4>
                  <p className="text-[11px] text-gray-600 mb-2">Director, QNB Group</p>
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[9px] font-bold border border-blue-100 mb-2">QA Qatar</span>
                  <p className="text-[10px] text-[#512DA8] flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#512DA8]"></span> Video available</p>
                </div>
              </>
            )}
          </div>
          
          <div className="flex justify-between items-center border-t border-[#F0F0F0] pt-6">
            <span className="text-[13px] text-gray-600">Showing {allScholars && allScholars.length > 0 ? Math.min(4, allScholars.length) : 4} of {allScholars && allScholars.length > 0 ? allScholars.length + 96 : 100} distinguished scholars across 30+ countries</span>
            <button className="px-5 py-2 bg-[#1E3A8A] text-white text-[13px] font-medium rounded hover:bg-[#152C69] transition-colors">
              View all {allScholars && allScholars.length > 0 ? allScholars.length + 96 : 100} scholars →
            </button>
          </div>
        </div>

        {/* HOW SCHOLARS SUBMIT THEIR EXPERIENCE VIDEO */}
        <div className="mb-16">
          <div className="text-[11px] uppercase tracking-wider text-gray-500 mb-8">HOW SCHOLARS SUBMIT THEIR EXPERIENCE VIDEO</div>
          <h2 className="text-[17px] font-serif mb-10 text-black">Scholar video submission — 4-step process</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center mb-10 relative">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-[#F0F7FF] text-[#0055FF] text-[15px] font-serif flex items-center justify-center mb-4 z-10">1</div>
              <h4 className="text-[13px] text-black mb-1">Scholar uploads</h4>
              <p className="text-[11px] text-gray-600 leading-relaxed">MP4 or YouTube/Vimeo link<br/>submitted via dashboard</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-[#E8F5E9] text-[#2E7D32] text-[15px] font-serif flex items-center justify-center mb-4 z-10">2</div>
              <h4 className="text-[13px] text-black mb-1">Editorial review</h4>
              <p className="text-[11px] text-gray-600 leading-relaxed">Team checks quality, content<br/>suitability, and branding</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-[#FFF8E1] text-[#F57F17] text-[15px] font-serif flex items-center justify-center mb-4 z-10">3</div>
              <h4 className="text-[13px] text-black mb-1">Approved & live</h4>
              <p className="text-[11px] text-gray-600 leading-relaxed">Video published on profile with title,<br/>duration, and tags</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-[#F3E5F5] text-[#6A1B9A] text-[15px] font-serif flex items-center justify-center mb-4 z-10">4</div>
              <h4 className="text-[13px] text-black mb-1">Scholar notified</h4>
              <p className="text-[11px] text-gray-600 leading-relaxed">Email + dashboard alert with share<br/>link and embed code</p>
            </div>
          </div>

          <p className="text-[12px] text-black leading-relaxed">
            <strong>GSP Interview Series:</strong> For scholars who prefer a guided format, the platform offers a structured 15-minute recorded interview conducted by the GSP editorial team — available remotely via video call. Interview is filmed, edited, and published on the scholar's profile within 5 business days.
          </p>
        </div>

      </div>
    </div>
  );
}
