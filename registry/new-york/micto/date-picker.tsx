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

export interface DatePickerProps {
  value?: string | Date
  onChange?: (dateString: string) => void
  placeholder?: string
  className?: string
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  className,
}: DatePickerProps) {
  const dateValue = React.useMemo(() => {
    if (!value) {
      return undefined
    }
    if (value instanceof Date) {
      return value
    }
    const parsed = parseISO(value)
    return isValid(parsed) ? parsed : new Date(value)
  }, [value])

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      // Format in local timezone to avoid offset shift (YYYY-MM-DD HH:mm)
      const formatted = format(date, "yyyy-MM-dd HH:mm")
      onChange?.(formatted)
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal h-9 text-xs px-3",
            !dateValue && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
          {dateValue && isValid(dateValue) ? (
            format(dateValue, "PPP")
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={dateValue}
          onSelect={handleSelect}
          captionLayout="dropdown"
        />
      </PopoverContent>
    </Popover>
  )
}
