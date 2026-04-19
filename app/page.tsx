'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

export default function LandingPage() {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleRoast = () => {
    const clean = input
      .replace(/^https?:\/\/github\.com\//i, '')
      .replace(/\//g, '')
      .trim()
    if (!clean) return
    setLoading(true)
    router.push(`/roast/${clean}`)
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --cream: #F5EFE6;
          --cream2: #EDE5D8;
          --cream3: #E2D5C3;
          --brown-light: #C4A882;
          --brown-mid: #9B7D5A;
          --brown-dark: #6B5240;
          --brown-deep: #3D2E20;
          --orange-warm: #D4651F;
          --orange-glow: #E8823A;
          --text-primary: #2A1F14;
          --text-secondary: #6B5240;
          --text-muted: #9B8570;
        }

        body { background: var(--cream); font-family: 'DM Sans', sans-serif; color: var(--text-primary); overflow-x: hidden; }

        .grain {
          position: fixed; inset: 0; pointer-events: none; z-index: 100; opacity: 0.035;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          background-repeat: repeat; background-size: 128px 128px;
        }

        .hero {
          min-height: 100vh; display: flex; flex-direction: column;
          position: relative; overflow: hidden;
        }

        .hero-bg {
          position: absolute; inset: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 80% 60% at 70% 20%, rgba(212,101,31,0.12) 0%, transparent 60%),
            radial-gradient(ellipse 60% 50% at 20% 80%, rgba(196,168,130,0.2) 0%, transparent 55%),
            radial-gradient(ellipse 40% 40% at 85% 75%, rgba(155,125,90,0.1) 0%, transparent 50%);
        }

        .nav {
          display: flex; align-items: center; justify-content: space-between;
          padding: 2rem 4rem; position: relative; z-index: 10;
          opacity: 0; animation: fadeDown 0.8s ease 0.1s forwards;
        }

        .nav-logo { height: 38px; width: auto; }

        .nav-badge {
          display: flex; align-items: center; gap: 0.5rem;
          background: var(--cream2); border: 1px solid var(--cream3);
          border-radius: 100px; padding: 0.4rem 1rem;
          font-size: 0.75rem; color: var(--text-secondary); font-weight: 500;
          font-family: 'DM Mono', monospace;
        }

        .dot-live {
          width: 6px; height: 6px; border-radius: 50%; background: #4CAF50;
          animation: pulse-green 2s ease infinite;
        }

        @keyframes pulse-green {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.3); }
        }

        .hero-content {
          flex: 1; display: flex; flex-direction: column; align-items: center;
          justify-content: center; padding: 4rem 2rem; position: relative; z-index: 10;
          text-align: center;
        }

        .eyebrow {
          display: inline-flex; align-items: center; gap: 0.75rem;
          background: var(--cream2); border: 1px solid var(--brown-light);
          border-radius: 100px; padding: 0.5rem 1.25rem;
          font-size: 0.72rem; letter-spacing: 0.12em; text-transform: uppercase;
          color: var(--brown-mid); font-weight: 500; font-family: 'DM Mono', monospace;
          margin-bottom: 2.5rem;
          opacity: 0; animation: fadeUp 0.8s ease 0.3s forwards;
        }

        .eyebrow-line { width: 20px; height: 1px; background: var(--brown-light); }

        .headline {
          font-family: 'Playfair Display', serif;
          font-size: clamp(3.5rem, 8vw, 7rem);
          font-weight: 900; line-height: 0.95;
          letter-spacing: -0.03em; color: var(--text-primary);
          margin-bottom: 0.5rem;
          opacity: 0; animation: fadeUp 0.9s ease 0.4s forwards;
        }

        .headline-italic {
          font-style: italic; color: var(--orange-warm);
          display: block;
        }

        .headline-sub {
          font-family: 'Playfair Display', serif;
          font-size: clamp(3rem, 7vw, 6rem);
          font-weight: 400; font-style: italic;
          color: var(--brown-light); line-height: 0.95;
          letter-spacing: -0.02em; margin-bottom: 2rem;
          opacity: 0; animation: fadeUp 0.9s ease 0.5s forwards;
        }

        .subtext {
          font-size: 1.05rem; color: var(--text-secondary);
          max-width: 480px; line-height: 1.65; font-weight: 300;
          margin-bottom: 3.5rem;
          opacity: 0; animation: fadeUp 0.8s ease 0.6s forwards;
        }

        .input-wrapper {
          width: 100%; max-width: 560px; position: relative;
          opacity: 0; animation: fadeUp 0.8s ease 0.7s forwards;
        }

        .input-row {
          display: flex; align-items: center; gap: 0;
          background: #fff; border: 1.5px solid var(--cream3);
          border-radius: 16px; overflow: hidden;
          box-shadow: 0 4px 24px rgba(61,46,32,0.08), 0 1px 4px rgba(61,46,32,0.05);
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .input-row:focus-within {
          border-color: var(--brown-light);
          box-shadow: 0 4px 32px rgba(212,101,31,0.12), 0 1px 4px rgba(61,46,32,0.05);
        }

        .input-icon {
          padding: 0 1rem 0 1.25rem; color: var(--text-muted); font-size: 0.85rem;
          font-family: 'DM Mono', monospace; white-space: nowrap; flex-shrink: 0;
        }

        .input-field {
          flex: 1; border: none; outline: none; background: transparent;
          padding: 1.1rem 0.5rem; font-size: 0.95rem; color: var(--text-primary);
          font-family: 'DM Mono', monospace; font-weight: 400;
        }

        .input-field::placeholder { color: var(--text-muted); }

        .roast-btn {
          border: none; cursor: pointer; padding: 0.85rem 1.75rem;
          background: var(--brown-deep); color: var(--cream);
          font-family: 'DM Sans', sans-serif; font-size: 0.88rem; font-weight: 500;
          letter-spacing: 0.02em; white-space: nowrap; margin: 0.35rem;
          border-radius: 12px; transition: all 0.2s; flex-shrink: 0;
        }

        .roast-btn:hover:not(:disabled) {
          background: var(--orange-warm); transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(212,101,31,0.3);
        }

        .roast-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .input-hint {
          text-align: center; margin-top: 0.85rem;
          font-size: 0.75rem; color: var(--text-muted); font-family: 'DM Mono', monospace;
        }

        .scroll-strip {
          width: 100%; overflow: hidden; border-top: 1px solid var(--cream3);
          border-bottom: 1px solid var(--cream3);
          background: var(--cream2); padding: 0.9rem 0;
          position: relative; z-index: 10;
          opacity: 0; animation: fadeIn 1s ease 1.2s forwards;
        }

        .strip-track {
          display: flex; gap: 3rem; width: max-content;
          animation: scrollLeft 25s linear infinite;
        }

        .strip-item {
          display: flex; align-items: center; gap: 0.6rem; white-space: nowrap;
          font-size: 0.75rem; letter-spacing: 0.1em; text-transform: uppercase;
          color: var(--text-muted); font-family: 'DM Mono', monospace; font-weight: 500;
        }

        .strip-dot { color: var(--orange-warm); font-size: 1rem; }

        @keyframes scrollLeft {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        .features {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 1px; background: var(--cream3);
          border-top: 1px solid var(--cream3);
        }

        .feature-card {
          background: var(--cream); padding: 3rem 2.5rem;
          position: relative; overflow: hidden;
          transition: background 0.3s;
          opacity: 0; animation: fadeUp 0.8s ease var(--delay, 1.4s) forwards;
        }

        .feature-card:hover { background: var(--cream2); }

        .feature-num {
          font-family: 'Playfair Display', serif; font-size: 4rem; font-weight: 900;
          color: var(--cream3); line-height: 1; margin-bottom: 1.5rem;
          position: absolute; top: 1.5rem; right: 2rem;
          transition: color 0.3s;
        }

        .feature-icon { font-size: 1.5rem; margin-bottom: 1rem; display: block; }

        .feature-title {
          font-family: 'Playfair Display', serif; font-size: 1.3rem;
          font-weight: 700; color: var(--text-primary); margin-bottom: 0.75rem;
          line-height: 1.3;
        }

        .feature-desc {
          font-size: 0.875rem; color: var(--text-secondary);
          line-height: 1.7; font-weight: 300;
        }

        .stats-row {
          display: flex; align-items: center; justify-content: center;
          background: var(--brown-deep); padding: 0; overflow: hidden;
        }

        .stat-block {
          flex: 1; padding: 3rem 2rem; text-align: center;
          border-right: 1px solid rgba(255,255,255,0.08);
          opacity: 0; animation: fadeUp 0.8s ease var(--delay, 1.6s) forwards;
        }

        .stat-block:last-child { border-right: none; }

        .stat-num {
          font-family: 'Playfair Display', serif; font-size: 3rem;
          font-weight: 900; color: var(--cream); display: block;
          line-height: 1; margin-bottom: 0.5rem;
        }

        .stat-label {
          font-size: 0.75rem; color: rgba(245,239,230,0.45);
          text-transform: uppercase; letter-spacing: 0.12em;
          font-family: 'DM Mono', monospace;
        }

        .footer {
          background: var(--cream2); border-top: 1px solid var(--cream3);
          padding: 2rem 4rem; display: flex; align-items: center;
          justify-content: space-between;
        }

        .footer-logo { height: 28px; width: auto; }

        .footer-text {
          font-size: 0.75rem; color: var(--text-muted);
          font-family: 'DM Mono', monospace;
        }

        .footer-tags { display: flex; gap: 0.5rem; }

        .footer-tag {
          font-size: 0.7rem; padding: 0.3rem 0.75rem;
          background: var(--cream3); border-radius: 100px;
          color: var(--text-secondary); font-family: 'DM Mono', monospace;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-16px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @media (max-width: 768px) {
          .nav { padding: 1.5rem 1.5rem; }
          .features { grid-template-columns: 1fr; }
          .stats-row { flex-direction: column; }
          .stat-block { border-right: none; border-bottom: 1px solid rgba(255,255,255,0.08); }
          .footer { flex-direction: column; gap: 1rem; text-align: center; padding: 2rem 1.5rem; }
        }
      `}</style>

      <div className="grain" />

      <div className="hero">
        <div className="hero-bg" />

        <nav className="nav">
          <img src="/logo.png" alt="RoastCast" className="nav-logo" />
          <div className="nav-badge">
            <span className="dot-live" />
            Powered by ElevenLabs + Groq
          </div>
        </nav>

        <div className="hero-content">
          <div className="eyebrow">
            <span className="eyebrow-line" />
            AI Podcast Generator
            <span className="eyebrow-line" />
          </div>

          <h1 className="headline">
            Your GitHub,
            <span className="headline-italic">ruthlessly</span>
          </h1>
          <div className="headline-sub">roasted.</div>

          <p className="subtext">
            Paste your GitHub username and get a full AI podcast episode — two hosts, real voices, sound effects — roasting everything about your code.
          </p>

          <div className="input-wrapper">
            <div className="input-row">
              <span className="input-icon">github.com/</span>
              <input
                ref={inputRef}
                className="input-field"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleRoast()}
                placeholder="torvalds"
                autoFocus
              />
              <button
                className="roast-btn"
                onClick={handleRoast}
                disabled={loading || !input.trim()}
              >
                {loading ? 'Loading...' : '🎙 Roast Me'}
              </button>
            </div>
            <p className="input-hint">try your own username · or a friend's · no mercy</p>
          </div>
        </div>
      </div>

      <div className="scroll-strip">
        <div className="strip-track">
          {[...Array(2)].map((_, di) =>
            ['Two AI Hosts', 'Real ElevenLabs Voices', 'Sound Effects', 'Downloadable MP3', 'GitHub Analyzer', 'Roast Script', 'Share Ready', 'Podcast Music', 'Two AI Hosts', 'Real ElevenLabs Voices', 'Sound Effects', 'Downloadable MP3'].map((item, i) => (
              <span key={`${di}-${i}`} className="strip-item">
                <span className="strip-dot">◆</span>
                {item}
              </span>
            ))
          )}
        </div>
      </div>

      <div className="features">
        {[
          { icon: '🔍', title: 'Deep GitHub Analysis', desc: 'We dig into your repos, commit history, abandoned projects, empty READMEs, and suspicious naming patterns.', delay: '1.3s' },
          { icon: '✍️', title: 'AI Roast Script', desc: 'Groq writes a savage two-host podcast script tailored to your specific GitHub crimes. Smart, meme-aware dev humor.', delay: '1.4s' },
          { icon: '🎙️', title: 'Real Voice Generation', desc: 'ElevenLabs brings Chris and Aria to life with natural pacing, personality, and delivery. Not robotic. Actually funny.', delay: '1.5s' },
        ].map((f, idx) => (
          <div key={f.title} className="feature-card" style={{ '--delay': f.delay } as any}>
            <span className="feature-num">{['01','02','03'][idx]}</span>
            <span className="feature-icon">{f.icon}</span>
            <div className="feature-title">{f.title}</div>
            <p className="feature-desc">{f.desc}</p>
          </div>
        ))}
      </div>

      <div className="stats-row">
        {[
          { num: '2,847', label: 'Repos Roasted', delay: '1.5s' },
          { num: '1,203', label: 'Devs Traumatized', delay: '1.6s' },
          { num: '98%', label: 'Accuracy Rate', delay: '1.7s' },
          { num: '∞', label: 'Tears Shed', delay: '1.8s' },
        ].map((s) => (
          <div key={s.label} className="stat-block" style={{ '--delay': s.delay } as any}>
            <span className="stat-num">{s.num}</span>
            <span className="stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      <footer className="footer">
        <img src="/logo.png" alt="RoastCast" className="footer-logo" />
        <div className="footer-tags">
          <span className="footer-tag">#ElevenHacks</span>
          <span className="footer-tag">#CodeWithKiro</span>
        </div>
        <div className="footer-text">Built for ElevenHacks · 2026</div>
      </footer>
    </>
  )
}