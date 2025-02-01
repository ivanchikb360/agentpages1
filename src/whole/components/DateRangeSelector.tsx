import React from "react"
import { Calendar } from "lucide-react"
import { Button } from "../components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover"
import { Calendar as CalendarComponent } from "../components/ui/calendar"

interface DateRangeSelectorProps {
  startDate: Date
  endDate: Date
  onRangeChange: (start: Date, end: Date) => void
}

export function DateRangeSelector({ startDate, endDate, onRangeChange }: DateRangeSelectorProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [tempStart, setTempStart] = React.useState<Date | undefined>(startDate)
  const [tempEnd, setTempEnd] = React.useState<Date | undefined>(endDate)

  const handleSelect = (date: Date | undefined) => {
    if (!tempStart || (tempStart && tempEnd)) {
      setTempStart(date)
      setTempEnd(undefined)
    } else if (date && date > tempStart) {
      setTempEnd(date)
    } else {
      setTempEnd(tempStart)
      setTempStart(date)
    }
  }

  const handleApply = () => {
    if (tempStart && tempEnd) {
      onRangeChange(tempStart, tempEnd)
      setIsOpen(false)
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
          <Calendar className="mr-2 h-4 w-4 flex-shrink-0" />
          <span className="truncate">
            {startDate.toDateString()} - {endDate.toDateString()}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <CalendarComponent
          mode="range"
          selected={{ from: tempStart, to: tempEnd }}
          onSelect={handleSelect}
          numberOfMonths={2}
        />
        <div className="flex justify-end gap-2 p-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleApply}>Apply</Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

