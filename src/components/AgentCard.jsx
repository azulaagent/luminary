import { motion } from 'framer-motion'
import { Zap, Trash2, Copy } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import ProceduralAvatar from './ProceduralAvatar'

export default function AgentCard({ agent, onDelete, onDuplicate }) {
  const navigate = useNavigate()

  return (
    <div
      className="glass glass-hover rounded-2xl p-5 cursor-pointer group relative overflow-hidden"
      onClick={() => navigate(`/arena/${agent.id}`)}
    >
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] opacity-30 group-hover:opacity-80 transition-opacity duration-500" style={{ background: `linear-gradient(90deg, transparent, ${agent.color || '#7c5bf5'}, transparent)` }} />

      {/* Hover glow */}
      <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-0 group-hover:opacity-[0.06] transition-opacity duration-700 blur-3xl" style={{ background: agent.color || '#7c5bf5' }} />

      <div className="relative flex items-start gap-4">
        {/* Avatar in styled box */}
        <div className="shrink-0">
          <div className="w-14 h-14 rounded-[14px] flex items-center justify-center transition-all duration-300 group-hover:scale-105" style={{ background: `${agent.color || '#7c5bf5'}0a`, border: `1px solid ${agent.color || '#7c5bf5'}15` }}>
            <ProceduralAvatar agent={agent} size={38} />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-[0.9rem] truncate">{agent.name}</h3>
          <p className="text-[11px] text-text-dim mt-1 line-clamp-2 leading-relaxed">{agent.personality}</p>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {agent.traits?.slice(0, 3).map(trait => (
              <span key={trait} className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.03] border border-white/[0.06] text-text-dim">{trait}</span>
            ))}
            {agent.traits?.length > 3 && <span className="text-[10px] px-1 text-text-dim">+{agent.traits.length - 3}</span>}
          </div>
        </div>
      </div>

      <div className="relative flex gap-2 mt-4 pt-3 border-t border-white/[0.04]">
        <button onClick={(e) => { e.stopPropagation(); navigate(`/arena/${agent.id}`) }} className="flex-1 flex items-center justify-center gap-1.5 text-[11px] py-2 rounded-xl bg-accent/[0.08] text-accent-bright hover:bg-accent/[0.14] border border-accent/10 transition-all">
          <Zap size={11} /> Chat
        </button>
        {!agent.isPreset && (
          <>
            <button onClick={(e) => { e.stopPropagation(); onDuplicate?.(agent) }} className="p-2 rounded-xl hover:bg-white/[0.04] text-text-dim hover:text-text-muted transition-colors"><Copy size={12} /></button>
            <button onClick={(e) => { e.stopPropagation(); onDelete?.(agent.id) }} className="p-2 rounded-xl hover:bg-danger/[0.08] text-text-dim hover:text-danger transition-colors"><Trash2 size={12} /></button>
          </>
        )}
      </div>
    </div>
  )
}
