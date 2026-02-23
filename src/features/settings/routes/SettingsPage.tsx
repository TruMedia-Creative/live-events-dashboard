import { useOutletContext } from "react-router-dom";
import type { AppShellOutletContext } from "../../../components/layout/AppShell";

export function SettingsPage() {
  const { theme, accentColor, setTheme, setAccentColor } =
    useOutletContext<AppShellOutletContext>();

  const cardClasses =
    theme === "dark"
      ? "rounded-lg border border-gray-700 bg-gray-800 p-6 shadow-sm"
      : "rounded-lg border border-gray-200 bg-white p-6 shadow-sm";
  const labelClasses =
    theme === "dark"
      ? "text-sm font-medium text-gray-200"
      : "text-sm font-medium text-gray-700";
  const helperTextClasses = theme === "dark" ? "text-sm text-gray-400" : "text-sm text-gray-500";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className={`mt-1 ${helperTextClasses}`}>
          Customize your workspace theme and overall accent color.
        </p>
      </div>

      <section className={cardClasses}>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <label className="space-y-2">
            <span className={labelClasses}>Theme</span>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value as "light" | "dark")}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </label>

          <label className="space-y-2">
            <span className={labelClasses}>Accent color</span>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                className="h-10 w-14 cursor-pointer rounded border border-gray-300 bg-white p-1"
              />
              <span className={helperTextClasses}>{accentColor.toUpperCase()}</span>
            </div>
          </label>
        </div>
      </section>

      <section className={cardClasses}>
        <h2 className="text-lg font-semibold">Preview</h2>
        <div className="mt-4 rounded-md border border-gray-300 p-4">
          <button
            type="button"
            style={{ backgroundColor: accentColor }}
            className="rounded-md px-4 py-2 text-sm font-medium text-white"
          >
            Sample Action
          </button>
        </div>
      </section>
    </div>
  );
}
