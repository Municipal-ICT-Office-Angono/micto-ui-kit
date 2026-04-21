# MICTO UI KIT

A professional shadcn-based component library and registry designed for the local development ecosystem of Angono.

## Features

- **Registry-First Architecture**: Components are distributed via a remote shadcn registry.
- **Automated Documentation**: Live code previews and syntax-highlighted examples.
- **Inertia Integration**: specialized components for Laravel Inertia applications.
- **Modern Aesthetics**: Premium dark/light mode support and command palette search (⌘K).

## Quick Start

### Local Development

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Run the documentation site:

   ```bash
   pnpm dev
   ```

3. Build the registry:

   ```bash
   pnpm registry:build
   ```

## Using the Registry

You can add components from this kit directly to your own project using the shadcn CLI:

```bash
npx shadcn@latest add https://micto-ui-kit.misangono.net/r/inertia-pagination.json
```

## Related Links

- **Documentation**: [https://micto-ui-kit.misangono.net](https://micto-ui-kit.misangono.net)
- **Repository**: [Municipal-ICT-Office-Angono/micto-ui-kit](https://github.com/Municipal-ICT-Office-Angono/micto-ui-kit)
