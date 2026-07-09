import { useState, useEffect, useRef } from 'react'
import './App.css'
import { ContainerScroll } from './components/ui/ContainerScroll.jsx'
import DisplayCards from './components/ui/DisplayCards.jsx'

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

function LinkedinIcon({ size = 20, className = "" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
      <rect x="2" y="9" width="4" height="12"></rect>
      <circle cx="4" cy="4" r="2"></circle>
    </svg>
  )
}

function TwitterIcon({ size = 20, className = "" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
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
const TAPE_SVG = (
  <svg xmlns="http://www.w3.org/2000/svg" width="95" height="80" viewBox="0 0 95 80" fill="none">
    <path d="M1 45L70.282 5L88.282 36.1769L19 76.1769L1 45Z" fill="#222222"/>
    <path d="M69.6829 39.997C74.772 36.9233 80.2799 35.022 85.4464 32.0415C85.5584 31.9769 85.6703 31.912 85.782 31.8468L83.9519 38.6769C80.2833 32.3886 75.7064 26.4975 72.2275 20.0846C70.0007 15.9783 67.7966 11.8425 65.6183 7.69261L72.9746 9.66373C70.566 10.9281 68.1526 12.1837 65.7375 13.4301C59.1543 16.828 52.5477 20.1634 45.9059 23.4675C39.2779 26.7637 32.6138 30.0293 25.946 33.2683C21.417 35.4683 16.8774 37.6611 12.3408 39.8468C10.3494 40.8065 8.36335 41.7623 6.37228 42.7203C4.88674 43.4348 3.40117 44.1492 1.91563 44.8637C1.70897 44.9628 1.48389 45.0108 1.28779 44.994C1.0916 44.977 0.940536 44.8975 0.866099 44.7681C0.791689 44.6386 0.798739 44.4674 0.882816 44.289C0.966978 44.111 1.12195 43.9408 1.31146 43.8119C2.68692 42.8791 4.06239 41.9462 5.43785 41.0134C6.96571 39.9774 8.49068 38.9427 10.0185 37.9078C10.5758 38.2934 11.1526 38.4968 11.9006 38.3019C12.2823 38.2024 12.7844 37.9628 13.0812 37.66C13.3477 37.388 13.4958 37.092 13.6361 36.8103C13.7828 36.5157 13.922 36.236 14.1819 36.0157C14.6227 35.6416 14.9608 35.1461 15.3159 34.6256C15.4451 34.4362 15.5766 34.2432 15.7162 34.0517C17.1755 33.0653 18.6355 32.0797 20.0958 31.0952C20.7161 30.8123 21.2829 30.546 21.7287 30.2596C22.1286 30.0027 22.4405 29.6732 22.7349 29.3173C22.9611 29.1651 23.1873 29.0128 23.4135 28.8606C24.8734 27.8785 26.3349 26.8977 27.7969 25.9178C29.0653 25.3742 30.3884 24.7936 32.0404 23.9203C32.7524 23.544 33.4842 23.2235 34.1877 22.9153C35.2267 22.4601 36.204 22.0318 36.9653 21.4906C37.4742 21.1289 38.0837 20.8769 38.6916 20.6256C39.507 20.2886 40.3209 19.9521 40.8884 19.3523C41.2452 18.9751 41.5509 18.5904 41.8339 18.234C42.2841 17.6669 42.6773 17.1712 43.1308 16.8909C43.9827 16.3643 44.6366 15.763 45.2128 15.2329C45.9058 14.5954 46.4871 14.0607 47.1661 13.8832C47.2691 13.8563 47.3895 13.83 47.5253 13.8008C48.2409 13.6467 49.3854 13.4004 50.6721 12.4297C51.1302 12.084 51.5022 11.6584 51.8663 11.2413C52.3964 10.634 52.9113 10.0444 53.6546 9.74536C53.7656 9.70072 53.9081 9.70004 54.0379 9.69961C54.203 9.69906 54.3472 9.69852 54.3802 9.60751C54.4771 9.34055 54.6749 8.99305 54.8896 8.61527C55.0473 8.33772 55.2144 8.04348 55.3576 7.75325C57.0866 6.63773 58.8181 5.52571 60.5527 4.41789C61.3473 3.91034 62.1427 3.40353 62.9389 2.89753C63.4939 2.89483 64.0449 2.86301 64.5895 2.76514C65.3015 2.63711 66.1031 2.26098 67.1366 1.7766C67.4515 1.62902 67.788 1.47135 68.1502 1.30751C70.2985 0.211054 72.8781 0.719848 73.9745 2.86814C74.2063 3.38051 74.4505 3.94413 74.6959 4.57024C75.4715 6.54841 76.6121 8.38172 77.451 9.4943C77.6285 9.72958 77.8088 9.965 78.0022 10.2164C78.7359 11.1701 79.6521 12.3598 81.2553 14.6987C82.7718 16.9111 83.9554 18.8538 84.8446 20.3132C85.2985 21.0581 85.6753 21.6776 85.981 22.1424C86.5039 22.9378 87.13 23.9238 87.7583 24.9138C88.7415 26.463 89.7306 28.0221 90.3417 28.8752C90.5592 29.1788 90.7935 29.4941 91.046 29.8348C91.6954 30.711 92.4701 31.7564 93.4198 33.2106C94.9454 36.1998 94.2374 39.789 91.2483 41.3146C91.1356 41.3882 91.0205 41.4628 90.9029 41.5385C89.1849 42.6436 88.0561 43.2181 86.8458 43.7492C86.3539 43.965 85.8291 43.9984 85.2883 44.0321C84.5207 44.08 83.72 44.1298 82.9316 44.7081C82.7476 44.8431 82.5657 45.0123 82.3757 45.1895C82.0265 45.5149 81.649 45.8671 81.1774 46.0805C81.0129 46.1549 80.8442 46.1792 80.6788 46.2029C80.4969 46.229 80.3186 46.2548 80.1526 46.3463C79.5326 46.6883 78.9438 47.0464 78.4208 47.3647C77.7463 47.7753 77.1806 48.1194 76.7972 48.2768C76.1137 48.5573 75.4647 49.0342 74.8076 49.5175C74.3056 49.8867 73.7989 50.2601 73.2678 50.5517C71.7504 51.3848 69.7735 52.7209 67.7901 54.1904C67.0396 54.7464 66.2862 55.0138 65.3207 55.3561C64.7201 55.569 64.0372 55.8105 63.2221 56.1693C62.76 56.3726 62.4565 56.6971 62.1754 56.9973C61.9165 57.2738 61.6763 57.5299 61.3489 57.6526C61.0599 57.7608 60.7846 57.6688 60.5231 57.5815C60.2321 57.4843 59.9583 57.3929 59.702 57.5895C59.5657 57.6942 59.4406 57.8919 59.2918 58.1269C59.233 58.2198 59.1699 58.3187 59.1013 58.4201C59.0842 58.3791 59.0657 58.3442 59.0579 58.3069C58.9457 58.1356 58.6072 58.2028 58.2752 58.2689C58.1427 58.2953 58.0108 58.3219 57.8957 58.3319C57.4719 58.3686 56.8253 58.708 56.3466 58.9941C56.144 59.1151 55.9262 59.1653 55.672 59.224C55.4463 59.2761 55.1919 59.3347 54.894 59.4553C54.7241 59.5242 54.5728 59.541 54.4474 59.5545C54.3567 59.5642 54.2794 59.5724 54.2182 59.5982C54.1652 59.6205 54.1556 59.6959 54.1448 59.7807C54.137 59.8418 54.1285 59.908 54.1028 59.9628C54.0412 60.0939 53.9214 60.1919 53.8153 60.2225C53.7663 60.2366 53.7206 60.2358 53.6753 60.2349C53.6225 60.234 53.5698 60.2326 53.5113 60.2553C53.2429 60.3595 53.0377 60.5575 52.8246 60.7633C52.5903 60.9894 52.3457 61.225 51.9975 61.3556C51.8879 61.3967 51.7593 61.42 51.6348 61.4426C51.5045 61.4661 51.378 61.4893 51.2831 61.5308C50.8977 61.6994 50.6327 62.0265 50.389 62.3273C50.2269 62.5274 50.0737 62.716 49.9013 62.8385C49.5852 63.063 49.4962 63.3233 49.4307 63.5155C49.3967 63.615 49.3692 63.6966 49.3191 63.7453C49.2628 63.772 49.2053 63.7983 49.1487 63.8235C49.093 63.8403 49.0355 63.8576 48.9902 63.8888C48.9867 63.8912 48.9836 63.8939 48.9802 63.8963C48.6593 64.0309 48.3345 64.1466 48.0116 64.2613C47.2865 64.519 46.5701 64.7733 45.9244 65.2359C45.7853 65.3355 45.6724 65.487 45.5575 65.641C45.4167 65.8297 45.2727 66.0228 45.0741 66.1295C44.6008 66.3839 44.0696 66.5483 43.5464 66.7102C42.7594 66.9536 41.9904 67.1916 41.4633 67.722C41.2894 67.897 41.142 68.1064 40.9944 68.3169C40.9122 68.4342 40.8296 68.5523 40.7422 68.6643C40.7169 68.5646 40.6833 68.4767 40.652 68.3947C40.5875 68.2257 40.5324 68.081 40.5769 67.9054C40.6823 67.4901 40.7644 66.9549 40.5779 66.7069C40.5272 66.6396 40.4878 66.5548 40.4487 66.4691C40.3507 66.254 40.2505 66.0344 39.9558 66.0791C39.7572 66.1092 39.2569 66.204 39.082 66.5127C39.044 66.5799 39.0478 66.6675 39.0518 66.7648C39.0592 66.9397 39.0675 67.1471 38.838 67.329C38.7994 67.3596 38.7566 67.3917 38.7122 67.4244C38.5349 67.5546 38.3363 67.7 38.3194 67.8538C38.3 68.0309 38.4017 68.1621 38.5204 68.3152C38.6749 68.5145 38.8585 68.7512 38.8407 69.1745C38.8371 69.2583 38.7749 69.3221 38.728 69.3705C38.695 69.4045 38.6699 69.4309 38.6775 69.4511C38.6864 69.4742 38.7244 69.511 38.7726 69.5575C38.9428 69.7213 39.2396 70.008 38.8369 70.2599C38.7279 70.328 38.5912 70.3851 38.4686 70.4362C38.2879 70.5115 38.1379 70.5742 38.1516 70.6412C38.1569 70.6665 38.1652 70.6925 38.175 70.7189C38.0372 70.7894 37.8994 70.8599 37.7617 70.9305C37.5513 70.9626 37.3136 71.1075 37.017 71.2886C36.9451 71.3326 36.8691 71.3787 36.7896 71.4258C36.5175 71.5644 36.2453 71.7032 35.973 71.8416C35.7472 71.9341 35.4976 72.0165 35.2199 72.0788C34.6635 72.2038 34.1132 72.1978 33.5754 72.1917C33.3488 72.1891 33.1241 72.1864 32.9021 72.1937C32.9618 72.1444 33.0138 72.0968 33.0493 72.0522C33.292 71.7467 33.2773 71.4299 33.2636 71.1383C33.2545 70.9444 33.246 70.7614 33.3141 70.6009C33.4387 70.3069 33.3041 70.125 33.2048 69.9903C33.1532 69.9205 33.1115 69.863 33.1199 69.8097C33.1268 69.7669 33.1736 69.7216 33.2219 69.6748C33.264 69.6341 33.3074 69.5918 33.3263 69.5495C33.5565 69.0365 33.3423 68.9396 33.0306 68.7984C32.8587 68.7205 32.6575 68.6289 32.4843 68.4469C32.3112 68.2483 32.2881 68.1742 32.4435 67.9656C32.2185 67.9481 31.9934 67.9305 31.7683 67.913C31.7092 67.9567 31.7012 68.0535 31.7002 68.2073C31.6983 68.482 31.3496 68.7833 31.0772 69.0187C30.951 69.1277 30.8413 69.2227 30.7898 69.2944C30.5158 69.6756 30.7581 69.8463 30.9714 69.9966C31.0888 70.0793 31.1972 70.1559 31.206 70.2579C31.2099 70.3014 31.2524 70.3223 31.2955 70.3438C31.3288 70.3604 31.3629 70.3772 31.3798 70.4049C31.5026 70.6062 31.3709 70.8843 31.2487 71.1425C31.1788 71.2903 31.1123 71.4317 31.098 71.5486C31.0936 71.5842 31.0933 71.6181 31.0936 71.6508C31.0939 71.6984 31.0938 71.7441 31.0797 71.7913C31.0475 71.899 30.9277 72.0281 30.7962 72.1694C30.7288 72.2419 30.6585 72.3175 30.5954 72.3951C30.5137 72.4957 30.5226 72.5982 30.5314 72.7056C30.5377 72.7814 30.5436 72.8599 30.5186 72.9418C30.4732 73.0899 30.294 73.2374 30.1276 73.3743C30.0552 73.434 29.9853 73.492 29.9298 73.5468C29.9072 73.5691 29.9025 73.5904 29.9107 73.611C29.6455 73.8494 29.3946 74.0812 29.1507 74.3073C27.928 75.4406 26.8699 76.422 24.9338 77.2712C24.5678 77.4317 24.2027 77.6527 23.847 77.8987C22.8466 78.3902 21.8448 78.8802 20.8427 79.3685C18.9858 80.3162 16.7561 79.8764 15.8084 78.0196C15.6912 77.779 15.5741 77.5385 15.4571 77.2979C15.5046 76.9554 15.4922 76.5771 15.4159 76.1649C15.2724 75.3908 14.9393 74.7016 14.5464 73.8883C14.2558 73.287 13.9326 72.6178 13.6287 71.7959C13.1181 70.415 12.555 69.0197 11.8089 67.5091C11.066 66.0051 10.1771 64.3053 9.52376 63.1169C9.16763 62.469 8.944 61.7017 8.73537 60.9866C8.44191 59.9808 8.17835 59.0784 7.61958 58.7572C7.44108 58.6546 7.19967 58.5953 6.96499 58.5373C6.79786 58.496 6.63406 58.4547 6.49825 58.4001L1.91563 44.8637Z" fill="#222222"/>
  </svg>
)

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
        {/* Background Video Layer */}
        <div className="mockup-video-bg-layer">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="mockup-video-bg"
          >
            <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260503_101827_abebfeec-f243-466b-b494-7f6814c0fbbf.mp4" type="video/mp4" />
          </video>
          <div className="mockup-video-overlay" />
        </div>
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
            <div className="features-split-layout">
              {/* Left Column: Heading and Bullet Points */}
              <div className="features-split-info">
                <div className="section-header">
                  <span className="section-badge">Features</span>
                  <h2 className="section-title">Why Choose PortLLM?</h2>
                  <p className="section-subtitle">
                    A highly optimized local AI environment designed for portability, privacy, and absolute user freedom.
                  </p>
                </div>
                <ul className="features-bullet-list">
                  <li className="features-bullet-item">
                    <span className="features-bullet-dot" />
                    <span><strong>True Portability:</strong> Put your runtimes and models on a single USB/SSD and run anywhere.</span>
                  </li>
                  <li className="features-bullet-item">
                    <span className="features-bullet-dot" />
                    <span><strong>Unified Storage:</strong> Avoid redownloading models when switching devices.</span>
                  </li>
                  <li className="features-bullet-item">
                    <span className="features-bullet-dot" />
                    <span><strong>100% Offline:</strong> Air-gapped privacy. Your inputs never reach external servers.</span>
                  </li>
                  <li className="features-bullet-item">
                    <span className="features-bullet-dot" />
                    <span><strong>AVX-512 Optimized:</strong> Highly accelerated reasoning speeds on standard CPUs.</span>
                  </li>
                </ul>
              </div>

              {/* Right Column: Stacked 3D Cards Deck */}
              <div className="features-split-deck-container">
                <DisplayCards />
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

      {/* FOOTER - TAPED DESIGN */}
      <footer className="footer-taped-section">
        <div className="footer-taped-container">
          <div className="footer-taped-card">
            <div className="footer-tape-left">
              {TAPE_SVG}
            </div>
            <div className="footer-tape-right">
              {TAPE_SVG}
            </div>
            
            <div className="footer-taped-content-grid">
              {/* Left Brand Column */}
              <div className="footer-taped-brand">
                <a href="#" className="footer-taped-logo">
                  PortLLM
                </a>
                <p className="footer-taped-credits">
                  PortLLM is designed for computational privacy and absolute freedom. Built upon open-source local LLM concepts, extended with custom cross-platform runtimes, telemetry systems, and zero-dependency architectures.
                </p>
              </div>

              {/* Right Links Column */}
              <div className="footer-taped-links-column">
                <h4 className="footer-taped-heading">Navigation</h4>
                <div className="footer-taped-links">
                  <a href="#setup" className="footer-taped-link">Setup &amp; Installation</a>
                  <a href="#features" className="footer-taped-link">Features</a>
                  <a href="#models" className="footer-taped-link">Curated Models</a>
                  <a href={GITHUB_REPO} className="footer-taped-link" target="_blank" rel="noopener noreferrer">GitHub Source</a>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom copyright and social icons */}
          <div className="footer-taped-bottom">
            <div className="footer-taped-copyright-links">
              <p className="footer-taped-copyright">
                © {new Date().getFullYear()} PortLLM. All rights reserved.
              </p>
              <div className="footer-taped-legal-links">
                <a href="#setup">Privacy Policy</a>
                <a href="#setup">Terms &amp; Co</a>
                <span className="footer-taped-license">MIT Licensed</span>
              </div>
            </div>

            <div className="footer-taped-socials">
              <a
                href={GITHUB_REPO}
                target="_blank"
                rel="nofollow noopener noreferrer"
                aria-label="GitHub Repository"
                className="footer-taped-social-icon"
              >
                <GithubIcon size={20} />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="nofollow noopener noreferrer"
                aria-label="X (formerly Twitter)"
                className="footer-taped-social-icon"
              >
                <TwitterIcon className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="nofollow noopener noreferrer"
                aria-label="LinkedIn"
                className="footer-taped-social-icon"
              >
                <LinkedinIcon className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
      </div>
    </div>
  )
}
