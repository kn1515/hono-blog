import { useState, useEffect, useRef, useCallback } from 'hono/jsx/dom'
import { css } from 'hono/css'

type SearchablePost = {
  title: string
  permalink: string
  date: string
  description: string
  categories: string[]
  tags: string[]
  image?: string
}

/* ── SVG Icons ── */
const IconSearch = () => (
  <svg
    width='18'
    height='18'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    stroke-width='2'
    stroke-linecap='round'
    stroke-linejoin='round'
    style='flex-shrink:0'
  >
    <circle cx='11' cy='11' r='8' />
    <line x1='21' y1='21' x2='16.65' y2='16.65' />
  </svg>
)

const IconClose = () => (
  <svg
    width='16'
    height='16'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    stroke-width='2'
    stroke-linecap='round'
    stroke-linejoin='round'
    style='flex-shrink:0'
  >
    <line x1='18' y1='6' x2='6' y2='18' />
    <line x1='6' y1='6' x2='18' y2='18' />
  </svg>
)

/* ── Styles ── */
const searchWrapperCss = css`
  position: relative;
  display: flex;
  align-items: center;
`

const searchButtonCss = css`
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

const searchOverlayCss = css`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 300;
  animation: searchOverlayFadeIn 0.15s ease;

  @keyframes searchOverlayFadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`

const searchModalCss = css`
  position: fixed;
  top: 15%;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  max-width: 560px;
  background: var(--c-panel-bg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--c-panel-border);
  border-radius: 12px;
  box-shadow: 0 8px 32px var(--c-shadow-lg);
  z-index: 301;
  animation: searchModalSlideIn 0.2s ease;
  overflow: hidden;

  @keyframes searchModalSlideIn {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(-8px);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }
`

const searchInputContainerCss = css`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--c-border);
`

const searchInputCss = css`
  flex: 1;
  border: none;
  background: transparent;
  color: var(--c-text);
  font-size: 1rem;
  outline: none;
  font-family: inherit;

  &::placeholder {
    color: var(--c-text-faint);
  }
`

const closeButtonCss = css`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: none;
  background: transparent;
  color: var(--c-text-muted);
  cursor: pointer;
  transition: all 0.15s ease;
  padding: 0;

  &:hover {
    color: var(--c-text);
    background: var(--c-accent-hover-bg);
  }
`

const searchResultsCss = css`
  max-height: 400px;
  overflow-y: auto;
  padding: 0.5rem;
`

const searchResultItemCss = css`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.6rem 0.75rem;
  border-radius: 8px;
  text-decoration: none;
  color: var(--c-text);
  transition: background 0.15s ease;

  &:hover {
    background: var(--c-accent-hover-bg);
  }
`

const resultImageCss = css`
  width: 48px;
  height: 48px;
  border-radius: 6px;
  object-fit: cover;
  flex-shrink: 0;
`

const resultImagePlaceholderCss = css`
  width: 48px;
  height: 48px;
  border-radius: 6px;
  background: var(--c-bg-alt);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--c-text-faint);
  font-size: 0.7rem;
  flex-shrink: 0;
`

const resultInfoCss = css`
  flex: 1;
  min-width: 0;
`

const resultTitleCss = css`
  font-size: 0.9rem;
  font-weight: 600;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const resultMetaCss = css`
  font-size: 0.75rem;
  color: var(--c-text-muted);
  margin-top: 0.15rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const noResultsCss = css`
  padding: 2rem 1rem;
  text-align: center;
  color: var(--c-text-muted);
  font-size: 0.9rem;
`

const searchHintCss = css`
  padding: 2rem 1rem;
  text-align: center;
  color: var(--c-text-faint);
  font-size: 0.85rem;
`

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return dateStr
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}/${m}/${day}`
}

export default function SearchBox() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [posts, setPosts] = useState<SearchablePost[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  // Load posts data from the embedded script tag on mount
  useEffect(() => {
    try {
      const el = document.getElementById('search-posts-data')
      if (el) {
        const data = JSON.parse(el.textContent || '[]') as SearchablePost[]
        setPosts(data)
      }
    } catch {
      // ignore parse errors
    }
  }, [])

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => {
        inputRef.current?.focus()
      })
    } else {
      setQuery('')
    }
  }, [isOpen])

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
      // Cmd/Ctrl + K to open search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(prev => !prev)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  const openSearch = useCallback(() => {
    setIsOpen(true)
  }, [])

  const closeSearch = useCallback(() => {
    setIsOpen(false)
  }, [])

  const handleOverlayClick = useCallback((e: MouseEvent) => {
    if ((e.target as HTMLElement).dataset.overlay === 'true') {
      setIsOpen(false)
    }
  }, [])

  // Filter posts based on query
  const filteredPosts = query.trim()
    ? posts.filter(post => {
        const q = query.toLowerCase()
        return (
          post.title.toLowerCase().includes(q) ||
          post.description.toLowerCase().includes(q) ||
          post.categories.some(c => c.toLowerCase().includes(q)) ||
          post.tags.some(t => t.toLowerCase().includes(q))
        )
      })
    : []

  return (
    <div class={searchWrapperCss}>
      <button
        type='button'
        class={searchButtonCss}
        onClick={openSearch}
        aria-label='Search'
      >
        <IconSearch />
      </button>

      {isOpen && (
        <>
          <div
            class={searchOverlayCss}
            data-overlay='true'
            onClick={handleOverlayClick}
          />
          <div class={searchModalCss}>
            <div class={searchInputContainerCss}>
              <IconSearch />
              <input
                ref={inputRef}
                type='text'
                class={searchInputCss}
                placeholder='記事を検索...'
                value={query}
                onInput={(e: Event) =>
                  setQuery((e.target as HTMLInputElement).value)
                }
              />
              <button
                type='button'
                class={closeButtonCss}
                onClick={closeSearch}
                aria-label='Close search'
              >
                <IconClose />
              </button>
            </div>
            <div class={searchResultsCss}>
              {query.trim() === '' ? (
                <div class={searchHintCss}>
                  タイトル、説明、カテゴリ、タグで検索できます
                </div>
              ) : filteredPosts.length === 0 ? (
                <div class={noResultsCss}>
                  「{query}」に一致する記事が見つかりませんでした
                </div>
              ) : (
                filteredPosts.map(post => (
                  <a href={post.permalink} class={searchResultItemCss}>
                    {post.image ? (
                      <img
                        src={post.image}
                        alt={post.title}
                        class={resultImageCss}
                      />
                    ) : (
                      <div class={resultImagePlaceholderCss}>No Image</div>
                    )}
                    <div class={resultInfoCss}>
                      <div class={resultTitleCss}>{post.title}</div>
                      <div class={resultMetaCss}>
                        {formatDate(post.date)}
                        {post.categories.length > 0 &&
                          ` / ${post.categories.join(', ')}`}
                      </div>
                    </div>
                  </a>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
