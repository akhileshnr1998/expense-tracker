import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <p className="eyebrow">404</p>
          <h1>Page not found</h1>
          <p>The page you are looking for does not exist.</p>
        </div>
        <Link className="button primary" to="/dashboard">
          Go to dashboard
        </Link>
      </div>
    </div>
  );
}
