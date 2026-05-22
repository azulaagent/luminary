import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Palette, Save, RotateCcw, Wand2, ChevronRight, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAgents } from '../lib/agents'
import { chat, getStoredKey } from '../lib/mimo'
import ProceduralAvatar from '../components/ProceduralAvatar'

const COLORS = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#ec4899', '#8b5cf6', '#06b6d4', '#f97316']
const TOOL_OPTIONS = ['knowledge', 'reasoning', 'creativity', 'code', 'analysis', 'strategy', 'brainstorm', 'planning', 'memory', 'search']

const EMPTY = {
  name: '',
  personality: '',
  traits: [],
  color: '#6366f1',
  systemPrompt: '',
  tools: []
}

export default function Builder() {
  const navigate = useNavigate()
  const { addAgent } = useAgents()
  const [form, setForm] = useState({ ...EMPTY })
  const [traitInput, setTraitInput] = useState('')
  const [generating, setGenerating] = useState(false)
  const [saved, setSaved] = useState(false)

  const previewAgent = {
    ...form,
    id: 'preview',
    traits: form.traits.length ? form.traits : ['new']
  }

  const update = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const addTrait = () => {
    const t = traitInput.trim().toLowerCase()
    if (t && !form.traits.includes(t)) {
      update('traits', [...form.traits, t])
      setTraitInput('')
    }
  }

  const removeTrait = (t) => update('traits', form.traits.filter(x => x !== t))

  const toggleTool = (tool) => {
    update('tools', form.tools.includes(tool)
      ? form.tools.filter(t => t !== tool)
      : [...form.tools, tool]
    )
  }

  const generatePrompt = async () => {
    if (!form.name || !form.personality) return
    const key = getStoredKey()
    if (!key) {
      alert('Please set your MiMo API key in Settings first')
      return
    }
    setGenerating(true)
    try {
      const result = await chat([{
        role: 'user',
        content: `Generate a system prompt for an AI agent named "${form.name}" with this personality: "${form.personality}". Traits: ${form.traits.join(', ')}. Tools: ${form.tools.join(', ')}. Write ONLY the system prompt, no explanation. Keep it under 200 words. Second person ("You are...").`
      }], { apiKey: key, temperature: 0.8 })
      update('systemPrompt', result.trim())
    } catch (e) {
      alert('Error: ' + e.message)
    }
    setGenerating(false)
  }

  const handleSave = () => {
    if (!form.name.trim()) return
    addAgent({
      ...form,
      systemPrompt: form.systemPrompt || `You are ${form.name}. ${form.personality}`
    })
    setSaved(true)
    setTimeout(() => navigate('/gallery'), 800)
  }

  return (
    <div className="max-w-6xl mx-auto px-8 py-10">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Agent Builder</h1>
            <p className="text-sm text-text-muted mt-1">Design your AI agent from scratch</p>
          </div>
          <button
            onClick={handleSave}
            disabled={!form.name.trim() || saved}
            className="flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent/80 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl text-sm font-medium transition-all"
          >
            {saved ? (
              <>✓ Saved</>
            ) : (
              <><Save size={14} /> Save Agent</>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Form */}
          <div className="lg:col-span-2 space-y-5">
            {/* Name */}
            <div className="glass rounded-2xl p-5">
              <label className="text-xs font-medium text-text-muted uppercase tracking-wider">Name</label>
              <input
                value={form.name}
                onChange={e => update('name', e.target.value)}
                placeholder="Give your agent a name..."
                className="w-full bg-transparent text-lg font-semibold mt-2 focus:outline-none placeholder:text-text-dim"
              />
            </div>

            {/* Personality */}
            <div className="glass rounded-2xl p-5">
              <label className="text-xs font-medium text-text-muted uppercase tracking-wider">Personality</label>
              <textarea
                value={form.personality}
                onChange={e => update('personality', e.target.value)}
                placeholder="Describe how your agent thinks, speaks, and behaves..."
                rows={3}
                className="w-full bg-transparent text-sm mt-2 focus:outline-none placeholder:text-text-dim resize-none leading-relaxed"
              />
            </div>

            {/* Traits */}
            <div className="glass rounded-2xl p-5">
              <label className="text-xs font-medium text-text-muted uppercase tracking-wider">Traits</label>
              <div className="flex flex-wrap gap-2 mt-3 mb-3">
                <AnimatePresence>
                  {form.traits.map(t => (
                    <motion.span
                      key={t}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border border-border bg-bg-elevated"
                    >
                      {t}
                      <button onClick={() => removeTrait(t)} className="hover:text-danger transition-colors">
                        <X size={10} />
                      </button>
                    </motion.span>
                  ))}
                </AnimatePresence>
              </div>
              <div className="flex gap-2">
                <input
                  value={traitInput}
                  onChange={e => setTraitInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addTrait()}
                  placeholder="Add a trait..."
                  className="flex-1 bg-bg-elevated border border-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-accent transition-colors"
                />
                <button onClick={addTrait} className="px-3 py-2 text-xs bg-bg-elevated border border-border rounded-xl hover:border-accent transition-colors">
                  <Plus size={12} />
                </button>
              </div>
            </div>

            {/* Tools */}
            <div className="glass rounded-2xl p-5">
              <label className="text-xs font-medium text-text-muted uppercase tracking-wider">Capabilities</label>
              <div className="flex flex-wrap gap-2 mt-3">
                {TOOL_OPTIONS.map(tool => (
                  <button
                    key={tool}
                    onClick={() => toggleTool(tool)}
                    className={`text-xs px-3 py-1.5 rounded-xl border transition-all ${
                      form.tools.includes(tool)
                        ? 'border-accent bg-accent/10 text-accent'
                        : 'border-border bg-bg-elevated text-text-muted hover:border-border-hover'
                    }`}
                  >
                    {tool}
                  </button>
                ))}
              </div>
            </div>

            {/* System Prompt */}
            <div className="glass rounded-2xl p-5">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-text-muted uppercase tracking-wider">System Prompt</label>
                <button
                  onClick={generatePrompt}
                  disabled={generating || !form.name || !form.personality}
                  className="flex items-center gap-1.5 text-xs text-accent hover:text-accent/80 disabled:opacity-40 transition-colors"
                >
                  <Wand2 size={12} />
                  {generating ? 'Generating...' : 'Auto-generate'}
                </button>
              </div>
              <textarea
                value={form.systemPrompt}
                onChange={e => update('systemPrompt', e.target.value)}
                placeholder="Define the agent's core instructions... (or auto-generate from personality)"
                rows={5}
                className="w-full bg-bg-elevated border border-border rounded-xl px-4 py-3 text-xs font-mono mt-2 focus:outline-none focus:border-accent transition-colors resize-none leading-relaxed"
              />
            </div>
          </div>

          {/* Right: Preview */}
          <div className="space-y-5">
            <div className="glass rounded-2xl p-6 sticky top-6">
              <label className="text-xs font-medium text-text-muted uppercase tracking-wider">Preview</label>

              <div className="flex flex-col items-center mt-6 mb-6">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                >
                  <ProceduralAvatar agent={previewAgent} size={100} />
                </motion.div>
                <h3 className="text-lg font-semibold mt-4">{form.name || 'Untitled Agent'}</h3>
                <p className="text-xs text-text-muted mt-1 text-center max-w-[200px]">
                  {form.personality || 'No personality defined'}
                </p>
              </div>

              {/* Color picker */}
              <div className="mt-4">
                <label className="text-[10px] text-text-dim uppercase tracking-wider">Color</label>
                <div className="flex gap-2 mt-2">
                  {COLORS.map(c => (
                    <button
                      key={c}
                      onClick={() => update('color', c)}
                      className={`w-6 h-6 rounded-full transition-all ${
                        form.color === c ? 'ring-2 ring-white/30 scale-110' : 'hover:scale-105'
                      }`}
                      style={{ background: c }}
                    />
                  ))}
                </div>
              </div>

              {/* Quick stats */}
              <div className="mt-6 pt-4 border-t border-border space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-text-dim">Traits</span>
                  <span className="text-text-muted">{form.traits.length}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-text-dim">Capabilities</span>
                  <span className="text-text-muted">{form.tools.length}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-text-dim">Prompt</span>
                  <span className="text-text-muted">{form.systemPrompt.length} chars</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
