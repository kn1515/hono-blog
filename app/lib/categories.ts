/**
 * Lightweight category data extraction that avoids circular dependency.
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

export type CategoryInfo = {
  id: string
  name: string
}

const frontmatters = import.meta.glob<Frontmatter>(
  '../routes/posts/**/*.mdx',
  { eager: true, import: 'frontmatter' },
)

function categoryNameToId(name: string): string {
  return name.toLowerCase()
}

function _getCategoryList(): CategoryInfo[] {
  const nameSet = new Set<string>()
  for (const fm of Object.values(frontmatters)) {
    if (fm.categories?.[0]) {
      nameSet.add(fm.categories[0])
    }
  }
  return Array.from(nameSet).map(name => ({
    id: categoryNameToId(name),
    name,
  }))
}

const categoryList = _getCategoryList()

export function getCategoryList(): CategoryInfo[] {
  return categoryList
}
