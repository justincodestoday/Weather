import { useRef, useState } from "react";
import { Searchbar } from "./components/Searchbar";
import { WeatherCard } from "./components/WeatherCard";
import { isValidCountryCode, normaliseCountryCode } from "./utils/country";
import { cn } from "./utils/cn";
import type { WeatherDataResponse } from "./types/weather";
import { fetchCurrentWeather } from "./api/openweather";

function App() {
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");

  const [weather, setWeather] = useState<WeatherDataResponse | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  const handleSubmit = async () => {
    const cityValue = city.trim();
    const countryCodeValue = normaliseCountryCode(country);

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

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col gap-4 px-4 py-6">
      <div className={cn("flex flex-1 flex-col gap-28 sm:gap-24", !weather && "justify-center")}>
        <div>
          <Searchbar
            city={city}
            country={country}
            onCityChange={setCity}
            onCountryChange={(value) => setCountry(normaliseCountryCode(value))}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
          {error && (
            <p role="alert" className="mt-2 px-1 text-sm text-red-500">
              {error}
            </p>
          )}
        </div>

        {weather && (
          <main className="border-card-border bg-card rounded-3xl border p-5 backdrop-blur-[20px] sm:p-8">
            <WeatherCard weather={weather} isLoading={isLoading} />
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
