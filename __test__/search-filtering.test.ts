import { expect, test } from '@playwright/test'

test.describe('Search Filtering', () => {
  test('should show placeholder text when search modal opens', async ({
    page,
  }) => {
    await page.goto('/')
    await page.locator('#search-open-btn').click()
    const results = page.locator('#search-results')
    await expect(results).toContainText(
      'タイトル、説明、カテゴリ、タグで検索できます',
    )
  })

  test('should filter and display matching posts when typing a query', async ({
    page,
  }) => {
    await page.goto('/')
    await page.locator('#search-open-btn').click()
    const input = page.locator('#search-input')
    await input.fill('ブログ')
    // Should show at least one result with a link to a post
    const results = page.locator('#search-results')
    const links = results.locator('a[href*="/posts/"]')
    await expect(links.first()).toBeVisible()
    const count = await links.count()
    expect(count).toBeGreaterThan(0)
  })

  test('should display "見つかりませんでした" for non-matching query', async ({
    page,
  }) => {
    await page.goto('/')
    await page.locator('#search-open-btn').click()
    const input = page.locator('#search-input')
    await input.fill('xyzzynonexistentquery12345')
    const results = page.locator('#search-results')
    await expect(results).toContainText('見つかりませんでした')
  })

  test('should reset to placeholder when search input is cleared', async ({
    page,
  }) => {
    await page.goto('/')
    await page.locator('#search-open-btn').click()
    const input = page.locator('#search-input')
    await input.fill('ブログ')
    // Verify results are shown
    const results = page.locator('#search-results')
    const links = results.locator('a[href*="/posts/"]')
    await expect(links.first()).toBeVisible()

    // Clear the input
    await input.fill('')
    await expect(results).toContainText(
      'タイトル、説明、カテゴリ、タグで検索できます',
    )
  })

  test('should navigate to post when clicking a search result', async ({
    page,
  }) => {
    await page.goto('/')
    await page.locator('#search-open-btn').click()
    const input = page.locator('#search-input')
    await input.fill('ブログ')
    const results = page.locator('#search-results')
    const firstLink = results.locator('a[href*="/posts/"]').first()
    const href = await firstLink.getAttribute('href')
    expect(href).toBeTruthy()
    await firstLink.click()
    await page.waitForURL(`**${href}`)
    const title = page.locator('h1')
    await expect(title).toBeVisible()
  })

  test('should search by tag name', async ({ page }) => {
    await page.goto('/')
    await page.locator('#search-open-btn').click()
    const input = page.locator('#search-input')
    await input.fill('Hono')
    const results = page.locator('#search-results')
    const links = results.locator('a[href*="/posts/"]')
    await expect(links.first()).toBeVisible()
  })

  test('should search by category name', async ({ page }) => {
    await page.goto('/')
    await page.locator('#search-open-btn').click()
    const input = page.locator('#search-input')
    await input.fill('技術')
    const results = page.locator('#search-results')
    const links = results.locator('a[href*="/posts/"]')
    await expect(links.first()).toBeVisible()
  })
})
