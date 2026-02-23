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
    const categoryLink = sidebar
      .locator('a[href*="/categories/"]')
      .first()
    const count = await categoryLink.count()
    if (count > 0) {
      await categoryLink.click()
      await expect(page).toHaveURL(/\/categories\//)
    }
  })
})
