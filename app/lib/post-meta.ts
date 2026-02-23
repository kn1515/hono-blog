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

/**
 * Find up to `limit` related posts based on shared tags and categories.
 * Excludes the current post itself. Posts are scored by the number of
 * shared tags + categories, then sorted by score (desc) and date (desc).
 * If fewer than `limit` related posts are found, fills the remaining
 * slots with the most recent posts.
 */
export function getRelatedPosts(
  currentPermalink: string,
  categories: string[],
  tags: string[],
  limit = 3,
): PostMeta[] {
  const others = allPostMeta.filter(p => p.permalink !== currentPermalink)

  const scored = others
    .map(p => {
      let score = 0
      for (const cat of categories) {
        if (p.categories.includes(cat)) score += 1
      }
      for (const tag of tags) {
        if (p.tags.includes(tag)) score += 2
      }
      return { post: p, score }
    })
    .filter(s => s.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score
      return parseDate(b.post.date).getTime() - parseDate(a.post.date).getTime()
    })

  const related = scored.slice(0, limit).map(s => s.post)

  // Fill remaining slots with recent posts not already included
  if (related.length < limit) {
    const usedPermalinks = new Set([
      currentPermalink,
      ...related.map(p => p.permalink),
    ])
    for (const p of others) {
      if (related.length >= limit) break
      if (!usedPermalinks.has(p.permalink)) {
        related.push(p)
        usedPermalinks.add(p.permalink)
      }
    }
  }

  return related
}
