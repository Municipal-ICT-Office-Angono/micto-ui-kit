"use client";

import * as React from "react";
import {
  DailyTimeRecord,
  DtrLogEntry,
  SCHEDULE_STANDARD,
} from "@/components/micto/daily-time-record";
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";

// Mock initial half-month log dataset
const initialLogs: DtrLogEntry[] = [
  {
    date: "2026-10-01",
    punches: { amIn: "07:52 AM", amOut: "12:02 PM", pmIn: "12:58 PM", pmOut: "05:04 PM" },
    status: "regular",
  },
  {
    date: "2026-10-02",
    punches: { amIn: "07:48 AM", amOut: "12:01 PM", pmIn: "12:55 PM", pmOut: "05:02 PM" },
    status: "regular",
  },
  {
    date: "2026-10-03", // Saturday
    punches: {},
    status: "weekend",
  },
  {
    date: "2026-10-04", // Sunday
    punches: {},
    status: "weekend",
  },
  {
    date: "2026-10-05",
    punches: { amIn: "08:15 AM", amOut: "12:03 PM", pmIn: "12:59 PM", pmOut: "05:01 PM" },
    tardinessMinutes: 15,
    status: "late",
  },
  {
    date: "2026-10-06",
    punches: { amIn: "07:54 AM", amOut: "12:02 PM", pmIn: "01:00 PM", pmOut: "05:03 PM" },
    status: "regular",
  },
  {
    date: "2026-10-07",
    punches: { amIn: "07:50 AM", amOut: "12:05 PM", pmIn: "12:58 PM", pmOut: "05:00 PM" },
    status: "regular",
  },
  {
    date: "2026-10-08", // Holiday
    punches: {},
    status: "holiday",
    holidayName: "National Heroes Day",
  },
  {
    date: "2026-10-09", // Sick Leave
    punches: {},
    status: "leave",
    leaveType: "Sick Leave",
  },
  {
    date: "2026-10-10", // Weekend
    punches: {},
    status: "weekend",
  },
  {
    date: "2026-10-11", // Weekend
    punches: {},
    status: "weekend",
  },
  {
    date: "2026-10-12", // Missing AM log (forgot to clock in)
    punches: { amOut: "12:01 PM", pmIn: "12:56 PM", pmOut: "05:03 PM" },
    status: "regular",
  },
  {
    date: "2026-10-13",
    punches: { amIn: "07:53 AM", amOut: "12:02 PM", pmIn: "12:57 PM", pmOut: "05:05 PM" },
    status: "regular",
  },
  {
    date: "2026-10-14",
    punches: { amIn: "07:55 AM", amOut: "12:01 PM", pmIn: "12:58 PM", pmOut: "04:30 PM" },
    undertimeMinutes: 30,
    status: "undertime",
  },
  {
    date: "2026-10-15",
    punches: { amIn: "07:51 AM", amOut: "12:03 PM", pmIn: "12:59 PM", pmOut: "05:04 PM" },
    status: "regular",
  },
];

export default function DailyTimeRecordDemo() {
  const [logs, setLogs] = React.useState<DtrLogEntry[]>(initialLogs);

  // Submit DTR correction request internally
  const handleSaveAdjustment = (
    date: string,
    slotKey: string,
    correctedTime: string,
    _reason: string,
    _notes: string,
  ) => {
    return new Promise<void>((resolve) => {
      console.log(
        `Saving DTR adjustment for ${date} [${slotKey}] to: ${correctedTime}. Reason: ${_reason}, Notes: ${_notes}`,
      );
      // Simulate API delay
      setTimeout(() => {
        // Dynamically update the DTR logs in state!
        setLogs((prevLogs) =>
          prevLogs.map((log) => {
            if (log.date === date) {
              const firstInKey = SCHEDULE_STANDARD.slots.find((s) => s.type === "in")?.key;
              const lastOutKey = [...SCHEDULE_STANDARD.slots].reverse().find((s) => s.type === "out")?.key;

              return {
                ...log,
                punches: {
                  ...log.punches,
                  [slotKey]: correctedTime,
                },
                // If it had custom late/undertime minutes, we reset it
                tardinessMinutes:
                  slotKey === firstInKey ? undefined : log.tardinessMinutes,
                undertimeMinutes:
                  slotKey === lastOutKey ? undefined : log.undertimeMinutes,
                status:
                  log.status === "late" && slotKey === firstInKey
                    ? "regular"
                    : log.status === "undertime" && slotKey === lastOutKey
                      ? "regular"
                      : log.status,
              };
            }
            return log;
          }),
        );
        resolve();
      }, 500);
    });
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-muted/40 p-4 rounded-xl border">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-primary/10 text-primary rounded-lg shrink-0 mt-0.5">
            <Info className="h-4 w-4" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
              DTR Portal Interactive Demo
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Hover over or click the{" "}
              <span className="text-red-500 font-semibold">---</span> in{" "}
              <strong>Oct 12</strong> (AM In log missing) to file a DTR
              adjustment request. You can also click the edit triggers on
              existing logs.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
          <Badge
            variant="outline"
            className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400"
          >
            Active Biometric Feed
          </Badge>
        </div>
      </div>

      {/* Core DTR Component with Embedded Sliding Sheet Drawer */}
      <DailyTimeRecord
        employeeId="2026-1082"
        employeeName="Nehry Dedoro"
        department="Municipal Information and Communications Technology Office (MICTO)"
        position="Lead Systems Developer"
        month="October 2026"
        schedule={SCHEDULE_STANDARD}
        logs={logs}
        onSaveAdjustment={handleSaveAdjustment}
      />
    </div>
  );
}
