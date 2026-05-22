import { motion } from 'framer-motion'
import { Search, Plus, RotateCcw, SlidersHorizontal } from 'lucide-react'
import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAgents } from '../lib/agents'
import AgentCard from '../components/AgentCard'

const STAGGER = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } }
const FADE_UP = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } }

export default function Gallery() {
  const navigate = useNavigate()
  const { agents, deleteAgent, addAgent, resetToPresets } = useAgents()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-xl font-bold">Agent Gallery</h1>
            <p className="text-xs text-text-dim mt-0.5">{agents.length} agents available</p>
          </div>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => navigate('/builder')} className="btn-primary">
            <Plus size={14} /> New Agent
          </motion.button>
        </div>

        {/* Search & Filter */}
        <div className="flex gap-3 mb-8">
          <div className="flex-1 relative">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-dim" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search agents by name, personality, or trait..."
              className="input-field pl-10 py-2.5 text-sm"
            />
          </div>
          <div className="flex gap-0.5 bg-white/[0.02] border border-white/[0.06] rounded-xl p-1">
            {['all', 'preset', 'custom'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3.5 py-2 text-[11px] rounded-lg capitalize transition-all duration-200 ${
                  filter === f ? 'bg-accent/[0.12] text-accent-bright' : 'text-text-dim hover:text-text-muted'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <button
            onClick={resetToPresets}
            className="p-2.5 rounded-xl border border-white/[0.06] hover:border-white/[0.1] text-text-dim hover:text-text-muted transition-all"
            title="Reset to presets"
          >
            <RotateCcw size={14} />
          </button>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
            <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mx-auto mb-4 text-2xl">
              🤖
            </div>
            <p className="text-sm text-text-muted mb-1">No agents found</p>
            <p className="text-xs text-text-dim mb-4">Try a different search or create a new agent</p>
            <button onClick={() => navigate('/builder')} className="text-accent-bright text-xs hover:underline underline-offset-2">
              Create your first agent →
            </button>
          </motion.div>
        ) : (
          <motion.div
            variants={STAGGER}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {filtered.map((agent, i) => (
              <motion.div key={agent.id} variants={FADE_UP}>
                <AgentCard agent={agent} index={i} onDelete={deleteAgent} onDuplicate={handleDuplicate} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
