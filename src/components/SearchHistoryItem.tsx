import type { HistoryEntry } from "../types/weather";
import { cn } from "../utils/cn";
import { formatLocalTime } from "../utils/formatDateTime";
import { SearchIcon, TrashIcon } from "./icons";

interface SearchHistoryItemProps {
  entry: HistoryEntry;
  onSearch: (entry: HistoryEntry) => void;
  onDelete: (id: string) => void;
  disabled: boolean;
}

export function SearchHistoryItem({ entry, onSearch, onDelete, disabled }: SearchHistoryItemProps) {
  const place = `${entry.city}, ${entry.countryCode}`;

  return (
    <li className="border-input-border bg-input flex items-center gap-3 rounded-2xl border px-4 py-3">
      <div className="min-w-0 flex-1">
        <p className="text-heading truncate font-medium">{place}</p>
        <p className="text-muted text-xs">{formatLocalTime(entry.searchedAt)}</p>
      </div>

      <button
        type="button"
        onClick={() => onSearch(entry)}
        disabled={disabled}
        aria-label={`Search ${place} again`}
        className={cn(
          "border-input-border bg-input text-heading grid h-9 w-9 shrink-0 place-items-center",
          "rounded-full border transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50",
        )}
      >
        <SearchIcon className="h-4 w-4" />
      </button>

      <button
        type="button"
        onClick={() => onDelete(entry.id)}
        disabled={disabled}
        aria-label={`Remove ${place} from history`}
        className={cn(
          "border-input-border bg-input text-heading grid h-9 w-9 shrink-0 place-items-center",
          "rounded-full border transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50",
        )}
      >
        <TrashIcon className="h-4 w-4" />
      </button>
    </li>
  );
}
