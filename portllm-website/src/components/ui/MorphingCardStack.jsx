import { useState, useEffect } from "react"
import { motion, AnimatePresence, LayoutGroup } from "framer-motion"
import { cn } from "../../lib/utils"
import { Grid3X3, Layers } from "lucide-react"

const layoutIcons = {
  stack: Layers,
  grid: Grid3X3,
}

const SWIPE_THRESHOLD = 50

export function MorphingCardStack({
  cards = [],
  className,
  defaultLayout = "stack",
  onCardClick,
}) {
  const [layout, setLayout] = useState(defaultLayout)
  const [expandedCard, setExpandedCard] = useState(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  // Ensure processed cards have unique IDs
  const processedCards = cards.map((card, index) => ({
    id: card.id || `${card.name?.replace(/\s+/g, "-").toLowerCase()}-${index}`,
    ...card,
  }))

  // Reset active index when cards change (e.g. changing tabs)
  useEffect(() => {
    setActiveIndex(0)
    setExpandedCard(null)
  }, [cards])

  if (!processedCards || processedCards.length === 0) {
    return null
  }

  const handleDragEnd = (event, info) => {
    const { offset, velocity } = info
    const swipe = Math.abs(offset.x) * velocity.x

    if (offset.x < -SWIPE_THRESHOLD || swipe < -1000) {
      // Swiped left - go to next card
      setActiveIndex((prev) => (prev + 1) % processedCards.length)
    } else if (offset.x > SWIPE_THRESHOLD || swipe > 1000) {
      // Swiped right - go to previous card
      setActiveIndex((prev) => (prev - 1 + processedCards.length) % processedCards.length)
    }
    setIsDragging(false)
  }

  const getStackOrder = () => {
    const reordered = []
    for (let i = 0; i < processedCards.length; i++) {
      const index = (activeIndex + i) % processedCards.length
      reordered.push({ ...processedCards[index], stackPosition: i })
    }
    return reordered.reverse() // Reverse so top card renders last (on top)
  }

  const getLayoutStyles = (stackPosition) => {
    switch (layout) {
      case "stack":
        return {
          top: stackPosition * 8,
          left: `calc(4% + ${stackPosition * 6}px)`,
          zIndex: processedCards.length - stackPosition,
          rotate: (stackPosition - 1) * 1.5,
        }
      case "grid":
        return {
          top: 0,
          left: 0,
          zIndex: 1,
          rotate: 0,
        }
    }
  }

  const containerStyles = {
    stack: "relative h-[360px] w-full max-w-[420px]",
    grid: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full",
  }

  const displayCards = layout === "stack" ? getStackOrder() : processedCards.map((c, i) => ({ ...c, stackPosition: i }))

  return (
    <div className={cn("flex flex-col items-center justify-center w-full space-y-8", className)}>
      {/* Layout Toggle - Premium Pill Selector */}
      <div className="flex items-center justify-center gap-1.5 rounded-full border border-slate-200/80 bg-white/80 backdrop-blur-md p-1.5 w-fit mx-auto shadow-sm">
        {Object.keys(layoutIcons).map((mode) => {
          const Icon = layoutIcons[mode]
          const isActive = layout === mode
          return (
            <button
              key={mode}
              onClick={() => setLayout(mode)}
              className={cn(
                "rounded-full py-2 px-6 transition-all duration-300 flex items-center gap-2 text-sm font-semibold cursor-pointer border border-transparent select-none",
                isActive
                  ? "bg-slate-900 text-white shadow-md shadow-slate-900/10 border-slate-900"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-100/80"
              )}
              aria-label={`Switch to ${mode} layout`}
            >
              <Icon className="h-4 w-4" />
              <span className="capitalize">{mode}</span>
            </button>
          )
        })}
      </div>

      {/* Cards Container */}
      <LayoutGroup>
        <motion.div layout className={cn(containerStyles[layout], "mx-auto")}>
          <AnimatePresence mode="popLayout">
            {displayCards.map((card) => {
              const styles = getLayoutStyles(card.stackPosition)
              const isExpanded = expandedCard === card.id
              const isTopCard = layout === "stack" && card.stackPosition === 0

              return (
                <motion.div
                  key={card.id}
                  layoutId={card.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: 1,
                    scale: isExpanded ? 1.02 : 1,
                    x: 0,
                    ...styles,
                  }}
                  exit={{ opacity: 0, scale: 0.8, x: -200 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 25,
                  }}
                  drag={isTopCard ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.7}
                  onDragStart={() => setIsDragging(true)}
                  onDragEnd={handleDragEnd}
                  whileDrag={{ scale: 1.02, cursor: "grabbing" }}
                  onClick={() => {
                    if (isDragging) return
                    setExpandedCard(isExpanded ? null : card.id)
                    onCardClick?.(card)
                  }}
                  className={cn(
                    "model-card cursor-pointer select-none",
                    layout === "stack" && "absolute w-[92%] h-[320px]",
                    layout === "stack" && isTopCard && "cursor-grab active:cursor-grabbing",
                    layout === "grid" && "w-full",
                    isExpanded && "ring-2 ring-blue-500/50 border-blue-500/50"
                  )}
                  style={{
                    // Prevent default drag outline
                    touchAction: isTopCard ? "none" : "auto",
                  }}
                >
                  <div className="model-header pointer-events-none">
                    <span className={cn(
                      "model-badge",
                      card.label === 'UNCENSORED' ? 'uncensored' : 'standard'
                    )}>
                      {card.label}
                    </span>
                    <span className="model-size">{card.size}</span>
                  </div>
                  <h3 className="model-name pointer-events-none">{card.name}</h3>
                  <p className={cn(
                    "model-desc pointer-events-none",
                    layout === "stack" && "line-clamp-4",
                    layout === "grid" && "line-clamp-3"
                  )}>
                    {card.desc}
                  </p>
                  <div className="model-meta mt-auto pointer-events-none">
                    <span>Tag: {card.badge}</span>
                  </div>

                  {layout === "stack" && isTopCard && (
                    <div className="absolute bottom-2 left-0 right-0 text-center pointer-events-none">
                      <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold opacity-60 animate-pulse">
                        Swipe to navigate
                      </span>
                    </div>
                  )}
                </motion.div>
              )
            })}
          </AnimatePresence>
        </motion.div>
      </LayoutGroup>

      {layout === "stack" && processedCards.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {processedCards.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={cn(
                "h-2 rounded-full transition-all duration-300 cursor-pointer",
                index === activeIndex ? "w-6 bg-slate-900" : "w-2 bg-slate-300 hover:bg-slate-400"
              )}
              aria-label={`Go to card ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
