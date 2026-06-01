"use client";

import * as React from "react";
import { DatePicker } from "@/components/micto/date-picker";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function DatePickerDemo() {
  const [date, setDate] = React.useState<string>("");

  return (
    <div className="flex items-center justify-center p-8 w-full max-w-md mx-auto">
      <Card className="w-full p-6 space-y-4 shadow-lg border-primary/10">
        <div className="space-y-1">
          <Label className="text-sm font-semibold tracking-tight text-foreground">
            Select Effective Date
          </Label>
          <p className="text-xs text-muted-foreground">
            Choose the official implementation date for the department policy.
          </p>
        </div>
        <DatePicker
          value={date}
          onChange={setDate}
          placeholder="Select policy date"
        />
        {date && (
          <div className="rounded-lg bg-muted/50 p-3 border text-center transition-all animate-in fade-in zoom-in-95 duration-200">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
              Selected Value (String)
            </span>
            <code className="text-xs font-mono text-primary font-medium block mt-1">
              {date}
            </code>
          </div>
        )}
      </Card>
    </div>
  );
}
