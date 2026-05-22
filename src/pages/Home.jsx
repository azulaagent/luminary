import { motion } from 'framer-motion'
import { ArrowRight, Zap, MessageSquare, Hammer, Sparkles, Layers, Cpu, GitBranch, Wand2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAgents } from '../lib/agents'
import { getStoredKey } from '../lib/mimo'
import ProceduralAvatar from '../components/ProceduralAvatar'

const FEATURES = [
  { icon: Wand2, title: 'Visual Builder', desc: 'Craft AI agents with an intuitive interface. Define personality, knowledge, and behavior in minutes.', to: '/builder', accent: '#7c5bf5', gradient: 'from-[#7c5bf5] to-[#6d4de8]' },
  { icon: Zap, title: 'Live Arena', desc: 'Test agents in real-time with streaming responses. Watch them think, reason, and respond.', to: '/arena', accent: '#3b82f6', gradient: 'from-[#3b82f6] to-[#2563eb]' },
  { icon: MessageSquare, title: 'Multi-Agent Chat', desc: 'Deploy multiple agents in one conversation. Watch them collaborate, debate, and create.', to: '/multi-chat', accent: '#ec4899', gradient: 'from-[#ec4899] to-[#db2777]' },
  { icon: Layers, title: 'Agent Gallery', desc: 'Browse and remix community agents. Fork the best and make them your own.', to: '/gallery', accent: '#f59e0b', gradient: 'from-[#f59e0b] to-[#d97706]' },
]

const STAGGER = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } }
const FADE_UP = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } } }

export default function Home() {
  const navigate = useNavigate()
  const { agents } = useAgents()
  const hasKey = !!getStoredKey()

  return (
    <div className="flex-1 flex items-center justify-center px-6 py-12 overflow-auto">
      <div className="w-full max-w-4xl mx-auto text-center">

        {/* ═══ HERO ═══ */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} className="mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent/20 bg-accent/[0.06] text-accent-bright text-[11px] font-medium tracking-wide mb-8"
          >
            <Sparkles size={11} />
            Powered by MiMo LLM
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.08] tracking-tight mb-6"
          >
            Build <span className="gradient-text">Intelligent</span><br />Agents
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-sm md:text-base text-text-muted max-w-md mx-auto leading-relaxed mb-10"
          >
            A visual studio for creating, testing, and deploying AI agents.
            Design unique personalities. Watch them come alive.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="flex gap-3 justify-center flex-wrap"
          >
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={() => navigate('/builder')} className="btn-primary glow">
              <Hammer size={15} /> Create Agent
            </motion.button>
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={() => navigate('/gallery')} className="btn-ghost">
              Browse Gallery <ArrowRight size={14} />
            </motion.button>
          </motion.div>

          {!hasKey && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="mt-5 text-[11px] text-warning/70">
              Add your MiMo API key in Settings to unlock AI features
            </motion.p>
          )}

          {/* Agent avatars */}
          {agents.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="flex justify-center gap-3 mt-12">
              {agents.slice(0, 5).map((a, i) => (
                <motion.div key={a.id} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8 + i * 0.08, type: 'spring', stiffness: 200 }}>
                  <div className="w-12 h-12 rounded-[14px] glass flex items-center justify-center glow-sm animate-float" style={{ animationDelay: `${i * 0.4}s` }}>
                    <ProceduralAvatar agent={a} size={30} />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* ═══ FEATURES ═══ */}
        <motion.div variants={STAGGER} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-40px' }} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-20 text-left">
          {FEATURES.map((f) => (
            <motion.div key={f.title} variants={FADE_UP} onClick={() => navigate(f.to)} className="glass glass-hover rounded-2xl p-6 cursor-pointer group relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[1px] opacity-30 group-hover:opacity-80 transition-opacity duration-500" style={{ background: `linear-gradient(90deg, transparent, ${f.accent}, transparent)` }} />
              <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full opacity-0 group-hover:opacity-[0.07] transition-opacity duration-700 blur-2xl" style={{ background: f.accent }} />

              <div className="relative flex items-start gap-4">
                <div className={`w-11 h-11 rounded-[12px] bg-gradient-to-br ${f.gradient} flex items-center justify-center shrink-0 shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:shadow-xl`} style={{ boxShadow: `0 4px 20px ${f.accent}30` }}>
                  <f.icon size={18} className="text-white" strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-[0.9rem] mb-1">{f.title}</h3>
                  <p className="text-xs text-text-muted leading-relaxed">{f.desc}</p>
                </div>
              </div>

              <div className="relative flex items-center gap-1.5 mt-4 pt-3 border-t border-white/[0.04] text-[11px] text-text-dim group-hover:text-accent-bright transition-colors">
                <span>Explore</span>
                <ArrowRight size={11} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ═══ HOW IT WORKS ═══ */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-20">
          <motion.h2 initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-xl font-bold mb-1.5">
            How it works
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-xs text-text-dim mb-10">
            Three steps to your first agent
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { step: '01', title: 'Design', desc: "Define your agent's personality, traits, and capabilities.", icon: Wand2, color: '#7c5bf5' },
              { step: '02', title: 'Test', desc: 'Chat with your agent in the Live Arena. Refine behavior.', icon: Zap, color: '#3b82f6' },
              { step: '03', title: 'Deploy', desc: 'Add to gallery, share, or run multi-agent conversations.', icon: GitBranch, color: '#ec4899' },
            ].map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl p-6 text-center group hover:border-white/[0.1] transition-all"
              >
                <div className="text-[10px] font-mono text-accent/30 tracking-[0.2em] mb-4">{s.step}</div>
                <div className="w-12 h-12 rounded-[14px] mx-auto mb-4 flex items-center justify-center transition-all duration-300 group-hover:scale-110" style={{ background: `${s.color}10`, border: `1px solid ${s.color}18`, boxShadow: `0 0 20px ${s.color}08` }}>
                  <s.icon size={20} style={{ color: s.color }} strokeWidth={1.8} />
                </div>
                <h3 className="font-semibold text-sm mb-2">{s.title}</h3>
                <p className="text-[11px] text-text-dim leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ═══ STATS ═══ */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass gradient-border rounded-2xl p-7 flex items-center justify-around max-w-2xl mx-auto mb-12">
          {[
            { value: agents.length, label: 'Agents Created' },
            { value: '∞', label: 'Possibilities' },
            { value: null, label: 'MiMo Powered', icon: Cpu },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-5">
              {i > 0 && <div className="w-px h-8 bg-white/[0.04]" />}
              <div className="text-center">
                <div className="text-xl font-bold gradient-text">{s.icon ? <s.icon size={20} className="inline" /> : s.value}</div>
                <div className="text-[10px] text-text-dim mt-0.5 tracking-wide">{s.label}</div>
              </div>
            </div>
          ))}
        </motion.div>

        <p className="text-[10px] text-text-dim/40 pb-4">Built with MiMo LLM · Luminary Agent Studio</p>
      </div>
    </div>
  )
}
