# Testing hono-blog Frontend

## Overview
This blog is built with Hono/HonoX + Vite and deployed to Cloudflare Pages. It uses SSG (Static Site Generation) with MDX for blog posts.

## Running Locally

```bash
pnpm dev
```

Starts the Vite dev server at `http://localhost:5173`. Hot reload is supported.

For production-like preview:
```bash
pnpm build
pnpm preview
```

## Key Testing Areas

### View Toggle (Grid / List)
- The home page (`/`) and paginated pages (`/page/[num]`) have a **ViewToggle** component with two buttons:
  - **List view** button (left, `#view-toggle-list`) — hidden by default (`display:none` on `#post-list-view`)
  - **Grid view** button (right, `#view-toggle-grid`) — shown by default
- Clicking the list button shows `PostSummarySection` components; clicking the grid button shows `PostGridContainer` with `PostGridCard` components.
- The toggle logic is in a `<script>` tag inside `app/routes/_renderer.tsx` (search for `viewToggleScript`).

### Thumbnail / Image Handling
- Posts define their thumbnail via `image:` in MDX frontmatter (e.g., `image: "/posts/hello-world/53372440.png"`).
- **Grid view** (`PostGridCard.tsx`): Shows the image or a "No Image" placeholder div.
- **List view** (`PostSummarySection.tsx`): Shows a 50px circular image or a "No Image" circular placeholder.
- To test image fallback behavior, find posts without an `image:` field in their frontmatter. Check `app/routes/posts/*/index.mdx` files.

### Post Structure
- All posts are MDX files at `app/routes/posts/<slug>/index.mdx`.
- Frontmatter fields: `title`, `date`, `description`, `categories`, `tags`, `image` (optional), `pinned` (optional).
- Posts are sorted by date descending, paginated at 10 per page (`POSTS_PER_PAGE` in `app/lib/posts.ts`).

## CI/CD
- **Lint**: Uses Biome (`biome ci .`). Note: `test-results/.last-run.json` may cause a pre-existing lint failure unrelated to code changes.
- **Build**: Runs `pnpm build` via GitHub Actions.
- **Deploy**: Automatically deploys to Cloudflare Pages on push. Preview URLs appear as commit statuses on PRs.

## Devin Secrets Needed
No secrets are required for local development and testing.
