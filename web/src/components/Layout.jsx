import { memo } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const links = [
  { to: "/", label: "Dashboard" },
  { to: "/products", label: "Produtos" },
  { to: "/history", label: "Historico" },
  { to: "/notifications", label: "Alertas" },
];

function LayoutComponent({ children }) {
  const { user, company, logout } = useAuth();

  return (
    <div className="shell">
      <aside className="sidebar">
        <div>
          <p className="eyebrow">Smart Market</p>
          <h1>Painel Administrativo</h1>
        </div>

        <nav className="nav">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className="nav-link">
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="user-card">
          <div>
            <strong>{user?.name}</strong>
            <p>{company?.name} - {user?.role}</p>
          </div>
          <button className="secondary-button" onClick={logout}>
            Sair
          </button>
        </div>
      </aside>

      <main className="content">{children}</main>
    </div>
  );
}

export const Layout = memo(LayoutComponent);
