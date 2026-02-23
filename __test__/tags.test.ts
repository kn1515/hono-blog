import { expect, test } from '@playwright/test'

test.describe('Tags Pages', () => {
  test.describe('Tags Index (/tags/)', () => {
    test('should load the tags page successfully', async ({ page }) => {
      const response = await page.goto('/tags/')
      expect(response?.status()).toBe(200)
    })

    test('should display the "Tags" heading', async ({ page }) => {
      await page.goto('/tags/')
      const heading = page.locator('h1, h2').filter({ hasText: 'Tags' })
      await expect(heading.first()).toBeVisible()
    })

    test('should display a list of tags', async ({ page }) => {
      await page.goto('/tags/')
      const tagLinks = page.locator('ul li a')
      const count = await tagLinks.count()
      expect(count).toBeGreaterThan(0)
    })

    test('should have links to tag detail pages', async ({ page }) => {
      await page.goto('/tags/')
      const tagLinks = page.locator('ul a[href*="/tags/"]')
      const count = await tagLinks.count()
      expect(count).toBeGreaterThan(0)
    })
  })

  test.describe('Tag Detail (/tags/[id]/)', () => {
    // Dynamically discover a tag from the tags index
    let tagUrl: string
    let tagName: string

    test.beforeAll(async ({ browser }) => {
      const page = await browser.newPage()
      await page.goto('/tags/')
      const link = page.locator('ul a[href*="/tags/"]').first()
      tagUrl = (await link.getAttribute('href')) ?? '/tags/'
      tagName = (await link.textContent()) ?? ''
      await page.close()
    })

    test('should load a tag detail page', async ({ page }) => {
      const response = await page.goto(tagUrl)
      expect(response?.status()).toBe(200)
    })

    test('should display the tag name in the heading', async ({ page }) => {
      await page.goto(tagUrl)
      const heading = page.locator('h1, h2').filter({ hasText: tagName })
      await expect(heading.first()).toBeVisible()
    })

    test('should list posts with the specified tag', async ({ page }) => {
      await page.goto(tagUrl)
      // Should have at least one post link
      const postLinks = page.locator('a[href*="/posts/"]')
      const count = await postLinks.count()
      expect(count).toBeGreaterThan(0)
    })

    test('should navigate from tags index to tag detail', async ({ page }) => {
      await page.goto('/tags/')
      const tagLink = page.locator('ul a[href*="/tags/"]').first()
      await tagLink.click()
      await expect(page).toHaveURL(/\/tags\/.*\//)
    })
  })
})
