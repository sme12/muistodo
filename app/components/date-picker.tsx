import { useNavigate } from "@tanstack/react-router";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { cn } from "~/lib/utils";

export default function DatePicker({ initialDate }: { initialDate: string }) {
  const navigate = useNavigate({ from: "/" });
  const [open, setOpen] = useState(false);

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      navigate({
        search: { date: format(date, "yyyy-MM-dd") },
      });
    } else {
      navigate({
        search: undefined,
      });
    }
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !initialDate && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {initialDate ? format(initialDate, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={initialDate ? new Date(initialDate) : undefined}
          onSelect={handleDateChange}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
