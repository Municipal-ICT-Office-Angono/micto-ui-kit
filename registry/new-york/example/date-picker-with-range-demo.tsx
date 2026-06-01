"use client";

import * as React from "react";
import { DateRange } from "react-day-picker";
import { addDays, format } from "date-fns";
import { DatePickerWithRange } from "@/components/micto/date-picker-with-range";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function DatePickerWithRangeDemo() {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });

  return (
    <div className="flex items-center justify-center p-8 w-full max-w-lg mx-auto">
      <Card className="w-full p-6 space-y-4 shadow-lg border-primary/10">
        <div className="space-y-1">
          <Label className="text-sm font-semibold tracking-tight text-foreground">
            Select Date Range
          </Label>
          <p className="text-xs text-muted-foreground">
            Select the start and end dates for the official leave or project timeline.
          </p>
        </div>
        
        <div className="flex justify-start">
          <DatePickerWithRange
            value={date}
            onChange={setDate}
          />
        </div>

        {date?.from && (
          <div className="rounded-lg bg-muted/50 p-3 border space-y-2 transition-all animate-in fade-in zoom-in-95 duration-200">
            <div className="grid grid-cols-2 gap-4 text-center divide-x">
              <div>
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">
                  Start Date
                </span>
                <code className="text-xs font-mono text-primary font-medium block mt-1">
                  {format(date.from, "yyyy-MM-dd")}
                </code>
              </div>
              <div>
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">
                  End Date
                </span>
                <code className="text-xs font-mono text-primary font-medium block mt-1">
                  {date.to ? format(date.to, "yyyy-MM-dd") : "Not selected"}
                </code>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
