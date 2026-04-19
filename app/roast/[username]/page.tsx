'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams } from 'next/navigation'

const LOADING_MESSAGES = [
  { emoji: '🔍', text: 'Stalking your GitHub profile...' },
  { emoji: '😬', text: 'Reading your commit messages...' },
  { emoji: '📂', text: 'Judging your folder names...' },
  { emoji: '🚨', text: 'Counting abandoned projects...' },
  { emoji: '✍️', text: 'Writing your roast script...' },
  { emoji: '🎙️', text: 'Chris is clearing his throat...' },
  { emoji: '😂', text: 'Aria cannot stop laughing...' },
  { emoji: '🎵', text: 'Adding the sad trombone...' },
  { emoji: '🎧', text: 'Mixing the final episode...' },
  { emoji: '🔥', text: 'Your reputation is done.' },
]

export default function RoastPage() {
  const { username } = useParams<{ username: string }>()
  const [step, setStep] = useState(0)
  const [msgIndex, setMsgIndex] = useState(0)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [script, setScript] = useState<any[]>([])
  const [profile, setProfile] = useState<any>(null)
  const [error, setError] = useState('')
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [done, setDone] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const interval = setInterval(() => setMsgIndex((i) => (i + 1) % LOADING_MESSAGES.length), 2200)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => { if (username) generate() }, [username])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const onTime = () => setCurrentTime(audio.currentTime)
    const onLoad = () => setDuration(audio.duration)
    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('loadedmetadata', onLoad)
    return () => {
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('loadedmetadata', onLoad)
    }
  }, [audioUrl])

  async function generate() {
    try {
      setStep(1)
      const analyzeRes = await fetch('/api/analyze', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      })
      if (!analyzeRes.ok) throw new Error((await analyzeRes.json()).error)
      const { profile, roastData } = await analyzeRes.json()
      setProfile(profile)

      setStep(2)
      const scriptRes = await fetch('/api/script', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile, roastData }),
      })
      if (!scriptRes.ok) throw new Error((await scriptRes.json()).error)
      const { script } = await scriptRes.json()
      setScript(script)

      setStep(3)
      const voiceRes = await fetch('/api/voice', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ script }),
      })
      if (!voiceRes.ok) throw new Error((await voiceRes.json()).error)
      const { audioData } = await voiceRes.json()

      setStep(4)
      const audioRes = await fetch('/api/audio', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audioData, username }),
      })
      if (!audioRes.ok) throw new Error((await audioRes.json()).error)

      const blob = await audioRes.blob()
      setAudioUrl(URL.createObjectURL(blob))
      setStep(5)
      setDone(true)
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    }
  }

  const togglePlay = () => {
    if (!audioRef.current) return
    isPlaying ? audioRef.current.pause() : audioRef.current.play()
    setIsPlaying(!isPlaying)
  }

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

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
          --text-primary: #2A1F14;
          --text-secondary: #6B5240;
          --text-muted: #9B8570;
        }

        body { background: var(--cream); font-family: 'DM Sans', sans-serif; color: var(--text-primary); min-height: 100vh; }

        .grain {
          position: fixed; inset: 0; pointer-events: none; z-index: 100; opacity: 0.035;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          background-repeat: repeat; background-size: 128px 128px;
        }

        .page { min-height: 100vh; display: flex; flex-direction: column; }

        .topbar {
          display: flex; align-items: center; justify-content: space-between;
          padding: 1.75rem 4rem; border-bottom: 1px solid var(--cream3);
          background: var(--cream);
          animation: fadeDown 0.6s ease forwards;
        }

        .topbar-logo { height: 34px; width: auto; }

        .back-link {
          font-size: 0.8rem; color: var(--text-muted); text-decoration: none;
          font-family: 'DM Mono', monospace; display: flex; align-items: center; gap: 0.5rem;
          transition: color 0.2s;
        }

        .back-link:hover { color: var(--text-primary); }

        .main { flex: 1; display: flex; flex-direction: column; align-items: center; padding: 4rem 2rem; }

        .profile-row {
          display: flex; align-items: center; gap: 1rem; margin-bottom: 3rem;
          animation: fadeUp 0.6s ease 0.2s both;
        }

        .avatar { width: 52px; height: 52px; border-radius: 50%; border: 2px solid var(--cream3); object-fit: cover; }

        .avatar-placeholder {
          width: 52px; height: 52px; border-radius: 50%;
          background: var(--cream3); border: 2px solid var(--cream3);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Playfair Display', serif; font-size: 1.2rem; color: var(--brown-mid);
        }

        .profile-name { font-family: 'Playfair Display', serif; font-size: 1.2rem; font-weight: 700; color: var(--text-primary); }
        .profile-sub { font-size: 0.75rem; color: var(--text-muted); font-family: 'DM Mono', monospace; margin-top: 0.15rem; }

        .card {
          width: 100%; max-width: 600px;
          background: #fff; border: 1px solid var(--cream3);
          border-radius: 20px; overflow: hidden;
          box-shadow: 0 4px 40px rgba(61,46,32,0.07);
          animation: fadeUp 0.7s ease 0.3s both;
        }

        .loading-card { padding: 4rem 3rem; text-align: center; }

        .loading-emoji {
          font-size: 3.5rem; display: block; margin-bottom: 1.5rem;
          animation: floatBounce 2s ease infinite;
        }

        @keyframes floatBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        .loading-msg {
          font-family: 'Playfair Display', serif; font-size: 1.4rem;
          font-weight: 700; color: var(--text-primary); margin-bottom: 0.5rem; min-height: 2rem;
        }

        .loading-sub { font-size: 0.78rem; color: var(--text-muted); font-family: 'DM Mono', monospace; margin-bottom: 2.5rem; }

        .progress-track { display: flex; gap: 6px; justify-content: center; margin-bottom: 1.5rem; }

        .progress-pip {
          height: 3px; border-radius: 2px; transition: all 0.4s ease;
          background: var(--cream3); flex: 1; max-width: 80px;
        }

        .progress-pip.active { background: var(--orange-warm); }
        .progress-pip.done { background: var(--brown-light); }

        .progress-label {
          font-size: 0.72rem; color: var(--text-muted); font-family: 'DM Mono', monospace;
          text-transform: uppercase; letter-spacing: 0.08em;
        }

        .player-header {
          background: var(--brown-deep); padding: 2rem 2.5rem;
          display: flex; align-items: center; gap: 1rem;
        }

        .host-avatars { display: flex; flex-shrink: 0; }

        .host-avatar {
          width: 44px; height: 44px; border-radius: 50%;
          border: 2px solid rgba(245,239,230,0.2);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Playfair Display', serif; font-size: 1rem; font-weight: 700; color: var(--cream);
        }

        .host-avatar:first-child { background: var(--orange-warm); margin-right: -12px; z-index: 1; }
        .host-avatar:last-child { background: var(--brown-dark); }

        .player-title { font-family: 'Playfair Display', serif; font-size: 1.1rem; font-weight: 700; color: var(--cream); line-height: 1.2; }
        .player-sub { font-size: 0.72rem; color: rgba(245,239,230,0.45); font-family: 'DM Mono', monospace; margin-top: 0.25rem; }

        .player-body { padding: 2rem 2.5rem; }

        .waveform { display: flex; align-items: center; gap: 2px; height: 48px; margin-bottom: 1.5rem; cursor: pointer; }

        .wave-bar { flex: 1; border-radius: 2px; transition: background 0.3s; background: var(--cream3); }
        .wave-bar.played { background: var(--orange-warm); }
        .wave-bar.playing { animation: wavePulse 0.8s ease infinite; }

        @keyframes wavePulse {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(1.3); }
        }

        .time-row {
          display: flex; justify-content: space-between;
          font-size: 0.72rem; color: var(--text-muted); font-family: 'DM Mono', monospace; margin-bottom: 1.5rem;
        }

        .progress-bar-track {
          height: 3px; background: var(--cream3); border-radius: 2px;
          margin-bottom: 2rem; cursor: pointer; position: relative;
        }

        .progress-bar-fill { height: 100%; background: var(--orange-warm); border-radius: 2px; transition: width 0.1s linear; }

        .play-btn {
          width: 100%; border: none; cursor: pointer;
          background: var(--brown-deep); color: var(--cream);
          font-family: 'DM Sans', sans-serif; font-size: 0.95rem; font-weight: 500;
          padding: 1rem; border-radius: 12px; transition: all 0.2s;
          display: flex; align-items: center; justify-content: center; gap: 0.75rem;
          letter-spacing: 0.02em;
        }

        .play-btn:hover { background: var(--orange-warm); box-shadow: 0 4px 20px rgba(212,101,31,0.3); }

        .actions { display: grid; grid-template-columns: 1fr 1fr; border-top: 1px solid var(--cream3); }

        .action-btn {
          border: none; cursor: pointer; background: transparent;
          padding: 1.25rem; font-family: 'DM Mono', monospace;
          font-size: 0.78rem; color: var(--text-secondary);
          display: flex; align-items: center; justify-content: center; gap: 0.5rem;
          transition: all 0.2s; border-right: 1px solid var(--cream3);
        }

        .action-btn:last-child { border-right: none; }
        .action-btn:hover { background: var(--cream2); color: var(--text-primary); }

        .script-section { width: 100%; max-width: 600px; margin-top: 2rem; animation: fadeUp 0.7s ease 0.5s both; }

        .script-label {
          font-size: 0.68rem; letter-spacing: 0.14em; text-transform: uppercase;
          color: var(--text-muted); font-family: 'DM Mono', monospace; margin-bottom: 1rem; padding: 0 0.25rem;
        }

        .script-card { background: #fff; border: 1px solid var(--cream3); border-radius: 16px; overflow: hidden; box-shadow: 0 2px 20px rgba(61,46,32,0.05); }

        .script-lines { max-height: 280px; overflow-y: auto; padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; }
        .script-lines::-webkit-scrollbar { width: 4px; }
        .script-lines::-webkit-scrollbar-track { background: var(--cream2); }
        .script-lines::-webkit-scrollbar-thumb { background: var(--cream3); border-radius: 2px; }

        .script-line { display: flex; gap: 0.75rem; align-items: flex-start; }

        .script-host {
          font-size: 0.65rem; font-weight: 500; padding: 0.25rem 0.6rem;
          border-radius: 100px; flex-shrink: 0; margin-top: 0.1rem;
          font-family: 'DM Mono', monospace; letter-spacing: 0.05em;
        }

        .script-host.alex { background: rgba(212,101,31,0.12); color: var(--orange-warm); }
        .script-host.jamie { background: rgba(107,82,64,0.12); color: var(--brown-dark); }

        .script-text { font-size: 0.875rem; color: var(--text-secondary); line-height: 1.65; font-weight: 300; }

        .error-card { padding: 3rem; text-align: center; }
        .error-emoji { font-size: 3rem; display: block; margin-bottom: 1rem; }
        .error-msg { font-family: 'Playfair Display', serif; font-size: 1.1rem; color: #C0392B; margin-bottom: 1.5rem; }

        .retry-btn {
          border: 1px solid var(--cream3); cursor: pointer; background: var(--cream2);
          border-radius: 8px; padding: 0.6rem 1.5rem; font-family: 'DM Mono', monospace;
          font-size: 0.78rem; color: var(--text-secondary); transition: all 0.2s;
        }

        .retry-btn:hover { background: var(--cream3); }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-12px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 600px) {
          .topbar { padding: 1.25rem 1.5rem; }
          .main { padding: 2rem 1rem; }
          .player-header { padding: 1.5rem; }
          .player-body { padding: 1.5rem; }
        }
      `}</style>

      <div className="grain" />

      <div className="page">
        <div className="topbar">
          <a href="/"><img src="/logo.png" alt="RoastCast" className="topbar-logo" /></a>
          <a href="/" className="back-link">← roast someone else</a>
        </div>

        <div className="main">
          <div className="profile-row">
            {profile ? (
              <img src={profile.avatar_url} alt={username} className="avatar" />
            ) : (
              <div className="avatar-placeholder">{username?.[0]?.toUpperCase()}</div>
            )}
            <div>
              <div className="profile-name">@{username}</div>
              <div className="profile-sub">
                {profile ? `${profile.public_repos} repos · ${profile.followers} followers` : 'fetching profile...'}
              </div>
            </div>
          </div>

          {step < 5 && !error && (
            <div className="card">
              <div className="loading-card">
                <span className="loading-emoji">{LOADING_MESSAGES[msgIndex].emoji}</span>
                <div className="loading-msg">{LOADING_MESSAGES[msgIndex].text}</div>
                <div className="loading-sub">generating your episode · please wait</div>
                <div className="progress-track">
                  {[1,2,3,4].map((s) => (
                    <div key={s} className={`progress-pip ${step > s ? 'done' : step === s ? 'active' : ''}`} />
                  ))}
                </div>
                <div className="progress-label">
                  {['waiting','analyzing github','writing script','generating voices','mixing audio'][step] || 'starting...'}
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="card">
              <div className="error-card">
                <span className="error-emoji">💀</span>
                <div className="error-msg">{error}</div>
                <button className="retry-btn" onClick={() => window.location.reload()}>try again →</button>
              </div>
            </div>
          )}

          {done && audioUrl && (
            <>
              <div className="card">
                <div className="player-header">
                  <div className="host-avatars">
                    <div className="host-avatar">C</div>
                    <div className="host-avatar">A</div>
                  </div>
                  <div>
                    <div className="player-title">The @{username} Episode</div>
                    <div className="player-sub">
                      RoastCast · Chris & Aria · {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                </div>

                <div className="player-body">
                  <div className="waveform">
                    {Array.from({ length: 60 }).map((_, i) => {
                      const barProgress = (i / 60) * 100
                      const isPlayed = barProgress <= progress
                      const height = 12 + Math.sin(i * 0.45) * 10 + Math.sin(i * 0.13) * 8 + (i % 4 === 0 ? 8 : 0)
                      return (
                        <div
                          key={i}
                          className={`wave-bar ${isPlayed ? 'played' : ''} ${isPlaying && isPlayed ? 'playing' : ''}`}
                          style={{ height: `${height}px`, animationDelay: `${i * 20}ms` }}
                        />
                      )
                    })}
                  </div>

                  <div
                    className="progress-bar-track"
                    onClick={(e) => {
                      if (!audioRef.current || !duration) return
                      const rect = e.currentTarget.getBoundingClientRect()
                      audioRef.current.currentTime = ((e.clientX - rect.left) / rect.width) * duration
                    }}
                  >
                    <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
                  </div>

                  <div className="time-row">
                    <span>{formatTime(currentTime)}</span>
                    <span>{duration ? formatTime(duration) : '--:--'}</span>
                  </div>

                  <audio ref={audioRef} src={audioUrl} onEnded={() => setIsPlaying(false)} />

                  <button className="play-btn" onClick={togglePlay}>
                    {isPlaying ? '⏸' : '▶'} {isPlaying ? 'Pause Episode' : 'Play Episode'}
                  </button>
                </div>

                <div className="actions">
                  <button
                    className="action-btn"
                    onClick={() => {
                      const a = document.createElement('a')
                      a.href = audioUrl
                      a.download = `roastcast-${username}.mp3`
                      a.click()
                    }}
                  >
                    ⬇ download mp3
                  </button>
                  <button
                    className="action-btn"
                    onClick={() => {
                      const text = `just got roasted by AI on RoastCast 💀\n@${username} on GitHub\n\ntry yours 👉 roastcast.app\n\n#ElevenHacks #CodeWithKiro`
                      navigator.clipboard.writeText(text)
                      alert('Copied to clipboard!')
                    }}
                  >
                    🔗 share episode
                  </button>
                </div>
              </div>

              {script.length > 0 && (
                <div className="script-section">
                  <div className="script-label">Episode Script</div>
                  <div className="script-card">
                    <div className="script-lines">
                      {script.map((line, i) => (
                        <div key={i} className="script-line">
                          <span className={`script-host ${line.host}`}>
                            {line.host === 'alex' ? 'CHRIS' : 'ARIA'}
                          </span>
                          <p className="script-text">{line.line}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
}