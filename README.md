# MICTO UI KIT

![MICTO UI KIT](https://raw.githubusercontent.com/Municipal-ICT-Office-Angono/micto-ui-kit/main/public/og.png)

> A premium, metadata-driven UI component library and registry optimized for Municipal Government applications and LGU digital ecosystems.

The **MICTO UI KIT** is built on top of [shadcn/ui](https://ui.shadcn.com) and tailored specifically for the unique requirements of local government unit (LGU) software—from complex document routing and audit trails to high-performance data tables for procurement and payroll.

---

## ✨ Features

- **📂 Categorized Registry**: Components are organized into `micto`, `inertia`, and `hooks` for clean architectural boundaries.
- **🏷️ Metadata-Driven**: Component titles, descriptions, and categories are parsed directly from JSDoc tags.
- **🛠️ Automation Engine**: Scaffolding tools that create UI, demos, and docs in one command.
- **🚀 Inertia.js Ready**: specialized components designed for seamless integration with Laravel Inertia applications.
- **📱 Responsive & Accessible**: Built with Radix UI and Tailwind CSS for maximum compatibility.

---

## 🏗️ The Three Pillars

Our registry is divided into three specialized categories to serve different architectural needs:

| Category | Description | Registry Path |
| :--- | :--- | :--- |
| **Micto** | Core UI components (Data Tables, Timelines, Viewers). | `.../r/micto/[name].json` |
| **Inertia** | Laravel Inertia specific bridges (Pagination, Forms). | `.../r/inertia/[name].json` |
| **Hooks** | High-performance React logic (Table Queries, Auth). | `.../r/hooks/[name].json` |

---

## 🚀 Quick Start

### 1. Installation

Install any component directly into your project using the shadcn CLI:

```bash
# Install a UI component
npx shadcn@latest add https://micto-ui-kit.misangono.net/r/micto/data-table.json

# Install an Inertia component
npx shadcn@latest add https://micto-ui-kit.misangono.net/r/inertia/inertia-pagination.json

# Install a hook
npx shadcn@latest add https://micto-ui-kit.misangono.net/r/hooks/use-table-query.json
```

### 2. Local Development

```bash
# Install dependencies
pnpm install

# Run the documentation site
pnpm dev

# Build the registry manifests
pnpm registry:build
```

---

## 🛠️ Developer Workflow (Registry-as-Code)

We treat our registry as code. All metadata is managed directly in the source files.

### Synchronizing the Registry

To synchronize `registry.json` with your actual source files and JSDoc metadata:

```bash
pnpm registry:fresh
```

This script automatically:
- **Parses JSDoc**: Extracts `@title`, `@description`, and `@categories`.
- **Detects Imports**: Maps `registryDependencies` and `dependencies` automatically.
- **Respects Privacy**: Skips components marked with `@hidden true`.

### Scaffolding New Components

Create a production-ready component with documentation and demos in seconds:

```bash
pnpm add:component
```

The CLI will prompt you for a category (`micto`, `inertia`, or `hooks`) and automatically generate:
1. **Registry Source** (with `"use client"` where applicable)
2. **Local Re-export** (for internal doc usage)
3. **Interactive Demo** (pre-populated with premium boilerplate)
4. **Documentation Page** (featuring automatic installation tabs)

---

## 📖 Related Links

- **Documentation**: [https://micto-ui-kit.misangono.net](https://micto-ui-kit.misangono.net)
- **Organization**: [Municipal ICT Office - Angono](https://github.com/Municipal-ICT-Office-Angono)
- **Maintainer**: [Nehry Dedoro](https://github.com/nehry)

---

<div align="center">
  Built with ❤️ by the Municipal ICT Office of Angono.
</div>
