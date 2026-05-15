"use client";

import * as React from "react";
import {
  DocumentViewer,
  DocumentViewerToolbar,
  DocumentViewerCanvas,
  DocumentViewerSidebar,
  DocumentViewerDialog,
} from "@/components/ui/document-viewer";
import { ActivityTimelineList } from "@/components/ui/activity-timeline";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Stamp, Eye, FileSpreadsheet, Download } from "lucide-react";

// ─── MOCK DATA: Routing Audit Trail ───────────────────────────────────────────

const ROUTING_HISTORY = [
  {
    id: 1,
    title: "Ordinance Authored",
    description: "Resolution drafted by Sangguniang Bayan Committee on ICT.",
    timestamp: "Oct 20, 2026",
    status: "completed" as const,
    actor: { name: "Coun. Juan Dela Cruz", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80", role: "Author" },
  },
  {
    id: 2,
    title: "1st Reading Approval",
    description: "Approved during the 24th Regular Session.",
    timestamp: "Oct 22, 2026",
    status: "completed" as const,
  },
  {
    id: 3,
    title: "Pending Mayoral Signature",
    description: "Transmitted to the Office of the Municipal Mayor for enactment.",
    timestamp: "Oct 24, 2026",
    status: "in-progress" as const,
    metadata: [<Badge key="1" variant="secondary" className="bg-amber-500/10 text-amber-600 border border-amber-500/20">Action Required</Badge>],
  },
];

export default function DocumentViewerDemo() {
  const [signed, setSigned] = React.useState(false);

  const handleDownload = () => alert("Downloading certified copy...");
  const handlePrint = () => alert("Initializing secure print spooler...");

  return (
    <div className="w-full max-w-5xl mx-auto space-y-12 py-6">

      {/* ── Example 1: Full DMS Ordinance Interface ── */}
      <section className="space-y-4">
        <div>
          <h3 className="text-sm font-bold text-foreground">Municipal Ordinance Viewer (Full DMS Mode)</h3>
          <p className="text-xs text-muted-foreground">
            Complete workspace view with integrated metadata sidebar and endorsement workflow buttons.
          </p>
        </div>

        <DocumentViewer
          url="/assets/files/ra-12254.pdf"
          title="Republic Act No. 12254"
          onDownload={handleDownload}
          onPrint={handlePrint}
        >
          <DocumentViewerToolbar
            actions={
              <Button
                size="sm"
                className="h-8 text-xs gap-1.5"
                onClick={() => setSigned(true)}
                disabled={signed}
              >
                <Stamp className="size-3.5" />
                {signed ? "Signed & Enacted" : "Sign & Enact"}
              </Button>
            }
          />
          <div className="flex flex-1 overflow-y-auto md:overflow-hidden flex-col md:flex-row h-full max-h-full min-h-0">
            <DocumentViewerCanvas />

            <DocumentViewerSidebar width="w-full md:w-80" className="space-y-6">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                  Document Metadata
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-border/40">
                    <span className="text-muted-foreground">Tracking ID:</span>
                    <span className="font-mono font-medium">RA-12254</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/40">
                    <span className="text-muted-foreground">Classification:</span>
                    <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-600 border-blue-200">Republic Act</Badge>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/40">
                    <span className="text-muted-foreground">Pages:</span>
                    <span className="font-mono font-medium">14 Pages</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-muted-foreground">Security:</span>
                    <span className="text-emerald-600 font-medium">🔒 Encrypted / Signed</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                  Routing Audit Trail
                </h4>
                <ActivityTimelineList items={ROUTING_HISTORY} orientation="vertical" />
              </div>
            </DocumentViewerSidebar>
          </div>
        </DocumentViewer>
      </section>

      {/* ── Example 2: Scanned Image Preview (Leave Form / Receipts) ── */}
      <section className="space-y-4">
        <div>
          <h3 className="text-sm font-bold text-foreground">Scanned Document Preview (Image Mode)</h3>
          <p className="text-xs text-muted-foreground">
            Provides native zoom and 90° rotation controls for scanned citizen submissions or receipts.
          </p>
        </div>

        <DocumentViewer
          url="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80"
          title="Form 6: Application for Leave (Scanned Copy)"
          initialScale={0.8}
        >
          <DocumentViewerToolbar showSidebarToggle={false} />
          <div className="flex flex-1 overflow-hidden">
            <DocumentViewerCanvas className="bg-muted/30" />
          </div>
        </DocumentViewer>
      </section>

      {/* ── Example 3: Modal Lightbox Trigger ── */}
      <section className="space-y-4">
        <div>
          <h3 className="text-sm font-bold text-foreground">Modal / Lightbox Overlay</h3>
          <p className="text-xs text-muted-foreground">
            Launch the document viewer inside a full-screen popup dialog. Perfect for compact lists.
          </p>
        </div>

        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <FileSpreadsheet className="size-4.5 text-primary" />
              Municipal Annual Procurement Plan 2026
            </CardTitle>
            <CardDescription className="text-xs">
              Consolidated budget allocations across all LGU departments.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-3">
            <DocumentViewerDialog
              trigger={
                <Button size="sm" variant="secondary" className="h-9 px-4 gap-2 text-xs font-medium">
                  <Eye className="size-4" />
                  Open in Lightbox
                </Button>
              }
              url="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1200&auto=format&fit=crop&q=80"
              title="Consolidated Procurement Plan 2026"
            >
              <DocumentViewerToolbar />
              <div className="flex flex-1 overflow-y-auto md:overflow-hidden flex-col md:flex-row h-full max-h-full min-h-0">
                <DocumentViewerCanvas />
                <DocumentViewerSidebar width="w-full md:w-72">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Remarks</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Certified true copy uploaded by Municipal Budget Office. Bidding scheduled for Q1 2026.
                  </p>
                </DocumentViewerSidebar>
              </div>
            </DocumentViewerDialog>

            <Button size="sm" variant="outline" className="h-9 px-4 gap-2 text-xs font-medium" onClick={handleDownload}>
              <Download className="size-4" />
              Direct Download
            </Button>
          </CardContent>
        </Card>
      </section>

    </div>
  );
}
