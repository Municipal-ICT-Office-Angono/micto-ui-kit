"use client";

import React, { useState } from 'react';
import { ReusableTabs } from '../ui/reusable-tabs';

import { Label, Pie, PieChart, Sector } from "recharts"
import type {
    PieSectorShapeProps,
} from "recharts/types/polar/Pie"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartStyle,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { Calendar } from "@/components/ui/calendar"


const description = "An interactive pie chart"

// const desktopData = [
//     { area: "angono", desktop: 186, fill: "var(--color-january)" },
//     { area: "cainta", desktop: 305, fill: "var(--color-february)" },
//     { area: "taytay", desktop: 237, fill: "var(--color-march)" },
//     { area: "binangonan", desktop: 173, fill: "var(--color-april)" },
//     { area: "antipolo", desktop: 209, fill: "var(--color-may)" },
// ]
const desktopData = [
    { area: "angono", desktop: 186, fill: "var(--color-angono)" },
    { area: "cainta", desktop: 305, fill: "var(--color-cainta)" },
    { area: "taytay", desktop: 237, fill: "var(--color-taytay)" },
    { area: "binangonan", desktop: 173, fill: "var(--color-binangonan)" },
    { area: "antipolo", desktop: 209, fill: "var(--color-antipolo)" },
]

const chartConfig = {
    attendees: {
        label: "Attendees",
    },
    desktop: {
        label: "Desktop",
    },
    mobile: {
        label: "Mobile",
    },
    angono: {
        label: "angono",
        color: "var(--chart-1)",
    },
    cainta: {
        label: "cainta",
        color: "var(--chart-2)",
    },
    taytay: {
        label: "taytay",
        color: "var(--chart-3)",
    },
    binangonan: {
        label: "binangonan",
        color: "var(--chart-4)",
    },
    antipolo: {
        label: "antipolo",
        color: "var(--chart-5)",
    },
} satisfies ChartConfig

function ChartPieInteractive() {
    const id = "pie-interactive"
    const [activeArea, setActiveArea] = React.useState(desktopData[0]?.area)

    const activeIndex = React.useMemo(
        () => desktopData.findIndex((item) => item.area === activeArea),
        [activeArea]
    )
    const areas = React.useMemo(() => desktopData.map((item) => item.area), [])

    const renderPieShape = React.useCallback(
        ({ index, outerRadius = 0, ...props }: PieSectorShapeProps) => {
            if (index === activeIndex) {
                return (
                    <g>
                        <Sector {...props} outerRadius={outerRadius + 10} />
                        <Sector
                            {...props}
                            outerRadius={outerRadius + 25}
                            innerRadius={outerRadius + 12}
                        />
                    </g>
                )
            }

            return <Sector {...props} outerRadius={outerRadius} />
        },
        [activeIndex]
    )

    return (
        <Card data-chart={id} className="flex flex-col">
            <ChartStyle id={id} config={chartConfig} />
            <CardHeader className="flex-row items-start space-y-0 pb-0">
                <div className="grid gap-1">
                    <CardTitle>Attendees</CardTitle>
                    <CardDescription>January - June 2024</CardDescription>
                </div>
                <Select value={activeArea} onValueChange={setActiveArea}>
                    <SelectTrigger
                        className="ml-auto h-7 w-[130px] rounded-lg pl-2.5"
                        aria-label="Select a value"
                    >
                        <SelectValue placeholder="Select area" />
                    </SelectTrigger>
                    <SelectContent align="end" className="rounded-xl">
                        {areas.map((key) => {
                            const config = chartConfig[key as keyof typeof chartConfig]

                            if (!config) {
                                return null
                            }

                            return (
                                <SelectItem
                                    key={key}
                                    value={key}
                                    className="rounded-lg [&_span]:flex"
                                >
                                    <div className="flex items-center gap-2 text-xs">
                                        <span
                                            className="flex h-3 w-3 shrink-0 rounded-xs"
                                            style={{
                                                backgroundColor: `var(--color-${key})`,
                                            }}
                                        />
                                        {config?.label}
                                    </div>
                                </SelectItem>
                            )
                        })}
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent className="flex flex-1 justify-center pb-0">
                <ChartContainer
                    id={id}
                    config={chartConfig}
                    className="mx-auto aspect-square w-full max-w-[300px]"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={desktopData}
                            dataKey="desktop"
                            nameKey="area"
                            innerRadius={60}
                            strokeWidth={5}
                            shape={renderPieShape}
                        >
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-foreground text-3xl font-bold"
                                                >
                                                    {desktopData[activeIndex]?.desktop.toLocaleString()}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground"
                                                >
                                                    Attendees
                                                </tspan>
                                            </text>
                                        )
                                    }
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}

function CalendarDemo() {
    const [date, setDate] = React.useState<Date | undefined>(new Date())
    return (
        <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-lg border w-full"
            captionLayout="dropdown"
        />
    )
}

function AdditionalComponent() {
    return (
        <div className="mx-auto aspect-square w-full border rounded-xl p-3">
            <div className='flex justify-center items-center h-screen text-muted-foreground'>Pass your other component here.</div>
        </div>
    );
}

export default function ReusableTabsDemo() {
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
}