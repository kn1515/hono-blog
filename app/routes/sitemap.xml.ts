import { format } from '@formkit/tempo'
import { createRoute } from 'honox/factory'
import type { Post } from '../lib/posts'
import { getAllPosts } from '../lib/posts'

const SITEMAP_DATE_FORMAT = 'YYYY-MM-DD'

function generateSitemap(posts: Post[]): string {
  const now = new Date()
  const staticPages = [
    { loc: '/', changefreq: 'daily', priority: '1.0' },
    { loc: '/about/', changefreq: 'monthly', priority: '0.6' },
    { loc: '/categories/', changefreq: 'weekly', priority: '0.7' },
    { loc: '/tags/', changefreq: 'weekly', priority: '0.7' },
    { loc: '/contact/', changefreq: 'yearly', priority: '0.3' },
    { loc: '/privacy-policy/', changefreq: 'yearly', priority: '0.2' },
    { loc: '/user-terms/', changefreq: 'yearly', priority: '0.2' },
  ]
  return `<?xml version="1.0" encoding="utf-8" standalone="yes"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
    ${staticPages
      .map(
        p => `<url>
        <loc>https://www.ponnlog.com${p.loc}</loc>
        <lastmod>${format(now, SITEMAP_DATE_FORMAT, 'en')}</lastmod>
        <changefreq>${p.changefreq}</changefreq>
        <priority>${p.priority}</priority>
    </url>`,
      )
      .join('\n')}
    ${posts.map(post => generateSitemapItem(post)).join('\n')}
</urlset>`
}

function generateSitemapItem(post: Post): string {
  return `<url>
      <loc>https://www.ponnlog.com${post.permalink}</loc>
      <lastmod>${format(
        post.frontmatter.updatedAt || post.frontmatter.date,
        SITEMAP_DATE_FORMAT,
        'en',
      )}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.8</priority>
    </url>`
}

export default createRoute(c => {
  const rss = generateSitemap(getAllPosts())
  return c.text(rss, 200, {
    'Content-Type': 'application/xml',
  })
})
