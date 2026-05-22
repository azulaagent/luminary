import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, Hammer, LayoutGrid, Zap, MessageSquare, Settings, X } from 'lucide-react'
import { useState } from 'react'
import { getStoredKey, setStoredKey } from '../lib/mimo'

const NAV = [
  { to: '/', icon: Bot, label: 'Home' },
  { to: '/builder', icon: Hammer, label: 'Builder' },
  { to: '/gallery', icon: LayoutGrid, label: 'Gallery' },
  { to: '/arena', icon: Zap, label: 'Arena' },
  { to: '/multi-chat', icon: MessageSquare, label: 'Multi Chat' },
]

function ApiKeyModal({ onClose }) {
  const [key, setKey] = useState(getStoredKey())
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="glass gradient-border rounded-2xl p-7 w-full max-w-md mx-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-semibold">API Configuration</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/5 text-text-muted hover:text-text transition-colors">
            <X size={16} />
          </button>
        </div>
        <p className="text-xs text-text-muted mb-4 leading-relaxed">
          Connect your MiMo API key to unlock AI-powered agent creation and live chat. Stored locally in your browser.
        </p>
        <input
          type="password"
          value={key}
          onChange={e => setKey(e.target.value)}
          placeholder="sk-..."
          className="input-field mb-5 font-mono text-xs"
        />
        <div className="flex gap-3 justify-end">
          <button onClick={onClose} className="btn-ghost text-xs py-2 px-4">Cancel</button>
          <button onClick={() => { setStoredKey(key); onClose() }} className="btn-primary text-xs py-2 px-5">Save Key</button>
        </div>
      </motion.div>
    </motion.div>
  )
}

function AmbientBg() {
  return (
    <>
      <div className="ambient-bg">
        <div className="ambient-orb ambient-orb-1" />
        <div className="ambient-orb ambient-orb-2" />
        <div className="ambient-orb ambient-orb-3" />
      </div>
      <div className="noise-overlay" />
    </>
  )
}

export default function Layout() {
  const location = useLocation()
  const [showSettings, setShowSettings] = useState(false)

  return (
    <div className="flex min-h-screen relative">
      <AmbientBg />

      {/* Sidebar */}
      <aside className="w-[72px] flex flex-col items-center py-6 gap-1 border-r border-border shrink-0 relative z-10 bg-bg/80 backdrop-blur-xl">
        <NavLink to="/" className="mb-8">
          <motion.div
            whileHover={{ scale: 1.08 }}
            className="w-10 h-10 rounded-[12px] bg-gradient-to-br from-accent to-purple-600 flex items-center justify-center glow"
          >
            <Bot size={18} className="text-white" />
          </motion.div>
        </NavLink>

        <nav className="flex flex-col gap-1.5 flex-1">
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `relative w-11 h-11 rounded-[12px] flex items-center justify-center transition-all duration-200 group
                ${isActive
                  ? 'bg-accent/15 text-accent-bright glow-sm'
                  : 'text-text-dim hover:text-text-muted hover:bg-white/[0.03]'
                }`
              }
            >
              <Icon size={17} strokeWidth={1.8} />
              <span className="absolute left-[52px] px-2.5 py-1.5 text-[11px] bg-bg-elevated border border-border rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all whitespace-nowrap z-50 shadow-lg">
                {label}
              </span>
            </NavLink>
          ))}
        </nav>

        <button
          onClick={() => setShowSettings(true)}
          className="w-11 h-11 rounded-[12px] flex items-center justify-center text-text-dim hover:text-text-muted hover:bg-white/[0.03] transition-all"
        >
          <Settings size={17} strokeWidth={1.8} />
        </button>
      </aside>

      {/* Main — full center */}
      <main className="flex-1 min-h-screen relative z-10 flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="flex-1 flex flex-col"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {showSettings && <ApiKeyModal onClose={() => setShowSettings(false)} />}
      </AnimatePresence>
    </div>
  )
}
