import { cn } from "../utils/cn";
import { SearchIcon, SpinnerIcon } from "./icons";

interface SearchbarProps {
  city: string;
  country: string;
  onCityChange: (value: string) => void;
  onCountryChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export function Searchbar({
  city,
  country,
  onCityChange,
  onCountryChange,
  onSubmit,
  isLoading,
}: SearchbarProps) {
  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      aria-label="Search for weather"
      className="grid gap-3 sm:grid-cols-[1fr_10rem_auto] sm:items-start"
    >
      <div className="relative">
        <input
          id="city"
          name="city"
          type="text"
          value={city}
          onChange={(e) => onCityChange(e.target.value)}
          placeholder="City"
          disabled={isLoading}
          required
          className={cn(
            "peer border-input-border bg-input w-full rounded-2xl border px-4 pt-6 pb-2",
            "focus:border-accent placeholder-transparent transition outline-none",
            "disabled:cursor-not-allowed disabled:opacity-60",
          )}
        />
        <label
          htmlFor="city"
          className={cn(
            "text-label pointer-events-none absolute top-2 left-4 text-xs font-medium transition-all",
            "peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base",
            "peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-xs",
          )}
        >
          City
        </label>
      </div>

      <div className="relative">
        <input
          id="country"
          name="country"
          type="text"
          value={country}
          onChange={(e) => onCountryChange(e.target.value)}
          placeholder="Country"
          autoComplete="off"
          maxLength={2}
          disabled={isLoading}
          aria-describedby="country-hint"
          className={cn(
            "peer border-input-border bg-input w-full rounded-2xl border px-4 pt-6 pb-2",
            "focus:border-accent placeholder-transparent transition outline-none",
            "disabled:cursor-not-allowed disabled:opacity-60",
          )}
        />
        <label
          htmlFor="country"
          className={cn(
            "text-label pointer-events-none absolute top-2 left-4 text-xs font-medium transition-all",
            "peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base",
            "peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-xs",
          )}
        >
          Country
        </label>
        <span id="country-hint" className="sr-only">
          A two-letter ISO 3166 country code, such as MY for Malaysia.
        </span>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        aria-label="Search"
        className={cn(
          "bg-accent grid h-14 w-full place-items-center rounded-2xl text-white transition",
          "hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-70 sm:w-14",
        )}
      >
        {isLoading ? <SpinnerIcon className="h-8 w-8" /> : <SearchIcon className="h-8 w-8" />}
      </button>
    </form>
  );
}
