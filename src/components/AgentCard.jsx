import { motion } from 'framer-motion'
import { Zap, Trash2, Copy, Settings } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import ProceduralAvatar from './ProceduralAvatar'

export default function AgentCard({ agent, onDelete, onDuplicate, index = 0 }) {
  const navigate = useNavigate()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="glass glass-hover rounded-2xl p-5 group cursor-pointer relative overflow-hidden"
      onClick={() => navigate(`/arena/${agent.id}`)}
    >
      {/* Accent gradient top */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] opacity-60 group-hover:opacity-100 transition-opacity"
        style={{ background: `linear-gradient(90deg, transparent, ${agent.color || '#6366f1'}, transparent)` }}
      />

      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="shrink-0 animate-float" style={{ animationDelay: `${index * 0.3}s` }}>
          <ProceduralAvatar agent={agent} size={56} />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm truncate">{agent.name}</h3>
          <p className="text-xs text-text-muted mt-1 line-clamp-2 leading-relaxed">
            {agent.personality}
          </p>

          {/* Traits */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {agent.traits?.slice(0, 3).map(trait => (
              <span
                key={trait}
                className="text-[10px] px-2 py-0.5 rounded-full border border-border bg-bg-elevated text-text-muted"
              >
                {trait}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-4 pt-3 border-t border-border">
        <button
          onClick={(e) => { e.stopPropagation(); navigate(`/arena/${agent.id}`) }}
          className="flex-1 flex items-center justify-center gap-1.5 text-xs py-2 rounded-xl bg-accent/10 text-accent hover:bg-accent/20 transition-colors"
        >
          <Zap size={12} />
          Chat
        </button>
        {!agent.isPreset && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); onDuplicate?.(agent) }}
              className="p-2 rounded-xl hover:bg-white/5 text-text-muted hover:text-text transition-colors"
            >
              <Copy size={13} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete?.(agent.id) }}
              className="p-2 rounded-xl hover:bg-danger/10 text-text-muted hover:text-danger transition-colors"
            >
              <Trash2 size={13} />
            </button>
          </>
        )}
      </div>
    </motion.div>
  )
}
