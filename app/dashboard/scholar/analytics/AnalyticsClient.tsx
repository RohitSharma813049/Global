'use client'

import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

export default function AnalyticsClient({ publications }: { publications: any[] }) {
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
        <div className="bg-[var(--color-gsp-surface-main)] p-6 rounded-[var(--radius-xl)] shadow-[var(--shadow-1)] border border-[var(--color-gsp-border-subtle)]">
          <p className="text-sm font-medium text-[var(--color-gsp-text-secondary)] uppercase tracking-wide">Total Views</p>
          <p className="text-3xl font-bold text-[var(--color-gsp-text-primary)] mt-2">{totalViews.toLocaleString()}</p>
        </div>
        <div className="bg-[var(--color-gsp-surface-main)] p-6 rounded-[var(--radius-xl)] shadow-[var(--shadow-1)] border border-[var(--color-gsp-border-subtle)]">
          <p className="text-sm font-medium text-[var(--color-gsp-text-secondary)] uppercase tracking-wide">Total Downloads</p>
          <p className="text-3xl font-bold text-[var(--color-gsp-text-primary)] mt-2">{totalDownloads.toLocaleString()}</p>
        </div>
        <div className="bg-[var(--color-gsp-surface-main)] p-6 rounded-[var(--radius-xl)] shadow-[var(--shadow-1)] border border-[var(--color-gsp-border-subtle)]">
          <p className="text-sm font-medium text-[var(--color-gsp-text-secondary)] uppercase tracking-wide">Published Items</p>
          <p className="text-3xl font-bold text-emerald-600 mt-2">{publishedCount}</p>
        </div>
        <div className="bg-[var(--color-gsp-surface-main)] p-6 rounded-[var(--radius-xl)] shadow-[var(--shadow-1)] border border-[var(--color-gsp-border-subtle)]">
          <p className="text-sm font-medium text-[var(--color-gsp-text-secondary)] uppercase tracking-wide">Drafts / Pending</p>
          <p className="text-3xl font-bold text-amber-600 mt-2">{draftCount}</p>
        </div>
      </div>

      {/* Chart */}
      {chartData.length > 0 ? (
        <div className="bg-[var(--color-gsp-surface-main)] p-6 rounded-[var(--radius-xl)] shadow-[var(--shadow-1)] border border-[var(--color-gsp-border-subtle)]">
          <h3 className="text-lg font-bold text-[var(--color-gsp-text-primary)] mb-6">Top Performing Publications</h3>
          <div className="h-[400px] w-full">
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
                  height={60} 
                  tick={{ fill: '#6B7280', fontSize: 12 }} 
                />
                <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Bar dataKey="views" name="Views" fill="#2F115D" radius={[4, 4, 0, 0]} />
                <Bar dataKey="downloads" name="Downloads" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="bg-[var(--color-gsp-surface-main)] p-12 rounded-[var(--radius-xl)] shadow-[var(--shadow-1)] border border-[var(--color-gsp-border-subtle)] text-center">
          <h3 className="text-lg font-medium text-[var(--color-gsp-text-primary)]">Not enough data to display charts</h3>
          <p className="text-[var(--color-gsp-text-secondary)] mt-2">Upload and publish items to see performance analytics.</p>
        </div>
      )}
    </div>
  )
}
