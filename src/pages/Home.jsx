import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Zap, MessageSquare, Hammer, Layers, Cpu, GitBranch, Wand2, ArrowRight, Sparkles, ArrowUpRight } from 'lucide-react'
import { useAgents } from '../lib/agents'
import { getStoredKey } from '../lib/mimo'
import ProceduralAvatar from '../components/ProceduralAvatar'

const FEATURES = [
  { icon: Wand2, title: 'Visual Builder', desc: 'Design AI agents with an intuitive visual interface. Define personality, knowledge, and behavior in minutes.', to: '/builder', color: '#8b5cf6' },
  { icon: Zap, title: 'Live Arena', desc: 'Test your agents in real-time with streaming responses. Watch them think, reason, and respond naturally.', to: '/arena', color: '#3b82f6' },
  { icon: MessageSquare, title: 'Multi-Agent Chat', desc: 'Deploy multiple agents in one conversation. Watch them collaborate, debate, and create together.', to: '/multi-chat', color: '#ec4899' },
  { icon: Layers, title: 'Agent Gallery', desc: 'Browse, fork, and remix community-created agents. Build on the best ideas.', to: '/gallery', color: '#f59e0b' },
]

const STEPS = [
  { step: '01', title: 'Design', desc: "Define your agent's personality, traits, and capabilities using the visual builder.", icon: Wand2 },
  { step: '02', title: 'Test', desc: 'Chat with your agent in the Live Arena. Refine behavior through real conversation.', icon: Zap },
  { step: '03', title: 'Deploy', desc: 'Add to gallery, share with others, or orchestrate multi-agent conversations.', icon: GitBranch },
]

const LOGOS = ['Linear', 'Vercel', 'OpenAI', 'Stripe', 'Notion']

const FADE = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }
const STAGGER = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } }

export default function Home() {
  const navigate = useNavigate()
  const { agents } = useAgents()
  const hasKey = !!getStoredKey()

  return (
    <div className="overflow-auto">
      <div className="max-w-5xl mx-auto px-8 py-16">

        {/* ═══ HERO ═══ */}
        <section className="text-center pt-8 pb-20">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="badge badge-accent mb-6 inline-flex">
              <Sparkles size={12} /> Powered by MiMo LLM
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="heading-xl mb-5"
          >
            Build <span className="text-gradient">Intelligent</span><br />Agents
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="body-lg max-w-lg mx-auto mb-9"
          >
            A visual studio for creating, testing, and deploying AI agents.
            Design unique personalities. Watch them come alive.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex gap-3 justify-center flex-wrap"
          >
            <button onClick={() => navigate('/builder')} className="btn btn-primary">
              <Hammer size={15} /> Create Agent
            </button>
            <button onClick={() => navigate('/gallery')} className="btn btn-secondary">
              Browse Gallery <ArrowRight size={14} />
            </button>
          </motion.div>

          {!hasKey && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="body-sm mt-4">
              Add your MiMo API key in Settings to unlock AI features
            </motion.p>
          )}

          {/* Agent preview */}
          {agents.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex justify-center gap-2.5 mt-12"
            >
              {agents.slice(0, 5).map((a, i) => (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + i * 0.06 }}
                >
                  <div className="w-11 h-11 rounded-[10px] bg-bg-card border border-border flex items-center justify-center">
                    <ProceduralAvatar agent={a} size={28} />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </section>

        {/* ═══ TRUSTED BY ═══ */}
        <section className="text-center pb-20">
          <p className="label mb-5">Trusted by builders at</p>
          <div className="flex items-center justify-center gap-10 flex-wrap opacity-30">
            {LOGOS.map(l => (
              <span key={l} className="text-sm font-semibold tracking-wide text-text-dim">{l}</span>
            ))}
          </div>
        </section>

        {/* ═══ FEATURES ═══ */}
        <section className="pb-20">
          <motion.div
            variants={STAGGER}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {FEATURES.map((f) => (
              <motion.div
                key={f.title}
                variants={FADE}
                transition={{ duration: 0.4 }}
                onClick={() => navigate(f.to)}
                className="card card-glow p-6 cursor-pointer group"
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105"
                    style={{ background: `${f.color}12`, border: `1px solid ${f.color}20` }}
                  >
                    <f.icon size={17} style={{ color: f.color }} strokeWidth={1.8} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="heading-sm mb-1.5">{f.title}</h3>
                    <p className="body-sm leading-relaxed">{f.desc}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-border text-[11px] text-text-dim group-hover:text-accent-bright transition-colors">
                  <span>Explore</span>
                  <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ═══ HOW IT WORKS ═══ */}
        <section className="pb-20">
          <div className="text-center mb-10">
            <h2 className="heading-lg mb-2">How it works</h2>
            <p className="body-sm">Three steps to your first agent</p>
          </div>

          <motion.div
            variants={STAGGER}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {STEPS.map((s) => (
              <motion.div key={s.step} variants={FADE} transition={{ duration: 0.4 }} className="card p-6 text-center">
                <div className="label mb-4">{s.step}</div>
                <div className="w-10 h-10 rounded-[10px] bg-accent-muted border border-accent/10 flex items-center justify-center mx-auto mb-4">
                  <s.icon size={17} className="text-accent-bright" strokeWidth={1.8} />
                </div>
                <h3 className="heading-sm mb-1.5">{s.title}</h3>
                <p className="body-sm">{s.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ═══ STATS ═══ */}
        <section className="pb-16">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="card p-7"
          >
            <div className="flex items-center justify-around">
              {[
                { value: agents.length, label: 'Agents Created' },
                { value: '∞', label: 'Possibilities' },
                { value: null, label: 'MiMo Powered', icon: Cpu },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-6">
                  {i > 0 && <div className="w-px h-8 bg-border" />}
                  <div className="text-center">
                    <div className="text-xl font-bold text-gradient">
                      {s.icon ? <s.icon size={18} className="inline" /> : s.value}
                    </div>
                    <div className="label mt-0.5">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ═══ FOOTER ═══ */}
        <footer className="border-t border-border pt-8 pb-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-5 h-5 rounded-md bg-accent flex items-center justify-center">
              <span className="text-[10px] font-bold text-white">L</span>
            </div>
            <span className="text-sm font-semibold">Luminary</span>
          </div>
          <p className="body-sm mb-4">AI Agent Studio · Powered by MiMo LLM</p>
          <div className="flex items-center justify-center gap-6 text-[11px] text-text-dim">
            <a href="https://github.com/azulaagent/luminary" target="_blank" rel="noopener" className="hover:text-text-secondary transition-colors flex items-center gap-1">
              GitHub <ArrowUpRight size={10} />
            </a>
            <span className="text-border">·</span>
            <span>Built with React + Tailwind</span>
          </div>
        </footer>
      </div>
    </div>
  )
}
