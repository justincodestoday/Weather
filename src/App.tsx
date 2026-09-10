import { useRef, useState } from "react";
import { Searchbar } from "./components/Searchbar";
import { SearchHistory } from "./components/SearchHistory";
import { ThemeToggle } from "./components/ThemeToggle";
import { WeatherCard } from "./components/WeatherCard";
import { useSearchHistory } from "./hooks/useSearchHistory";
import { isValidCountryCode, normaliseCountryCode } from "./utils/country";
import { cn } from "./utils/cn";
import type { HistoryEntry, WeatherDataResponse } from "./types/weather";
import { fetchCurrentWeather } from "./api/openweather";

function App() {
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");

  const [weather, setWeather] = useState<WeatherDataResponse | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { history, addEntry, removeEntry } = useSearchHistory();

  const abortRef = useRef<AbortController | null>(null);

  const handleSubmit = async (cityInput: string = city, countryInput: string = country) => {
    const cityValue = cityInput.trim();
    const countryCodeValue = normaliseCountryCode(countryInput);

    if (!cityValue) {
      setError("Please enter a city name.");
      return;
    }

    if (!isValidCountryCode(countryCodeValue)) {
      setError("Please enter a valid country code.");
      return;
    }

    // To prevent multiple fetches occurring concurrently.
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setError(null);
    setIsLoading(true);

    try {
      const data = await fetchCurrentWeather(cityValue, countryCodeValue, controller.signal);
      console.log("API response:", data);
      setWeather(data);
      addEntry({ city: data.name, countryCode: data.sys.country });
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;

      const message =
        err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setError(message);
      console.error(err);
    } finally {
      if (abortRef.current === controller) setIsLoading(false);
    }
  };

  const handleHistorySearch = (entry: HistoryEntry) => {
    setCity(entry.city);
    setCountry(entry.countryCode);
    handleSubmit(entry.city, entry.countryCode);
  };

  const handleClear = () => {
    setCity("");
    setCountry("");
    setError(null);
  };

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col gap-4 px-4 py-6">
      <header className="flex items-center justify-end">
        <ThemeToggle />
      </header>

      <div
        className={cn(
          "flex flex-1 flex-col gap-28 sm:gap-24",
          history.length === 0 && "justify-center",
        )}
      >
        <div>
          <Searchbar
            city={city}
            country={country}
            onCityChange={setCity}
            onCountryChange={(value) => setCountry(normaliseCountryCode(value))}
            onSubmit={handleSubmit}
            onClear={handleClear}
            isLoading={isLoading}
          />
          {error && (
            <p role="alert" className="mt-2 px-1 text-sm text-red-500">
              {error}
            </p>
          )}
        </div>

        {history.length > 0 && (
          <main className="border-card-border bg-card rounded-3xl border p-5 backdrop-blur-[20px] sm:p-8">
            <WeatherCard weather={weather} isLoading={isLoading} />
            <SearchHistory
              entries={history}
              onSearch={handleHistorySearch}
              onDelete={removeEntry}
              disabled={isLoading}
            />
          </main>
        )}
      </div>

      <footer className="text-muted mt-auto text-center text-xs">
        Weather data from OpenWeather
      </footer>
    </div>
  );
}

export default App;
