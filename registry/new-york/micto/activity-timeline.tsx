"use client";

/**
 * @title Activity Timeline
 * @description A composable and data-driven timeline component for document routing history and audit trails.
 * @categories react, component
 */
import * as React from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Check, AlertCircle, Clock, Paperclip, Circle } from "lucide-react";

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
            : "flex-col sm:flex-row w-full sm:overflow-x-auto sm:pb-4",
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
            "relative group/timeline-item",
            orientation === "vertical"
              ? "flex flex-row gap-4"
              : "flex flex-row sm:flex-col sm:flex-1 items-stretch sm:items-center gap-4 sm:gap-0 sm:min-w-[200px]",
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
          ? "flex flex-col items-center relative shrink-0 w-8"
          : "flex flex-col sm:flex-row items-center sm:justify-center relative shrink-0 sm:shrink sm:w-full mb-0 sm:mb-3 w-8 sm:h-8",
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

  if (isLast) return null;

  return (
    <div
      ref={ref}
      className={cn(
        "absolute pointer-events-none transition-colors duration-300",
        orientation === "vertical"
          ? "top-8 bottom-0 w-[2px] left-1/2 -translate-x-1/2 my-1.5"
          : "top-8 sm:top-1/2 bottom-0 sm:bottom-auto w-[2px] sm:w-auto sm:h-[2px] left-1/2 sm:left-[calc(50%+16px)] right-auto sm:right-[calc(-50%+16px)] -translate-x-1/2 sm:translate-x-0 sm:-translate-y-1/2 my-1.5 sm:my-0 sm:mx-1.5",
        status === "completed" ? "bg-primary" : "bg-border",
        status === "in-progress"
          ? "bg-primary/50 bg-[length:200%_200%] animate-pulse"
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
        "relative z-10 flex size-8 items-center justify-center rounded-full border-2 transition-all duration-300 bg-background shadow-sm",
        status === "completed" &&
          "border-primary bg-primary text-primary-foreground",
        status === "in-progress" &&
          "border-primary ring-4 ring-primary/20 bg-background text-primary animate-pulse glow",
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
              "flex flex-col items-start sm:items-center text-left sm:text-center w-full px-0 sm:px-2 space-y-2",
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
                "flex flex-col sm:flex-row sm:justify-between items-start gap-2 sm:gap-4 w-full",
                orientation === "horizontal" &&
                  "sm:flex-col sm:items-center sm:justify-center w-full",
              )}
            >
              <div
                className={cn(
                  "space-y-0.5",
                  orientation === "horizontal" &&
                    "sm:items-center sm:text-center",
                )}
              >
                <p className="text-sm font-semibold text-foreground leading-snug">
                  {item.title}
                </p>
                {item.timestamp && (
                  <span className="text-[11px] font-mono text-muted-foreground block">
                    {item.timestamp}
                  </span>
                )}
              </div>

              {/* Actor Avatar in Vertical Mode */}
              {item.actor && orientation === "vertical" && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex shrink-0 items-center gap-2 cursor-pointer rounded-full bg-muted/40 p-1 pr-2.5 border border-border/40 hover:bg-muted/70 transition-colors">
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
                          <span className="text-xs font-medium text-foreground leading-none">
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
              <p className="text-xs text-muted-foreground/90 leading-relaxed max-w-prose">
                {item.description}
              </p>
            )}

            {/* Actor in Horizontal Mode */}
            {item.actor && orientation === "horizontal" && (
              <div className="flex items-center gap-1.5 mt-2 bg-muted/30 px-2 py-1 rounded-full border border-border/30">
                <Avatar size="sm" className="size-4.5">
                  <AvatarImage src={item.actor.avatar} />
                  <AvatarFallback className="text-[9px]">
                    {item.actor.name?.[0] ?? "U"}
                  </AvatarFallback>
                </Avatar>
                <span className="text-[11px] font-medium text-muted-foreground truncate max-w-[120px]">
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
                    className="inline-flex items-center gap-1 text-xs text-primary bg-primary/5 hover:bg-primary/10 border border-primary/20 px-2 py-1 rounded-md transition-colors"
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
