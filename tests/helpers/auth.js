/**
 * Authentication helper functions for E2E tests
 * These functions interact with the mock authentication system
 */

/**
 * Log in a user with valid credentials
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {Object} credentials - User credentials
 * @param {string} credentials.email - User email
 * @param {string} credentials.password - User password
 */
export async function login(page, credentials = { email: 'david.chen@company.com', password: 'password123' }) {
  await page.goto('/login');
  
  // Fill in login form
  await page.fill('#email', credentials.email);
  await page.fill('#password', credentials.password);
  
  // Submit the form
  await page.click('button[type="submit"]');
  
  // Wait for redirect to dashboard
  await page.waitForURL('/dashboard');
  
  // Verify we're logged in by checking for dashboard content
  await page.waitForSelector('h1:has-text("Dashboard")');
}

/**
 * Log out the current user
 * @param {import('@playwright/test').Page} page - Playwright page object
 */
export async function logout(page) {
  // Look for user menu/logout option - this might be in a dropdown or button
  // Based on the layout, we need to find the logout mechanism
  
  // First try to find a user menu or logout button
  const logoutButton = page.locator('button:has-text("Logout"), button:has-text("Sign out"), a:has-text("Logout"), a:has-text("Sign out")');
  
  if (await logoutButton.count() > 0) {
    await logoutButton.first().click();
  } else {
    // If no direct logout button, look for user menu
    const userMenu = page.locator('[data-testid="user-menu"], [aria-label="User menu"], button:has([aria-label="User menu"])');
    if (await userMenu.count() > 0) {
      await userMenu.first().click();
      await page.click('button:has-text("Logout"), a:has-text("Logout"), button:has-text("Sign out"), a:has-text("Sign out")');
    } else {
      // Fallback: clear localStorage, cookies and navigate to login
      await page.evaluate(() => {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('currentUser');
        // Clear auth cookie
        document.cookie = 'auth-token=; path=/; max-age=0';
      });
      await page.goto('/login');
    }
  }
  
  // Wait for redirect to login page or manually navigate if needed
  try {
    await page.waitForURL('/login', { timeout: 5000 });
  } catch (error) {
    // If redirect doesn't happen automatically, check if we're logged out and navigate manually
    const stillAuthenticated = await page.evaluate(() => {
      return localStorage.getItem('isAuthenticated') === 'true';
    });
    
    if (!stillAuthenticated) {
      // User is logged out but didn't redirect automatically, navigate manually
      await page.goto('/login');
    } else {
      throw new Error('Logout failed - user is still authenticated');
    }
  }
}

/**
 * Check if user is currently authenticated
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @returns {Promise<boolean>} - True if authenticated, false otherwise
 */
export async function isAuthenticated(page) {
  const authState = await page.evaluate(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });
  return authState;
}

/**
 * Get the current user from localStorage
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @returns {Promise<Object|null>} - Current user object or null
 */
export async function getCurrentUser(page) {
  const user = await page.evaluate(() => {
    const userData = localStorage.getItem('currentUser');
    return userData ? JSON.parse(userData) : null;
  });
  return user;
}

/**
 * Clear authentication state
 * @param {import('@playwright/test').Page} page - Playwright page object
 */
export async function clearAuth(page) {
  // First navigate to the app to ensure localStorage is available
  try {
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('currentUser');
    });
  } catch (error) {
    // If localStorage is not available, just continue
    // This can happen on initial page loads or file:// protocol
    console.log('Could not clear localStorage:', error.message);
  }
}

/**
 * Login with different user roles for testing
 */
export const testUsers = {
  director: {
    email: 'david.chen@company.com',
    password: 'password123',
    role: 'director'
  },
  projectManager: {
    email: 'sarah.williams@company.com', 
    password: 'password123',
    role: 'project_manager'
  },
  scheduler: {
    email: 'ahmed.hassan@company.com',
    password: 'password123', 
    role: 'scheduler'
  }
};

/**
 * Setup authenticated session with a specific user
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} userType - Type of user (director, projectManager, scheduler)
 */
export async function setupAuthenticatedSession(page, userType = 'director') {
  const user = testUsers[userType];
  if (!user) {
    throw new Error(`Unknown user type: ${userType}`);
  }
  
  await login(page, user);
}