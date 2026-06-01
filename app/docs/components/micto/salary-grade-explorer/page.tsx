import { CodeBlock } from "@/components/code-block";
import { InstallCommandTabs } from "@/components/install-command-tabs";
import { Badge } from "@/components/ui/badge";
import { PropsTable } from "@/components/props-table";
import { ComponentPreview } from "@/components/component-preview";
import { getCode, highlightCode } from "@/lib/get-code";
import { DocsHeader } from "@/components/docs-header";
import { DocsSectionHeading } from "@/components/docs-section-heading";
import SalaryGradeExplorerDemo from "@/registry/new-york/example/salary-grade-explorer-demo";

const installCommands = [
  {
    label: "pnpm",
    value:
      "pnpm dlx shadcn@latest add https://micto-ui-kit.misangono.net/r/micto/salary-grade-explorer.json",
  },
  {
    label: "npm",
    value:
      "npx shadcn@latest add https://micto-ui-kit.misangono.net/r/micto/salary-grade-explorer.json",
  },
];

const backendUsageCode = `import { SalaryGradeExplorer } from "@/components/micto/salary-grade-explorer";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function EmployeeSalaryPortal() {
  const [grade, setGrade] = useState(11);
  const [step, setStep] = useState(1);
  const [additions, setAdditions] = useState<string[]>([]);
  const [deductions, setDeductions] = useState<string[]>([]);

  // 100% backend-driven audit pipeline!
  const { data: payroll, isLoading } = useQuery({
    queryKey: ["payroll", grade, step, additions, deductions],
    queryFn: async () => {
      const res = await fetch("/api/payroll/calculate", {
        method: "POST",
        body: JSON.stringify({ grade, step, additions, deductions }),
      });
      return res.json();
    },
  });

  return (
    <SalaryGradeExplorer
      employeeName="Nehry Dedoro"
      position="Lead Systems Developer"
      activeGrade={grade}
      activeStep={step}
      payrollResult={payroll}
      isLoading={isLoading}
      onSelectionChange={(g, s, add, ded) => {
        setGrade(g);
        setStep(s);
        setAdditions(add);
        setDeductions(ded);
      }}
    />
  );
}`;

const propsData = [
  {
    name: "employeeName",
    type: "string",
    default: '"Nehry Dedoro"',
    description: "The name of the employee rendered on the payslip.",
  },
  {
    name: "position",
    type: "string",
    default: '"Lead Systems Developer"',
    description: "The official employee designation/position.",
  },
  {
    name: "payrollResult",
    type: "object",
    default: "undefined",
    description:
      "The calculated payroll breakdown (gross, statutory deductions, net) returned by the backend.",
  },
  {
    name: "onSelectionChange",
    type: "function",
    default: "undefined",
    description:
      "Callback triggered when a user changes grade, step, or checks custom simulated loans/allowances.",
  },
  {
    name: "isLoading",
    type: "boolean",
    default: "false",
    description:
      "Activates a premium loading overlay during asynchronous API calls/calculations.",
  },
];

export default async function SalaryGradeExplorerPage() {
  const previewRawCode = getCode(
    "registry/new-york/example/salary-grade-explorer-demo.tsx",
  );
  const previewHtml = await highlightCode(previewRawCode);
  const usageHtml = await highlightCode(backendUsageCode, "tsx");

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
        Backend-Driven
      </Badge>
      <Badge
        variant="outline"
        className="rounded-md px-2 py-0.5 text-[11px] uppercase tracking-wider border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium"
      >
        LGU HRIS
      </Badge>
    </>
  );

  return (
    <div className="mx-auto max-w-4xl space-y-12 pb-20 mt-8">
      <DocsHeader
        title="Salary Grade Explorer"
        description="A comprehensive, backend-driven administrative utility for LGU employee portals and HRIS managers. Enables employees to explore standardization grade steps, simulate voluntary deductions/additions, and visualize a printable itemized salary statement."
        badges={headerBadges}
      />

      <div className="space-y-16">
        {/* Interactive Demo */}
        <section className="space-y-6">
          <DocsSectionHeading
            title="Interactive Demo"
            description="Toggle different grades, steps, and optional deductions to observe a simulated backend API round-trip calculation with realistic loading states."
          />
          <ComponentPreview code={previewRawCode} html={previewHtml}>
            <SalaryGradeExplorerDemo />
          </ComponentPreview>
        </section>

        {/* Installation */}
        <section className="space-y-6">
          <DocsSectionHeading
            title="Installation"
            description="Install the component using the shadcn CLI."
          />
          <div className="rounded-xl border bg-muted/40 p-1">
            <InstallCommandTabs commands={installCommands} defaultValue="pnpm" />
          </div>
        </section>

        {/* Dynamic Usage */}
        <section className="space-y-6">
          <DocsSectionHeading
            title="Backend-Driven Integration"
            description="How to connect the component to React Query and a standard backend calculation API."
          />
          <div className="overflow-hidden rounded-xl border">
            <CodeBlock code={backendUsageCode} html={usageHtml} language="tsx" />
          </div>
        </section>

        {/* API Reference */}
        <section className="space-y-6">
          <DocsSectionHeading
            title="Properties Reference"
            description="Configure the explorer component with the following properties."
          />
          <PropsTable data={propsData} />
        </section>
      </div>
    </div>
  );
}
