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
import { cn } from "@/lib/utils";

// ─── Types & Context ──────────────────────────────────────────────────────────

export interface TabItem {
    tabValue: string;
    label: React.ReactNode;
    content: React.ReactNode | (() => React.ReactNode);
    icon?: React.ElementType;
    disabled?: boolean;
    className?: string;
}

// ─── Data & Tab Switch Function ───────────────────────────────────────────────────────────

export interface TabbedViewProps {
    tabs: TabItem[];
    defaultValue?: string;
    value?: string;
    onValueChange?: (value: string) => void;
    /**
     * If true, keeps hidden tabs in the DOM so they don't lose state (like form inputs).
     * WARNING: This means all tabs will mount and trigger data fetches immediately.
     */
    keepMounted?: boolean;
    className?: string;
    tabListWrap?: "wrap" | "scroll";
}

export function TabbedView({ tabs, defaultValue, value, onValueChange, keepMounted, className, tabListWrap = "scroll" }: TabbedViewProps) {
    return (
        <Tabs
            defaultValue={defaultValue ?? tabs[0]?.tabValue}
            onValueChange={onValueChange}
            value={value}
            className={cn(className)}
        >
            <TabsList className={
                cn(
                    "w-full p-1 justify-start! items-start! h-full!",
                    tabListWrap === "wrap"
                        ? "flex flex-wrap gap-1.5"
                        : "flex flex-row overflow-x-auto overflow-y-hidden whitespace-nowrap scrollbar-thin"
                )
            }>
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <TabsTrigger
                            key={tab.tabValue}
                            value={tab.tabValue}
                            disabled={tab.disabled}
                            className={cn(tab.className, 'justify-start')}
                        >
                            {Icon && <Icon className="w-4 h-4 mr-2" />}
                            {tab.label}
                        </TabsTrigger>
                    )
                })}
            </TabsList>
            {tabs.map((tab) => (
                <TabsContent
                    key={tab.tabValue}
                    value={tab.tabValue}
                    forceMount={keepMounted ? true : undefined}
                    className={keepMounted && value !== tab.tabValue ? "hidden" : ""}
                >
                    {/* Lazy evaluate the content if it's a function, otherwise render it directly */}
                    {typeof tab.content === 'function' ? tab.content() : tab.content}
                </TabsContent>
            ))}
        </Tabs>
    )
}
