import './style.css';

interface ErrorPopupProps {
  error: string;
  setError: React.Dispatch<React.SetStateAction<string | null>>
}

const ErrorPopup: React.FC<ErrorPopupProps> = ({ error, setError }) => {
  if (!error) return null;

  return (
    <div className="popup-overlay">
      <div className="popup">
        <h3>❌ Error</h3>
        <p>{error}</p>
        <button onClick={() => setError(null)}>Close</button>
      </div>
    </div>
  );
};

export default ErrorPopup;
