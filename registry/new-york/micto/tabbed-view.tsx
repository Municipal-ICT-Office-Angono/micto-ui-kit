/** 
* @title Tabbed View
* @description A container component that organizes content into distinct, selectable panels, allowing users to switch between different views within the same window.
* @categories react, component
*/
"use client";

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"

// ─── Types & Context ──────────────────────────────────────────────────────────

interface TabItem {
    tabValue: string;
    label: string;
    content: React.ReactNode;
}

// ─── Data & Tab Switch Function ───────────────────────────────────────────────────────────

interface TabbedViewProps {
    tabs: TabItem[];
    defaultValue?: string;
    value: string | undefined;
    onValueChange: (value: string) => void;
}

export function TabbedView({ tabs, defaultValue, value, onValueChange }: TabbedViewProps) {
    return (
        <Tabs
            defaultValue={defaultValue}
            onValueChange={onValueChange}
            value={value}
        >
            <TabsList>
                {tabs.map((tab) => {
                    return (
                        <TabsTrigger key={tab.tabValue} value={tab.tabValue}>{tab.label}</TabsTrigger>
                    )
                })}
            </TabsList>
            {tabs.map((tab) => (
                <TabsContent key={tab.tabValue} value={tab.tabValue}>
                    {tab.content}
                </TabsContent>
            ))}
        </Tabs>
    )
}
