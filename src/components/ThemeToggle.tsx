import { useTheme } from "../hooks/useTheme";
import { MoonIcon, SunIcon } from "./icons";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      role="switch"
      aria-checked={isDark}
      aria-label={`Switch to ${theme === "light" ? "dark theme" : "light theme"}`}
      className={
        "border-input-border bg-input text-text-strong grid h-10 w-10 place-items-center rounded-full border backdrop-blur-[20px] " +
        "transition hover:brightness-105"
      }
    >
      {isDark ? <MoonIcon className="h-5 w-5" /> : <SunIcon className="h-5 w-5" />}
    </button>
  );
}
