export interface WeatherDataResponse {
  main: {
    temp: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
  };
  weather: { id: number; main: string }[];
  dt: number;
  timezone: number;
  sys: { country: string };
  name: string;
}

export interface HistoryEntry {
  id?: string;
  city: string;
  countryCode: string;
  searchedAt?: number;
}
