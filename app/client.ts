import { createClient } from 'honox/client'
import './styles/tailwind.css'

createClient()

// ── Theme Toggle ──
function initThemeToggle() {
  const btn = document.getElementById('theme-toggle')
  if (!btn) return
  // Prevent double-binding
  if (btn.dataset.bound) return
  btn.dataset.bound = '1'

  const html = document.documentElement

  function updateIcon() {
    const isDark = html.classList.contains('dark')
    const sun = btn!.querySelector('.icon-sun') as HTMLElement | null
    const moon = btn!.querySelector('.icon-moon') as HTMLElement | null
    if (sun) sun.style.display = isDark ? 'none' : 'block'
    if (moon) moon.style.display = isDark ? 'block' : 'none'
  }

  updateIcon()

  btn.addEventListener('click', () => {
    const isDark = html.classList.toggle('dark')
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
    updateIcon()
  })
}

// Run when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initThemeToggle)
} else {
  initThemeToggle()
}
