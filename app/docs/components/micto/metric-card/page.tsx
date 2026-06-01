import { CodeBlock } from "@/components/code-block";
import { InstallCommandTabs } from "@/components/install-command-tabs";
import { Badge } from "@/components/ui/badge";
import { PropsTable } from "@/components/props-table";
import { ComponentPreview } from "@/components/component-preview";
import { getCode, highlightCode } from "@/lib/get-code";
import { DocsHeader } from "@/components/docs-header";
import { DocsSectionHeading } from "@/components/docs-section-heading";
import MetricCardDemo from "@/registry/new-york/example/metric-card-demo";

const installCommands = [
  {
    label: "pnpm",
    value:
      "pnpm dlx shadcn@latest add https://micto-ui-kit.misangono.net/r/micto/metric-card.json",
  },
  {
    label: "npm",
    value:
      "npx shadcn@latest add https://micto-ui-kit.misangono.net/r/micto/metric-card.json",
  },
];

const basicUsageCode = `import { MetricCard } from "@/components/micto/metric-card";
import { DollarSign } from "lucide-react";

export default function SimpleMetric() {
  return (
    <MetricCard
      title="Total Revenue"
      value="$45,231.89"
      icon={DollarSign}
    />
  );
}`;

const trendUsageCode = `import { MetricCard } from "@/components/micto/metric-card";
import { Users } from "lucide-react";

export default function TrendMetric() {
  return (
    <MetricCard
      title="Active Users"
      value="12,482"
      icon={Users}
      trend={10.5} // Renders as +10.5% in green with a TrendingUp arrow
      trendLabel="from last week"
    />
  );
}`;

const invertTrendColorsCode = `import { MetricCard } from "@/components/micto/metric-card";
import { Activity } from "lucide-react";

export default function InvertedTrendMetric() {
  return (
    <MetricCard
      title="Bounce Rate"
      value="42.3%"
      icon={Activity}
      trend={-8.2} // A negative bounce rate is GOOD!
      trendLabel="vs yesterday"
      invertTrendColors={true} // Reverses colors: negative renders in green (good)
    />
  );
}`;

const sparklineUsageCode = `import { MetricCard } from "@/components/micto/metric-card";
import { DollarSign } from "lucide-react";
import { ChartConfig } from "@/components/ui/chart";

const chartData = [
  { month: "Jan", revenue: 2000 },
  { month: "Feb", revenue: 3500 },
  { month: "Mar", revenue: 3000 },
  { month: "Apr", revenue: 4800 },
];

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export default function SparklineMetric() {
  return (
    <MetricCard
      title="Revenue Trend"
      value="$45,231.89"
      icon={DollarSign}
      trend={20.1}
      trendLabel="from last month"
      chartData={chartData}
      chartConfig={chartConfig}
      chartDataKey="revenue"
    />
  );
}`;

const metricProps = [
  {
    name: "title",
    type: "string",
    default: "",
    description: "The label for the metric (e.g. 'Total Revenue').",
  },
  {
    name: "value",
    type: "string | number",
    default: "",
    description: "The primary highlighted quantitative value.",
  },
  {
    name: "icon",
    type: "ElementType",
    default: "undefined",
    description: "Optional Lucide icon displayed in the top right.",
  },
  {
    name: "trend",
    type: "number",
    default: "undefined",
    description:
      "The percentage change value (renders with arrow icons and +/- tags automatically).",
  },
  {
    name: "trendLabel",
    type: "string",
    default: "undefined",
    description: "Contextual label for the trend (e.g. 'from last month').",
  },
  {
    name: "invertTrendColors",
    type: "boolean",
    default: "false",
    description:
      "If true, negative trends are colored green (good) and positive trends are colored red (bad).",
  },
  {
    name: "chartData",
    type: "any[]",
    default: "undefined",
    description:
      "Optional array of mock data points to render a bottom sparkline chart.",
  },
  {
    name: "chartConfig",
    type: "ChartConfig",
    default: "undefined",
    description:
      "The Shadcn chart configuration object defining labels and HSL color variables.",
  },
  {
    name: "chartDataKey",
    type: "string",
    default: "'value'",
    description: "The data property key used to render the Area y-axis value.",
  },
  {
    name: "className",
    type: "string",
    default: "undefined",
    description: "Custom class names applied to the container Card.",
  },
];

export default async function MetricCardPage() {
  const previewRawCode = getCode(
    "registry/new-york/example/metric-card-demo.tsx",
  );
  const previewHtml = await highlightCode(previewRawCode);
  const basicUsageHtml = await highlightCode(basicUsageCode, "tsx");
  const trendUsageHtml = await highlightCode(trendUsageCode, "tsx");
  const invertTrendColorsHtml = await highlightCode(
    invertTrendColorsCode,
    "tsx",
  );
  const sparklineUsageHtml = await highlightCode(sparklineUsageCode, "tsx");

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
        Recharts
      </Badge>
      <Badge
        variant="outline"
        className="rounded-md px-2 py-0.5 text-[11px] uppercase tracking-wider border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium"
      >
        KPI
      </Badge>
    </>
  );

  return (
    <div className="mx-auto max-w-4xl space-y-12 pb-20 mt-8">
      <DocsHeader
        title="Metric Card"
        description="A beautiful, interactive KPI card component built to highlight key dashboard metrics. Features icon slots, automatic trend direction formatting, custom color inversion for metrics where 'lower is better', and integrated sparkline area charts."
        badges={headerBadges}
      />

      <div className="space-y-16">
        {/* Interactive Demo */}
        <section className="space-y-6">
          <DocsSectionHeading
            title="Interactive Demo"
            description="A dashboard overview layout showing standard, text-only, sparkline, and custom trend inverted metric cards."
          />
          <ComponentPreview code={previewRawCode} html={previewHtml}>
            <MetricCardDemo />
          </ComponentPreview>
        </section>

        {/* Installation */}
        <section className="space-y-6">
          <DocsSectionHeading
            title="Installation"
            description="Install the MetricCard component."
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
            description="Render a simple value with a title and an icon slot."
          />
          <div className="overflow-hidden rounded-xl border">
            <CodeBlock
              code={basicUsageCode}
              html={basicUsageHtml}
              language="tsx"
            />
          </div>
        </section>

        {/* Trend Indicator */}
        <section className="space-y-6">
          <DocsSectionHeading
            title="Trend Indicators"
            description="Pass a trend value to automatically color and select the correct trending icon."
          />
          <div className="overflow-hidden rounded-xl border">
            <CodeBlock
              code={trendUsageCode}
              html={trendUsageHtml}
              language="tsx"
            />
          </div>
        </section>

        {/* Invert Trend Colors */}
        <section className="space-y-6">
          <DocsSectionHeading
            title="Inverted Trends (Lower is Better)"
            description="For metrics where a drop is good (like bounce rate, server errors, or churn), set invertTrendColors={true} to flip the green/red coloring."
          />
          <div className="overflow-hidden rounded-xl border">
            <CodeBlock
              code={invertTrendColorsCode}
              html={invertTrendColorsHtml}
              language="tsx"
            />
          </div>
        </section>

        {/* Sparkline Spark Chart */}
        <section className="space-y-6">
          <DocsSectionHeading
            title="Sparkline Charts"
            description="Pass a datasets and chart configuration to render a clean, bottom-anchored area sparkline that fills the width of the card card."
          />
          <div className="overflow-hidden rounded-xl border">
            <CodeBlock
              code={sparklineUsageCode}
              html={sparklineUsageHtml}
              language="tsx"
            />
          </div>
        </section>

        {/* Props Reference */}
        <section className="space-y-6">
          <DocsSectionHeading
            title="MetricCard API Reference"
            description="Configure the metric card component using the following options."
          />
          <PropsTable data={metricProps} />
        </section>
      </div>
    </div>
  );
}
