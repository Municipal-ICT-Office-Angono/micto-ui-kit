"use client";

import * as React from "react";
import { PermissionProvider, Can, RoleGuard } from "@/components/ui/permission-guard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Layout, ShieldAlert, Key, UserCheck, Trash2, Edit, Plus, RefreshCw } from "lucide-react";

export default function PermissionGuardDemo() {
  // Simulator Local States
  const [hasEditPerm, setHasEditPerm] = React.useState(true);
  const [hasDeletePerm, setHasDeletePerm] = React.useState(false);
  const [hasAdminRole, setHasAdminRole] = React.useState(false);

  // Derive permissions & roles lists dynamically for our Provider
  const activePermissions = React.useMemo(() => {
    const list = ["documents.view"]; // Everyone can view
    if (hasEditPerm) list.push("documents.edit");
    if (hasDeletePerm) list.push("documents.delete");
    return list;
  }, [hasEditPerm, hasDeletePerm]);

  const activeRoles = React.useMemo(() => {
    return hasAdminRole ? ["admin"] : ["officer"];
  }, [hasAdminRole]);

  return (
    <div className="w-full max-w-2xl mx-auto py-2 space-y-8">
      {/* 1. INTERACTIVE PERMISSION SIMULATOR CONTROLS */}
      <div className="space-y-4 rounded-xl border border-primary/20 bg-primary/5 p-6 shadow-sm">
        <div className="flex items-center gap-2.5">
          <ShieldAlert className="h-5 w-5 text-primary" />
          <div>
            <h4 className="text-sm font-semibold tracking-tight text-foreground">
              MICTO RBAC Permission Simulator
            </h4>
            <p className="text-xs text-muted-foreground">
              Toggle roles and action keys below to see the gated layout adapt instantly.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-primary/10">
          {/* Toggle A: Edit */}
          <label className="flex items-center gap-3 cursor-pointer select-none group">
            <input
              type="checkbox"
              checked={hasEditPerm}
              onChange={(e) => setHasEditPerm(e.target.checked)}
              className="rounded border-input text-primary focus:ring-primary h-4 w-4"
            />
            <div className="leading-none">
              <p className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                documents.edit
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Permission Key</p>
            </div>
          </label>

          {/* Toggle B: Delete */}
          <label className="flex items-center gap-3 cursor-pointer select-none group">
            <input
              type="checkbox"
              checked={hasDeletePerm}
              onChange={(e) => setHasDeletePerm(e.target.checked)}
              className="rounded border-input text-primary focus:ring-primary h-4 w-4"
            />
            <div className="leading-none">
              <p className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                documents.delete
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Permission Key</p>
            </div>
          </label>

          {/* Toggle C: Admin Role */}
          <label className="flex items-center gap-3 cursor-pointer select-none group">
            <input
              type="checkbox"
              checked={hasAdminRole}
              onChange={(e) => setHasAdminRole(e.target.checked)}
              className="rounded border-input text-primary focus:ring-primary h-4 w-4"
            />
            <div className="leading-none">
              <p className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                admin
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5">User Role Class</p>
            </div>
          </label>
        </div>

        {/* Console state bar */}
        <div className="flex flex-wrap items-center gap-2 pt-2 text-[10px] font-mono text-muted-foreground">
          <span>Active Session:</span>
          <Badge variant="outline" className="text-[9px] py-0 px-1 rounded-sm uppercase tracking-wider font-semibold">
            Role: {activeRoles[0]}
          </Badge>
          <span>Keys:</span>
          {activePermissions.map((p) => (
            <code key={p} className="bg-background px-1 py-0.5 rounded text-[9px] border text-primary">
              {p}
            </code>
          ))}
        </div>
      </div>

      {/* 2. THE PERMISSION DRIVEN CONTENT AREA */}
      <PermissionProvider permissions={activePermissions} roles={activeRoles}>
        <div className="space-y-6">
          
          {/* Row A: Inline Action Buttons (Hide and Disable gates) */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-4">
            <div className="flex flex-col gap-1.5">
              <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Document Actions (Hide / Disable Modes)
              </h5>
              <p className="text-xs text-muted-foreground">
                The delete button uses <code className="font-mono bg-muted px-1 py-0.5 rounded">mode="hide"</code>. The edit button uses <code className="font-mono bg-muted px-1 py-0.5 rounded">mode="disable"</code>.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              {/* Universal View Button (unrestricted) */}
              <Button variant="outline" size="sm" className="rounded-lg text-xs h-9">
                <Layout className="mr-2 h-3.5 w-3.5" />
                View Details
              </Button>

              {/* Edit Button (Gated by Edit permission - Disable mode) */}
              <Can permission="documents.edit" mode="disable">
                <Button variant="secondary" size="sm" className="rounded-lg text-xs h-9">
                  <Edit className="mr-2 h-3.5 w-3.5" />
                  Edit Records
                </Button>
              </Can>

              {/* Delete Button (Gated by Delete permission - Hide mode) */}
              <Can permission="documents.delete" mode="hide">
                <Button variant="destructive" size="sm" className="rounded-lg text-xs h-9">
                  <Trash2 className="mr-2 h-3.5 w-3.5" />
                  Delete File
                </Button>
              </Can>
            </div>
          </div>

          {/* Row B: Frosted Glass Panel (Blur mode for creation) */}
          <Can permission="documents.create" mode="blur" className="w-full">
            <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-4">
              <div className="flex flex-col gap-1.5">
                <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Create Municipal Log Entry
                </h5>
                <p className="text-xs text-muted-foreground">
                  Gated behind <code className="font-mono bg-muted px-1 py-0.5 rounded">documents.create</code>. Notice the blur effect over the entire field card.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <div className="h-4 w-24 bg-muted rounded" />
                  <div className="h-9 w-full bg-muted/40 border rounded-lg" />
                </div>
                <div className="space-y-1.5">
                  <div className="h-4 w-24 bg-muted rounded" />
                  <div className="h-9 w-full bg-muted/40 border rounded-lg" />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button size="sm" className="rounded-lg text-xs h-9">
                  <Plus className="mr-2 h-3.5 w-3.5" />
                  Create Entry
                </Button>
              </div>
            </div>
          </Can>

          {/* Row C: Admin Settings Panel (Role Gated - Blur mode with custom CTA fallback) */}
          <RoleGuard
            roles="admin"
            mode="blur"
            fallback={
              <Button
                variant="outline"
                size="sm"
                className="rounded-lg text-xs h-8 px-3 border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 mt-1"
                onClick={() => setHasAdminRole(true)}
              >
                <Key className="mr-1.5 h-3.5 w-3.5 animate-bounce" />
                Elevate to Admin Role
              </Button>
            }
          >
            <div className="rounded-xl border border-emerald-500/20 bg-card p-6 shadow-xs space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-1.5">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <UserCheck className="h-3.5 w-3.5" />
                    System Administrative Logs
                  </h5>
                  <p className="text-xs text-muted-foreground">
                    Gated behind the general <code className="font-mono bg-muted px-1 py-0.5 rounded">admin</code> user role class.
                  </p>
                </div>
                <Badge className="bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/15 border-emerald-500/10 text-[9px] uppercase tracking-wider font-semibold rounded-md py-0.5 px-2">
                  SECURE ZONE
                </Badge>
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs font-mono p-2 bg-muted/40 rounded-lg border">
                  <span>SYSTEM_BOOT_SECTOR</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">SUCCESS [100%]</span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono p-2 bg-muted/40 rounded-lg border">
                  <span>API_CORS_ENDPOINT</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">SECURE [RESOLVED]</span>
                </div>
              </div>
            </div>
          </RoleGuard>

        </div>
      </PermissionProvider>
    </div>
  );
}
