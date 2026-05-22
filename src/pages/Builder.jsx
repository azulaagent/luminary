import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Save, Wand2, X, ArrowLeft, RotateCcw } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAgents } from '../lib/agents'
import { chat, getStoredKey } from '../lib/mimo'
import ProceduralAvatar from '../components/ProceduralAvatar'

const COLORS = ['#8b5cf6', '#3b82f6', '#ec4899', '#f59e0b', '#10b981', '#ef4444', '#06b6d4', '#f97316']
const TOOLS = ['knowledge', 'reasoning', 'creativity', 'code', 'analysis', 'strategy', 'brainstorm', 'planning', 'memory', 'search']
const EMPTY = { name: '', personality: '', traits: [], color: '#8b5cf6', systemPrompt: '', tools: [] }

export default function Builder() {
  const navigate = useNavigate()
  const { addAgent } = useAgents()
  const [form, setForm] = useState({ ...EMPTY })
  const [traitInput, setTraitInput] = useState('')
  const [generating, setGenerating] = useState(false)
  const [saved, setSaved] = useState(false)

  const previewAgent = { ...form, id: 'preview', traits: form.traits.length ? form.traits : ['new'] }
  const update = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const addTrait = () => { const t = traitInput.trim().toLowerCase(); if (t && !form.traits.includes(t)) { update('traits', [...form.traits, t]); setTraitInput('') } }
  const removeTrait = (t) => update('traits', form.traits.filter(x => x !== t))
  const toggleTool = (t) => update('tools', form.tools.includes(t) ? form.tools.filter(x => x !== t) : [...form.tools, t])

  const generatePrompt = async () => {
    if (!form.name || !form.personality) return
    const key = getStoredKey()
    if (!key) { alert('Set your MiMo API key in Settings first'); return }
    setGenerating(true)
    try {
      const r = await chat([{ role: 'user', content: `Generate a system prompt for an AI agent named "${form.name}" with personality: "${form.personality}". Traits: ${form.traits.join(', ')}. Write ONLY the system prompt, under 200 words, second person.` }], { apiKey: key, temperature: 0.8 })
      update('systemPrompt', r.trim())
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
    <div className="max-w-5xl mx-auto px-8 py-10">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/gallery')} className="btn btn-ghost btn-sm px-2"><ArrowLeft size={16} /></button>
            <div>
              <h1 className="heading-lg">Agent Builder</h1>
              <p className="body-sm">Design your AI agent from scratch</p>
            </div>
          </div>
          <button onClick={handleSave} disabled={!form.name.trim() || saved} className="btn btn-primary disabled:opacity-30 disabled:cursor-not-allowed">
            {saved ? <><span className="text-success">✓</span> Saved</> : <><Save size={14} /> Save Agent</>}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          {/* LEFT */}
          <div className="lg:col-span-3 space-y-3.5">
            <div className="card p-5">
              <label className="label">Name</label>
              <input value={form.name} onChange={e => update('name', e.target.value)} placeholder="Give your agent a name..." className="w-full bg-transparent text-lg font-semibold mt-2 focus:outline-none placeholder:text-text-dim/50" />
            </div>
            <div className="card p-5">
              <label className="label">Personality</label>
              <textarea value={form.personality} onChange={e => update('personality', e.target.value)} placeholder="Describe how your agent thinks, speaks, and behaves..." rows={3} className="w-full bg-transparent body-md mt-2 focus:outline-none placeholder:text-text-dim/50 resize-none" />
            </div>
            <div className="card p-5">
              <label className="label">Traits</label>
              <div className="flex flex-wrap gap-1.5 mt-2.5 mb-2.5 min-h-[24px]">
                <AnimatePresence>
                  {form.traits.map(t => (
                    <motion.span key={t} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-bg-subtle border border-border text-text-secondary">
                      {t} <button onClick={() => removeTrait(t)} className="hover:text-danger transition-colors"><X size={8} /></button>
                    </motion.span>
                  ))}
                </AnimatePresence>
              </div>
              <div className="flex gap-2">
                <input value={traitInput} onChange={e => setTraitInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addTrait()} placeholder="Add a trait..." className="input text-xs py-2" />
                <button onClick={addTrait} className="btn btn-secondary btn-sm px-2.5"><Plus size={13} /></button>
              </div>
            </div>
            <div className="card p-5">
              <label className="label">Capabilities</label>
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {TOOLS.map(t => (
                  <button key={t} onClick={() => toggleTool(t)} className={`text-[11px] px-2.5 py-1 rounded-md border transition-all ${form.tools.includes(t) ? 'border-accent/30 bg-accent-muted text-accent-bright' : 'border-border bg-bg-subtle text-text-dim hover:border-border-subtle hover:text-text-secondary'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="card p-5">
              <div className="flex items-center justify-between mb-1.5">
                <label className="label">System Prompt</label>
                <button onClick={generatePrompt} disabled={generating || !form.name || !form.personality} className="text-[11px] text-accent-bright hover:text-accent disabled:opacity-30 transition-colors flex items-center gap-1">
                  <Wand2 size={10} /> {generating ? 'Generating...' : 'Auto-generate'}
                </button>
              </div>
              <textarea value={form.systemPrompt} onChange={e => update('systemPrompt', e.target.value)} placeholder="Define the agent's core instructions..." rows={5} className="w-full bg-bg-subtle border border-border rounded-[10px] px-3.5 py-2.5 text-xs font-mono mt-2 focus:outline-none focus:border-accent/30 transition-colors resize-none leading-relaxed placeholder:text-text-dim/40" />
            </div>
          </div>

          {/* RIGHT: PREVIEW */}
          <div className="lg:col-span-2">
            <div className="card p-6 sticky top-6">
              <label className="label">Live Preview</label>
              <div className="flex flex-col items-center mt-6 mb-6">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full blur-xl opacity-15" style={{ background: form.color }} />
                  <ProceduralAvatar agent={previewAgent} size={88} />
                </div>
                <h3 className="heading-md mt-4">{form.name || 'Untitled Agent'}</h3>
                <p className="body-sm mt-1 max-w-[180px] text-center">{form.personality || 'Define a personality'}</p>
              </div>
              <div className="mb-4">
                <label className="label">Color</label>
                <div className="flex gap-2 mt-2 flex-wrap justify-center">
                  {COLORS.map(c => (
                    <button key={c} onClick={() => update('color', c)} className={`w-5 h-5 rounded-full transition-all ${form.color === c ? 'ring-2 ring-white/20 ring-offset-1.5 ring-offset-bg scale-110' : 'opacity-40 hover:opacity-100'}`} style={{ background: c }} />
                  ))}
                </div>
              </div>
              <div className="divider my-4" />
              <div className="space-y-2.5">
                {[{ l: 'Traits', v: form.traits.length }, { l: 'Capabilities', v: form.tools.length }, { l: 'Prompt', v: `${form.systemPrompt.length} chars` }].map(s => (
                  <div key={s.l} className="flex justify-between text-xs"><span className="text-text-dim">{s.l}</span><span className="text-text-muted font-mono text-[11px]">{s.v}</span></div>
                ))}
              </div>
              <button onClick={() => setForm({ ...EMPTY })} className="flex items-center gap-1 text-[11px] text-text-dim hover:text-text-muted mt-4 mx-auto transition-colors"><RotateCcw size={9} /> Reset</button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
