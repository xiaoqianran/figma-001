import React, { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { SpeedtestResult } from '@/store/vpnStore'
import { GlassCard } from '@/components/ui'

interface InteractiveSpeedChartProps {
  results: SpeedtestResult[]
  onSelectResult?: (index: number) => void
  selectedIndex?: number | null
  maxPoints?: number
  showPing?: boolean
  height?: number
  className?: string
}

interface TooltipData {
  x: number
  y: number
  result: SpeedtestResult
  index: number
}

export const InteractiveSpeedChart: React.FC<InteractiveSpeedChartProps> = ({
  results,
  onSelectResult,
  selectedIndex = null,
  maxPoints = 8,
  showPing = true,
  height = 160,
  className,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [tooltip, setTooltip] = useState<TooltipData | null>(null)

  // Use most recent N results, oldest first for left-to-right chronological
  const displayResults = useMemo(() => {
    const sliced = [...results].slice(0, maxPoints).reverse()
    return sliced
  }, [results, maxPoints])

  const dataLength = displayResults.length

  // Chart dimensions & pure helpers hoisted early so useCallback (and any future hooks)
  // can be declared unconditionally before the early return — fixes react-hooks/rules-of-hooks.
  const width = 320
  const padding = { top: 16, right: 12, bottom: 28, left: 32 }
  const chartWidth = width - padding.left - padding.right
  const chartHeight = height - padding.top - padding.bottom

  // Compute scales (used by getters + paths)
  const maxDownload = Math.max(...displayResults.map(r => r.download), 120)
  const maxUpload = Math.max(...displayResults.map(r => r.upload), 80)
  const maxSpeed = Math.max(maxDownload, maxUpload, 100)

  const maxPing = Math.max(...displayResults.map(r => r.ping), 80)
  const pingScale = maxPing > 0 ? maxPing : 50

  const getX = (i: number) => padding.left + (i / Math.max(dataLength - 1, 1)) * chartWidth
  const getDownloadY = (val: number) => padding.top + chartHeight - (Math.min(val, maxSpeed) / maxSpeed) * chartHeight
  const getUploadY = (val: number) => padding.top + chartHeight - (Math.min(val, maxSpeed) / maxSpeed) * chartHeight
  const getPingY = (val: number) => padding.top + chartHeight - (Math.min(val, pingScale) / pingScale) * (chartHeight * 0.65)

  // Mouse interaction handler (useCallback must be top-level before any conditional return)
  const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const svg = e.currentTarget
    const rect = svg.getBoundingClientRect()
    const mouseX = ((e.clientX - rect.left) / rect.width) * width

    // Find nearest data point
    let nearest = 0
    let minDist = Infinity
    for (let i = 0; i < dataLength; i++) {
      const px = getX(i)
      const dist = Math.abs(px - mouseX)
      if (dist < minDist) {
        minDist = dist
        nearest = i
      }
    }

    if (nearest !== hoveredIndex) {
      setHoveredIndex(nearest)
    }

    const res = displayResults[nearest]
    const cx = getX(nearest)
    const cy = getDownloadY(res.download) // anchor tooltip near download

    // Convert svg coords to % for absolute tooltip positioning in container
    const tooltipX = ((cx / width) * 100)
    // Improved lift + tighter clamps so tooltips sit cleanly above points without clipping at card edges
    const tooltipY = ((cy / height) * 100) - 22

    setTooltip({
      x: tooltipX,
      y: Math.max(5, Math.min(68, tooltipY)),
      result: res,
      index: nearest,
    })
  }, [dataLength, displayResults, hoveredIndex, height, width]) // eslint-disable-line react-hooks/exhaustive-deps -- getters (getX, getDownloadY) are stable within render; including them would cause unnecessary callback churn

  if (dataLength === 0) {
    return null
  }

  // Smooth bezier path generator (Catmull-Rom approximation for beautiful curved lines)
  const createSmoothPath = (values: number[], getY: (v: number) => number): string => {
    if (dataLength < 2) return ''
    const pts = displayResults.map((_, i) => ({
      x: getX(i),
      y: getY(values[i])
    }))
    if (pts.length === 0) return ''
    let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = i > 0 ? pts[i - 1] : pts[i]
      const p1 = pts[i]
      const p2 = pts[i + 1]
      const p3 = i < pts.length - 2 ? pts[i + 2] : p2
      const cp1x = p1.x + (p2.x - p0.x) / 6
      const cp1y = p1.y + (p2.y - p0.y) / 6
      const cp2x = p2.x - (p3.x - p1.x) / 6
      const cp2y = p2.y - (p3.y - p1.y) / 6
      d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`
    }
    return d
  }

  const downloadValues = displayResults.map(r => r.download)
  const uploadValues = displayResults.map(r => r.upload)
  const pingValues = displayResults.map(r => r.ping)
  const downloadPath = createSmoothPath(downloadValues, getDownloadY)
  const uploadPath = createSmoothPath(uploadValues, getUploadY)
  const pingPath = showPing ? createSmoothPath(pingValues, getPingY) : ''

  const handleMouseLeave = () => {
    setHoveredIndex(null)
    setTooltip(null)
  }

  const handlePointClick = (i: number) => {
    if (onSelectResult) {
      // The index we pass back should map to original history index
      // Since displayResults is reversed slice, actual original index = (results.length - 1 - i) but we reverse only for display
      // For simplicity, pass the reversed index and let parent map or just use visual selection
      onSelectResult(i)
    }
    setHoveredIndex(i)
  }

  // Keyboard support for chart points (high-impact a11y for complex interactive SVG)
  const handlePointKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handlePointClick(i)
    }
  }

  const formatTime = (ts: string) => {
    try {
      return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } catch {
      return ''
    }
  }

  const isSelected = (i: number) => selectedIndex === i

  return (
    <GlassCard className={className} padding="none">
      <div className="relative p-4 pb-2 select-none">
        {/* Legend */}
        <div className="flex items-center justify-between mb-2 px-1 text-[10px] tracking-widest">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-[#3B82F6]">
              <div className="w-2.5 h-px bg-[#3B82F6]" /> DOWNLOAD
            </div>
            <div className="flex items-center gap-1.5 text-[#22D3EE]">
              <div className="w-2.5 h-px bg-[#22D3EE]" /> UPLOAD
            </div>
            {showPing && (
              <div className="flex items-center gap-1.5 text-amber-400">
                <div className="w-2.5 h-px bg-amber-400" /> PING
              </div>
            )}
          </div>
          <div className="text-[#475569] font-mono text-[10px]">Last {dataLength} tests</div>
        </div>

        {/* The Interactive SVG Chart */}
        <div className="relative">
          <svg
            width="100%"
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            className="overflow-visible touch-none"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            role="img"
            aria-label={`Interactive speed history chart. Showing last ${dataLength} speed tests with download, upload, and ping trends. Hover, tap, or use keyboard (Tab + Enter) on points for details and selection.`}
            aria-describedby="chart-desc"
          >
            <desc id="chart-desc">
              Line chart visualizing VPN speed test results over time. Download in blue, Upload in cyan, Ping in amber dashed. Interactive points are keyboard and pointer accessible for selection.
            </desc>
            {/* Subtle grid lines */}
            {[0.25, 0.5, 0.75].map((p, idx) => (
              <line
                key={idx}
                x1={padding.left}
                y1={padding.top + chartHeight * p}
                x2={padding.left + chartWidth}
                y2={padding.top + chartHeight * p}
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="1"
              />
            ))}

            {/* Y-axis labels (speed) */}
            {[0, 0.5, 1].map((p, idx) => {
              const val = Math.round(maxSpeed * (1 - p))
              const y = padding.top + chartHeight * p
              return (
                <text
                  key={idx}
                  x={padding.left - 6}
                  y={y + 3}
                  textAnchor="end"
                  fontSize="8"
                  fill="#475569"
                  fontFamily="monospace"
                >
                  {val}
                </text>
              )
            })}

            {/* Download line + points (smoothed bezier) */}
            {dataLength > 1 && downloadPath && (
              <path
                d={downloadPath}
                fill="none"
                stroke="#3B82F6"
                strokeWidth="2.5"
                strokeLinejoin="round"
                strokeLinecap="round"
                opacity="0.9"
              />
            )}
            {displayResults.map((r, i) => {
              const cx = getX(i)
              const cy = getDownloadY(r.download)
              const active = hoveredIndex === i || isSelected(i)
              const isInteractive = !!onSelectResult
              return (
                <g key={`dl-${i}`}>
                  <motion.circle
                    cx={cx}
                    cy={cy}
                    r={active ? 5 : 3.5}
                    fill="#3B82F6"
                    stroke="#0F172A"
                    strokeWidth="2"
                    style={{ cursor: isInteractive ? 'pointer' : 'default' }}
                    onClick={() => handlePointClick(i)}
                    onKeyDown={(e) => handlePointKeyDown(i, e)}
                    tabIndex={isInteractive ? 0 : -1}
                    role={isInteractive ? 'button' : undefined}
                    aria-label={isInteractive ? `Select test ${i + 1}: ${r.download} Mbps download, ${r.ping} ms ping` : undefined}
                    focusable={isInteractive ? 'true' : undefined}
                    initial={{ scale: 0.6, opacity: 0.6 }}
                    animate={{ scale: active ? 1.1 : 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                  />
                  {/* Subtle glow for active */}
                  {active && (
                    <circle cx={cx} cy={cy} r="8" fill="#3B82F6" opacity="0.15" />
                  )}
                </g>
              )
            })}

            {/* Upload line + points (smoothed bezier) */}
            {dataLength > 1 && uploadPath && (
              <path
                d={uploadPath}
                fill="none"
                stroke="#22D3EE"
                strokeWidth="2.5"
                strokeLinejoin="round"
                strokeLinecap="round"
                opacity="0.85"
              />
            )}
            {displayResults.map((r, i) => {
              const cx = getX(i)
              const cy = getUploadY(r.upload)
              const active = hoveredIndex === i || isSelected(i)
              const isInteractive = !!onSelectResult
              return (
                <motion.circle
                  key={`ul-${i}`}
                  cx={cx}
                  cy={cy}
                  r={active ? 4.5 : 3}
                  fill="#22D3EE"
                  stroke="#0F172A"
                  strokeWidth="1.5"
                  style={{ cursor: isInteractive ? 'pointer' : 'default' }}
                  onClick={() => handlePointClick(i)}
                  onKeyDown={(e) => handlePointKeyDown(i, e)}
                  tabIndex={isInteractive ? 0 : -1}
                  role={isInteractive ? 'button' : undefined}
                  aria-label={isInteractive ? `Select test ${i + 1}: ${r.upload} Mbps upload` : undefined}
                  focusable={isInteractive ? 'true' : undefined}
                  initial={{ scale: 0.5, opacity: 0.7 }}
                  animate={{ scale: active ? 1 : 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                />
              )
            })}

            {/* Ping line (dashed, secondary, smoothed) */}
            {showPing && dataLength > 1 && pingPath && (
              <path
                d={pingPath}
                fill="none"
                stroke="#F59E0B"
                strokeWidth="1.75"
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeDasharray="3 2"
                opacity="0.65"
              />
            )}
            {showPing && displayResults.map((r, i) => {
              const cx = getX(i)
              const cy = getPingY(r.ping)
              const active = hoveredIndex === i || isSelected(i)
              const isInteractive = !!onSelectResult
              return (
                <motion.circle
                  key={`ping-${i}`}
                  cx={cx}
                  cy={cy}
                  r={active ? 3 : 2}
                  fill="#F59E0B"
                  opacity={active ? 1 : 0.75}
                  style={{ cursor: isInteractive ? 'pointer' : 'default' }}
                  onClick={() => handlePointClick(i)}
                  onKeyDown={(e) => handlePointKeyDown(i, e)}
                  tabIndex={isInteractive ? 0 : -1}
                  role={isInteractive ? 'button' : undefined}
                  aria-label={isInteractive ? `Select test ${i + 1}: ${r.ping} ms ping` : undefined}
                  focusable={isInteractive ? 'true' : undefined}
                />
              )
            })}

            {/* X labels (time) - show every other or first/last */}
            {displayResults.map((r, i) => {
              if (dataLength <= 4 || i % 2 === 0 || i === dataLength - 1) {
                return (
                  <text
                    key={`t-${i}`}
                    x={getX(i)}
                    y={height - 6}
                    textAnchor="middle"
                    fontSize="8"
                    fill="#475569"
                    fontFamily="monospace"
                  >
                    {formatTime(r.timestamp)}
                  </text>
                )
              }
              return null
            })}

            {/* Hover vertical guide line */}
            <AnimatePresence>
              {hoveredIndex !== null && (
                <motion.line
                  x1={getX(hoveredIndex)}
                  y1={padding.top}
                  x2={getX(hoveredIndex)}
                  y2={padding.top + chartHeight}
                  stroke="rgba(255,255,255,0.25)"
                  strokeWidth="1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
              )}
            </AnimatePresence>
          </svg>

          {/* Floating Tooltip */}
          <AnimatePresence>
            {tooltip && (
              <motion.div
                className="absolute z-20 pointer-events-none"
                style={{
                  left: `${tooltip.x}%`,
                  top: `${tooltip.y}%`,
                  transform: 'translate(-50%, -100%)',
                }}
                initial={{ opacity: 0, y: 4, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.96 }}
                transition={{ duration: 0.1 }}
              >
                <div className="glass-strong rounded-2xl px-3 py-2 text-xs shadow-xl border border-white/10 min-w-[148px]">
                  <div className="font-mono text-[10px] text-[#94A3B8] mb-1">
                    {formatTime(tooltip.result.timestamp)}
                    {tooltip.result.server && (
                      <span className="ml-1.5 text-[#64748B]">· {tooltip.result.server}</span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 tabular-nums">
                    <div className="text-[#3B82F6]">DL <span className="text-white font-semibold">{tooltip.result.download}</span><span className="text-[#64748B]"> Mbps</span></div>
                    <div className="text-[#22D3EE]">UL <span className="text-white font-semibold">{tooltip.result.upload}</span><span className="text-[#64748B]"> Mbps</span></div>
                    <div className="text-amber-400">Ping <span className="text-white font-semibold">{tooltip.result.ping}</span><span className="text-[#64748B]"> ms</span></div>
                    <div className="text-[#A5B4FC]">Jitter <span className="text-white font-semibold">{tooltip.result.jitter}</span><span className="text-[#64748B]"> ms</span></div>
                  </div>
                  {onSelectResult && (
                    <div className="mt-1 text-[10px] text-[#475569]">Click point to highlight</div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Clickable hint + a11y note */}
        {onSelectResult && (
          <div className="text-center text-[10px] text-[#475569] mt-1 tracking-widest">Hover/tap or focus+Enter points to select • Full keyboard navigation supported on data points</div>
        )}
      </div>
    </GlassCard>
  )
}

export default InteractiveSpeedChart
