import { expect, test } from '@playwright/test'

test.describe('User Terms Page (/user-terms/)', () => {
  test('should load the user terms page successfully', async ({ page }) => {
    const response = await page.goto('/user-terms/')
    expect(response?.status()).toBe(200)
  })

  test('should display the user terms heading', async ({ page }) => {
    await page.goto('/user-terms/')
    const heading = page.locator('h1, h2').filter({ hasText: '利用規約' })
    await expect(heading.first()).toBeVisible()
  })

  test('should describe link policy', async ({ page }) => {
    await page.goto('/user-terms/')
    const body = page.locator('body')
    await expect(body).toContainText('リンクについて')
  })

  test('should describe external links policy', async ({ page }) => {
    await page.goto('/user-terms/')
    const body = page.locator('body')
    await expect(body).toContainText('当サイトから外部サイトへのリンクについて')
  })

  test('should describe copyright information', async ({ page }) => {
    await page.goto('/user-terms/')
    const body = page.locator('body')
    await expect(body).toContainText('著作権について')
  })

  test('should describe cookie policy', async ({ page }) => {
    await page.goto('/user-terms/')
    const body = page.locator('body')
    await expect(body).toContainText('クッキー(cookie)について')
  })

  test('should mention Google Analytics', async ({ page }) => {
    await page.goto('/user-terms/')
    const body = page.locator('body')
    await expect(body).toContainText('Cloudflare')
  })

  test('should have the header and footer', async ({ page }) => {
    await page.goto('/user-terms/')
    const header = page.locator('header')
    const footer = page.locator('footer')
    await expect(header).toBeVisible()
    await expect(footer).toBeVisible()
  })
})
