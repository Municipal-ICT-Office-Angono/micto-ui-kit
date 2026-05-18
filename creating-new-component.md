# MICTO UI Kit - AI Agent Guide

This guide defines the standards and workflows for AI agents contributing to the MICTO UI Kit. Follow these rules to maintain project integrity and a premium developer experience.

## 🚀 1. Component Lifecycle

### Scaffolding

Always use the custom scaffolder to create new components. This ensures all required files (registry source, component bridge, demo, and docs) are created with correct paths and boilerplate.

```bash
pnpm add:component
```

- **Name:** Use `slug-case` (e.g., `metric-card`).
- **Navigation:** Select "Yes" for UI components to ensure they appear in the sidebar.

### Removal

Use the removal tool to safely purge components. It deletes files from all 5 critical locations and automatically syncs the manifest.

```bash
pnpm remove:component --name=component-name --force
```

---

## 📝 2. Metadata Standards (Registry-as-Code)

All component metadata is stored in the source file's JSDoc block. The `registry:fresh` tool parses this to build `registry.json`.

**Mandatory JSDoc Block (at the top of the registry source file):**\

```tsx
/**
 * @title Component Title (Human Readable)
 * @description A clear, professional description of the component's purpose.
 * @categories react, component, [category-name]
 * @hidden (optional) Set to true to hide from navigation but keep in registry
 */
```

*Note: Ensure there is a newline between the tags and the closing `*/` to prevent parsing errors.*

---

## 🎨 3. Design & Prop Standards

### Premium Aesthetics

- Use **harmonious color palettes** (e.g., `text-muted-foreground`, `bg-card`).
- Implement **sleek transitions** (e.g., `transition-all`, `hover:shadow-md`).
- Avoid generic colors; use Tailwind's semantic classes.

### Standard Props

Every UI component should ideally follow the MICTO prop pattern for consistency:

- `title?: string`: Main heading.
- `description?: string`: Subtext/caption.
- `className?: string`: For style overrides using `cn()`.
- `children?: React.ReactNode`: Main content slot.

---

## 🔧 4. Registry Synchronization

After modifying JSDoc metadata or deleting files, you **MUST** sync the registry to rebuild the manifests and distribution files:

```bash
pnpm registry:fresh --all
```

This command:

1. Scans all files in `registry/new-york/[micto|inertia|hooks]`.
2. Updates `registry.json` with new titles/descriptions/categories.
3. **Purges orphaned entries** for deleted files.
4. Rebuilds the `public/r/` JSON distribution files.

---

## 📂 5. Directory Structure

- `registry/new-york/micto/`: Primary source for UI components.
- `components/micto/`: Local project bridges (proxies that import from registry source).
- `registry/new-york/example/`: Interactive component demos.
- `app/docs/components/[category]/[name]/`: Documentation pages.

---

## ⚠️ 6. Important Constraints

- **No Relative Imports:** Always use `@/` aliases for project files.
- **Client Components:** Use `"use client";` only where interactivity (hooks/events) is strictly required.
- **Dependency Detection:** The sync tool automatically detects imports and adds them to `registry.json`. Ensure any new third-party libraries are installed in `package.json` first.
- **Build Integrity:** The `scripts/` directory is ignored in production. Keep all production logic in `lib/`, `hooks/`, or `components/`.
