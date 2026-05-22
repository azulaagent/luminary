// MiMo LLM API Client
const DEFAULT_BASE = 'https://api.mimo.ai/v1'
const DEFAULT_MODEL = 'mimo-v2.5'

export function getStoredKey() {
  return localStorage.getItem('luminary_mimo_key') || ''
}

export function setStoredKey(key) {
  localStorage.setItem('luminary_mimo_key', key)
}

export async function* streamChat(messages, { apiKey, model, systemPrompt, temperature = 0.7 } = {}) {
  const key = apiKey || getStoredKey()
  if (!key) throw new Error('No API key configured')

  const body = {
    model: model || DEFAULT_MODEL,
    messages: [
      ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
      ...messages
    ],
    temperature,
    stream: true
  }

  const res = await fetch(`${DEFAULT_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`
    },
    body: JSON.stringify(body)
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`MiMo API error ${res.status}: ${err}`)
  }

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() || ''

    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed || !trimmed.startsWith('data: ')) continue
      const data = trimmed.slice(6)
      if (data === '[DONE]') return

      try {
        const parsed = JSON.parse(data)
        const delta = parsed.choices?.[0]?.delta?.content
        if (delta) yield delta
      } catch { /* skip malformed */ }
    }
  }
}

export async function chat(messages, opts = {}) {
  const key = opts.apiKey || getStoredKey()
  if (!key) throw new Error('No API key configured')

  const body = {
    model: opts.model || DEFAULT_MODEL,
    messages: [
      ...(opts.systemPrompt ? [{ role: 'system', content: opts.systemPrompt }] : []),
      ...messages
    ],
    temperature: opts.temperature ?? 0.7
  }

  const res = await fetch(`${DEFAULT_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`
    },
    body: JSON.stringify(body)
  })

  if (!res.ok) throw new Error(`MiMo API error ${res.status}`)
  const data = await res.json()
  return data.choices?.[0]?.message?.content || ''
}
