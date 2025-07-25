import './style.css';
import type { EIP712Domain } from '../../utils/Account';
function EIP712DomainSeparator({ domainSeparator, setDomainSeparator }: {
    domainSeparator: EIP712Domain;
    setDomainSeparator: React.Dispatch<React.SetStateAction<EIP712Domain>>
}) {

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setDomainSeparator(prev => ({
            ...prev,
            [name]: value
        }));
    }
    return (
        <div>
            <h3>Domain Separator</h3>
            <div className="eip712-form">
                <label>
                    Name:
                    <input type="text" name="name" required value={domainSeparator.name} onChange={handleChange} />
                    <small>Type: string</small>
                </label>
                <label>
                    Version:
                    <input type="text" name="version" required value={domainSeparator.version} onChange={handleChange} />
                    <small>Type: string</small>
                </label>
                <label>
                    Chain Id:
                    <input type="number" value={domainSeparator.chainId} readOnly />
                    <small>Type: uint256 (read-only)</small>
                </label>
                <label>
                    Verifying Contract:
                    <input type="text" name="verifyingContract" required value={domainSeparator.verifyingContract} onChange={handleChange} />
                    <small>Type: address</small>
                </label>
                <label>
                    Salt (Optional):
                    <input type="text" name="salt" value={domainSeparator.salt ? domainSeparator.salt : ""} onChange={handleChange} />
                    <small>Type: bytes32 (optional)</small>
                </label>
            </div>
        </div>

    );
}

export default EIP712DomainSeparator;
