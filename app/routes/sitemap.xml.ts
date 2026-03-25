import { format } from '@formkit/tempo'
import { createRoute } from 'honox/factory'
import type { Post } from '../lib/posts'
import { getAllPosts, getCategories, getTags } from '../lib/posts'

const SITEMAP_DATE_FORMAT = 'YYYY-MM-DD'
const BASE_URL = 'https://www.ponnlog.com'

function generateUrlEntry(
  loc: string,
  lastmod: string,
  changefreq: string,
  priority: string,
): string {
  const encodedUrl = encodeURI(`${BASE_URL}${loc}`)
  return `  <url>
    <loc>${encodedUrl}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
}

function generateSitemap(posts: Post[]): string {
  const now = format(new Date(), SITEMAP_DATE_FORMAT, 'en')
  const entries: string[] = []

  const staticPages = [
    { loc: '/', changefreq: 'daily', priority: '1.0' },
    { loc: '/about/', changefreq: 'monthly', priority: '0.6' },
    { loc: '/categories/', changefreq: 'weekly', priority: '0.7' },
    { loc: '/tags/', changefreq: 'weekly', priority: '0.7' },
    { loc: '/contact/', changefreq: 'yearly', priority: '0.3' },
    { loc: '/privacy-policy/', changefreq: 'yearly', priority: '0.2' },
    { loc: '/user-terms/', changefreq: 'yearly', priority: '0.2' },
  ]
  for (const p of staticPages) {
    entries.push(generateUrlEntry(p.loc, now, p.changefreq, p.priority))
  }

  for (const post of posts) {
    const lastmod = format(
      post.frontmatter.updatedAt || post.frontmatter.date,
      SITEMAP_DATE_FORMAT,
      'en',
    )
    entries.push(generateUrlEntry(post.permalink, lastmod, 'monthly', '0.8'))
  }

  for (const category of getCategories()) {
    entries.push(
      generateUrlEntry(`/categories/${category.id}/`, now, 'weekly', '0.5'),
    )
  }

  for (const tag of getTags()) {
    entries.push(generateUrlEntry(`/tags/${tag.id}/`, now, 'weekly', '0.5'))
  }

  return `<?xml version="1.0" encoding="utf-8" standalone="yes"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>`
}

export default createRoute(c => {
  const sitemap = generateSitemap(getAllPosts())
  return c.text(sitemap, 200, {
    'Content-Type': 'application/xml',
  })
})
