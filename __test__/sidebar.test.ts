import { expect, test } from '@playwright/test'

test.describe('Sidebar', () => {
  test('should display the sidebar on desktop', async ({ page }) => {
    // Set a desktop viewport
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/')
    const sidebar = page.locator('[data-sidebar-area]')
    await expect(sidebar).toBeVisible()
  })

  test('should display category links in the sidebar', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/')
    const sidebar = page.locator('[data-sidebar-area]')
    // Sidebar should contain category or tag links
    const links = sidebar.locator('a')
    const count = await links.count()
    expect(count).toBeGreaterThan(0)
  })

  test('should have category links that navigate correctly', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/')
    const sidebar = page.locator('[data-sidebar-area]')
    const categoryLink = sidebar.locator('a[href*="/categories/"]').first()
    const count = await categoryLink.count()
    if (count > 0) {
      await categoryLink.click()
      await expect(page).toHaveURL(/\/categories\//)
    }
  })

  test('should display the search box in the sidebar', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/')
    const searchBox = page.locator('#sidebar-search-box')
    await expect(searchBox).toBeVisible()
    await expect(searchBox).toContainText('記事を検索...')
  })

  test('should open search modal when sidebar search box is clicked', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/')
    const searchBox = page.locator('#sidebar-search-box')
    await searchBox.click()

    const modal = page.locator('#search-modal')
    await expect(modal).toBeVisible()

    const input = page.locator('#search-input')
    await expect(input).toBeVisible()
  })

  test('should open search modal when sidebar search box is activated with Enter key', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/')
    const searchBox = page.locator('#sidebar-search-box')
    await searchBox.focus()
    await page.keyboard.press('Enter')

    const modal = page.locator('#search-modal')
    await expect(modal).toBeVisible()
  })
})
