const { test, expect } = require('@playwright/test')

test('adds, persists, filters and deletes a contact through the real API', async ({ page }) => {
  const name = `CI Contact ${Date.now()}`
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Phonebook', exact: true })).toBeVisible()
  await expect(page.getByText('Arto Hellas', { exact: false })).toBeVisible()
  // The legacy compiled UI has no labels; scope the two inputs to its form.
  const inputs = page.locator('form input')
  await inputs.nth(0).fill(name)
  await inputs.nth(1).fill('555-123456')
  await page.getByRole('button', { name: 'add', exact: true }).click()
  const contact = page.locator('p').filter({ hasText: name })
  await expect(contact).toContainText('555-123456')
  await page.reload()
  await expect(contact).toBeVisible()
  await page.locator('input').first().fill(name)
  await expect(page.getByText('Arto Hellas', { exact: false })).toHaveCount(0)
  page.once('dialog', dialog => dialog.accept())
  await contact.getByRole('button', { name: 'delete', exact: true }).click()
  await expect(contact).toHaveCount(0)
  await page.reload()
  await expect(contact).toHaveCount(0)
})
