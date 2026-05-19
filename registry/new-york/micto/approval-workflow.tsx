"use client";

/**
 * @title Approval Workflow
 * @description A composable approval workflow engine with form-driven builder, runtime timeline, and action controls for internal LGU systems.
 * @categories react, component, workflow
 */
import * as React from "react";
import { AlertTriangle, CheckCircle2, Clock3, Plus, Trash2, Undo2, UserPlus2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SearchSelect, type SearchSelectOption } from "@/components/micto/search-select";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

export type WorkflowStepRule = "all" | "any" | "count";
export type WorkflowStepStatus = "pending" | "in_progress" | "approved" | "rejected" | "returned";
export type WorkflowStatus = "draft" | "in_progress" | "approved" | "rejected" | "returned";
export type ApprovalDecision = "approve" | "reject" | "return" | "delegate";

export interface WorkflowApprover {
  id: string;
  name: string;
  role?: string;
}

export interface WorkflowApproverOption extends SearchSelectOption {
  role?: string;
}

export interface WorkflowStep {
  id: string;
  title: string;
  description?: string;
  approvers: WorkflowApprover[];
  rule?: WorkflowStepRule;
  minApprovals?: number;
  slaHours?: number;
}

export interface WorkflowDefinition {
  id?: string;
  title: string;
  description?: string;
  steps: WorkflowStep[];
}

export interface ApprovalAction {
  stepId: string;
  approverId: string;
  decision: ApprovalDecision;
  comment?: string;
  at?: string;
  delegatedTo?: WorkflowApprover;
}

export interface WorkflowStepState {
  stepId: string;
  status: WorkflowStepStatus;
  startedAt?: string;
  completedAt?: string;
  overdue?: boolean;
  actions: ApprovalAction[];
}

export interface WorkflowInstanceState {
  status: WorkflowStatus;
  currentStepIndex: number;
  startedAt?: string;
  completedAt?: string;
  stepStates: WorkflowStepState[];
}

export interface WorkflowValidationError {
  code: string;
  message: string;
  stepId?: string;
}

export function createWorkflowInstance(definition: WorkflowDefinition): WorkflowInstanceState {
  const now = new Date().toISOString();
  return {
    status: definition.steps.length > 0 ? "in_progress" : "draft",
    currentStepIndex: 0,
    startedAt: now,
    stepStates: definition.steps.map((step, index) => ({
      stepId: step.id,
      status: index === 0 ? "in_progress" : "pending",
      startedAt: index === 0 ? now : undefined,
      actions: [],
      overdue: false,
    })),
  };
}

export function validateWorkflowDefinition(definition: WorkflowDefinition): WorkflowValidationError[] {
  const errors: WorkflowValidationError[] = [];
  if (!definition.title.trim()) {
    errors.push({ code: "WORKFLOW_TITLE_REQUIRED", message: "Workflow title is required." });
  }

  if (!definition.steps.length) {
    errors.push({ code: "STEPS_REQUIRED", message: "At least one approval step is required." });
  }

  const seenStepIds = new Set<string>();
  definition.steps.forEach((step, idx) => {
    if (!step.id.trim()) {
      errors.push({ code: "STEP_ID_REQUIRED", message: `Step ${idx + 1} is missing an id.` });
    } else if (seenStepIds.has(step.id)) {
      errors.push({ code: "STEP_ID_DUPLICATE", message: `Step id "${step.id}" is duplicated.`, stepId: step.id });
    } else {
      seenStepIds.add(step.id);
    }

    if (!step.title.trim()) {
      errors.push({ code: "STEP_TITLE_REQUIRED", message: `Step ${idx + 1} title is required.`, stepId: step.id });
    }

    if (!step.approvers.length) {
      errors.push({ code: "STEP_APPROVERS_REQUIRED", message: `Step "${step.title || step.id}" needs at least one approver.`, stepId: step.id });
    }

    const approverIds = new Set<string>();
    step.approvers.forEach((approver) => {
      if (!approver.id.trim()) {
        errors.push({ code: "APPROVER_ID_REQUIRED", message: `Step "${step.title || step.id}" has an approver without id.`, stepId: step.id });
      } else if (approverIds.has(approver.id)) {
        errors.push({ code: "APPROVER_ID_DUPLICATE", message: `Approver "${approver.id}" is duplicated in "${step.title || step.id}".`, stepId: step.id });
      } else {
        approverIds.add(approver.id);
      }
      if (!approver.name.trim()) {
        errors.push({ code: "APPROVER_NAME_REQUIRED", message: `Approver "${approver.id || "unknown"}" must have a name.`, stepId: step.id });
      }
    });

    if ((step.rule ?? "all") === "count") {
      const min = step.minApprovals ?? 0;
      if (min < 1 || min > step.approvers.length) {
        errors.push({
          code: "MIN_APPROVALS_INVALID",
          message: `Step "${step.title || step.id}" min approvals must be between 1 and approver count.`,
          stepId: step.id,
        });
      }
    }
  });

  return errors;
}

export function isStepOverdue(step: WorkflowStep, stepState: WorkflowStepState, now = new Date()): boolean {
  if (!step.slaHours || step.slaHours <= 0 || !stepState.startedAt || stepState.status !== "in_progress") {
    return false;
  }
  const started = new Date(stepState.startedAt).getTime();
  return now.getTime() > started + step.slaHours * 60 * 60 * 1000;
}

function requiredApprovals(step: WorkflowStep): number {
  const rule = step.rule ?? "all";
  if (rule === "any") return 1;
  if (rule === "count") return Math.max(1, Math.min(step.approvers.length, step.minApprovals ?? 1));
  return step.approvers.length;
}

function countApprovals(actions: ApprovalAction[]): number {
  return actions.filter((a) => a.decision === "approve").length;
}

export function canTakeAction(
  definition: WorkflowDefinition,
  instance: WorkflowInstanceState,
  approverId: string,
  decision: ApprovalDecision
): boolean {
  const step = definition.steps[instance.currentStepIndex];
  const stepState = instance.stepStates[instance.currentStepIndex];
  if (!step || !stepState || stepState.status !== "in_progress") return false;
  const inStep = step.approvers.some((a) => a.id === approverId);
  if (decision === "delegate") return inStep;
  return inStep;
}

export function applyApprovalAction(
  definition: WorkflowDefinition,
  instance: WorkflowInstanceState,
  action: ApprovalAction
): WorkflowInstanceState {
  const steps = definition.steps;
  const next: WorkflowInstanceState = {
    ...instance,
    stepStates: instance.stepStates.map((s) => ({ ...s, actions: [...s.actions] })),
  };

  const currentStep = steps[next.currentStepIndex];
  const currentState = next.stepStates[next.currentStepIndex];
  if (!currentStep || !currentState || currentState.stepId !== action.stepId || currentState.status !== "in_progress") {
    return instance;
  }

  const actionAt = action.at ?? new Date().toISOString();
  currentState.actions.push({ ...action, at: actionAt });

  if (action.decision === "reject") {
    currentState.status = "rejected";
    currentState.completedAt = actionAt;
    next.status = "rejected";
    next.completedAt = actionAt;
    return next;
  }

  if (action.decision === "return") {
    currentState.status = "returned";
    currentState.completedAt = actionAt;
    next.status = "returned";
    next.completedAt = actionAt;
    return next;
  }

  if (action.decision === "delegate" && action.delegatedTo) {
    if (!currentStep.approvers.some((a) => a.id === action.delegatedTo?.id)) {
      currentStep.approvers = [...currentStep.approvers, action.delegatedTo];
    }
    return next;
  }

  if (action.decision === "approve") {
    const approvals = countApprovals(currentState.actions);
    if (approvals >= requiredApprovals(currentStep)) {
      currentState.status = "approved";
      currentState.completedAt = actionAt;

      const nextIdx = next.currentStepIndex + 1;
      if (nextIdx >= steps.length) {
        next.status = "approved";
        next.completedAt = actionAt;
      } else {
        next.currentStepIndex = nextIdx;
        next.status = "in_progress";
        const nextStep = next.stepStates[nextIdx];
        if (nextStep) {
          nextStep.status = "in_progress";
          nextStep.startedAt = nextStep.startedAt ?? actionAt;
        }
      }
    }
  }

  return next;
}

function defaultStep(index: number): WorkflowStep {
  return {
    id: `step-${index + 1}`,
    title: `Step ${index + 1}`,
    description: "",
    rule: "all",
    minApprovals: 1,
    slaHours: 24,
    approvers: [
      {
        id: `approver-${index + 1}-1`,
        name: "Approver Name",
        role: "Office",
      },
    ],
  };
}

function statusBadgeVariant(status: WorkflowStepStatus | WorkflowStatus): "default" | "secondary" | "destructive" | "outline" {
  if (status === "approved") return "default";
  if (status === "rejected") return "destructive";
  if (status === "returned") return "outline";
  return "secondary";
}

export interface UseApprovalWorkflowOptions {
  value?: WorkflowDefinition;
  defaultValue?: WorkflowDefinition;
  onChange?: (value: WorkflowDefinition) => void;
  instance?: WorkflowInstanceState;
  defaultInstance?: WorkflowInstanceState;
  onInstanceChange?: (next: WorkflowInstanceState) => void;
  onDefinitionChange?: (value: WorkflowDefinition) => void;
  onAction?: (action: ApprovalAction, next: WorkflowInstanceState) => void;
  onStepChange?: (step: WorkflowStep, index: number) => void;
  onOverdue?: (step: WorkflowStep, index: number, instance: WorkflowInstanceState) => void;
  onValidationError?: (errors: WorkflowValidationError[]) => void;
  validateDefinition?: (definition: WorkflowDefinition) => WorkflowValidationError[];
}

export function useApprovalWorkflow({
  value,
  defaultValue,
  onChange,
  instance,
  defaultInstance,
  onInstanceChange,
  onDefinitionChange,
  onAction,
  onStepChange,
  onOverdue,
  onValidationError,
  validateDefinition,
}: UseApprovalWorkflowOptions) {
  const isControlledDefinition = value !== undefined;
  const isControlledInstance = instance !== undefined;

  const [internalDefinition, setInternalDefinition] = React.useState<WorkflowDefinition>(
    defaultValue ?? {
      title: "Document Approval Workflow",
      description: "Internal workflow for office approvals.",
      steps: [defaultStep(0)],
    }
  );

  const effectiveDefinition = isControlledDefinition ? (value as WorkflowDefinition) : internalDefinition;

  const [internalInstance, setInternalInstance] = React.useState<WorkflowInstanceState>(
    defaultInstance ?? createWorkflowInstance(effectiveDefinition)
  );

  const effectiveInstance = isControlledInstance ? (instance as WorkflowInstanceState) : internalInstance;

  const setDefinition = React.useCallback(
    (next: WorkflowDefinition) => {
      if (!isControlledDefinition) setInternalDefinition(next);
      onChange?.(next);
      onDefinitionChange?.(next);
      const errors = (validateDefinition ?? validateWorkflowDefinition)(next);
      if (errors.length > 0) onValidationError?.(errors);
    },
    [isControlledDefinition, onChange, onDefinitionChange, onValidationError, validateDefinition]
  );

  const setInstance = React.useCallback(
    (next: WorkflowInstanceState) => {
      if (!isControlledInstance) setInternalInstance(next);
      onInstanceChange?.(next);
    },
    [isControlledInstance, onInstanceChange]
  );

  const submitAction = React.useCallback(
    (action: ApprovalAction) => {
      const next = applyApprovalAction(effectiveDefinition, effectiveInstance, action);
      if (next !== effectiveInstance) {
        setInstance(next);
        onAction?.(action, next);
        const step = effectiveDefinition.steps[next.currentStepIndex];
        if (step) onStepChange?.(step, next.currentStepIndex);
      }
    },
    [effectiveDefinition, effectiveInstance, onAction, onStepChange, setInstance]
  );

  React.useEffect(() => {
    const step = effectiveDefinition.steps[effectiveInstance.currentStepIndex];
    const stepState = effectiveInstance.stepStates[effectiveInstance.currentStepIndex];
    if (!step || !stepState) return;
    const overdue = isStepOverdue(step, stepState);
    if (overdue && !stepState.overdue) {
      const next = {
        ...effectiveInstance,
        stepStates: effectiveInstance.stepStates.map((s, idx) =>
          idx === effectiveInstance.currentStepIndex ? { ...s, overdue: true } : s
        ),
      };
      setInstance(next);
      onOverdue?.(step, effectiveInstance.currentStepIndex, next);
    }
  }, [effectiveDefinition, effectiveInstance, onOverdue, setInstance]);

  return {
    definition: effectiveDefinition,
    instance: effectiveInstance,
    setDefinition,
    setInstance,
    submitAction,
  };
}

export interface ApprovalWorkflowBuilderProps extends UseApprovalWorkflowOptions {
  readonly?: boolean;
  showAdvancedFields?: boolean;
  approverOptions?: WorkflowApproverOption[];
  onResolveApprovers?: (query: string) => Promise<WorkflowApproverOption[]>;
  approverSearchPlaceholder?: string;
  className?: string;
}

export function ApprovalWorkflowBuilder({
  readonly = false,
  showAdvancedFields = false,
  approverOptions = [],
  onResolveApprovers,
  approverSearchPlaceholder = "Search approvers...",
  className,
  ...options
}: ApprovalWorkflowBuilderProps) {
  const { definition, setDefinition } = useApprovalWorkflow(options);

  const updateStep = (idx: number, partial: Partial<WorkflowStep>) => {
    const steps = definition.steps.map((step, index) => (index === idx ? { ...step, ...partial } : step));
    setDefinition({ ...definition, steps });
  };

  const slugify = (value: string) =>
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const addStep = () => {
    setDefinition({
      ...definition,
      steps: [...definition.steps, defaultStep(definition.steps.length)],
    });
  };

  const removeStep = (idx: number) => {
    setDefinition({
      ...definition,
      steps: definition.steps.filter((_, i) => i !== idx),
    });
  };

  const addApprover = (stepIdx: number) => {
    const step = definition.steps[stepIdx];
    if (!step) return;
    updateStep(stepIdx, {
      approvers: [
        ...step.approvers,
        {
          id: `approver-${stepIdx + 1}-${step.approvers.length + 1}`,
          name: "Approver Name",
          role: "Office",
        },
      ],
    });
  };

  return (
    <div className={cn("space-y-4", className)}>
      <Card className="p-4 space-y-3">
        <div className="space-y-1">
          <Label htmlFor="workflow-title">Workflow Title</Label>
          <Input
            id="workflow-title"
            value={definition.title}
            onChange={(e) => setDefinition({ ...definition, title: e.target.value })}
            disabled={readonly}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="workflow-description">Description</Label>
          <Textarea
            id="workflow-description"
            value={definition.description ?? ""}
            onChange={(e) => setDefinition({ ...definition, description: e.target.value })}
            disabled={readonly}
            className="min-h-20"
          />
        </div>
      </Card>

      {definition.steps.map((step, idx) => (
        <Card key={step.id} className="p-4 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">{step.title || `Step ${idx + 1}`}</p>
              <p className="text-xs text-muted-foreground">Configure approvers, rule, and SLA.</p>
            </div>
            {!readonly && (
              <Button variant="ghost" size="icon" onClick={() => removeStep(idx)} disabled={definition.steps.length <= 1}>
                <Trash2 className="size-4" />
              </Button>
            )}
          </div>
          <Separator />
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <Label>Step Title</Label>
              <Input
                value={step.title}
                onChange={(e) => {
                  const title = e.target.value;
                  updateStep(idx, {
                    title,
                    ...(showAdvancedFields ? {} : { id: slugify(title) || `step-${idx + 1}` }),
                  });
                }}
                disabled={readonly}
              />
            </div>
            {showAdvancedFields ? (
              <div className="space-y-1">
                <Label>Step Id</Label>
                <Input value={step.id} onChange={(e) => updateStep(idx, { id: e.target.value })} disabled={readonly} />
              </div>
            ) : null}
            <div className="space-y-1 sm:col-span-2">
              <Label>Step Description</Label>
              <Textarea
                value={step.description ?? ""}
                onChange={(e) => updateStep(idx, { description: e.target.value })}
                disabled={readonly}
                className="min-h-16"
              />
            </div>
            <div className="space-y-1">
              <Label>Approval Rule</Label>
              <Select
                value={step.rule ?? "all"}
                onValueChange={(v) => updateStep(idx, { rule: v as WorkflowStepRule })}
                disabled={readonly}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All approvers</SelectItem>
                  <SelectItem value="any">Any approver</SelectItem>
                  <SelectItem value="count">Count-based</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>SLA Hours</Label>
              <Input
                type="number"
                min={1}
                value={step.slaHours ?? 24}
                onChange={(e) => updateStep(idx, { slaHours: Number(e.target.value || 0) })}
                disabled={readonly}
              />
            </div>
            {(step.rule ?? "all") === "count" && (
              <div className="space-y-1">
                <Label>Minimum Approvals</Label>
                <Input
                  type="number"
                  min={1}
                  max={step.approvers.length || 1}
                  value={step.minApprovals ?? 1}
                  onChange={(e) => updateStep(idx, { minApprovals: Number(e.target.value || 1) })}
                  disabled={readonly}
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase text-muted-foreground">Approvers</p>
            </div>
            <SearchSelect
              multiple
              disabled={readonly}
              options={approverOptions}
              onSearch={onResolveApprovers}
              value={step.approvers.map((a) => a.id)}
              onChange={(values: string[] | string) => {
                const selected = Array.isArray(values) ? values : values ? [values] : [];
                const optionMap = new Map(approverOptions.map((opt) => [opt.value, opt]));
                updateStep(idx, {
                  approvers: selected.map((id) => {
                    const existing = step.approvers.find((a) => a.id === id);
                    if (existing) return existing;
                    const option = optionMap.get(id);
                    return {
                      id,
                      name: option?.label ?? id,
                      role: option?.role,
                    };
                  }),
                });
              }}
              placeholder="Assign approvers..."
              searchPlaceholder={approverSearchPlaceholder}
            />
            <div className="flex flex-wrap gap-1.5">
              {step.approvers.map((approver) => (
                <Badge key={approver.id} variant="secondary" className="gap-1">
                  <span>{approver.name}</span>
                  {approver.role ? <span className="text-[10px] text-muted-foreground">({approver.role})</span> : null}
                </Badge>
              ))}
            </div>
            {showAdvancedFields && !readonly ? (
              <div className="flex items-center justify-end">
                <Button variant="outline" size="sm" className="h-8 gap-1.5" onClick={() => addApprover(idx)}>
                  <UserPlus2 className="size-3.5" />
                  Add Manual Approver
                </Button>
              </div>
            ) : null}
          </div>
        </Card>
      ))}
      {!readonly && (
        <Button variant="secondary" className="w-full gap-1.5" onClick={addStep}>
          <Plus className="size-4" />
          Add Step
        </Button>
      )}
    </div>
  );
}

export interface ApprovalWorkflowTimelineProps {
  definition: WorkflowDefinition;
  instance: WorkflowInstanceState;
  className?: string;
}

export function ApprovalWorkflowTimeline({
  definition,
  instance,
  className,
}: ApprovalWorkflowTimelineProps) {
  return (
    <Card className={cn("p-4 space-y-3", className)}>
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold">{definition.title}</p>
          <p className="text-xs text-muted-foreground">{definition.description || "Workflow timeline view."}</p>
        </div>
        <Badge variant={statusBadgeVariant(instance.status)}>{instance.status.replace("_", " ")}</Badge>
      </div>
      <Separator />
      <div className="space-y-3">
        {definition.steps.map((step, idx) => {
          const state = instance.stepStates[idx];
          const current = idx === instance.currentStepIndex;
          const overdue = !!state?.overdue;
          return (
            <div key={step.id} className="rounded-md border p-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">{step.title}</p>
                  <p className="text-xs text-muted-foreground">{step.description || "No description"}</p>
                </div>
                <div className="flex items-center gap-2">
                  {current && state?.status === "in_progress" && <Clock3 className="size-4 text-primary" />}
                  {overdue && <AlertTriangle className="size-4 text-amber-500" />}
                  {state?.status === "approved" && <CheckCircle2 className="size-4 text-emerald-600" />}
                  {state?.status === "rejected" && <XCircle className="size-4 text-destructive" />}
                  {state?.status === "returned" && <Undo2 className="size-4 text-orange-500" />}
                  <Badge variant={statusBadgeVariant(state?.status ?? "pending")}>{(state?.status ?? "pending").replace("_", " ")}</Badge>
                </div>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                Rule: <span className="font-medium text-foreground">{step.rule ?? "all"}</span>
                {" • "}
                Approvers: <span className="font-medium text-foreground">{step.approvers.length}</span>
                {" • "}
                SLA: <span className="font-medium text-foreground">{step.slaHours ?? 24}h</span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

export interface ApprovalWorkflowActionsProps {
  definition: WorkflowDefinition;
  instance: WorkflowInstanceState;
  approverId: string;
  onAction: (action: ApprovalAction) => void;
  disabled?: boolean;
  className?: string;
}

export function ApprovalWorkflowActions({
  definition,
  instance,
  approverId,
  onAction,
  disabled = false,
  className,
}: ApprovalWorkflowActionsProps) {
  const step = definition.steps[instance.currentStepIndex];
  if (!step) return null;
  const canAct = !disabled && canTakeAction(definition, instance, approverId, "approve");

  const submit = (decision: ApprovalDecision) => {
    if (!canAct) return;
    onAction({
      stepId: step.id,
      approverId,
      decision,
      at: new Date().toISOString(),
    });
  };

  return (
    <Card className={cn("p-4", className)}>
      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" onClick={() => submit("approve")} disabled={!canAct}>
          Approve
        </Button>
        <Button size="sm" variant="destructive" onClick={() => submit("reject")} disabled={!canAct}>
          Reject
        </Button>
        <Button size="sm" variant="outline" onClick={() => submit("return")} disabled={!canAct}>
          Return
        </Button>
      </div>
    </Card>
  );
}
