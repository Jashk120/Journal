import { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { Calendar } from '../ui/calendar';
import { TimePicker } from './time-picker';

function DateTimePickerForm({ selectedDate, onDateChange, disabled, className = '' }) {
  const popoverRef = useRef(null);
  const [openAbove, setOpenAbove] = useState(false);

  useEffect(() => {
    const handlePosition = () => {
      if (popoverRef.current) {
        const rect = popoverRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;

        // Toggle openAbove based on available space
        setOpenAbove(spaceBelow < 300 && spaceAbove > 300); // Adjust 300 based on component height
      }
    };

    handlePosition();
    window.addEventListener('resize', handlePosition);
    return () => window.removeEventListener('resize', handlePosition);
  }, []);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={`w-[280px] justify-start text-left font-normal ${
            !selectedDate ? 'text-muted-foreground' : ''
          } ${disabled ? 'cursor-not-allowed opacity-50' : ''} ${className}`}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selectedDate ? (
            format(selectedDate, 'dd/MM/yyyy HH:mm:ss')
          ) : (
            <span>Pick a date and time</span>
          )}
        </Button>
      </PopoverTrigger>
      {!disabled && (
        <PopoverContent
          ref={popoverRef}
          className={`w-auto p-0 ${openAbove ? 'bottom-full mb-2' : 'top-full mt-2'} ${className}`}
        >
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={onDateChange}
            disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
            initialFocus
          />
          <div className="p-3 border-t border-border">
            <TimePicker setDate={onDateChange} date={selectedDate} disabled={disabled} />
          </div>
        </PopoverContent>
      )}
    </Popover>
  );
}

export default DateTimePickerForm;
