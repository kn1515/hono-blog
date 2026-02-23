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

    test('should have links to category detail pages', async ({ page }) => {
      await page.goto('/categories/')
      const categoryLink = page
        .locator('main ul a[href*="/categories/"]')
        .first()
      await expect(categoryLink).toBeVisible()
    })
  })

  test.describe('Category Detail (/categories/[id]/)', () => {
    // Dynamically discover a category from the categories index
    let categoryUrl: string
    let categoryName: string

    test.beforeAll(async ({ browser }) => {
      const page = await browser.newPage()
      await page.goto('/categories/')
      const link = page.locator('main ul a[href*="/categories/"]').first()
      categoryUrl = (await link.getAttribute('href')) ?? '/categories/'
      categoryName = (await link.textContent()) ?? ''
      await page.close()
    })

    test('should load a category detail page', async ({ page }) => {
      const response = await page.goto(categoryUrl)
      expect(response?.status()).toBe(200)
    })

    test('should display the category name in the heading', async ({
      page,
    }) => {
      await page.goto(categoryUrl)
      const heading = page.locator('h1, h2').filter({ hasText: categoryName })
      await expect(heading.first()).toBeVisible()
    })

    test('should list posts belonging to the category', async ({ page }) => {
      await page.goto(categoryUrl)
      // Should have at least one post link
      const postLinks = page.locator('a[href*="/posts/"]')
      const count = await postLinks.count()
      expect(count).toBeGreaterThan(0)
    })

    test('should navigate from categories index to category detail', async ({
      page,
    }) => {
      await page.goto('/categories/')
      const categoryLink = page
        .locator('main ul a[href*="/categories/"]')
        .first()
      await categoryLink.click()
      await expect(page).toHaveURL(/\/categories\/.*\//)
    })

    test('should display post links that navigate to post detail', async ({
      page,
    }) => {
      await page.goto(categoryUrl)
      const postLink = page.locator('a[href*="/posts/"]').first()
      await expect(postLink).toBeVisible()
    })
  })
})
