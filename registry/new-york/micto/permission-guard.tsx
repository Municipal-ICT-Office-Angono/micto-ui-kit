'use client';

/**
 * @title Permission Guard
 * @description A premium RBAC and wildcard permission gating suite.
 * @categories react, component
 */
import { Lock } from 'lucide-react';
import * as React from 'react';
import { cn } from '@/lib/utils';

// --- Types ---

// Define your custom permission keys here (e.g. "documents.edit" | "documents.delete")
export type PermissionKey = string;


export interface PermissionContextValue {
    user: any;
    permissions: string[];
    roles: string[];
    hasPermission: (permission: PermissionKey | (string & {})) => boolean;
    hasRole: (role: string | string[], match?: 'any' | 'all') => boolean;
}

export interface PermissionProviderProps {
    children: React.ReactNode;

    user?: any;
    permissions?: string[];
    roles?: string[];
}

export interface GuardProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
    mode?: 'hide' | 'disable' | 'blur';
    className?: string;
}

export interface CanProps extends GuardProps {
    permission: PermissionKey | (string & {});
}


export interface RoleGuardProps extends GuardProps {
    roles: string | string[];
    match?: 'any' | 'all';
}

// --- Context ---

const PermissionContext = React.createContext<
    PermissionContextValue | undefined
>(undefined);

export function PermissionProvider({
    children,
    user,
    permissions: initialPermissions = [],
    roles: initialRoles = [],
}: PermissionProviderProps) {
    // Memoize permissions
    const permissions = React.useMemo(() => {
        const rawPerms = Array.isArray(initialPermissions)
            ? initialPermissions
            : [];

        return Array.from(
            new Set(rawPerms.map((p) => String(p).toLowerCase())),
        );
    }, [initialPermissions]);

    // Pre-compile permissions to avoid regex compilation overhead during render cycles
    const compiledPermissions = React.useMemo(() => {
        return permissions.map((pattern) => {
            if (
                pattern === '*' ||
                (!pattern.includes('*') && !pattern.includes('?'))
            ) {
                return { pattern, regex: null };
            }

            try {
                const escaped = pattern.replace(/[.+^${}()|[\]\\]/g, '\\$&');
                const regexStr =
                    '^' +
                    escaped.replace(/\*/g, '.*').replace(/\?/g, '.') +
                    '$';

                return { pattern, regex: new RegExp(regexStr) };
            } catch {
                return { pattern, regex: null };
            }
        });
    }, [permissions]);

    // Memoize roles
    const roles = React.useMemo(() => {
        const rawRoles = Array.isArray(initialRoles) ? initialRoles : [];

        return Array.from(
            new Set(rawRoles.map((r) => String(r).toLowerCase())),
        );
    }, [initialRoles]);

    // Check wildcards: e.g. "documents.edit" matches "documents.*" or "*"
    // Uses pre-compiled regex objects for fast lookup
    const hasPermission = React.useCallback(
        (permission: PermissionKey | (string & {})) => {
            const target = permission.toLowerCase();

            return compiledPermissions.some(({ pattern, regex }) => {
                if (pattern === '*') {
                    return true;
                }

                if (pattern === target) {
                    return true;
                }

                if (regex) {
                    return regex.test(target);
                }

                return false;
            });
        },
        [compiledPermissions],
    );

    const hasRole = React.useCallback(
        (inputRole: string | string[], match: 'any' | 'all' = 'any') => {
            const required = (
                Array.isArray(inputRole) ? inputRole : [inputRole]
            ).map((r) => r.toLowerCase());

            if (required.length === 0) {
                return true;
            }

            if (match === 'all') {
                return required.every((r) => roles.includes(r));
            }

            return required.some((r) => roles.includes(r));
        },
        [roles],
    );

    const contextValue = React.useMemo(
        () => ({
            user,
            permissions,
            roles,
            hasPermission,
            hasRole,
        }),
        [user, permissions, roles, hasPermission, hasRole],
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
    mode = 'hide',
    className,
}: CanProps) {
    const { hasPermission } = usePermission();
    const isAllowed = hasPermission(permission);

    if (isAllowed) {
        return <>{children}</>;
    }

    // Mode 1: Completely unmount/hide element
    if (mode === 'hide') {
        return <>{fallback || null}</>;
    }

    // Mode 2: Clone children, inject disabled prop and gray styles
    if (mode === 'disable') {
        return (
            <div
                className={cn(
                    'group relative inline-block cursor-not-allowed',
                    className,
                )}
            >
                {React.Children.map(children, (child) => {
                    if (React.isValidElement(child)) {
                        const childProps = (child.props as any) || {};

                        return React.cloneElement(
                            child as React.ReactElement<any>,
                            {
                                disabled: true,
                                'aria-disabled': true,
                                className: cn(
                                    childProps.className,
                                    'pointer-events-none cursor-not-allowed opacity-50 selection:bg-transparent',
                                ),
                            },
                        );
                    }

                    return child;
                })}
                {/* Floating Mini Tooltip */}
                <div className="pointer-events-none absolute -bottom-8 left-1/2 z-50 -translate-x-1/2 scale-90 rounded bg-destructive px-2 py-0.5 text-[10px] font-semibold whitespace-nowrap text-destructive-foreground opacity-0 shadow-sm transition-all duration-200 group-hover:scale-100 group-hover:opacity-100">
                    Requires: {permission}
                </div>
            </div>
        );
    }

    // Mode 3: Frosted glass blur overlay
    return (
        <div
            className={cn(
                'relative overflow-hidden rounded-xl border border-border/60 p-1',
                className,
            )}
        >
            {/* Blurred content wrapper */}
            <div className="pointer-events-none opacity-35 blur-xs filter transition-all select-none">
                {children}
            </div>

            {/* Floating Center Badge Card */}
            <div className="absolute inset-0 z-10 flex animate-in flex-col items-center justify-center bg-background/5 p-4 text-center duration-300 zoom-in-95 fade-in">
                <div className="rounded-full border border-border bg-background p-2.5 shadow-sm">
                    <Lock className="h-4 w-4 animate-pulse text-muted-foreground" />
                </div>
                <p className="mt-2 text-xs font-semibold text-foreground">
                    Restricted Access
                </p>
                {fallback ? (
                    <div className="mt-2.5">{fallback}</div>
                ) : (
                    <p className="mt-1 text-[10px] text-muted-foreground">
                        Requires permission:{' '}
                        <code className="rounded bg-muted/60 px-1 py-0.5 font-mono font-medium text-destructive">
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
    match = 'any',
    children,
    fallback,
    mode = 'hide',
    className,
}: RoleGuardProps) {
    const { hasRole } = usePermission();
    const isAllowed = hasRole(roles, match);

    if (isAllowed) {
        return <>{children}</>;
    }

    const roleText = Array.isArray(roles)
        ? roles.join(match === 'all' ? ' & ' : ' | ')
        : roles;

    // Mode 1: Completely unmount/hide element
    if (mode === 'hide') {
        return <>{fallback || null}</>;
    }

    // Mode 2: Clone children, inject disabled prop and gray styles
    if (mode === 'disable') {
        return (
            <div
                className={cn(
                    'group relative inline-block cursor-not-allowed',
                    className,
                )}
            >
                {React.Children.map(children, (child) => {
                    if (React.isValidElement(child)) {
                        const childProps = (child.props as any) || {};

                        return React.cloneElement(
                            child as React.ReactElement<any>,
                            {
                                disabled: true,
                                'aria-disabled': true,
                                className: cn(
                                    childProps.className,
                                    'pointer-events-none cursor-not-allowed opacity-50 selection:bg-transparent',
                                ),
                            },
                        );
                    }

                    return child;
                })}
                {/* Floating Mini Tooltip */}
                <div className="pointer-events-none absolute -bottom-8 left-1/2 z-50 -translate-x-1/2 scale-90 rounded bg-destructive px-2 py-0.5 text-[10px] font-semibold whitespace-nowrap text-destructive-foreground opacity-0 shadow-sm transition-all duration-200 group-hover:scale-100 group-hover:opacity-100">
                    Role Required: {roleText}
                </div>
            </div>
        );
    }

    // Mode 3: Frosted glass blur overlay
    return (
        <div
            className={cn(
                'relative overflow-hidden rounded-xl border border-border/60 p-1',
                className,
            )}
        >
            {/* Blurred content wrapper */}
            <div className="pointer-events-none opacity-35 blur-xs filter transition-all select-none">
                {children}
            </div>

            {/* Floating Center Badge Card */}
            <div className="absolute inset-0 z-10 flex animate-in flex-col items-center justify-center bg-background/5 p-4 text-center duration-300 zoom-in-95 fade-in">
                <div className="rounded-full border border-border bg-background p-2.5 shadow-sm">
                    <Lock className="h-4 w-4 animate-pulse text-muted-foreground" />
                </div>
                <p className="mt-2 text-xs font-semibold text-foreground">
                    Restricted Access
                </p>
                {fallback ? (
                    <div className="mt-2.5">{fallback}</div>
                ) : (
                    <p className="mt-1 text-[10px] text-muted-foreground">
                        Requires Role:{' '}
                        <code className="rounded bg-muted/60 px-1.5 py-0.5 font-mono text-[9px] font-medium tracking-tight text-destructive uppercase">
                            {roleText}
                        </code>
                    </p>
                )}
            </div>
        </div>
    );
}
