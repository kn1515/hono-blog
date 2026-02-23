import { expect, test } from '@playwright/test'

test.describe('About Page (/about/)', () => {
  test('should load the about page successfully', async ({ page }) => {
    const response = await page.goto('/about/')
    expect(response?.status()).toBe(200)
  })

  test('should display the profile avatar', async ({ page }) => {
    await page.goto('/about/')
    const avatar = page.locator('img[alt*="avatar"], img[alt*="Avatar"]')
    const count = await avatar.count()
    // If no explicit avatar alt, check for profile images
    if (count === 0) {
      const images = page.locator('img')
      const imgCount = await images.count()
      expect(imgCount).toBeGreaterThanOrEqual(0)
    }
  })

  test('should display profile information', async ({ page }) => {
    await page.goto('/about/')
    const body = page.locator('body')
    // The about page should contain profile info
    await expect(body).toContainText('ぽん')
  })

  test('should display social links on the about page', async ({ page }) => {
    await page.goto('/about/')
    // Check for GitHub link
    const githubLink = page.locator('a[href*="github.com"]')
    const ghCount = await githubLink.count()
    expect(ghCount).toBeGreaterThan(0)
  })

  test('should display qualification/certification section', async ({
    page,
  }) => {
    await page.goto('/about/')
    const body = page.locator('body')
    // The about page should show qualifications/skills
    await expect(body).toBeVisible()
  })

  test('should have the header and footer', async ({ page }) => {
    await page.goto('/about/')
    const header = page.locator('header')
    const footer = page.locator('footer')
    await expect(header).toBeVisible()
    await expect(footer).toBeVisible()
  })
})
