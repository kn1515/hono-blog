import { expect, test } from '@playwright/test'

test.describe('Top Page (/)', () => {
  test('should load the top page successfully', async ({ page }) => {
    const response = await page.goto('/')
    expect(response?.status()).toBe(200)
  })

  test('should display the site header with blog title', async ({ page }) => {
    await page.goto('/')
    const header = page.locator('header')
    await expect(header).toBeVisible()
    await expect(header.locator('a').first()).toBeVisible()
  })

  test('should display the hero section with blog description', async ({
    page,
  }) => {
    await page.goto('/')
    // The hero section contains the blog description text
    const heroText = page.locator(
      'text=エンジニアリング・セキュリティ・低レイヤの学び',
    )
    await expect(heroText).toBeVisible()
  })

  test('should display blog posts in the post grid view', async ({ page }) => {
    await page.goto('/')
    const gridView = page.locator('#post-grid-view')
    await expect(gridView).toBeVisible()
  })

  test('should have a hidden list view by default', async ({ page }) => {
    await page.goto('/')
    const listView = page.locator('#post-list-view')
    await expect(listView).toBeHidden()
  })

  test('should display post titles on the top page', async ({ page }) => {
    await page.goto('/')
    // Check that at least one post link exists
    const postLinks = page.locator('a[href*="/posts/"]')
    const count = await postLinks.count()
    expect(count).toBeGreaterThan(0)
  })

  test('should display pagination on the top page', async ({ page }) => {
    await page.goto('/')
    // Pagination shows the current page number
    const pageNumber = page.locator('span').filter({ hasText: '1' })
    await expect(pageNumber.first()).toBeVisible()
  })

  test('should display the footer', async ({ page }) => {
    await page.goto('/')
    const footer = page.locator('footer')
    await expect(footer).toBeVisible()
    await expect(footer).toContainText('Hono')
  })

  test('should contain the view toggle buttons', async ({ page }) => {
    await page.goto('/')
    const listToggle = page.locator('#view-toggle-list')
    const gridToggle = page.locator('#view-toggle-grid')
    await expect(listToggle).toBeVisible()
    await expect(gridToggle).toBeVisible()
  })

  test('should switch to list view when list toggle is clicked', async ({
    page,
  }) => {
    await page.goto('/')
    const listToggle = page.locator('#view-toggle-list')
    await listToggle.click()

    const listView = page.locator('#post-list-view')
    const gridView = page.locator('#post-grid-view')
    await expect(listView).toBeVisible()
    await expect(gridView).toBeHidden()
  })

  test('should switch back to grid view when grid toggle is clicked', async ({
    page,
  }) => {
    await page.goto('/')
    // First switch to list view
    await page.locator('#view-toggle-list').click()
    // Then switch back to grid
    await page.locator('#view-toggle-grid').click()

    const listView = page.locator('#post-list-view')
    const gridView = page.locator('#post-grid-view')
    await expect(listView).toBeHidden()
    await expect(gridView).toBeVisible()
  })
})
