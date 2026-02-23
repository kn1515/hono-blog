import { format } from "@formkit/tempo";
import { css } from "hono/css";

import type { Post } from "../lib/posts";
import { parseDate } from "../lib/time";

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
`;

const cardImageCss = css`
  width: 100%;
  height: 180px;
  object-fit: cover;
  display: block;
`;

const cardImagePlaceholderCss = css`
  width: 100%;
  height: 180px;
  background-color: var(--c-bg-alt);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--c-text-muted);
  font-size: 2rem;
`;

const cardBodyCss = css`
  padding: 1rem;
`;

const cardTagsCss = css`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-bottom: 0.5rem;
`;

const cardTagCss = css`
  font-size: 0.75rem;
  color: var(--c-text-muted);
  background-color: var(--c-bg-alt);
  border: 1px solid var(--c-border);
  border-radius: 0.25rem;
  padding: 0.1rem 0.5rem;
`;

const cardTitleCss = css`
  font-size: 1.1rem;
  font-weight: bold;
  color: var(--c-text);
  margin: 0 0 0.5rem;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const cardDateCss = css`
  font-size: 0.8rem;
  color: var(--c-text-muted);
`;

type Props = {
  post: Post;
};

export function PostGridCard({ post }: Props) {
  const imageUrl = post.frontmatter.image;
  const categories = post.frontmatter.categories ?? [];
  const tags = post.frontmatter.tags ?? [];

  return (
    <a href={post.permalink} class={cardCss}>
      {imageUrl ? (
        <img src={imageUrl} alt={post.frontmatter.title} class={cardImageCss} />
      ) : (
        <div class={cardImagePlaceholderCss}>No Image</div>
      )}
      <div class={cardBodyCss}>
        <div class={cardTagsCss}>
          {categories.map((cat) => (
            <span class={cardTagCss}>{cat}</span>
          ))}
          {tags.map((tag) => (
            <span class={cardTagCss}>{tag}</span>
          ))}
        </div>
        <h2 class={cardTitleCss}>{post.frontmatter.title}</h2>
        <time datetime={post.frontmatter.date} class={cardDateCss}>
          {format(parseDate(post.frontmatter.date), "YYYY/MM/DD")}
        </time>
      </div>
    </a>
  );
}
