import type { WeatherDataResponse } from "../types/weather";

const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY as string;

export const fetchCurrentWeather = async (city: string, country: string, signal?: AbortSignal) => {
  if (!API_KEY) {
    console.error("Missing OpenWeather API key.");
  }

  const url = new URL(BASE_URL);
  url.searchParams.set("q", `${city},${country}`);
  url.searchParams.set("units", "metric");
  url.searchParams.set("appid", API_KEY);

  let response: Response;
  try {
    response = await fetch(url, { signal });
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") throw err;
    throw new Error("Could not reach the weather service. Check your connection.");
  }

  if (!response.ok) {
    if (response.status === 404 || response.status === 400) {
      throw new Error("No such city and country exist. Check the spelling.");
    }
    console.error("Network failure.");
    throw new Error("Weather service is currently unavailable. Try again later.");
  }

  const data = (await response.json()) as WeatherDataResponse;
  return data;
};
