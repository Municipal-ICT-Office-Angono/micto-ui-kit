"use client";

import * as React from "react";
import { DatePicker } from "@/components/micto/date-picker";
import { addDays, format } from "date-fns";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { DateRange } from "react-day-picker";

export default function DatePickerDemo() {
  type DynamicDateState = string | DateRange | undefined
  const [date, setDate] = React.useState<DynamicDateState>();
  const [selectedVariant, setSelectedVariant] = React.useState<"single" | "range">("single");

  return (
    <div className="flex flex-col">
      <div className="flex bg-muted p-1 rounded-lg border text-xs gap-1 font-medium select-none">
        <button
          onClick={() => {
            setSelectedVariant("single");
          }}
          className={`px-3 py-1.5 rounded-md transition-all ${selectedVariant === "single"
            ? "bg-background text-foreground shadow-xs font-semibold"
            : "text-muted-foreground hover:text-foreground"
            }`}
        >
          Single Date Picker
        </button>
        <button
          onClick={() => {
            setSelectedVariant("range");
          }}
          className={`px-3 py-1.5 rounded-md transition-all ${selectedVariant === "range"
            ? "bg-background text-foreground shadow-xs font-semibold"
            : "text-muted-foreground hover:text-foreground"
            }`}
        >
          Date Picker With Range
        </button>
      </div>
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
            mode={selectedVariant}
            value={date}
            onChange={setDate}
            placeholder="Select policy date"
          />
          {
            typeof date === "string" ?
              date && (
                <div className="rounded-lg bg-muted/50 p-3 border text-center transition-all animate-in fade-in zoom-in-95 duration-200">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                    Selected Value (String)
                  </span>
                  <code className="text-xs font-mono text-primary font-medium block mt-1">
                    {date.toString()}
                  </code>
                </div>
              ) : date?.from && (
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
    </div>
  );
}
