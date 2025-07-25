import './style.css';
import { NavLink } from 'react-router-dom';
import Account from '../../utils/Account';
import { useState, useEffect } from 'react';


function AppBar({ account }: { account: Account }) {
  const [networkName, setNetworkName] = useState<string>('Unknown Network');
  const [address, setAddress] = useState<string>('0x');
  const [balance, setBalance] = useState<string>('0 ETH');
  useEffect(() => {
    const load = async () => {
      try {
        const _networkName = account.networkName || 'Unknown Network';
        const _address = await account.getPrettyAddress();
        const _balance = await account.getBalance();
        setNetworkName(_networkName);
        setAddress(_address);
        setBalance(_balance);
      } catch(error: any) {

      }
    }
    load();
  }, [account]);

  return (
    <header className="appbar">
      <div className="left-section">
        <div className="logo">Ethereum Utils</div>
        <div className="nav-links">
          <NavLink to="/ethereum-utils" end>Home</NavLink>
          <NavLink to="#">Features</NavLink>
          <NavLink to="#">Contact</NavLink>
        </div>
      </div>

      <div className="user-info">
        <div className="balances">
          <span><i>{networkName}</i> {balance}</span>
        </div>
        <div className="user-profile">
          <img src="https://teal-eldest-bear-843.mypinata.cloud/ipfs/bafkreihwwcruisr4626yhe2iiehyfonhjc2ftctt3jccxqi2oxfduwtgbe" alt="avatar" />
          <span>{address}</span>
        </div>
      </div>
    </header>
  );
}

export default AppBar;
