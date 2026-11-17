import { test, expect } from '@playwright/test';

test('login stores a private session and opens the account', async ({ page, context }) => {
  await page.goto('/auth/login?redirect=/account');
  await page.getByLabel('Email Address', { exact: false }).fill('seed.farmer@soko-africa.test');
  await page.getByLabel('Password', { exact: true }).fill('Seller123!@');
  await page.getByRole('button', { name: 'Sign In', exact: true }).click();
  // The login URL already ends in ?redirect=/account, so a suffix regex matches before sign-in.
  await expect.poll(() => new URL(page.url()).pathname, { timeout: 20000 }).toBe('/account');
  const cookies = await context.cookies();
  expect(cookies.find(c => c.name === 'soko_access')).toMatchObject({ httpOnly: true, secure: true });
  expect(await page.evaluate(() => localStorage.getItem('soko_africa_token'))).toBeNull();
  expect((await context.request.post('/api/orders', { data: {} })).status()).toBe(400);
});

test('guest checkout creates an unpaid order and keeps its receipt private', async ({ page, context, browser }) => {
  const productsResponse = await context.request.get('/api/products?limit=100');
  expect(productsResponse.ok()).toBeTruthy();
  const { products } = await productsResponse.json();
  const product = products.find(p => p.currency === 'USD' && Number(p.stockQuantity) > 0);
  expect(product).toBeTruthy();
  await page.goto(`/products/${product.id}`);
  await page.getByRole('button', { name: 'Buy now', exact: true }).click();
  await expect(page).toHaveURL(/\/checkout$/);
  await page.getByLabel('Email', { exact: true }).fill('guest@example.test');
  await page.getByLabel('Phone', { exact: true }).fill('+254712345678');
  await page.getByRole('button', { name: /Continue/ }).click();
  await page.getByLabel('First name', { exact: true }).fill('Guest');
  await page.getByLabel('Last name', { exact: true }).fill('Buyer');
  await page.getByLabel('Street address').fill('1 Test Road');
  await page.getByLabel('City', { exact: true }).fill('Nairobi');
  await page.getByLabel('State / Province').fill('Nairobi');
  await page.getByLabel('Postal code').fill('00100');
  await page.getByLabel('Country', { exact: true }).selectOption('Kenya');
  await page.getByRole('button', { name: /Continue/ }).click();
  await expect(page.getByRole('radio', { name: /M-Pesa/ })).toHaveCount(0);
  await page.getByRole('button', { name: /Continue/ }).click();
  await page.getByLabel(/I agree to the Terms/).check();
  const created = page.waitForResponse(res => res.url().endsWith('/api/orders') && res.request().method() === 'POST');
  await page.getByRole('button', { name: /Place order & pay/ }).click();
  const response = await created;
  expect(response.status()).toBe(201);
  const order = await response.json();
  expect(order.status).toBe('PENDING_PAYMENT');
  const cookie = (await context.cookies()).find(c => c.name === 'soko_guest_orders');
  expect(cookie).toMatchObject({ httpOnly: true, secure: true, sameSite: 'Lax' });
  expect(await page.evaluate(() => document.cookie)).not.toContain('soko_guest_orders');
  await page.goto(`/orders/${order.orderId}`);
  await expect(page).toHaveURL(new RegExp(`/orders/${order.orderId}$`));
  await expect(page.getByText('Awaiting payment', { exact: true })).toBeVisible();

  const stranger = await browser.newContext({ baseURL: 'http://localhost:3100' });
  try {
    const denied = await stranger.request.get(`/api/orders/${order.orderId}`);
    expect(denied.status()).toBe(404);
    expect(await denied.text()).not.toContain('guest@example.test');
  } finally {
    await stranger.close();
  }
});
