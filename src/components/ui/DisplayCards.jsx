import React from 'react'

function SparklesIcon({ className = "" }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.314 11.314l.707.707M12 7a5 5 0 0 0-5 5 5 5 0 0 0 5 5 5 5 0 0 0 5-5 5 5 0 0 0-5-5z"/>
    </svg>
  )
}

function ShieldIcon({ className = "" }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  )
}

function CpuIcon({ className = "" }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      <rect x="4" y="4" width="16" height="16" rx="2" ry="2"/>
      <rect x="9" y="9" width="6" height="6"/>
      <line x1="9" y1="1" x2="9" y2="4"/>
      <line x1="15" y1="1" x2="15" y2="4"/>
      <line x1="9" y1="20" x2="9" y2="23"/>
      <line x1="15" y1="20" x2="15" y2="23"/>
      <line x1="20" y1="9" x2="23" y2="9"/>
      <line x1="20" y1="15" x2="23" y2="15"/>
      <line x1="1" y1="9" x2="4" y2="9"/>
      <line x1="1" y1="15" x2="4" y2="15"/>
    </svg>
  )
}

function FolderIcon({ className = "" }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
    </svg>
  )
}

function LayersIcon({ className = "" }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      <polygon points="12 2 2 7 12 12 22 7 12 2"/>
      <polyline points="2 17 12 22 22 17"/>
      <polyline points="2 12 12 17 22 12"/>
    </svg>
  )
}

const DEFAULT_CARDS = [
  {
    icon: <FolderIcon className="display-card-icon text-blue-300" />,
    title: "100% Portable Sandboxing",
    description: "Runs directly from external USB/SSD with zero registry footprint.",
    date: "Secure Sandbox",
    className: "card-stack-0",
  },
  {
    icon: <CpuIcon className="display-card-icon text-blue-300" />,
    title: "Cross-Platform Models",
    description: "Download once, run natively on Windows, macOS, Linux, and Android.",
    date: "Unified Storage",
    className: "card-stack-1",
  },
  {
    icon: <SparklesIcon className="display-card-icon text-blue-300" />,
    title: "Hardware Telemetry",
    description: "Real-time CPU & RAM utilization tracked directly on your UI dashboard.",
    date: "System Optimizer",
    className: "card-stack-2",
  },
  {
    icon: <LayersIcon className="display-card-icon text-blue-300" />,
    title: "Zero-Dependency Engine",
    description: "Pre-compiled runtimes packaged directly. No setups required.",
    date: "Instant Launch",
    className: "card-stack-3",
  },
  {
    icon: <ShieldIcon className="display-card-icon text-blue-300" />,
    title: "Computational Privacy",
    description: "100% offline. Zero telemetry tracking or calls to remote servers.",
    date: "Air-gapped Safety",
    className: "card-stack-4",
  },
]

export function DisplayCard({ icon, title, description, date, className }) {
  return (
    <div className={`display-card ${className}`}>
      <div className="display-card-header">
        <span className="display-card-icon-bg">
          {icon}
        </span>
        <p className="display-card-title-text">{title}</p>
      </div>
      <p className="display-card-description-text">{description}</p>
      <div className="display-card-footer-row">
        <p className="display-card-date-text">{date}</p>
        <span className="display-card-spark-dot" />
      </div>
    </div>
  )
}

export default function DisplayCards({ cards = DEFAULT_CARDS }) {
  return (
    <div className="display-cards-deck">
      {cards.map((card, index) => (
        <DisplayCard key={index} {...card} />
      ))}
    </div>
  )
}
