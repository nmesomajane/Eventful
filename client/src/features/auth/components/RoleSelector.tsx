import type { Role } from "../../../types/auth.types";

interface Props {
  value: Role;
  onChange: (role: Role) => void;
}

export default function RoleSelector({ value, onChange }: Props) {
  const options: { label: string; value: Role; desc: string }[] = [
    { label: "Attendee", value: "attendee", desc: "Discover and attend events" },
    { label: "Organizer", value: "organizer", desc: "Create and manage events" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`rounded-lg border p-3 text-left transition ${
            value === opt.value ? "border-blue-600 bg-blue-50" : "border-gray-200"
          }`}
        >
          <div className="font-medium">{opt.label}</div>
          <div className="text-sm text-gray-500">{opt.desc}</div>
        </button>
      ))}
    </div>
  );
}