import { expect, test } from '@playwright/test'

test.describe('Contact Page (/contact/)', () => {
  test('should load the contact page successfully', async ({ page }) => {
    const response = await page.goto('/contact/')
    expect(response?.status()).toBe(200)
  })

  test('should display contact information text', async ({ page }) => {
    await page.goto('/contact/')
    const body = page.locator('body')
    await expect(body).toContainText('お問い合わせ')
  })

  test('should mention X (Twitter) DM for contact', async ({ page }) => {
    await page.goto('/contact/')
    const body = page.locator('body')
    await expect(body).toContainText('X(旧Twitter)')
  })

  test('should have a link to the privacy policy page', async ({ page }) => {
    await page.goto('/contact/')
    const privacyLink = page.locator('a[href="/privacy-policy/"]')
    await expect(privacyLink).toBeVisible()
  })

  test('should have a link to the user terms page', async ({ page }) => {
    await page.goto('/contact/')
    const termsLink = page.locator('a[href="/user-terms/"]')
    await expect(termsLink).toBeVisible()
  })

  test('should display the author section', async ({ page }) => {
    await page.goto('/contact/')
    const body = page.locator('body')
    await expect(body).toContainText('ぽん')
  })

  test('should have the header and footer', async ({ page }) => {
    await page.goto('/contact/')
    const header = page.locator('header')
    const footer = page.locator('footer')
    await expect(header).toBeVisible()
    await expect(footer).toBeVisible()
  })
})
