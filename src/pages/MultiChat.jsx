import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Plus, X, Play, RotateCcw, Users, Zap } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAgents } from '../lib/agents'
import { streamChat, getStoredKey } from '../lib/mimo'
import ProceduralAvatar from '../components/ProceduralAvatar'

function AgentBubble({ agent, active, onClick }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`relative p-1 rounded-full transition-all ${
        active ? 'ring-2 ring-accent' : 'ring-1 ring-border hover:ring-border-hover'
      }`}
    >
      <ProceduralAvatar agent={agent} size={36} />
      {active && (
        <motion.div
          layoutId="active-ring"
          className="absolute inset-0 rounded-full ring-2 ring-accent"
        />
      )}
    </motion.button>
  )
}

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

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const toggleParticipant = (id) => {
    setParticipants(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  const getAgentForMessage = useCallback((messages) => {
    if (participantAgents.length === 0) return null
    // Rotate based on message count
    const lastAgentIdx = messages.length % participantAgents.length
    return participantAgents[lastAgentIdx]
  }, [participantAgents])

  const generateNext = useCallback(async () => {
    if (isRunning || participantAgents.length < 2) return
    const key = getStoredKey()
    if (!key) {
      alert('Please set your MiMo API key in Settings first')
      return
    }

    setIsRunning(true)
    const nextAgent = getAgentForMessage(messages)
    if (!nextAgent) { setIsRunning(false); return }

    const otherNames = participantAgents.filter(a => a.id !== nextAgent.id).map(a => a.name).join(', ')
    const systemPrompt = `${nextAgent.systemPrompt || `You are ${nextAgent.name}. ${nextAgent.personality}`}\n\nYou are in a group conversation with: ${otherNames}. Respond naturally. Keep responses concise (1-3 sentences). Don't repeat what others said.`

    const recentMsgs = messages.slice(-10).map(m => ({ role: m.role, content: `${m.agentName}: ${m.content}` }))
    if (recentMsgs.length === 0) {
      recentMsgs.push({ role: 'user', content: `Introduce yourself briefly to the group.` })
    }

    const botMsg = { role: 'assistant', content: '', agentName: nextAgent.name, agent: nextAgent, streaming: true }
    setMessages(prev => [...prev, botMsg])

    try {
      let full = ''
      for await (const chunk of streamChat(recentMsgs, { apiKey: key, systemPrompt, temperature: 0.8 })) {
        full += chunk
        setMessages(prev => {
          const updated = [...prev]
          updated[updated.length - 1] = { ...updated[updated.length - 1], content: full }
          return updated
        })
      }
      setMessages(prev => {
        const updated = [...prev]
        updated[updated.length - 1] = { ...updated[updated.length - 1], streaming: false }
        return updated
      })
    } catch (e) {
      setMessages(prev => [...prev.slice(0, -1), {
        role: 'system', content: `Error: ${e.message}`, agentName: 'System'
      }])
    }
    setIsRunning(false)
  }, [isRunning, participantAgents, messages, getAgentForMessage])

  // Auto mode
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
    // Then trigger next agent
    setTimeout(generateNext, 500)
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="flex items-center gap-4 px-6 py-4 border-b border-border shrink-0">
        <Users size={18} className="text-accent" />
        <div>
          <h1 className="text-sm font-semibold">Multi-Agent Chat</h1>
          <p className="text-[10px] text-text-dim">{participants.length} agents in conversation</p>
        </div>

        <div className="flex-1" />

        {/* Participants */}
        <div className="flex items-center gap-2">
          {participantAgents.map(a => (
            <AgentBubble key={a.id} agent={a} active onClick={() => toggleParticipant(a.id)} />
          ))}
          {participantAgents.length < agents.length && (
            <div className="relative group">
              <button className="w-9 h-9 rounded-full border border-dashed border-border flex items-center justify-center text-text-dim hover:text-text hover:border-border-hover transition-colors">
                <Plus size={12} />
              </button>
              <div className="absolute right-0 top-full mt-1 w-48 glass rounded-xl p-2 hidden group-hover:block z-50">
                {agents.filter(a => !participants.includes(a.id)).map(a => (
                  <button
                    key={a.id}
                    onClick={() => toggleParticipant(a.id)}
                    className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/5 text-xs"
                  >
                    <ProceduralAvatar agent={a} size={20} />
                    {a.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex gap-2 ml-4">
          <button
            onClick={() => { setAutoMode(!autoMode); if (!autoMode && messages.length === 0) generateNext() }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs transition-all ${
              autoMode ? 'bg-accent/20 text-accent glow' : 'glass text-text-muted hover:text-text'
            }`}
          >
            {autoMode ? <Zap size={12} /> : <Play size={12} />}
            {autoMode ? 'Auto' : 'Manual'}
          </button>
          <button
            onClick={() => setMessages([])}
            className="p-2 rounded-xl glass text-text-muted hover:text-text transition-colors"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto px-6 py-6 space-y-4">
        {messages.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <div className="flex justify-center gap-2 mb-4">
              {participantAgents.map((a, i) => (
                <motion.div
                  key={a.id}
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                >
                  <ProceduralAvatar agent={a} size={48} />
                </motion.div>
              ))}
            </div>
            <p className="text-text-muted text-sm">
              {participantAgents.length < 2
                ? 'Add at least 2 agents to start'
                : 'Press Play or type a message to begin'}
            </p>
          </motion.div>
        )}

        {messages.map((msg, i) => {
          const isUser = msg.role === 'user'
          const isSystem = msg.role === 'system'
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${isUser ? 'justify-end' : ''}`}
            >
              {!isUser && msg.agent && (
                <div className="shrink-0 mt-1">
                  <ProceduralAvatar agent={msg.agent} size={28} />
                </div>
              )}
              <div className={`max-w-[70%] ${isUser ? 'text-right' : ''}`}>
                {!isUser && (
                  <span className="text-[10px] text-text-dim block mb-1">{msg.agentName}</span>
                )}
                <div className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  isUser ? 'bg-accent/15 rounded-br-md' : isSystem ? 'bg-warning/10 rounded-bl-md' : 'glass rounded-bl-md'
                }`}>
                  {msg.content}
                  {msg.streaming && <span className="inline-block w-1.5 h-3.5 bg-accent ml-0.5 animate-pulse" />}
                </div>
              </div>
            </motion.div>
          )
        })}
        <div ref={messagesEnd} />
      </div>

      {/* Input */}
      <div className="px-6 py-4 border-t border-border shrink-0">
        <div className="flex gap-3 items-end max-w-3xl mx-auto">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') sendAsUser() }}
            placeholder="Join the conversation..."
            className="flex-1 bg-bg-card border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={sendAsUser}
            disabled={isRunning || !input.trim()}
            className="p-3 rounded-xl bg-accent hover:bg-accent/80 disabled:opacity-40 transition-colors"
          >
            <Send size={16} />
          </motion.button>
        </div>
      </div>
    </div>
  )
}
