import './style.css';
import EIP712DomainSeparator from '../../components/EIP712DomainSeparator';
import EIP712MessageStruct from '../../components/EIP712MessageStruct';
import EIP712MessageData from '../../components/EIP712MessageData';
import EIP712ParamsAndSignature from '../../components/EIP712ParamsAndSignature';
import ErrorPopup from '../../components/ErrorPopup';
import useEIP712 from '../../hooks/useEIP712';

function EIP712() {
  const {
    error, setError,
    domainSeparator, setDomainSeparator,
    typedDataStructures, setTypedDataStructures,
    primaryType, setPrimaryType,
    message, setMessage,
    step, setStep,
    paramsAndSignature,
    signing
  } = useEIP712();

  if (error !== null) return <ErrorPopup error={error} setError={setError} />;

  return (
    <main className="page-container">
      <h2 className="page-subtitle">EIP712 Signing Tool</h2>
      <p className="page-description">
        This tool allows you to sign messages using the EIP712 standard.
      </p>
      <a
        className="external-link"
        href="https://eips.ethereum.org/EIPS/eip-712"
        target="_blank"
        rel="noopener noreferrer"
      >
        View EIP712 Standard ↗
      </a>

      {step == 0 && <EIP712ParamsAndSignature params={paramsAndSignature.params} signature={paramsAndSignature.signature} setStep={setStep} setParamsAndSignature={setMessage} />}
      {step == 1 && <EIP712DomainSeparator domainSeparator={domainSeparator} setDomainSeparator={setDomainSeparator} />}
      {step == 2 && <EIP712MessageStruct typedDataStructures={typedDataStructures} setTypedDataStructures={setTypedDataStructures} />}
      {step == 3 && <EIP712MessageData
        typedDataStructures={typedDataStructures}
        primaryType={primaryType}
        setPrimaryType={setPrimaryType}
        message={message}
        setMessage={setMessage}
      />}

      <div className="step-navigation">
        <button
          onClick={() => setStep(step - 1)}
          className="nav-button nav-button-back"
          disabled={step <= 1}
        >
          ← Back
        </button>

        {step !== 3 && <button
          onClick={() => setStep(step + 1)}
          className="nav-button nav-button-next"
        >
          Next →
        </button>}
        {step == 3 && <button onClick={signing} className="nav-button nav-button-next">Sign</button>}
      </div>

    </main>

  );
}

export default EIP712;
