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
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-2.5 ${isUser ? 'flex-row-reverse' : ''}`}>
      {!isUser && <div className="shrink-0 mt-0.5"><ProceduralAvatar agent={agent} size={24} /></div>}
      <div className={`max-w-[75%] px-3.5 py-2.5 text-[13px] leading-relaxed ${isUser ? 'msg-user' : 'msg-bot'}`}>
        {msg.content}
        {msg.streaming && <span className="inline-block w-1 h-3 bg-accent ml-0.5 animate-pulse-soft rounded-full" />}
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
  const endRef = useRef(null)

  const agent = getAgent(selectedId) || agents[0]
  useEffect(() => { if (id) setSelectedId(id) }, [id])
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const send = useCallback(async () => {
    const text = input.trim()
    if (!text || isStreaming || !agent) return
    const key = getStoredKey()
    if (!key) { alert('Set your MiMo API key in Settings first'); return }
    setInput('')
    const userMsg = { role: 'user', content: text }
    const botMsg = { role: 'assistant', content: '', streaming: true }
    setMessages(p => [...p, userMsg, botMsg])
    setIsStreaming(true)
    try {
      let full = ''
      for await (const chunk of streamChat([...messages, userMsg].map(m => ({ role: m.role, content: m.content })), { apiKey: key, systemPrompt: agent.systemPrompt || `You are ${agent.name}. ${agent.personality}`, temperature: 0.7 })) {
        full += chunk
        setMessages(p => { const u = [...p]; u[u.length - 1] = { ...u[u.length - 1], content: full }; return u })
      }
      setMessages(p => { const u = [...p]; u[u.length - 1] = { ...u[u.length - 1], streaming: false }; return u })
    } catch (e) { setMessages(p => { const u = [...p]; u[u.length - 1] = { role: 'assistant', content: `Error: ${e.message}`, streaming: false }; return u }) }
    setIsStreaming(false)
  }, [input, isStreaming, agent, messages])

  if (!agent) return (
    <div className="flex-1 flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="w-12 h-12 rounded-[10px] bg-bg-card border border-border flex items-center justify-center mx-auto mb-3 text-lg">🤖</div>
        <p className="body-md mb-3">No agents available</p>
        <button onClick={() => navigate('/builder')} className="text-accent-bright text-xs hover:underline">Create one →</button>
      </div>
    </div>
  )

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-3 border-b border-border shrink-0 bg-bg/80 backdrop-blur-xl sticky top-0 z-10">
        <button onClick={() => navigate('/gallery')} className="btn btn-ghost btn-sm px-2"><ArrowLeft size={16} /></button>
        <div className="relative">
          <button onClick={() => setShowSelect(!showSelect)} className="flex items-center gap-2.5 hover:bg-white/[0.03] px-2.5 py-1.5 rounded-lg transition-colors">
            <ProceduralAvatar agent={agent} size={22} />
            <div className="text-left">
              <div className="text-[13px] font-medium">{agent.name}</div>
              <div className="text-[10px] text-text-dim">{agent.traits?.join(' · ')}</div>
            </div>
            <ChevronDown size={12} className="text-text-dim" />
          </button>
          <AnimatePresence>
            {showSelect && (
              <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="absolute top-full left-0 mt-1 w-56 card p-1.5 z-50 max-h-56 overflow-auto shadow-xl">
                {agents.map(a => (
                  <button key={a.id} onClick={() => { setSelectedId(a.id); setShowSelect(false); setMessages([]) }} className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-colors text-[12px] ${a.id === selectedId ? 'bg-accent-muted' : 'hover:bg-white/[0.03]'}`}>
                    <ProceduralAvatar agent={a} size={18} /> {a.name}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="flex-1" />
        <button onClick={() => setMessages([])} className="btn btn-ghost btn-sm px-2"><RotateCcw size={14} /></button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-2xl mx-auto px-6 py-6 space-y-3">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <div className="w-16 h-16 rounded-[12px] bg-bg-card border border-border flex items-center justify-center mb-4">
                <ProceduralAvatar agent={agent} size={44} />
              </div>
              <h3 className="heading-md">{agent.name}</h3>
              <p className="body-sm mt-1 max-w-xs">{agent.personality}</p>
              <p className="text-[11px] text-text-dim mt-4">Start a conversation below</p>
            </div>
          )}
          {messages.map((msg, i) => <Message key={i} msg={msg} agent={agent} />)}
          <div ref={endRef} />
        </div>
      </div>

      {/* Input */}
      <div className="px-6 py-3 border-t border-border shrink-0 bg-bg/80 backdrop-blur-xl">
        <div className="flex gap-2.5 items-end max-w-2xl mx-auto">
          <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }} placeholder={`Message ${agent.name}...`} rows={1} className="flex-1 input resize-none" style={{ maxHeight: 100 }} />
          <button onClick={send} disabled={isStreaming || !input.trim()} className="btn btn-primary px-3 disabled:opacity-30"><Send size={15} /></button>
        </div>
      </div>
    </div>
  )
}
