import { css } from 'hono/css'
import { getCategoryList } from '../lib/categories'
import { gray, grayLight } from '../styles/color'

/* ── Inline SVG Icons ── */
const svgProps = {
  width: '16',
  height: '16',
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

/* ── Styles ── */
const headerCss = css`
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(221, 224, 228, 0.6);
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.04);
`

const headerContainerCss = css`
  max-width: 900px;
  margin: 0 auto;
  padding: 0.75rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.5rem;

  @media (max-width: 600px) {
    flex-direction: column;
    padding: 0.6rem 1rem;
  }
`

const titleCss = css`
  color: ${gray};
  text-decoration: none;
  font-size: 1.35rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  transition: color 0.25s ease, transform 0.25s ease;
  display: inline-block;

  &:hover,
  &:focus {
    color: #4172b5;
    transform: translateY(-1px);
  }
`

const navigationListCss = css`
  list-style-type: none;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  flex-wrap: wrap;
  justify-content: center;

  & li {
    & a {
      display: flex;
      align-items: center;
      gap: 0.35rem;
      color: ${grayLight};
      text-decoration: none;
      font-size: 0.88rem;
      font-weight: 500;
      padding: 0.4rem 0.7rem;
      border-radius: 8px;
      transition: all 0.2s ease;

      &:hover,
      &:focus {
        color: ${gray};
        background: rgba(65, 114, 181, 0.08);
      }
    }
  }
`

const dividerCss = css`
  width: 1px;
  height: 1rem;
  background: rgba(221, 224, 228, 0.8);
  margin: 0 0.15rem;

  @media (max-width: 600px) {
    display: none;
  }
`

const IconChevron = () => (
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
    font-size: 0.88rem;
    font-weight: 500;
    padding: 0.4rem 0.7rem;
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
      background: rgba(65, 114, 181, 0.08);
    }
  }

  &[open] summary .accordion-chevron {
    transform: rotate(180deg);
  }

  & .accordion-panel {
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 200;
    background: rgba(255, 255, 255, 0.97);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(221, 224, 228, 0.6);
    border-radius: 10px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    padding: 0.5rem;
    margin-top: 0.25rem;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 0.25rem;
    min-width: 200px;
    animation: accordionFadeIn 0.2s ease;
  }

  & .accordion-panel a {
    display: block;
    color: ${grayLight};
    text-decoration: none;
    font-size: 0.84rem;
    font-weight: 500;
    padding: 0.35rem 0.75rem;
    border-radius: 6px;
    white-space: nowrap;
    transition: all 0.15s ease;

    &:hover,
    &:focus {
      color: ${gray};
      background: rgba(65, 114, 181, 0.08);
    }
  }

  @media (max-width: 600px) {
    & .accordion-panel {
      position: static;
      box-shadow: none;
      border: none;
      background: rgba(65, 114, 181, 0.04);
      backdrop-filter: none;
      -webkit-backdrop-filter: none;
      border-radius: 8px;
      margin-top: 0.25rem;
      padding: 0.4rem;
      flex-direction: column;
      min-width: 0;
      width: 100%;
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

export const Header = () => {
  const categories = getCategoryList()
  return (
    <header class={headerCss}>
      <div class={headerContainerCss}>
        <a href='/' class={titleCss}>
          ぽんろぐ備忘録
        </a>
        <nav>
          <ul class={navigationListCss}>
            <li>
              <details class={accordionCss}>
                <summary>
                  <IconCategory />
                  Categories
                  <IconChevron />
                </summary>
                <div class='accordion-panel'>
                  {categories.map(category => (
                    <a href={`/categories/${category.id}/`}>
                      {category.name}
                    </a>
                  ))}
                </div>
              </details>
            </li>
            <li>
              <a href='/tags/'>
                <IconTag />
                Tags
              </a>
            </li>
            <li>
              <a href='/index.xml'>
                <IconRss />
                RSS
              </a>
            </li>
            <li>
              <a href='/about/'>
                <IconPerson />
                About
              </a>
            </li>
            <li>
              <a href='/contact/'>
                <IconMail />
                Contact
              </a>
            </li>
            <li>
              <div class={dividerCss} />
            </li>
            <li>
              <a
                href='https://github.com/kn1515'
                target='_blank'
                rel='noopener noreferrer'
              >
                <IconGithub />
              </a>
            </li>
            <li>
              <a
                href='https://twitter.com/Non_c5c'
                target='_blank'
                rel='noopener noreferrer'
              >
                <IconX />
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
