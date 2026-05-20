"use client";

import * as React from "react";
import {
  ApprovalWorkflowActions,
  ApprovalWorkflowBuilder,
  ApprovalWorkflowTimeline,
  type WorkflowApproverOption,
  type WorkflowDefinition,
  type WorkflowInstanceState,
  createWorkflowInstance,
  useApprovalWorkflow,
} from "@/components/micto/approval-workflow";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const seedDefinition: WorkflowDefinition = {
  title: "Purchase Request Approval",
  description: "Route PR records across office, budget, and final signatory approvals.",
  steps: [
    {
      id: "dept-head",
      title: "Department Head Review",
      description: "Validate completeness of request details.",
      rule: "all",
      slaHours: 24,
      approvers: [
        { id: "u-head-1", name: "Department Head", role: "MICTO" },
      ],
    },
    {
      id: "budget",
      title: "Budget Validation",
      description: "Check allotment availability and compliance.",
      rule: "any",
      slaHours: 12,
      approvers: [
        { id: "u-budget-1", name: "Budget Officer A", role: "Budget" },
        { id: "u-budget-2", name: "Budget Officer B", role: "Budget" },
      ],
    },
    {
      id: "lce",
      title: "Final Approval",
      description: "Final executive sign-off.",
      rule: "all",
      slaHours: 48,
      approvers: [{ id: "u-lce-1", name: "Municipal Mayor", role: "LCE" }],
    },
  ],
};

const approverDirectory: WorkflowApproverOption[] = [
  { value: "u-head-1", label: "Department Head", role: "MICTO", description: "Municipal ICT Office" },
  { value: "u-budget-1", label: "Budget Officer A", role: "Budget", description: "Budget Office" },
  { value: "u-budget-2", label: "Budget Officer B", role: "Budget", description: "Budget Office" },
  { value: "u-lce-1", label: "Municipal Mayor", role: "LCE", description: "Local Chief Executive" },
];

export default function ApprovalWorkflowDemo() {
  const [definition, setDefinition] = React.useState(seedDefinition);
  const [instance, setInstance] = React.useState<WorkflowInstanceState>(() =>
    createWorkflowInstance(seedDefinition)
  );
  const [activeApprover, setActiveApprover] = React.useState("u-head-1");
  const [logs, setLogs] = React.useState<string[]>([]);

  const workflow = useApprovalWorkflow({
    value: definition,
    onChange: setDefinition,
    instance,
    onInstanceChange: setInstance,
    onAction: (action, next) => {
      setLogs((prev) => [
        `${action.approverId} -> ${action.decision} (${action.stepId})`,
        ...prev,
      ]);
      setInstance(next);
    },
    onOverdue: (step) => {
      setLogs((prev) => [`OVERDUE: ${step.title}`, ...prev]);
    },
  });

  const reset = () => {
    const fresh = createWorkflowInstance(definition);
    setInstance(fresh);
    setLogs([]);
  };

  return (
    <div className="w-full space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <ApprovalWorkflowBuilder
          value={workflow.definition}
          onChange={workflow.setDefinition}
          instance={workflow.instance}
          onInstanceChange={workflow.setInstance}
          approverOptions={approverDirectory}
          onResolveApprovers={async (query) =>
            approverDirectory.filter((item) =>
              item.label.toLowerCase().includes(query.toLowerCase())
            )
          }
        />

        <div className="space-y-4">
          <ApprovalWorkflowTimeline definition={workflow.definition} instance={workflow.instance} />
          <Card className="p-4 space-y-3">
            <p className="text-xs font-medium text-muted-foreground uppercase">Runtime Controls</p>
            <div className="flex flex-wrap gap-2">
              {workflow.definition.steps.flatMap((step) =>
                step.approvers.map((approver) => (
                  <Button
                    key={approver.id}
                    variant={activeApprover === approver.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveApprover(approver.id)}
                  >
                    {approver.name}
                  </Button>
                ))
              )}
            </div>
            <ApprovalWorkflowActions
              definition={workflow.definition}
              instance={workflow.instance}
              approverId={activeApprover}
              onAction={workflow.submitAction}
            />
            <Button variant="secondary" size="sm" onClick={reset}>
              Reset Instance
            </Button>
          </Card>

          <Card className="p-4 space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase">Action Logs</p>
            {logs.length === 0 ? (
              <p className="text-sm text-muted-foreground">No actions yet.</p>
            ) : (
              <ul className="space-y-1 text-sm">
                {logs.slice(0, 6).map((line, i) => (
                  <li key={`${line}-${i}`} className="font-mono text-xs">
                    {line}
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
