import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/components/code-block";
import { ComponentPreview } from "@/components/component-preview";
import { DocsHeader } from "@/components/docs-header";
import { DocsSectionHeading } from "@/components/docs-section-heading";
import { InstallCommandTabs } from "@/components/install-command-tabs";
import { PropsTable } from "@/components/props-table";
import { getCode, highlightCode } from "@/lib/get-code";
import ApprovalWorkflowDemo from "@/registry/new-york/example/approval-workflow-demo";

const installCommands = [
  {
    label: "pnpm",
    value: "pnpm dlx shadcn@latest add https://micto-ui-kit.misangono.net/r/micto/approval-workflow.json",
  },
  {
    label: "npm",
    value: "npx shadcn@latest add https://micto-ui-kit.misangono.net/r/micto/approval-workflow.json",
  },
];

const usageCode = `import * as React from "react"
import {
  ApprovalWorkflowBuilder,
  ApprovalWorkflowTimeline,
  ApprovalWorkflowActions,
  createWorkflowInstance,
  useApprovalWorkflow,
  type WorkflowDefinition,
} from "@/components/micto/approval-workflow"

const definition: WorkflowDefinition = {
  title: "Leave Request Approval",
  steps: [
    {
      id: "department-head",
      title: "Department Head",
      rule: "all",
      slaHours: 24,
      approvers: [{ id: "u-head-1", name: "Dept Head" }],
    },
    {
      id: "hr-review",
      title: "HR Review",
      rule: "any",
      slaHours: 24,
      approvers: [
        { id: "u-hr-1", name: "HR Officer A" },
        { id: "u-hr-2", name: "HR Officer B" },
      ],
    },
  ],
}

export default function Example() {
  const approverOptions = [
    { value: "u-head-1", label: "Dept Head", role: "MICTO" },
    { value: "u-hr-1", label: "HR Officer A", role: "HR" },
    { value: "u-hr-2", label: "HR Officer B", role: "HR" },
  ]
  const [value, setValue] = React.useState(definition)
  const [instance, setInstance] = React.useState(() => createWorkflowInstance(definition))
  const workflow = useApprovalWorkflow({
    value,
    onChange: setValue,
    instance,
    onInstanceChange: setInstance,
    onOverdue: (step) => console.log("Overdue step:", step.id),
  })

  return (
    <div className="space-y-4">
      <ApprovalWorkflowBuilder
        value={workflow.definition}
        onChange={workflow.setDefinition}
        approverOptions={approverOptions}
        showAdvancedFields={false}
      />
      <ApprovalWorkflowTimeline
        definition={workflow.definition}
        instance={workflow.instance}
      />
      <ApprovalWorkflowActions
        definition={workflow.definition}
        instance={workflow.instance}
        approverId="u-head-1"
        onAction={workflow.submitAction}
      />
    </div>
  )
}`;

const builderProps = [
  { name: "value", type: "WorkflowDefinition", default: "undefined", description: "Controlled workflow definition object." },
  { name: "defaultValue", type: "WorkflowDefinition", default: "seeded default", description: "Initial definition for uncontrolled usage." },
  { name: "readonly", type: "boolean", default: "false", description: "Disables authoring inputs and mutation controls." },
  { name: "onChange", type: "(value) => void", default: "undefined", description: "Fires whenever the workflow definition changes." },
  { name: "onDefinitionChange", type: "(value) => void", default: "undefined", description: "Alias callback for definition updates." },
  { name: "onValidationError", type: "(errors) => void", default: "undefined", description: "Returns validation issues (missing steps, approvers, ids, etc.)." },
  { name: "approverOptions", type: "WorkflowApproverOption[]", default: "[]", description: "Static approver source rendered by SearchSelect (backend ids as values)." },
  { name: "onResolveApprovers", type: "(query) => Promise<WorkflowApproverOption[]>", default: "undefined", description: "Async approver search callback for large user directories." },
  { name: "showAdvancedFields", type: "boolean", default: "false", description: "Reveals manual `stepId` and manual approver controls for power users." },
];

const runtimeProps = [
  { name: "instance", type: "WorkflowInstanceState", default: "undefined", description: "Controlled runtime instance state." },
  { name: "defaultInstance", type: "WorkflowInstanceState", default: "auto-created", description: "Initial runtime instance in uncontrolled mode." },
  { name: "onInstanceChange", type: "(next) => void", default: "undefined", description: "Called whenever runtime state mutates." },
  { name: "onAction", type: "(action, next) => void", default: "undefined", description: "Emits on approve/reject/return/delegate decisions." },
  { name: "onStepChange", type: "(step, index) => void", default: "undefined", description: "Emits when the active step changes." },
  { name: "onOverdue", type: "(step, index, instance) => void", default: "undefined", description: "Called when current step exceeds SLA and is flagged overdue." },
];

const actionsProps = [
  { name: "definition", type: "WorkflowDefinition", default: "", description: "Workflow definition for action context." },
  { name: "instance", type: "WorkflowInstanceState", default: "", description: "Current runtime state used for action gating." },
  { name: "approverId", type: "string", default: "", description: "Actor id performing the decision action." },
  { name: "onAction", type: "(action) => void", default: "", description: "Callback to submit approve/reject/return decisions." },
];

export default async function ApprovalWorkflowPage() {
  const previewRawCode = getCode("registry/new-york/example/approval-workflow-demo.tsx");
  const previewHtml = await highlightCode(previewRawCode);
  const usageHtml = await highlightCode(usageCode, "tsx");

  const headerBadges = (
    <>
      <Badge variant="secondary" className="rounded-md px-2 py-0.5 text-[11px] uppercase tracking-wider">
        React
      </Badge>
      <Badge variant="outline" className="rounded-md px-2 py-0.5 text-[11px] uppercase tracking-wider border-primary/20 bg-primary/5 text-primary font-medium">
        Workflow
      </Badge>
      <Badge variant="outline" className="rounded-md px-2 py-0.5 text-[11px] uppercase tracking-wider border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium">
        LGU Internal
      </Badge>
    </>
  );

  return (
    <div className="mx-auto max-w-4xl space-y-12 pb-20 mt-8">
      <DocsHeader
        title="Approval Workflow"
        description="A reusable approval workflow engine with form-driven definition builder, runtime timeline, and framework-agnostic callbacks for internal LGU systems."
        badges={headerBadges}
      />

      <div className="space-y-16">
        <section className="space-y-6">
          <DocsSectionHeading
            title="Interactive Demo"
            description="Build a workflow definition, execute runtime decisions, and observe step transitions and overdue signaling."
          />
          <ComponentPreview code={previewRawCode} html={previewHtml}>
            <ApprovalWorkflowDemo />
          </ComponentPreview>
        </section>

        <section className="space-y-6">
          <DocsSectionHeading
            title="Installation"
            description="Install directly from the MICTO registry endpoint."
          />
          <div className="rounded-xl border bg-muted/40 p-1">
            <InstallCommandTabs commands={installCommands} defaultValue="pnpm" />
          </div>
        </section>

        <section className="space-y-6">
          <DocsSectionHeading
            title="Usage"
            description="Controlled workflow definition plus controlled runtime state using the `useApprovalWorkflow` hook."
          />
          <div className="overflow-hidden rounded-xl border">
            <CodeBlock code={usageCode} html={usageHtml} language="tsx" />
          </div>
        </section>

        <section className="space-y-6">
          <DocsSectionHeading title="Builder Props" description="Authoring-focused props for definition editing and validation events." />
          <PropsTable data={builderProps} />
        </section>

        <section className="space-y-6">
          <DocsSectionHeading title="Runtime Props" description="Callbacks and state channels for runtime step execution." />
          <PropsTable data={runtimeProps} />
        </section>

        <section className="space-y-6">
          <DocsSectionHeading title="Actions Props" description="Props for action decision controls tied to an active approver." />
          <PropsTable data={actionsProps} />
        </section>
      </div>
    </div>
  );
}
