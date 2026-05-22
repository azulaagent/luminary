import { motion } from 'framer-motion'
import { ArrowRight, Bot, Zap, MessageSquare, Hammer, Sparkles, Layers, Cpu, GitBranch, Wand2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAgents } from '../lib/agents'
import { getStoredKey } from '../lib/mimo'
import ProceduralAvatar from '../components/ProceduralAvatar'

const FEATURES = [
  {
    icon: Wand2,
    title: 'Visual Builder',
    desc: 'Craft AI agents with an intuitive interface. Define personality, knowledge, and behavior in minutes.',
    to: '/builder',
    accent: '#7c5bf5'
  },
  {
    icon: Zap,
    title: 'Live Arena',
    desc: 'Test agents in real-time with streaming responses. Watch them think, reason, and respond.',
    to: '/arena',
    accent: '#3b82f6'
  },
  {
    icon: MessageSquare,
    title: 'Multi-Agent Chat',
    desc: 'Deploy multiple agents in one conversation. Watch them collaborate, debate, and create.',
    to: '/multi-chat',
    accent: '#ec4899'
  },
  {
    icon: Layers,
    title: 'Agent Gallery',
    desc: 'Browse and remix community agents. Fork the best and make them your own.',
    to: '/gallery',
    accent: '#f59e0b'
  }
]

const STAGGER = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } }
}

const FADE_UP = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } }
}

export default function Home() {
  const navigate = useNavigate()
  const { agents } = useAgents()
  const hasKey = !!getStoredKey()

  return (
    <div className="max-w-6xl mx-auto px-8 py-16">
      {/* ═══ HERO ═══ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-24 pt-8"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent/20 bg-accent/[0.06] text-accent-bright text-[11px] font-medium tracking-wide mb-8"
        >
          <Sparkles size={11} />
          Powered by MiMo LLM
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-[3.5rem] font-bold leading-[1.1] tracking-tight mb-5"
        >
          Build <span className="gradient-text">Intelligent</span><br />
          Agents
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.5 }}
          className="text-base text-text-muted max-w-lg mx-auto leading-relaxed mb-10"
        >
          A visual studio for creating, testing, and deploying AI agents.
          Design unique personalities. Watch them come alive.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex gap-3 justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/builder')}
            className="btn-primary glow"
          >
            <Hammer size={15} />
            Create Agent
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/gallery')}
            className="btn-ghost"
          >
            Browse Gallery
            <ArrowRight size={14} />
          </motion.button>
        </motion.div>

        {!hasKey && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-5 text-[11px] text-warning/80"
          >
            Add your MiMo API key in Settings to unlock AI features
          </motion.p>
        )}

        {/* Agent preview row */}
        {agents.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex justify-center gap-3 mt-14"
          >
            {agents.slice(0, 5).map((a, i) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 + i * 0.1, type: 'spring', stiffness: 200 }}
                className="animate-float"
                style={{ animationDelay: `${i * 0.4}s` }}
              >
                <div className="w-14 h-14 rounded-2xl glass flex items-center justify-center glow-sm">
                  <ProceduralAvatar agent={a} size={36} />
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>

      {/* ═══ FEATURES ═══ */}
      <motion.div
        variants={STAGGER}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-50px' }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-20"
      >
        {FEATURES.map((f) => (
          <motion.div
            key={f.title}
            variants={FADE_UP}
            onClick={() => navigate(f.to)}
            className="glass glass-hover rounded-2xl p-7 cursor-pointer group relative overflow-hidden"
          >
            {/* Accent line */}
            <div
              className="absolute top-0 left-0 right-0 h-[1px] opacity-40 group-hover:opacity-80 transition-opacity"
              style={{ background: `linear-gradient(90deg, transparent, ${f.accent}, transparent)` }}
            />

            <div className="flex items-start gap-5">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110"
                style={{ background: `${f.accent}12`, border: `1px solid ${f.accent}20` }}
              >
                <f.icon size={18} style={{ color: f.accent }} />
              </div>
              <div>
                <h3 className="font-semibold text-[0.95rem] mb-1.5">{f.title}</h3>
                <p className="text-sm text-text-muted leading-relaxed">{f.desc}</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 mt-5 text-xs text-text-dim group-hover:text-accent-bright transition-colors">
              <span>Explore</span>
              <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* ═══ HOW IT WORKS ═══ */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mb-20"
      >
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold mb-2">How it works</h2>
          <p className="text-sm text-text-muted">Three steps to your first agent</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { step: '01', title: 'Design', desc: 'Define your agent\'s personality, traits, and capabilities using the visual builder.', icon: Wand2 },
            { step: '02', title: 'Test', desc: 'Chat with your agent in the Live Arena. Refine its behavior through conversation.', icon: Zap },
            { step: '03', title: 'Deploy', desc: 'Add to your gallery, share with others, or run multi-agent conversations.', icon: GitBranch },
          ].map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className="glass rounded-2xl p-6 text-center relative"
            >
              <div className="text-[10px] font-mono text-accent/50 tracking-widest mb-4">{s.step}</div>
              <div className="w-10 h-10 rounded-xl bg-accent/[0.08] border border-accent/10 flex items-center justify-center mx-auto mb-4">
                <s.icon size={18} className="text-accent-bright" />
              </div>
              <h3 className="font-semibold text-sm mb-2">{s.title}</h3>
              <p className="text-xs text-text-muted leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ═══ STATS ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass gradient-border rounded-2xl p-8 flex items-center justify-around"
      >
        {[
          { value: agents.length, label: 'Agents Created' },
          { value: '∞', label: 'Possibilities' },
          { value: null, label: 'MiMo Powered', icon: Cpu },
        ].map((s, i) => (
          <div key={i} className="flex items-center gap-6">
            {i > 0 && <div className="w-px h-10 bg-white/[0.04]" />}
            <div className="text-center">
              <div className="text-2xl font-bold gradient-text">
                {s.icon ? <s.icon size={22} className="inline" /> : s.value}
              </div>
              <div className="text-[11px] text-text-dim mt-1 tracking-wide">{s.label}</div>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Footer */}
      <div className="text-center mt-16 pb-8">
        <p className="text-[11px] text-text-dim">
          Built with MiMo LLM · Luminary Agent Studio
        </p>
      </div>
    </div>
  )
}
