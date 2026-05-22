import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Plus, Play, RotateCcw, Users, Pause } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAgents } from '../lib/agents'
import { streamChat, getStoredKey } from '../lib/mimo'
import ProceduralAvatar from '../components/ProceduralAvatar'

export default function MultiChat() {
  const navigate = useNavigate()
  const { agents } = useAgents()
  const [participants, setParticipants] = useState(agents.slice(0, 2).map(a => a.id))
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [autoMode, setAutoMode] = useState(false)
  const endRef = useRef(null)

  const pAgents = participants.map(id => agents.find(a => a.id === id)).filter(Boolean)
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])
  const toggleParticipant = (id) => setParticipants(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])

  const getNext = useCallback((msgs) => pAgents.length ? pAgents[msgs.length % pAgents.length] : null, [pAgents])

  const generateNext = useCallback(async () => {
    if (isRunning || pAgents.length < 2) return
    const key = getStoredKey()
    if (!key) { alert('Set your MiMo API key in Settings first'); return }
    setIsRunning(true)
    const next = getNext(messages)
    if (!next) { setIsRunning(false); return }
    const others = pAgents.filter(a => a.id !== next.id).map(a => a.name).join(', ')
    const sys = `${next.systemPrompt || `You are ${next.name}. ${next.personality}`}\n\nGroup chat with: ${others}. Respond naturally, 1-3 sentences.`
    const recent = messages.slice(-10).map(m => ({ role: m.role, content: `${m.agentName}: ${m.content}` }))
    if (!recent.length) recent.push({ role: 'user', content: 'Introduce yourself briefly.' })
    const botMsg = { role: 'assistant', content: '', agentName: next.name, agent: next, streaming: true }
    setMessages(p => [...p, botMsg])
    try {
      let full = ''
      for await (const chunk of streamChat(recent, { apiKey: key, systemPrompt: sys, temperature: 0.8 })) { full += chunk; setMessages(p => { const u = [...p]; u[u.length - 1] = { ...u[u.length - 1], content: full }; return u }) }
      setMessages(p => { const u = [...p]; u[u.length - 1] = { ...u[u.length - 1], streaming: false }; return u })
    } catch (e) { setMessages(p => [...p.slice(0, -1), { role: 'system', content: `Error: ${e.message}`, agentName: 'System' }]) }
    setIsRunning(false)
  }, [isRunning, pAgents, messages, getNext])

  useEffect(() => {
    if (!autoMode || isRunning) return
    if (!messages.length || !messages[messages.length - 1]?.streaming) { const t = setTimeout(generateNext, 1500); return () => clearTimeout(t) }
  }, [autoMode, isRunning, messages, generateNext])

  const sendAsUser = () => {
    const text = input.trim()
    if (!text || isRunning) return
    setInput('')
    setMessages(p => [...p, { role: 'user', content: text, agentName: 'You' }])
    setTimeout(generateNext, 500)
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-3 border-b border-border shrink-0 bg-bg/80 backdrop-blur-xl sticky top-0 z-10">
        <div className="w-8 h-8 rounded-[8px] bg-accent-muted border border-accent/10 flex items-center justify-center">
          <Users size={14} className="text-accent-bright" />
        </div>
        <div>
          <h1 className="text-[13px] font-semibold">Multi-Agent Chat</h1>
          <p className="text-[10px] text-text-dim">{participants.length} agents</p>
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-1.5">
          {pAgents.map(a => (
            <button key={a.id} onClick={() => toggleParticipant(a.id)} className="rounded-full p-0.5 ring-1 ring-accent/20 hover:ring-accent/40 transition-all">
              <ProceduralAvatar agent={a} size={26} />
            </button>
          ))}
          {pAgents.length < agents.length && (
            <div className="relative group">
              <button className="w-7 h-7 rounded-full border border-dashed border-border flex items-center justify-center text-text-dim hover:text-text-secondary transition-colors"><Plus size={10} /></button>
              <div className="absolute right-0 top-full mt-1 w-44 card p-1.5 hidden group-hover:block z-50 shadow-xl">
                {agents.filter(a => !participants.includes(a.id)).map(a => (
                  <button key={a.id} onClick={() => toggleParticipant(a.id)} className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-white/[0.03] text-[11px]">
                    <ProceduralAvatar agent={a} size={16} /> {a.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="flex gap-1.5 ml-2">
          <button onClick={() => { setAutoMode(!autoMode); if (!autoMode && !messages.length) generateNext() }} className={`btn btn-sm ${autoMode ? 'bg-accent-muted text-accent-bright border border-accent/20' : 'btn-secondary'}`}>
            {autoMode ? <Pause size={10} /> : <Play size={10} />} {autoMode ? 'Auto' : 'Manual'}
          </button>
          <button onClick={() => setMessages([])} className="btn btn-secondary btn-sm px-2"><RotateCcw size={11} /></button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-2xl mx-auto px-6 py-6 space-y-3">
          {!messages.length && (
            <div className="text-center py-32">
              <div className="flex justify-center gap-2 mb-4">
                {pAgents.map((a, i) => (
                  <motion.div key={a.id} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}>
                    <div className="w-11 h-11 rounded-[10px] bg-bg-card border border-border flex items-center justify-center">
                      <ProceduralAvatar agent={a} size={28} />
                    </div>
                  </motion.div>
                ))}
              </div>
              <p className="body-sm">{pAgents.length < 2 ? 'Add at least 2 agents to start' : 'Press Play or type a message'}</p>
            </div>
          )}
          {messages.map((msg, i) => {
            const isUser = msg.role === 'user'
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-2.5 ${isUser ? 'justify-end' : ''}`}>
                {!isUser && msg.agent && <div className="shrink-0 mt-0.5"><ProceduralAvatar agent={msg.agent} size={20} /></div>}
                <div className={`max-w-[70%] ${isUser ? 'text-right' : ''}`}>
                  {!isUser && <span className="text-[10px] text-text-dim block mb-0.5 ml-1">{msg.agentName}</span>}
                  <div className={`px-3.5 py-2.5 text-[13px] leading-relaxed ${isUser ? 'msg-user' : 'msg-bot'}`}>
                    {msg.content}
                    {msg.streaming && <span className="inline-block w-1 h-3 bg-accent ml-0.5 animate-pulse-soft rounded-full" />}
                  </div>
                </div>
              </motion.div>
            )
          })}
          <div ref={endRef} />
        </div>
      </div>

      {/* Input */}
      <div className="px-6 py-3 border-t border-border shrink-0 bg-bg/80 backdrop-blur-xl">
        <div className="flex gap-2.5 items-end max-w-2xl mx-auto">
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') sendAsUser() }} placeholder="Join the conversation..." className="flex-1 input" />
          <button onClick={sendAsUser} disabled={isRunning || !input.trim()} className="btn btn-primary px-3 disabled:opacity-30"><Send size={15} /></button>
        </div>
      </div>
    </div>
  )
}
