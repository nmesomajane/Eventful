import { Bell } from "lucide-react";
import { REMINDER_OPTIONS } from "../types/reminder.types";

interface Props {
  selected: number[];
  onChange: (offsets: number[]) => void;
}

export default function ReminderPicker({ selected, onChange }: Props) {
  const toggle = (minutes: number) => {
    const next = selected.includes(minutes) ? selected.filter((m) => m !== minutes) : [...selected, minutes];
    console.log("[ReminderPicker] toggled offset:", minutes, "→", next);
    onChange(next);
  };

  return (
    <div>
      <div className="mb-2 flex items-center gap-1.5 text-sm font-medium text-gray-700">
        <Bell className="h-4 w-4" /> Reminders
      </div>
      <div className="flex flex-wrap gap-2">
        {REMINDER_OPTIONS.map((opt) => (
          <button
            key={opt.minutes}
            type="button"
            onClick={() => toggle(opt.minutes)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
              selected.includes(opt.minutes) ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}