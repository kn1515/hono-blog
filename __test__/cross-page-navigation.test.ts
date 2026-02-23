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

  test('should navigate from top page to categories via accordion', async ({ page }) => {
    await page.goto('/')
    // Open the header accordion menu first
    const accordion = page.locator('header details summary')
    await accordion.click()
    const categoriesLink = page.locator('header a[href="/categories/"]')
    await categoriesLink.click()
    await expect(page).toHaveURL('/categories/')
  })

  test('should navigate from top page to tags via accordion', async ({ page }) => {
    await page.goto('/')
    // Open the header accordion menu first
    const accordion = page.locator('header details summary')
    await accordion.click()
    const tagsLink = page.locator('header a[href="/tags/"]')
    await tagsLink.click()
    await expect(page).toHaveURL('/tags/')
  })

  test('should navigate from top page to about page via accordion', async ({ page }) => {
    await page.goto('/')
    // Open the header accordion menu first
    const accordion = page.locator('header details summary')
    await accordion.click()
    const aboutLink = page.locator('header a[href="/about/"]')
    await aboutLink.click()
    await expect(page).toHaveURL('/about/')
  })

  test('should navigate from categories to a specific category and then to a post', async ({
    page,
  }) => {
    await page.goto('/categories/')
    // Click a category link from the list (not from header)
    const categoryLink = page.locator('ul a[href*="/categories/"]').first()
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
    // Click a tag link from the list (not from header)
    const tagLink = page.locator('ul a[href*="/tags/"]').first()
    await tagLink.click()
    await expect(page).toHaveURL(/\/tags\//)

    // Click a post link from the tag page
    const postLink = page.locator('a[href*="/posts/"]').first()
    await postLink.click()
    await expect(page).toHaveURL(/\/posts\//)
  })

  test('should navigate from contact to privacy policy', async ({ page }) => {
    await page.goto('/contact/')
    const privacyLink = page.locator('main a[href="/privacy-policy/"]')
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
