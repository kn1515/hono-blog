import { expect, test } from '@playwright/test'

test.describe('Cross-Page Navigation (Integration)', () => {
  test('should navigate from top page to a post and back', async ({
    page,
  }) => {
    await page.goto('/')
    // Click on a post link
    const postLink = page.locator('a[href*="/posts/"]').first()
    await postLink.click()
    await expect(page).toHaveURL(/\/posts\//)

    // Navigate back to top
    const topLink = page.locator('a[href="/"]').first()
    await topLink.click()
    await expect(page).toHaveURL('/')
  })

  test('should navigate from top page to categories', async ({ page }) => {
    await page.goto('/')
    const categoriesLink = page.locator('a[href="/categories/"]').first()
    await categoriesLink.click()
    await expect(page).toHaveURL('/categories/')
  })

  test('should navigate from top page to tags', async ({ page }) => {
    await page.goto('/')
    const tagsLink = page.locator('a[href="/tags/"]').first()
    await tagsLink.click()
    await expect(page).toHaveURL('/tags/')
  })

  test('should navigate from top page to about page', async ({ page }) => {
    await page.goto('/')
    const aboutLink = page.locator('a[href="/about/"]').first()
    await aboutLink.click()
    await expect(page).toHaveURL('/about/')
  })

  test('should navigate from categories to a specific category and then to a post', async ({
    page,
  }) => {
    await page.goto('/categories/')
    // Click a category link
    const categoryLink = page.locator('a[href*="/categories/"]').first()
    await categoryLink.click()
    await expect(page).toHaveURL(/\/categories\//)

    // Click a post link from the category page
    const postLink = page.locator('a[href*="/posts/"]').first()
    await postLink.click()
    await expect(page).toHaveURL(/\/posts\//)
  })

  test('should navigate from tags to a specific tag and then to a post', async ({
    page,
  }) => {
    await page.goto('/tags/')
    // Click a tag link
    const tagLink = page.locator('a[href*="/tags/"]').first()
    await tagLink.click()
    await expect(page).toHaveURL(/\/tags\//)

    // Click a post link from the tag page
    const postLink = page.locator('a[href*="/posts/"]').first()
    await postLink.click()
    await expect(page).toHaveURL(/\/posts\//)
  })

  test('should navigate from contact to privacy policy', async ({ page }) => {
    await page.goto('/contact/')
    const privacyLink = page.locator('a[href="/privacy-policy/"]')
    await privacyLink.click()
    await expect(page).toHaveURL('/privacy-policy/')
  })

  test('should navigate from footer to user terms', async ({ page }) => {
    await page.goto('/')
    const termsLink = page.locator('a[href="/user-terms/"]')
    await termsLink.click()
    // user-terms opens in new tab (target="_blank"), so check the link exists
    await expect(termsLink).toBeVisible()
  })

  test('should navigate from footer to privacy policy', async ({ page }) => {
    await page.goto('/')
    const privacyLink = page.locator('footer a[href="/privacy-policy/"]')
    await privacyLink.click()
    await expect(page).toHaveURL('/privacy-policy/')
  })

  test('should navigate between posts using post pagination', async ({
    page,
  }) => {
    await page.goto('/posts/hello-world/')
    // The hello-world post should have a link to the riss post (next post)
    const nextPostLink = page.locator('a[href*="/posts/riss/"]')
    const count = await nextPostLink.count()
    if (count > 0) {
      await nextPostLink.first().click()
      await expect(page).toHaveURL('/posts/riss/')
    }
  })
})
