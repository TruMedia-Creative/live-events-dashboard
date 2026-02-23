import { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { useTenant } from "../../features/tenants";
import { hasAccessibleContrast } from "../../lib/colorContrast";

type AppTheme = "light" | "dark";

export interface AppShellOutletContext {
  theme: AppTheme;
  accentColor: string;
  setTheme: (theme: AppTheme) => void;
  setAccentColor: (color: string) => void;
}

function persistSetting(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    return;
  }
}

export function AppShell() {
  const { tenant } = useTenant();
  const [theme, setTheme] = useState<AppTheme>(() => {
    if (typeof window === "undefined") return "light";
    return window.localStorage.getItem("app.theme") === "dark" ? "dark" : "light";
  });
  const [accentColor, setAccentColor] = useState(() => {
    if (typeof window === "undefined") return "#4F46E5";
    return window.localStorage.getItem("app.accentColor") ?? "#4F46E5";
  });

  useEffect(() => {
    persistSetting("app.theme", theme);
  }, [theme]);

  useEffect(() => {
    persistSetting("app.accentColor", accentColor);
  }, [accentColor]);

  const isDark = theme === "dark";
  const shellClasses = isDark
    ? "min-h-screen bg-gray-900 text-gray-100"
    : "min-h-screen bg-gray-50 text-gray-900";
  const headerClasses = isDark
    ? "border-b border-gray-700 bg-gray-800 shadow-sm"
    : "border-b border-gray-200 bg-white shadow-sm";
  const linkClasses = isDark
    ? "text-sm font-medium text-gray-300 hover:text-white"
    : "text-sm font-medium text-gray-600 hover:text-gray-900";
  const shellBackgroundHex = isDark ? "#111827" : "#F9FAFB";
  const brandTextColor = hasAccessibleContrast(
    accentColor,
    shellBackgroundHex,
  )
    ? accentColor
    : undefined;

  return (
    <div className={shellClasses}>
      <header className={headerClasses}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              {tenant?.branding.logoUrl ? (
                <img
                  src={tenant.branding.logoUrl}
                  alt={tenant.name}
                  className="h-8"
                />
              ) : (
                <span className="text-xl font-bold" style={{ color: brandTextColor }}>
                  {tenant?.name ?? "ShowPro"}
                </span>
              )}
            </div>
            <nav className="flex items-center gap-6">
              <Link to="/" className={linkClasses}>
                Dashboard
              </Link>
              <Link to="/events" className={linkClasses}>
                Events
              </Link>
              <Link to="/admin" className={linkClasses}>
                Admin
              </Link>
              <Link to="/settings" className={linkClasses}>
                Settings
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet context={{ theme, accentColor, setTheme, setAccentColor }} />
      </main>
    </div>
  );
}
