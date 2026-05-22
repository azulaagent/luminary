import { useState, useRef, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, ArrowLeft, RotateCcw, Settings2, ChevronDown } from 'lucide-react'
import { useAgents } from '../lib/agents'
import { streamChat, getStoredKey } from '../lib/mimo'
import ProceduralAvatar from '../components/ProceduralAvatar'

function Message({ msg, agent }) {
  const isUser = msg.role === 'user'
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      {!isUser && (
        <div className="shrink-0 mt-1">
          <ProceduralAvatar agent={agent} size={32} />
        </div>
      )}
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isUser
            ? 'bg-accent/15 text-text rounded-br-md'
            : 'glass rounded-bl-md'
        }`}
      >
        {msg.content}
        {msg.streaming && (
          <span className="inline-block w-1.5 h-3.5 bg-accent ml-0.5 animate-pulse" />
        )}
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
  const inputRef = useRef(null)

  const agent = getAgent(selectedId) || agents[0]

  useEffect(() => {
    if (id) setSelectedId(id)
  }, [id])

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = useCallback(async () => {
    const text = input.trim()
    if (!text || isStreaming || !agent) return

    const key = getStoredKey()
    if (!key) {
      alert('Please set your MiMo API key in Settings first')
      return
    }

    setInput('')
    const userMsg = { role: 'user', content: text }
    const botMsg = { role: 'assistant', content: '', streaming: true }
    setMessages(prev => [...prev, userMsg, botMsg])
    setIsStreaming(true)

    try {
      const allMessages = [...messages, userMsg].map(m => ({ role: m.role, content: m.content }))
      let full = ''
      for await (const chunk of streamChat(allMessages, {
        apiKey: key,
        systemPrompt: agent.systemPrompt || `You are ${agent.name}. ${agent.personality}`,
        temperature: 0.7
      })) {
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
      setMessages(prev => {
        const updated = [...prev]
        updated[updated.length - 1] = {
          role: 'assistant',
          content: `Error: ${e.message}`,
          streaming: false
        }
        return updated
      })
    }
    setIsStreaming(false)
  }, [input, isStreaming, agent, messages])

  if (!agent) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-text-muted mb-4">No agents available</p>
          <button onClick={() => navigate('/builder')} className="text-accent text-sm hover:underline">
            Create one →
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="flex items-center gap-4 px-6 py-4 border-b border-border shrink-0">
        <button onClick={() => navigate('/gallery')} className="text-text-muted hover:text-text transition-colors">
          <ArrowLeft size={18} />
        </button>

        {/* Agent selector */}
        <div className="relative">
          <button
            onClick={() => setShowSelect(!showSelect)}
            className="flex items-center gap-3 hover:bg-white/5 px-3 py-2 rounded-xl transition-colors"
          >
            <ProceduralAvatar agent={agent} size={28} />
            <div className="text-left">
              <div className="text-sm font-medium">{agent.name}</div>
              <div className="text-[10px] text-text-dim">{agent.traits?.join(' · ')}</div>
            </div>
            <ChevronDown size={14} className="text-text-dim ml-1" />
          </button>

          <AnimatePresence>
            {showSelect && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="absolute top-full left-0 mt-1 w-64 glass rounded-xl p-2 z-50 max-h-60 overflow-auto"
              >
                {agents.map(a => (
                  <button
                    key={a.id}
                    onClick={() => { setSelectedId(a.id); setShowSelect(false); setMessages([]) }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      a.id === selectedId ? 'bg-accent/10' : 'hover:bg-white/5'
                    }`}
                  >
                    <ProceduralAvatar agent={a} size={24} />
                    <div>
                      <div className="text-xs font-medium">{a.name}</div>
                      <div className="text-[10px] text-text-dim truncate max-w-[160px]">{a.personality}</div>
                    </div>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex-1" />

        <button
          onClick={() => setMessages([])}
          className="p-2 rounded-xl hover:bg-white/5 text-text-muted hover:text-text transition-colors"
          title="Clear chat"
        >
          <RotateCcw size={16} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto px-6 py-6 space-y-4">
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-full text-center"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <ProceduralAvatar agent={agent} size={80} />
            </motion.div>
            <h3 className="text-lg font-semibold mt-4">{agent.name}</h3>
            <p className="text-sm text-text-muted mt-1 max-w-xs">{agent.personality}</p>
            <p className="text-xs text-text-dim mt-4">Start a conversation below</p>
          </motion.div>
        )}

        {messages.map((msg, i) => (
          <Message key={i} msg={msg} agent={agent} />
        ))}
        <div ref={messagesEnd} />
      </div>

      {/* Input */}
      <div className="px-6 py-4 border-t border-border shrink-0">
        <div className="flex gap-3 items-end max-w-3xl mx-auto">
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
            placeholder={`Message ${agent.name}...`}
            rows={1}
            className="flex-1 bg-bg-card border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors resize-none"
            style={{ maxHeight: 120 }}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={send}
            disabled={isStreaming || !input.trim()}
            className="p-3 rounded-xl bg-accent hover:bg-accent/80 disabled:opacity-40 transition-colors"
          >
            <Send size={16} />
          </motion.button>
        </div>
      </div>
    </div>
  )
}
