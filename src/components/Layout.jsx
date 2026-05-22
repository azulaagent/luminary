import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, Hammer, LayoutGrid, Zap, MessageSquare, Settings } from 'lucide-react'
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="glass rounded-2xl p-6 w-full max-w-md mx-4"
        onClick={e => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold mb-2">MiMo API Key</h3>
        <p className="text-sm text-text-muted mb-4">
          Enter your MiMo API key to enable AI features. Key is stored locally in your browser.
        </p>
        <input
          type="password"
          value={key}
          onChange={e => setKey(e.target.value)}
          placeholder="sk-..."
          className="w-full bg-bg-elevated border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors mb-4"
        />
        <div className="flex gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 text-sm text-text-muted hover:text-text transition-colors">
            Cancel
          </button>
          <button
            onClick={() => { setStoredKey(key); onClose() }}
            className="px-4 py-2 text-sm bg-accent hover:bg-accent/80 rounded-xl transition-colors"
          >
            Save
          </button>
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
      <aside className="w-[72px] flex flex-col items-center py-6 gap-1 border-r border-border shrink-0">
        {/* Logo */}
        <div className="mb-6 w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-purple-500 flex items-center justify-center glow">
          <Bot size={20} className="text-white" />
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1 flex-1">
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `relative w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 group
                ${isActive
                  ? 'bg-accent/15 text-accent'
                  : 'text-text-muted hover:text-text hover:bg-white/5'
                }`
              }
            >
              <Icon size={18} />
              {/* Tooltip */}
              <span className="absolute left-14 px-2 py-1 text-xs bg-bg-elevated border border-border rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                {label}
              </span>
            </NavLink>
          ))}
        </nav>

        {/* Settings */}
        <button
          onClick={() => setShowSettings(true)}
          className="w-11 h-11 rounded-xl flex items-center justify-center text-text-muted hover:text-text hover:bg-white/5 transition-all"
        >
          <Settings size={18} />
        </button>
      </aside>

      {/* Main */}
      <main className="flex-1 min-h-screen overflow-auto">
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

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && <ApiKeyModal onClose={() => setShowSettings(false)} />}
      </AnimatePresence>
    </div>
  )
}
