import * as React from "react";
import { CodeBlock } from "@/components/code-block";
import { InstallCommandTabs } from "@/components/install-command-tabs";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
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

const basicUsageCode = `import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
export default function Example() {
    const [currentTab, setCurrentTab] = useState('active');
    return (
        <div className="w-full max-w-4xl mx-auto space-y-12 py-6">
            <ReusableTabs
                tabs={
                    [
                        {
                            tabValue: 'active', label: 'Attendees Dashboard', content: <ChartPieInteractive />
                        },
                        {
                            tabValue: 'trash', label: 'Calendar', content: <CalendarDemo />
                        },
                        {
                            tabValue: 'custom', label: 'Your Other Component', content: <AdditionalComponent />
                        }
                    ]
                }
                onValueChange={setCurrentTab}
                value={currentTab}
                defaultValue='active'
            />
        </div >
    )
}`;

const reusableTabPropsData = [
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

export default async function ReusableTabsPage() {
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
                title="Reusable Tabs"
                description="A simple tabs container for multiple screens or sub-pages that switches."
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
                        title="Complete Reusable Tabs Layout"
                        description="Declare tab objects containing value, label, corresponding component, and tab click function. The container switches tabs via function and displays the passed component."
                    />
                    <div className="overflow-hidden rounded-xl border">
                        <CodeBlock code={basicUsageCode} html={basicUsageHtml} language="tsx" />
                    </div>
                </section>

                {/* Props Reference A */}
                <section className="space-y-6">
                    <DocsSectionHeading
                        title="Reusable Tabs API Reference"
                        description="Configure the toolbar layout using the following options."
                    />
                    <div className="rounded-xl border overflow-hidden shadow-sm bg-background">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50 hover:bg-muted/50">
                                    <TableHead className="w-[150px] font-bold text-foreground/80 lowercase tracking-tight">
                                        Prop
                                    </TableHead>
                                    <TableHead className="font-bold text-foreground/80 lowercase tracking-tight">
                                        Type
                                    </TableHead>
                                    <TableHead className="font-bold text-foreground/80 lowercase tracking-tight">
                                        Default
                                    </TableHead>
                                    <TableHead className="text-right font-bold text-foreground/80 lowercase tracking-tight">
                                        Description
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {reusableTabPropsData.map((prop) => (
                                    <TableRow
                                        key={prop.name}
                                        className="border-b transition-colors hover:bg-muted/5 font-sans"
                                    >
                                        <TableCell className="font-mono text-xs font-semibold text-primary/80">
                                            {prop.name}
                                        </TableCell>
                                        <TableCell className="font-mono text-xs text-blue-600 dark:text-blue-400">
                                            {prop.type}
                                        </TableCell>
                                        <TableCell className="font-mono text-xs text-muted-foreground/70">
                                            {prop.default}
                                        </TableCell>
                                        <TableCell className="text-right text-xs leading-relaxed max-w-[300px] text-muted-foreground">
                                            {prop.description}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </section>
            </div>
        </div>
    );
}
