import type { WeatherDataResponse } from "../types/weather";
import { formatCityTime } from "../utils/formatDateTime";
import { WeatherIcon } from "./icons";

interface WeatherCardProps {
  weather: WeatherDataResponse | null;
  isLoading: boolean;
}

export function WeatherCard({ weather, isLoading }: WeatherCardProps) {
  if (!weather) {
    return (
      <div className="text-muted px-2 py-8 text-center">
        <h1 className="m-0 text-base">Today's Weather</h1>
        <p className="mt-2">Look up the weather in any city in the world.</p>
      </div>
    );
  }

  const condition = weather.weather[0];
  const place = `${weather.name}, ${weather.sys.country}`;

  return (
    <article
      aria-label={`Current weather for ${place}`}
      aria-busy={isLoading}
      className={`relative transition-opacity ${isLoading ? "opacity-60" : "opacity-100"}`}
    >
      <WeatherIcon
        condition={condition.main}
        label={condition.main}
        className="pointer-events-none absolute -top-24 -right-2 h-50 w-50 sm:-top-30 sm:h-70 sm:w-70"
      />

      <div className="relative">
        <h1 className="m-0 text-base">Today's Weather</h1>
        <p className="text-heading mt-2 text-lg font-semibold">{place}</p>
        <p className="text-accent dark:text-heading mt-1 text-6xl leading-none font-bold sm:text-7xl">
          {Math.round(weather.main.temp)}&deg;
        </p>

        <p className="text-muted mt-2 flex gap-2 text-sm">
          <span>H: {Math.round(weather.main.temp_max)}&deg;</span>
          <span>L: {Math.round(weather.main.temp_min)}&deg;</span>
        </p>

        <div className="text-muted mt-4 flex flex-wrap items-baseline gap-x-10 gap-y-1 text-sm">
          <p>
            <time dateTime={new Date(weather.dt * 1000).toISOString()}>
              {formatCityTime(weather.dt, weather.timezone)}
            </time>
          </p>
          <p>Humidity: {weather.main.humidity}%</p>
          <p>{condition.main}</p>
        </div>
      </div>
    </article>
  );
}
