import { motion } from 'framer-motion'
import { ArrowRight, Bot, Zap, MessageSquare, Hammer, Sparkles, Cpu, Layers } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAgents } from '../lib/agents'
import { getStoredKey } from '../lib/mimo'

const FEATURES = [
  {
    icon: Hammer,
    title: 'Visual Builder',
    desc: 'Design AI agents with an intuitive drag-and-drop interface. Define personality, knowledge, and behavior.',
    to: '/builder'
  },
  {
    icon: Zap,
    title: 'Live Arena',
    desc: 'Test your agents in real-time with streaming responses. Watch them think and respond.',
    to: '/arena'
  },
  {
    icon: MessageSquare,
    title: 'Multi-Agent Chat',
    desc: 'Deploy multiple agents in one conversation. Watch them collaborate, debate, and create together.',
    to: '/multi-chat'
  },
  {
    icon: Layers,
    title: 'Agent Gallery',
    desc: 'Browse and remix community-created agents. Fork the best and make them your own.',
    to: '/gallery'
  }
]

export default function Home() {
  const navigate = useNavigate()
  const { agents } = useAgents()
  const hasKey = !!getStoredKey()

  return (
    <div className="max-w-5xl mx-auto px-8 py-16">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-20"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent/30 bg-accent/5 text-accent text-xs font-medium mb-6"
        >
          <Sparkles size={12} />
          Powered by MiMo LLM
        </motion.div>

        <h1 className="text-5xl font-bold mb-4 tracking-tight">
          Build <span className="gradient-text">Intelligent</span> Agents
        </h1>
        <p className="text-lg text-text-muted max-w-xl mx-auto leading-relaxed">
          A visual studio for creating, testing, and deploying AI agents.
          Design unique personalities. Watch them come alive.
        </p>

        <div className="flex gap-3 justify-center mt-8">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/builder')}
            className="flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent/80 rounded-xl text-sm font-medium transition-colors glow"
          >
            <Hammer size={16} />
            Create Agent
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/gallery')}
            className="flex items-center gap-2 px-6 py-3 glass glass-hover rounded-xl text-sm font-medium transition-colors"
          >
            Browse Gallery
            <ArrowRight size={14} />
          </motion.button>
        </div>

        {!hasKey && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-4 text-xs text-warning"
          >
            ⚡ Add your MiMo API key in Settings to enable AI features
          </motion.p>
        )}
      </motion.div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
        {FEATURES.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            onClick={() => navigate(f.to)}
            className="glass glass-hover rounded-2xl p-6 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
              <f.icon size={18} className="text-accent" />
            </div>
            <h3 className="font-semibold mb-1.5">{f.title}</h3>
            <p className="text-sm text-text-muted leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="glass rounded-2xl p-6 flex items-center justify-around"
      >
        <div className="text-center">
          <div className="text-2xl font-bold gradient-text">{agents.length}</div>
          <div className="text-xs text-text-muted mt-0.5">Agents Created</div>
        </div>
        <div className="w-px h-8 bg-border" />
        <div className="text-center">
          <div className="text-2xl font-bold gradient-text">∞</div>
          <div className="text-xs text-text-muted mt-0.5">Possibilities</div>
        </div>
        <div className="w-px h-8 bg-border" />
        <div className="text-center">
          <div className="text-2xl font-bold gradient-text">
            <Cpu size={24} className="inline" />
          </div>
          <div className="text-xs text-text-muted mt-0.5">MiMo Powered</div>
        </div>
      </motion.div>
    </div>
  )
}
