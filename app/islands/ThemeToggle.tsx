import { useCallback } from 'hono/jsx/dom'
import { css } from 'hono/css'

/* ── SVG Icons ── */
const IconSun = () => (
  <svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' style='flex-shrink:0'>
    <circle cx='12' cy='12' r='5' />
    <line x1='12' y1='1' x2='12' y2='3' />
    <line x1='12' y1='21' x2='12' y2='23' />
    <line x1='4.22' y1='4.22' x2='5.64' y2='5.64' />
    <line x1='18.36' y1='18.36' x2='19.78' y2='19.78' />
    <line x1='1' y1='12' x2='3' y2='12' />
    <line x1='21' y1='12' x2='23' y2='12' />
    <line x1='4.22' y1='19.78' x2='5.64' y2='18.36' />
    <line x1='18.36' y1='5.64' x2='19.78' y2='4.22' />
  </svg>
)

const IconMoon = () => (
  <svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' style='flex-shrink:0'>
    <path d='M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z' />
  </svg>
)

/* ── Style ── */
const themeToggleCss = css`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: var(--c-text-muted);
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0;

  &:hover,
  &:focus {
    color: var(--c-text);
    background: var(--c-accent-hover-bg);
  }
`

/**
 * ThemeToggle island component.
 *
 * The initial dark-class is applied by an inline script in _renderer.tsx
 * (before paint to prevent flash). This island only handles the click
 * interaction to toggle the theme.
 *
 * Icon visibility is controlled purely by CSS:
 *   .dark #theme-toggle .icon-sun  { display: none  }
 *   .dark #theme-toggle .icon-moon { display: block }
 * so there is no flash even before hydration.
 */
export default function ThemeToggle() {
  const handleClick = useCallback(() => {
    const isDark = document.documentElement.classList.toggle('dark')
    try {
      localStorage.setItem('theme', isDark ? 'dark' : 'light')
    } catch {
      // localStorage may not be available
    }
  }, [])

  return (
    <button
      type='button'
      id='theme-toggle'
      class={themeToggleCss}
      onClick={handleClick}
      aria-label='Toggle theme'
    >
      <span class='icon-sun'><IconSun /></span>
      <span class='icon-moon'><IconMoon /></span>
    </button>
  )
}
