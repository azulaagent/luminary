import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, Hammer, LayoutGrid, Zap, MessageSquare, Settings, X, ExternalLink } from 'lucide-react'
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
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.96, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.96, opacity: 0, y: 10 }}
        transition={{ duration: 0.2 }}
        className="card p-6 w-full max-w-md mx-4 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="heading-sm">API Configuration</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/5 text-text-muted transition-colors">
            <X size={16} />
          </button>
        </div>
        <p className="body-sm mb-4">
          Connect your MiMo API key to unlock AI features. Key is stored locally in your browser.
        </p>
        <input
          type="password"
          value={key}
          onChange={e => setKey(e.target.value)}
          placeholder="sk-..."
          className="input font-mono text-xs mb-5"
        />
        <div className="flex gap-3 justify-end">
          <button onClick={onClose} className="btn btn-ghost btn-sm">Cancel</button>
          <button onClick={() => { setStoredKey(key); onClose() }} className="btn btn-primary btn-sm">Save Key</button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function Layout() {
  const location = useLocation()
  const [showSettings, setShowSettings] = useState(false)

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-[68px] flex flex-col items-center py-5 shrink-0 border-r border-border bg-bg/80 backdrop-blur-xl sticky top-0 h-screen z-20">
        <NavLink to="/" className="mb-7">
          <div className="w-9 h-9 rounded-[10px] bg-accent flex items-center justify-center">
            <Bot size={17} className="text-white" />
          </div>
        </NavLink>

        <nav className="flex flex-col gap-1 flex-1">
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `relative w-10 h-10 rounded-[10px] flex items-center justify-center transition-all duration-200 group
                ${isActive
                  ? 'bg-accent-muted text-accent-bright'
                  : 'text-text-dim hover:text-text-secondary hover:bg-white/[0.03]'
                }`
              }
            >
              <Icon size={16} strokeWidth={1.8} />
              <span className="absolute left-[50px] px-2 py-1 text-[11px] bg-bg-elevated border border-border rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                {label}
              </span>
            </NavLink>
          ))}
        </nav>

        <button
          onClick={() => setShowSettings(true)}
          className="w-10 h-10 rounded-[10px] flex items-center justify-center text-text-dim hover:text-text-secondary hover:bg-white/[0.03] transition-all"
        >
          <Settings size={16} strokeWidth={1.8} />
        </button>
      </aside>

      {/* Main */}
      <main className="flex-1 min-h-screen">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="min-h-screen"
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
