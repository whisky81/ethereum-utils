import { Link } from "react-router-dom";
import './style.css';

function Home() {
  return (
    <main className="page-container">
      <h1 className="page-title">Available Utils</h1>
      <div className="tool-list">
        <Link to="/ethereum-utils/eip712" className="tool-link">EIP712 Signing</Link>
        <Link to="/ethereum-utils/cross-chain-bridge" className="tool-link">Cross-Chain Bridge</Link>
      </div>
    </main>
  );
}

export default Home;
