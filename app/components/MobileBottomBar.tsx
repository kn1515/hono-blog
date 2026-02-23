import { css } from 'hono/css'
import { getCategoryList } from '../lib/categories'

/* ── Bottom Tab Bar (mobile only) ── */
const bottomBarCss = css`
  display: none;

  @media (max-width: 900px) {
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 200;
    background: var(--c-panel-bg);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-top: 1px solid var(--c-panel-border);
    box-shadow: 0 -1px 8px var(--c-shadow);
    height: 56px;
    align-items: center;
    justify-content: space-around;
    padding: 0 0.5rem;
    padding-bottom: env(safe-area-inset-bottom, 0);
  }
`

const tabBtnCss = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.2rem;
  background: none;
  border: none;
  color: var(--c-text-muted);
  font-size: 0.65rem;
  font-weight: 500;
  cursor: pointer;
  padding: 0.35rem 0.75rem;
  border-radius: 8px;
  transition: color 0.15s ease, background 0.15s ease;
  text-decoration: none;
  -webkit-tap-highlight-color: transparent;
  position: relative;

  &:hover,
  &:active {
    color: var(--c-accent);
    background: var(--c-accent-hover-bg);
  }
`

/* ── Sidebar Overlay (mobile drawer) ── */
const sidebarOverlayCss = css`
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 250;
  opacity: 0;
  transition: opacity 0.25s ease;

  &.is-open {
    opacity: 1;
  }
`

const sidebarDrawerCss = css`
  display: none;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 320px;
  max-width: 85vw;
  z-index: 251;
  background: var(--c-bg);
  box-shadow: -4px 0 24px var(--c-shadow-lg);
  overflow-y: auto;
  transform: translateX(100%);
  transition: transform 0.3s cubic-bezier(0.32, 0.72, 0, 1);
  padding: 1rem;
  padding-bottom: calc(56px + env(safe-area-inset-bottom, 0) + 1rem);

  &.is-open {
    transform: translateX(0);
  }
`

/* ── Category Dropdown (bottom sheet) ── */
const categoryOverlayCss = css`
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 260;
  opacity: 0;
  transition: opacity 0.25s ease;

  &.is-open {
    opacity: 1;
  }
`

const categoryDropdownCss = css`
  display: none;
  position: fixed;
  bottom: calc(56px + env(safe-area-inset-bottom, 0));
  left: 0;
  right: 0;
  z-index: 261;
  background: var(--c-panel-bg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-top: 1px solid var(--c-panel-border);
  border-radius: 16px 16px 0 0;
  box-shadow: 0 -4px 24px var(--c-shadow-lg);
  padding: 1rem;
  transform: translateY(100%);
  transition: transform 0.3s cubic-bezier(0.32, 0.72, 0, 1);
  max-height: 60vh;
  overflow-y: auto;

  &.is-open {
    transform: translateY(0);
  }
`

const categoryDropdownTitleCss = css`
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--c-text-muted);
  margin: 0 0 0.75rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--c-border);
`

const categoryDropdownListCss = css`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0;
`

const categoryDropdownItemCss = css`
  & a {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.7rem 0.5rem;
    font-size: 0.9rem;
    color: var(--c-text);
    text-decoration: none;
    border-radius: 8px;
    transition: background 0.15s ease, color 0.15s ease;

    &:hover,
    &:active {
      background: var(--c-accent-hover-bg);
      color: var(--c-accent);
    }
  }

  & + & {
    border-top: 1px solid var(--c-border);
  }
`

/* ── Icons ── */
const HomeIcon = () => (
  <svg width='20' height='20' viewBox='0 0 24 24' fill='currentColor'>
    <path d='M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z' />
  </svg>
)

const SearchIcon = () => (
  <svg
    width='20'
    height='20'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    stroke-width='2'
    stroke-linecap='round'
    stroke-linejoin='round'
  >
    <circle cx='11' cy='11' r='8' />
    <line x1='21' y1='21' x2='16.65' y2='16.65' />
  </svg>
)

const TopIcon = () => (
  <svg width='20' height='20' viewBox='0 0 24 24' fill='currentColor'>
    <path d='M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z' />
  </svg>
)

const SidebarIcon = () => (
  <svg width='20' height='20' viewBox='0 0 24 24' fill='currentColor'>
    <path d='M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z' />
  </svg>
)

const CategoryIcon = () => (
  <svg width='20' height='20' viewBox='0 0 24 24' fill='currentColor'>
    <path d='M12 2l-5.5 9h11L12 2zm0 3.84L13.93 9h-3.87L12 5.84zM17.5 13c-2.49 0-4.5 2.01-4.5 4.5s2.01 4.5 4.5 4.5 4.5-2.01 4.5-4.5-2.01-4.5-4.5-4.5zm0 7c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5zM3 21.5h8v-8H3v8zm2-6h4v4H5v-4z' />
  </svg>
)

export function MobileBottomBar() {
  const categories = getCategoryList()

  return (
    <>
      {/* Bottom Tab Bar */}
      <nav class={bottomBarCss} id='mobile-bottom-bar'>
        <a href='/' class={tabBtnCss}>
          <HomeIcon />
          <span>ホーム</span>
        </a>
        <button type='button' class={tabBtnCss} id='mobile-search-btn'>
          <SearchIcon />
          <span>検索</span>
        </button>
        <button type='button' class={tabBtnCss} id='mobile-category-btn'>
          <CategoryIcon />
          <span>カテゴリ</span>
        </button>
        <button type='button' class={tabBtnCss} id='mobile-top-btn'>
          <TopIcon />
          <span>トップ</span>
        </button>
        <button type='button' class={tabBtnCss} id='mobile-sidebar-btn'>
          <SidebarIcon />
          <span>サイドバー</span>
        </button>
      </nav>

      {/* Sidebar Drawer Overlay */}
      <div class={sidebarOverlayCss} id='sidebar-overlay' />
      <div class={sidebarDrawerCss} id='sidebar-drawer' />

      {/* Category Dropdown (bottom sheet) */}
      <div class={categoryOverlayCss} id='category-overlay' />
      <div class={categoryDropdownCss} id='category-dropdown'>
        <h3 class={categoryDropdownTitleCss}>カテゴリー</h3>
        <ul class={categoryDropdownListCss}>
          {categories.map(cat => (
            <li class={categoryDropdownItemCss}>
              <a href={`/categories/${cat.id}/`}>{cat.name}</a>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
