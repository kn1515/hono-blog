import { useState, useEffect, useRef, useCallback } from 'hono/jsx/dom'
import { css } from 'hono/css'

type ViewMode = 'grid' | 'list'

/* ── Styles ── */
const toggleContainerCss = css`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
  gap: 0.5rem;
`

const toggleButtonBaseCss = css`
  background: none;
  border: 1px solid var(--c-border);
  border-radius: 0.375rem;
  padding: 0.4rem 0.6rem;
  cursor: pointer;
  color: var(--c-text-muted);
  transition: all 0.2s ease-out;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;

  &:hover {
    border-color: var(--c-border-light);
    color: var(--c-text);
  }

  &[data-active='true'] {
    background-color: var(--c-accent-bg);
    border-color: var(--c-accent);
    color: var(--c-text);
  }
`

/* ── SVG Icons ── */
const ListIcon = () => (
  <svg
    width='18'
    height='18'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    stroke-width='2'
    stroke-linecap='round'
    stroke-linejoin='round'
  >
    <line x1='8' y1='6' x2='21' y2='6' />
    <line x1='8' y1='12' x2='21' y2='12' />
    <line x1='8' y1='18' x2='21' y2='18' />
    <line x1='3' y1='6' x2='3.01' y2='6' />
    <line x1='3' y1='12' x2='3.01' y2='12' />
    <line x1='3' y1='18' x2='3.01' y2='18' />
  </svg>
)

const GridIcon = () => (
  <svg
    width='18'
    height='18'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    stroke-width='2'
    stroke-linecap='round'
    stroke-linejoin='round'
  >
    <rect x='3' y='3' width='7' height='7' />
    <rect x='14' y='3' width='7' height='7' />
    <rect x='3' y='14' width='7' height='7' />
    <rect x='14' y='14' width='7' height='7' />
  </svg>
)

/**
 * ViewToggle island component.
 *
 * Wraps the list/grid views and toggle buttons. Manages view state
 * with React hooks instead of raw DOM manipulation.
 *
 * Children should contain elements with `data-view="list"` and
 * `data-view="grid"` attributes. The default view is "grid"; the
 * list view should have `style="display:none"` in SSR to prevent flash.
 *
 * Usage:
 *   <ViewToggle>
 *     <div data-view="list" style="display:none">…</div>
 *     <div data-view="grid">…</div>
 *   </ViewToggle>
 */
export default function ViewToggle({ children }: { children: any }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mode, setMode] = useState<ViewMode>('grid')

  /** Apply display styles to the data-view children */
  const applyView = useCallback((viewMode: ViewMode) => {
    const el = containerRef.current
    if (!el) return
    const listView = el.querySelector<HTMLElement>('[data-view="list"]')
    const gridView = el.querySelector<HTMLElement>('[data-view="grid"]')
    if (listView) listView.style.display = viewMode === 'list' ? '' : 'none'
    if (gridView) gridView.style.display = viewMode === 'grid' ? '' : 'none'
  }, [])

  // Restore saved preference on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('viewMode') as ViewMode | null
      if (saved === 'list') {
        setMode('list')
        applyView('list')
      }
    } catch {
      // localStorage may not be available
    }
  }, [applyView])

  // Sync display whenever mode changes
  useEffect(() => {
    applyView(mode)
    try {
      localStorage.setItem('viewMode', mode)
    } catch {
      // localStorage may not be available
    }
  }, [mode, applyView])

  const switchTo = useCallback((newMode: ViewMode) => {
    setMode(newMode)
  }, [])

  return (
    <div ref={containerRef}>
      <div class={toggleContainerCss}>
        <button
          type='button'
          class={toggleButtonBaseCss}
          data-active={mode === 'list' ? 'true' : 'false'}
          onClick={() => switchTo('list')}
          aria-label='List view'
        >
          <ListIcon />
        </button>
        <button
          type='button'
          class={toggleButtonBaseCss}
          data-active={mode === 'grid' ? 'true' : 'false'}
          onClick={() => switchTo('grid')}
          aria-label='Grid view'
        >
          <GridIcon />
        </button>
      </div>
      {children}
    </div>
  )
}
