# EOT Intelligence Platform - E2E Test Suite

This comprehensive end-to-end test suite validates the functionality of the EOT Intelligence Platform built with Next.js 14 App Router in a Turborepo monorepo structure. The tests ensure all user workflows function correctly across the entire application stack.

## Test Coverage

### 1. Authentication Flow (`auth.spec.js`)
- ✅ Login page display and functionality
- ✅ Login with valid credentials (all user roles)
- ✅ Login error handling (invalid email, password)
- ✅ Loading states during authentication
- ✅ Password visibility toggle
- ✅ Error message clearing
- ✅ Logout functionality
- ✅ Protected route redirects
- ✅ Public route redirects when authenticated
- ✅ Session persistence across page reloads
- ✅ Authentication state in multiple tabs
- ✅ Root route redirects

### 2. Dashboard Functionality (`dashboard.spec.js`)
- ✅ Dashboard layout and header
- ✅ Key metrics cards (Active Projects, Open Claims, etc.)
- ✅ Statistics with correct value formatting
- ✅ Charts and data visualizations
- ✅ Upcoming deadlines section
- ✅ Action items management
- ✅ Quick actions section
- ✅ Navigation from dashboard buttons
- ✅ Action item status updates
- ✅ Data loading states and error handling
- ✅ Responsive design (mobile/tablet)
- ✅ Performance benchmarks

### 3. Projects Listing and Navigation (`projects.spec.js`)
- ✅ Projects page layout and header
- ✅ Search and filter controls
- ✅ Project cards display with complete information
- ✅ Portfolio summary statistics
- ✅ Search by name, location, project manager
- ✅ Filter by project status
- ✅ Search result clearing and "no results" handling
- ✅ Navigation to project dashboard
- ✅ Project section navigation (dashboard, schedule, delays, evidence, claims)
- ✅ Sidebar navigation
- ✅ Project actions (edit, view, new project)
- ✅ Data loading and integrity
- ✅ Responsive grid layout
- ✅ Performance with large project lists

### 4. Claims Management Workflow (`claims.spec.js`)
- ✅ Claims page layout with header and navigation
- ✅ Claims summary statistics
- ✅ Search and filter controls
- ✅ Individual claim information display
- ✅ Claim status styling and indicators
- ✅ Overdue claim warnings
- ✅ Empty claims list handling
- ✅ Search by reference number, title, description
- ✅ Filter by claim status
- ✅ Combined search and filter functionality
- ✅ Claim actions (view, edit, export)
- ✅ Bulk export functionality
- ✅ New claim creation
- ✅ Navigation back to project dashboard
- ✅ AI Claim Assistant section
- ✅ Data integrity and error handling
- ✅ Responsive claims view

### 5. Navigation and User Interactions (`navigation.spec.js`)
- ✅ Main navigation display and functionality
- ✅ Navigation between main sections
- ✅ Navigation state consistency
- ✅ Current page highlighting
- ✅ Project section navigation
- ✅ Project navigation with URL parameters
- ✅ Invalid project ID handling
- ✅ Breadcrumb navigation
- ✅ Browser back button support
- ✅ Button interactions and accessibility
- ✅ Form interactions (search, filters)
- ✅ Dropdown/select interactions
- ✅ Hover effects
- ✅ Click interactions on interactive elements
- ✅ Error handling for non-existent routes
- ✅ Rapid navigation handling
- ✅ Network interruption resilience
- ✅ Keyboard navigation (tab, enter, escape)
- ✅ Mobile navigation and touch interactions
- ✅ Session state management

## Test Data

The test suite uses mock data fixtures that mirror the application's current data structure:

### Users
- **Director**: david.chen@company.com (password: password123)
- **Project Manager**: sarah.williams@company.com (password: password123)
- **Scheduler**: ahmed.hassan@company.com (password: password123)

### Projects
- **Dubai Marina Tower Complex** ($450M, FIDIC Yellow, Health Score: 78)
- **London Bridge Infrastructure** ($280M, NEC4, Health Score: 85)
- **Singapore Metro Extension** ($650M, FIDIC Red, Health Score: 92)

### Claims
- **EOT-2025-001**: Foundation Design Change Delay ($1.2M, 15 days)
- **EOT-2025-002**: MEP Utility Connection Delay ($680K, 12 days)

## Test Structure

```
tests/
├── helpers/
│   ├── auth.js          # Authentication helper functions
│   ├── navigation.js    # Navigation helper functions
│   └── assertions.js    # Custom assertion helpers
├── fixtures/
│   └── testData.js      # Test data fixtures
└── e2e/
    ├── auth.spec.js     # Authentication flow tests
    ├── dashboard.spec.js # Dashboard functionality tests
    ├── projects.spec.js  # Projects listing and navigation tests
    ├── claims.spec.js   # Claims management workflow tests
    └── navigation.spec.js # Navigation and user interaction tests
```

## Running Tests

### Prerequisites
```bash
# Install all dependencies (includes Playwright)
pnpm install

# Install Playwright browsers
pnpm run test:e2e:install
```

### Test Commands (Monorepo)
```bash
# Run all E2E tests (headless)
pnpm test:e2e

# Run tests with browser UI visible
pnpm test:e2e:headed

# Run tests with Playwright UI for debugging
pnpm test:e2e:ui

# Debug specific test
pnpm test:e2e:debug

# View test reports
pnpm test:e2e:report

# Start dev server and run tests
pnpm dev & pnpm test:e2e
```

### Running Specific Test Files
```bash
# Run only authentication tests
npx playwright test auth.spec.js

# Run only dashboard tests
npx playwright test dashboard.spec.js

# Run specific test by name
npx playwright test --grep "should login successfully"
```

## Browser Coverage

Tests run on multiple browsers and devices:
- ✅ Desktop Chrome
- ✅ Desktop Firefox
- ✅ Desktop Safari
- ✅ Mobile Chrome (Pixel 5)
- ✅ Mobile Safari (iPhone 12)

## Test Configuration

The test suite is configured to:
- Start the development server automatically
- Capture screenshots on failure
- Record videos on failure
- Generate trace files for debugging
- Run tests in parallel for faster execution
- Retry failed tests on CI

## Key Features

### Comprehensive Coverage
- Tests cover all major user workflows and edge cases
- Includes authentication, navigation, data management, and UI interactions
- Tests responsive design and mobile functionality

### Realistic Test Data
- Uses the same mock data as the application
- Tests reflect real-world usage patterns
- Data fixtures can be easily updated

### Maintainable Structure
- Helper functions reduce code duplication
- Custom assertions provide clear test intent
- Modular organization makes tests easy to maintain

### Performance Monitoring
- Tests include performance benchmarks
- Loading time assertions ensure good user experience
- Memory leak detection through repeated navigation

### Error Handling
- Tests verify graceful error handling
- Network interruption simulation
- Invalid input validation

## Application Architecture Testing

This test suite validates the Next.js 14 App Router application and is designed to:
1. **Validate functionality** - Tests verify all features work correctly in the new architecture
2. **Ensure compatibility** - Tests confirm the monorepo structure doesn't break user workflows
3. **Prevent regressions** - Any changes in behavior will be caught immediately
4. **Maintain quality** - Ensures consistent user experience across all application features

## Maintenance

### Adding New Tests
1. Create test files in the appropriate `e2e/` subdirectory
2. Use existing helpers and fixtures for consistency
3. Follow the established naming conventions
4. Add comprehensive test descriptions

### Updating Test Data
1. Modify fixtures in `tests/fixtures/testData.js`
2. Ensure test data matches the Supabase database schema
3. Update helper functions if data structure changes
4. Consider database seeding for consistent test environments

### Best Practices
- Write descriptive test names that explain the expected behavior
- Use the helper functions for common operations
- Keep tests focused and atomic
- Verify both positive and negative scenarios
- Test edge cases and error conditions

## Troubleshooting

### Common Issues
1. **Tests timing out**: Increase timeout in `playwright.config.js`
2. **Elements not found**: Update selectors to match current UI
3. **Data mismatch**: Verify test fixtures match application mock data
4. **Authentication issues**: Ensure test users exist in mock data

### Debugging Tips
1. Use `pnpm run test:e2e:debug` for step-by-step debugging
2. Add `await page.pause()` to pause execution
3. Use `console.log()` in test files for debugging
4. Check browser developer tools during test execution