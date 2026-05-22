import { useState, useRef, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, ArrowLeft, RotateCcw, ChevronDown } from 'lucide-react'
import { useAgents } from '../lib/agents'
import { streamChat, getStoredKey } from '../lib/mimo'
import ProceduralAvatar from '../components/ProceduralAvatar'

function Message({ msg, agent }) {
  const isUser = msg.role === 'user'
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      {!isUser && <div className="shrink-0 mt-1"><ProceduralAvatar agent={agent} size={28} /></div>}
      <div className={`max-w-[75%] px-4 py-3 text-sm leading-relaxed ${isUser ? 'msg-user' : 'msg-bot'}`}>
        {msg.content}
        {msg.streaming && <span className="inline-block w-1 h-3.5 bg-accent ml-0.5 animate-pulse-soft rounded-full" />}
      </div>
    </motion.div>
  )
}

export default function Arena() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { agents, getAgent } = useAgents()
  const [selectedId, setSelectedId] = useState(id || agents[0]?.id)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [showSelect, setShowSelect] = useState(false)
  const messagesEnd = useRef(null)

  const agent = getAgent(selectedId) || agents[0]
  useEffect(() => { if (id) setSelectedId(id) }, [id])
  useEffect(() => { messagesEnd.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const send = useCallback(async () => {
    const text = input.trim()
    if (!text || isStreaming || !agent) return
    const key = getStoredKey()
    if (!key) { alert('Set your MiMo API key in Settings first'); return }
    setInput('')
    const userMsg = { role: 'user', content: text }
    const botMsg = { role: 'assistant', content: '', streaming: true }
    setMessages(prev => [...prev, userMsg, botMsg])
    setIsStreaming(true)
    try {
      let full = ''
      for await (const chunk of streamChat([...messages, userMsg].map(m => ({ role: m.role, content: m.content })), { apiKey: key, systemPrompt: agent.systemPrompt || `You are ${agent.name}. ${agent.personality}`, temperature: 0.7 })) {
        full += chunk
        setMessages(prev => { const u = [...prev]; u[u.length - 1] = { ...u[u.length - 1], content: full }; return u })
      }
      setMessages(prev => { const u = [...prev]; u[u.length - 1] = { ...u[u.length - 1], streaming: false }; return u })
    } catch (e) {
      setMessages(prev => { const u = [...prev]; u[u.length - 1] = { role: 'assistant', content: `Error: ${e.message}`, streaming: false }; return u })
    }
    setIsStreaming(false)
  }, [input, isStreaming, agent, messages])

  if (!agent) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mx-auto mb-4 text-xl">🤖</div>
          <p className="text-sm text-text-muted mb-3">No agents available</p>
          <button onClick={() => navigate('/builder')} className="text-accent-bright text-xs hover:underline">Create one →</button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 px-6 py-3.5 border-b border-white/[0.04] shrink-0 bg-bg/60 backdrop-blur-xl">
        <button onClick={() => navigate('/gallery')} className="p-2 rounded-xl hover:bg-white/[0.03] text-text-muted hover:text-text transition-colors"><ArrowLeft size={17} /></button>
        <div className="relative">
          <button onClick={() => setShowSelect(!showSelect)} className="flex items-center gap-3 hover:bg-white/[0.03] px-3 py-2 rounded-xl transition-colors">
            <ProceduralAvatar agent={agent} size={26} />
            <div className="text-left">
              <div className="text-sm font-medium">{agent.name}</div>
              <div className="text-[10px] text-text-dim">{agent.traits?.join(' · ')}</div>
            </div>
            <ChevronDown size={13} className="text-text-dim ml-0.5" />
          </button>
          <AnimatePresence>
            {showSelect && (
              <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="absolute top-full left-0 mt-1 w-64 glass rounded-xl p-1.5 z-50 max-h-60 overflow-auto shadow-xl">
                {agents.map(a => (
                  <button key={a.id} onClick={() => { setSelectedId(a.id); setShowSelect(false); setMessages([]) }} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${a.id === selectedId ? 'bg-accent/[0.08]' : 'hover:bg-white/[0.03]'}`}>
                    <ProceduralAvatar agent={a} size={22} />
                    <div><div className="text-[11px] font-medium">{a.name}</div><div className="text-[10px] text-text-dim truncate max-w-[160px]">{a.personality}</div></div>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="flex-1" />
        <button onClick={() => setMessages([])} className="p-2 rounded-xl hover:bg-white/[0.03] text-text-dim hover:text-text-muted transition-colors"><RotateCcw size={15} /></button>
      </div>

      {/* Messages — centered container */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-3xl mx-auto px-6 py-6 space-y-4">
          {messages.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-32 text-center">
              <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
                <div className="w-20 h-20 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-center glow-sm">
                  <ProceduralAvatar agent={agent} size={56} />
                </div>
              </motion.div>
              <h3 className="text-lg font-semibold mt-5">{agent.name}</h3>
              <p className="text-xs text-text-dim mt-1.5 max-w-xs leading-relaxed">{agent.personality}</p>
              <p className="text-[11px] text-text-dim/60 mt-6">Start a conversation below</p>
            </motion.div>
          )}
          {messages.map((msg, i) => <Message key={i} msg={msg} agent={agent} />)}
          <div ref={messagesEnd} />
        </div>
      </div>

      {/* Input — centered */}
      <div className="px-6 py-4 border-t border-white/[0.04] shrink-0 bg-bg/60 backdrop-blur-xl">
        <div className="flex gap-3 items-end max-w-3xl mx-auto">
          <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }} placeholder={`Message ${agent.name}...`} rows={1} className="flex-1 input-field resize-none" style={{ maxHeight: 120 }} />
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={send} disabled={isStreaming || !input.trim()} className="p-3 rounded-xl bg-accent hover:bg-accent/80 disabled:opacity-30 transition-all glow-sm"><Send size={16} /></motion.button>
        </div>
      </div>
    </div>
  )
}
