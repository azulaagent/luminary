import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Save, Wand2, X, ArrowLeft, RotateCcw } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAgents } from '../lib/agents'
import { chat, getStoredKey } from '../lib/mimo'
import ProceduralAvatar from '../components/ProceduralAvatar'

const COLORS = ['#7c5bf5', '#3b82f6', '#ec4899', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316', '#14b8a6']
const TOOL_OPTIONS = ['knowledge', 'reasoning', 'creativity', 'code', 'analysis', 'strategy', 'brainstorm', 'planning', 'memory', 'search']
const EMPTY = { name: '', personality: '', traits: [], color: '#7c5bf5', systemPrompt: '', tools: [] }

export default function Builder() {
  const navigate = useNavigate()
  const { addAgent } = useAgents()
  const [form, setForm] = useState({ ...EMPTY })
  const [traitInput, setTraitInput] = useState('')
  const [generating, setGenerating] = useState(false)
  const [saved, setSaved] = useState(false)

  const previewAgent = { ...form, id: 'preview', traits: form.traits.length ? form.traits : ['new'] }
  const update = (key, val) => setForm(f => ({ ...f, [key]: val }))
  const addTrait = () => { const t = traitInput.trim().toLowerCase(); if (t && !form.traits.includes(t)) { update('traits', [...form.traits, t]); setTraitInput('') } }
  const removeTrait = (t) => update('traits', form.traits.filter(x => x !== t))
  const toggleTool = (tool) => update('tools', form.tools.includes(tool) ? form.tools.filter(t => t !== tool) : [...form.tools, tool])

  const generatePrompt = async () => {
    if (!form.name || !form.personality) return
    const key = getStoredKey()
    if (!key) { alert('Set your MiMo API key in Settings first'); return }
    setGenerating(true)
    try {
      const result = await chat([{ role: 'user', content: `Generate a system prompt for an AI agent named "${form.name}" with personality: "${form.personality}". Traits: ${form.traits.join(', ')}. Write ONLY the system prompt, under 200 words, second person ("You are...").` }], { apiKey: key, temperature: 0.8 })
      update('systemPrompt', result.trim())
    } catch (e) { alert('Error: ' + e.message) }
    setGenerating(false)
  }

  const handleSave = () => {
    if (!form.name.trim()) return
    addAgent({ ...form, systemPrompt: form.systemPrompt || `You are ${form.name}. ${form.personality}` })
    setSaved(true)
    setTimeout(() => navigate('/gallery'), 800)
  }

  return (
    <div className="flex-1 flex justify-center px-6 py-8 overflow-auto">
      <div className="w-full max-w-5xl">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate('/gallery')} className="p-2 rounded-xl hover:bg-white/[0.03] text-text-muted hover:text-text transition-colors">
                <ArrowLeft size={18} />
              </button>
              <div>
                <h1 className="text-xl font-bold">Agent Builder</h1>
                <p className="text-xs text-text-dim mt-0.5">Design your AI agent from scratch</p>
              </div>
            </div>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSave} disabled={!form.name.trim() || saved} className="btn-primary disabled:opacity-30 disabled:cursor-not-allowed">
              {saved ? <><span className="text-success">✓</span> Saved</> : <><Save size={14} /> Save Agent</>}
            </motion.button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* LEFT: FORM */}
            <div className="lg:col-span-3 space-y-4">
              {/* Name */}
              <div className="glass rounded-2xl p-5">
                <label className="text-[10px] font-medium text-text-dim uppercase tracking-[0.15em]">Name</label>
                <input value={form.name} onChange={e => update('name', e.target.value)} placeholder="Give your agent a name..." className="w-full bg-transparent text-lg font-semibold mt-2.5 focus:outline-none placeholder:text-text-dim/50" />
              </div>

              {/* Personality */}
              <div className="glass rounded-2xl p-5">
                <label className="text-[10px] font-medium text-text-dim uppercase tracking-[0.15em]">Personality</label>
                <textarea value={form.personality} onChange={e => update('personality', e.target.value)} placeholder="Describe how your agent thinks, speaks, and behaves..." rows={3} className="w-full bg-transparent text-sm mt-2.5 focus:outline-none placeholder:text-text-dim/50 resize-none leading-relaxed" />
              </div>

              {/* Traits */}
              <div className="glass rounded-2xl p-5">
                <label className="text-[10px] font-medium text-text-dim uppercase tracking-[0.15em]">Traits</label>
                <div className="flex flex-wrap gap-2 mt-3 mb-3 min-h-[28px]">
                  <AnimatePresence>
                    {form.traits.map(t => (
                      <motion.span key={t} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.06] text-text-muted">
                        {t} <button onClick={() => removeTrait(t)} className="hover:text-danger transition-colors"><X size={9} /></button>
                      </motion.span>
                    ))}
                  </AnimatePresence>
                </div>
                <div className="flex gap-2">
                  <input value={traitInput} onChange={e => setTraitInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addTrait()} placeholder="Add a trait..." className="input-field text-xs py-2.5" />
                  <button onClick={addTrait} className="px-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-accent/30 text-text-muted hover:text-accent transition-colors"><Plus size={14} /></button>
                </div>
              </div>

              {/* Capabilities */}
              <div className="glass rounded-2xl p-5">
                <label className="text-[10px] font-medium text-text-dim uppercase tracking-[0.15em]">Capabilities</label>
                <div className="flex flex-wrap gap-2 mt-3">
                  {TOOL_OPTIONS.map(tool => (
                    <motion.button key={tool} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => toggleTool(tool)} className={`text-[11px] px-3 py-1.5 rounded-xl border transition-all ${form.tools.includes(tool) ? 'border-accent/30 bg-accent/[0.08] text-accent-bright' : 'border-white/[0.06] bg-white/[0.02] text-text-dim hover:border-white/[0.1] hover:text-text-muted'}`}>
                      {tool}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* System Prompt */}
              <div className="glass rounded-2xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[10px] font-medium text-text-dim uppercase tracking-[0.15em]">System Prompt</label>
                  <button onClick={generatePrompt} disabled={generating || !form.name || !form.personality} className="flex items-center gap-1.5 text-[11px] text-accent-bright hover:text-accent disabled:opacity-30 transition-colors">
                    <Wand2 size={11} /> {generating ? 'Generating...' : 'Auto-generate'}
                  </button>
                </div>
                <textarea value={form.systemPrompt} onChange={e => update('systemPrompt', e.target.value)} placeholder="Define the agent's core instructions..." rows={5} className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl px-4 py-3 text-xs font-mono mt-2 focus:outline-none focus:border-accent/30 transition-all resize-none leading-relaxed placeholder:text-text-dim/40" />
              </div>
            </div>

            {/* RIGHT: PREVIEW */}
            <div className="lg:col-span-2">
              <div className="glass gradient-border rounded-2xl p-6 sticky top-6">
                <label className="text-[10px] font-medium text-text-dim uppercase tracking-[0.15em]">Live Preview</label>
                <div className="flex flex-col items-center mt-8 mb-8">
                  <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 30, repeat: Infinity, ease: 'linear' }} className="relative">
                    <div className="absolute inset-0 rounded-full blur-2xl opacity-20" style={{ background: form.color }} />
                    <ProceduralAvatar agent={previewAgent} size={100} />
                  </motion.div>
                  <h3 className="text-lg font-semibold mt-5">{form.name || 'Untitled Agent'}</h3>
                  <p className="text-xs text-text-dim mt-1.5 max-w-[200px] leading-relaxed">{form.personality || 'Define a personality'}</p>
                </div>
                <div className="mb-5">
                  <label className="text-[10px] text-text-dim/60 uppercase tracking-[0.15em]">Color</label>
                  <div className="flex gap-2.5 mt-2.5 flex-wrap justify-center">
                    {COLORS.map(c => (
                      <motion.button key={c} whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }} onClick={() => update('color', c)} className={`w-6 h-6 rounded-full transition-all ${form.color === c ? 'ring-2 ring-white/20 ring-offset-2 ring-offset-bg scale-110' : 'opacity-50 hover:opacity-100'}`} style={{ background: c }} />
                    ))}
                  </div>
                </div>
                <div className="section-divider mb-5" />
                <div className="space-y-3">
                  {[{ label: 'Traits', value: form.traits.length }, { label: 'Capabilities', value: form.tools.length }, { label: 'Prompt', value: `${form.systemPrompt.length} chars` }].map(s => (
                    <div key={s.label} className="flex justify-between text-xs"><span className="text-text-dim">{s.label}</span><span className="text-text-muted font-mono text-[11px]">{s.value}</span></div>
                  ))}
                </div>
                <button onClick={() => setForm({ ...EMPTY })} className="flex items-center gap-1.5 text-[11px] text-text-dim hover:text-text-muted mt-5 mx-auto transition-colors"><RotateCcw size={10} /> Reset</button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
