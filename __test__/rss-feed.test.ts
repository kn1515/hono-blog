import { expect, test } from '@playwright/test'

test.describe('RSS Feed (/index.xml)', () => {
  test('should return a valid RSS feed response', async ({ request }) => {
    const response = await request.get('/index.xml')
    expect(response.status()).toBe(200)
    const contentType = response.headers()['content-type']
    expect(contentType).toContain('xml')
  })

  test('should contain valid RSS XML structure', async ({ request }) => {
    const response = await request.get('/index.xml')
    const body = await response.text()
    expect(body).toContain('<?xml version="1.0"')
    expect(body).toContain('<rss version="2.0"')
    expect(body).toContain('<channel>')
    expect(body).toContain('</channel>')
    expect(body).toContain('</rss>')
  })

  test('should contain the blog title in the RSS feed', async ({ request }) => {
    const response = await request.get('/index.xml')
    const body = await response.text()
    expect(body).toContain('ぽんろぐ備忘録')
  })

  test('should contain the blog base URL', async ({ request }) => {
    const response = await request.get('/index.xml')
    const body = await response.text()
    expect(body).toContain('https://www.ponnlog.com')
  })

  test('should contain RSS items for blog posts', async ({ request }) => {
    const response = await request.get('/index.xml')
    const body = await response.text()
    expect(body).toContain('<item>')
    expect(body).toContain('</item>')
  })

  test('should contain post titles in RSS items', async ({ request }) => {
    const response = await request.get('/index.xml')
    const body = await response.text()
    // Each item should have a title element
    expect(body).toContain('<title>')
    // Count items to ensure at least one post is present
    const itemCount = (body.match(/<item>/g) || []).length
    expect(itemCount).toBeGreaterThan(0)
  })

  test('should contain post descriptions', async ({ request }) => {
    const response = await request.get('/index.xml')
    const body = await response.text()
    expect(body).toContain('<description>')
  })

  test('should contain post links', async ({ request }) => {
    const response = await request.get('/index.xml')
    const body = await response.text()
    // Links should point to /posts/ paths
    expect(body).toContain('/posts/')
  })

  test('should contain pubDate elements', async ({ request }) => {
    const response = await request.get('/index.xml')
    const body = await response.text()
    expect(body).toContain('<pubDate>')
    expect(body).toContain('</pubDate>')
  })

  test('should contain language element set to Japanese', async ({
    request,
  }) => {
    const response = await request.get('/index.xml')
    const body = await response.text()
    expect(body).toContain('<language>ja</language>')
  })
})
