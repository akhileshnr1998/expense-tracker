import { NavLink } from 'react-router-dom';
import { signOut } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';

export default function AppLayout({ title, children }) {
  const { user } = useAuth();

  async function handleSignOut() {
    try {
      await signOut();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error.message);
    }
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">Coinfess</p>
          <h1>{title}</h1>
        </div>
        <div className="header-actions">
          <span className="user-chip">{user?.email}</span>
          <button className="button ghost" type="button" onClick={handleSignOut}>
            Sign out
          </button>
        </div>
      </header>
      <nav className="app-nav">
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : undefined}>
          Dashboard
        </NavLink>
        <NavLink to="/analytics" className={({ isActive }) => isActive ? 'active' : undefined}>
          Analytics
        </NavLink>
      </nav>
      <main className="app-main">
        {children}
      </main>
    </div>
  );
}
