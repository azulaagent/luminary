import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'luminary_agents'

const PRESETS = [
  {
    id: 'preset-sage',
    name: 'Sage',
    personality: 'Wise, thoughtful, speaks in metaphors. Loves philosophy and deep questions.',
    traits: ['wise', 'philosophical', 'patient'],
    color: '#6366f1',
    systemPrompt: 'You are Sage, a wise and philosophical AI agent. You speak thoughtfully, often using metaphors and analogies. You find profound meaning in simple things.',
    tools: ['knowledge', 'reasoning'],
    isPreset: true
  },
  {
    id: 'preset-spark',
    name: 'Spark',
    personality: 'Energetic, creative, fast-thinking. Generates ideas at lightning speed.',
    traits: ['creative', 'energetic', 'innovative'],
    color: '#f59e0b',
    systemPrompt: 'You are Spark, a hyper-creative AI agent. You think fast, generate ideas rapidly, and see connections others miss. You speak with excitement and use short, punchy sentences.',
    tools: ['creativity', 'brainstorm'],
    isPreset: true
  },
  {
    id: 'preset-cipher',
    name: 'Cipher',
    personality: 'Analytical, precise, data-driven. Excels at code and problem-solving.',
    traits: ['analytical', 'precise', 'technical'],
    color: '#10b981',
    systemPrompt: 'You are Cipher, a technical AI agent specialized in code, data analysis, and problem-solving. You are precise, logical, and always back claims with evidence.',
    tools: ['code', 'analysis'],
    isPreset: true
  },
  {
    id: 'preset-nova',
    name: 'Nova',
    personality: 'Bold, strategic, leadership-oriented. Makes decisions with confidence.',
    traits: ['strategic', 'bold', 'decisive'],
    color: '#ef4444',
    systemPrompt: 'You are Nova, a strategic AI agent with leadership qualities. You are decisive, confident, and always think several steps ahead. You give direct, actionable advice.',
    tools: ['strategy', 'planning'],
    isPreset: true
  }
]

function loadAgents() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return [...PRESETS]
}

function saveAgents(agents) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(agents))
}

export function useAgents() {
  const [agents, setAgents] = useState(loadAgents)

  useEffect(() => {
    saveAgents(agents)
  }, [agents])

  const addAgent = useCallback((agent) => {
    const newAgent = {
      ...agent,
      id: `agent-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      createdAt: Date.now()
    }
    setAgents(prev => [...prev, newAgent])
    return newAgent
  }, [])

  const updateAgent = useCallback((id, updates) => {
    setAgents(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a))
  }, [])

  const deleteAgent = useCallback((id) => {
    setAgents(prev => prev.filter(a => a.id !== id))
  }, [])

  const getAgent = useCallback((id) => {
    return agents.find(a => a.id === id)
  }, [agents])

  const resetToPresets = useCallback(() => {
    setAgents([...PRESETS])
  }, [])

  return { agents, addAgent, updateAgent, deleteAgent, getAgent, resetToPresets, presets: PRESETS }
}

export { PRESETS }
