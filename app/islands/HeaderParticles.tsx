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

const PARTICLE_COUNT = 50
const FLEE_RADIUS = 80
const FLEE_FORCE = 0.6
const RETURN_SPEED = 0.03
const DRIFT_SPEED = 0.15
const ORBIT_RADIUS = 12
const ORBIT_SPEED_MIN = 0.008
const ORBIT_SPEED_MAX = 0.025

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
          r: Math.random() * 3 + 2,
          opacity: Math.random() * 0.4 + 0.15,
          driftAngle: Math.random() * Math.PI * 2,
          driftSpeed: (Math.random() * 0.5 + 0.5) * DRIFT_SPEED,
          orbitAngle: Math.random() * Math.PI * 2,
          orbitSpeed:
            ORBIT_SPEED_MIN +
            Math.random() * (ORBIT_SPEED_MAX - ORBIT_SPEED_MIN),
          orbitRadius: ORBIT_RADIUS * (0.6 + Math.random() * 0.8),
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
      const isDark = document.documentElement.classList.contains('dark')
      const color = isDark ? '255,255,255' : '0,0,0'

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

        // Draw particle
        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx!.fillStyle = `rgba(${color},${p.opacity})`
        ctx!.fill()
      }

      // Draw connections between close particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i]
          const b = particles[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < 80) {
            const alpha = (1 - d / 80) * 0.12
            ctx!.beginPath()
            ctx!.moveTo(a.x, a.y)
            ctx!.lineTo(b.x, b.y)
            ctx!.strokeStyle = `rgba(${color},${alpha})`
            ctx!.lineWidth = 0.5
            ctx!.stroke()
          }
        }
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
