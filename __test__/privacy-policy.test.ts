import { expect, test } from '@playwright/test'

test.describe('Privacy Policy Page (/privacy-policy/)', () => {
  test('should load the privacy policy page successfully', async ({
    page,
  }) => {
    const response = await page.goto('/privacy-policy/')
    expect(response?.status()).toBe(200)
  })

  test('should display the privacy policy heading', async ({ page }) => {
    await page.goto('/privacy-policy/')
    const heading = page
      .locator('h1, h2')
      .filter({ hasText: 'プライバシーポリシー' })
    await expect(heading.first()).toBeVisible()
  })

  test('should display sections about personal information', async ({
    page,
  }) => {
    await page.goto('/privacy-policy/')
    const body = page.locator('body')
    await expect(body).toContainText('個人情報')
  })

  test('should describe the purpose of personal information usage', async ({
    page,
  }) => {
    await page.goto('/privacy-policy/')
    const body = page.locator('body')
    await expect(body).toContainText('個人情報の利用目的')
  })

  test('should describe personal information management', async ({
    page,
  }) => {
    await page.goto('/privacy-policy/')
    const body = page.locator('body')
    await expect(body).toContainText('個人情報の管理')
  })

  test('should describe personal information disclosure policy', async ({
    page,
  }) => {
    await page.goto('/privacy-policy/')
    const body = page.locator('body')
    await expect(body).toContainText('個人情報の開示')
  })

  test('should have the header and footer', async ({ page }) => {
    await page.goto('/privacy-policy/')
    const header = page.locator('header')
    const footer = page.locator('footer')
    await expect(header).toBeVisible()
    await expect(footer).toBeVisible()
  })
})
