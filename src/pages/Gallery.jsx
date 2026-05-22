import { motion } from 'framer-motion'
import { Search, Plus, RotateCcw } from 'lucide-react'
import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAgents } from '../lib/agents'
import AgentCard from '../components/AgentCard'

const STAGGER = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } }
const FADE = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } }

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
    <div className="max-w-5xl mx-auto px-8 py-10">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="heading-lg">Agent Gallery</h1>
            <p className="body-sm mt-0.5">{agents.length} agents available</p>
          </div>
          <button onClick={() => navigate('/builder')} className="btn btn-primary"><Plus size={14} /> New Agent</button>
        </div>

        <div className="flex gap-3 mb-6">
          <div className="flex-1 relative">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-dim" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search agents..." className="input pl-9" />
          </div>
          <div className="flex gap-0.5 bg-bg-card border border-border rounded-[10px] p-1">
            {['all', 'preset', 'custom'].map(f => (
              <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 text-[11px] rounded-lg capitalize transition-all ${filter === f ? 'bg-accent-muted text-accent-bright' : 'text-text-dim hover:text-text-secondary'}`}>
                {f}
              </button>
            ))}
          </div>
          <button onClick={resetToPresets} className="btn btn-secondary btn-sm px-2.5"><RotateCcw size={13} /></button>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-12 h-12 rounded-[10px] bg-bg-card border border-border flex items-center justify-center mx-auto mb-3 text-lg">🤖</div>
            <p className="body-md mb-1">No agents found</p>
            <p className="body-sm mb-4">Try a different search or create a new agent</p>
            <button onClick={() => navigate('/builder')} className="text-accent-bright text-xs hover:underline underline-offset-2">Create your first agent →</button>
          </div>
        ) : (
          <motion.div variants={STAGGER} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filtered.map((agent, i) => (
              <motion.div key={agent.id} variants={FADE}><AgentCard agent={agent} index={i} onDelete={deleteAgent} onDuplicate={handleDuplicate} /></motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
