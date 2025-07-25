import { Link } from "react-router-dom";
import './style.css';

function NotFound() {
  return (
    <div className="notfound-container">
      <h1 className="notfound-title">404 - Page Not Found</h1>
      <p className="notfound-text">Oops! The page you’re looking for doesn’t exist.</p>
      <Link to="/ethereum-utils" className="notfound-link">← Go back home</Link>
    </div>
  );
}

export default NotFound;
