import { format } from '@formkit/tempo'
import { css } from 'hono/css'
import type { Post } from '../lib/posts'
import { parseDate } from '../lib/time'

/* ── Hero Container ── */
const heroCss = css`
  display: flex;
  align-items: stretch;
  gap: 1.5rem;
  margin-bottom: 1.5rem;

  @media (max-width: 700px) {
    flex-direction: column;
  }
`

const heroIntroCss = css`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: left;
  padding: 1.25rem 0;
  min-width: 0;

  @media (max-width: 700px) {
    text-align: center;
  }
`

const heroTitleCss = css`
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--c-text);
  margin: 0 0 0.35rem;
`

const heroDescCss = css`
  font-size: 0.88rem;
  color: var(--c-text-muted);
  margin: 0;
  line-height: 1.6;
`

/* ── Pinned Section (right side) ── */
const pinnedSideCss = css`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
`

const pinnedHeaderCss = css`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--c-accent);
  margin: 0 0 0.75rem;
`

const pinnedGridCss = css`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  flex: 1;
`

const pinnedCardCss = css`
  display: flex;
  flex-direction: row;
  background: var(--c-content-bg, var(--c-card-bg));
  border: 1px solid var(--c-card-border);
  border-radius: 10px;
  overflow: hidden;
  text-decoration: none;
  color: var(--c-text);
  transition: box-shadow 0.2s ease, transform 0.15s ease;

  &:hover {
    box-shadow: 0 4px 16px var(--c-shadow);
    transform: translateY(-2px);
  }
`

const pinnedImgCss = css`
  width: 100px;
  height: auto;
  min-height: 80px;
  object-fit: cover;
  flex-shrink: 0;
  border-right: 1px solid var(--c-card-border);
`

const pinnedNoImgCss = css`
  width: 100px;
  min-height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--c-bg-alt);
  color: var(--c-text-faint);
  font-size: 0.7rem;
  flex-shrink: 0;
  border-right: 1px solid var(--c-card-border);
`

const pinnedBodyCss = css`
  padding: 0.75rem 0.85rem;
  flex: 1;
  display: flex;
  flex-direction: column;
`

const pinnedCardTitleCss = css`
  font-size: 0.9rem;
  font-weight: 600;
  line-height: 1.4;
  margin: 0 0 0.35rem;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`

const pinnedCardMetaCss = css`
  font-size: 0.72rem;
  color: var(--c-text-faint);
  margin-top: auto;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const pinnedBadgeCss = css`
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
  font-size: 0.65rem;
  font-weight: 600;
  color: var(--c-accent);
  background: var(--c-accent-bg);
  padding: 0.15rem 0.45rem;
  border-radius: 4px;
`

/* ── Divider ── */
const dividerCss = css`
  border: none;
  border-top: 1px solid var(--c-border);
  margin: 0;
`

/* ── Icons ── */
const PinIcon = () => (
  <svg
    width='14'
    height='14'
    viewBox='0 0 24 24'
    fill='currentColor'
    style='flex-shrink:0'
  >
    <path d='M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z' />
  </svg>
)

/* ── Component ── */
type Props = {
  pinnedPosts: Post[]
}

export function HeroSection({ pinnedPosts }: Props) {
  return (
    <section class={heroCss}>
      {/* Blog Introduction */}
      <div class={heroIntroCss}>
        <h2 class={heroTitleCss}>ぽんろぐ備忘録</h2>
        <p class={heroDescCss}>
          エンジニアリング・セキュリティ・低レイヤの学び、日々の生活を記録するブログです。
        </p>
      </div>

      {/* Pinned Posts (right side) */}
      {pinnedPosts.length > 0 && (
        <div class={pinnedSideCss}>
          <div class={pinnedHeaderCss}>
            <PinIcon />
            <span>ピックアップ</span>
          </div>
          <div class={pinnedGridCss}>
            {pinnedPosts.map(post => (
              <a href={post.permalink} class={pinnedCardCss}>
                {post.frontmatter.image ? (
                  <img
                    src={post.frontmatter.image}
                    alt=''
                    class={pinnedImgCss}
                    loading='lazy'
                  />
                ) : (
                  <div class={pinnedNoImgCss}>No Image</div>
                )}
                <div class={pinnedBodyCss}>
                  <div class={pinnedCardTitleCss}>{post.frontmatter.title}</div>
                  <div class={pinnedCardMetaCss}>
                    <span class={pinnedBadgeCss}>
                      <PinIcon />
                      PICK UP
                    </span>
                    <time datetime={post.frontmatter.date}>
                      {format(parseDate(post.frontmatter.date), 'YYYY/MM/DD')}
                    </time>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
