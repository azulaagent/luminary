import { motion } from 'framer-motion'
import { ArrowRight, Bot, Zap, MessageSquare, Hammer, Sparkles, Layers, Cpu, GitBranch, Wand2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAgents } from '../lib/agents'
import { getStoredKey } from '../lib/mimo'
import ProceduralAvatar from '../components/ProceduralAvatar'

const FEATURES = [
  { icon: Wand2, title: 'Visual Builder', desc: 'Craft AI agents with an intuitive interface. Define personality, knowledge, and behavior in minutes.', to: '/builder', accent: '#7c5bf5' },
  { icon: Zap, title: 'Live Arena', desc: 'Test agents in real-time with streaming responses. Watch them think, reason, and respond.', to: '/arena', accent: '#3b82f6' },
  { icon: MessageSquare, title: 'Multi-Agent Chat', desc: 'Deploy multiple agents in one conversation. Watch them collaborate, debate, and create.', to: '/multi-chat', accent: '#ec4899' },
  { icon: Layers, title: 'Agent Gallery', desc: 'Browse and remix community agents. Fork the best and make them your own.', to: '/gallery', accent: '#f59e0b' },
]

const STAGGER = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } }
const FADE_UP = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } } }

export default function Home() {
  const navigate = useNavigate()
  const { agents } = useAgents()
  const hasKey = !!getStoredKey()

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-5xl mx-auto">

        {/* ═══ HERO — centered ═══ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent/20 bg-accent/[0.06] text-accent-bright text-[11px] font-medium tracking-wide mb-8"
          >
            <Sparkles size={11} />
            Powered by MiMo LLM
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold leading-[1.1] tracking-tight mb-5"
          >
            Build <span className="gradient-text">Intelligent</span><br />Agents
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="text-sm md:text-base text-text-muted max-w-md mx-auto leading-relaxed mb-10"
          >
            A visual studio for creating, testing, and deploying AI agents. Design unique personalities. Watch them come alive.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex gap-3 justify-center"
          >
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => navigate('/builder')} className="btn-primary glow">
              <Hammer size={15} /> Create Agent
            </motion.button>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => navigate('/gallery')} className="btn-ghost">
              Browse Gallery <ArrowRight size={14} />
            </motion.button>
          </motion.div>

          {!hasKey && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="mt-5 text-[11px] text-warning/80">
              Add your MiMo API key in Settings to unlock AI features
            </motion.p>
          )}

          {/* Agent avatars row */}
          {agents.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex justify-center gap-3 mt-12"
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
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl glass flex items-center justify-center glow-sm">
                    <ProceduralAvatar agent={a} size={32} />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* ═══ FEATURES — centered grid ═══ */}
        <motion.div
          variants={STAGGER}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-20 max-w-4xl mx-auto"
        >
          {FEATURES.map((f) => (
            <motion.div
              key={f.title}
              variants={FADE_UP}
              onClick={() => navigate(f.to)}
              className="glass glass-hover rounded-2xl p-6 cursor-pointer group relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-[1px] opacity-30 group-hover:opacity-70 transition-opacity" style={{ background: `linear-gradient(90deg, transparent, ${f.accent}, transparent)` }} />
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all group-hover:scale-110" style={{ background: `${f.accent}12`, border: `1px solid ${f.accent}20` }}>
                  <f.icon size={17} style={{ color: f.accent }} />
                </div>
                <div>
                  <h3 className="font-semibold text-sm mb-1">{f.title}</h3>
                  <p className="text-xs text-text-muted leading-relaxed">{f.desc}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 mt-4 text-[11px] text-text-dim group-hover:text-accent-bright transition-colors">
                <span>Explore</span>
                <ArrowRight size={11} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ═══ HOW IT WORKS — centered ═══ */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-20 max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-xl font-bold mb-1.5">How it works</h2>
            <p className="text-xs text-text-dim">Three steps to your first agent</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { step: '01', title: 'Design', desc: "Define your agent's personality, traits, and capabilities using the visual builder.", icon: Wand2 },
              { step: '02', title: 'Test', desc: 'Chat with your agent in the Live Arena. Refine its behavior through conversation.', icon: Zap },
              { step: '03', title: 'Deploy', desc: 'Add to your gallery, share with others, or run multi-agent conversations.', icon: GitBranch },
            ].map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl p-5 text-center"
              >
                <div className="text-[10px] font-mono text-accent/40 tracking-widest mb-3">{s.step}</div>
                <div className="w-9 h-9 rounded-xl bg-accent/[0.06] border border-accent/10 flex items-center justify-center mx-auto mb-3">
                  <s.icon size={16} className="text-accent-bright" />
                </div>
                <h3 className="font-semibold text-sm mb-1.5">{s.title}</h3>
                <p className="text-[11px] text-text-dim leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ═══ STATS — centered ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass gradient-border rounded-2xl p-6 flex items-center justify-around max-w-2xl mx-auto"
        >
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

        {/* Footer */}
        <div className="text-center mt-12 pb-6">
          <p className="text-[10px] text-text-dim/50">Built with MiMo LLM · Luminary Agent Studio</p>
        </div>
      </div>
    </div>
  )
}
