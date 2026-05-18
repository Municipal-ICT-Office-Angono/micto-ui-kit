import * as React from "react";
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
            "pnpm dlx shadcn@latest add https://micto-ui-kit.misangono.net/r/tabbed-view.json",
    },
    {
        label: "npm",
        value:
            "npx shadcn@latest add https://micto-ui-kit.misangono.net/r/tabbed-view.json",
    },
];

const basicUsageCode = `import { useState } from "react"
import { TabbedView } from "@/components/micto/tabbed-view"

export default function Example() {
    const [currentTab, setCurrentTab] = useState('active');

    return (
        <div className="w-full max-w-4xl mx-auto space-y-12 py-6">
            <TabbedView
                tabs={[
                    {
                        tabValue: 'active', label: 'Dashboard', content: <div>Dashboard</div>
                    },
                    {
                        tabValue: 'calendar', label: 'Calendar', content: <div>Calendar</div>
                    },
                    {
                        tabValue: 'custom', label: 'Settings', content: <div>Settings</div>
                    }
                ]}
                onValueChange={setCurrentTab}
                value={currentTab}
                defaultValue='active'
            />
        </div>
    )
}`;

const tabbedViewPropsData = [
    {
        name: "tabs",
        type: "object array",
        default: "undefined",
        description: "List of objects with value, label, and content - component/page/screen",
    },
    {
        name: "tabValue",
        type: "string",
        default: "undefined",
        description: "Value/id used to switch tab/display.",
    },
    {
        name: "label",
        type: "string",
        default: "undefined",
        description: "The text display in the tab bar.",
    },
    {
        name: "content",
        type: "ReactNode",
        default: "undefined",
        description: "The component/page to display each tab.",
    },
    {
        name: "onValueChange",
        type: "() => void",
        default: "undefined",
        description: "Callback fired when clicking the switch toggle trigger inside tab bar.",
    },
    {
        name: "value",
        type: "string",
        default: "undefined",
        description: "State of currently selected tab.",
    },
    {
        name: "defaultValue",
        type: "string",
        default: "undefined",
        description: "Used to assign the default tab selected on initial load.",
    }
];

export default async function TabbedViewPage() {
    const previewRawCode = getCode(
        "registry/new-york/example/tabbed-view-demo.tsx",
    );
    const previewHtml = await highlightCode(previewRawCode);
    const basicUsageHtml = await highlightCode(basicUsageCode);

    const headerBadges = (
        <>
            <Badge
                variant="secondary"
                className="rounded-md px-2 py-0.5 text-[11px] uppercase tracking-wider"
            >
                React
            </Badge>
            <Badge
                hidden={true}
                variant="outline"
                className="rounded-md px-2 py-0.5 text-[11px] uppercase tracking-wider border-primary/20 bg-primary/5 text-primary font-medium"
            >
                Reactive Morphs
            </Badge>
        </>
    );

    return (
        <div className="mx-auto max-w-4xl space-y-12 pb-20 mt-8">
            <DocsHeader
                title="Tabbed View"
                description="A container component that organizes content into distinct, selectable panels, allowing users to switch between different views within the same window."
                badges={headerBadges}
            />

            {/* Main Content */}
            <div className="space-y-16">
                {/* Preview Section */}
                <section className="space-y-6">
                    <DocsSectionHeading
                        title="Interactive Demo"
                        description="Select the toggle to switch tabs and see other components/pages."
                    />
                    <ComponentPreview code={previewRawCode} html={previewHtml}>
                        <TabbedViewDemo />
                    </ComponentPreview>
                </section>

                {/* Installation Section */}
                <section className="space-y-6">
                    <DocsSectionHeading title="Installation" />
                    <div className="rounded-xl border bg-muted/40 p-1">
                        <InstallCommandTabs
                            commands={installCommands}
                            defaultValue="pnpm"
                        />
                    </div>
                </section>

                {/* Usage A Section */}
                <section className="space-y-6">
                    <DocsSectionHeading
                        title="Complete Tabbed View Layout"
                        description="Declare tab objects containing value, label, and corresponding component. The container switches tabs and displays the passed component."
                    />
                    <div className="overflow-hidden rounded-xl border">
                        <CodeBlock code={basicUsageCode} html={basicUsageHtml} language="tsx" />
                    </div>
                </section>

                {/* Props Reference A */}
                <section className="space-y-6">
                    <DocsSectionHeading
                        title="Tabbed View API Reference"
                        description="Configure the tabbed view using the following options."
                    />
                    <PropsTable data={tabbedViewPropsData} />
                </section>
            </div>
        </div>
    );
}
