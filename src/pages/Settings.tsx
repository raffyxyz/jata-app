import { IconSun, IconMoon, IconUser, IconPalette, IconInfoCircle } from "@tabler/icons-react";
import { useTheme } from "../contexts/ThemeContext";

export function Settings() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">
            Manage your preferences and app configuration.
          </p>
        </div>
      </div>

      <div className="settings-sections">
        <div className="settings-section">
          <div className="settings-section-header">
            <IconPalette size={16} />
            <h2 className="settings-section-title">Appearance</h2>
          </div>
          <div className="settings-card">
            <div className="settings-row">
              <div className="settings-row-info">
                <span className="settings-row-label">Theme</span>
                <span className="settings-row-desc">
                  Switch between light and dark mode
                </span>
              </div>
              <button
                className={`theme-toggle ${theme}`}
                onClick={toggleTheme}
                aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
              >
                <span
                  className={`theme-toggle-thumb ${theme}`}
                />
                <IconSun size={14} className="theme-toggle-icon sun" />
                <IconMoon size={14} className="theme-toggle-icon moon" />
              </button>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <div className="settings-section-header">
            <IconUser size={16} />
            <h2 className="settings-section-title">Profile</h2>
          </div>
          <div className="settings-card">
            <div className="settings-row">
              <div className="settings-row-info">
                <span className="settings-row-label">Name</span>
                <span className="settings-row-desc">Alex Chen</span>
              </div>
            </div>
            <div className="settings-divider" />
            <div className="settings-row">
              <div className="settings-row-info">
                <span className="settings-row-label">Email</span>
                <span className="settings-row-desc">alex.chen@email.com</span>
              </div>
            </div>
            <div className="settings-divider" />
            <div className="settings-row">
              <div className="settings-row-info">
                <span className="settings-row-label">Title</span>
                <span className="settings-row-desc">
                  Senior Frontend Engineer
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <div className="settings-section-header">
            <IconInfoCircle size={16} />
            <h2 className="settings-section-title">About</h2>
          </div>
          <div className="settings-card">
            <div className="settings-row">
              <div className="settings-row-info">
                <span className="settings-row-label">App</span>
                <span className="settings-row-desc">jata — Job Tracker</span>
              </div>
            </div>
            <div className="settings-divider" />
            <div className="settings-row">
              <div className="settings-row-info">
                <span className="settings-row-label">Version</span>
                <span className="settings-row-desc">0.1.0</span>
              </div>
            </div>
            <div className="settings-divider" />
            <div className="settings-row">
              <div className="settings-row-info">
                <span className="settings-row-label">Stack</span>
                <span className="settings-row-desc">
                  Tauri + React + TypeScript
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
