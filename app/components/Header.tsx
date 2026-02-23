import { css } from 'hono/css'
import { gray, grayLight } from '../styles/color'

/* ── Inline SVG Icons ── */
const svgProps = {
  width: '24',
  height: '24',
  viewBox: '0 0 24 24',
  fill: 'currentColor',
  style: 'flex-shrink:0',
}

const IconCategory = () => (
  <svg {...svgProps}>
    <path d='M12 2l-5.5 9h11L12 2zm0 3.84L13.93 9h-3.87L12 5.84zM17.5 13c-2.49 0-4.5 2.01-4.5 4.5s2.01 4.5 4.5 4.5 4.5-2.01 4.5-4.5-2.01-4.5-4.5-4.5zm0 7c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5zM3 21.5h8v-8H3v8zm2-6h4v4H5v-4z' />
  </svg>
)

const IconTag = () => (
  <svg {...svgProps}>
    <path d='M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z' />
  </svg>
)

const IconRss = () => (
  <svg {...svgProps}>
    <path d='M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19 7.38 20 6.18 20C5 20 4 19 4 17.82a2.18 2.18 0 0 1 2.18-2.18M4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44m0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93V10.1z' />
  </svg>
)

const IconPerson = () => (
  <svg {...svgProps}>
    <path d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z' />
  </svg>
)

const IconMail = () => (
  <svg {...svgProps}>
    <path d='M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z' />
  </svg>
)

const IconGithub = () => (
  <svg {...svgProps}>
    <path d='M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z' />
  </svg>
)

const IconX = () => (
  <svg {...svgProps}>
    <path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' />
  </svg>
)

const IconMenu = () => (
  <svg {...svgProps}>
    <path d='M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z' />
  </svg>
)



/* ── Styles ── */
const headerCss = css`
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--c-header-bg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--c-header-border);
  box-shadow: 0 1px 8px var(--c-shadow);
  transition: background-color 0.3s ease, border-color 0.3s ease;
`

const headerContainerCss = css`
  max-width: 900px;
  margin: 0 auto;
  padding: 0.75rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  z-index: 1;
  flex-wrap: wrap;
  gap: 0.5rem;

  @media (max-width: 600px) {
    flex-direction: row;
    align-items: center;
    padding: 0.6rem 1rem;
  }

  @media (max-width: 434px) {
    padding: 0.5rem 0.5rem;
    gap: 0.35rem;
  }
`

const titleCss = css`
  color: var(--c-text);
  text-decoration: none;
  transition: color 0.25s ease, transform 0.25s ease, opacity 0.25s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--c-bg);
  padding: 0.2rem 0.5rem;
  border-radius: 8px;
  position: relative;
  z-index: 2;

  &:hover,
  &:focus {
    transform: translateY(-1px);
    opacity: 0.85;
  }

  & img {
    height: 100px;
    width: auto;
    display: block;
  }

  @media (max-width: 434px) {
    padding: 0.15rem 0.3rem;

    & img {
      height: 64px;
    }
  }
`

const navAreaCss = css`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--c-bg);
  padding: 0.25rem 0.5rem;
  border-radius: 8px;
  position: relative;
  z-index: 2;
  flex-shrink: 0;

  @media (max-width: 600px) {
    align-self: flex-end;
  }

  @media (max-width: 434px) {
    gap: 0.25rem;
    padding: 0.2rem 0.3rem;
  }
`

const _socialLinksCss = css`
  display: flex;
  align-items: center;
  gap: 0.15rem;

  & a {
    display: flex;
    align-items: center;
    color: ${grayLight};
    text-decoration: none;
    padding: 0.45rem 0.55rem;
    border-radius: 8px;
    transition: all 0.2s ease;

    &:hover,
    &:focus {
      color: ${gray};
      background: var(--c-accent-hover-bg);
    }
  }
`

const dividerCss = css`
  width: 1px;
  height: 1rem;
  background: var(--c-divider);

  @media (max-width: 600px) {
    display: none;
  }
`

const _IconChevron = () => (
  <svg
    width='12'
    height='12'
    viewBox='0 0 24 24'
    fill='currentColor'
    style='flex-shrink:0;transition:transform 0.25s ease'
    class='accordion-chevron'
  >
    <path d='M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z' />
  </svg>
)

const accordionCss = css`
  position: relative;
  list-style: none;

  & summary {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    color: ${grayLight};
    font-size: 2rem;
    font-weight: 500;
    padding: 0.45rem 0.75rem;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    list-style: none;
    user-select: none;

    &::-webkit-details-marker {
      display: none;
    }

    &::marker {
      display: none;
      content: '';
    }

    &:hover,
    &:focus {
      color: ${gray};
      background: var(--c-accent-hover-bg);
    }
  }

  &[open] summary .accordion-chevron {
    transform: rotate(180deg);
  }

  & .accordion-panel {
    position: absolute;
    top: 100%;
    right: 0;
    z-index: 200;
    background: var(--c-panel-bg);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid var(--c-panel-border);
    border-radius: 10px;
    box-shadow: 0 4px 20px var(--c-shadow-lg);
    padding: 0.5rem;
    margin-top: 0.25rem;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 0.25rem;
    min-width: 280px;
    animation: accordionFadeIn 0.2s ease;
  }

  & .accordion-panel a {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    color: ${grayLight};
    text-decoration: none;
    font-size: 0.84rem;
    font-weight: 500;
    padding: 0.4rem 0.75rem;
    border-radius: 6px;
    white-space: nowrap;
    transition: all 0.15s ease;

    &:hover,
    &:focus {
      color: ${gray};
      background: var(--c-accent-hover-bg);
    }
  }

  @media (max-width: 600px) {
    & .accordion-panel {
      position: absolute;
      right: 0;
      box-shadow: 0 4px 20px var(--c-shadow-lg);
      border: 1px solid var(--c-panel-border);
      background: var(--c-panel-bg);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-radius: 10px;
      margin-top: 0.25rem;
      padding: 0.5rem;
      flex-direction: column;
      min-width: 180px;
      width: auto;
    }
  }

  @keyframes accordionFadeIn {
    from {
      opacity: 0;
      transform: translateY(-4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`

/* ── Theme Toggle ── */
const IconSun = () => (
  <svg
    width='20'
    height='20'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    stroke-width='2'
    stroke-linecap='round'
    stroke-linejoin='round'
    style='flex-shrink:0'
  >
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
  <svg
    width='20'
    height='20'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    stroke-width='2'
    stroke-linecap='round'
    stroke-linejoin='round'
    style='flex-shrink:0'
  >
    <path d='M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z' />
  </svg>
)

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

export const Header = () => {
  return (
    <header class={headerCss} id='site-header'>
      <div class={headerContainerCss}>
        <a href='/' class={titleCss}>
          <img src='/static/logo.png' alt='ぽんろぐ備忘録' />
        </a>
        <nav class={navAreaCss}>
          <details class={accordionCss}>
            <summary>
              <IconMenu />
            </summary>
            <div class='accordion-panel'>
              <a href='/categories/'>
                <IconCategory />
                Categories
              </a>
              <a href='/tags/'>
                <IconTag />
                Tags
              </a>
              <a href='/index.xml'>
                <IconRss />
                RSS
              </a>
              <a href='/about/'>
                <IconPerson />
                About
              </a>
              <a href='/contact/'>
                <IconMail />
                Contact
              </a>
              <a
                href='https://github.com/kn1515'
                target='_blank'
                rel='noopener noreferrer'
              >
                <IconGithub />
                GitHub
              </a>
              <a
                href='https://twitter.com/Non_c5c'
                target='_blank'
                rel='noopener noreferrer'
              >
                <IconX />
                X(twitter)
              </a>
            </div>
          </details>
          <div class={dividerCss} />
          <button
            type='button'
            id='search-open-btn'
            aria-label='Search'
            style='display:flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:8px;border:none;background:transparent;color:var(--c-text-muted);cursor:pointer;transition:all 0.2s ease;padding:0'
          >
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
          </button>
          <div class={dividerCss} />
          <button
            type='button'
            class={themeToggleCss}
            id='theme-toggle'
            aria-label='Toggle theme'
          >
            <span class='icon-sun'>
              <IconSun />
            </span>
            <span class='icon-moon'>
              <IconMoon />
            </span>
          </button>
        </nav>
      </div>
    </header>
  )
}
