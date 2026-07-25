'use client'

import React, { useEffect, useState, useRef } from 'react'
import { toast } from 'sonner'
import { getScholarPublications } from '@/app/actions/publications'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4">
        <p className="font-bold text-sm text-gray-800 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: entry.color }} />
            <span className="text-gray-600 font-medium">{entry.name}:</span>
            <span className="text-gray-900 font-bold">{entry.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function AnalyticsClient({ publications: initialPublications }: { publications: any[] }) {
  const [publications, setPublications] = useState(initialPublications)
  
  useEffect(() => {
    const fetchRealData = async () => {
      try {
        const { data, error } = await getScholarPublications()
        if (error) {
          throw new Error(error)
        }
        if (data && JSON.stringify(data) !== JSON.stringify(publications)) {
          setPublications(data)
        }
      } catch (err: any) {
        console.error('Polling error:', err)
        toast.error('Failed to update analytics data. Server might be down.')
      }
    }

    const intervalId = setInterval(fetchRealData, 5000)
    return () => clearInterval(intervalId)
  }, [publications])

  // Calculate top-level metrics
  const totalViews = publications.reduce((acc, pub) => acc + (pub.views || 0), 0)
  const totalDownloads = publications.reduce((acc, pub) => acc + (pub.downloads || 0), 0)
  const publishedCount = publications.filter(p => p.status === 'published').length
  const draftCount = publications.filter(p => p.status === 'draft').length

  // Prepare data for the chart (top 5 most viewed publications)
  const chartData = [...publications]
    .filter(p => p.status === 'published')
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 5)
    .map(pub => ({
      name: pub.title.length > 20 ? pub.title.substring(0, 20) + '...' : pub.title,
      views: pub.views || 0,
      downloads: pub.downloads || 0
    }))

  return (
    <div className="space-y-8">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-(--color-gsp-surface-main) p-6 rounded-(--radius-xl) shadow-(--shadow-1) border border-(--color-gsp-border-subtle)">
          <p className="text-sm font-medium text-(--color-gsp-text-secondary) uppercase tracking-wide">Total Views</p>
          <p className="text-3xl font-bold text-(--color-gsp-text-primary) mt-2">{totalViews.toLocaleString()}</p>
        </div>
        <div className="bg-(--color-gsp-surface-main) p-6 rounded-(--radius-xl) shadow-(--shadow-1) border border-(--color-gsp-border-subtle)">
          <p className="text-sm font-medium text-(--color-gsp-text-secondary) uppercase tracking-wide">Total Downloads</p>
          <p className="text-3xl font-bold text-(--color-gsp-text-primary) mt-2">{totalDownloads.toLocaleString()}</p>
        </div>
        <div className="bg-(--color-gsp-surface-main) p-6 rounded-(--radius-xl) shadow-(--shadow-1) border border-(--color-gsp-border-subtle)">
          <p className="text-sm font-medium text-(--color-gsp-text-secondary) uppercase tracking-wide">Published Items</p>
          <p className="text-3xl font-bold text-emerald-600 mt-2">{publishedCount}</p>
        </div>
        <div className="bg-(--color-gsp-surface-main) p-6 rounded-(--radius-xl) shadow-(--shadow-1) border border-(--color-gsp-border-subtle)">
          <p className="text-sm font-medium text-(--color-gsp-text-secondary) uppercase tracking-wide">Drafts / Pending</p>
          <p className="text-3xl font-bold text-amber-600 mt-2">{draftCount}</p>
        </div>
      </div>

      {/* Chart */}
      {chartData.length > 0 ? (
        <div className="bg-(--color-gsp-surface-main) p-6 rounded-(--radius-xl) shadow-(--shadow-1) border border-(--color-gsp-border-subtle)">
          <h3 className="text-lg font-bold text-(--color-gsp-text-primary) mb-6">Top Performing Publications</h3>
          <div className="h-100 w-full overflow-x-auto">
            <div style={{ minWidth: chartData.length > 5 ? '600px' : '100%', height: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end" 
                    height={80} 
                    tick={{ fill: '#6B7280', fontSize: 12 }} 
                  />
                  <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} />
                  <RechartsTooltip content={<CustomTooltip />} />
                  <Legend verticalAlign="top" height={36} />
                  <Bar dataKey="views" name="Views" fill="#2F115D" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="downloads" name="Downloads" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-(--color-gsp-surface-main) p-12 rounded-(--radius-xl) shadow-(--shadow-1) border border-(--color-gsp-border-subtle) text-center">
          <h3 className="text-lg font-medium text-(--color-gsp-text-primary)">Not enough data to display charts</h3>
          <p className="text-(--color-gsp-text-secondary) mt-2">Upload and publish items to see performance analytics.</p>
        </div>
      )}
    </div>
  )
}
