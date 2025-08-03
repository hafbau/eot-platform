import { test, expect } from '@playwright/test';

test('Debug - Check what pages are available', async ({ page }) => {
  console.log('Starting debug test...');
  
  // Test 1: Root page
  console.log('Testing root page...');
  await page.goto('/');
  await page.waitForTimeout(2000);
  console.log('Root URL:', page.url());
  const rootTitle = await page.title();
  console.log('Root Title:', rootTitle);
  const rootContent = await page.textContent('body');
  console.log('Root content (first 500 chars):', rootContent?.substring(0, 500));
  
  // Test 2: Login page
  console.log('\nTesting /login page...');
  await page.goto('/login');
  await page.waitForTimeout(2000);
  console.log('Login URL:', page.url());
  const loginTitle = await page.title();
  console.log('Login Title:', loginTitle);
  const loginContent = await page.textContent('body');
  console.log('Login content (first 500 chars):', loginContent?.substring(0, 500));
  
  // Test 3: Signin page (if it exists)
  console.log('\nTesting /signin page...');
  try {
    await page.goto('/signin');
    await page.waitForTimeout(2000);
    console.log('Signin URL:', page.url());
    const signinTitle = await page.title();
    console.log('Signin Title:', signinTitle);
    const signinContent = await page.textContent('body');
    console.log('Signin content (first 500 chars):', signinContent?.substring(0, 500));
  } catch (error) {
    console.log('Signin page error:', error.message);
  }
  
  // Test 4: Dashboard page
  console.log('\nTesting /dashboard page...');
  try {
    await page.goto('/dashboard');
    await page.waitForTimeout(2000);
    console.log('Dashboard URL:', page.url());
    const dashboardTitle = await page.title();
    console.log('Dashboard Title:', dashboardTitle);
    const dashboardContent = await page.textContent('body');
    console.log('Dashboard content (first 500 chars):', dashboardContent?.substring(0, 500));
  } catch (error) {
    console.log('Dashboard page error:', error.message);
  }
  
  // Always pass this test - it's just for debugging
  expect(true).toBe(true);
});