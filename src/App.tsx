import { useRef, useState } from "react";
import { Searchbar } from "./components/Searchbar";
import { isValidCountryCode } from "./utils/countries";

const normaliseCountry = (value: string) => {
  return value
    .toUpperCase()
    .replace(/[^A-Z]/g, "")
    .slice(0, 2);
};

function App() {
  const apiKey = import.meta.env.VITE_OPENWEATHER_KEY;

  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  const handleSubmit = async (cityInput: string, countryInput: string) => {
    const cityValue = cityInput.trim();
    const countryCodeValue = normaliseCountry(countryInput);

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
      const data = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q='${cityValue}, ${countryCodeValue}'&appid=${apiKey}&units=metric`,
      );
      console.log("API response:", data);
    } catch (err) {
      setError("Error fetching data");
      console.error("Error fetching data");
    } finally {
      if (abortRef.current === controller) setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col gap-4 px-4 py-6">
      <footer className="text-muted mt-auto pt-4 text-center text-xs">
        Weather data from OpenWeather
      </footer>
    </div>
  );
}

export default App;
