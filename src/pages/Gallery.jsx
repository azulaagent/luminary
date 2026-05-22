import { motion } from 'framer-motion'
import { Search, Plus, RotateCcw, Filter } from 'lucide-react'
import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAgents } from '../lib/agents'
import AgentCard from '../components/AgentCard'

export default function Gallery() {
  const navigate = useNavigate()
  const { agents, deleteAgent, addAgent, resetToPresets } = useAgents()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all') // all, preset, custom

  const filtered = useMemo(() => {
    let list = agents
    if (filter === 'preset') list = list.filter(a => a.isPreset)
    if (filter === 'custom') list = list.filter(a => !a.isPreset)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(a =>
        a.name.toLowerCase().includes(q) ||
        a.personality?.toLowerCase().includes(q) ||
        a.traits?.some(t => t.includes(q))
      )
    }
    return list
  }, [agents, search, filter])

  const handleDuplicate = (agent) => {
    const { id, isPreset, createdAt, ...rest } = agent
    addAgent({ ...rest, name: `${rest.name} (copy)` })
  }

  return (
    <div className="max-w-6xl mx-auto px-8 py-10">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Agent Gallery</h1>
            <p className="text-sm text-text-muted mt-1">{agents.length} agents available</p>
          </div>
          <button
            onClick={() => navigate('/builder')}
            className="flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent/80 rounded-xl text-sm font-medium transition-colors"
          >
            <Plus size={14} />
            New Agent
          </button>
        </div>

        {/* Search & Filter */}
        <div className="flex gap-3 mb-6">
          <div className="flex-1 relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-dim" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search agents..."
              className="w-full bg-bg-card border border-border rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-accent transition-colors"
            />
          </div>
          <div className="flex gap-1 bg-bg-card border border-border rounded-xl p-1">
            {['all', 'preset', 'custom'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 text-xs rounded-lg capitalize transition-all ${
                  filter === f ? 'bg-accent/15 text-accent' : 'text-text-muted hover:text-text'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <button
            onClick={resetToPresets}
            className="p-2.5 rounded-xl border border-border hover:border-border-hover text-text-muted hover:text-text transition-colors"
            title="Reset to presets"
          >
            <RotateCcw size={14} />
          </button>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-4xl mb-3">🤖</div>
            <p className="text-text-muted text-sm">No agents found</p>
            <button
              onClick={() => navigate('/builder')}
              className="mt-4 text-accent text-sm hover:underline"
            >
              Create your first agent →
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((agent, i) => (
              <AgentCard
                key={agent.id}
                agent={agent}
                index={i}
                onDelete={deleteAgent}
                onDuplicate={handleDuplicate}
              />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}
