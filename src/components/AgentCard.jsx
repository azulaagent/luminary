import { Zap, Trash2, Copy } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import ProceduralAvatar from './ProceduralAvatar'

export default function AgentCard({ agent, onDelete, onDuplicate }) {
  const navigate = useNavigate()
  return (
    <div onClick={() => navigate(`/arena/${agent.id}`)} className="card card-glow p-5 cursor-pointer group">
      <div className="flex items-start gap-3.5">
        <div className="w-12 h-12 rounded-[10px] flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105" style={{ background: `${agent.color || '#8b5cf6'}0c`, border: `1px solid ${agent.color || '#8b5cf6'}15` }}>
          <ProceduralAvatar agent={agent} size={32} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="heading-sm truncate">{agent.name}</h3>
          <p className="body-sm mt-1 line-clamp-2">{agent.personality}</p>
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {agent.traits?.slice(0, 3).map(t => (
              <span key={t} className="text-[10px] px-2 py-0.5 rounded-md bg-bg-subtle border border-border text-text-dim">{t}</span>
            ))}
            {agent.traits?.length > 3 && <span className="text-[10px] text-text-dim">+{agent.traits.length - 3}</span>}
          </div>
        </div>
      </div>
      <div className="flex gap-2 mt-4 pt-3 border-t border-border">
        <button onClick={e => { e.stopPropagation(); navigate(`/arena/${agent.id}`) }} className="btn btn-sm btn-primary flex-1">
          <Zap size={11} /> Chat
        </button>
        {!agent.isPreset && (
          <>
            <button onClick={e => { e.stopPropagation(); onDuplicate?.(agent) }} className="btn btn-sm btn-ghost px-2"><Copy size={12} /></button>
            <button onClick={e => { e.stopPropagation(); onDelete?.(agent.id) }} className="btn btn-sm btn-ghost px-2 text-text-dim hover:text-danger"><Trash2 size={12} /></button>
          </>
        )}
      </div>
    </div>
  )
}
