import React, { useState, useRef, useEffect, useCallback, useMemo } from "react"
import { cn } from "../../lib/utils"

const PHYSICS = {
  MAX_RANGE: 40,            // Max pixels card can be dragged from center
  DAMAGE_THRESHOLD: 0.5,    // Velocity required to trigger damage/cracking
  DAMAGE_INCREMENT: 0.08,   // Damage added per impact frame
  RECOVERY_RATE: 0.05,      // Damage recovery speed when holding still
  RESPAWN_TIME_MS: 7000,    // Time before card automatically respawns
  DEBRIS_DISAPPEAR_MS: 3000, // Time before debris chunks fade away
  HEALING_DURATION_MS: 10000 // Time for full damage healing (10s)
}

const CHUNK_PATHS = [
  "M 0 0 L 20 5 L 15 25 L 5 20 Z",
  "M 5 0 L 25 10 L 15 30 L 0 25 Z",
  "M 10 5 L 30 0 L 25 25 L 5 30 Z",
  "M 0 10 L 20 0 L 30 20 L 10 30 Z",
]

const DEBRIS_THRESHOLDS = [0.3, 0.5, 0.7, 0.9]

const DebrisChunk = ({ x, y, rot, path }) => {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), PHYSICS.DEBRIS_DISAPPEAR_MS)
    return () => clearTimeout(timer)
  }, [])

  if (!visible) return null

  return (
    <svg
      className="absolute w-8 h-8 pointer-events-none z-30 overflow-visible"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: `rotate(${rot}deg)`,
        animation: `debris-fall 0.8s cubic-bezier(0.55, 0, 1, 0.45) 0s forwards`
      }}
    >
      <path d={path} fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
    </svg>
  )
}

const CrackLines = ({ level }) => {
  if (level < 0.1) return null

  return (
    <svg 
      className="crack-lines-svg" 
      viewBox="0 0 100 100" 
      preserveAspectRatio="none"
    >
      {level >= 0.1 && (
        <path 
          d="M0 20 L15 25 L8 40 L20 50" 
          fill="none" 
          stroke="#94a3b8" 
          strokeWidth="1.5" 
          vectorEffect="non-scaling-stroke" 
          style={{ opacity: Math.min(1, level * 2) }} 
        />
      )}
      {level >= 0.5 && (
        <path 
          d="M50 100 L55 80 L45 70 L60 55" 
          fill="none" 
          stroke="#94a3b8" 
          strokeWidth="1.5" 
          vectorEffect="non-scaling-stroke" 
          style={{ opacity: Math.min(1, (level - 0.4) * 2) }} 
        />
      )}
      {level >= 0.9 && (
        <path 
          d="M20 0 L25 20 L40 25 L35 45 L50 50" 
          fill="none" 
          stroke="#cbd5e1" 
          strokeWidth="2.5" 
          vectorEffect="non-scaling-stroke" 
          strokeDasharray="4 2" 
        />
      )}
    </svg>
  )
}

export function BreakableFAQCard({ question, answer, index }) {
  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [crackLevel, setCrackLevel] = useState(0) // 0.0 to 1.0
  const [isBroken, setIsBroken] = useState(false)
  const [fallState, setFallState] = useState({
    active: false,
    velocityX: 0,
    velocityY: 0,
    rotation: 0
  })
  const [debrisChunks, setDebrisChunks] = useState([])
  const [respawnProgress, setRespawnProgress] = useState(0)
  const [isFlashing, setIsFlashing] = useState(false)

  const lastPos = useRef({ x: 0, y: 0 })
  const startPos = useRef({ x: 0, y: 0 })
  const lastTime = useRef(Date.now())
  const shakeIntensity = useRef(0)
  const velocityRef = useRef({ x: 0, y: 0 })
  const crackLevelRef = useRef(0)
  const isBrokenRef = useRef(false)

  const cardId = useMemo(() => `card-${index}-${Math.random().toString(36).substr(2, 9)}`, [index])

  const triggerBreak = useCallback(() => {
    if (isBrokenRef.current) return
    isBrokenRef.current = true
    setIsBroken(true)
    setIsDragging(false)
    
    const vx = velocityRef.current.x
    const baseRotation = Math.max(-60, Math.min(60, vx))
    
    setFallState({
      active: true,
      velocityX: vx * 0.3,
      velocityY: 5,
      rotation: baseRotation
    })
  }, [])

  const spawnDebris = useCallback((level) => {
    const newChunks = []
    DEBRIS_THRESHOLDS.forEach((threshold, i) => {
      if (level >= threshold && debrisChunks.length <= i) {
        newChunks.push({
          id: Date.now() + i,
          x: Math.random() * 80 + 10,
          y: Math.random() * 80 + 10,
          rot: Math.random() * 360,
          path: CHUNK_PATHS[Math.floor(Math.random() * CHUNK_PATHS.length)]
        })
      }
    })
    if (newChunks.length > 0) {
      setDebrisChunks(prev => [...prev, ...newChunks])
    }
  }, [debrisChunks.length])

  const handleDragStart = useCallback((e) => {
    if (isBrokenRef.current) return
    setIsDragging(true)
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
    
    startPos.current = {
      x: clientX - position.x,
      y: clientY - position.y
    }
    lastPos.current = { x: clientX, y: clientY }
    lastTime.current = Date.now()
    shakeIntensity.current = 0
  }, [position.x, position.y])

  const handleDragMove = useCallback((clientX, clientY) => {
    if (!isDragging || isBrokenRef.current) return
    const now = Date.now()
    const dt = Math.max(1, now - lastTime.current)
    
    const dx = clientX - lastPos.current.x
    const dy = clientY - lastPos.current.y
    const vx = dx / dt
    const vy = dy / dt
    
    velocityRef.current = { x: vx * 100, y: vy * 100 }
    
    const newX = clientX - startPos.current.x
    const newY = clientY - startPos.current.y
    const clampedX = Math.max(-PHYSICS.MAX_RANGE, Math.min(PHYSICS.MAX_RANGE, newX))
    const clampedY = Math.max(-PHYSICS.MAX_RANGE, Math.min(PHYSICS.MAX_RANGE, newY))
    setPosition({ x: clampedX, y: clampedY })
    
    const pushedRight = clampedX >= PHYSICS.MAX_RANGE && vx > 0
    const pushedLeft = clampedX <= -PHYSICS.MAX_RANGE && vx < 0
    const pushedDown = clampedY >= PHYSICS.MAX_RANGE && vy > 0
    const pushedUp = clampedY <= -PHYSICS.MAX_RANGE && vy < 0
    
    const isHorizontalImpact = (pushedRight || pushedLeft) && Math.abs(vx) > PHYSICS.DAMAGE_THRESHOLD
    const isVerticalImpact = (pushedDown || pushedUp) && Math.abs(vy) > PHYSICS.DAMAGE_THRESHOLD
    
    if (isHorizontalImpact) {
      shakeIntensity.current += PHYSICS.DAMAGE_INCREMENT * 1.5
      setIsFlashing(true)
      setTimeout(() => setIsFlashing(false), 150)
    } else if (isVerticalImpact) {
      shakeIntensity.current += PHYSICS.DAMAGE_INCREMENT * 0.5
    } else {
      shakeIntensity.current = Math.max(0, shakeIntensity.current - PHYSICS.RECOVERY_RATE)
    }
    
    setCrackLevel(prev => {
      const newLevel = Math.min(1, prev + shakeIntensity.current * 0.025)
      crackLevelRef.current = newLevel
      spawnDebris(newLevel)
      if (newLevel >= 1) {
        setTimeout(() => triggerBreak(), 0)
      }
      return newLevel
    })
    
    lastPos.current = { x: clientX, y: clientY }
    lastTime.current = now
  }, [isDragging, spawnDebris, triggerBreak])

  const handleDragEnd = useCallback(() => {
    if (!isDragging) return
    setIsDragging(false)
    setPosition({ x: 0, y: 0 })
    shakeIntensity.current = 0
  }, [isDragging])

  useEffect(() => {
    if (!isDragging && !isBroken && crackLevel > 0) {
      const interval = setInterval(() => {
        setCrackLevel(prev => {
          const healAmount = 50 / PHYSICS.HEALING_DURATION_MS
          const newLevel = Math.max(0, prev - healAmount)
          crackLevelRef.current = newLevel
          if (newLevel <= 0) {
            setDebrisChunks([])
          }
          return newLevel
        })
      }, 50)
      return () => clearInterval(interval)
    }
  }, [isDragging, isBroken, crackLevel])

  useEffect(() => {
    if (isBroken) {
      setRespawnProgress(0)
      const startTime = Date.now()
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(100, (elapsed / PHYSICS.RESPAWN_TIME_MS) * 100)
        setRespawnProgress(progress)
        
        if (elapsed >= PHYSICS.RESPAWN_TIME_MS) {
          clearInterval(interval)
          setIsBroken(false)
          isBrokenRef.current = false
          setCrackLevel(0)
          crackLevelRef.current = 0
          setPosition({ x: 0, y: 0 })
          setDebrisChunks([])
          setFallState({ active: false, velocityX: 0, velocityY: 0, rotation: 0 })
          shakeIntensity.current = 0
          velocityRef.current = { x: 0, y: 0 }
          setRespawnProgress(0)
        }
      }, 50)
      return () => clearInterval(interval)
    }
  }, [isBroken])

  useEffect(() => {
    if (!isDragging) return
    const onMove = (e) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
      handleDragMove(clientX, clientY)
    }
    
    window.addEventListener("mousemove", onMove)
    window.addEventListener("mouseup", handleDragEnd)
    window.addEventListener("touchmove", onMove, { passive: false })
    window.addEventListener("touchend", handleDragEnd)
    
    return () => {
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mouseup", handleDragEnd)
      window.removeEventListener("touchmove", onMove)
      window.removeEventListener("touchend", handleDragEnd)
    }
  }, [isDragging, handleDragMove, handleDragEnd])

  const fallTransform = useMemo(() => {
    if (!fallState.active) return ''
    const horizontalDrift = fallState.velocityX * 5
    const rotation = fallState.rotation + (fallState.velocityX > 0 ? 45 : -45)
    return `translate(${horizontalDrift}px, 120vh) rotate(${rotation}deg)`
  }, [fallState])

  return (
    <div className="breakable-card-wrapper">
      {/* Layer 1: Remnant Box with Answer */}
      <div className="remnant-box">
        <div>
          <h4 className="remnant-answer-title">Answer</h4>
          <p className="remnant-answer-text">{answer}</p>
        </div>
        {isBroken && (
          <div className="flex flex-col gap-1 w-full">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest text-right">
              Restoring card...
            </span>
            <div className="remnant-respawn-bar">
              <div 
                className="remnant-respawn-progress" 
                style={{ width: `${respawnProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Layer 2: Debris Shards */}
      <div 
        className="pointer-events-none absolute inset-0 z-50 overflow-visible"
        style={{
          transform: isBroken
            ? fallTransform
            : `translate(${position.x}px, ${position.y}px) rotate(${position.x * 0.15}deg)`
        }}
      >
        {debrisChunks.map((chunk) => (
          <DebrisChunk
            key={chunk.id}
            x={chunk.x}
            y={chunk.y}
            rot={chunk.rot}
            path={chunk.path}
          />
        ))}
      </div>

      {/* Layer 3: Draggable Question Card */}
      <div
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
        className={cn(
          "interactive-card",
          isDragging && "is-dragging",
          isBroken && "pointer-events-none opacity-0",
          isFlashing && "is-flashing"
        )}
        style={{
          transform: isBroken
            ? fallTransform
            : `translate(${position.x}px, ${position.y}px) rotate(${position.x * 0.15}deg)`,
          transition: isDragging
            ? 'none'
            : isBroken
              ? 'transform 1.0s cubic-bezier(0.55, 0.085, 0.68, 0.53), opacity 1.0s ease-out'
              : 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
          maskImage: debrisChunks.length > 0 ? `url(#mask-${cardId})` : 'none',
          WebkitMaskImage: debrisChunks.length > 0 ? `url(#mask-${cardId})` : 'none',
          maskSize: '100% 100%',
          WebkitMaskSize: '100% 100%',
          maskRepeat: 'no-repeat',
          WebkitMaskRepeat: 'no-repeat',
        }}
      >
        <div className="card-top-indicator pointer-events-none">
          <span className="card-shake-badge">Grab &amp; Shake</span>
          <svg className="card-grab-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 3h6v6" />
            <path d="M9 21H3v-6" />
            <path d="M21 3l-7 7" />
            <path d="M3 21l7-7" />
          </svg>
        </div>

        <p className="card-question-text">{question}</p>

        <div className="card-bottom-row pointer-events-none">
          <span>Q. {(index + 1).toString().padStart(2, '0')}</span>
          <span className={cn("card-dmg-text", crackLevel > 0.7 && "damaged")}>
            {crackLevel > 0 ? `${Math.round(crackLevel * 100)}% Crack` : 'Intact'}
          </span>
        </div>

        <CrackLines level={crackLevel} />
        {crackLevel > 0.2 && (
          <div 
            className="absolute inset-0 bg-blue-500/10 mix-blend-multiply pointer-events-none" 
            style={{ opacity: crackLevel * 0.2 }} 
          />
        )}
      </div>

      {/* Layer 4: SVG Mask definition */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <mask id={`mask-${cardId}`} maskUnits="objectBoundingBox" maskContentUnits="objectBoundingBox">
            <rect x="0" y="0" width="1" height="1" fill="white" />
            {debrisChunks.map((chunk) => (
              <g key={`hole-${chunk.id}`} transform={`translate(${chunk.x / 100}, ${chunk.y / 100}) rotate(${chunk.rot}) scale(0.003)`}>
                <path d={chunk.path} fill="black" />
              </g>
            ))}
          </mask>
        </defs>
      </svg>
    </div>
  )
}
