import { useState, useEffect } from 'react';
import './style.css';
import EIP712DomainSeparator from '../../components/EIP712DomainSeparator';
import EIP712MessageStruct from '../../components/EIP712MessageStruct';
import EIP712MessageData from '../../components/EIP712MessageData';
import EIP712ParamsAndSignature from '../../components/EIP712ParamsAndSignature';
import type { EIP712Domain } from '../../utils/Account';
import { useWeb3Context } from '../../hooks/useWeb3Context';


function EIP712() {
  const { account } = useWeb3Context();
  const [domainSeparator, setDomainSeparator] = useState<EIP712Domain>({
    name: "",
    version: "",
    chainId: 0,
    verifyingContract: ""
  });

  const [typedDataStructures, setTypedDataStructures] = useState<Record<string, Array<{name: string, type: string}>>>({});
  const [primaryType, setPrimaryType] = useState<string>("");
  const [message, setMessage] = useState<Record<string, any>>({});
  const [step, setStep] = useState(1);

  const [paramsAndSignature, setParamsAndSignature] = useState<{ params: string, signature: string}>({params: "", signature: ""});

  const reset = (params: string, signature: string) => {
    setParamsAndSignature({ params, signature });
    setDomainSeparator({
      name: "",
      version: "",
      chainId: 0,
      verifyingContract: ""
    });
    setTypedDataStructures({});
    setPrimaryType("");
    setMessage({});
    setStep(0);
  }

  const signing = async () => {
    try {
      if (!account) throw new Error("No account available");
      const res = await account.signTypedData(domainSeparator, typedDataStructures, primaryType, message)

      if (!res[0] || !res[1]) {
        throw new Error("Signing failed");
      }
      reset(res[0], res[1]);
    } catch(e: any) {
      console.error(e);
    }
  }

  useEffect(() => {
    const load = async () => {
      try {
        if (!account) throw new Error("No account available");
        setDomainSeparator({
          ...domainSeparator,
          chainId: account.networkId,
        });
      } catch (error: unknown) {

      }
    }
    load();
  }, [account]);

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

      {step == 0 && paramsAndSignature.params && paramsAndSignature.signature && <EIP712ParamsAndSignature params={paramsAndSignature.params} signature={paramsAndSignature.signature} setStep={setStep} setParamsAndSignature={setMessage}/>}

      {step == 1 && <EIP712DomainSeparator domainSeparator={domainSeparator} setDomainSeparator={setDomainSeparator} />}
      {step == 2 && <EIP712MessageStruct typedDataStructures={typedDataStructures} setTypedDataStructures={setTypedDataStructures}/>}
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
          disabled={step === 1}
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
