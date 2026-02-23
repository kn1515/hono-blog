import { format } from '@formkit/tempo'
import { css } from 'hono/css'
import type { PostMeta } from '../lib/post-meta'
import { parseDate } from '../lib/time'

const sectionCss = css`
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 0.5px solid var(--c-border);
`

const headingCss = css`
  font-size: 1.2rem;
  font-weight: 700;
  margin: 0 0 1.25rem;
  color: var(--c-text);
`

const gridCss = css`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

const cardCss = css`
  display: block;
  text-decoration: none;
  border-radius: 0.5rem;
  overflow: hidden;
  border: 1px solid var(--c-card-border);
  background-color: var(--c-card-bg);
  transition: box-shadow 0.2s ease-out, transform 0.2s ease-out;

  &:hover {
    box-shadow: 0 4px 12px var(--c-shadow);
    transform: translateY(-2px);
  }
`

const cardImageCss = css`
  width: 100%;
  height: 120px;
  object-fit: cover;
  display: block;
`

const cardImagePlaceholderCss = css`
  width: 100%;
  height: 120px;
  background-color: var(--c-bg-alt);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--c-text-muted);
  font-size: 1.5rem;
`

const cardBodyCss = css`
  padding: 0.75rem;
`

const cardTitleCss = css`
  font-size: 0.9rem;
  font-weight: bold;
  color: var(--c-text);
  margin: 0 0 0.4rem;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

const cardDateCss = css`
  font-size: 0.75rem;
  color: var(--c-text-muted);
`

type Props = {
  posts: PostMeta[]
}

export function RelatedPosts({ posts }: Props) {
  if (posts.length === 0) return null

  return (
    <section class={sectionCss}>
      <h2 class={headingCss}>関連記事</h2>
      <div class={gridCss}>
        {posts.map(post => (
          <a href={post.permalink} class={cardCss} key={post.permalink}>
            {post.image ? (
              <img src={post.image} alt={post.title} class={cardImageCss} />
            ) : (
              <div class={cardImagePlaceholderCss}>📄</div>
            )}
            <div class={cardBodyCss}>
              <p class={cardTitleCss}>{post.title}</p>
              <time class={cardDateCss} datetime={post.date}>
                {format(parseDate(post.date), 'YYYY/MM/DD')}
              </time>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}
