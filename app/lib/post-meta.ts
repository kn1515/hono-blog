/**
 * Lightweight post metadata extraction that avoids circular dependency.
 *
 * `lib/posts.ts` eagerly imports all MDX modules (including their default
 * export, which triggers `_renderer.tsx`). Importing `lib/posts.ts` from
 * the renderer therefore creates a cycle in Vite SSR dev mode.
 *
 * This module reads **only the frontmatter** via `import.meta.glob` with
 * `{ eager: true, import: 'frontmatter' }`, which does NOT pull in the
 * full MDX component tree and therefore breaks the cycle.
 */

import type { Frontmatter } from '../routes/posts/types'
import { parseDate } from './time'

export type PostMeta = {
  title: string
  permalink: string
  date: string
  description: string
  categories: string[]
  tags: string[]
  image?: string
}

const frontmatters = import.meta.glob<Frontmatter>('../routes/posts/**/*.mdx', {
  eager: true,
  import: 'frontmatter',
})

function _getAllPostMeta(): PostMeta[] {
  return Object.entries(frontmatters)
    .sort(([_aId, a], [_bId, b]) => {
      const aDate = parseDate(a.date)
      const bDate = parseDate(b.date)
      return aDate.getTime() < bDate.getTime() ? 1 : -1
    })
    .map(([id, fm]) => ({
      title: fm.title,
      permalink: `${id.replace(/^\.\.\/routes/, '').replace(/\/index\.mdx$/, '')}/`,
      date: fm.date,
      description: fm.description || '',
      categories: fm.categories || [],
      tags: fm.tags || [],
      image: fm.image || undefined,
    }))
}

const allPostMeta = _getAllPostMeta()

export function getAllPostMeta(): PostMeta[] {
  return allPostMeta
}
