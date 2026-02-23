import { expect, test } from '@playwright/test'

test.describe('404 Not Found Page', () => {
  test('should return 404 for non-existent pages', async ({ page }) => {
    const response = await page.goto('/this-page-does-not-exist/')
    expect(response?.status()).toBe(404)
  })

  test('should display the "Not Found" message', async ({ page }) => {
    await page.goto('/this-page-does-not-exist/')
    const body = page.locator('body')
    await expect(body).toContainText('Not Found')
  })

  test('should return 404 for non-existent post pages', async ({ page }) => {
    const response = await page.goto('/posts/non-existent-post/')
    expect(response?.status()).toBe(404)
  })

  test('should return 404 for non-existent category pages', async ({
    page,
  }) => {
    const response = await page.goto('/categories/non-existent-category/')
    expect(response?.status()).toBe(404)
  })

  test('should return 404 for non-existent tag pages', async ({ page }) => {
    const response = await page.goto('/tags/non-existent-tag/')
    expect(response?.status()).toBe(404)
  })

  test('should still display the header on 404 pages', async ({ page }) => {
    await page.goto('/this-page-does-not-exist/')
    const header = page.locator('header')
    await expect(header).toBeVisible()
  })

  test('should still display the footer on 404 pages', async ({ page }) => {
    await page.goto('/this-page-does-not-exist/')
    const footer = page.locator('footer')
    await expect(footer).toBeVisible()
  })
})
