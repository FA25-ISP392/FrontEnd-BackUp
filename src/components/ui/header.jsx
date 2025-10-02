import { Link, NavLink } from "react-router-dom";

export default function Header() {
  return (
    <header className="w-full border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2"
          aria-label="Go to home"
        >
          <span className="inline-block h-8 w-8 rounded bg-blue-600 text-white grid place-items-center font-bold">
            R
          </span>
          <span className="text-lg font-semibold">Restaurant</span>
        </Link>
        <nav className="flex items-center gap-1">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `px-3 py-2 rounded hover:bg-neutral-100 transition ${
                isActive ? "text-blue-600" : "text-neutral-700"
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/menu"
            className={({ isActive }) =>
              `px-3 py-2 rounded hover:bg-neutral-100 transition ${
                isActive ? "text-blue-600" : "text-neutral-700"
              }`
            }
          >
            Menu
          </NavLink>
          <NavLink
            to="/staff"
            className={({ isActive }) =>
              `px-3 py-2 rounded hover:bg-neutral-100 transition ${
                isActive ? "text-blue-600" : "text-neutral-700"
              }`
            }
          >
            Staff
          </NavLink>
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `px-3 py-2 rounded hover:bg-neutral-100 transition ${
                isActive ? "text-blue-600" : "text-neutral-700"
              }`
            }
          >
            Admin
          </NavLink>
          <NavLink
            to="/manager"
            className={({ isActive }) =>
              `px-3 py-2 rounded hover:bg-neutral-100 transition ${
                isActive ? "text-blue-600" : "text-neutral-700"
              }`
            }
          >
            Manager
          </NavLink>
          <NavLink
            to="/chef"
            className={({ isActive }) =>
              `px-3 py-2 rounded hover:bg-neutral-100 transition ${
                isActive ? "text-blue-600" : "text-neutral-700"
              }`
            }
          >
            Chef
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
