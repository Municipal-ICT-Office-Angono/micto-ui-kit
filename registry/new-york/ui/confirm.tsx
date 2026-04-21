"use client";

import * as React from "react";
import { AlertOctagon, AlertTriangle, Info, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// --- Types ---

export type ConfirmVariant = "warning" | "danger" | "info" | "ghost";

export interface ConfirmOptions {
  title?: string;
  body: string | React.ReactNode;
  icon?: ConfirmVariant;
  cancelText?: string;
  confirmText?: string;
  onConfirm?: () => Promise<boolean | void> | boolean | void;
  onCancel?: () => void;
  size?: "sm" | "md" | "lg";
  className?: string;
  dismissable?: boolean;
}

interface ConfirmRequest extends ConfirmOptions {
  id: string;
  resolve: (value: boolean) => void;
  isLoading?: boolean;
}

// --- Store (Singleton Pattern) ---

let confirmCount = 0;
const subscribers = new Set<(requests: ConfirmRequest[]) => void>();
let requests: ConfirmRequest[] = [];

const notify = () => {
  subscribers.forEach((callback) => callback([...requests]));
};

const updateLoading = (id: string, isLoading: boolean) => {
  requests = requests.map((r) => (r.id === id ? { ...r, isLoading } : r));
  notify();
};

/**
 * Global confirm function that can be called from anywhere.
 * Returns a promise that resolves to true (confirmed) or false (cancelled).
 */
export const confirm = (options: ConfirmOptions): Promise<boolean> => {
  return new Promise((resolve) => {
    const id = `confirm-${confirmCount++}`;
    requests.push({
      ...options,
      id,
      resolve,
    });
    notify();
  });
};

// --- Components ---

export function ConfirmProvider({
  defaultSize = "md",
  className,
}: {
  defaultSize?: "sm" | "md" | "lg";
  className?: string;
} = {}) {
  const [activeRequests, setActiveRequests] = React.useState<ConfirmRequest[]>(
    [],
  );

  React.useEffect(() => {
    const unsubscribe = (newRequests: ConfirmRequest[]) => {
      setActiveRequests(newRequests);
    };
    subscribers.add(unsubscribe);
    return () => {
      subscribers.delete(unsubscribe);
    };
  }, []);

  if (activeRequests.length === 0) return null;

  return (
    <div className={cn("fixed inset-0 z-[100] flex items-center justify-center p-4", className)}>
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
        onClick={() => {
          const top = activeRequests[activeRequests.length - 1];
          if (top && top.dismissable !== false && !top.isLoading) {
            requests = requests.filter((r) => r.id !== top.id);
            top.resolve(false);
            notify();
          }
        }}
      />

      {/* Stack Container */}
      <div className="relative flex items-center justify-center w-full">
        {activeRequests.map((request, index) => (
          <ConfirmDialog
            key={request.id}
            request={{
              size: defaultSize,
              ...request,
            }}
            index={index}
            total={activeRequests.length}
          />
        ))}
      </div>
    </div>
  );
}

function ConfirmDialog({
  request,
  index,
  total,
}: {
  request: ConfirmRequest;
  index: number;
  total: number;
}) {
  const [isLoading, setIsLoading] = React.useState(false);

  // Calculate stack offsets (Sonner-style)
  const isTop = index === total - 1;
  const offset = (total - 1 - index) * 12; // move down slightly
  const scale = 1 - (total - 1 - index) * 0.05; // scale down slightly
  const opacity = 1 - (total - 1 - index) * 0.3; // fade out

  const handleConfirm = async () => {
    if (isLoading) return;

    if (request.onConfirm) {
      setIsLoading(true);
      updateLoading(request.id, true);
      try {
        const result = await request.onConfirm();
        if (result === false) {
          setIsLoading(false);
          updateLoading(request.id, false);
          return; // Stay open if returned false
        }
      } catch (error) {
        setIsLoading(false);
        updateLoading(request.id, false);
        return;
      }
    }

    // Success - remove from stack
    requests = requests.filter((r) => r.id !== request.id);
    request.resolve(true);
    notify();
  };

  const handleCancel = () => {
    if (isLoading) return;
    requests = requests.filter((r) => r.id !== request.id);
    request.onCancel?.();
    request.resolve(false);
    notify();
  };

  const Icon = React.useMemo(() => {
    switch (request.icon) {
      case "danger":
        return AlertOctagon;
      case "info":
        return Info;
      case "ghost":
        return null;
      default:
        return AlertTriangle;
    }
  }, [request.icon]);

  const variantStyles = React.useMemo(() => {
    switch (request.icon) {
      case "danger":
        return "text-destructive bg-destructive/10";
      case "info":
        return "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20";
      default:
        return "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-900/20";
    }
  }, [request.icon]);

  return (
    <div
      className={cn(
        "absolute rounded-xl border bg-card shadow-2xl transition-all duration-300 ease-in-out",
        request.size === "sm" && "p-4",
        (request.size === "md" || !request.size) && "p-6",
        request.size === "lg" && "p-8",
        !isTop && "pointer-events-none",
        request.className || "max-w-md w-full",
      )}
      style={{
        transform: `translateY(${offset}px) scale(${scale})`,
        opacity,
        zIndex: index,
      }}
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-4">
          {Icon && (
            <div
              className={cn(
                "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full",
                variantStyles,
              )}
            >
              <Icon className="size-5" />
            </div>
          )}
          <div className="flex-1 space-y-1.5">
            {request.title && (
              <h3
                className={cn(
                  "font-bold tracking-tight leading-none",
                  request.size === "sm" ? "text-base" : "text-lg",
                )}
              >
                {request.title}
              </h3>
            )}
            <div
              className={cn(
                "text-muted-foreground leading-relaxed",
                request.size === "sm" ? "text-xs" : "text-sm",
              )}
            >
              {request.body}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="size-7 -mr-2 -mt-2 opacity-50 hover:opacity-100"
            onClick={handleCancel}
            disabled={isLoading}
          >
            <X className="size-4" />
          </Button>
        </div>

        <div className="mt-2 flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCancel}
            disabled={isLoading}
            className="h-9 px-4 rounded-lg font-medium"
          >
            {request.cancelText || "Cancel"}
          </Button>
          <Button
            variant={request.icon === "danger" ? "destructive" : "default"}
            size={request.size === "sm" ? "sm" : "default"}
            onClick={handleConfirm}
            disabled={isLoading}
            className="rounded-lg font-semibold min-w-[80px]"
          >
            {isLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              request.confirmText || "Confirm"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
