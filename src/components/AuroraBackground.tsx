import { useEffect, useRef } from 'react'

/**
 * 极光背景：浅色底上的淡青绿/紫罗兰光斑 + 电路网格。
 * - 尊重 prefers-reduced-motion（只画静态帧）
 * - 移动端（宽度 < 640px）光斑数量减半
 */
export default function AuroraBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isMobile = window.innerWidth < 640
    const blobCount = isMobile ? 3 : 6

    type Blob = {
      x: number; y: number; r: number
      vx: number; vy: number
      hue: number; alpha: number
      phase: number
    }

    const blobs: Blob[] = Array.from({ length: blobCount }, (_, i) => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: 160 + Math.random() * 240,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.18,
      hue: i % 2 === 0 ? 160 : 252,
      alpha: 0.09 + Math.random() * 0.06,
      phase: Math.random() * Math.PI * 2,
    }))

    let raf = 0

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const draw = () => {
      const w = canvas.width / (window.devicePixelRatio || 1)
      const h = canvas.height / (window.devicePixelRatio || 1)
      ctx.clearRect(0, 0, w, h)

      blobs.forEach((b) => {
        if (!reduceMotion) {
          b.x += b.vx
          b.y += b.vy
          b.phase += 0.004
          if (b.x < -b.r) b.x = w + b.r
          if (b.x > w + b.r) b.x = -b.r
          if (b.y < -b.r) b.y = h + b.r
          if (b.y > h + b.r) b.y = -b.r
        }
        const pulse = reduceMotion ? 1 : 0.85 + Math.sin(b.phase) * 0.15
        const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r)
        grad.addColorStop(0, `hsla(${b.hue}, 68%, 60%, ${b.alpha * pulse})`)
        grad.addColorStop(1, 'transparent')
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2)
        ctx.fill()
      })

      if (!reduceMotion) raf = requestAnimationFrame(draw)
    }

    if (reduceMotion) draw()
    else raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <div className="bg-circuit absolute inset-0" />
      <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-paper to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-paper to-transparent" />
    </div>
  )
}
