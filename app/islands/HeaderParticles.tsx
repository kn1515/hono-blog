import { useEffect, useRef } from 'hono/jsx/dom'
import { css } from 'hono/css'

const canvasCss = css`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
`

const PARTICLE_COUNT = 40
const FLEE_RADIUS = 90
const FLEE_FORCE = 0.5
const RETURN_SPEED = 0.025
const DRIFT_SPEED = 0.12
const ORBIT_RADIUS = 14
const ORBIT_SPEED_MIN = 0.01
const ORBIT_SPEED_MAX = 0.03

/* Pastel palette – richer / more saturated */
const PASTEL_COLORS = [
  { r: 255, g: 130, b: 160 }, // pink
  { r: 255, g: 170, b: 130 }, // peach
  { r: 240, g: 220, b: 80 },  // lemon
  { r: 120, g: 230, b: 160 }, // mint
  { r: 130, g: 160, b: 255 }, // periwinkle
  { r: 180, g: 140, b: 255 }, // lavender
  { r: 255, g: 120, b: 180 }, // rose
  { r: 100, g: 210, b: 200 }, // teal
  { r: 255, g: 180, b: 80 },  // apricot
  { r: 140, g: 200, b: 255 }, // sky
]

interface Particle {
  homeX: number
  homeY: number
  x: number
  y: number
  vx: number
  vy: number
  r: number
  opacity: number
  driftAngle: number
  driftSpeed: number
  orbitAngle: number
  orbitSpeed: number
  orbitRadius: number
  color: { r: number; g: number; b: number }
}

export default function HeaderParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const header = canvas.closest('header') as HTMLElement | null
    if (!header) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let w = 0
    let h = 0
    const mouse = { x: -9999, y: -9999 }
    let particles: Particle[] = []
    let animId = 0

    function initParticles() {
      particles = []
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const x = Math.random() * w
        const y = Math.random() * h
        particles.push({
          homeX: x,
          homeY: y,
          x,
          y,
          vx: 0,
          vy: 0,
          r: Math.random() * 8 + 16,
          opacity: Math.random() * 0.3 + 0.35,
          driftAngle: Math.random() * Math.PI * 2,
          driftSpeed: (Math.random() * 0.5 + 0.5) * DRIFT_SPEED,
          orbitAngle: Math.random() * Math.PI * 2,
          orbitSpeed:
            ORBIT_SPEED_MIN +
            Math.random() * (ORBIT_SPEED_MAX - ORBIT_SPEED_MIN),
          orbitRadius: ORBIT_RADIUS * (0.6 + Math.random() * 0.8),
          color: PASTEL_COLORS[Math.floor(Math.random() * PASTEL_COLORS.length)],
        })
      }
    }

    function resize() {
      const rect = header!.getBoundingClientRect()
      w = rect.width
      h = rect.height
      canvas!.width = w * devicePixelRatio
      canvas!.height = h * devicePixelRatio
      canvas!.style.width = `${w}px`
      canvas!.style.height = `${h}px`
      ctx!.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0)
      initParticles()
    }

    function animate() {
      ctx!.clearRect(0, 0, w, h)

      for (const p of particles) {
        // Continuous orbit around home position
        p.orbitAngle += p.orbitSpeed
        const otx = p.homeX + Math.cos(p.orbitAngle) * p.orbitRadius
        const oty = p.homeY + Math.sin(p.orbitAngle) * p.orbitRadius

        // Gentle drift
        p.driftAngle += 0.005
        const drx = Math.cos(p.driftAngle) * p.driftSpeed
        const dry = Math.sin(p.driftAngle) * p.driftSpeed

        // Flee from mouse
        const dx = p.x - mouse.x
        const dy = p.y - mouse.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < FLEE_RADIUS && dist > 0) {
          const f = ((FLEE_RADIUS - dist) / FLEE_RADIUS) * FLEE_FORCE
          p.vx += (dx / dist) * f
          p.vy += (dy / dist) * f
        }

        // Return to orbit target
        p.vx += (otx - p.x) * RETURN_SPEED + drx * 0.1
        p.vy += (oty - p.y) * RETURN_SPEED + dry * 0.1

        // Damping
        p.vx *= 0.88
        p.vy *= 0.88
        p.x += p.vx
        p.y += p.vy

        // Draw matte flat sphere
        const { r: cr, g: cg, b: cb } = p.color
        const grad = ctx!.createRadialGradient(
          p.x, p.y, 0,
          p.x, p.y, p.r
        )
        grad.addColorStop(0, `rgba(${cr},${cg},${cb},${p.opacity})`)
        grad.addColorStop(0.85, `rgba(${cr},${cg},${cb},${p.opacity * 0.7})`)
        grad.addColorStop(1, `rgba(${cr},${cg},${cb},${p.opacity * 0.1})`)

        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx!.fillStyle = grad
        ctx!.fill()
      }

      animId = requestAnimationFrame(animate)
    }

    const onMouseMove = (e: MouseEvent) => {
      const rect = header!.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
    }

    const onMouseLeave = () => {
      mouse.x = -9999
      mouse.y = -9999
    }

    header.addEventListener('mousemove', onMouseMove)
    header.addEventListener('mouseleave', onMouseLeave)
    window.addEventListener('resize', resize)

    resize()
    animate()

    return () => {
      cancelAnimationFrame(animId)
      header.removeEventListener('mousemove', onMouseMove)
      header.removeEventListener('mouseleave', onMouseLeave)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} class={canvasCss} />
}
