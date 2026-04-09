import { getStatusLabel, getStatusTone } from "@/lib/utils";
import { AppointmentStatus } from "@/lib/types";

export function StatusBadge({ status }: { status: AppointmentStatus }) {
  return (
    <span
      className={`inline-flex self-start whitespace-nowrap rounded-full border px-3 py-1 text-xs font-medium ${getStatusTone(status)}`}
    >
      {getStatusLabel(status)}
    </span>
  );
}
