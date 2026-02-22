import { css } from "hono/css";
import type { Post } from "../lib/posts";
import { PostGridCard } from "./PostGridCard";

const gridCss = css`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

type Props = {
  posts: Post[];
};

export function PostGridContainer({ posts }: Props) {
  return (
    <div class={gridCss}>
      {posts.map((post) => (
        <PostGridCard post={post} />
      ))}
    </div>
  );
}
