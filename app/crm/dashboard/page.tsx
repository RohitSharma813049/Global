import React from 'react'
import { SummaryCard } from '@/components/crm/summary-card'
import { ActivityList, ActivityItemProps } from '@/components/crm/activity-list'
import { Users, Building, Calendar, Phone, MapPin, CheckCircle } from 'lucide-react'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  // Fetch real data from the database
  const [
    totalOpenLeads,
    totalClosedLeads,
    totalActiveUsers,
    totalProperties,
    totalMeetings,
    totalPendingMeetings,
    totalFollowUps,
    totalPendingFollowUps,
    totalSiteVisits,
    totalPendingSiteVisits,
    totalBookings,
    totalConfirmedBookings,
    completedMeetingsRaw,
    completedSiteVisitsRaw,
    pendingFollowUpsRaw
  ] = await Promise.all([
    prisma.crm_leads.count({ where: { status: 'open' } }),
    prisma.crm_leads.count({ where: { status: 'closed' } }),
    // Assuming users are from existing auth table but for now dummy count if not linked
    Promise.resolve(15), 
    prisma.crm_properties.count(),
    prisma.crm_activities.count({ where: { type: 'meeting' } }),
    prisma.crm_activities.count({ where: { type: 'meeting', status: 'pending' } }),
    prisma.crm_activities.count({ where: { type: 'follow_up' } }),
    prisma.crm_activities.count({ where: { type: 'follow_up', status: 'pending' } }),
    prisma.crm_activities.count({ where: { type: 'site_visit' } }),
    prisma.crm_activities.count({ where: { type: 'site_visit', status: 'pending' } }),
    prisma.crm_bookings.count(),
    prisma.crm_bookings.count({ where: { status: 'confirmed' } }),
    
    // Recent activities
    prisma.crm_activities.findMany({
      where: { type: 'meeting', status: 'done' },
      include: { lead: true },
      orderBy: { date: 'desc' },
      take: 5
    }),
    prisma.crm_activities.findMany({
      where: { type: 'site_visit', status: 'done' },
      include: { lead: true },
      orderBy: { date: 'desc' },
      take: 5
    }),
    prisma.crm_activities.findMany({
      where: { type: 'follow_up', status: 'pending' },
      include: { lead: true },
      orderBy: { date: 'asc' },
      take: 5
    })
  ])

  const summaryData = [
    {
      title: 'Open Leads',
      value: (totalOpenLeads + totalClosedLeads).toString(),
      icon: Users,
      iconBgColor: 'bg-blue-600',
      badges: [
        { label: 'Open', value: totalOpenLeads.toString(), color: 'blue' as const },
        { label: 'Closed', value: totalClosedLeads.toString(), color: 'green' as const },
      ]
    },
    {
      title: 'Active Users',
      value: totalActiveUsers.toString(),
      icon: Users,
      iconBgColor: 'bg-green-500',
      subtitle: 'Team members'
    },
    {
      title: 'Total Properties',
      value: totalProperties.toString(),
      icon: Building,
      iconBgColor: 'bg-purple-500',
      subtitle: 'Listed properties'
    },
    {
      title: 'Meetings',
      value: totalMeetings.toString(),
      icon: Calendar,
      iconBgColor: 'bg-teal-500',
      badges: [
        { label: 'Pending', value: totalPendingMeetings.toString(), color: 'yellow' as const },
        { label: 'Done', value: (totalMeetings - totalPendingMeetings).toString(), color: 'green' as const },
      ]
    },
    {
      title: 'Follow-ups',
      value: totalFollowUps.toString(),
      icon: Phone,
      iconBgColor: 'bg-amber-500',
      badges: [
        { label: 'Pending', value: totalPendingFollowUps.toString(), color: 'yellow' as const },
        { label: 'Done', value: (totalFollowUps - totalPendingFollowUps).toString(), color: 'green' as const },
      ]
    },
    {
      title: 'Site Visits',
      value: totalSiteVisits.toString(),
      icon: MapPin,
      iconBgColor: 'bg-cyan-500',
      badges: [
        { label: 'Pending', value: totalPendingSiteVisits.toString(), color: 'yellow' as const },
        { label: 'Done', value: (totalSiteVisits - totalPendingSiteVisits).toString(), color: 'green' as const },
      ]
    },
    {
      title: 'Bookings',
      value: totalBookings.toString(),
      icon: CheckCircle,
      iconBgColor: 'bg-pink-500',
      badges: [
        { label: 'Confirmed', value: totalConfirmedBookings.toString(), color: 'green' as const },
        { label: 'Pending', value: (totalBookings - totalConfirmedBookings).toString(), color: 'yellow' as const },
      ]
    }
  ]

  const formatActivity = (act: any): ActivityItemProps => ({
    id: act.id,
    name: act.lead?.name || 'Unknown',
    comment: act.comment || '',
    date: act.date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
    time: act.date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    status: act.status === 'done' ? 'done' : 'overdue'
  })

  const completedMeetings = completedMeetingsRaw.map(formatActivity)
  const completedSiteVisits = completedSiteVisitsRaw.map(formatActivity)
  const pendingFollowUps = pendingFollowUpsRaw.map(formatActivity)

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Admin Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">System overview & team activities</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryData.map((item, index) => (
          <SummaryCard 
            key={index}
            {...item}
          />
        ))}
      </div>

      {/* Upcoming Activities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ActivityList 
          title="Meetings (Next 7 Days)" 
          count={0} 
          items={[]} 
          emptyMessage="No meetings found"
        />
        <ActivityList 
          title="Follow - Ups (Next 7 Days)" 
          count={0} 
          items={[]} 
          emptyMessage="No follow-ups today"
        />
      </div>

      {/* Completed Activities & Pending */}
      <div className="space-y-4">
        <ActivityList 
          title="Completed Meetings" 
          count={completedMeetings.length} 
          items={completedMeetings} 
        />
        <ActivityList 
          title="Completed Site Visits" 
          count={completedSiteVisits.length} 
          items={completedSiteVisits} 
        />
        <ActivityList 
          title="Pending Follow-ups (Overdue)" 
          count={pendingFollowUps.length}
          totalCount={totalPendingFollowUps}
          items={pendingFollowUps} 
        />
      </div>
    </div>
  )
}
