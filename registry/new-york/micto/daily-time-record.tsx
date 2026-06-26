/**
 * @title Daily Time Record
 * @description A highly-detailed visual log grid for employee attendance, featuring calculated stats, weekend/holiday highlighting, and interactive log adjustments.
 * @categories react, component, micto
 */
"use client";

import * as React from "react";
import {
  Calendar,
  Clock,
  AlertTriangle,
  FileEdit,
  FileText,
  CheckCircle2,
  UserCircle,
  Check,
  CalendarDays,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export interface ScheduleSlot {
  key: string;
  label: string;
  expectedTime: string; // 24h format, e.g. "08:00"
  type: "in" | "out";
}

export interface ScheduleConfig {
  name: string;
  slots: ScheduleSlot[];
  expectedDailyHours: number;
  breakMinutes?: number;
  tardinessGraceMinutes?: number;
}

export interface DtrLogEntry {
  date: string; // Format: "YYYY-MM-DD"
  punches: Record<string, string | undefined>; // keys match ScheduleSlot.key, values in 12h format
  overtimeIn?: string;
  overtimeOut?: string;
  status:
    | "regular"
    | "late"
    | "undertime"
    | "absent"
    | "leave"
    | "weekend"
    | "holiday";
  leaveType?: string; // e.g. "Sick Leave"
  holidayName?: string; // e.g. "Independence Day"
  tardinessMinutes?: number;
  undertimeMinutes?: number;
}

export interface DailyTimeRecordProps extends React.HTMLAttributes<HTMLDivElement> {
  employeeId: string;
  employeeName: string;
  department: string;
  position: string;
  month: string; // e.g. "October 2026"
  schedule: ScheduleConfig;
  logs: DtrLogEntry[];
  onFileAdjustment?: (
    date: string,
    slotKey: string,
  ) => void;
  onSaveAdjustment?: (
    date: string,
    slotKey: string,
    correctedTime: string,
    reason: string,
    notes: string,
  ) => void | Promise<void>;
}

const convert12to24 = (time12?: string): string => {
  if (!time12) return "";
  const match = time12.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return "";
  const [, hoursStr, minutesStr, ampm] = match;
  if (!hoursStr || !minutesStr || !ampm) return "";
  let hours = parseInt(hoursStr, 10);
  const minutes = minutesStr;
  if (ampm.toUpperCase() === "PM" && hours < 12) hours += 12;
  if (ampm.toUpperCase() === "AM" && hours === 12) hours = 0;
  return `${String(hours).padStart(2, "0")}:${minutes}`;
};

const convert24to12 = (time24?: string): string => {
  if (!time24) return "";
  const parts = time24.split(":");
  const hoursStr = parts[0];
  const minutesStr = parts[1];
  if (!hoursStr || !minutesStr) return "";
  let hours = parseInt(hoursStr, 10);
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  if (hours === 0) hours = 12;
  return `${String(hours).padStart(2, "0")}:${minutesStr} ${ampm}`;
};

const toMinutes = (time24: string): number => {
  if (!time24) return 0;
  const parts = time24.split(":");
  return parseInt(parts[0] ?? "0", 10) * 60 + parseInt(parts[1] ?? "0", 10);
};

const getDefaultTime = (schedule: ScheduleConfig, slotKey: string): string => {
  const slot = schedule.slots.find((s) => s.key === slotKey);
  return slot?.expectedTime ?? "08:00";
};

const computeDayHours = (
  log: DtrLogEntry,
  schedule: ScheduleConfig,
): number => {
  const { slots } = schedule;
  let totalMinutes = 0;

  for (let i = 0; i < slots.length; i++) {
    const slot = slots[i]!;
    if (slot.type === "in") {
      const outSlot = slots.slice(i + 1).find((s) => s.type === "out");
      if (!outSlot) break;

      const inTime = log.punches[slot.key];
      const outTime = log.punches[outSlot.key];

      if (inTime && outTime) {
        const inMin = toMinutes(convert12to24(inTime));
        const outMin = toMinutes(convert12to24(outTime));
        let diff = outMin - inMin;
        if (diff < 0) diff += 24 * 60; // cross-midnight support
        totalMinutes += diff;
      }
    }
  }

  totalMinutes -= (log.tardinessMinutes ?? 0) + (log.undertimeMinutes ?? 0);
  return Math.max(0, totalMinutes / 60);
};

export const DailyTimeRecord = React.forwardRef<
  HTMLDivElement,
  DailyTimeRecordProps
>(
  (
    {
      employeeId,
      employeeName,
      department,
      position,
      month,
      schedule,
      logs,
      onFileAdjustment,
      onSaveAdjustment,
      className,
      ...props
    },
    ref,
  ) => {
    // States for internal correction/adjustment sheet
    const [isSheetOpen, setIsSheetOpen] = React.useState(false);
    const [targetDate, setTargetDate] = React.useState("");
    const [targetField, setTargetField] = React.useState<string | null>(null);
    const [correctedTime, setCorrectedTime] = React.useState("");
    const [reason, setReason] = React.useState("Biometric reader sync error");
    const [notes, setNotes] = React.useState("");
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [showSuccess, setShowSuccess] = React.useState(false);

    const handleSlotClick = (
      date: string,
      slotKey: string,
      currentTime?: string,
    ) => {
      if (onFileAdjustment) {
        onFileAdjustment(date, slotKey);
      } else if (onSaveAdjustment) {
        setTargetDate(date);
        setTargetField(slotKey);
        const time24 = currentTime ? convert12to24(currentTime) : getDefaultTime(schedule, slotKey);
        setCorrectedTime(time24);
        setReason("Biometric reader sync error");
        setNotes("");
        setShowSuccess(false);
        setIsSheetOpen(true);
      }
    };

    const handleSubmitCorrection = (e: React.FormEvent) => {
      e.preventDefault();
      if (!targetDate || !targetField || !onSaveAdjustment) return;

      setIsSubmitting(true);
      const time12 = convert24to12(correctedTime);
      Promise.resolve(
        onSaveAdjustment(targetDate, targetField, time12, reason, notes),
      )
        .then(() => {
          setShowSuccess(true);
        })
        .catch((err) => {
          console.error("Failed to save DTR adjustment:", err);
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    };

    // 1. Compute aggregates automatically
    const stats = React.useMemo(() => {
      let daysWorked = 0;
      let totalLates = 0;
      let totalLatesCount = 0;
      let totalUnderTime = 0;
      let totalUnderTimeCount = 0;
      let totalLeaves = 0;
      let totalAbsents = 0;
      let totalHoursRendered = 0;

      logs.forEach((log) => {
        if (
          log.status === "regular" ||
          log.status === "late" ||
          log.status === "undertime"
        ) {
          daysWorked++;
        }
        if (log.status === "leave") {
          totalLeaves++;
        }
        if (log.status === "absent") {
          totalAbsents++;
        }

        // Compute total hours from actual punch times
        let dayHours = computeDayHours(log, schedule);
        if (log.overtimeIn && log.overtimeOut) {
          const otIn = toMinutes(convert12to24(log.overtimeIn));
          const otOut = toMinutes(convert12to24(log.overtimeOut));
          let otDiff = otOut - otIn;
          if (otDiff < 0) otDiff += 24 * 60;
          dayHours += otDiff / 60;
        }

        if (log.tardinessMinutes) {
          totalLates += log.tardinessMinutes;
          totalLatesCount++;
        }
        if (log.undertimeMinutes) {
          totalUnderTime += log.undertimeMinutes;
          totalUnderTimeCount++;
        }

        totalHoursRendered += Math.max(0, dayHours);
      });

      return {
        daysWorked,
        totalHours: totalHoursRendered.toFixed(1),
        totalLates,
        totalLatesCount,
        totalUnderTime,
        totalUnderTimeCount,
        totalLeaves,
        totalAbsents,
      };
    }, [logs, schedule]);

    // Format helper for dates (e.g. "01 Mon")
    const formatDateLabel = (dateStr: string) => {
      try {
        const d = new Date(dateStr);
        const dayNum = String(d.getDate()).padStart(2, "0");
        const dayOfWeek = d.toLocaleDateString("en-US", { weekday: "short" });
        return { dayNum, dayOfWeek };
      } catch {
        return { dayNum: dateStr, dayOfWeek: "" };
      }
    };

    // Render helper for single cell with hover edit triggers
    const renderTimeCell = (
      date: string,
      time?: string,
      slotKey: string = "in",
      isWeekendOrHoliday: boolean = false,
    ) => {
      const hasAdjustment = !!onFileAdjustment || !!onSaveAdjustment;

      if (!time) {
        if (isWeekendOrHoliday)
          return <span className="text-muted-foreground/30">-</span>;

        return (
          <div className="group relative flex items-center justify-center min-h-9 w-full">
            <span className="text-red-500/70 font-semibold text-xs transition-opacity group-hover:opacity-0">
              ---
            </span>
            {hasAdjustment && (
              <button
                onClick={() => handleSlotClick(date, slotKey, time)}
                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-primary/10 rounded-md text-primary text-[10px] font-bold gap-1 shadow-xs border border-primary/20"
                title={`Request adjustment for ${slotKey}`}
              >
                <FileEdit className="h-3 w-3" />
                <span>Adjust</span>
              </button>
            )}
          </div>
        );
      }

      return (
        <div className="group relative flex items-center justify-center min-h-9 w-full">
          <span className="text-foreground transition-opacity group-hover:opacity-30">
            {time}
          </span>
          {hasAdjustment && (
            <button
              onClick={() => handleSlotClick(date, slotKey, time)}
              className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-muted/80 rounded-md text-muted-foreground text-[10px] font-medium gap-1 border"
              title={`Edit log for ${slotKey}`}
            >
              <FileEdit className="h-3 w-3 text-primary" />
              <span className="text-primary font-bold">Edit</span>
            </button>
          )}
        </div>
      );
    };

    return (
      <TooltipProvider>
        <Card
          ref={ref}
          className={cn("w-full shadow-md overflow-hidden", className)}
          {...props}
        >
          {/* Card Header: Metadata Block */}
          <CardHeader className="border-b bg-muted/20 pb-4 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                  <UserCircle className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold tracking-tight text-foreground">
                    {employeeName}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-muted-foreground mt-0.5">
                    <span className="font-semibold text-foreground/80">
                      {position}
                    </span>
                    <span className="text-muted-foreground/40">•</span>
                    <span>{department}</span>
                    <span className="text-muted-foreground/40">•</span>
                    <span className="font-mono">ID: {employeeId}</span>
                  </div>
                </div>
              </div>

              {/* Month Selection Badge */}
              <div className="flex items-center gap-2 self-start md:self-center text-nowrap">
                <Badge
                  variant="outline"
                  className="h-8 px-3 rounded-lg border-primary/20 bg-primary/5 text-primary text-xs font-semibold gap-1.5"
                >
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{month}</span>
                </Badge>
              </div>
            </div>

            {/* Aggregated Stats Overview Bar */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
              {/* Stat 1: Worked Days */}
              <div className="flex items-center gap-3 p-3 rounded-xl border bg-card/50">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Days Worked
                  </div>
                  <div className="text-base font-bold mt-0.5">
                    {stats.daysWorked}{" "}
                    <span className="text-xs text-muted-foreground font-normal">
                      / {logs.length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stat 2: Hours Rendered */}
              <div className="flex items-center gap-3 p-3 rounded-xl border bg-card/50">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Hours Rendered
                  </div>
                  <div className="text-base font-bold mt-0.5">
                    {stats.totalHours}{" "}
                    <span className="text-xs text-muted-foreground font-normal">
                      hrs
                    </span>
                  </div>
                </div>
              </div>

              {/* Stat 3: Late / Undertime */}
              <div className="flex items-center gap-3 p-3 rounded-xl border bg-card/50">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Late / Undertime
                  </div>
                  <div className="text-base font-bold mt-0.5">
                    {stats.totalLates}{" "}
                    <span className="text-xs text-muted-foreground font-normal">
                      m
                    </span>
                    <span className="text-muted-foreground/40 mx-1.5">|</span>
                    {stats.totalUnderTime}{" "}
                    <span className="text-xs text-muted-foreground font-normal">
                      m
                    </span>
                  </div>
                </div>
              </div>

              {/* Stat 4: Leaves & Absences */}
              <div className="flex items-center gap-3 p-3 rounded-xl border bg-card/50">
                <div className="p-2 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400">
                  <FileText className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Leaves / Absences
                  </div>
                  <div className="text-base font-bold mt-0.5">
                    {stats.totalLeaves}{" "}
                    <span className="text-xs text-muted-foreground font-normal">
                      LV
                    </span>
                    <span className="text-muted-foreground/40 mx-1.5">|</span>
                    {stats.totalAbsents}{" "}
                    <span className="text-xs text-muted-foreground font-normal">
                      AB
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>

          {/* DTR Grid Table */}
          <CardContent className="p-0">
            <div className="overflow-x-auto w-full">
              <table className="w-full text-center border-collapse min-w-[700px] text-xs">
                <thead>
                  <tr className="bg-muted/50 border-b text-muted-foreground uppercase font-bold tracking-wider text-[10px] select-none">
                    <th className="py-3 px-4 text-left w-[100px]">Date</th>
                    {schedule.slots.map((slot) => (
                      <th key={slot.key} className="py-3 px-2 border-l">{slot.label}</th>
                    ))}
                    <th className="py-3 px-2 border-l">Overtime</th>
                    <th className="py-3 px-2 border-l w-[80px]">Total</th>
                    <th className="py-3 px-4 border-l text-right w-[150px]">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {logs.map((log) => {
                    const { dayNum, dayOfWeek } = formatDateLabel(log.date);

                    const isWeekend = log.status === "weekend";
                    const isHoliday = log.status === "holiday";
                    const isLeave = log.status === "leave";
                    const isAbsent = log.status === "absent";

                    const isWeekendOrHoliday = isWeekend || isHoliday;

                    // Row colors
                    let rowBg = "hover:bg-muted/30 transition-colors";
                    if (isWeekend)
                      rowBg =
                        "bg-muted/30 text-muted-foreground/70 hover:bg-muted/40 transition-colors";
                    if (isHoliday)
                      rowBg =
                        "bg-amber-500/5 hover:bg-amber-500/10 border-amber-500/10 text-foreground transition-colors";
                    if (isLeave)
                      rowBg =
                        "bg-violet-500/5 hover:bg-violet-500/10 border-violet-500/10 transition-colors";
                    if (isAbsent)
                      rowBg =
                        "bg-rose-500/5 hover:bg-rose-500/10 border-rose-500/10 transition-colors";

                    return (
                      <tr key={log.date} className={cn("group/row", rowBg)}>
                        {/* 1. Date Col */}
                        <td className="py-2.5 px-4 font-mono font-medium text-left">
                          <span className="text-foreground font-bold">
                            {dayNum}
                          </span>
                          <span className="text-muted-foreground/60 ml-2 font-sans text-[10px] uppercase select-none">
                            {dayOfWeek}
                          </span>
                        </td>

                        {/* Dynamic schedule slot columns */}
                        {schedule.slots.map((slot) => {
                          const time = log.punches[slot.key];
                          const firstInSlot = schedule.slots.find((s) => s.type === "in");
                          const lastOutSlot = [...schedule.slots].reverse().find((s) => s.type === "out");
                          const isFirstIn = slot.key === firstInSlot?.key;
                          const isLastOut = slot.key === lastOutSlot?.key;

                          const showTardiness = isFirstIn && !!log.tardinessMinutes;
                          const showUndertime = isLastOut && !!log.undertimeMinutes;

                          if (showTardiness) {
                            return (
                              <td
                                key={slot.key}
                                className={cn(
                                  "py-1 px-2 border-l font-mono",
                                  "text-amber-500 font-bold",
                                )}
                              >
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="cursor-help">
                                      {renderTimeCell(
                                        log.date,
                                        time,
                                        slot.key,
                                        isWeekendOrHoliday,
                                      )}
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent
                                    className="text-xs p-2 max-w-[200px]"
                                    side="top"
                                  >
                                    <span className="font-semibold text-amber-500">
                                      Tardy / Late Clock-In
                                    </span>
                                    : {log.tardinessMinutes} minutes late.
                                  </TooltipContent>
                                </Tooltip>
                              </td>
                            );
                          }

                          if (showUndertime) {
                            return (
                              <td
                                key={slot.key}
                                className={cn(
                                  "py-1 px-2 border-l font-mono",
                                  "text-amber-500 font-bold",
                                )}
                              >
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="cursor-help">
                                      {renderTimeCell(
                                        log.date,
                                        time,
                                        slot.key,
                                        isWeekendOrHoliday,
                                      )}
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent
                                    className="text-xs p-2 max-w-[200px]"
                                    side="top"
                                  >
                                    <span className="font-semibold text-amber-500">
                                      Undertime / Early Out
                                    </span>
                                    : {log.undertimeMinutes} minutes undertime.
                                  </TooltipContent>
                                </Tooltip>
                              </td>
                            );
                          }

                          return (
                            <td key={slot.key} className="py-1 px-2 border-l font-mono">
                              {renderTimeCell(
                                log.date,
                                time,
                                slot.key,
                                isWeekendOrHoliday,
                              )}
                            </td>
                          );
                        })}

                        {/* Overtime Col */}
                        <td className="py-1 px-2 border-l font-mono">
                          {log.overtimeIn && log.overtimeOut ? (
                            <span className="text-blue-500 font-medium">
                              {log.overtimeIn} - {log.overtimeOut}
                            </span>
                          ) : (
                            <span className="text-muted-foreground/30">-</span>
                          )}
                        </td>

                        {/* Total Daily Hours */}
                        <td className="py-2.5 px-2 border-l font-mono font-semibold">
                          {!isWeekendOrHoliday && !isLeave && !isAbsent ? (
                            <span>
                              {computeDayHours(log, schedule).toFixed(1)}
                            </span>
                          ) : (
                            <span className="text-muted-foreground/30">-</span>
                          )}
                        </td>

                        {/* 8. Status Badge Col */}
                        <td className="py-2.5 px-4 border-l text-right">
                          {isHoliday && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Badge
                                  variant="outline"
                                  className="cursor-help rounded-md px-1.5 py-0.5 border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-[9px] uppercase tracking-wider"
                                >
                                  Holiday
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent side="left">
                                <span className="font-bold">
                                  {log.holidayName}
                                </span>{" "}
                                (Paid Legal Holiday)
                              </TooltipContent>
                            </Tooltip>
                          )}

                          {isWeekend && (
                            <Badge
                              variant="outline"
                              className="rounded-md px-1.5 py-0.5 border-muted-foreground/10 bg-muted/10 text-muted-foreground/80 text-[9px] uppercase tracking-wider font-semibold"
                            >
                              Weekend
                            </Badge>
                          )}

                          {isLeave && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Badge
                                  variant="outline"
                                  className="cursor-help rounded-md px-1.5 py-0.5 border-violet-500/30 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold text-[9px] uppercase tracking-wider"
                                >
                                  On Leave
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent side="left">
                                <span className="font-bold">
                                  {log.leaveType}
                                </span>{" "}
                                - Approved leave of absence.
                              </TooltipContent>
                            </Tooltip>
                          )}

                          {isAbsent && (
                            <Badge
                              variant="destructive"
                              className="rounded-md px-1.5 py-0.5 font-bold text-[9px] uppercase tracking-wider"
                            >
                              Absent
                            </Badge>
                          )}

                          {log.status === "late" && (
                            <Badge
                              variant="outline"
                              className="rounded-md px-1.5 py-0.5 border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-[9px] uppercase tracking-wider"
                            >
                              Late
                            </Badge>
                          )}

                          {log.status === "undertime" && (
                            <Badge
                              variant="outline"
                              className="rounded-md px-1.5 py-0.5 border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-[9px] uppercase tracking-wider"
                            >
                              Undertime
                            </Badge>
                          )}

                          {log.status === "regular" && (
                            <Badge
                              variant="outline"
                              className="rounded-md px-1.5 py-0.5 border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[9px] uppercase tracking-wider"
                            >
                              Regular
                            </Badge>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetContent className="sm:max-w-md h-full flex flex-col p-6">
            {!showSuccess ? (
              <form
                onSubmit={handleSubmitCorrection}
                className="flex-1 flex flex-col justify-between min-h-0"
              >
                <div className="space-y-6">
                  <SheetHeader className="px-0 pt-0 pb-2">
                    <SheetTitle className="text-base font-bold tracking-tight">
                      DTR Adjustment Slip
                    </SheetTitle>
                    <SheetDescription className="text-xs">
                      File a correction request for biometric time log
                      anomalies.
                    </SheetDescription>
                  </SheetHeader>

                  <div className="space-y-4 pt-2">
                    {/* Date details */}
                    <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/20 text-xs">
                      <CalendarDays className="h-4 w-4 text-primary shrink-0" />
                      <div>
                        <div className="font-semibold text-muted-foreground">
                          Target Date
                        </div>
                        <div className="font-bold text-foreground mt-0.5">
                          {targetDate}
                        </div>
                      </div>
                    </div>

                    {/* Punch Field Input */}
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Log Slot</Label>
                      <div className="bg-muted px-3 py-2 rounded-lg text-xs font-mono font-bold text-primary uppercase select-none w-fit">
                        {schedule.slots.find((s) => s.key === targetField)?.label ?? targetField}
                      </div>
                    </div>

                    {/* Time input */}
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="correctedTime"
                        className="text-xs font-semibold"
                      >
                        Corrected Time
                      </Label>
                      <Input
                        id="correctedTime"
                        type="time"
                        value={correctedTime}
                        onChange={(e) => setCorrectedTime(e.target.value)}
                        className="text-xs h-9 rounded-lg block w-full"
                        required
                      />
                    </div>

                    {/* Predefined Reasons */}
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">
                        Reason Category
                      </Label>
                      <select
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-xs shadow-xs transition-colors file:border-0 file:bg-transparent file:text-xs file:font-medium placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="Biometric reader sync error">
                          Biometric device reader error
                        </option>
                        <option value="Forgot to log">
                          Forgot to tap / log in
                        </option>
                        <option value="Official Business (OB)">
                          Official Business / Field work
                        </option>
                        <option value="Emergency Leave extension">
                          Emergency local task
                        </option>
                      </select>
                    </div>

                    {/* Justification remarks */}
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="justification"
                        className="text-xs font-semibold"
                      >
                        Justification / Remarks
                      </Label>
                      <Textarea
                        id="justification"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Explain the context of this adjustment request..."
                        className="text-xs rounded-lg min-h-[90px] resize-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-6 border-t mt-auto shrink-0 w-full">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsSheetOpen(false)}
                    className="flex-1 text-xs h-9 rounded-lg"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 text-xs h-9 rounded-lg gap-1.5"
                  >
                    <Check className="h-4 w-4" />
                    <span>{isSubmitting ? "Saving..." : "Save"}</span>
                  </Button>
                </div>
              </form>
            ) : (
              <div className="h-full flex flex-col justify-center items-center text-center p-6 space-y-4">
                <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-full">
                  <CheckCircle2 className="h-10 w-10 animate-bounce" />
                </div>
                <div className="space-y-1.5">
                  <h4 className="text-base font-bold text-foreground">
                    Adjustment Request Filed!
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed max-w-[280px]">
                    Your request has been routed to{" "}
                    <strong>HR Administrative Review</strong> and applied
                    locally in your feed.
                  </p>
                </div>
                <div className="pt-4 w-full">
                  <Button
                    onClick={() => setIsSheetOpen(false)}
                    className="w-full text-xs h-9 rounded-lg"
                  >
                    Return to Dashboard
                  </Button>
                </div>
              </div>
            )}
          </SheetContent>
        </Sheet>
      </TooltipProvider>
    );
  },
);

DailyTimeRecord.displayName = "DailyTimeRecord";

// ─── Preset Schedules ───────────────────────────────────────────────────────

export const SCHEDULE_STANDARD: ScheduleConfig = {
  name: "Standard 8-5",
  slots: [
    { key: "amIn",  label: "AM In",  expectedTime: "08:00", type: "in" },
    { key: "amOut", label: "AM Out", expectedTime: "12:00", type: "out" },
    { key: "pmIn",  label: "PM In",  expectedTime: "13:00", type: "in" },
    { key: "pmOut", label: "PM Out", expectedTime: "17:00", type: "out" },
  ],
  expectedDailyHours: 8,
  breakMinutes: 60,
  tardinessGraceMinutes: 15,
};

export const SCHEDULE_STRAIGHT: ScheduleConfig = {
  name: "Straight Shift",
  slots: [
    { key: "in",  label: "Time In",  expectedTime: "08:00", type: "in" },
    { key: "out", label: "Time Out", expectedTime: "17:00", type: "out" },
  ],
  expectedDailyHours: 8,
  breakMinutes: 60,
  tardinessGraceMinutes: 15,
};

export const SCHEDULE_NIGHT: ScheduleConfig = {
  name: "Night Shift (10PM-6AM)",
  slots: [
    { key: "nightIn",  label: "Night In",   expectedTime: "22:00", type: "in" },
    { key: "nightOut", label: "Morning Out", expectedTime: "06:00", type: "out" },
  ],
  expectedDailyHours: 8,
  breakMinutes: 0,
  tardinessGraceMinutes: 15,
};
