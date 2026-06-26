"use client";

import React, { useState } from "react";
import {
  PieChartIcon,
  CalendarIcon,
  SettingsIcon,
  LockIcon,
} from "lucide-react";

import {
  Label as RechartsLabel,
  Pie,
  PieChart,
  Sector,
  PieSectorShapeProps,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import { Calendar } from "@/components/ui/calendar";
import { TabbedView } from "../micto/tabbed-view";

const attendeeData = [
  { area: "angono", attendees: 186, fill: "var(--color-angono)" },
  { area: "cainta", attendees: 305, fill: "var(--color-cainta)" },
  { area: "taytay", attendees: 237, fill: "var(--color-taytay)" },
  { area: "binangonan", attendees: 173, fill: "var(--color-binangonan)" },
  { area: "antipolo", attendees: 209, fill: "var(--color-antipolo)" },
];

const chartConfig = {
  attendees: {
    label: "Attendees",
  },
  angono: {
    label: "Angono",
    color: "var(--chart-1)",
  },
  cainta: {
    label: "Cainta",
    color: "var(--chart-2)",
  },
  taytay: {
    label: "Taytay",
    color: "var(--chart-3)",
  },
  binangonan: {
    label: "Binangonan",
    color: "var(--chart-4)",
  },
  antipolo: {
    label: "Antipolo",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig;

function ChartPieInteractive() {
  const id = "pie-interactive";
  const [activeArea, setActiveArea] = React.useState(attendeeData[0]?.area);

  const activeIndex = React.useMemo(
    () => attendeeData.findIndex((item) => item.area === activeArea),
    [activeArea],
  );
  const areas = React.useMemo(() => attendeeData.map((item) => item.area), []);

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
        );
      }

      return <Sector {...props} outerRadius={outerRadius} />;
    },
    [activeIndex],
  );

  return (
    <Card data-chart={id} className="flex flex-col min-h-[450px]">
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
              const config = chartConfig[key as keyof typeof chartConfig];

              if (!config) {
                return null;
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
              );
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
              data={attendeeData}
              dataKey="attendees"
              nameKey="area"
              innerRadius={60}
              strokeWidth={5}
              shape={renderPieShape}
            >
              <RechartsLabel
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                content={({ viewBox }: any) => {
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
                          {attendeeData[activeIndex]?.attendees.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Attendees
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function CalendarDemo() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  return (
    <Card className="flex flex-col items-center justify-center min-h-[450px]">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-lg border w-fit"
        captionLayout="dropdown"
      />
    </Card>
  );
}

function AdditionalComponent() {
  return (
    <Card className="flex flex-col min-h-[450px]">
      <CardHeader>
        <CardTitle>Settings & Preferences</CardTitle>
        <CardDescription>
          Manage your account, preferences, and public profile.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 flex-1">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Display Name</Label>
              <Input id="name" defaultValue="Misangono Admin" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                defaultValue="admin@misangono.net"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="about">About Me</Label>
            <Textarea
              id="about"
              placeholder="Write a short bio about yourself..."
              defaultValue="I am the lead administrator for the municipal portal."
              className="resize-none"
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
            <div className="space-y-0.5">
              <Label htmlFor="notifications">Email Notifications</Label>
              <p className="text-[13px] text-muted-foreground">
                Receive emails about new attendees and updates.
              </p>
            </div>
            <Switch id="notifications" defaultChecked />
          </div>
        </div>
      </CardContent>
      <div className="p-6 pt-0 mt-auto flex justify-end gap-3">
        <Button variant="outline">Discard</Button>
        <Button>Save Changes</Button>
      </div>
    </Card>
  );
}

export default function TabbedViewDemo() {
  const [currentTab, setCurrentTab] = useState("active");
  const [selectedVariant, setSelectedVariant] = React.useState<"wrap" | "scroll">("scroll");
  return (
    <div className="w-full max-w-4xl mx-auto space-y-12 py-6">
      <TabbedView
        className="w-fit"
        onValueChange={(value) => {
          if (value === "wrap") {
            setSelectedVariant("wrap");
          } else {
            setSelectedVariant("scroll");
          }
        }}
        tabs={[
          {
            tabValue: "wrap",
            label: "Wrap Tabs List",
          },
          {
            tabValue: "scroll",
            label: "Scroll Tabs List",
          }
        ]}
      />
      <TabbedView
        keepMounted={true}
        tabs={[
          {
            tabValue: "active",
            label: "Attendees Dashboard",
            icon: PieChartIcon,
            content: <ChartPieInteractive />,
          },
          {
            tabValue: "calendar",
            label: "Calendar",
            icon: CalendarIcon,
            content: <CalendarDemo />,
          },
          {
            // Lazy evaluate this component! It won't be called until the tab is clicked.
            tabValue: "custom",
            label: "Settings",
            icon: SettingsIcon,
            content: () => <AdditionalComponent />,
          },
          {
            tabValue: "locked",
            label: "Admin Panel",
            icon: LockIcon,
            disabled: true,
            content: (
              <Card className="flex flex-col min-h-112.5 items-center justify-center bg-muted/20">
                <div className="text-muted-foreground flex flex-col items-center gap-2">
                  <LockIcon className="h-8 w-8 opacity-50 mb-2" />
                  <p className="font-medium text-foreground">
                    Access Restricted
                  </p>
                  <p className="text-sm">
                    You don&apos;t have access to this tab.
                  </p>
                </div>
              </Card>
            ),
          },
        ]}
        onValueChange={setCurrentTab}
        value={currentTab}
        defaultValue="active"
        tabListWrap={selectedVariant}
      />
    </div>
  );
}
