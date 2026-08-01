import React from 'react'
import { Bot, Phone, Clock, Globe, Edit2, Trash2, Link as LinkIcon, Plus, Users } from 'lucide-react'

const agents = [
  {
    id: 1,
    name: 'Customer Support Agent',
    role: 'Senior Support Specialist',
    status: 'ACTIVE',
    languages: 'English, Hindi',
    phone: '+1234567890',
    maxDuration: '5:00'
  },
  {
    id: 2,
    name: 'Sales Agent',
    role: 'Sales Representative',
    status: 'ACTIVE',
    languages: 'English, Spanish',
    phone: '+1987654321',
    maxDuration: '10:00'
  }
]

export default function AiAgentsPage() {
  return (
    <div className="min-h-full rounded-2xl bg-gradient-to-br from-[#2a164b] via-[#3d2067] to-[#1e1039] p-8 text-white shadow-inner">
      {/* Top Navigation Pills */}
      <div className="flex gap-2 mb-8 p-1 bg-[#1a0e2d]/50 rounded-xl max-w-fit">
        <button className="flex items-center gap-2 px-8 py-2.5 bg-gradient-to-r from-fuchsia-500 to-pink-500 rounded-lg text-sm font-semibold shadow-lg shadow-pink-500/20">
          <Users className="w-4 h-4" />
          Agents
        </button>
        <button className="flex items-center gap-2 px-8 py-2.5 text-slate-300 hover:text-white transition-colors text-sm font-medium">
          <Phone className="w-4 h-4" />
          Call List
        </button>
        <button className="flex items-center gap-2 px-8 py-2.5 text-slate-300 hover:text-white transition-colors text-sm font-medium">
          <Clock className="w-4 h-4" />
          Call History
        </button>
      </div>

      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-1">AI Agents</h1>
          <p className="text-slate-300 text-sm">Manage your AI voice agents</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors">
            <LinkIcon className="w-4 h-4" />
            Connect API
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-fuchsia-500 to-pink-500 hover:from-fuchsia-400 hover:to-pink-400 rounded-lg text-sm font-medium shadow-lg shadow-pink-500/20 transition-all">
            <Plus className="w-4 h-4" />
            Create Agent
          </button>
        </div>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <div key={agent.id} className="bg-[#242b3b] border border-slate-700/50 rounded-xl p-5 shadow-xl relative overflow-hidden">
            {/* Status Badge */}
            <div className="absolute top-5 right-5">
              <span className="text-[10px] font-bold bg-green-500/10 text-green-400 px-2.5 py-1 rounded-md tracking-wider">
                {agent.status}
              </span>
            </div>

            {/* Agent Info */}
            <div className="flex gap-4 mb-6">
              <div className="w-12 h-12 bg-indigo-500/10 rounded-lg flex items-center justify-center border border-indigo-500/20 shrink-0">
                <Bot className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white leading-tight">{agent.name}</h3>
                <p className="text-xs text-indigo-300 mt-1">{agent.role}</p>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <Globe className="w-4 h-4 text-slate-500" />
                {agent.languages}
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <Phone className="w-4 h-4 text-slate-500" />
                {agent.phone}
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <Clock className="w-4 h-4 text-slate-500" />
                Max {agent.maxDuration}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors text-slate-200">
                <Edit2 className="w-3.5 h-3.5" />
                Edit
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-sm font-medium transition-colors">
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
