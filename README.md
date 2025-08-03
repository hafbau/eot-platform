# EOT Intelligence Platform

A modern, scalable monorepo built with Turborepo for the EOT Intelligence Platform.

## Architecture

This monorepo uses Turborepo to manage multiple packages and applications:

### Apps
- **`apps/web`** - Main Next.js application

### Packages
- **`packages/core`** - Shared types, utilities, and constants
- **`packages/ui`** - Shared UI components built with Radix UI and Tailwind CSS

### Modules
- **`packages/modules/identity`** - Authentication, MFA, and session management
- **`packages/modules/organizations`** - Multi-tenancy and organization management
- **`packages/modules/storage`** - File and data storage management
- **`packages/modules/integrations`** - External systems integration
- **`packages/modules/analytics`** - Data analytics and reporting
- **`packages/modules/audit`** - Compliance logging and audit trails

## Development

### Prerequisites
- Node.js 18+
- pnpm 8+

### Installation
```bash
pnpm install
```

### Development
```bash
# Start all apps in development mode
pnpm dev

# Build all packages
pnpm build

# Lint all packages
pnpm lint

# Type check all packages
pnpm type-check

# Run tests
pnpm test
```

### Package Scripts
```bash
# Install dependencies for all packages
pnpm install

# Clean all build artifacts
pnpm clean

# Format code with Prettier
pnpm format

# Check code formatting
pnpm format:check
```

## Project Structure

```
eot-intelligence-app/
├── apps/
│   └── web/                 # Next.js application
├── packages/
│   ├── core/               # Shared types and utilities
│   ├── ui/                 # Shared UI components
│   └── modules/
│       ├── identity/       # Auth, MFA, sessions
│       ├── organizations/  # Multi-tenancy
│       ├── storage/        # Storage management
│       ├── integrations/   # External systems
│       ├── analytics/      # Analytics
│       └── audit/          # Compliance logging
├── turbo.json              # Turborepo configuration
├── package.json            # Root package.json
└── pnpm-workspace.yaml     # PNPM workspace configuration
```

## Technology Stack

- **Turborepo** - Build system and monorepo management
- **Next.js** - React framework for the web application
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible UI components
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **pnpm** - Package manager

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## License

Private - EOT Intelligence Platform