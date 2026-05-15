export interface NavItem {
  title: string;
  url: string;
}

export interface NavSection {
  title: string;
  category?: string;
  excludeCategory?: string;
  items?: NavItem[];
}

export interface DocsConfig {
  navigation: NavSection[];
  categories: { label: string; value: string }[];
}

export const docsConfig: DocsConfig = {
  categories: [
    { label: "React", value: "react" },
    { label: "Inertia", value: "inertia" },
    { label: "Hooks", value: "hook" },
    { label: "Utilities", value: "utility" },
  ],
  navigation: [
    {
      title: "Getting Started",
      items: [
        { title: "Introduction", url: "/docs/introduction" },
        { title: "Installation", url: "/docs/installation" },
      ],
    },
    {
      title: "React Components",
      category: "react",
      excludeCategory: "inertia",
    },
    {
      title: "React Inertia",
      category: "inertia",
    },
    // {
    //   title: "Hooks & Utilities",
    //   category: "hook",
    // },
  ],
};
