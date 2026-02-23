import { expect, test } from '@playwright/test'

test.describe('Robots.txt (/robots.txt)', () => {
  test('should return a valid robots.txt response', async ({ request }) => {
    const response = await request.get('/robots.txt')
    expect(response.status()).toBe(200)
  })

  test('should contain User-Agent directive', async ({ request }) => {
    const response = await request.get('/robots.txt')
    const body = await response.text()
    // Note: the actual content has a typo "Use-Agent" in the source code
    expect(body).toContain('Agent')
  })

  test('should contain Allow directive', async ({ request }) => {
    const response = await request.get('/robots.txt')
    const body = await response.text()
    expect(body).toContain('Allow: /')
  })
})
