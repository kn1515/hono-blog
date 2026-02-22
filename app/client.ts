import { createClient } from 'honox/client'
import './styles/tailwind.css'

createClient()

// ── Header Particle Animation (flee from mouse) ──
function initHeaderParticles() {
  const canvas = document.getElementById('header-particles') as HTMLCanvasElement | null
  const header = document.getElementById('site-header') as HTMLElement | null
  if (!canvas || !header) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  let w = 0
  let h = 0
  let mouse = { x: -9999, y: -9999 }
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

  let particles: Particle[] = []

  function resize() {
    const rect = header!.getBoundingClientRect()
    w = rect.width
    h = rect.height
    canvas!.width = w * devicePixelRatio
    canvas!.height = h * devicePixelRatio
    canvas!.style.width = w + 'px'
    canvas!.style.height = h + 'px'
    ctx!.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0)
    initParticles()
  }

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
        orbitSpeed: ORBIT_SPEED_MIN + Math.random() * (ORBIT_SPEED_MAX - ORBIT_SPEED_MIN),
        orbitRadius: ORBIT_RADIUS * (0.6 + Math.random() * 0.8),
      })
    }
  }

  function animate() {
    ctx!.clearRect(0, 0, w, h)
    const isDark = document.documentElement.classList.contains('dark')
    const dotColor = isDark ? '255,255,255' : '0,0,0'
    const lineColor = isDark ? '255,255,255' : '0,0,0'

    for (const p of particles) {
      // Continuous orbit around home position
      p.orbitAngle += p.orbitSpeed
      const orbitTargetX = p.homeX + Math.cos(p.orbitAngle) * p.orbitRadius
      const orbitTargetY = p.homeY + Math.sin(p.orbitAngle) * p.orbitRadius

      // Gentle drift (slowly move home position)
      p.driftAngle += 0.005
      const driftX = Math.cos(p.driftAngle) * p.driftSpeed
      const driftY = Math.sin(p.driftAngle) * p.driftSpeed

      // Flee from mouse
      const dx = p.x - mouse.x
      const dy = p.y - mouse.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < FLEE_RADIUS && dist > 0) {
        const force = (FLEE_RADIUS - dist) / FLEE_RADIUS * FLEE_FORCE
        p.vx += (dx / dist) * force
        p.vy += (dy / dist) * force
      }

      // Return to orbit target (not just home)
      p.vx += (orbitTargetX - p.x) * RETURN_SPEED + driftX * 0.1
      p.vy += (orbitTargetY - p.y) * RETURN_SPEED + driftY * 0.1

      // Damping
      p.vx *= 0.88
      p.vy *= 0.88

      p.x += p.vx
      p.y += p.vy

      // Draw particle
      ctx!.beginPath()
      ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2)
      ctx!.fillStyle = `rgba(${dotColor},${p.opacity})`
      ctx!.fill()
    }

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i]
        const b = particles[j]
        const dx = a.x - b.x
        const dy = a.y - b.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 80) {
          const alpha = (1 - dist / 80) * 0.12
          ctx!.beginPath()
          ctx!.moveTo(a.x, a.y)
          ctx!.lineTo(b.x, b.y)
          ctx!.strokeStyle = `rgba(${lineColor},${alpha})`
          ctx!.lineWidth = 0.5
          ctx!.stroke()
        }
      }
    }

    requestAnimationFrame(animate)
  }

  header.addEventListener('mousemove', (e) => {
    const rect = header!.getBoundingClientRect()
    mouse.x = e.clientX - rect.left
    mouse.y = e.clientY - rect.top
  })

  header.addEventListener('mouseleave', () => {
    mouse.x = -9999
    mouse.y = -9999
  })

  window.addEventListener('resize', resize)
  resize()
  animate()
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHeaderParticles)
} else {
  initHeaderParticles()
}
