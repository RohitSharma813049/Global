import React from 'react'
import { SummaryCard } from '@/components/crm/summary-card'
import { ActivityList, ActivityItemProps } from '@/components/crm/activity-list'
import { Users, Building, Calendar, Phone, MapPin, CheckCircle } from 'lucide-react'

// Mock Data from Screenshots
const summaryData = [
  {
    title: 'Open Leads',
    value: '3329',
    icon: Users,
    iconBgColor: 'bg-blue-600',
    badges: [
      { label: 'Open', value: '3329', color: 'blue' as const },
      { label: 'Closed', value: '1026', color: 'green' as const },
    ]
  },
  {
    title: 'Active Users',
    value: '15',
    icon: Users,
    iconBgColor: 'bg-green-500',
    subtitle: 'Team members'
  },
  {
    title: 'Total Properties',
    value: '2',
    icon: Building,
    iconBgColor: 'bg-purple-500',
    subtitle: 'Listed properties'
  },
  {
    title: 'Meetings',
    value: '22',
    icon: Calendar,
    iconBgColor: 'bg-teal-500',
    badges: [
      { label: 'Pending', value: '7', color: 'yellow' as const },
      { label: 'Done', value: '15', color: 'green' as const },
    ]
  },
  {
    title: 'Follow-ups',
    value: '4499',
    icon: Phone,
    iconBgColor: 'bg-amber-500',
    badges: [
      { label: 'Pending', value: '490', color: 'yellow' as const },
      { label: 'Done', value: '4009', color: 'green' as const },
    ]
  },
  {
    title: 'Site Visits',
    value: '49',
    icon: MapPin,
    iconBgColor: 'bg-cyan-500',
    badges: [
      { label: 'Pending', value: '34', color: 'yellow' as const },
      { label: 'Done', value: '15', color: 'green' as const },
    ]
  },
  {
    title: 'Bookings',
    value: '1',
    icon: CheckCircle,
    iconBgColor: 'bg-pink-500',
    badges: [
      { label: 'Confirmed', value: '1', color: 'green' as const },
      { label: 'Pending', value: '0', color: 'yellow' as const },
    ]
  }
]

const completedMeetings: ActivityItemProps[] = [
  {
    id: '1',
    name: 'G.S Rajput',
    comment: 'Next week site visit plan',
    date: '10 Mar',
    time: '11:20 am',
    status: 'done'
  },
  {
    id: '2',
    name: 'Ajay Arora',
    comment: 'Positive will plan next meeting in 2-3 days',
    date: '14 Feb',
    time: '10:18 am',
    status: 'done'
  }
]

const completedSiteVisits: ActivityItemProps[] = [
  {
    id: '1',
    name: 'Anil Kumar',
    comment: 'Iski property sale hone k bad final krega Khud call krke',
    date: '27 Feb',
    time: '02:35 pm',
    status: 'done',
    imagesCount: 1,
    images: ['https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80']
  },
  {
    id: '2',
    name: 'Shivani Sethi',
    comment: 'Today site visit done by Prince , shakti 2 se 3 din me delhi meeting plan final krne k liye pankaj sir ko bhejna h RASA pasand aya h 1500 sqyd plot',
    date: '23 Feb',
    time: '05:42 pm',
    status: 'done',
    imagesCount: 1,
    images: ['https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80']
  }
]

const pendingFollowUps: ActivityItemProps[] = [
  {
    id: '1',
    name: 'Puneet Mehra',
    comment: 'Done in Gurgaon cb after 6 months',
    date: '20 Jun',
    time: '01:29 pm',
    status: 'overdue'
  },
  {
    id: '2',
    name: 'Atul Sharma',
    comment: '',
    date: '18 Jun',
    time: '12:00 pm',
    status: 'overdue'
  }
]

export default function DashboardPage() {
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

      {/* Upcoming Activities (Empty states shown in screenshot) */}
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
          count={15} 
          items={completedMeetings} 
        />
        <ActivityList 
          title="Completed Site Visits" 
          count={15} 
          items={completedSiteVisits} 
        />
        <ActivityList 
          title="Pending Follow-ups (Overdue)" 
          count={100}
          totalCount={477}
          items={pendingFollowUps} 
        />
      </div>
    </div>
  )
}
