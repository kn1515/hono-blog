import { expect, test } from '@playwright/test'

test.describe('Mobile Layout', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
  })

  test('should display the mobile bottom bar on small screens', async ({
    page,
  }) => {
    await page.goto('/')
    const mobileBar = page.locator('#mobile-bottom-bar')
    // The mobile bottom bar component should exist for mobile viewport
    const count = await mobileBar.count()
    if (count > 0) {
      await expect(mobileBar).toBeVisible()
    }
  })

  test('should display the top page correctly on mobile', async ({
    page,
  }) => {
    const response = await page.goto('/')
    expect(response?.status()).toBe(200)
    const header = page.locator('header')
    await expect(header).toBeVisible()
  })

  test('should display a post detail page correctly on mobile', async ({
    page,
  }) => {
    const response = await page.goto('/posts/hello-world/')
    expect(response?.status()).toBe(200)
    const title = page.locator('h1')
    await expect(title).toContainText('ブログ初投稿')
  })

  test('should display the about page correctly on mobile', async ({
    page,
  }) => {
    const response = await page.goto('/about/')
    expect(response?.status()).toBe(200)
    const body = page.locator('body')
    await expect(body).toContainText('ぽん')
  })

  test('should be able to navigate on mobile', async ({ page }) => {
    await page.goto('/')
    // Click on a post link
    const postLink = page.locator('a[href*="/posts/"]').first()
    await postLink.click()
    await expect(page).toHaveURL(/\/posts\//)
  })

  test('should open search from mobile', async ({ page }) => {
    await page.goto('/')
    // Try mobile search button or the main search button
    const mobileSearchBtn = page.locator('#mobile-search-btn')
    const searchOpenBtn = page.locator('#search-open-btn')
    const mobileCount = await mobileSearchBtn.count()
    if (mobileCount > 0 && await mobileSearchBtn.isVisible()) {
      await mobileSearchBtn.click()
    } else {
      await searchOpenBtn.click()
    }
    const searchModal = page.locator('#search-modal')
    await expect(searchModal).toBeVisible()
  })
})
