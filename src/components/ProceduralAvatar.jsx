import { useMemo } from 'react'

function hashStr(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) { hash = ((hash << 5) - hash) + str.charCodeAt(i); hash |= 0 }
  return Math.abs(hash)
}

function seededRandom(seed) {
  let s = seed
  return () => { s = (s * 16807 + 0) % 2147483647; return (s - 1) / 2147483646 }
}

export default function ProceduralAvatar({ agent, size = 80, className = '' }) {
  return useMemo(() => {
    const seed = hashStr(agent.name + (agent.personality || ''))
    const rng = seededRandom(seed)
    const color = agent.color || '#8b5cf6'
    const cx = 50, cy = 50
    const layers = []
    const shapeType = seed % 4

    layers.push(
      <defs key="defs">
        <radialGradient id={`g-${agent.id}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>,
      <circle key="bg" cx={cx} cy={cy} r={38} fill={`url(#g-${agent.id})`} />
    )

    if (shapeType === 0) {
      const sides = 3 + (seed % 5)
      const r1 = 20 + rng() * 6
      const r2 = 12 + rng() * 5
      const pts1 = Array.from({ length: sides }, (_, i) => { const a = (Math.PI * 2 * i) / sides - Math.PI / 2; return `${cx + r1 * Math.cos(a)},${cy + r1 * Math.sin(a)}` }).join(' ')
      const pts2 = Array.from({ length: sides }, (_, i) => { const a = (Math.PI * 2 * i) / sides - Math.PI / 2 + Math.PI / sides; return `${cx + r2 * Math.cos(a)},${cy + r2 * Math.sin(a)}` }).join(' ')
      layers.push(<polygon key="p1" points={pts1} fill="none" stroke={color} strokeWidth="1.2" opacity="0.5" />, <polygon key="p2" points={pts2} fill="none" stroke={color} strokeWidth="0.8" opacity="0.25" />)
    } else if (shapeType === 1) {
      for (let i = 0; i < 3; i++) {
        const r = 8 + i * 7
        layers.push(<circle key={`r${i}`} cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={1.2 - i * 0.2} strokeDasharray={`${4 + rng() * 6} ${3 + rng() * 4}`} opacity={0.6 - i * 0.12} transform={`rotate(${rng() * 360} ${cx} ${cy})`} />)
      }
    } else if (shapeType === 2) {
      const count = 5 + Math.floor(rng() * 5)
      for (let i = 0; i < count; i++) {
        const a = (Math.PI * 2 * i) / count
        const r = 14 + rng() * 12
        layers.push(<circle key={`d${i}`} cx={cx + r * Math.cos(a)} cy={cy + r * Math.sin(a)} r={1.2 + rng() * 2} fill={color} opacity={0.3 + rng() * 0.4} />)
      }
      layers.push(<circle key="c" cx={cx} cy={cy} r={4} fill={color} opacity="0.2" />)
    } else {
      const arms = 3 + Math.floor(rng() * 3)
      for (let i = 0; i < arms; i++) {
        const a = (Math.PI * 2 * i) / arms
        const len = 16 + rng() * 8
        layers.push(<line key={`a${i}`} x1={cx} y1={cy} x2={cx + len * Math.cos(a)} y2={cy + len * Math.sin(a)} stroke={color} strokeWidth="1.2" opacity="0.4" strokeLinecap="round" />)
      }
    }

    layers.push(<circle key="dot" cx={cx} cy={cy} r={2.2} fill={color} />)

    return <svg width={size} height={size} viewBox="0 0 100 100" className={className}>{layers}</svg>
  }, [agent.name, agent.personality, agent.color, agent.id, size, className])
}
