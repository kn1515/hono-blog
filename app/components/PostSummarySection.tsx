import { format } from "@formkit/tempo";
import { css } from "hono/css";
import fs from "fs/promises";
import path from "path";
import url from "url";

import type { Post } from "../lib/posts";
import { parseDate } from "../lib/time";
import { blue, gray, grayLight, white } from "../styles/color";
import { verticalRhythmUnit } from "../styles/variables";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { PostDetails } from "./PostDetails";

// --- CSS (あなたのまま) ---
const sectionCss = css`
  margin-bottom: ${verticalRhythmUnit}rem;
`;

const underlineCss = css`
  border-top: 0.2rem solid ${blue};
  display: block;
  transition: all 0.2s ease-out;  
`;

const itemCss = css`
  border-top: 1px solid $border;
  display: block;
  padding: ${verticalRhythmUnit}rem 0;
  text-decoration: none;

  &:hover ${underlineCss},
  &:focus ${underlineCss} {
    width: 5rem;
  }

  &:last-child {
    border: 0;
  }
`;

const timeCss = css`
  color: ${grayLight};
  letter-spacing: 1px;
`;

const titleContainerCss = css`
  display: flex;
  align-items: center;
`;

const titleCss = css`
  display: block;
  color: ${gray};
  font-size: 2rem;
  margin: ${verticalRhythmUnit * 0.25}rem 0;
  line-height: 3.4rem;
`;

const imageCss = css`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 1rem;
`;

const moreButtonCss = css`
  background-color: ${gray};
  color: ${white};
  width: 90px;
  border-radius: ${verticalRhythmUnit * 0.25}rem;
  padding: ${verticalRhythmUnit * 0.5}rem 1rem;
  margin: 0 0 0 auto;
  display: flex;
  justify-content: center;
  text-decoration: none;
  transition: all 0.2s ease-out;

  &:hover {
    background-color: ${grayLight};
  }
`;

type Props = {
  post: Post;
};

export async function PostSummarySection({ post }: Props) {
  // --- MDX の絶対パス ---
  const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
  const filePath = path.resolve(__dirname, `../routes${post.permalink}index.mdx`);

  // --- MDX を raw 文字列として読み込む ---
  const postText = await fs.readFile(filePath, "utf-8");

  // --- frontmatter を削除 ---
  const noFrontmatter = postText.replace(/^---[\s\S]*?---/, "").trim();

  // --- more マーカーまでのサマリーを抽出 ---
  const [summaryRaw] = noFrontmatter.split("{/* <!--more--> */}");

  // --- description がある場合はそちらを優先 ---
  const summaryCandidate = post.frontmatter.description ?? summaryRaw;

  // --- 改行整理（縦書き化防止）---
  const summaryText = summaryCandidate
    .replace(/\n{3,}/g, "\n\n") // 3行以上→1行へ
    .trim();

  const imageUrl = post.frontmatter.image;

  return (
    <section class={sectionCss}>
      <a href={post.permalink} class={itemCss}>
        <div>
          <time datetime={post.frontmatter.date} class={timeCss}>
            {format(parseDate(post.frontmatter.date), "YYYY/MM/DD")}
          </time>
          <div class={titleContainerCss}>
            <img src={imageUrl} alt="PostImg" class={imageCss} />
            <h1 class={titleCss}>{post.frontmatter.title}</h1>
          </div>
          <div class={underlineCss} />
        </div>
      </a>

      <PostDetails frontmatter={post.frontmatter} />

      <div class="catalogue-summary">
        <MarkdownRenderer
          content={summaryText}
          baseUrl={post.fullFilePath.href}
        />
      </div>

      <a class={moreButtonCss} href={post.permalink}>
        続きを読む
      </a>
    </section>
  );
}

