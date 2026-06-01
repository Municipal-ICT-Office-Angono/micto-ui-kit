"use client";

/**
 * @title Activity Timeline
 * @description A composable and data-driven timeline component for document routing history and audit trails.
 * @categories react, component
 */
import { Check, AlertCircle, Clock, Paperclip, Circle } from "lucide-react";
import * as React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

// ─── Types & Context ──────────────────────────────────────────────────────────

export type TimelineOrientation = "vertical" | "horizontal";
export type TimelineStatus =
  | "completed"
  | "in-progress"
  | "pending"
  | "error"
  | "muted";

interface TimelineContextValue {
  orientation: TimelineOrientation;
}

const ActivityTimelineContext = React.createContext<TimelineContextValue>({
  orientation: "vertical",
});

interface TimelineItemContextValue {
  status: TimelineStatus;
  isLast: boolean;
}

const TimelineItemContext = React.createContext<TimelineItemContextValue>({
  status: "pending",
  isLast: false,
});

// ─── Root Container ───────────────────────────────────────────────────────────

export interface ActivityTimelineProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: TimelineOrientation;
}

export const ActivityTimeline = React.forwardRef<
  HTMLDivElement,
  ActivityTimelineProps
>(({ className, orientation = "vertical", children, ...props }, ref) => {
  return (
    <ActivityTimelineContext.Provider value={{ orientation }}>
      <div
        ref={ref}
        className={cn(
          "relative flex",
          orientation === "vertical"
            ? "flex-col"
            : "w-full flex-col sm:flex-row sm:overflow-x-auto sm:pb-4",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </ActivityTimelineContext.Provider>
  );
});
ActivityTimeline.displayName = "ActivityTimeline";

// ─── Timeline Item Node ───────────────────────────────────────────────────────

export interface ActivityTimelineItemProps extends React.HTMLAttributes<HTMLDivElement> {
  status?: TimelineStatus;
  isLast?: boolean;
}

export const ActivityTimelineItem = React.forwardRef<
  HTMLDivElement,
  ActivityTimelineItemProps
>(
  (
    { className, status = "pending", isLast = false, children, ...props },
    ref,
  ) => {
    const { orientation } = React.useContext(ActivityTimelineContext);

    return (
      <TimelineItemContext.Provider value={{ status, isLast }}>
        <div
          ref={ref}
          className={cn(
            "group/timeline-item relative",
            orientation === "vertical"
              ? "flex flex-row gap-4"
              : "flex flex-row items-stretch gap-4 sm:min-w-[200px] sm:flex-1 sm:flex-col sm:items-center sm:gap-0",
            className,
          )}
          {...props}
        >
          {children}
        </div>
      </TimelineItemContext.Provider>
    );
  },
);
ActivityTimelineItem.displayName = "ActivityTimelineItem";

// ─── Timeline Track Wrapper (Holds Dot + Connector) ───────────────────────────

export const ActivityTimelineTrack = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { orientation } = React.useContext(ActivityTimelineContext);

  return (
    <div
      ref={ref}
      className={cn(
        orientation === "vertical"
          ? "relative flex w-8 shrink-0 flex-col items-center"
          : "relative mb-0 flex w-8 shrink-0 flex-col items-center sm:mb-3 sm:h-8 sm:w-full sm:shrink sm:flex-row sm:justify-center",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
});
ActivityTimelineTrack.displayName = "ActivityTimelineTrack";

// ─── Timeline Connector Line ──────────────────────────────────────────────────

export const ActivityTimelineConnector = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { orientation } = React.useContext(ActivityTimelineContext);
  const { status, isLast } = React.useContext(TimelineItemContext);

  if (isLast) {
    return null;
  }

  return (
    <div
      ref={ref}
      className={cn(
        "pointer-events-none absolute transition-colors duration-300",
        orientation === "vertical"
          ? "top-8 bottom-0 left-1/2 my-1.5 w-[2px] -translate-x-1/2"
          : "top-8 right-auto bottom-0 left-1/2 my-1.5 w-[2px] -translate-x-1/2 sm:top-1/2 sm:right-[calc(-50%+16px)] sm:bottom-auto sm:left-[calc(50%+16px)] sm:mx-1.5 sm:my-0 sm:h-[2px] sm:w-auto sm:translate-x-0 sm:-translate-y-1/2",
        status === "completed" ? "bg-primary" : "bg-border",
        status === "in-progress"
          ? "animate-pulse bg-primary/50 bg-[length:200%_200%]"
          : "",
        status === "pending" || status === "muted"
          ? "border-l-2 border-dashed border-border/60 bg-transparent"
          : "",
        className,
      )}
      {...props}
    />
  );
});
ActivityTimelineConnector.displayName = "ActivityTimelineConnector";

// ─── Timeline Dot ─────────────────────────────────────────────────────────────

export interface ActivityTimelineDotProps extends React.HTMLAttributes<HTMLDivElement> {
  customDot?: React.ReactNode;
}

export const ActivityTimelineDot = React.forwardRef<
  HTMLDivElement,
  ActivityTimelineDotProps
>(({ className, customDot, children, ...props }, ref) => {
  const { status } = React.useContext(TimelineItemContext);

  if (customDot) {
    return (
      <div
        ref={ref}
        className={cn(
          "relative z-10 flex items-center justify-center",
          className,
        )}
        {...props}
      >
        {customDot}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={cn(
        "relative z-10 flex size-8 items-center justify-center rounded-full border-2 bg-background shadow-sm transition-all duration-300",
        status === "completed" &&
          "border-primary bg-primary text-primary-foreground",
        status === "in-progress" &&
          "glow animate-pulse border-primary bg-background text-primary ring-4 ring-primary/20",
        status === "error" &&
          "border-destructive bg-destructive text-destructive-foreground",
        status === "pending" &&
          "border-muted-foreground/30 bg-muted/30 text-muted-foreground",
        status === "muted" && "border-border bg-muted/20 text-muted-foreground",
        className,
      )}
      {...props}
    >
      {children ?? (
        <>
          {status === "completed" && (
            <Check className="size-4.5 stroke-[2.5]" />
          )}
          {status === "in-progress" && <Clock className="size-4 stroke-[2]" />}
          {status === "error" && (
            <AlertCircle className="size-4.5 stroke-[2.5]" />
          )}
          {status === "pending" && (
            <Circle className="size-3.5 fill-muted-foreground/30" />
          )}
          {status === "muted" && <Circle className="size-2 fill-border" />}
        </>
      )}
    </div>
  );
});
ActivityTimelineDot.displayName = "ActivityTimelineDot";

// ─── Timeline Content Pane ────────────────────────────────────────────────────

export const ActivityTimelineContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { orientation } = React.useContext(ActivityTimelineContext);
  const { isLast } = React.useContext(TimelineItemContext);

  return (
    <div
      ref={ref}
      className={cn(
        orientation === "vertical"
          ? cn("flex-1 space-y-2", !isLast && "pb-8")
          : cn(
              "flex w-full flex-col items-start space-y-2 px-0 text-left sm:items-center sm:px-2 sm:text-center",
              !isLast && "pb-8 sm:pb-0",
            ),
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
});
ActivityTimelineContent.displayName = "ActivityTimelineContent";

// ─── Data-Driven High-Level Shorthand Component ───────────────────────────────

export interface ActivityTimelineItemData {
  id: string | number;
  title: React.ReactNode;
  description?: React.ReactNode;
  timestamp?: string;
  status?: TimelineStatus;
  actor?: {
    name?: string;
    avatar?: string;
    role?: string;
  };
  metadata?: React.ReactNode[];
  attachments?: Array<{
    label: string;
    url?: string;
    onClick?: () => void;
  }>;
  customDot?: React.ReactNode;
}

export interface ActivityTimelineListProps extends ActivityTimelineProps {
  items: ActivityTimelineItemData[];
}

export const ActivityTimelineList = React.forwardRef<
  HTMLDivElement,
  ActivityTimelineListProps
>(({ items, orientation = "vertical", className, ...props }, ref) => {
  return (
    <ActivityTimeline
      orientation={orientation}
      className={className}
      ref={ref}
      {...props}
    >
      {items.map((item, index) => (
        <ActivityTimelineItem
          key={String(item.id)}
          status={item.status}
          isLast={index === items.length - 1}
        >
          <ActivityTimelineTrack>
            <ActivityTimelineConnector />
            <ActivityTimelineDot customDot={item.customDot} />
          </ActivityTimelineTrack>

          <ActivityTimelineContent>
            {/* Header: Title + Timestamp */}
            <div
              className={cn(
                "flex w-full flex-col items-start gap-2 sm:flex-row sm:justify-between sm:gap-4",
                orientation === "horizontal" &&
                  "w-full sm:flex-col sm:items-center sm:justify-center",
              )}
            >
              <div
                className={cn(
                  "space-y-0.5",
                  orientation === "horizontal" &&
                    "sm:items-center sm:text-center",
                )}
              >
                <p className="text-sm leading-snug font-semibold text-foreground">
                  {item.title}
                </p>
                {item.timestamp && (
                  <span className="block font-mono text-[11px] text-muted-foreground">
                    {item.timestamp}
                  </span>
                )}
              </div>

              {/* Actor Avatar in Vertical Mode */}
              {item.actor && orientation === "vertical" && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex shrink-0 cursor-pointer items-center gap-2 rounded-full border border-border/40 bg-muted/40 p-1 pr-2.5 transition-colors hover:bg-muted/70">
                        <Avatar size="sm">
                          <AvatarImage
                            src={item.actor.avatar}
                            alt={item.actor.name ?? "Actor"}
                          />
                          <AvatarFallback>
                            {item.actor.name?.[0] ?? "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col text-left">
                          <span className="text-xs leading-none font-medium text-foreground">
                            {item.actor.name}
                          </span>
                          {item.actor.role && (
                            <span className="text-[10px] text-muted-foreground">
                              {item.actor.role}
                            </span>
                          )}
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p className="font-medium">{item.actor.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.actor.role}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>

            {/* Description */}
            {item.description && (
              <p className="max-w-prose text-xs leading-relaxed text-muted-foreground/90">
                {item.description}
              </p>
            )}

            {/* Actor in Horizontal Mode */}
            {item.actor && orientation === "horizontal" && (
              <div className="mt-2 flex items-center gap-1.5 rounded-full border border-border/30 bg-muted/30 px-2 py-1">
                <Avatar size="sm" className="size-4.5">
                  <AvatarImage src={item.actor.avatar} />
                  <AvatarFallback className="text-[9px]">
                    {item.actor.name?.[0] ?? "U"}
                  </AvatarFallback>
                </Avatar>
                <span className="max-w-[120px] truncate text-[11px] font-medium text-muted-foreground">
                  {item.actor.name}
                </span>
              </div>
            )}

            {/* Metadata Badges */}
            {item.metadata && item.metadata.length > 0 && (
              <div
                className={cn(
                  "flex flex-wrap gap-1.5 pt-1",
                  orientation === "horizontal" && "sm:justify-center",
                )}
              >
                {item.metadata.map((badge, bIdx) => (
                  <React.Fragment key={bIdx}>{badge}</React.Fragment>
                ))}
              </div>
            )}

            {/* Attachment Links */}
            {item.attachments && item.attachments.length > 0 && (
              <div
                className={cn(
                  "flex flex-wrap gap-2 pt-1",
                  orientation === "horizontal" && "sm:justify-center",
                )}
              >
                {item.attachments.map((att, aIdx) => (
                  <a
                    key={aIdx}
                    href={att.url ?? "#"}
                    onClick={
                      att.onClick
                        ? (e) => {
                            e.preventDefault();
                            att.onClick?.();
                          }
                        : undefined
                    }
                    className="inline-flex items-center gap-1 rounded-md border border-primary/20 bg-primary/5 px-2 py-1 text-xs text-primary transition-colors hover:bg-primary/10"
                  >
                    <Paperclip className="size-3" />
                    <span className="font-mono text-[11px] font-medium underline underline-offset-2">
                      {att.label}
                    </span>
                  </a>
                ))}
              </div>
            )}
          </ActivityTimelineContent>
        </ActivityTimelineItem>
      ))}
    </ActivityTimeline>
  );
});
ActivityTimelineList.displayName = "ActivityTimelineList";
