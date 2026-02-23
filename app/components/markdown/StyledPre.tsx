import type { PropsWithChildren } from 'hono/jsx'

export function StyledPre(props: PropsWithChildren) {
  return (
    <div class='code-block-wrapper'>
      <button type='button' class='code-copy-btn'>
        Copy
      </button>
      <pre>{props.children}</pre>
    </div>
  )
}
