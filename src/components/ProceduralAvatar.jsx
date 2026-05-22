import { useMemo } from 'react'

// Generate deterministic visual DNA from agent name + personality
function hashStr(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + c
    hash |= 0
  }
  return Math.abs(hash)
}

function seededRandom(seed) {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return (s - 1) / 2147483646
  }
}

export default function ProceduralAvatar({ agent, size = 80, className = '' }) {
  const { svg } = useMemo(() => {
    const seed = hashStr(agent.name + (agent.personality || ''))
    const rng = seededRandom(seed)
    const color = agent.color || '#6366f1'

    const layers = []
    const cx = 50, cy = 50

    // Background glow
    layers.push(
      <defs key="defs">
        <radialGradient id={`glow-${agent.id}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
        <filter id={`blur-${agent.id}`}>
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>
    )

    // Ambient glow
    layers.push(
      <circle key="bg" cx={cx} cy={cy} r={40} fill={`url(#glow-${agent.id})`} />
    )

    // Core shape based on traits
    const traitCount = agent.traits?.length || 3
    const shapeType = seed % 4

    if (shapeType === 0) {
      // Polygon web
      const sides = Math.max(3, Math.min(8, traitCount + 2))
      const r1 = 22 + rng() * 8
      const r2 = 14 + rng() * 6
      const points1 = Array.from({ length: sides }, (_, i) => {
        const a = (Math.PI * 2 * i) / sides - Math.PI / 2
        return `${cx + r1 * Math.cos(a)},${cy + r1 * Math.sin(a)}`
      }).join(' ')
      const points2 = Array.from({ length: sides }, (_, i) => {
        const a = (Math.PI * 2 * i) / sides - Math.PI / 2 + Math.PI / sides
        return `${cx + r2 * Math.cos(a)},${cy + r2 * Math.sin(a)}`
      }).join(' ')
      layers.push(
        <polygon key="shape1" points={points1} fill="none" stroke={color} strokeWidth="1.5" opacity="0.6" />,
        <polygon key="shape2" points={points2} fill="none" stroke={color} strokeWidth="1" opacity="0.3" />
      )
    } else if (shapeType === 1) {
      // Concentric rings
      for (let i = 0; i < 3; i++) {
        const r = 10 + i * 8
        const dashLen = 4 + rng() * 8
        layers.push(
          <circle
            key={`ring-${i}`}
            cx={cx} cy={cy} r={r}
            fill="none" stroke={color}
            strokeWidth={1.5 - i * 0.3}
            strokeDasharray={`${dashLen} ${dashLen * 0.6}`}
            opacity={0.7 - i * 0.15}
            transform={`rotate(${rng() * 360} ${cx} ${cy})`}
          />
        )
      }
    } else if (shapeType === 2) {
      // Orbiting dots
      const count = 6 + Math.floor(rng() * 6)
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count
        const r = 16 + rng() * 14
        const dotR = 1.5 + rng() * 2.5
        layers.push(
          <circle
            key={`dot-${i}`}
            cx={cx + r * Math.cos(angle)}
            cy={cy + r * Math.sin(angle)}
            r={dotR}
            fill={color}
            opacity={0.4 + rng() * 0.4}
          />
        )
      }
      // Inner core
      layers.push(
        <circle key="core" cx={cx} cy={cy} r={6} fill={color} opacity="0.2" />,
        <circle key="core2" cx={cx} cy={cy} r={3} fill={color} opacity="0.6" />
      )
    } else {
      // Cross / plus pattern
      const arms = 3 + Math.floor(rng() * 3)
      for (let i = 0; i < arms; i++) {
        const angle = (Math.PI * 2 * i) / arms
        const len = 18 + rng() * 10
        layers.push(
          <line
            key={`arm-${i}`}
            x1={cx} y1={cy}
            x2={cx + len * Math.cos(angle)}
            y2={cy + len * Math.sin(angle)}
            stroke={color}
            strokeWidth="1.5"
            opacity="0.5"
            strokeLinecap="round"
          />
        )
      }
      layers.push(
        <circle key="center" cx={cx} cy={cy} r={5} fill={color} opacity="0.3" />
      )
    }

    // Center dot
    layers.push(
      <circle key="dot" cx={cx} cy={cy} r={2.5} fill={color} />
    )

    return {
      svg: (
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          className={className}
        >
          {layers}
        </svg>
      )
    }
  }, [agent.name, agent.personality, agent.color, agent.id, agent.traits, size, className])

  return svg
}
