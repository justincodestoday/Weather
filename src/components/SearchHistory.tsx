import type { HistoryEntry } from "../types/weather";
import { SearchHistoryItem } from "./SearchHistoryItem";

interface SearchHistoryProps {
  entries: HistoryEntry[];
  onSearch: (entry: HistoryEntry) => void;
  onDelete: (id: string) => void;
  disabled: boolean;
}

export function SearchHistory({ entries, onSearch, onDelete, disabled }: SearchHistoryProps) {
  return (
    <div aria-label="Search history" className="bg-card mt-4 rounded-3xl p-4 sm:p-6">
      <h2 className="m-0 mb-3 text-base">Search History</h2>

      {entries.length === 0 ? (
        <p className="text-muted text-sm">Your recent searches will appear here.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {entries.map((entry) => (
            <SearchHistoryItem
              key={entry.id}
              entry={entry}
              onSearch={onSearch}
              onDelete={onDelete}
              disabled={disabled}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
