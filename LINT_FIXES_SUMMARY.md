# Lint Fixes Summary

## Fixed Issues in @eot/web Application

### 1. Removed Unused Variables and Imports
- Removed unused imports across multiple files (Menu, Mail, Plus, etc.)
- Removed unused variables and function parameters
- Removed unused type imports

### 2. Fixed Unescaped Entities in JSX
- Replaced `Don't` with `Don&apos;t` in login and register pages

### 3. Fixed Invalid href Attributes
- Replaced `href="#"` with proper paths like `/forgot-password`, `/terms`, `/privacy`
- Used Next.js Link component instead of anchor tags where appropriate

### 4. Fixed Form Label Accessibility Issues
- Added proper `htmlFor` attributes to labels to associate them with form controls
- Added `id` attributes to corresponding input elements

### 5. Fixed Unused Function Parameters
- Removed unused `err` parameters in catch blocks
- Removed unused parameters from API functions

### 6. Fixed Accessibility Issues
- Added keyboard event handlers to clickable div elements
- Added proper ARIA attributes (role, tabIndex, aria-expanded, aria-controls)
- Made interactive elements keyboard accessible

### Files Modified
- `/app/(auth)/login/page.tsx`
- `/app/(auth)/register/page.tsx`
- `/app/(dashboard)/dashboard/page.tsx`
- `/app/(dashboard)/projects/page.tsx`
- `/app/(dashboard)/projects/[projectId]/claims/page.tsx`
- `/app/(dashboard)/projects/[projectId]/delays/page.tsx`
- `/app/(dashboard)/projects/[projectId]/dashboard/page.tsx`
- `/app/(dashboard)/projects/[projectId]/schedule/page.tsx`
- `/app/(dashboard)/settings/page.tsx`
- `/app/(dashboard)/layout.tsx`
- `/components/dashboard/UpcomingDeadlines.tsx`
- `/components/layout/NewNavbar.tsx`
- `/components/layout/NextNavbar.tsx`
- `/components/pages/NewLoginPage.tsx`
- `/components/pages/NewRegisterPage.tsx`
- `/components/pages/SettingsPage.tsx`
- `/components/pages/UserManagementPage.tsx`
- `/lib/api/auth.ts`
- `/lib/api/dashboard.ts`
- `/lib/api/projects.ts`

## Remaining Warnings
There are 2 warnings about Fast Refresh in layout files that export metadata. These are warnings, not errors, and are related to Next.js development experience. They don't affect production builds.

## Result
✅ All lint errors have been fixed
✅ `pnpm lint --filter=@eot/web` now passes successfully