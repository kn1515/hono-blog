import { css } from 'hono/css'
import type { PropsWithChildren } from 'hono/jsx'

const tocWrapperCss = css`
  margin: 2rem 0;
  border: 1px solid var(--c-border);
  border-radius: 10px;
  background: var(--c-bg-alt, #f8fafc);
  overflow: hidden;

  .dark & {
    background: var(--c-bg-alt, #2a2a30);
  }
`

const tocHeaderCss = css`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--c-text);
  background: var(--c-accent-bg);
  border-bottom: 1px solid var(--c-border);
  cursor: pointer;
  user-select: none;

  &::before {
    content: "";
    display: inline-block;
    width: 4px;
    height: 1.1em;
    background: var(--c-accent);
    border-radius: 2px;
    flex-shrink: 0;
  }
`

const tocBodyCss = css`
  padding: 0.75rem 1.25rem 0.75rem 1.5rem;

  & ul,
  & ol {
    margin: 0;
    padding-left: 1.25rem;
    list-style: none;
    counter-reset: toc-counter;
  }

  & > ul,
  & > ol {
    padding-left: 0;
  }

  & li {
    position: relative;
    padding: 0.3rem 0;
    font-size: 0.9rem;
    line-height: 1.6;
    color: var(--c-text);
    counter-increment: toc-counter;

    &::before {
      content: counter(toc-counter) ".";
      color: var(--c-accent);
      font-weight: 600;
      margin-right: 0.4rem;
      min-width: 1.4em;
      display: inline-block;
    }
  }

  & li li {
    font-size: 0.85rem;
    padding: 0.2rem 0;
  }

  & a {
    color: var(--c-text);
    text-decoration: none;
    transition: color 0.15s ease;

    &:hover {
      color: var(--c-accent);
    }
  }
`

type Props = PropsWithChildren<{
  title?: string
}>

export function Toc({ children, title }: Props) {
  return (
    <div class={tocWrapperCss}>
      <div class={tocHeaderCss}>{title || '目次'}</div>
      <nav class={tocBodyCss}>{children}</nav>
    </div>
  )
}
