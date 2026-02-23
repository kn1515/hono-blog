import { expect, test } from '@playwright/test'

test.describe('Categories Pages', () => {
  test.describe('Categories Index (/categories/)', () => {
    test('should load the categories page successfully', async ({ page }) => {
      const response = await page.goto('/categories/')
      expect(response?.status()).toBe(200)
    })

    test('should display the "Categories" heading', async ({ page }) => {
      await page.goto('/categories/')
      const heading = page.locator('h1, h2').filter({ hasText: 'Categories' })
      await expect(heading.first()).toBeVisible()
    })

    test('should display a list of categories', async ({ page }) => {
      await page.goto('/categories/')
      const categoryLinks = page.locator('ul li a')
      const count = await categoryLinks.count()
      expect(count).toBeGreaterThan(0)
    })

    test('should display category names including existing categories', async ({
      page,
    }) => {
      await page.goto('/categories/')
      const body = page.locator('body')
      // We know there are categories: "よもやま" and "資格"
      await expect(body).toContainText('よもやま')
      await expect(body).toContainText('資格')
    })

    test('should have links to category detail pages', async ({ page }) => {
      await page.goto('/categories/')
      const categoryLink = page
        .locator('main ul a[href*="/categories/"]')
        .filter({ hasText: 'よもやま' })
        .first()
      await expect(categoryLink).toBeVisible()
    })
  })

  test.describe('Category Detail (/categories/[id]/)', () => {
    test('should load a category detail page', async ({ page }) => {
      const response = await page.goto('/categories/よもやま/')
      expect(response?.status()).toBe(200)
    })

    test('should display the category name in the heading', async ({
      page,
    }) => {
      await page.goto('/categories/よもやま/')
      const heading = page.locator('h1, h2').filter({ hasText: 'よもやま' })
      await expect(heading.first()).toBeVisible()
    })

    test('should list posts belonging to the category', async ({ page }) => {
      await page.goto('/categories/よもやま/')
      const body = page.locator('body')
      await expect(body).toContainText('ブログ初投稿')
    })

    test('should navigate from categories index to category detail', async ({
      page,
    }) => {
      await page.goto('/categories/')
      const categoryLink = page
        .locator('main ul a[href*="/categories/"]')
        .filter({ hasText: 'よもやま' })
        .first()
      await categoryLink.click()
      await expect(page).toHaveURL(/\/categories\/.*\//)
      const body = page.locator('body')
      await expect(body).toContainText('ブログ初投稿')
    })

    test('should display post links that navigate to post detail', async ({
      page,
    }) => {
      await page.goto('/categories/よもやま/')
      const postLink = page.locator('a[href*="/posts/hello-world/"]').first()
      await expect(postLink).toBeVisible()
    })

    test('should load the 資格 category page', async ({ page }) => {
      const response = await page.goto('/categories/資格/')
      expect(response?.status()).toBe(200)
      const body = page.locator('body')
      await expect(body).toContainText('情報処理安全確保支援士')
    })
  })
})
