import { test, expect } from '@playwright/test';
import { 
  login, 
  logout, 
  clearAuth, 
  testUsers, 
  isAuthenticated 
} from '../helpers/auth.js';
import { 
  assertOnLoginPage, 
  assertOnDashboardPage, 
  assertProtectedRouteRedirectsToLogin,
  assertErrorMessageVisible 
} from '../helpers/assertions.js';
import { testUsers as fixtureUsers, validationTestCases, pageElements } from '../fixtures/testData.js';

test.describe('Authentication Flow', () => {
  
  test.beforeEach(async ({ page }) => {
    // Clear any existing authentication state
    await clearAuth(page);
  });

  test.describe('Login Flow', () => {
    
    test('should display login page correctly', async ({ page }) => {
      await page.goto('/login');
      
      // Check page elements
      await assertOnLoginPage(page);
      await expect(page.locator(`text=${pageElements.login.title}`)).toBeVisible();
      await expect(page.locator(`text=${pageElements.login.subtitle}`)).toBeVisible();
      
      // Check demo credentials are displayed
      await expect(page.locator('text=Demo Credentials')).toBeVisible();
      await expect(page.locator('text=david.chen@company.com')).toBeVisible();
      await expect(page.locator('text=password123')).toBeVisible();
      
      // Check form elements
      await expect(page.locator('#email')).toBeVisible();
      await expect(page.locator('#password')).toBeVisible();
      await expect(page.locator('button[type="submit"]')).toBeVisible();
      await expect(page.locator('button[type="submit"]')).toHaveText('Sign in');
      
      // Check "Remember me" checkbox
      await expect(page.locator('#remember-me')).toBeVisible();
      
      // Check "Forgot password" link
      await expect(page.locator('text=Forgot your password?')).toBeVisible();
      
      // Check "Sign up" link
      await expect(page.locator('a[href="/register"]')).toBeVisible();
    });

    test('should login successfully with valid credentials', async ({ page }) => {
      await login(page, testUsers.director);
      
      // Should be redirected to dashboard
      await assertOnDashboardPage(page);
      
      // Verify authentication state
      const authState = await isAuthenticated(page);
      expect(authState).toBe(true);
    });

    test('should login with project manager credentials', async ({ page }) => {
      await login(page, testUsers.projectManager);
      
      await assertOnDashboardPage(page);
      const authState = await isAuthenticated(page);
      expect(authState).toBe(true);
    });

    test('should login with scheduler credentials', async ({ page }) => {
      await login(page, testUsers.scheduler);
      
      await assertOnDashboardPage(page);
      const authState = await isAuthenticated(page);
      expect(authState).toBe(true);
    });

    test('should show error with invalid email', async ({ page }) => {
      await page.goto('/login');
      
      const testCase = validationTestCases.login.invalidEmail;
      await page.fill('#email', testCase.email);
      await page.fill('#password', testCase.password);
      await page.click('button[type="submit"]');
      
      // Should show error message
      await assertErrorMessageVisible(page, testCase.expectedError);
      
      // Should stay on login page
      await assertOnLoginPage(page);
    });

    test('should show error with invalid password', async ({ page }) => {
      await page.goto('/login');
      
      const testCase = validationTestCases.login.invalidPassword;
      await page.fill('#email', testCase.email);
      await page.fill('#password', testCase.password);
      await page.click('button[type="submit"]');
      
      // Should show error message
      await assertErrorMessageVisible(page, testCase.expectedError);
      
      // Should stay on login page
      await assertOnLoginPage(page);
    });

    test('should show loading state during login', async ({ page }) => {
      await page.goto('/login');
      
      await page.fill('#email', testUsers.director.email);
      await page.fill('#password', testUsers.director.password);
      
      // Click submit and immediately check for loading state
      await page.click('button[type="submit"]');
      
      // Should show loading text
      await expect(page.locator('text=Signing in...')).toBeVisible();
      
      // Wait for login to complete
      await assertOnDashboardPage(page);
    });

    test('should toggle password visibility', async ({ page }) => {
      await page.goto('/login');
      
      const passwordInput = page.locator('#password');
      const toggleButton = page.locator('button:has([class*="eye"])');
      
      // Initially password should be hidden
      await expect(passwordInput).toHaveAttribute('type', 'password');
      
      // Click toggle to show password
      await toggleButton.click();
      await expect(passwordInput).toHaveAttribute('type', 'text');
      
      // Click toggle to hide password again
      await toggleButton.click();
      await expect(passwordInput).toHaveAttribute('type', 'password');
    });

    test('should clear error when user starts typing', async ({ page }) => {
      await page.goto('/login');
      
      // Trigger an error first
      await page.fill('#email', 'invalid-email');
      await page.fill('#password', 'wrongpassword');
      await page.click('button[type="submit"]');
      
      await assertErrorMessageVisible(page, 'Invalid email or password');
      
      // Start typing in email field
      await page.fill('#email', 'david');
      
      // Error should be cleared (wait a moment for state update)
      await page.waitForTimeout(100);
      await expect(page.locator('text=Invalid email or password')).not.toBeVisible();
    });
  });

  test.describe('Logout Flow', () => {
    
    test('should logout successfully', async ({ page }) => {
      // Login first
      await login(page, testUsers.director);
      await assertOnDashboardPage(page);
      
      // Logout
      await logout(page);
      
      // Should be redirected to login page
      await assertOnLoginPage(page);
      
      // Verify authentication state is cleared
      const authState = await isAuthenticated(page);
      expect(authState).toBe(false);
    });

    test('should clear user data on logout', async ({ page }) => {
      // Login first
      await login(page, testUsers.director);
      
      // Verify user data exists
      const userBefore = await page.evaluate(() => {
        return localStorage.getItem('currentUser');
      });
      expect(userBefore).not.toBeNull();
      
      // Logout
      await logout(page);
      
      // Verify user data is cleared
      const userAfter = await page.evaluate(() => {
        return localStorage.getItem('currentUser');
      });
      expect(userAfter).toBeNull();
      
      const authAfter = await page.evaluate(() => {
        return localStorage.getItem('isAuthenticated');
      });
      expect(authAfter).toBeNull();
    });
  });

  test.describe('Protected Routes', () => {
    
    test('should redirect to login when accessing dashboard without authentication', async ({ page }) => {
      await assertProtectedRouteRedirectsToLogin(page, '/dashboard');
    });

    test('should redirect to login when accessing projects without authentication', async ({ page }) => {
      await assertProtectedRouteRedirectsToLogin(page, '/projects');
    });

    test('should redirect to login when accessing project dashboard without authentication', async ({ page }) => {
      await assertProtectedRouteRedirectsToLogin(page, '/projects/1/dashboard');
    });

    test('should redirect to login when accessing project claims without authentication', async ({ page }) => {
      await assertProtectedRouteRedirectsToLogin(page, '/projects/1/claims');
    });

    test('should redirect to login when accessing project schedule without authentication', async ({ page }) => {
      await assertProtectedRouteRedirectsToLogin(page, '/projects/1/schedule');
    });

    test('should redirect to login when accessing project delays without authentication', async ({ page }) => {
      await assertProtectedRouteRedirectsToLogin(page, '/projects/1/delays');
    });

    test('should redirect to login when accessing project evidence without authentication', async ({ page }) => {
      await assertProtectedRouteRedirectsToLogin(page, '/projects/1/evidence');
    });

    test('should redirect to login when accessing settings without authentication', async ({ page }) => {
      await assertProtectedRouteRedirectsToLogin(page, '/settings');
    });

    test('should redirect to login when accessing user management without authentication', async ({ page }) => {
      await assertProtectedRouteRedirectsToLogin(page, '/settings/users');
    });
  });

  test.describe('Public Route Redirects', () => {
    
    test('should redirect to dashboard when accessing login page while authenticated', async ({ page }) => {
      // Login first
      await login(page, testUsers.director);
      await assertOnDashboardPage(page);
      
      // Try to access login page
      await page.goto('/login');
      
      // Should be redirected back to dashboard
      await assertOnDashboardPage(page);
    });

    test('should redirect to dashboard when accessing register page while authenticated', async ({ page }) => {
      // Login first
      await login(page, testUsers.director);
      await assertOnDashboardPage(page);
      
      // Try to access register page
      await page.goto('/register');
      
      // Should be redirected back to dashboard
      await assertOnDashboardPage(page);
    });
  });

  test.describe('Session Persistence', () => {
    
    test('should maintain authentication state after page reload', async ({ page }) => {
      // Login
      await login(page, testUsers.director);
      await assertOnDashboardPage(page);
      
      // Reload the page
      await page.reload();
      
      // Should still be authenticated and on dashboard
      await assertOnDashboardPage(page);
      
      const authState = await isAuthenticated(page);
      expect(authState).toBe(true);
    });

    test('should maintain authentication state in new tab', async ({ context }) => {
      const page1 = await context.newPage();
      
      // Login in first tab
      await login(page1, testUsers.director);
      await assertOnDashboardPage(page1);
      
      // Open new tab
      const page2 = await context.newPage();
      await page2.goto('/dashboard');
      
      // Should be authenticated in new tab
      await assertOnDashboardPage(page2);
      
      const authState = await isAuthenticated(page2);
      expect(authState).toBe(true);
    });
  });

  test.describe('Root Route Redirect', () => {
    
    test('should redirect from root to dashboard when authenticated', async ({ page }) => {
      // Login first
      await login(page, testUsers.director);
      
      // Navigate to root
      await page.goto('/');
      
      // Should be redirected to dashboard
      await assertOnDashboardPage(page);
    });

    test('should redirect from root to login when not authenticated', async ({ page }) => {
      // Navigate to root without authentication
      await page.goto('/');
      
      // Should be redirected to login
      await assertOnLoginPage(page);
    });
  });
});