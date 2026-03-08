import { expect, test } from '@playwright/test'

test.describe('Client-side Relative Date Display', () => {
  test('should display relative date on post detail page after client hydration', async ({
    page,
  }) => {
    await page.goto('/posts/hello-world/')
    // Wait for the island to hydrate and display relative date
    const relativeDate = page.locator('span:text-matches("前|たった今")')
    await expect(relativeDate.first()).toBeVisible({ timeout: 5000 })
    const text = await relativeDate.first().textContent()
    expect(text).toMatch(/\(.+(前|たった今)\)/)
  })

  test('should display relative date on grid cards after client hydration', async ({
    page,
  }) => {
    await page.goto('/')
    // Wait for the island to hydrate
    const relativeDate = page.locator('span:text-matches("前|たった今")')
    await expect(relativeDate.first()).toBeVisible({ timeout: 5000 })
    // All grid cards should have relative dates
    const count = await relativeDate.count()
    expect(count).toBeGreaterThanOrEqual(1)
  })

  test('should display relative date on list view after client hydration', async ({
    page,
  }) => {
    await page.goto('/')
    // Switch to list view
    await page.getByRole('button', { name: 'List view' }).click()
    // Wait for the island to hydrate
    const relativeDate = page.locator('span:text-matches("前|たった今")')
    await expect(relativeDate.first()).toBeVisible({ timeout: 5000 })
  })

  test('relative date should not be present in initial server HTML', async ({
    page,
  }) => {
    // Intercept the page HTML before client-side hydration
    const response = await page.goto('/posts/hello-world/')
    const html = await response?.text()
    // The initial HTML should NOT contain hardcoded relative dates
    // because the island renders an empty span on the server
    expect(html).not.toMatch(/\(\d+[年ヶ月日時間分]+前\)/)
  })
})
