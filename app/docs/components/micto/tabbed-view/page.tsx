import { CodeBlock } from "@/components/code-block";
import { InstallCommandTabs } from "@/components/install-command-tabs";
import { Badge } from "@/components/ui/badge";
import { PropsTable } from "@/components/props-table";
import { ComponentPreview } from "@/components/component-preview";
import { getCode, highlightCode } from "@/lib/get-code";
import { DocsHeader } from "@/components/docs-header";
import { DocsSectionHeading } from "@/components/docs-section-heading";
import TabbedViewDemo from "@/registry/new-york/example/tabbed-view-demo";

const installCommands = [
  {
    label: "pnpm",
    value:
      "pnpm dlx shadcn@latest add https://micto-ui-kit.misangono.net/r/micto/tabbed-view.json",
  },
  {
    label: "npm",
    value:
      "npx shadcn@latest add https://micto-ui-kit.misangono.net/r/micto/tabbed-view.json",
  },
];

const basicUsageCode = `import { useState } from "react";
import { TabbedView } from "@/components/micto/tabbed-view";
import { UserIcon, SettingsIcon } from "lucide-react";

export default function BasicTabs() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <TabbedView
      tabs={[
        {
          tabValue: "profile",
          label: "Profile",
          icon: UserIcon,
          content: <div>Profile Content Here</div>,
        },
        {
          tabValue: "settings",
          label: "Settings",
          icon: SettingsIcon,
          content: <div>Settings Content Here</div>,
        },
      ]}
      value={activeTab}
      onValueChange={setActiveTab}
    />
  );
}`;

const lazyUsageCode = `import { useState } from "react";
import { TabbedView } from "@/components/micto/tabbed-view";
import { HeavyChartComponent } from "./heavy-chart";

export default function LazyTabs() {
  return (
    <TabbedView
      tabs={[
        {
          tabValue: "fast",
          label: "Fast Tab",
          content: <div>Immediate rendering</div>,
        },
        {
          tabValue: "heavy",
          label: "Heavy Tab",
          // Pass a function to lazy-evaluate the component!
          // HeavyChartComponent won't be instantiated or mounted until this tab is clicked.
          content: () => <HeavyChartComponent />,
        },
      ]}
    />
  );
}`;

const statePreservationCode = `import { useState } from "react";
import { TabbedView } from "@/components/micto/tabbed-view";

export default function StatefulTabs() {
  return (
    <TabbedView
      // Set to true to keep hidden tabs mounted in the DOM.
      // This preserves state (e.g., input field values) when switching tabs.
      keepMounted={true}
      tabs={[
        {
          tabValue: "form-step-1",
          label: "Step 1",
          content: <input type="text" placeholder="Type here and switch tabs..." />,
        },
        {
          tabValue: "form-step-2",
          label: "Step 2",
          content: <div>Step 2 details</div>,
        },
      ]}
    />
  );
}`;

const tabProps = [
  {
    name: "tabs",
    type: "TabItem[]",
    default: "",
    description: "Array of tab configurations.",
  },
  {
    name: "defaultValue",
    type: "string",
    default: "tabs[0].tabValue",
    description:
      "The value of the tab that should be active when initially rendered.",
  },
  {
    name: "value",
    type: "string",
    default: "undefined",
    description: "The controlled value of the active tab.",
  },
  {
    name: "onValueChange",
    type: "(value: string) => void",
    default: "undefined",
    description: "Event handler called when the value changes.",
  },
  {
    name: "keepMounted",
    type: "boolean",
    default: "false",
    description:
      "If true, keeps hidden tabs in the DOM so they don't lose state (like form inputs).",
  },
  {
    name: "className",
    type: "string",
    default: "undefined",
    description: "Optional CSS classes to apply to the root Tabs component.",
  },
];

const tabItemProps = [
  {
    name: "tabValue",
    type: "string",
    default: "",
    description: "Unique identifier for the tab.",
  },
  {
    name: "label",
    type: "ReactNode",
    default: "",
    description: "The label displayed on the tab trigger.",
  },
  {
    name: "content",
    type: "ReactNode | (() => ReactNode)",
    default: "",
    description:
      "The content to display when the tab is active. Pass a function for strict lazy evaluation.",
  },
  {
    name: "icon",
    type: "ElementType",
    default: "undefined",
    description:
      "Optional icon component (like Lucide icons) to display next to the label.",
  },
  {
    name: "disabled",
    type: "boolean",
    default: "false",
    description: "If true, prevents the user from selecting the tab.",
  },
  {
    name: "className",
    type: "string",
    default: "undefined",
    description:
      "Optional CSS classes to apply specifically to this tab's trigger.",
  },
];

export default async function TabbedViewPage() {
  const previewRawCode = getCode(
    "registry/new-york/example/tabbed-view-demo.tsx",
  );
  const previewHtml = await highlightCode(previewRawCode);
  const basicUsageHtml = await highlightCode(basicUsageCode, "tsx");
  const lazyUsageHtml = await highlightCode(lazyUsageCode, "tsx");
  const statePreservationHtml = await highlightCode(
    statePreservationCode,
    "tsx",
  );

  const headerBadges = (
    <>
      <Badge
        variant="secondary"
        className="rounded-md px-2 py-0.5 text-[11px] uppercase tracking-wider"
      >
        React
      </Badge>
      <Badge
        variant="outline"
        className="rounded-md px-2 py-0.5 text-[11px] uppercase tracking-wider border-primary/20 bg-primary/5 text-primary font-medium"
      >
        Radix Tabs
      </Badge>
    </>
  );

  return (
    <div className="mx-auto max-w-4xl space-y-12 pb-20 mt-8">
      <DocsHeader
        title="Tabbed View"
        description="A robust, config-driven container component that organizes content into distinct panels. Supports lazy evaluation, state preservation, icons, and disabled states."
        badges={headerBadges}
      />
      <div className="space-y-16">
        {/* Interactive Demo */}
        <section className="space-y-6">
          <DocsSectionHeading
            title="Interactive Demo"
            description="Features multiple tabs including icons, a disabled 'Admin Panel' tab, and a lazy-rendered 'Settings' tab."
          />
          <ComponentPreview code={previewRawCode} html={previewHtml}>
            <TabbedViewDemo />
          </ComponentPreview>
        </section>

        {/* Installation */}
        <section className="space-y-6">
          <DocsSectionHeading
            title="Installation"
            description="Install the TabbedView component."
          />
          <div className="space-y-4">
            <div className="rounded-xl border bg-muted/40 p-1">
              <InstallCommandTabs
                commands={installCommands}
                defaultValue="pnpm"
              />
            </div>
          </div>
        </section>

        {/* Basic Usage */}
        <section className="space-y-6">
          <DocsSectionHeading
            title="Basic Usage"
            description="Provide an array of tabs with labels, icons, and content."
          />
          <div className="overflow-hidden rounded-xl border">
            <CodeBlock
              code={basicUsageCode}
              html={basicUsageHtml}
              language="tsx"
            />
          </div>
        </section>

        {/* Lazy Evaluation */}
        <section className="space-y-6">
          <DocsSectionHeading
            title="Lazy Evaluation (Thunk Pattern)"
            description="By default, passing a React Element (e.g. <HeavyComponent />) evaluates it immediately. To strictly defer instantiation and execution until the tab is opened, pass a function that returns the component."
          />
          <div className="overflow-hidden rounded-xl border">
            <CodeBlock
              code={lazyUsageCode}
              html={lazyUsageHtml}
              language="tsx"
            />
          </div>
        </section>

        {/* State Preservation */}
        <section className="space-y-6">
          <DocsSectionHeading
            title="State Preservation (keepMounted)"
            description="Radix UI normally unmounts inactive tabs to save memory, which destroys component state (like form inputs). Use keepMounted={true} to hide them via CSS instead, preserving all state."
          />
          <div className="overflow-hidden rounded-xl border">
            <CodeBlock
              code={statePreservationCode}
              html={statePreservationHtml}
              language="tsx"
            />
          </div>
        </section>

        {/* Props: TabbedView */}
        <section className="space-y-6">
          <DocsSectionHeading
            title="TabbedView Props"
            description="Root component configuration."
          />
          <PropsTable data={tabProps} />
        </section>

        {/* Props: TabItem */}
        <section className="space-y-6">
          <DocsSectionHeading
            title="TabItem Interface"
            description="Configuration object for individual tabs."
          />
          <PropsTable data={tabItemProps} />
        </section>
      </div>
    </div>
  );
}
