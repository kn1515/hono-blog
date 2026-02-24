import { expect, test } from '@playwright/test'

test.describe('Updated Date Display on Posts', () => {
  test('should display updated date for a post with updatedAt', async ({
    page,
  }) => {
    // blog-tech-stack has updatedAt set
    await page.goto('/posts/blog-tech-stack/')
    const updatedText = page.locator('text=更新日')
    await expect(updatedText).toBeVisible()
  })

  test('should display updated date in YYYY/MM/DD format', async ({ page }) => {
    await page.goto('/posts/blog-tech-stack/')
    // Find all time elements — first is the publish date, second is update date
    const timeElements = page.locator('time')
    const count = await timeElements.count()
    expect(count).toBeGreaterThanOrEqual(2)

    // The update date time element should match date format
    const updateTime = timeElements.nth(1)
    const dateText = await updateTime.textContent()
    expect(dateText).toMatch(/\d{4}\/\d{2}\/\d{2}/)
  })

  test('should not display updated date if post has no updatedAt', async ({
    page,
  }) => {
    // hello-world does not have updatedAt
    await page.goto('/posts/hello-world/')
    const updatedText = page.locator('text=更新日')
    await expect(updatedText).toHaveCount(0)
  })

  test('should display publish date alongside updated date', async ({
    page,
  }) => {
    await page.goto('/posts/blog-tech-stack/')
    // Publish date should always be present
    const firstTime = page.locator('time').first()
    await expect(firstTime).toBeVisible()
    const publishDate = await firstTime.textContent()
    expect(publishDate).toMatch(/\d{4}\/\d{2}\/\d{2}/)
  })
})
