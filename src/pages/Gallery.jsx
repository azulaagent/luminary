import { motion } from 'framer-motion'
import { Search, Plus, RotateCcw } from 'lucide-react'
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
    if (search.trim()) { const q = search.toLowerCase(); list = list.filter(a => a.name.toLowerCase().includes(q) || a.personality?.toLowerCase().includes(q) || a.traits?.some(t => t.includes(q))) }
    return list
  }, [agents, search, filter])

  const handleDuplicate = (agent) => { const { id, isPreset, createdAt, ...rest } = agent; addAgent({ ...rest, name: `${rest.name} (copy)` }) }

  return (
    <div className="flex-1 flex justify-center px-6 py-8 overflow-auto">
      <div className="w-full max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {/* Header — centered */}
          <div className="text-center mb-8">
            <h1 className="text-xl font-bold mb-1">Agent Gallery</h1>
            <p className="text-xs text-text-dim">{agents.length} agents available</p>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => navigate('/builder')} className="btn-primary mt-4 inline-flex">
              <Plus size={14} /> New Agent
            </motion.button>
          </div>

          {/* Search & Filter — centered */}
          <div className="flex gap-3 mb-8 max-w-2xl mx-auto">
            <div className="flex-1 relative">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-dim" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search agents..." className="input-field pl-10 py-2.5 text-sm" />
            </div>
            <div className="flex gap-0.5 bg-white/[0.02] border border-white/[0.06] rounded-xl p-1">
              {['all', 'preset', 'custom'].map(f => (
                <button key={f} onClick={() => setFilter(f)} className={`px-3.5 py-2 text-[11px] rounded-lg capitalize transition-all ${filter === f ? 'bg-accent/[0.12] text-accent-bright' : 'text-text-dim hover:text-text-muted'}`}>
                  {f}
                </button>
              ))}
            </div>
            <button onClick={resetToPresets} className="p-2.5 rounded-xl border border-white/[0.06] hover:border-white/[0.1] text-text-dim hover:text-text-muted transition-all"><RotateCcw size={14} /></button>
          </div>

          {filtered.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
              <div className="w-14 h-14 rounded-[14px] bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mx-auto mb-4 text-xl">🤖</div>
              <p className="text-sm text-text-muted mb-1">No agents found</p>
              <p className="text-xs text-text-dim mb-4">Try a different search or create a new agent</p>
              <button onClick={() => navigate('/builder')} className="text-accent-bright text-xs hover:underline">Create your first agent →</button>
            </motion.div>
          ) : (
            <motion.div variants={STAGGER} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((agent, i) => (
                <motion.div key={agent.id} variants={FADE_UP}>
                  <AgentCard agent={agent} index={i} onDelete={deleteAgent} onDuplicate={handleDuplicate} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
