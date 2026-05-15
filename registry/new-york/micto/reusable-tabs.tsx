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

interface ReusableTabsProps {
    tabs: TabItem[];
    defaultValue?: string;
    value: string | undefined;
    onValueChange: (value: string) => void;
}

export function ReusableTabs({ tabs, defaultValue, value, onValueChange }: ReusableTabsProps) {
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