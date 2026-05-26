import { useState, useEffect, useCallback } from 'react'

const API = '/.netlify/functions/status'

async function fetchStatus() {
  const res = await fetch(API)
  if (!res.ok) throw new Error('fetch failed')
  return res.json()
}

async function saveStatus(inside) {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ inside, updatedAt: new Date().toISOString() }),
  })
  if (!res.ok) throw new Error('save failed')
  return res.json()
}

export default function App() {
  const [isInside, setIsInside] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [loading, setLoading] = useState(true)
  const [toggling, setToggling] = useState(false)
  const [ripple, setRipple] = useState(false)
  const [error, setError] = useState(false)

  const load = useCallback(async () => {
    try {
      const rec = await fetchStatus()
      setIsInside(rec.inside)
      setLastUpdated(rec.updatedAt)
      setError(false)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
    const id = setInterval(load, 15_000)
    return () => clearInterval(id)
  }, [load])

  async function toggle() {
    if (toggling || loading) return
    setToggling(true)
    setRipple(true)
    setTimeout(() => setRipple(false), 700)
    const next = !isInside
    try {
      const rec = await saveStatus(next)
      setIsInside(rec.inside)
      setLastUpdated(rec.updatedAt)
    } catch {
      setError(true)
    } finally {
      setToggling(false)
    }
  }

  function fmt(iso) {
    if (!iso) return null
    return new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
  }

  const inside = isInside !== false

  return (
    <div style={root(inside)}>
      <div style={noiseLayer} />
      <div style={card}>
        <div style={headerRow}>
          <span style={pawStyle}>🐾</span>
          <h1 style={titleStyle}>Dog Watch</h1>
        </div>
        <p style={subStyle}>Tap to update when the dogs move</p>
        <button onClick={toggle} disabled={loading || toggling} style={btn(inside, toggling)}>
          <div style={rippleWrap}>
            {ripple && <span style={rippleAnim(inside)} />}
          </div>
          <span style={btnIcon}>{inside ? '🏠' : '🌿'}</span>
          <span style={btnLabel}>{loading ? 'Loading…' : inside ? 'INSIDE' : 'OUTSIDE'}</span>
          <span style={btnSub}>{inside ? 'safe to open the gate' : 'keep the gate closed'}</span>
        </button>
        <div style={statusRow}>
          <span style={dot(inside, loading)} />
          <span style={statusText}>Dogs are currently <strong>{loading ? '…' : inside ? 'inside' : 'outside'}</strong></span>
        </div>
        {lastUpdated && <p style={timeText}>Last updated at {fmt(lastUpdated)}</p>}
        {error && <p style={errorText}>⚠️ Cannot reach server</p>}
        <p style={hintText}>Syncs for everyone · updates every 15 s</p>
      </div>
    </div>
  )
}

const root = (inside) => ({ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: inside ? 'linear-gradient(135deg,#1a3a2a 0%,#0d2318 60%,#0a1a10 100%)' : 'linear-gradient(135deg,#3a2800 0%,#5c3d00 50%,#2a1a00 100%)', transition: 'background 0.8s ease', fontFamily: "'Georgia','Times New Roman',serif", padding: '24px', position: 'relative', overflow: 'hidden' })
const noiseLayer = { position: 'fixed', inset: 0, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`, pointerEvents: 'none', opacity: 0.4 }
const card = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '48px 36px', maxWidth: '380px', width: '100%', textAlign: 'center', backdropFilter: 'blur(12px)', boxShadow: '0 32px 64px rgba(0,0,0,0.5)', position: 'relative', zIndex: 1 }
const headerRow = { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '8px' }
const pawStyle = { fontSize: '28px' }
const titleStyle = { fontSize: '32px', fontWeight: '700', color: '#f5f0e8', margin: 0, letterSpacing: '0.05em' }
const subStyle = { color: 'rgba(245,240,232,0.45)', fontSize: '13px', marginBottom: '40px', letterSpacing: '0.03em' }
const btn = (inside, toggling) => ({ width: '100%', padding: '32px 24px', borderRadius: '18px', border: 'none', cursor: toggling ? 'wait' : 'pointer', background: inside ? 'linear-gradient(145deg,#2d6a4f,#1b4332)' : 'linear-gradient(145deg,#b45309,#78350f)', boxShadow: inside ? '0 8px 32px rgba(45,106,79,0.5),inset 0 1px 0 rgba(255,255,255,0.1)' : '0 8px 32px rgba(180,83,9,0.5),inset 0 1px 0 rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', transition: 'all 0.3s ease', transform: toggling ? 'scale(0.97)' : 'scale(1)', marginBottom: '28px', position: 'relative', overflow: 'hidden', WebkitTapHighlightColor: 'transparent' })
const rippleWrap = { position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', borderRadius: '18px' }
const rippleAnim = (inside) => ({ position: 'absolute', top: '50%', left: '50%', width: '400px', height: '400px', marginLeft: '-200px', marginTop: '-200px', borderRadius: '50%', background: inside ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.12)', animation: 'ripple 0.7s ease-out forwards' })
const btnIcon = { fontSize: '52px', display: 'block', lineHeight: 1 }
const btnLabel = { fontSize: '28px', fontWeight: '800', color: '#fff', letterSpacing: '0.12em' }
const btnSub = { fontSize: '12px', color: 'rgba(255,255,255,0.6)', letterSpacing: '0.06em', textTransform: 'uppercase' }
const statusRow = { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '12px' }
const dot = (inside, loading) => ({ width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0, background: loading ? '#888' : inside ? '#4ade80' : '#fb923c', boxShadow: loading ? 'none' : inside ? '0 0 8px #4ade80' : '0 0 8px #fb923c', animation: loading ? 'pulse 1.2s ease-in-out infinite' : 'none' })
const statusText = { color: 'rgba(245,240,232,0.7)', fontSize: '15px' }
const timeText = { color: 'rgba(245,240,232,0.35)', fontSize: '12px', marginBottom: '16px', letterSpacing: '0.02em' }
const errorText = { color: '#fca5a5', fontSize: '12px', marginBottom: '12px' }
const hintText = { color: 'rgba(245,240,232,0.22)', fontSize: '11px', letterSpacing: '0.04em', textTransform: 'uppercase', marginTop: '8px' }
