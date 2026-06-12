"use client";

import { useState } from "react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, FileText, PlayCircle, BookMarked, Download, Share2, Award, CheckCircle2 } from "lucide-react";

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
}

export default function GSPDistinguishedScholars({ scholar, videos = [], publications = [], allScholars = [] }: Props) {
  if (!scholar) return null;

  const mainVideo = videos.find(v => v.is_main_video) || videos[0];
  const otherVideos = videos.filter(v => v.id !== mainVideo?.id);
  
  const thesisPubs = publications.filter(p => p.tag.toLowerCase().includes("thesis"));
  const articlePubs = publications.filter(p => p.tag.toLowerCase().includes("article"));
  const ebookPubs = publications.filter(p => p.tag.toLowerCase().includes("ebook"));

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* ── HEADER BANNER ── */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-12 lg:flex lg:items-start lg:justify-between lg:gap-12">
          
          <div className="flex flex-col sm:flex-row gap-8 items-start flex-1">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="h-32 w-32 rounded-full bg-indigo-50 border-4 border-white shadow-xl flex items-center justify-center text-4xl font-black text-indigo-700">
                {scholar.initials}
              </div>
              <div className="absolute bottom-0 right-0 h-10 w-10 bg-white rounded-full border-4 border-gray-50 shadow-sm flex items-center justify-center text-xl">
                {scholar.flag_emoji}
              </div>
              {scholar.is_verified && (
                <div className="absolute top-0 right-0 h-8 w-8 bg-emerald-500 rounded-full border-2 border-white shadow-sm flex items-center justify-center" title="Verified Scholar">
                  <CheckCircle2 className="h-5 w-5 text-white" />
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">{scholar.name}</h1>
                {scholar.is_honorary && (
                  <Badge variant="secondary" className="bg-indigo-100 text-indigo-800 hover:bg-indigo-200 border border-indigo-200">
                    <Award className="w-3 h-3 mr-1" /> Honorary
                  </Badge>
                )}
              </div>
              <p className="text-xl text-gray-600 font-medium mb-4">
                {scholar.professional_role} <span className="text-gray-300 mx-2">|</span> {scholar.domain}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                <Badge variant="outline" className="text-gray-600 border-gray-200 bg-gray-50">{scholar.flag_emoji} {scholar.country}</Badge>
                {scholar.is_featured && <Badge variant="outline" className="text-amber-700 border-amber-200 bg-amber-50">Featured Scholar</Badge>}
              </div>

              <div className="flex flex-wrap gap-3">
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-6">
                  Follow Scholar
                </Button>
                <Button variant="outline" className="rounded-full px-6 border-gray-300">
                  <Download className="w-4 h-4 mr-2" /> Download CV
                </Button>
                <Button variant="outline" size="icon" className="rounded-full border-gray-300">
                  <Share2 className="w-4 h-4 text-gray-600" />
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Stats Bar (Desktop Right) */}
          <div className="mt-10 lg:mt-0 shrink-0 w-full lg:w-72 bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Publications</p>
                <p className="text-3xl font-black text-gray-900">{publications.length}</p>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center">
                <FileText className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total Views</p>
                <p className="text-3xl font-black text-gray-900">12.4k</p>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center">
                <PlayCircle className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Downloads</p>
                <p className="text-3xl font-black text-gray-900">3,492</p>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-amber-50 flex items-center justify-center">
                <Download className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT TABS ── */}
      <div className="max-w-6xl mx-auto px-6 mt-12">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="h-auto min-h-14 w-full justify-start gap-2 bg-transparent border-b border-gray-200 rounded-none p-0 overflow-x-auto flex-nowrap pb-px">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-gray-200 border border-transparent h-10 px-6 rounded-t-xl rounded-b-none text-base font-medium">Overview</TabsTrigger>
            <TabsTrigger value="thesis" className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-gray-200 border border-transparent h-10 px-6 rounded-t-xl rounded-b-none text-base font-medium">
              <BookOpen className="w-4 h-4 mr-2" /> Thesis ({thesisPubs.length})
            </TabsTrigger>
            <TabsTrigger value="articles" className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-gray-200 border border-transparent h-10 px-6 rounded-t-xl rounded-b-none text-base font-medium">
              <FileText className="w-4 h-4 mr-2" /> Articles ({articlePubs.length})
            </TabsTrigger>
            <TabsTrigger value="ebooks" className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-gray-200 border border-transparent h-10 px-6 rounded-t-xl rounded-b-none text-base font-medium">
              <BookMarked className="w-4 h-4 mr-2" /> eBooks ({ebookPubs.length})
            </TabsTrigger>
            <TabsTrigger value="videos" className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-gray-200 border border-transparent h-10 px-6 rounded-t-xl rounded-b-none text-base font-medium">
              <PlayCircle className="w-4 h-4 mr-2" /> Videos ({videos.length})
            </TabsTrigger>
          </TabsList>

          <div className="bg-white border border-t-0 border-gray-200 rounded-b-2xl rounded-tr-2xl shadow-sm min-h-[400px]">
            {/* OVERVIEW TAB */}
            <TabsContent value="overview" className="p-8 m-0 outline-none">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Biography & Career Overview</h2>
              <div className="prose prose-lg text-gray-600 max-w-none">
                <p className="leading-relaxed">{scholar.description}</p>
                {scholar.is_honorary && (
                  <div className="mt-8 bg-indigo-50 border-l-4 border-indigo-600 p-6 rounded-r-xl">
                    <h4 className="text-indigo-900 font-bold flex items-center gap-2 mb-2">
                      <Award className="w-5 h-5" /> Honorary Doctorate — Professional Excellence Recognition
                    </h4>
                    <p className="text-indigo-800 text-sm">
                      This profile recognises a distinguished professional awarded an honorary doctorate for exceptional real-world contribution to their field. This is an honorary award distinct from a research qualification, conferred in recognition of professional achievement and industry leadership.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* THESIS TAB */}
            <TabsContent value="thesis" className="p-8 m-0 outline-none">
              <div className="space-y-4">
                {thesisPubs.length === 0 ? (
                  <p className="text-gray-500 italic">No thesis published yet.</p>
                ) : (
                  thesisPubs.map(pub => (
                    <PublicationCard key={pub.id} pub={pub} />
                  ))
                )}
              </div>
            </TabsContent>

            {/* ARTICLES TAB */}
            <TabsContent value="articles" className="p-8 m-0 outline-none">
              <div className="space-y-4">
                {articlePubs.length === 0 ? (
                  <p className="text-gray-500 italic">No articles published yet.</p>
                ) : (
                  articlePubs.map(pub => (
                    <PublicationCard key={pub.id} pub={pub} />
                  ))
                )}
              </div>
            </TabsContent>

            {/* EBOOKS TAB */}
            <TabsContent value="ebooks" className="p-8 m-0 outline-none">
              <div className="space-y-4">
                {ebookPubs.length === 0 ? (
                  <p className="text-gray-500 italic">No eBooks published yet.</p>
                ) : (
                  ebookPubs.map(pub => (
                    <PublicationCard key={pub.id} pub={pub} />
                  ))
                )}
              </div>
            </TabsContent>

            {/* VIDEOS TAB */}
            <TabsContent value="videos" className="p-8 m-0 outline-none">
              {videos.length === 0 ? (
                <p className="text-gray-500 italic">No videos published yet.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {videos.map(video => (
                    <div key={video.id} className="group relative rounded-2xl bg-gray-900 overflow-hidden cursor-pointer aspect-video shadow-md hover:shadow-xl transition-all">
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors z-10"></div>
                      <div className="absolute inset-0 flex items-center justify-center z-20">
                        <PlayCircle className="w-12 h-12 text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent z-20">
                        <p className="text-white font-semibold text-sm line-clamp-2">{video.title}</p>
                        <p className="text-gray-300 text-xs mt-1">{video.metadata}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

          </div>
        </Tabs>
      </div>
    </div>
  );
}

function PublicationCard({ pub }: { pub: ScholarPublication }) {
  return (
    <div className="group border border-gray-100 rounded-2xl p-6 hover:shadow-md hover:border-indigo-100 transition-all bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <Link href={pub.url || "#"} className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
          {pub.title}
        </Link>
        <p className="text-gray-500 text-sm mt-2">{pub.metadata}</p>
      </div>
      <div className="flex items-center gap-3">
        <Badge variant="outline" className="bg-gray-50 uppercase tracking-wider text-[10px]">{pub.tag}</Badge>
        <Link href={pub.url || "#"}>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-full">
            <Download className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
