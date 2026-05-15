"use client";

import * as React from "react";
import {
  ActivityTimelineList,
  ActivityTimeline,
  ActivityTimelineItem,
  ActivityTimelineTrack,
  ActivityTimelineConnector,
  ActivityTimelineDot,
  ActivityTimelineContent,
  type ActivityTimelineItemData,
} from "@/components/ui/activity-timeline";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, UserCheck, RefreshCw, AlertTriangle } from "lucide-react";

// ─── MOCK DATA: Document Routing History ──────────────────────────────────────

const DOCUMENT_HISTORY: ActivityTimelineItemData[] = [
  {
    id: 1,
    title: "Purchase Request Submitted",
    description: "PR-2026-009 submitted for IT Equipment procurement (20x Laptops).",
    timestamp: "Oct 24, 2026 · 09:15 AM",
    status: "completed",
    actor: {
      name: "Nehry Dedoro",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
      role: "Lead Architect",
    },
    metadata: [
      <Badge key="b1" variant="secondary" className="text-[10px]">Budget: ICT Fund</Badge>,
      <Badge key="b2" variant="outline" className="text-[10px] text-blue-600 border-blue-200 bg-blue-50">Priority: High</Badge>,
    ],
    attachments: [
      { label: "Purchase_Request_Specs.pdf", url: "#", onClick: () => alert("Downloading PR Specs...") },
    ],
  },
  {
    id: 2,
    title: "Endorsed by Department Head",
    description: "Reviewed and endorsed by Municipal ICT Officer. Verified itemized budget allocation.",
    timestamp: "Oct 24, 2026 · 11:30 AM",
    status: "completed",
    actor: {
      name: "Clara Bautista",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80",
      role: "Department Head",
    },
    metadata: [<Badge key="b3" className="bg-emerald-500 text-white text-[10px]">Endorsed</Badge>],
  },
  {
    id: 3,
    title: "Pending Budget Clearance",
    description: "Forwarded to Municipal Budget Office for CAO (Certificate of Availability of Funds).",
    timestamp: "Oct 25, 2026 · 02:00 PM",
    status: "in-progress",
    actor: {
      name: "Reyna Garcia",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
      role: "Budget Officer",
    },
    metadata: [<Badge key="b4" variant="secondary" className="text-[10px] animate-pulse bg-amber-500/10 text-amber-600 border border-amber-500/20">In Review</Badge>],
  },
  {
    id: 4,
    title: "Mayor's Final Approval",
    description: "Awaiting final electronic signature from Office of the Municipal Mayor.",
    status: "pending",
  },
  {
    id: 5,
    title: "Release & Bidding",
    description: "Endorsed to BAC (Bids and Awards Committee) for posting on PhilGEPS.",
    status: "muted",
  },
];

// ─── MOCK DATA: Leave Stepper ─────────────────────────────────────────────────

const LEAVE_STEPS = [
  { id: 1, title: "Filing", desc: "Submit Form 6" },
  { id: 2, title: "HRMO Review", desc: "Leave credits check" },
  { id: 3, title: "Supervisor", desc: "Workload clearance" },
  { id: 4, title: "Approved", desc: "Final notice" },
];

// ─── Main Demo Component ──────────────────────────────────────────────────────

export default function ActivityTimelineDemo() {
  const [currentStep, setCurrentStep] = React.useState(2);

  const getStepStatus = (idx: number) => {
    if (idx < currentStep) return "completed";
    if (idx === currentStep) return "in-progress";
    return "pending";
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-12 py-6">

      {/* ── Example 1: Document Routing History (Data-Driven Shorthand) ── */}
      <section className="space-y-4">
        <div>
          <h3 className="text-sm font-bold text-foreground">Document Routing Audit Trail</h3>
          <p className="text-xs text-muted-foreground">
            Using <code className="font-mono bg-muted px-1.5 py-0.5 rounded text-[11px]">&lt;ActivityTimelineList items=&#123;DOCUMENT_HISTORY&#125; /&gt;</code> shorthand.
          </p>
        </div>

        <Card className="border-border/60 shadow-sm overflow-hidden">
          <CardHeader className="bg-muted/30 pb-4 border-b border-border/40">
            <div className="flex flex-col sm:flex-row sm:justify-between items-start gap-3">
              <div>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <FileText className="size-4.5 text-primary" />
                  Routing History: PR-2026-009
                </CardTitle>
                <CardDescription className="text-xs">
                  Real-time document lifecycle tracker for Municipal ICT Office procurement.
                </CardDescription>
              </div>
              <Badge variant="outline" className="bg-background shadow-xs font-mono text-xs py-1 shrink-0">
                Status: In Budget Review
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6 px-6">
            <ActivityTimelineList items={DOCUMENT_HISTORY} orientation="vertical" />
          </CardContent>
        </Card>
      </section>

      {/* ── Example 2: Horizontal Stepper ── */}
      <section className="space-y-4">
        <div className="flex justify-between items-end">
          <div>
            <h3 className="text-sm font-bold text-foreground">Interactive Leave Approval Stepper</h3>
            <p className="text-xs text-muted-foreground">
              Horizontal orientation for multi-step wizards or application progress.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="h-8 text-xs font-medium"
              onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
              disabled={currentStep === 0}
            >
              Previous Step
            </Button>
            <Button
              size="sm"
              className="h-8 text-xs font-medium"
              onClick={() => setCurrentStep((s) => Math.min(LEAVE_STEPS.length - 1, s + 1))}
              disabled={currentStep === LEAVE_STEPS.length - 1}
            >
              Next Step
            </Button>
          </div>
        </div>

        <Card className="border-border/60 shadow-sm">
          <CardContent className="pt-8 pb-4 px-6 overflow-x-auto">
            <ActivityTimelineList
              orientation="horizontal"
              items={LEAVE_STEPS.map((step, idx) => ({
                id: step.id,
                title: step.title,
                description: step.desc,
                status: getStepStatus(idx),
              }))}
            />
          </CardContent>
        </Card>
      </section>

      {/* ── Example 3: Composable Primitives (Custom Icons & Dense Layout) ── */}
      <section className="space-y-4">
        <div>
          <h3 className="text-sm font-bold text-foreground">Composable API & Custom Dots</h3>
          <p className="text-xs text-muted-foreground">
            Using individual <code className="font-mono bg-muted px-1.5 py-0.5 rounded text-[11px]">&lt;ActivityTimelineItem&gt;</code> nodes for absolute layout control.
          </p>
        </div>

        <Card className="border-border/60 shadow-sm">
          <CardContent className="p-6">
            <ActivityTimeline orientation="vertical" className="gap-2">
              <ActivityTimelineItem status="completed">
                <ActivityTimelineTrack>
                  <ActivityTimelineConnector />
                  <ActivityTimelineDot className="border-blue-500 bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                    <UserCheck className="size-4" />
                  </ActivityTimelineDot>
                </ActivityTimelineTrack>
                <ActivityTimelineContent className="pb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold">User Authentication Success</span>
                    <span className="text-[10px] font-mono text-muted-foreground">10:02:14 AM</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">IP: 192.168.1.45 via HRMO Biometrics Gateway</p>
                </ActivityTimelineContent>
              </ActivityTimelineItem>

              <ActivityTimelineItem status="error">
                <ActivityTimelineTrack>
                  <ActivityTimelineConnector />
                  <ActivityTimelineDot className="border-red-500 bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400">
                    <AlertTriangle className="size-4" />
                  </ActivityTimelineDot>
                </ActivityTimelineTrack>
                <ActivityTimelineContent className="pb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-destructive">Database Sync Failure</span>
                    <span className="text-[10px] font-mono text-muted-foreground">10:05:00 AM</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">Timeout waiting for MSWD Angono Cloud Replica.</p>
                </ActivityTimelineContent>
              </ActivityTimelineItem>

              <ActivityTimelineItem status="in-progress" isLast>
                <ActivityTimelineTrack>
                  <ActivityTimelineConnector />
                  <ActivityTimelineDot className="border-amber-500 bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400 animate-spin">
                    <RefreshCw className="size-3.5" />
                  </ActivityTimelineDot>
                </ActivityTimelineTrack>
                <ActivityTimelineContent>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400">Automatic Retry Attempt #2</span>
                    <span className="text-[10px] font-mono text-muted-foreground">Just now</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">Re-establishing handshake protocol...</p>
                </ActivityTimelineContent>
              </ActivityTimelineItem>
            </ActivityTimeline>
          </CardContent>
        </Card>
      </section>

    </div>
  );
}
