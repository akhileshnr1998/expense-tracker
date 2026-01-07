import { useEffect, useMemo, useRef, useState } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

function toLocalDateString(date) {
  const offsetMs = date.getTimezoneOffset() * 60 * 1000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 10);
}

function parseDate(value) {
  if (!value) return undefined;
  const parsed = new Date(`${value}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

function formatDisplay(value) {
  if (!value) return 'Select date';
  const [year, month, day] = value.split('-');
  if (!year || !month || !day) return value;
  return `${day}-${month}-${year}`;
}

export default function DatePicker({ label, value, onChange, minDate, maxDate }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);
  const popoverRef = useRef(null);

  const selectedDate = useMemo(() => parseDate(value), [value]);

  useEffect(() => {
    function handleClick(event) {
      if (!popoverRef.current || !triggerRef.current) return;
      if (popoverRef.current.contains(event.target) || triggerRef.current.contains(event.target)) {
        return;
      }
      setOpen(false);
    }

    function handleKey(event) {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, []);

  function handleSelect(date) {
    if (!date) return;
    onChange(toLocalDateString(date));
    setOpen(false);
  }

  return (
    <label className="date-field">
      {label}
      <button
        className="date-trigger"
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="dialog"
        ref={triggerRef}
      >
        <span className="date-value">{formatDisplay(value)}</span>
        <span className="date-icon" aria-hidden="true" />
      </button>
      <div
        className={`date-popover ${open ? 'open' : ''}`}
        ref={popoverRef}
        role="dialog"
      >
        <DayPicker
          mode="single"
          selected={selectedDate}
          disabled={[
            minDate ? { before: minDate } : undefined,
            maxDate ? { after: maxDate } : undefined,
          ].filter(Boolean)}
          onSelect={handleSelect}
        />
      </div>
    </label>
  );
}
