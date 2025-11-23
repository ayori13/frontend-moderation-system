import { NavLink, Outlet } from "react-router-dom";
import { useContext } from "react";
import { ThemeContext } from "./theme/ThemeContext";

function App() {
  const { theme, toggle } = useContext(ThemeContext);

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-logo">
          <span className="logo-circle logo-green" />
          <span className="logo-circle logo-blue" />
          <span className="logo-circle logo-red" />
          <span className="logo-circle logo-purple" />
          <span className="logo-title">Модерация объявлений Авито</span>
        </div>

        <nav className="app-nav">
          <NavLink
            to="/list"
            className={({ isActive }) =>
              "app-nav-link" + (isActive ? " app-nav-link_active" : "")
            }
          >
            Список
          </NavLink>
          <NavLink
            to="/stats"
            className={({ isActive }) =>
              "app-nav-link" + (isActive ? " app-nav-link_active" : "")
            }
          >
            Статистика
          </NavLink>
        </nav>

        <div className="app-user">
          <button
            onClick={toggle}
            className="theme-toggle-btn"
            aria-label="toggle theme"
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>

          <div className="app-user-avatar">M</div>
          <div className="app-user-name">Модератор</div>
        </div>
      </header>

      <main className="app-main">
        <div className="app-container">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default App;
