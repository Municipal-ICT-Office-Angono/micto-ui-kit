"use client";

/**
 * @title Permission Guard
 * @description A premium RBAC and wildcard permission gating suite.
 * @categories react, component
 */
import * as React from "react";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

// --- Types ---

export interface PermissionContextValue {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any;
  permissions: string[];
  roles: string[];
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string | string[], match?: "any" | "all") => boolean;
}

export interface PermissionProviderProps {
  children: React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user?: any;
  permissions?: string[];
  roles?: string[];
}

export interface GuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  mode?: "hide" | "disable" | "blur";
  className?: string;
}

export interface CanProps extends GuardProps {
  permission: string;
}

export interface RoleGuardProps extends GuardProps {
  roles: string | string[];
  match?: "any" | "all";
}

// --- Context ---

const PermissionContext = React.createContext<PermissionContextValue | undefined>(undefined);

export function PermissionProvider({
  children,
  user: initialUser,
  permissions: initialPermissions,
  roles: initialRoles,
}: PermissionProviderProps) {
  // Attempt to resolve props from Inertia.js usePage context dynamically
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let inertiaUser: any = null;
  let inertiaPermissions: string[] = [];
  let inertiaRoles: string[] = [];

  try {
    // Dynamic import inside try-catch to support optional InertiaJS framework compilation
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { usePage } = require("@inertiajs/react");
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const page = usePage();
    const props = page?.props;

    if (props) {
      // Standard Laravel auth user structure
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const auth = (props as any).auth;
      if (auth?.user) {
        inertiaUser = auth.user;
        inertiaPermissions = auth.user.permissions || auth.permissions || [];
        inertiaRoles = auth.user.roles || auth.roles || [];
      }
    }
  } catch {
    // Inertia is not active in this workspace runtime
  }

  const permKey = inertiaPermissions.join(",");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const stableInertiaPermissions = React.useMemo(() => inertiaPermissions, [permKey]);

  const roleKey = inertiaRoles.join(",");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const stableInertiaRoles = React.useMemo(() => inertiaRoles, [roleKey]);

  // Fallback cascade: explicit props -> Inertia props -> default empty
  const user = initialUser ?? inertiaUser ?? null;
  const permissions = React.useMemo(() => {
    return Array.from(new Set([...(initialPermissions || []), ...stableInertiaPermissions])).map((p) =>
      p.toLowerCase()
    );
  }, [initialPermissions, stableInertiaPermissions]);

  const roles = React.useMemo(() => {
    return Array.from(new Set([...(initialRoles || []), ...stableInertiaRoles])).map((r) =>
      r.toLowerCase()
    );
  }, [initialRoles, stableInertiaRoles]);

  // Check wildcards: e.g. "documents.edit" matches "documents.*" or "*"
  const hasPermission = React.useCallback(
    (permission: string) => {
      const target = permission.toLowerCase();
      if (permissions.includes("*")) return true;
      if (permissions.includes(target)) return true;

      // Handle wildcard sections: e.g. "documents.*" matches "documents.edit"
      return permissions.some((p) => {
        if (p.endsWith(".*")) {
          const prefix = p.slice(0, -2);
          return target.startsWith(prefix);
        }
        return false;
      });
    },
    [permissions]
  );

  const hasRole = React.useCallback(
    (inputRole: string | string[], match: "any" | "all" = "any") => {
      const required = (Array.isArray(inputRole) ? inputRole : [inputRole]).map((r) =>
        r.toLowerCase()
      );

      if (required.length === 0) return true;

      if (match === "all") {
        return required.every((r) => roles.includes(r));
      }
      return required.some((r) => roles.includes(r));
    },
    [roles]
  );

  const contextValue = React.useMemo(
    () => ({
      user,
      permissions,
      roles,
      hasPermission,
      hasRole,
    }),
    [user, permissions, roles, hasPermission, hasRole]
  );

  return (
    <PermissionContext.Provider value={contextValue}>
      {children}
    </PermissionContext.Provider>
  );
}

// --- Custom Hook ---

export function usePermission() {
  const context = React.useContext(PermissionContext);
  if (!context) {
    // Graceful fallback to prevent application crashes when provider is omitted
    return {
      user: null,
      permissions: [],
      roles: [],
      hasPermission: () => false,
      hasRole: () => false,
    };
  }
  return context;
}

// --- Guard Gating Components ---

export function Can({
  permission,
  children,
  fallback,
  mode = "hide",
  className,
}: CanProps) {
  const { hasPermission } = usePermission();
  const isAllowed = hasPermission(permission);

  if (isAllowed) {
    return <>{children}</>;
  }

  // Mode 1: Completely unmount/hide element
  if (mode === "hide") {
    return <>{fallback || null}</>;
  }

  // Mode 2: Clone children, inject disabled prop and gray styles
  if (mode === "disable") {
    return (
      <div className={cn("relative inline-block cursor-not-allowed group", className)}>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const childProps = (child.props as any) || {};
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return React.cloneElement(child as React.ReactElement<any>, {
              disabled: true,
              "aria-disabled": true,
              className: cn(
                childProps.className,
                "opacity-50 pointer-events-none cursor-not-allowed selection:bg-transparent"
              ),
            });
          }
          return child;
        })}
        {/* Floating Mini Tooltip */}
        <div className="absolute left-1/2 -bottom-8 -translate-x-1/2 scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-200 pointer-events-none bg-destructive text-destructive-foreground text-[10px] font-semibold px-2 py-0.5 rounded shadow-sm whitespace-nowrap z-50">
          Requires: {permission}
        </div>
      </div>
    );
  }

  // Mode 3: Frosted glass blur overlay
  return (
    <div className={cn("relative overflow-hidden rounded-xl border border-border/60 p-1", className)}>
      {/* Blurred content wrapper */}
      <div className="filter blur-[4px] opacity-35 select-none pointer-events-none transition-all">
        {children}
      </div>

      {/* Floating Center Badge Card */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/5 p-4 text-center z-10 animate-in fade-in zoom-in-95 duration-300">
        <div className="rounded-full bg-background p-2.5 shadow-sm border border-border">
          <Lock className="h-4 w-4 text-muted-foreground animate-pulse" />
        </div>
        <p className="text-xs font-semibold text-foreground mt-2">Restricted Access</p>
        {fallback ? (
          <div className="mt-2.5">{fallback}</div>
        ) : (
          <p className="text-[10px] text-muted-foreground mt-1">
            Requires permission:{" "}
            <code className="font-mono bg-muted/60 px-1 py-0.5 rounded text-destructive font-medium">
              {permission}
            </code>
          </p>
        )}
      </div>
    </div>
  );
}

export function RoleGuard({
  roles,
  match = "any",
  children,
  fallback,
  mode = "hide",
  className,
}: RoleGuardProps) {
  const { hasRole } = usePermission();
  const isAllowed = hasRole(roles, match);

  if (isAllowed) {
    return <>{children}</>;
  }

  const roleText = Array.isArray(roles) ? roles.join(match === "all" ? " & " : " | ") : roles;

  // Mode 1: Completely unmount/hide element
  if (mode === "hide") {
    return <>{fallback || null}</>;
  }

  // Mode 2: Clone children, inject disabled prop and gray styles
  if (mode === "disable") {
    return (
      <div className={cn("relative inline-block cursor-not-allowed group", className)}>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const childProps = (child.props as any) || {};
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return React.cloneElement(child as React.ReactElement<any>, {
              disabled: true,
              "aria-disabled": true,
              className: cn(
                childProps.className,
                "opacity-50 pointer-events-none cursor-not-allowed selection:bg-transparent"
              ),
            });
          }
          return child;
        })}
        {/* Floating Mini Tooltip */}
        <div className="absolute left-1/2 -bottom-8 -translate-x-1/2 scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-200 pointer-events-none bg-destructive text-destructive-foreground text-[10px] font-semibold px-2 py-0.5 rounded shadow-sm whitespace-nowrap z-50">
          Role Required: {roleText}
        </div>
      </div>
    );
  }

  // Mode 3: Frosted glass blur overlay
  return (
    <div className={cn("relative overflow-hidden rounded-xl border border-border/60 p-1", className)}>
      {/* Blurred content wrapper */}
      <div className="filter blur-[4px] opacity-35 select-none pointer-events-none transition-all">
        {children}
      </div>

      {/* Floating Center Badge Card */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/5 p-4 text-center z-10 animate-in fade-in zoom-in-95 duration-300">
        <div className="rounded-full bg-background p-2.5 shadow-sm border border-border">
          <Lock className="h-4 w-4 text-muted-foreground animate-pulse" />
        </div>
        <p className="text-xs font-semibold text-foreground mt-2">Restricted Access</p>
        {fallback ? (
          <div className="mt-2.5">{fallback}</div>
        ) : (
          <p className="text-[10px] text-muted-foreground mt-1">
            Requires Role:{" "}
            <code className="font-mono bg-muted/60 px-1.5 py-0.5 rounded text-destructive font-medium uppercase tracking-tight text-[9px]">
              {roleText}
            </code>
          </p>
        )}
      </div>
    </div>
  );
}
