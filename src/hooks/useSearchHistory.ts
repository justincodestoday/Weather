import { useCallback, useEffect, useState } from "react";
import type { HistoryEntry } from "../types/weather";

const STORAGE_KEY = "weather.history";
const MAX_ENTRIES = 5;

type NewEntry = Pick<HistoryEntry, "city" | "countryCode">;

const duplicateEntry = (a: NewEntry, b: NewEntry): boolean =>
  a.city.toLowerCase() === b.city.toLowerCase() &&
  a.countryCode.toLowerCase() === b.countryCode.toLowerCase();

const readHistory = (): HistoryEntry[] => {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    console.warn("Could not read search history from localStorage.");
    return [];
  }
};

export function useSearchHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>(readHistory);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch {
      console.warn("Could not save search history to localStorage.");
    }
  }, [history]);

  const addEntry = useCallback((entry: HistoryEntry) => {
    const newEntry = {
      id: crypto.randomUUID(),
      city: entry.city,
      countryCode: entry.countryCode,
      searchedAt: Date.now(),
    };
    setHistory((current) =>
      [newEntry, ...current.filter((item) => !duplicateEntry(item, entry))].slice(0, MAX_ENTRIES),
    );
  }, []);

  const removeEntry = useCallback((id: string) => {
    setHistory((current) => current.filter((item) => item.id !== id));
  }, []);

  return { history, addEntry, removeEntry };
}
