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

    test('should display known tag names', async ({ page }) => {
      await page.goto('/tags/')
      const body = page.locator('body')
      await expect(body).toContainText('雑談')
      await expect(body).toContainText('情報処理安全確保支援士')
      await expect(body).toContainText('合格体験記')
    })

    test('should have links to tag detail pages', async ({ page }) => {
      await page.goto('/tags/')
      const tagLink = page
        .locator('a[href*="/tags/"]')
        .filter({ hasText: '雑談' })
      await expect(tagLink).toBeVisible()
    })
  })

  test.describe('Tag Detail (/tags/[id]/)', () => {
    test('should load a tag detail page', async ({ page }) => {
      const response = await page.goto('/tags/雑談/')
      expect(response?.status()).toBe(200)
    })

    test('should display the tag name in the heading', async ({ page }) => {
      await page.goto('/tags/雑談/')
      const heading = page.locator('h1, h2').filter({ hasText: '雑談' })
      await expect(heading.first()).toBeVisible()
    })

    test('should list posts with the specified tag', async ({ page }) => {
      await page.goto('/tags/雑談/')
      const body = page.locator('body')
      await expect(body).toContainText('ブログ初投稿')
    })

    test('should navigate from tags index to tag detail', async ({ page }) => {
      await page.goto('/tags/')
      const tagLink = page
        .locator('a[href*="/tags/"]')
        .filter({ hasText: '雑談' })
      await tagLink.click()
      await expect(page).toHaveURL(/\/tags\/.*\//)
      const body = page.locator('body')
      await expect(body).toContainText('ブログ初投稿')
    })

    test('should load the 情報処理安全確保支援士 tag page', async ({
      page,
    }) => {
      const response = await page.goto('/tags/情報処理安全確保支援士/')
      expect(response?.status()).toBe(200)
      const body = page.locator('body')
      await expect(body).toContainText('情報処理安全確保支援士に合格しました')
    })

    test('should load the 合格体験記 tag page', async ({ page }) => {
      const response = await page.goto('/tags/合格体験記/')
      expect(response?.status()).toBe(200)
      const body = page.locator('body')
      await expect(body).toContainText('情報処理安全確保支援士に合格しました')
    })
  })
})
