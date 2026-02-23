import type { Frontmatter } from './routes/posts/types'

type Head = {
  frontmatter?: Frontmatter
  filepath?: string

  title?: string
}

declare module 'hono' {
  interface Env {
    Variables: {}
    Bindings: {}
  }
  interface ContextRenderer {
    // biome-ignore lint/style/useShorthandFunctionType: interface method signature required for Hono ContextRenderer
    (
      content: string | Promise<string>,
      head?: Head,
    ): Response | Promise<Response>
  }
}
