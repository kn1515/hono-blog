import { expect, test } from '@playwright/test'

test.describe('Post Pagination (prev/next navigation)', () => {
  // Use a post that is NOT the newest or oldest to ensure both prev/next exist
  let middlePostUrl: string

  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage()
    await page.goto('/')
    // Collect multiple post links to find one that isn't first or last
    const postLinks = page.locator('a[href*="/posts/"]')
    const count = await postLinks.count()
    if (count >= 2) {
      // Pick the second post (not the newest) to ensure at least a "next" link
      middlePostUrl = (await postLinks.nth(1).getAttribute('href')) ?? '/posts/'
    } else {
      middlePostUrl = (await postLinks.first().getAttribute('href')) ?? '/posts/'
    }
    await page.close()
  })

  test('should display at least one pagination link (prev or next)', async ({
    page,
  }) => {
    await page.goto(middlePostUrl)
    // Pagination links contain ← or → arrows
    const prevLink = page.locator('a:has-text("←")')
    const nextLink = page.locator('a:has-text("→")')
    const prevCount = await prevLink.count()
    const nextCount = await nextLink.count()
    expect(prevCount + nextCount).toBeGreaterThan(0)
  })

  test('should navigate to another post when clicking a pagination link', async ({
    page,
  }) => {
    await page.goto(middlePostUrl)
    const prevLink = page.locator('a:has-text("←")')
    const nextLink = page.locator('a:has-text("→")')

    // Click whichever link is available
    const target =
      (await prevLink.count()) > 0 ? prevLink.first() : nextLink.first()
    const href = await target.getAttribute('href')
    expect(href).toBeTruthy()
    expect(href).toContain('/posts/')

    await target.click()
    await page.waitForURL(`**${href}`)
    // Should land on a valid post page
    const title = page.locator('h1')
    await expect(title).toBeVisible()
  })

  test('pagination links should point to post URLs', async ({ page }) => {
    await page.goto(middlePostUrl)
    const prevLink = page.locator('a:has-text("←")')
    const nextLink = page.locator('a:has-text("→")')

    if ((await prevLink.count()) > 0) {
      const href = await prevLink.first().getAttribute('href')
      expect(href).toMatch(/\/posts\//)
    }
    if ((await nextLink.count()) > 0) {
      const href = await nextLink.first().getAttribute('href')
      expect(href).toMatch(/\/posts\//)
    }
  })
})
