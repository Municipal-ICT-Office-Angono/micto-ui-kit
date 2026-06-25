/**
 * @title Date Picker
 * @description A popover-based calendar date selection input field supporting formatted dates.
 * @categories react, component, date-picker
 */
import * as React from "react"
import { format, parseISO, isValid } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import type { DateRange } from "react-day-picker"

// Range-specific props
export interface DatePickerProps {
  mode: "single" | "range"
  value?: string | Date | DateRange
  placeholder?: string
  className?: string
  onChange?: (date: string | DateRange | undefined) => void
}

// Discriminated Union (Combined)
// export type DatePickerProps = SingleDatePickerProps | RangeDatePickerProps

export function DatePicker(
  {
    mode = "single",
    value,
    placeholder,
    className,
    onChange
  }: DatePickerProps) {
  const singleDateValue = React.useMemo(() => {
    if (mode !== "single" || !value) return undefined

    if (value instanceof Date) return value

    if (typeof value === "string") {
      const parsed = parseISO(value)
      return isValid(parsed) ? parsed : new Date(value)
    }

    return undefined
  }, [mode, value])

  const rangeDateValue = React.useMemo(() => {
    if (mode !== "range" || !value) return undefined
    return value as DateRange | undefined

  }, [mode, value])

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      // Format in local timezone to avoid offset shift (YYYY-MM-DD HH:mm)
      const formatted = format(date, "yyyy-MM-dd HH:mm")
      onChange?.(formatted)
    }
  };

  const renderButtonText = () => {
    if (mode === "range") {
      if (rangeDateValue?.from) {
        return rangeDateValue.to ? (
          <>
            {format(rangeDateValue.from, "LLL dd, y")} -{" "}
            {format(rangeDateValue.to, "LLL dd, y")}
          </>
        ) : (
          format(rangeDateValue.from, "LLL dd, y")
        )
      }
      return <span>{placeholder || "Pick a date range"}</span>
    }

    // Single mode text formatting
    return singleDateValue && isValid(singleDateValue) ? (
      format(singleDateValue, "PPP")
    ) : (
      <span>{placeholder || "Pick a date"}</span>
    )
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal h-9 text-xs px-3",
              // !dateValue && "text-muted-foreground",
              mode === "range" ? "w-[260px]" : "w-full",
              ((mode === "single" && !singleDateValue) || (mode === "range" && !rangeDateValue)) && "text-muted-foreground",
              className
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
            {/* {dateValue && isValid(dateValue) ? (
            format(dateValue, "PPP")
          ) : (
            <span>{placeholder}</span>
          )} */}
            {renderButtonText()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          {/* <Calendar
          mode={mode}
          selected={dateValue}
          onSelect={handleSelect}
          captionLayout="dropdown"
        /> */}
          {mode === "range" ? (
            <Calendar
              mode="range"
              defaultMonth={rangeDateValue?.from}
              selected={rangeDateValue}
              onSelect={(range) => {
                // Narrowing types safely inside conditional block
                if (mode === "range") {
                  onChange?.(range)
                }
              }}
              numberOfMonths={2}
              captionLayout="dropdown"
            />
          ) : (
            <Calendar
              mode="single"
              selected={singleDateValue}
              onSelect={(date) => {
                if (mode === "single" || !mode) {
                  if (date) {
                    const formatted = format(date, "yyyy-MM-dd HH:mm")
                    onChange?.(formatted)
                  }
                }
              }}
              captionLayout="dropdown"
            />
          )}
        </PopoverContent>
      </Popover>
    </div>
  )
}