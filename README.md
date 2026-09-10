# Weather

A React app that looks up the current weather for a city using the [OpenWeather API](https://openweathermap.org/api). Look at the assumptions at the end of this file for the UI behavior decisions.

## Features

- Search by **city name** and **ISO 3166-1 alpha-2 country code** (e.g. `Johor`, `MY`)
- Display the current temperature, daily high/low, humidity, weather condition, and the observation time shown in the **city's** timezone
- Show the 5 most recent searches in the **Search history** section. The searches can be run again or removed from the history.
- Toggle between **light** and **dark** theme.

## Getting started

Requires **Node 20+** and **pnpm**, so `npm install` will not work). Run the following line to enable pnpm in your terminal.

```bash
corepack enable
```

Install the modules.

```bash
pnpm install
```

Create a `.env` from the template and add your OpenWeather API key.

```bash
cp .env.example .env
# then edit .env:
# VITE_OPENWEATHER_API_KEY=your_key_here
```

Start the dev server (http://localhost:5173)

```bash
pnpm dev
```

## Scripts

| Command           | Description                                    |
| ----------------- | ---------------------------------------------- |
| `pnpm dev`        | Vite dev server with HMR                       |
| `pnpm build`      | Type-check (`tsc -b`) and build for production |
| `pnpm preview`    | Serve the production build locally             |
| `pnpm test`       | Run the unit tests once (Vitest)               |
| `pnpm test:watch` | Run the tests in watch mode                    |
| `pnpm lint`       | Lint with oxlint                               |
| `pnpm format`     | Format with Prettier                           |

## Tech Stack

- **React 19** + **TypeScript**, bundled with **Vite 8** (React Compiler enabled)
- **Tailwind CSS v4** for styling; theme colours are CSS custom properties
- **Vitest** + **jsdom** for tests, **oxlint** + **Prettier** for quality

## UI Behaviour Assumptions

UI assumptions and decisions are made during development of this Weather app.

### Search input

- **Two text fields — City and Country.** The mockup shows a single field,
  but the requirement says the user inputs city _and_ country, and the OpenWeather API needs both.
- Country is the **ISO 3166-1 alpha-2** code (e.g. `MY`); the field accepts only letters, max two characters, and its value is turned uppercase.

### Calling the API

- Endpoint: `GET https://api.openweathermap.org/data/2.5/weather?q={city},{country}&units=metric&appid={key}`.
- The key comes from `VITE_OPENWEATHER_API_KEY` (see `.env.example`).
- Units are **metric** (°C) as it is the conventional temperature unit.
- The city value is URL-encoded via the `URL` API, so names with spaces or
  non-ASCII characters work.
- A new search **aborts** any request still in flight, so a slow earlier
  response can't overwrite a newer one.
- The raw API response is `console.log`ed on every successful search for
  inspection.

### Loading

- The submit button shows a spinner; the city/country inputs, the submit
  button, and every history-row buttons are disabled until the request settles.
- A previously loaded weather card stays visible but dimmed (`opacity-60`,
  `aria-busy`) during a refresh.

### Errors (shown as text directly beneath the search bar)

| Situation                         | Message                                                     |
| --------------------------------- | ----------------------------------------------------------- |
| City field is empty               | Please enter a city name.                                   |
| Country not a valid ISO 3166 code | Please enter a valid country code.                          |
| API 400 / 404                     | No such city and country exist. Check the spelling.         |
| API 401 / 429 / 5xx               | Weather service is currently unavailable. Try again later.  |
| Network error or `fetch` failed   | Could not reach the weather service. Check your connection. |

- The message clears on the next submit and on any successful search.
- No inputs or invalid country code stops the search before any request is made.

### Weather conditions and icons

- `weather[0].main` from the API is one of: Thunderstorm, Drizzle, Rain, Snow,
  Clear, Clouds, Mist, Smoke, Haze, Dust, Fog, Sand, Ash, Squall, Tornado.
- Only two icons are supplied, so it is decided that: so the rule is deliberately total:
  - **`Clear` → Sun icon** (`sun.png`)
  - **everything else → Cloud icon** (`cloud.png`)
- The condition text displayed on the card is `weather[0].main` verbatim.

### Search history

- Persisted to `localStorage` under `weather.history`.
- Stores `{ id, city, countryCode, searchedAt }` — the API's canonical
  `name` / `sys.country`, written only **after** a successful search, so the
  list never contains junk input.
- Running a recent search fetches the data again.
- The searches are ordered **newest first**, and **capped at 5.**
- Duplicate searches are removed and the new one is prepended.
- The row's search button re-runs the search through the same submit path; the
  trash button removes just that row.
- The history panel is shown once there is a weather result on screen.
