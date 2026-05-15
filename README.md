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

```bash
npx shadcn@latest add https://micto-ui-kit.misangono.net/r/inertia-pagination.json
```

## Registry Management

The project includes an automation engine to keep the component registry in sync with your source code.

### 1. Synchronizing Components

To update `registry.json` based on your actual files and imports, run:

```bash
pnpm registry:fresh
```

This command will:
- **Analyze Imports**: Automatically detect `registryDependencies` and npm `dependencies`.
- **Sync Metadata**: Pull title, description, and categories from JSDoc.
- **Rebuild**: Trigger a full shadcn build after updating the manifest.

### 2. Using JSDoc for Metadata

You can define component metadata directly in the source file using JSDoc. The sync engine will prioritize these tags:

```tsx
/**
 * @title My Component
 * @description A professional LGU component.
 * @category react, document
 */
export function MyComponent() { ... }
```

### 3. Scaffolding New Components

To create a new component with all 4 necessary files (registry, link, demo, and docs), run:

```bash
pnpm add:component
```

Follow the prompts to provide the name, title, and description. The script will automatically:
1. Create the **UI Component** with a premium base design.
2. Create the **Local Link** (re-export).
3. Create an **Interactive Demo**.
4. Create the **Documentation Page**.
5. Run `registry:fresh` to register it.

## Related Links

- **Documentation**: [https://micto-ui-kit.misangono.net](https://micto-ui-kit.misangono.net)
- **Repository**: [Municipal-ICT-Office-Angono/micto-ui-kit](https://github.com/Municipal-ICT-Office-Angono/micto-ui-kit)



