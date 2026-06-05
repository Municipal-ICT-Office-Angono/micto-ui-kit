/**
 * @title Inertia Permission Provider
 * @description A high-performance Inertia.js-integrated permission provider that automatically reads from usePage shared auth props.
 * @categories react, hook, global
 */
import { usePage } from '@inertiajs/react';
import * as React from 'react';
import { PermissionProvider } from '@/components/micto/permission-guard';


export function InertiaPermissionProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const { auth } = usePage().props as any;

    const permissions = React.useMemo(() => {
        return auth?.permissions || auth?.user?.permissions || [];
    }, [auth]);

    const roles = React.useMemo(() => {
        const userRole = auth?.user?.role;

        if (userRole) {
            if (typeof userRole === 'string') {
                return [userRole];
            }

            if (typeof userRole === 'object' && userRole.name) {
                return [userRole.name];
            }
        }

        if (Array.isArray(auth?.user?.roles)) {
            return auth.user.roles.map((r: any) =>
                typeof r === 'string' ? r : r?.name || '',
            );
        }

        if (Array.isArray(auth?.roles)) {
            return auth.roles.map((r: any) =>
                typeof r === 'string' ? r : r?.name || '',
            );
        }

        return [];
    }, [auth]);

    return (
        <PermissionProvider
            user={auth?.user}
            permissions={permissions}
            roles={roles}
        >
            {children}
        </PermissionProvider>
    );
}
