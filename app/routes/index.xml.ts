import { format } from '@formkit/tempo'
import { createRoute } from 'honox/factory'
import type { Post } from '../lib/posts'
import { getAllPosts } from '../lib/posts'

const RSS_DATE_FORMAT = 'ddd, DD MMM YYYY hh:mm:ss Z'

function generateRss(posts: Post[]): string {
  const title = 'ぽんろぐ備忘録'
  const baseUrl = 'https://www.ponnlog.com'
  const buildDate = new Date()

  return `<?xml version="1.0" encoding="utf-8" standalone="yes"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${title}</title>
    <link>${baseUrl}</link>
    <description>Recent content on ${title}</description>
    <generator>github.com/kn1515/hono-blog</generator>
    <language>ja</language>
    <lastBuildDate>${format(buildDate, RSS_DATE_FORMAT, 'en')}</lastBuildDate>
    <atom:link href="/index.xml" rel="self" type="application/rss+xml"/>
    ${posts.map(post => generateRssItem(post)).join('\n')}
  </channel>
</rss>`
}

function generateRssItem(post: Post): string {
  const _encodedTitle = encodeURIComponent(post.frontmatter.title)
  const image = 'https://github.com/kn1515.png'
  const ogImage = post.frontmatter.ogImage ? `${image}` : `${image}`

  return `<item>
      <title>${post.frontmatter.title}</title>
      <link>https://www.ponnlog.com/${post.permalink}</link>
      <pubDate>${format(post.frontmatter.date, RSS_DATE_FORMAT, 'en')}</pubDate>
      <guid>https://www.ponnlog.com/${post.permalink}</guid>
      <enclosure url="${ogImage}" length="0" type="image/png"/>
      <description>${post.frontmatter.description}</description>
    </item>`
}

export default createRoute(c => {
  const rss = generateRss(getAllPosts())
  return c.text(rss, 200, {
    'Content-Type': 'application/xml',
  })
})
