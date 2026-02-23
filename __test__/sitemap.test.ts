import { expect, test } from '@playwright/test'

test.describe('Sitemap (/sitemap.xml)', () => {
  test('should return a valid sitemap response', async ({ request }) => {
    const response = await request.get('/sitemap.xml')
    expect(response.status()).toBe(200)
    const contentType = response.headers()['content-type']
    expect(contentType).toContain('xml')
  })

  test('should contain valid XML structure', async ({ request }) => {
    const response = await request.get('/sitemap.xml')
    const body = await response.text()
    expect(body).toContain('<?xml version="1.0"')
    expect(body).toContain('<urlset')
    expect(body).toContain('</urlset>')
  })

  test('should contain the base URL', async ({ request }) => {
    const response = await request.get('/sitemap.xml')
    const body = await response.text()
    expect(body).toContain('https://www.ponnlog.com')
  })

  test('should contain URL entries for posts', async ({ request }) => {
    const response = await request.get('/sitemap.xml')
    const body = await response.text()
    expect(body).toContain('<url>')
    expect(body).toContain('<loc>')
    expect(body).toContain('</loc>')
    expect(body).toContain('<lastmod>')
  })

  test('should contain URLs for known posts', async ({ request }) => {
    const response = await request.get('/sitemap.xml')
    const body = await response.text()
    expect(body).toContain('/posts/hello-world/')
    expect(body).toContain('/posts/riss/')
  })

  test('should contain a lastmod date in YYYY-MM-DD format', async ({
    request,
  }) => {
    const response = await request.get('/sitemap.xml')
    const body = await response.text()
    // Check for date pattern in lastmod
    const datePattern = /<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/
    expect(body).toMatch(datePattern)
  })
})
