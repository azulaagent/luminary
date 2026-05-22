import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Plus, Play, RotateCcw, Users, Zap, Pause } from 'lucide-react'
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
  const messagesEnd = useRef(null)

  const participantAgents = participants.map(id => agents.find(a => a.id === id)).filter(Boolean)

  useEffect(() => { messagesEnd.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const toggleParticipant = (id) => {
    setParticipants(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  const getAgentForMessage = useCallback((msgs) => {
    if (participantAgents.length === 0) return null
    return participantAgents[msgs.length % participantAgents.length]
  }, [participantAgents])

  const generateNext = useCallback(async () => {
    if (isRunning || participantAgents.length < 2) return
    const key = getStoredKey()
    if (!key) { alert('Set your MiMo API key in Settings first'); return }

    setIsRunning(true)
    const nextAgent = getAgentForMessage(messages)
    if (!nextAgent) { setIsRunning(false); return }

    const otherNames = participantAgents.filter(a => a.id !== nextAgent.id).map(a => a.name).join(', ')
    const systemPrompt = `${nextAgent.systemPrompt || `You are ${nextAgent.name}. ${nextAgent.personality}`}\n\nYou are in a group conversation with: ${otherNames}. Respond naturally. Keep responses concise (1-3 sentences).`

    const recentMsgs = messages.slice(-10).map(m => ({ role: m.role, content: `${m.agentName}: ${m.content}` }))
    if (recentMsgs.length === 0) recentMsgs.push({ role: 'user', content: 'Introduce yourself briefly to the group.' })

    const botMsg = { role: 'assistant', content: '', agentName: nextAgent.name, agent: nextAgent, streaming: true }
    setMessages(prev => [...prev, botMsg])

    try {
      let full = ''
      for await (const chunk of streamChat(recentMsgs, { apiKey: key, systemPrompt, temperature: 0.8 })) {
        full += chunk
        setMessages(prev => { const u = [...prev]; u[u.length - 1] = { ...u[u.length - 1], content: full }; return u })
      }
      setMessages(prev => { const u = [...prev]; u[u.length - 1] = { ...u[u.length - 1], streaming: false }; return u })
    } catch (e) {
      setMessages(prev => [...prev.slice(0, -1), { role: 'system', content: `Error: ${e.message}`, agentName: 'System' }])
    }
    setIsRunning(false)
  }, [isRunning, participantAgents, messages, getAgentForMessage])

  useEffect(() => {
    if (!autoMode || isRunning) return
    if (messages.length === 0 || !messages[messages.length - 1]?.streaming) {
      const timer = setTimeout(generateNext, 1500)
      return () => clearTimeout(timer)
    }
  }, [autoMode, isRunning, messages, generateNext])

  const sendAsUser = async () => {
    const text = input.trim()
    if (!text || isRunning) return
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: text, agentName: 'You' }])
    setTimeout(generateNext, 500)
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="flex items-center gap-4 px-6 py-3.5 border-b border-white/[0.04] shrink-0 bg-bg/60 backdrop-blur-xl">
        <div className="w-9 h-9 rounded-xl bg-accent/[0.08] border border-accent/10 flex items-center justify-center">
          <Users size={16} className="text-accent-bright" />
        </div>
        <div>
          <h1 className="text-sm font-semibold">Multi-Agent Chat</h1>
          <p className="text-[10px] text-text-dim">{participants.length} agents in conversation</p>
        </div>

        <div className="flex-1" />

        {/* Participants */}
        <div className="flex items-center gap-2">
          {participantAgents.map(a => (
            <motion.button
              key={a.id}
              whileHover={{ scale: 1.08 }}
              onClick={() => toggleParticipant(a.id)}
              className="relative ring-2 ring-accent/30 rounded-full p-0.5 hover:ring-accent/60 transition-all"
            >
              <ProceduralAvatar agent={a} size={32} />
            </motion.button>
          ))}
          {participantAgents.length < agents.length && (
            <div className="relative group">
              <button className="w-9 h-9 rounded-full border border-dashed border-white/[0.08] flex items-center justify-center text-text-dim hover:text-text-muted hover:border-white/[0.15] transition-colors">
                <Plus size={12} />
              </button>
              <div className="absolute right-0 top-full mt-1 w-48 glass rounded-xl p-1.5 hidden group-hover:block z-50 shadow-xl">
                {agents.filter(a => !participants.includes(a.id)).map(a => (
                  <button key={a.id} onClick={() => toggleParticipant(a.id)} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/[0.03] text-[11px]">
                    <ProceduralAvatar agent={a} size={18} />
                    {a.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex gap-2 ml-3">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => { setAutoMode(!autoMode); if (!autoMode && messages.length === 0) generateNext() }}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[11px] font-medium transition-all ${
              autoMode
                ? 'bg-accent/15 text-accent-bright border border-accent/20 glow-sm'
                : 'bg-white/[0.03] border border-white/[0.06] text-text-muted hover:text-text hover:border-white/[0.1]'
            }`}
          >
            {autoMode ? <Pause size={11} /> : <Play size={11} />}
            {autoMode ? 'Auto' : 'Manual'}
          </motion.button>
          <button onClick={() => setMessages([])} className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-text-dim hover:text-text-muted transition-colors">
            <RotateCcw size={13} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto px-6 py-6 space-y-4">
        {messages.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
            <div className="flex justify-center gap-3 mb-5">
              {participantAgents.map((a, i) => (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.15, type: 'spring' }}
                >
                  <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 3, repeat: Infinity, delay: i * 0.4 }}>
                    <div className="w-14 h-14 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-center">
                      <ProceduralAvatar agent={a} size={40} />
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
            <p className="text-sm text-text-muted">
              {participantAgents.length < 2 ? 'Add at least 2 agents to start' : 'Press Play or type a message to begin'}
            </p>
          </motion.div>
        )}

        {messages.map((msg, i) => {
          const isUser = msg.role === 'user'
          const isSystem = msg.role === 'system'
          return (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-3 ${isUser ? 'justify-end' : ''}`}>
              {!isUser && msg.agent && (
                <div className="shrink-0 mt-1"><ProceduralAvatar agent={msg.agent} size={24} /></div>
              )}
              <div className={`max-w-[70%] ${isUser ? 'text-right' : ''}`}>
                {!isUser && <span className="text-[10px] text-text-dim block mb-1 ml-1">{msg.agentName}</span>}
                <div className={`px-4 py-2.5 text-sm leading-relaxed ${isUser ? 'msg-user' : isSystem ? 'bg-warning/[0.06] border border-warning/10 rounded-2xl rounded-bl-md' : 'msg-bot'}`}>
                  {msg.content}
                  {msg.streaming && <span className="inline-block w-1 h-3.5 bg-accent ml-0.5 animate-pulse-soft rounded-full" />}
                </div>
              </div>
            </motion.div>
          )
        })}
        <div ref={messagesEnd} />
      </div>

      {/* Input */}
      <div className="px-6 py-4 border-t border-white/[0.04] shrink-0 bg-bg/60 backdrop-blur-xl">
        <div className="flex gap-3 items-end max-w-3xl mx-auto">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') sendAsUser() }}
            placeholder="Join the conversation..."
            className="flex-1 input-field py-3"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={sendAsUser}
            disabled={isRunning || !input.trim()}
            className="p-3 rounded-xl bg-accent hover:bg-accent/80 disabled:opacity-30 transition-all glow-sm"
          >
            <Send size={16} />
          </motion.button>
        </div>
      </div>
    </div>
  )
}
