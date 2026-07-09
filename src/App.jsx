import { useState, useEffect, useRef } from 'react'
import './App.css'
import { ContainerScroll } from './components/ui/ContainerScroll.jsx'

const GITHUB_REPO = 'https://github.com/Abhichy18/PortLLM'
const GITHUB_ZIP = 'https://github.com/Abhichy18/PortLLM/archive/refs/heads/main.zip'
const HERO_VIDEO = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_083109_283f3553-e28f-428b-a723-d639c617eb2b.mp4'

const DESKTOP_MODELS = [
  { name: 'Gemma 2 2B Abliterated', size: '1.6 GB', label: 'UNCENSORED', badge: 'RECOMMENDED', desc: 'Purged safety vectors. Blazing fast, highly logical reasoning model.' },
  { name: 'Gemma 4 E4B Heretic', size: '5.34 GB', label: 'UNCENSORED', badge: 'HERETIC', desc: 'Forces absolute compliance on raw questions regardless of filters.' },
  { name: 'Qwen 3.5 9B Uncensored', size: '5.2 GB', label: 'UNCENSORED', badge: 'AGGRESSIVE', desc: 'A larger, highly competent reasoning model for code generation.' },
  { name: 'NemoMix Unleashed 12B', size: '7.0 GB', label: 'UNCENSORED', badge: 'HEAVYWEIGHT', desc: 'Advanced reasoning and contextual memory. Needs 16GB+ RAM.' },
  { name: 'Dolphin 2.9 Llama 3 8B', size: '4.9 GB', label: 'UNCENSORED', badge: 'VERSATILE', desc: 'Highly creative, unrestricted general purpose conversation model.' },
  { name: 'Phi-3.5 Mini 3.8B', size: '2.2 GB', label: 'STANDARD', badge: 'LIGHTWEIGHT', desc: 'Logical reasoning and mathematics helper with standard alignment.' },
]

const MOBILE_MODELS = [
  { name: 'Gemma 2 2B Abliterated', size: '1.6 GB', label: 'UNCENSORED', badge: 'FASTEST', desc: 'Perfect ratio of intelligence and performance for mobile processors.' },
  { name: 'SmolLM2 1.7B Uncensored', size: '1.0 GB', label: 'UNCENSORED', badge: 'LIGHTWEIGHT', desc: 'Extremely lightweight model. Ideal for older phones or low RAM.' },
  { name: 'Qwen 2.5 1.5B Instruct', size: '1.1 GB', label: 'STANDARD', badge: 'MULTILINGUAL', desc: 'Standard alignment with excellent multilingual logic features.' },
  { name: 'Phi 3.5 Mini 3.8B', size: '2.2 GB', label: 'STANDARD', badge: 'SMART', desc: 'High reasoning capacity, best for modern high-performance devices.' },
]

const FAQS = [
  { q: 'Does this require administrator or root privileges?', a: 'No. PortLLM runs strictly in user-space. Runtimes, environment configurations, and folders are sandboxed, meaning it leaves zero registry traces or footprints on the host system.' },
  { q: 'What is an Abliterated or Uncensored model?', a: 'Abliterated models are open-source AI weights where safety alignment pathways are mathematically neutralised. The model complies directly with raw queries without moralizing, lecturing, or refusing prompts.' },
  { q: 'Can I run this without a GPU?', a: 'Yes. PortLLM dynamically falls back to CPU execution. It runs highly optimized GGUF quantizations using AVX vector instructions, rendering good token speeds even on older computers.' },
  { q: 'Why is the first model load slow on a USB?', a: 'Standard USB flash drives have lower read speeds. If you want near-instantaneous model loading, copy the PortLLM folder directly to your internal SSD.' },
]

function GithubIcon({ size = 20, className = "" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width={size} height={size} fill="currentColor" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
    </svg>
  )
}

function DownloadIcon({ size = 18, className = "" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="7 10 12 15 17 10"></polyline>
      <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
  )
}

function ChevronIcon() {
  return (
    <svg className="faq-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  )
}

function ImagePlaceholder({ label }) {
  return (
    <div className="screenshot-placeholder">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <circle cx="8.5" cy="8.5" r="1.5"></circle>
        <polyline points="21 15 16 10 5 21"></polyline>
      </svg>
      <span>{label}</span>
    </div>
  )
}

function CopyBlock({ command, copiedText, onCopy }) {
  return (
    <div className="code-block-wrapper">
      <pre>{command}</pre>
      <button className="btn-copy" onClick={() => onCopy(command)}>
        {copiedText === command ? '\u2713' : '\u2750'}
      </button>
    </div>
  )
}

function MockupUI() {
  return (
    <div style={{ background: '#0e1117', height: '480px', padding: '1.5rem', display: 'flex', gap: '1rem', color: '#fff', fontSize: '0.85rem', borderRadius: '0 0 12px 12px' }}>
      <div style={{ width: '220px', background: '#161b22', borderRadius: '8px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
        <div style={{ fontWeight: '800', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Chat History</span>
          <span style={{ fontSize: '0.75rem', background: '#00f2fe', color: '#090a0f', padding: '2px 6px', borderRadius: '4px' }}>Active</span>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.5rem', borderRadius: '6px', borderLeft: '3px solid #00f2fe' }}>Uncensored Assistant</div>
        <div style={{ padding: '0.5rem', color: '#8b949e' }}>Document Ingestion</div>
        <div style={{ padding: '0.5rem', color: '#8b949e' }}>System Prompts</div>
        <div style={{ marginTop: 'auto', background: 'rgba(0,242,254,0.05)', border: '1px dashed rgba(0,242,254,0.3)', padding: '0.75rem', borderRadius: '6px', fontSize: '0.75rem' }}>
          <div style={{ fontWeight: '700', color: '#00f2fe' }}>Ollama Engine: Online</div>
          <div style={{ color: '#8b949e', marginTop: '4px' }}>Model: Gemma 2 2B</div>
        </div>
      </div>
      <div style={{ flexGrow: 1, background: '#161b22', borderRadius: '8px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: '700', fontSize: '0.95rem' }}>PortLLM Uncensored Chat Interface</span>
          <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.75rem', color: '#8b949e' }}>
            <span>CPU: <strong style={{ color: '#27c93f' }}>18%</strong></span>
            <span>RAM: <strong style={{ color: '#ffbd2e' }}>4.2 GB</strong></span>
          </div>
        </div>
        <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <div style={{ background: '#00f2fe', color: '#090a0f', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', flexShrink: 0 }}>U</div>
            <div style={{ background: '#0d0e11', padding: '0.75rem 1rem', borderRadius: '0 12px 12px 12px', maxWidth: '85%', lineHeight: '1.4' }}>
              Explain the core logic of PortLLM and why it is private.
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <div style={{ background: '#4facfe', color: '#090a0f', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', flexShrink: 0 }}>AI</div>
            <div style={{ background: '#21262d', padding: '0.75rem 1rem', borderRadius: '0 12px 12px 12px', maxWidth: '85%', lineHeight: '1.4', color: '#c9d1d9' }}>
              PortLLM is completely private because it runs 100% locally. The application wraps portable Python and pre-compiled Ollama/Llama.cpp binaries inside a single folder. When you send a prompt, it is compiled locally on your host CPU/GPU and no data ever leaves the local drive.
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
          <input type="text" placeholder="Type an uncensored prompt..." disabled style={{ flexGrow: 1, background: '#0d0e11', border: '1px solid #30363d', borderRadius: '6px', padding: '0.75rem', color: '#fff', outline: 'none', fontFamily: 'inherit' }} />
          <button disabled style={{ background: '#00f2fe', color: '#090a0f', border: 'none', borderRadius: '6px', padding: '0.75rem 1.25rem', fontWeight: '700', cursor: 'default' }}>Send</button>
        </div>
      </div>
    </div>
  )
}

/* ========================================
   VIDEO FADE LOOP HOOK
   ======================================== */
function useVideoFadeLoop(videoRef) {
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    let rafId = null

    function tick() {
      if (!video || !video.duration) {
        rafId = requestAnimationFrame(tick)
        return
      }
      const t = video.currentTime
      const d = video.duration
      const fadeWindow = 0.5

      if (t < fadeWindow) {
        video.style.opacity = String(t / fadeWindow)
      } else if (t > d - fadeWindow) {
        video.style.opacity = String((d - t) / fadeWindow)
      } else {
        video.style.opacity = '1'
      }

      rafId = requestAnimationFrame(tick)
    }

    function onEnded() {
      video.style.opacity = '0'
      setTimeout(() => {
        video.currentTime = 0
        video.play()
      }, 100)
    }

    video.addEventListener('ended', onEnded)
    rafId = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(rafId)
      video.removeEventListener('ended', onEnded)
    }
  }, [videoRef])
}

/* ========================================
   MAIN APP COMPONENT
   ======================================== */
export default function App() {
  const [activeOS, setActiveOS] = useState('windows')
  const [catalogTab, setCatalogTab] = useState('desktop')
  const [copied, setCopied] = useState('')
  const [openFAQ, setOpenFAQ] = useState(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [showSplash, setShowSplash] = useState(true)
  const [touchStartY, setTouchStartY] = useState(0)
  const videoRef = useRef(null)

  useVideoFadeLoop(videoRef)

  useEffect(() => {
    const handleWheel = (e) => {
      if (showSplash) {
        e.preventDefault()
        const scrollDelta = e.deltaY * 0.0009
        const newProgress = Math.min(Math.max(scrollProgress + scrollDelta, 0), 1)
        setScrollProgress(newProgress)
        if (newProgress >= 1) {
          setShowSplash(false)
        }
      } else if (window.scrollY <= 0 && e.deltaY < 0) {
        e.preventDefault()
        setShowSplash(true)
        setScrollProgress(1)
      }
    }

    const handleTouchStart = (e) => {
      setTouchStartY(e.touches[0].clientY)
    }

    const handleTouchMove = (e) => {
      if (showSplash) {
        e.preventDefault()
        if (!touchStartY) return
        const touchY = e.touches[0].clientY
        const deltaY = touchStartY - touchY
        const scrollDelta = deltaY * 0.006
        const newProgress = Math.min(Math.max(scrollProgress + scrollDelta, 0), 1)
        setScrollProgress(newProgress)
        if (newProgress >= 1) {
          setShowSplash(false)
        }
        setTouchStartY(touchY)
      } else if (window.scrollY <= 0) {
        const touchY = e.touches[0].clientY
        const deltaY = touchStartY - touchY
        if (deltaY < -20) {
          e.preventDefault()
          setShowSplash(true)
          setScrollProgress(1)
        }
        setTouchStartY(touchY)
      }
    }

    const handleScroll = () => {
      if (showSplash) {
        window.scrollTo(0, 0)
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('scroll', handleScroll)
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: false })

    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
    }
  }, [scrollProgress, showSplash, touchStartY])

  function handleCopy(text) {
    navigator.clipboard.writeText(text)
    setCopied(text)
    setTimeout(() => setCopied(''), 2000)
  }

  const models = catalogTab === 'desktop' ? DESKTOP_MODELS : MOBILE_MODELS

  return (
    <div className="page-root">

      {/* Splash Overlay Elements */}
      {showSplash && (
        <div className="splash-backdrop-layer">
          <div 
            className="splash-bg-image"
            style={{
              opacity: 1 - scrollProgress,
              backgroundImage: "url('https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1920&auto=format&fit=crop')",
            }}
          />
          
          {/* Expanding Video Container */}
          <div
            className="absolute z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-2xl overflow-hidden"
            style={{
              width: `${300 + scrollProgress * (window.innerWidth - 300)}px`,
              height: `${400 + scrollProgress * (window.innerHeight - 400)}px`,
              borderRadius: `${16 * (1 - scrollProgress)}px`,
              boxShadow: `0 15px 50px rgba(0, 0, 0, ${0.35 * (1 - scrollProgress)})`,
              transition: 'none',
            }}
          >
            <video
              src={HERO_VIDEO}
              autoPlay
              muted
              loop
              playsInline
              className="hero-video"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          <div className="splash-title-container">
            <h2 
              className="splash-title-word-1"
              style={{ transform: `translateX(-${scrollProgress * 150}vw)` }}
            >
              Welcome
            </h2>
            <h2 
              className="splash-title-word-2"
              style={{ transform: `translateX(${scrollProgress * 150}vw)` }}
            >
              to PortLLM
            </h2>
          </div>

          <div className="splash-subtitle-container" style={{ opacity: 1 - scrollProgress }}>
            <p>Offline Local AI Sandbox</p>
            <p className="animate-pulse" style={{ marginTop: '4px' }}>Scroll down to unlock</p>
          </div>
        </div>
      )}

      {/* Main Page Content Layer */}
      <div 
        className="main-page-content"
        style={{
          opacity: showSplash ? 0 : 1,
          transition: 'opacity 0.8s ease-in-out',
          position: 'relative',
          zIndex: showSplash ? 5 : 10,
        }}
      >
        {/* ============ HERO WRAPPER (white bg + video at bottom) ============ */}
        <div className="hero-wrapper">

        {/* Video Background Layer */}
        <div className="hero-video-layer">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="hero-video"
            style={{ opacity: 0 }}
          >
            <source src={HERO_VIDEO} type="video/mp4" />
          </video>
          <div className="hero-gradient-top"></div>
          <div className="hero-gradient-bottom"></div>
        </div>

        {/* Navigation */}
        <header className="hero-nav">
          <div className="hero-nav-inner">
            <a href="#" className="hero-logo">PortLLM</a>
            <nav className="hero-nav-links">
              <a href="#setup" className="hero-nav-link active">Home</a>
              <a href="#features" className="hero-nav-link">Features</a>
              <a href="#models" className="hero-nav-link">Models</a>
              <a href="#faq" className="hero-nav-link">FAQ</a>
            </nav>
            <div className="hero-nav-ctas">
              <a href={GITHUB_REPO} className="hero-nav-github" target="_blank" rel="noopener noreferrer" title="View on GitHub">
                <GithubIcon size={18} />
              </a>
              <a href={GITHUB_ZIP} className="hero-nav-cta">
                <DownloadIcon size={14} className="btn-icon" />
                <span>Download ZIP</span>
              </a>
            </div>
          </div>
        </header>

        {/* Hero Content */}
        <section className="hero-content-area">
          <h1 className="hero-headline animate-fade-rise">
            Beyond <em>install,</em> your AI runs <em>free.</em>
          </h1>
          <p className="hero-description animate-fade-rise-delay">
            A fully portable, zero-dependency local AI sandbox. Run uncensored models
            directly from your USB drive or SSD. No internet. No installation. No compromise.
          </p>
          <div className="hero-cta-group animate-fade-rise-delay-2">
            <a href={GITHUB_ZIP} className="hero-cta-btn primary">
              <DownloadIcon size={18} className="btn-icon" />
              <span>Download ZIP</span>
            </a>
            <a href={GITHUB_REPO} className="hero-cta-btn secondary" target="_blank" rel="noopener noreferrer">
              <GithubIcon size={18} className="btn-icon" />
              <span>View on GitHub</span>
            </a>
          </div>
        </section>
      </div>

      {/* ============ FLOATING MOCKUP with 3D Scroll Animation ============ */}
      <section className="floating-mockup-section">
        <ContainerScroll
          titleComponent={null}
        >
          <div className="mockup-card-container" style={{ margin: 0, padding: 0 }}>
            <div className="mockup-card" style={{ margin: 0, maxWidth: '100%', borderRadius: 0, border: 'none', boxShadow: 'none' }}>
              <div className="mockup-window-header">
                <div className="window-dots">
                  <span className="window-dot red"></span>
                  <span className="window-dot yellow"></span>
                  <span className="window-dot green"></span>
                </div>
                <div className="window-title">PortLLM UI &mdash; Local Server Active</div>
                <div style={{ width: '40px' }}></div>
              </div>
              <MockupUI />
            </div>
          </div>
        </ContainerScroll>
      </section>

      {/* ============ LIGHT CONTENT (kept as-is) ============ */}
      <main className="light-content-section" id="setup">
        <div className="section-container">

          <div className="section-header">
            <span className="section-badge">Documentation</span>
            <h2 className="section-title">Quick Installation and Setup</h2>
            <p className="section-subtitle">Follow these simple steps to initialize the offline engine and launch your local AI sandbox environment in seconds.</p>
          </div>

          <div className="os-tabs-container">
            <div className="os-tabs-list">
              {['windows', 'macos', 'linux', 'android'].map((os) => (
                <button key={os} className={`os-tab-btn ${activeOS === os ? 'active' : ''}`} onClick={() => setActiveOS(os)}>
                  {os === 'windows' ? 'Windows' : os === 'macos' ? 'macOS' : os === 'linux' ? 'Linux' : 'Android (Termux)'}
                </button>
              ))}
            </div>

            <div className="os-tab-panel">
              {activeOS === 'windows' && (
                <div className="timeline-content-wrapper">
                  <div className="timeline">
                    <div className="timeline-step">
                      <div className="timeline-marker"></div>
                      <span className="timeline-step-badge">Step 1</span>
                      <h3 className="timeline-step-title">Initialize the Setup</h3>
                      <p className="timeline-step-desc">Open your local project directory or USB drive, navigate to the <strong>Windows/</strong> folder, and double-click <strong>install.bat</strong>. This initializes folder paths and prepares portable runtimes.</p>
                      <ImagePlaceholder label="Screenshot: Running install.bat menu" />
                    </div>
                    <div className="timeline-step">
                      <div className="timeline-marker"></div>
                      <span className="timeline-step-badge">Step 2</span>
                      <h3 className="timeline-step-title">Choose and Download Model</h3>
                      <p className="timeline-step-desc">Select a curated uncensored model from the CLI menu catalog (we recommend <strong>Option [1] Gemma 2 2B Abliterated</strong>). The setup automatically installs the engine and downloads files into your Shared directory.</p>
                      <ImagePlaceholder label="Screenshot: Selecting and downloading GGUF weights" />
                    </div>
                    <div className="timeline-step">
                      <div className="timeline-marker"></div>
                      <span className="timeline-step-badge">Step 3</span>
                      <h3 className="timeline-step-title">Launch the AI Dashboard</h3>
                      <p className="timeline-step-desc">Double-click <strong>start-portllm.bat</strong>. The offline Ollama engine spins up securely in the background, and your browser opens to serve the local Chat UI automatically on port 3333.</p>
                      <ImagePlaceholder label="Screenshot: PortLLM Dashboard loading" />
                    </div>
                  </div>
                </div>
              )}

              {activeOS === 'macos' && (
                <div className="timeline-content-wrapper">
                  <div className="timeline">
                    <div className="timeline-step">
                      <div className="timeline-marker"></div>
                      <span className="timeline-step-badge">Step 1</span>
                      <h3 className="timeline-step-title">Run macOS Installer</h3>
                      <p className="timeline-step-desc">Open your terminal window, drag in the installer script, and press Enter:</p>
                      <CopyBlock command="./Mac/install.command" copiedText={copied} onCopy={handleCopy} />
                    </div>
                    <div className="timeline-step">
                      <div className="timeline-marker"></div>
                      <span className="timeline-step-badge">Step 2</span>
                      <h3 className="timeline-step-title">Launch the Launcher</h3>
                      <p className="timeline-step-desc">Once the setup compiles the offline runtime, execute the start script:</p>
                      <CopyBlock command="./Mac/start.command" copiedText={copied} onCopy={handleCopy} />
                    </div>
                  </div>
                </div>
              )}

              {activeOS === 'linux' && (
                <div className="timeline-content-wrapper">
                  <div className="timeline">
                    <div className="timeline-step">
                      <div className="timeline-marker"></div>
                      <span className="timeline-step-badge">Step 1</span>
                      <h3 className="timeline-step-title">Run Linux Installer</h3>
                      <p className="timeline-step-desc">Ensure curl is installed, navigate to the folder in your terminal, and run:</p>
                      <CopyBlock command="bash Linux/install.sh" copiedText={copied} onCopy={handleCopy} />
                    </div>
                    <div className="timeline-step">
                      <div className="timeline-marker"></div>
                      <span className="timeline-step-badge">Step 2</span>
                      <h3 className="timeline-step-title">Execute start command</h3>
                      <p className="timeline-step-desc">Run the local start launcher script to boot up the offline server:</p>
                      <CopyBlock command="bash Linux/start.sh" copiedText={copied} onCopy={handleCopy} />
                    </div>
                  </div>
                </div>
              )}

              {activeOS === 'android' && (
                <div className="timeline-content-wrapper">
                  <div className="timeline">
                    <div className="timeline-step">
                      <div className="timeline-marker"></div>
                      <span className="timeline-step-badge">Step 1</span>
                      <h3 className="timeline-step-title">Prepare Termux Environment</h3>
                      <p className="timeline-step-desc">Install Termux from F-Droid. Open the terminal and clone the repository:</p>
                      <CopyBlock command="git clone https://github.com/Abhichy18/PortLLM.git" copiedText={copied} onCopy={handleCopy} />
                    </div>
                    <div className="timeline-step">
                      <div className="timeline-marker"></div>
                      <span className="timeline-step-badge">Step 2</span>
                      <h3 className="timeline-step-title">Native Compilation</h3>
                      <p className="timeline-step-desc">Compile the native llama-server engine on your processor and download your GGUF model weights:</p>
                      <CopyBlock command="cd PortLLM && bash Android/install.sh" copiedText={copied} onCopy={handleCopy} />
                    </div>
                    <div className="timeline-step">
                      <div className="timeline-marker"></div>
                      <span className="timeline-step-badge">Step 3</span>
                      <h3 className="timeline-step-title">Launch on Android</h3>
                      <p className="timeline-step-desc">Execute the start launcher. Termux will boot the local server and open your default browser:</p>
                      <CopyBlock command="bash Android/start.sh" copiedText={copied} onCopy={handleCopy} />
                      <div className="info-callout">
                        <strong>Android Tip:</strong> Run <code>termux-wake-lock</code> before starting the server. This prevents Android from killing background AI threads.
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="comparison-container" id="features">
            <div className="section-header">
              <span className="section-badge">Features</span>
              <h2 className="section-title">Why Choose PortLLM?</h2>
              <p className="section-subtitle">A comparison of PortLLM unified cross-platform portability features against standard local LLM clients.</p>
            </div>
            <div className="comparison-grid">
              <div className="comparison-card">
                <div className="comp-icon-box cyan">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>
                </div>
                <h3 className="comp-card-title">100% Portable Sandboxing</h3>
                <p className="comp-card-desc">Runs directly from an external USB/SSD without host installation or administrator permissions. Bypasses registry pollution and keeps everything self-contained.</p>
              </div>
              <div className="comparison-card">
                <div className="comp-icon-box purple">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                </div>
                <h3 className="comp-card-title">Cross-Platform Shared Models</h3>
                <p className="comp-card-desc">Download a model weight once into the Shared directory and run it natively on Windows, macOS, Linux, and Android devices without duplicate downloads.</p>
              </div>
              <div className="comparison-card">
                <div className="comp-icon-box cyan">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                </div>
                <h3 className="comp-card-title">Hardware Telemetry Dashboard</h3>
                <p className="comp-card-desc">Features a lightweight Python server with pure stdlib/ctypes telemetry, rendering real-time CPU and RAM utilization metrics directly on your chat interface.</p>
              </div>
            </div>
          </div>

          <div className="catalog-container" id="models">
            <div className="section-header">
              <span className="section-badge">Model Library</span>
              <h2 className="section-title">Curated Uncensored Models</h2>
              <p className="section-subtitle">Select from our list of pre-configured GGUF model files optimized for local execution.</p>
            </div>
            <div className="catalog-tabs">
              <button className={`catalog-tab-btn ${catalogTab === 'desktop' ? 'active' : ''}`} onClick={() => setCatalogTab('desktop')}>Desktop Catalogs</button>
              <button className={`catalog-tab-btn ${catalogTab === 'mobile' ? 'active' : ''}`} onClick={() => setCatalogTab('mobile')}>Mobile Catalogs</button>
            </div>
            <div className="catalog-grid">
              {models.map((m, i) => (
                <div className="model-card" key={i}>
                  <div className="model-header">
                    <span className={`model-badge ${m.label === 'UNCENSORED' ? 'uncensored' : 'standard'}`}>{m.label}</span>
                    <span className="model-size">{m.size}</span>
                  </div>
                  <h3 className="model-name">{m.name}</h3>
                  <p className="model-desc">{m.desc}</p>
                  <div className="model-meta"><span>Tag: {m.badge}</span></div>
                </div>
              ))}
            </div>
          </div>

          <div className="faq-container" id="faq">
            <div className="section-header">
              <span className="section-badge">FAQ</span>
              <h2 className="section-title">Frequently Asked Questions</h2>
              <p className="section-subtitle">Find answers to common technical queries about the PortLLM environment setup.</p>
            </div>
            <div className="faq-list">
              {FAQS.map((faq, i) => (
                <div className={`faq-item ${openFAQ === i ? 'active' : ''}`} key={i}>
                  <button className="faq-question" onClick={() => setOpenFAQ(openFAQ === i ? null : i)}>
                    <span>{faq.q}</span>
                    <ChevronIcon />
                  </button>
                  <div className="faq-answer"><p>{faq.a}</p></div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>

      {/* FOOTER */}
      <footer className="site-footer">
        <div className="footer-container">
          <a href="#" className="footer-logo">PortLLM</a>
          <ul className="footer-links">
            <li><a href="#setup" className="footer-link">Setup</a></li>
            <li><a href="#features" className="footer-link">Features</a></li>
            <li><a href="#models" className="footer-link">Models</a></li>
            <li><a href={GITHUB_REPO} className="footer-link" target="_blank" rel="noopener noreferrer">GitHub</a></li>
          </ul>
          <p className="footer-credits">PortLLM is designed for computational privacy and absolute freedom. Built upon open-source local LLM concepts, extended with custom cross-platform runtimes, telemetry systems, and zero-dependency architectures. MIT Licensed.</p>
        </div>
      </footer>
      </div>
    </div>
  )
}
