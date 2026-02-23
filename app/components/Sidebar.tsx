import { format } from "@formkit/tempo";
import { css } from "hono/css";
import { getCategoryList } from "../lib/categories";
import type { Post } from "../lib/posts";
import { parseDate } from "../lib/time";

/* ── Sidebar Container ── */
const sidebarCss = css`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  position: sticky;
  top: 5rem;
  align-self: flex-start;
`;

/* ── Section Card (shared) ── */
const sectionCss = css`
  background: var(--c-card-bg);
  border: 1px solid var(--c-card-border);
  border-radius: 12px;
  padding: 1.25rem;
`;

const sectionTitleCss = css`
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--c-text-muted);
  margin: 0 0 0.85rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--c-border);
`;

/* ── Author Section ── */
const authorCss = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const authorAvatarCss = css`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  border: 2px solid var(--c-border);
  object-fit: cover;
  margin-bottom: 0.6rem;
`;

const authorNameCss = css`
  font-size: 1rem;
  font-weight: 700;
  color: var(--c-text);
  margin: 0 0 0.3rem;
`;

const authorDescCss = css`
  font-size: 0.8rem;
  color: var(--c-text-muted);
  line-height: 1.5;
  margin: 0 0 0.6rem;
`;

const authorLinksCss = css`
  display: flex;
  gap: 0.75rem;

  & a {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.78rem;
    color: var(--c-text-muted);
    text-decoration: none;
    transition: color 0.15s ease;

    &:hover {
      color: var(--c-text);
    }
  }
`;

/* ── Recent Posts Section ── */
const recentPostItemCss = css`
  display: flex;
  gap: 0.6rem;
  padding: 0.45rem 0;
  text-decoration: none;
  color: var(--c-text);
  border-radius: 6px;
  transition: background 0.12s ease;

  &:hover {
    background: var(--c-accent-hover-bg);
  }

  & + & {
    border-top: 1px solid var(--c-border);
  }
`;

const recentPostThumbCss = css`
  width: 40px;
  height: 40px;
  border-radius: 6px;
  object-fit: cover;
  flex-shrink: 0;
  border: 1px solid var(--c-border);
`;

const recentPostNoThumbCss = css`
  width: 40px;
  height: 40px;
  border-radius: 6px;
  flex-shrink: 0;
  background: var(--c-bg-alt);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--c-text-faint);
  font-size: 0.6rem;
  border: 1px solid var(--c-border);
`;

const recentPostInfoCss = css`
  flex: 1;
  min-width: 0;
`;

const recentPostTitleCss = css`
  font-size: 0.8rem;
  font-weight: 600;
  line-height: 1.35;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  margin: 0;
`;

const recentPostDateCss = css`
  font-size: 0.7rem;
  color: var(--c-text-faint);
  margin-top: 0.15rem;
`;

/* ── Categories Section (Accordion) ── */
const categoryAccordionCss = css`
  list-style: none;

  & summary {
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    list-style: none;
    user-select: none;
    padding: 0;
    margin: 0;

    &::-webkit-details-marker {
      display: none;
    }

    &::marker {
      display: none;
      content: '';
    }
  }

  &[open] summary .sidebar-chevron {
    transform: rotate(180deg);
  }
`;

const categoryListCss = css`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  padding-top: 0.65rem;
`;

const chevronCss = css`
  display: inline-flex;
  flex-shrink: 0;

  & .sidebar-chevron {
    transition: transform 0.2s ease;
    color: var(--c-text-faint);
  }
`;

const categoryBtnCss = css`
  display: inline-flex;
  align-items: center;
  padding: 0.3rem 0.65rem;
  font-size: 0.78rem;
  font-weight: 500;
  color: var(--c-text-muted);
  background: var(--c-bg-alt);
  border: 1px solid var(--c-border);
  border-radius: 9999px;
  text-decoration: none;
  transition: all 0.15s ease;
  white-space: nowrap;

  &:hover {
    color: var(--c-text);
    background: var(--c-accent-hover-bg);
    border-color: var(--c-accent);
  }
`;

/* ── Component ── */
const RECENT_POST_COUNT = 5;

type Props = {
  recentPosts: Post[];
};

export function Sidebar({ recentPosts }: Props) {
  const categories = getCategoryList();
  const posts = recentPosts.slice(0, RECENT_POST_COUNT);

  return (
    <aside class={sidebarCss}>
      {/* Author */}
      <div class={sectionCss}>
        <div class={authorCss}>
          <img
            src="https://github.com/kn1515.png"
            alt="Author"
            class={authorAvatarCss}
          />
          <div class={authorNameCss}>ぽん</div>
          <p class={authorDescCss}>
            サーバーサイドエンジニア。
            <br />
            低レイヤやセキュリティに興味があります。
          </p>
          <div class={authorLinksCss}>
            <a
              href="https://github.com/kn1515"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/></svg>
              GitHub
            </a>
            <a
              href="https://twitter.com/Non_c5c"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              X
            </a>
          </div>
        </div>
      </div>

      {/* Recent Posts */}
      <div class={sectionCss}>
        <h3 class={sectionTitleCss}>最近の投稿</h3>
        {posts.map((post) => (
          <a href={post.permalink} class={recentPostItemCss}>
            {post.frontmatter.image ? (
              <img
                src={post.frontmatter.image}
                alt=""
                class={recentPostThumbCss}
              />
            ) : (
              <div class={recentPostNoThumbCss}>No Img</div>
            )}
            <div class={recentPostInfoCss}>
              <div class={recentPostTitleCss}>{post.frontmatter.title}</div>
              <div class={recentPostDateCss}>
                {format(parseDate(post.frontmatter.date), "YYYY/MM/DD")}
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* Categories (Accordion) */}
      <div class={sectionCss}>
        <details class={categoryAccordionCss} open>
          <summary>
            <h3 class={sectionTitleCss} style="margin-bottom:0;padding-bottom:0;border-bottom:none">カテゴリ</h3>
            <span class={chevronCss}><svg class="sidebar-chevron" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/></svg></span>
          </summary>
          <div class={categoryListCss}>
            {categories.map((cat) => (
              <a href={`/categories/${cat.id}/`} class={categoryBtnCss}>
                {cat.name}
              </a>
            ))}
          </div>
        </details>
      </div>
    </aside>
  );
}
