import fs from 'node:fs/promises'
import path from 'node:path'
import url from 'node:url'
import { format } from '@formkit/tempo'
import { css } from 'hono/css'

import type { Post } from '../lib/posts'
import { getRelativeDate, parseDate } from '../lib/time'
import { blue, gray, grayLight } from '../styles/color'
import { verticalRhythmUnit } from '../styles/variables'
import { MarkdownRenderer } from './MarkdownRenderer'
import { PostDetails } from './PostDetails'

const sectionCss = css`
  margin-bottom: ${verticalRhythmUnit}rem;
`

const underlineCss = css`
  border-top: 0.2rem solid ${blue};
  display: block;
  transition: all 0.2s ease-out;  
`

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
`

const timeCss = css`
  color: ${grayLight};
  letter-spacing: 1px;
`

const titleContainerCss = css`
  display: flex;
  align-items: center;
`

const titleCss = css`
  display: block;
  color: ${gray};
  font-size: 2rem;
  margin: ${verticalRhythmUnit * 0.25}rem 0;
  line-height: 3.4rem;
`

const imageCss = css`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 1rem;
`

const imagePlaceholderCss = css`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 1rem;
  background-color: var(--c-bg-alt);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--c-text-muted);
  font-size: 0.5rem;
  flex-shrink: 0;
`

const moreButtonCss = css`
  background-color: ${gray};
  color: var(--c-bg);
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
`

type Props = {
  post: Post
}

export async function PostSummarySection({ post }: Props) {
  // --- MDX の絶対パス ---
  const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
  const filePath = path.resolve(
    __dirname,
    `../routes${post.permalink}index.mdx`,
  )

  // --- MDX を raw 文字列として読み込む ---
  const postText = await fs.readFile(filePath, 'utf-8')

  // --- frontmatter を削除 ---
  const noFrontmatter = postText.replace(/^---[\s\S]*?---/, '').trim()

  // --- more マーカーまでのサマリーを抽出 ---
  const [summaryRaw] = noFrontmatter.split('{/* <!--more--> */}')

  // --- description + 本文冒頭を連結して少し長めに出す ---
  const summaryCandidate = post.frontmatter.description
    ? `${post.frontmatter.description}\n\n${summaryRaw}`
    : summaryRaw

  // --- 改行整理（縦書き化防止）---
  const summaryText = summaryCandidate
    .replace(/\n{3,}/g, '\n\n') // 3行以上→1行へ
    .trim()

  const imageUrl = post.frontmatter.image

  return (
    <section class={sectionCss}>
      <a href={post.permalink} class={itemCss}>
        <div>
          <time datetime={post.frontmatter.date} class={timeCss}>
            {format(parseDate(post.frontmatter.date), 'YYYY/MM/DD')}
            <span style='margin-left:0.4rem;opacity:0.8;font-size:0.85em'>
              ({getRelativeDate(post.frontmatter.date)})
            </span>
          </time>
          <div class={titleContainerCss}>
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={post.frontmatter.title}
                class={imageCss}
                loading='lazy'
              />
            ) : (
              <div class={imagePlaceholderCss}>No Image</div>
            )}
            <h2 class={titleCss}>{post.frontmatter.title}</h2>
          </div>
          <div class={underlineCss} />
        </div>
      </a>

      <PostDetails frontmatter={post.frontmatter} />

      <div class='catalogue-summary'>
        <MarkdownRenderer
          content={summaryText}
          baseUrl={post.fullFilePath.href}
        />
      </div>

      <a class={moreButtonCss} href={post.permalink}>
        続きを読む
      </a>
    </section>
  )
}
