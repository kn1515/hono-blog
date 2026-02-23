import { css } from 'hono/css'
import { border, gray, white } from '../styles/color'

const paginationCss = css`
  border-top: .5px solid ${border};
  padding-top: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  width: 100%;
`

const arrowCss = css`
  -webkit-transition: all 0.2s ease-out;
  -moz-transition: all 0.2s ease-out;
  transition: all 0.2s ease-out;

  border: solid 1px ${gray};
  color: ${gray};
  border-radius: 0.35rem;
  padding: 0.4rem 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  font-size: 1.1rem;
  flex-shrink: 0;
  &:hover,
  &:focus {
      background-color: ${gray};
      color: ${white};
  }  
`

const leftCss = css`
    ${arrowCss}
`
const rightCss = css`
    ${arrowCss}
`

const emptyArrowCss = css`
  width: 60px; 
`

const pageNumberCss = css`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background-color: var(--c-accent);
  color: #fff;
  font-size: 1.1rem;
  font-weight: 600;
  flex-shrink: 0;
`

type Props = {
  pageNumber: number

  hasPrev: boolean
  hasNext: boolean

  basePath?: string
}

export function Pagination({ pageNumber, hasPrev, hasNext, basePath }: Props) {
  return (
    <div class={paginationCss}>
      {hasPrev ? (
        <a href={`${basePath ?? ''}/page/${pageNumber - 1}/`} class={leftCss}>
          &#8592;
        </a>
      ) : (
        <div class={emptyArrowCss} />
      )}
      <span class={pageNumberCss}>{pageNumber}</span>
      {hasNext ? (
        <a href={`${basePath ?? ''}/page/${pageNumber + 1}/`} class={rightCss}>
          &#8594;
        </a>
      ) : null}
    </div>
  )
}
