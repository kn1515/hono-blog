import { expect, test } from '@playwright/test'

test.describe('Post Detail Page (/posts/[slug]/)', () => {
  test('should load the hello-world post page', async ({ page }) => {
    const response = await page.goto('/posts/hello-world/')
    expect(response?.status()).toBe(200)
  })

  test('should display the post title', async ({ page }) => {
    await page.goto('/posts/hello-world/')
    const title = page.locator('h1')
    await expect(title).toContainText('ブログ初投稿')
  })

  test('should display the post date', async ({ page }) => {
    await page.goto('/posts/hello-world/')
    const time = page.locator('time')
    await expect(time.first()).toBeVisible()
    await expect(time.first()).toContainText('2024/10/30')
  })

  test('should display the article content', async ({ page }) => {
    await page.goto('/posts/hello-world/')
    const article = page.locator('article')
    await expect(article).toBeVisible()
    await expect(article).toContainText('こんにちは')
  })

  test('should display the post details (categories/tags)', async ({
    page,
  }) => {
    await page.goto('/posts/hello-world/')
    // Post should have category and tag information
    const postContent = page.locator('body')
    await expect(postContent).toContainText('よもやま')
  })

  test('should display the author section', async ({ page }) => {
    await page.goto('/posts/hello-world/')
    // Author component should be visible
    const authorSection = page.locator('body')
    await expect(authorSection).toContainText('ぽん')
  })

  test('should display share buttons', async ({ page }) => {
    await page.goto('/posts/hello-world/')
    // Share dropdown toggle should exist
    const shareToggle = page.locator('#share-dropdown-toggle')
    await expect(shareToggle).toBeVisible()
  })

  test('should display the share dropdown when toggle is clicked', async ({
    page,
  }) => {
    await page.goto('/posts/hello-world/')
    await page.locator('#share-dropdown-toggle').click()

    const shareMenu = page.locator('#share-dropdown-menu')
    await expect(shareMenu).toBeVisible()
  })

  test('should close the share dropdown when clicking outside', async ({
    page,
  }) => {
    await page.goto('/posts/hello-world/')
    await page.locator('#share-dropdown-toggle').click()

    const shareMenu = page.locator('#share-dropdown-menu')
    await expect(shareMenu).toBeVisible()

    // Click outside the dropdown
    await page.locator('article').click()
    await expect(shareMenu).toBeHidden()
  })

  test('should display post pagination (prev/next links)', async ({
    page,
  }) => {
    await page.goto('/posts/hello-world/')
    // There should be pagination section with navigation to other posts
    const postPagination = page.locator('body')
    // The hello-world post should have at least a next post link since riss is newer
    await expect(postPagination).toContainText('情報処理安全確保支援士')
  })

  test('should display the "Top" link to return to home', async ({
    page,
  }) => {
    await page.goto('/posts/hello-world/')
    const topLink = page.locator('a[href="/"]').filter({ hasText: 'Top' })
    await expect(topLink).toBeVisible()
  })

  test('should load the riss post page', async ({ page }) => {
    const response = await page.goto('/posts/riss/')
    expect(response?.status()).toBe(200)
  })

  test('should display the riss post title and content', async ({ page }) => {
    await page.goto('/posts/riss/')
    const title = page.locator('h1')
    await expect(title).toContainText('情報処理安全確保支援士に合格しました')

    const article = page.locator('article')
    await expect(article).toBeVisible()
  })

  test('should navigate from post back to top page', async ({ page }) => {
    await page.goto('/posts/hello-world/')
    const topLink = page.locator('a[href="/"]').filter({ hasText: 'Top' })
    await topLink.click()
    await expect(page).toHaveURL('/')
  })

  test('should display circular share icon buttons for social platforms', async ({
    page,
  }) => {
    await page.goto('/posts/hello-world/')
    // X/Twitter share button uses twitter.com/intent/tweet
    const xShareLink = page.locator('a[href*="twitter.com/intent"]')
    const count = await xShareLink.count()
    expect(count).toBeGreaterThan(0)
  })
})
