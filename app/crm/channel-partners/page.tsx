'use client'

import React from 'react'
import { 
  Plus, 
  Search, 
  Filter, 
  Eye
} from 'lucide-react'

const partners = [
  {
    initial: 'R', name: 'Rahul Chouhan', company: 'Webeside',
    phone: '9540627378', email: 'hr_web_developer@gmail.com', whatsapp: '',
    city: 'Faridabad', state: 'Haryana',
    type: 'Individual', typeColor: 'bg-green-50 text-green-600',
    experience: 'N/A', expDesc: '',
    teamSize: '0', joined: '28 Nov 2025'
  },
  {
    initial: 'S', name: 'Sahil', company: 'Webeside Technology',
    phone: '8888888888', email: 'sahil@gmail.com', whatsapp: 'WhatsApp: 8989898989',
    city: 'd', state: 'd',
    type: 'Company', typeColor: 'bg-blue-50 text-blue-600',
    experience: 'N/A', expDesc: '',
    teamSize: '0', joined: '29 Nov 2025'
  },
  {
    initial: 'T', name: 'Tanika Mehta', company: 'Zak Space',
    phone: '8447935640', email: 'tanika.mehta456@gmail.com', whatsapp: '',
    city: 'Gurgaon', state: 'haryana',
    type: 'Individual', typeColor: 'bg-green-50 text-green-600',
    experience: '4 years', expDesc: 'Residential & Farmland',
    teamSize: '0', joined: '30 Dec 2025'
  },
  {
    initial: 'V', name: 'Vikrant verma', company: 'Zak Space',
    phone: '9555421709', email: 'vikrant.verma@gmail.com', whatsapp: '',
    city: 'Gurgaon', state: 'haryana',
    type: 'Individual', typeColor: 'bg-green-50 text-green-600',
    experience: '12 years', expDesc: 'Residential',
    teamSize: '0', joined: '07 Feb 2026'
  }
]

export default function ChannelPartnersPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 leading-tight">Channel Partners</h1>
          <p className="text-slate-500 text-sm">Manage channel partner accounts (User Type: Partner)</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors shadow-sm">
          <Plus className="w-4 h-4" /> Add Partner
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm flex flex-col justify-center">
          <p className="text-sm font-medium text-slate-500 mb-1">Total Partners</p>
          <h3 className="text-2xl font-bold text-slate-800">4</h3>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm flex flex-col justify-center">
          <p className="text-sm font-medium text-slate-500 mb-1">Companies</p>
          <h3 className="text-2xl font-bold text-blue-600">1</h3>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm flex flex-col justify-center">
          <p className="text-sm font-medium text-slate-500 mb-1">Individuals</p>
          <h3 className="text-2xl font-bold text-green-600">3</h3>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm flex flex-col justify-center">
          <p className="text-sm font-medium text-slate-500 mb-1">Agencies</p>
          <h3 className="text-2xl font-bold text-purple-600">0</h3>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by name, company, email, phone, or city..." 
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
          />
        </div>
        <div className="relative w-full sm:w-64 shrink-0">
          <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <select className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm appearance-none bg-white font-medium text-slate-700">
            <option>All Partner Types</option>
            <option>Company</option>
            <option>Individual</option>
          </select>
        </div>
      </div>

      <div className="text-sm text-slate-500 font-medium">
        Showing 4 of 4 partners
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-400 font-semibold uppercase border-b border-slate-100">
            <tr>
              <th className="px-6 py-5">Partner Info</th>
              <th className="px-6 py-5">Contact</th>
              <th className="px-6 py-5">Location</th>
              <th className="px-6 py-5 text-center">Type</th>
              <th className="px-6 py-5">Experience</th>
              <th className="px-6 py-5 text-center">Team Size</th>
              <th className="px-6 py-5">Joined</th>
              <th className="px-6 py-5"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {partners.map((partner, i) => (
              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                
                {/* Partner Info */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold shadow-sm shrink-0">
                      {partner.initial}
                    </div>
                    <div>
                      <div className="font-bold text-slate-800">{partner.name}</div>
                      <div className="text-xs text-slate-500">{partner.company}</div>
                    </div>
                  </div>
                </td>
                
                {/* Contact */}
                <td className="px-6 py-4">
                  <div className="text-slate-700 font-medium">{partner.phone}</div>
                  <div className="text-slate-500 text-xs">{partner.email}</div>
                  {partner.whatsapp && (
                    <div className="text-green-500 text-[11px] font-medium mt-0.5">{partner.whatsapp}</div>
                  )}
                </td>
                
                {/* Location */}
                <td className="px-6 py-4">
                  <div className="text-slate-700 font-medium">{partner.city}</div>
                  <div className="text-slate-500 text-xs">{partner.state}</div>
                </td>
                
                {/* Type */}
                <td className="px-6 py-4 text-center">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${partner.typeColor}`}>
                    {partner.type}
                  </span>
                </td>
                
                {/* Experience */}
                <td className="px-6 py-4">
                  <div className="text-slate-700 font-medium">{partner.experience}</div>
                  {partner.expDesc && (
                    <div className="text-slate-400 text-[10px] mt-0.5 truncate max-w-[120px]">{partner.expDesc}</div>
                  )}
                </td>
                
                {/* Team Size */}
                <td className="px-6 py-4 text-center font-semibold text-slate-800">
                  {partner.teamSize}
                </td>
                
                {/* Joined */}
                <td className="px-6 py-4 text-slate-500 text-xs font-medium whitespace-nowrap">
                  {partner.joined}
                </td>
                
                {/* Actions */}
                <td className="px-6 py-4">
                  <button className="text-blue-500 hover:text-blue-700 transition-colors p-2 hover:bg-blue-50 rounded-full">
                    <Eye className="w-4 h-4" />
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
