import { expect, test } from '@playwright/test'

test.describe('Post Detail Page (/posts/[slug]/)', () => {
  // Dynamically discover a post URL from the top page
  let postUrl: string

  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage()
    await page.goto('/')
    const postLink = page.locator('a[href*="/posts/"]').first()
    const href = await postLink.getAttribute('href')
    postUrl = href ?? '/posts/'
    await page.close()
  })

  test('should load a post page successfully', async ({ page }) => {
    const response = await page.goto(postUrl)
    expect(response?.status()).toBe(200)
  })

  test('should display the post title in an h1', async ({ page }) => {
    await page.goto(postUrl)
    const title = page.locator('h1')
    await expect(title).toBeVisible()
    const text = await title.textContent()
    expect(text?.trim().length).toBeGreaterThan(0)
  })

  test('should display a date (time element)', async ({ page }) => {
    await page.goto(postUrl)
    const time = page.locator('time')
    await expect(time.first()).toBeVisible()
    // Date should match yyyy/mm/dd pattern
    const dateText = await time.first().textContent()
    expect(dateText).toMatch(/\d{4}\/\d{2}\/\d{2}/)
  })

  test('should display the article content', async ({ page }) => {
    await page.goto(postUrl)
    const article = page.locator('article')
    await expect(article).toBeVisible()
    const text = await article.textContent()
    expect(text?.trim().length).toBeGreaterThan(0)
  })

  test('should display post metadata (categories or tags)', async ({
    page,
  }) => {
    await page.goto(postUrl)
    // Post should have category or tag links
    const categoryOrTagLinks = page.locator(
      'a[href*="/categories/"], a[href*="/tags/"]',
    )
    const count = await categoryOrTagLinks.count()
    expect(count).toBeGreaterThan(0)
  })

  test('should display the author section', async ({ page }) => {
    await page.goto(postUrl)
    const body = page.locator('body')
    await expect(body).toContainText('ぽん')
  })

  test('should display share buttons', async ({ page }) => {
    await page.goto(postUrl)
    const shareToggle = page.locator('#share-dropdown-toggle')
    await expect(shareToggle).toBeVisible()
  })

  test('should display the share dropdown when toggle is clicked', async ({
    page,
  }) => {
    await page.goto(postUrl)
    await page.locator('#share-dropdown-toggle').click()

    const shareMenu = page.locator('#share-dropdown-menu')
    await expect(shareMenu).toBeVisible()
  })

  test('should close the share dropdown when clicking outside', async ({
    page,
  }) => {
    await page.goto(postUrl)
    await page.locator('#share-dropdown-toggle').click()

    const shareMenu = page.locator('#share-dropdown-menu')
    await expect(shareMenu).toBeVisible()

    // Click outside the dropdown
    await page.locator('article').click()
    await expect(shareMenu).toBeHidden()
  })

  test('should display the "Top" link to return to home', async ({ page }) => {
    await page.goto(postUrl)
    const topLink = page.locator('a[href="/"]').filter({ hasText: 'Top' })
    await expect(topLink).toBeVisible()
  })

  test('should navigate from post back to top page', async ({ page }) => {
    await page.goto(postUrl)
    const topLink = page.locator('a[href="/"]').filter({ hasText: 'Top' })
    await topLink.click()
    await expect(page).toHaveURL('/')
  })

  test('should display share icon links for social platforms', async ({
    page,
  }) => {
    await page.goto(postUrl)
    // X/Twitter share button uses twitter.com/intent/tweet
    const xShareLink = page.locator('a[href*="twitter.com/intent"]')
    const count = await xShareLink.count()
    expect(count).toBeGreaterThan(0)
  })
})
